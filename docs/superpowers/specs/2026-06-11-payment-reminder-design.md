# Design: Automatický reminder na nedokončenou platbu

**Date:** 2026-06-11
**Status:** Approved (brainstorming)
**Scope:** KV (a obecně všechny interní/non-DDM) registrace s nedokončenou platbou.

## Problém

Když si rodič založí registraci na tábor (tabulka `registrations`), ale nedokončí
platbu přes Comgate, zůstane řádek ve stavu `payment_status = 'pending'` napořád.
Místo po 60 minutách přestane blokovat kapacitu (migrace 016), ale zákazník nedostane
žádné připomenutí, že platba není hotová. Dnes se to řeší ručně (viz registrace
Prygushina, 2026-06-11).

Cíl: ~24 h po vytvoření nezaplacené registrace odejít **jednou** automaticky
upomínkový e-mail s odkazem na dokončení platby.

## Rozhodnutí (z brainstormingu)

- **Časování:** ~24 h po `created_at`.
- **Počet:** jeden reminder (YAGNI; sérii lze přidat později).
- **Cílení podle stavu:** jen `payment_status = 'pending'` a `status = 'pending'`
  — vynechat explicitně zrušené na bráně (`status = 'cancelled'`) i zaplacené.

## Architektura

Recykluje existující vzor použitý v `nastupni-list` a v potvrzovacím e-mailu:
**cron route + `CRON_SECRET` guard + atomický claim přes `*_sent_at` sloupec**.

### 1. Datový model — migrace `017_registrations_payment_reminder.sql`

Přidá sloupec:

```sql
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS payment_reminder_sent_at TIMESTAMPTZ;
```

Slouží jako idempotentní zámek (stejně jako `confirmation_sent_at`,
`nastupni_sent_at`). `NULL` = ještě neupomenuto.

### 2. Email template — `buildPaymentReminderEmail` v `src/lib/email.ts`

Čistá, testovatelná funkce (jako `buildConfirmationEmail` / `buildNastupniListEmail`),
recykluje `layout()`. Parametry: `childName`, `programName`, `termLabel`, `priceKc`,
`paymentUrl`.

Odesílatel: `info@weeks.cz` (default `RESEND_FROM`), reply-to `info@weeks.cz` —
konzistentní s potvrzením a nástupním listem.

Odkaz na dokončení platby: `https://weeks.cz/platba/{id}?location={location_id}`.
Stránka `/platba/[id]` → `PaymentRedirect` → `POST /api/payment/comgate/create`,
který vyrobí čerstvou Comgate transakci (funguje i když `comgate_payment_id` je `NULL`).

Cena se bere ze server-side configu přes `getTrustedPriceKc(location_id, program)` —
stejný zdroj, jaký účtuje `comgate/create`, takže částka v mailu vždy sedí s tím,
co bude naúčtováno. Termín přes `formatTermLabel(term_start, term_end)`, název
programu/lokace přes `getLocationById`.

Kopie (schváleno):

> Předmět: Dokončení registrace – {programName}
>
> Dobrý den,
>
> děkujeme za zájem o náš {programName} v {locationName}. Registraci pro
> {childName} máme rozepsanou, ale zatím u ní nevidíme dokončenou platbu — a místo
> se rezervuje až po zaplacení (volná místa se obsazují průběžně).
>
> Dokončit ji můžete jedním kliknutím:
> → [Dokončit platbu]({paymentUrl})
>
> Termín: {termLabel} · {priceKc} Kč
>
> Pokud už o místo nemáte zájem, nic neřešte — stačí tento e-mail ignorovat.
>
> S pozdravem, tým Weeks

### 3. Cron route — `src/app/api/cron/payment-reminder/route.ts`

Struktura kopíruje `src/app/api/cron/nastupni-list/route.ts`:

1. Guard: `Authorization: Bearer ${CRON_SECRET}`, fail-closed když `CRON_SECRET` chybí.
2. Guard: `isEmailConfigured()`.
3. Dotaz na kandidáty:
   - `payment_status = 'pending'`
   - `status = 'pending'` (vynechá `cancelled`, `paid`, `confirmed`)
   - `payment_reminder_sent_at IS NULL`
   - `created_at <= now − 24 h` (prodleva)
   - `created_at >= now − 7 dní` (nebackfillovat staré opuštěné řádky)
   - `term_start >= dnes` (neupomínat tábor, který už začal)
4. Pro každého kandidáta: **atomicky zabrat** `payment_reminder_sent_at = now()`
   tam, kde je `IS NULL` (guard proti dvojímu odeslání při překryvu cronů).
   Pokud claim nevrátí řádek → přeskočit.
5. Sestavit a poslat e-mail. Při chybě odeslání **uvolnit claim**
   (`payment_reminder_sent_at = NULL`), ať příští běh zkusí znovu.
6. Vrátit `{ ok, window, candidates, sent, failed }`.

### 4. Schedule — `vercel.json`

Přidat 3. cron, denně:

```json
{ "path": "/api/cron/payment-reminder", "schedule": "0 9 * * *" }
```

Denní běh + práh 24 h = reálná prodleva 24–48 h (podle času vytvoření v rámci dne),
což pro „~24 h" stačí. Pro těsnější prodlevu lze frekvenci zvýšit na `0 */6 * * *`
bez jiných změn.

## Hranice / edge cases

- **Idempotence:** atomický claim na `payment_reminder_sent_at` zaručí max 1 mail
  na registraci, i při souběžných bězích cronu.
- **Kapacita:** kopie je pravdivá — pending >60 min už místo nedrží (migrace 016),
  proto „místo se rezervuje až po zaplacení" a žádný falešný deadline.
- **GDPR:** transakční mail (zákazník sám založil objednávku) → posílá se bez ohledu
  na `marketing_consent`.
- **Zaplatí mezitím:** jakmile dorazí Comgate callback, `payment_status` → `completed`
  a `status` → `paid`, takže kandidát z výběru vypadne i kdyby ještě nebyl upomenut.
- **Zruší na bráně:** `status = 'cancelled'` → mimo výběr, neupomínáme.

## Testy (TDD)

- `buildPaymentReminderEmail` — unit testy v `src/lib/email.test.ts`:
  - předmět obsahuje název programu,
  - HTML obsahuje `paymentUrl` (správné `id`),
  - HTML obsahuje cenu a termín.
- Parita s existujícím pokrytím (route logiku se Supabase netestujeme jednotkově —
  stejně jako stávající crony).

## Dotčené soubory

| Soubor | Změna |
|---|---|
| `supabase/migrations/017_registrations_payment_reminder.sql` | nový — přidá sloupec |
| `src/lib/email.ts` | + `buildPaymentReminderEmail` |
| `src/lib/email.test.ts` | + testy template |
| `src/app/api/cron/payment-reminder/route.ts` | nová cron route |
| `vercel.json` | + 3. cron entry |

## Mimo rozsah (YAGNI)

- Druhý/třetí reminder (série).
- Upomínání explicitně zrušených registrací.
- Konfigurovatelná prodleva přes env (zatím konstanta v kódu).
