# Comgate platební integrace + povinné náležitosti e-shopu

**Datum:** 2026-05-30
**Stav:** Návrh schválen, čeká na implementační plán
**Kontext:** Comgate spustil platební bránu v testovacím režimu a zaslal požadavky pro spuštění ostrých plateb (funkční proces objednávky k otestování + povinné právní náležitosti na ostré URL). Tento spec pokrývá nahrazení mock platby reálnou Comgate integrací a doplnění/opravu právních stránek.

---

## 1. Cíl

Umožnit Comgate ověřit a následně spustit reálné příjímání plateb pro IT tábory Weeks v Karlových Varech (provozovatel **Lukáš Kubík, OSVČ, IČ 24878511**), které se prodávají přes vlastní registračně-platební systém na `weeks.cz/karlovy-vary`.

### Comgate požadavky → pokrytí
1. **Funkční proces objednávky k otestování** (vytvoření testovacího zákonného zástupce → průchod objednávkou) → reálná Comgate integrace (sekce 3) + zpřístupnění flow přes basic-auth creds (sekce 4).
2. **GDPR + VOP na ostré URL** s názvem firmy, adresou dle OR a IČ → KV právní stránky (už existují, doplníme) + zveřejnění zpod basic authu (sekce 4, 5).
3. **Uvést Comgate jako provozovatele platební služby** → doplnění do VOP (sekce 5).

---

## 2. Rozhodnutí (z brainstormingu 2026-05-30)

| # | Rozhodnutí |
|---|-----------|
| 1 | Comgate merchant ID + secret jsou v Klientském portálu (najdeme je); integrace je čte z env vars, secret nikdy v repu. Otestujeme v test režimu. |
| 2 | **Jen zrychlený bankovní převod** (Comgate Risk karty neschválil). Kód připravený na pozdější zapnutí karet přes konfigurační proměnnou — není priorita. |
| 3 | Provozovatel platební služby = **Comgate a.s., IČ 27924505, DIČ CZ27924505, Gočárova třída 1754/48b, Pražské Předměstí, 500 02 Hradec Králové** (ověřeno v ARES i v podepsané smlouvě). |
| 4 | Přístup pro Comgate: **právní stránky veřejné** (zpod authu), objednávkový flow zůstává za basic authem, Comgate dostane creds. |
| 5 | Pražské `/gdpr` + `/podminky`: doplnit odkaz na KV podmínky + zmírnit absolutní tvrzení „není e-shop / žádné platby". |
| 6 | Mock platby (`api/payment/mock` + `PaymentMock.tsx`) **smazat úplně**. |
| 7 | SQL pro nový DB sloupec **připravit k ručnímu spuštění** (tabulku `registrations` spravuje weeks-hub, do jeho migrací nezasahujeme). |
| 8 | Architektura platby: **varianta C** — callback jako zdroj pravdy + ověření přes `status` na návratové stránce. |

### Ověřené identity (ARES, 2026-05-30)
- **Lukáš Kubík** — IČ 24878511, sídlo Kováříkova 1145/11, **Hlubočepy**, 152 00 Praha 5, FO podnikající (forma 101), aktivní. (Na KV stránkách doplnit „Hlubočepy" pro přesnost dle OR.)
- **Comgate a.s.** — IČ 27924505, Gočárova třída 1754/48b, Pražské Předměstí, 500 02 Hradec Králové, a.s. (forma 121), aktivní.

---

## 3. Platební flow (varianta C)

Stávající flow beze změny až po vytvoření registrace: formulář → `POST /api/register` → záznam v Supabase `registrations` se `status='pending'`, `payment_status='pending'` → vrací `/platba/[id]`.

Nově od `/platba/[id]`:

```
/platba/[id]  (PaymentRedirect místo PaymentMock)
   → POST /api/payment/comgate/create
        • server odvodí cenu z důvěryhodného zdroje (typ tábora → lib/locations/DB), NE od klienta
        • zavolá Comgate create (prepareOnly=true, test dle env, method dle env)
        • uloží comgate_trans_id k registraci, payment_status='pending'
        • vrátí redirect URL brány
   → prohlížeč redirect na Comgate bránu (výběr banky, bankovní převod)
        ┌─ Comgate → POST /api/payment/comgate/callback   (VEŘEJNÉ — zdroj pravdy)
        │     • ověří identitu/parametry, zavolá Comgate status
        │     • nastaví payment_status = paid | cancelled, payment_completed_at, status
        │     • odpoví "code=0&message=OK" (HTTP 200)
        └─ zákazník → návrat na /registrace/[id]
              • stránka zavolá GET /api/payment/comgate/status?id=…
              • paid → potvrzení / pending → "platbu ověřujeme" / cancelled → možnost zkusit znovu
```

**Klíčové principy:**
- **Cena vždy server-side.** Comgate přijímá cenu v **haléřích** jako integer (2 990 Kč → `299000`, 1 490 Kč → `149000`). Cenu odvozujeme serverově z typu tábora, nikdy z hodnoty od klienta (jinak by šla v requestu přepsat).
- **Callback je zdroj pravdy.** Stav platby v DB nastavuje callback (server-to-server), ne návrat prohlížeče — odolné vůči zavření tabu po zaplacení.
- **Idempotence callbacku.** Comgate může callback poslat víckrát; zpracování musí být idempotentní (opakované `paid` nic nerozbije).
- **Ověření callbacku.** Callback ověřit voláním Comgate `status` (nedůvěřovat slepě parametrům v requestu).

---

## 4. Soubory a datový model

### Nové soubory
- `src/lib/comgate.ts` — **server-only** klient izolující veškerou znalost Comgate protokolu: `createPayment()`, `getStatus()`, mapování stavů (`PAID|CANCELLED|PENDING` → interní), čtení env. Jediné místo, které ví, jak Comgate API vypadá.
- `src/app/api/payment/comgate/create/route.ts` — vytvoří platbu, uloží `transId`, vrátí redirect URL. (Za basic authem.)
- `src/app/api/payment/comgate/callback/route.ts` — server-to-server notifikace od Comgate. (Veřejné.)
- `src/app/api/payment/comgate/status/route.ts` — dotaz na stav pro návratovou stránku. (Veřejné.)
- `src/components/registration/PaymentRedirect.tsx` — nahradí `PaymentMock` na `/platba/[id]`: tlačítko „Přejít k platbě" + stavové hlášky.

### Změněné soubory
- `src/app/platba/[id]/page.tsx` — použít `PaymentRedirect`.
- `src/app/registrace/[id]/page.tsx` + `RegistrationConfirmation` — číst reálný stav přes status endpoint; **opravit zavádějící text** „Potvrzení jsme odeslali na email" (žádné e-maily se zatím neposílají).
- `src/middleware.ts` — viz sekce 5.
- KV `/podminky`, KV `/gdpr`, pražské `/podminky`, pražské `/gdpr` — viz sekce 6.

### Smazat
- `src/app/api/payment/mock/route.ts`
- `src/components/registration/PaymentMock.tsx`

### Datový model — `registrations` (Supabase)
**OPRAVA (implementace 2026-05-30):** Žádný nový sloupec ani ruční SQL **není potřeba**. Migrace `supabase/migrations/010_registrations_kv.sql` (od týmu, součást KV expanze) už přidává `comgate_payment_id text` (+ partial unique index) a `comgate_status text`. Kód proto používá tyto existující sloupce — `comgate_payment_id` pro transId a `comgate_status` pro surový stav z Comgate. Stávající `payment_status`, `payment_method`, `payment_completed_at`, `status` zůstávají.

(Původní návrh počítal s novým sloupcem `comgate_trans_id` + ručním SQL — to bylo při implementaci zrušeno jako zbytečné.)

---

## 5. Middleware & přístup

Úprava `src/middleware.ts` — rozdělení na úrovni konkrétních cest:

**Veřejné (vyjmout z ochrany):**
- `/karlovy-vary/gdpr`, `/karlovy-vary/podminky` (povinné náležitosti pro Comgate)
- `/api/payment/comgate/callback` (volá Comgate server — nemá basic-auth hlavičku)
- `/api/payment/comgate/status` (volá se po návratu z brány)

**Za basic authem (ponechat):**
- zbytek `/karlovy-vary/*`, `/registrace`, `/platba`, `/api/register`, `/api/payment/comgate/create`

Comgate dostane basic-auth creds pro průchod objednávkou. Po ostrém launchi se smažou `PREVIEW_AUTH_*` env vars a vše zveřejní (beze změny kódu).

**Past, kterou to řeší:** dnes je celý prefix `/api/payment` *chráněný* — to by Comgate callback rozbilo. Proto dělíme podle konkrétních cest, ne podle prefixu.

---

## 6. Obsahové / právní úpravy

- **KV `/podminky` §6 (Platební podmínky):**
  - Platba = „zrychlený bankovní převod prostřednictvím platební brány Comgate". Vyhodit kartu/Apple Pay/Google Pay.
  - Doplnit provozovatele platební služby: *Comgate a.s., IČ 27924505, DIČ CZ27924505, Gočárova třída 1754/48b, Pražské Předměstí, 500 02 Hradec Králové.*
- **KV `/podminky` §10:** opravit odkaz `/gdpr` → `/karlovy-vary/gdpr`.
- **KV `/podminky` §2 + §15 a KV `/gdpr` kontakt:** doplnit sídlo pořadatele o „Hlubočepy" (přesně dle OR).
- **KV `/gdpr` §8 (zpracovatelé):** přidat „Comgate a.s. — provozovatel platební brány (zpracování platby)".
- **Pražské `/podminky` + `/gdpr`:** zmírnit absolutní tvrzení „Tento Web není e-shop a neuskutečňují se na něm žádné platby" + krátká poznámka s odkazem, že pro tábory v Karlových Varech platí samostatné VOP/GDPR provozované Lukášem Kubíkem (OSVČ, IČ 24878511).

---

## 7. Konfigurace (env vars)

```
COMGATE_MERCHANT=...        # identifikátor obchodu z Klientského portálu
COMGATE_SECRET=...          # heslo pro propojení — JEN server-side, nikdy v repu
COMGATE_TEST=true           # test režim → false při ostrém spuštění
COMGATE_METHOD=BANK_ALL     # zatím bankovní převody; karty = změna této hodnoty
```
(Stávající `PREVIEW_AUTH_USER` / `PREVIEW_AUTH_PASS` beze změny.)

Pozn.: přesný název hodnoty pro `COMGATE_METHOD` (bankovní převody) a verze endpointu se ověří proti `apidoc.comgate.cz` při implementaci.

---

## 8. Testování

- **Unit (`lib/comgate.ts`, TDD):** sestavení create requestu — zejména cena v haléřích; parsování odpovědi; mapování stavů; ověření identity/parametrů callbacku.
- **Integrační (mock Comgate HTTP):** create uloží `transId`; callback nastaví `paid` idempotentně; status vrací stav; cena se bere server-side, ne od klienta.
- **Middleware:** callback + status + KV právní stránky veřejné (200 bez creds); zbytek 401 bez creds.
- **Manuální E2E v test režimu** (po doplnění env): registrace → brána → návrat; ověřit i scénář „zavřený tab po zaplacení" → DB stejně `paid` díky callbacku.

---

## 9. Out of scope (YAGNI — pozdější iterace)
- Odesílání potvrzovacích e-mailů a nástupních listů (proto se opravuje zavádějící text o e-mailu).
- Generování faktur / daňových dokladů.
- Admin UI pro refundace / storna.
- Platby kartou (jen příprava přepínače `COMGATE_METHOD`).

---

## 10. Otevřené závislosti (ne blokery návrhu)
- Comgate merchant ID + secret z Klientského portálu (Obchod → Nastavení obchodu → Propojení/Napojení e-shopu).
- Ruční spuštění SQL ze sekce 4 v Supabase.
- Ověření přesných Comgate kódů metod / verze endpointu proti apidoc.comgate.cz.
- Předání basic-auth creds Comgate kontrolorovi.
