# Záloha + doplatek na turnusy (léto 2027)

Stav: odsouhlaseno Lukášem 2. 11. 2026 (včetně bodů ⚑) · vychází z grillingu 26. 10. 2026,
odsouhlaseno týmem na poradě 27. 10. beze změny čísel.

## Proč

5 990 Kč devět měsíců dopředu odrazuje. Rodiče se přihlásí, nezaplatí a
zapomenou (případ 23. 10.: přihláška na `kv-2027-cervenec` visela na platbě
a skončila zrušením). Běžná praxe příměstských táborů je záloha 1–2 tis. a
doplatek do konce května.

## Co rodič uvidí

- **Stránka termínu** (`NakupniBox`): pod cenou řádek „nebo záloha 2 000 Kč,
  doplatek do 31. 5. 2027“ a „Zrušení zdarma do 26. 6. 2027“ (srpen: 3. 7.).
  Datum = začátek turnusu − 30 dní, protože 0 % storno platí od 30 dnů výš
  (VOP čl. 22).
- **Poslední krok přihlášky** (souhrn): volba plánu, výchozí **záloha**:
  - ◉ Záloha 2 000 Kč teď, doplatek 3 990 Kč do 31. 5. 2027
  - ○ Celá částka 5 990 Kč
  Po `doplatekDo` se volba nezobrazí a platí jen plná platba.
- **`/platba/{id}`**: dokud není nic zaplaceno, stejná volba (předvybraná
  podle přihlášky). Pomůže to i přihláškám, které visí na platbě: rodič si
  zálohu vybere sám a bez zásahu do DB. Po zaplacení zálohy ukazuje stránka
  jen „Doplatek 3 990 Kč“. Po plném zaplacení vrací jako dnes 409 „už
  zaplaceno“.
- **E-maily**:
  - přihláška přijata: cena + „nebo záloha 2 000 Kč“,
  - potvrzení po první platbě: „Uhrazeno 2 000 Kč · zbývá 3 990 Kč do
    31. 5. 2027“ + odkaz na doplatek,
  - nový e-mail „Doplatek přijat“,
  - připomínky doplatku 14 a 3 dny před `doplatekDo`,
  - den po `doplatekDo` upozornění týmu na admin@weeks.cz. Dál se řeší ručně.

## Data

`src/lib/turnusy.ts`: nové volitelné pole na turnusu
`zaloha?: { castkaKc: number; doplatekDo: string }`. Oba KV turnusy dostanou
`{ castkaKc: 2000, doplatekDo: '2027-05-31' }`. Validace: `0 < castkaKc <
priceKc` a `doplatekDo < start`. Helper `zalohaDostupna(turnus, dnes)` vrací
true, když je záloha nastavená a `dnes <= doplatekDo`.

Migrace **021** `021_registrations_zaloha.sql`. Číslo 020 je obsazené
nenasazenou větví `feat/turnusy-z-hubu` a obě migrace jsou na sobě nezávislé.
Migrace dělá tohle:
- `payment_status` CHECK rozšíří o `'partial'`,
- `registrations.payment_plan text NOT NULL DEFAULT 'plna' CHECK (payment_plan IN ('plna','zaloha'))`;
  existující řádky dostanou `plna`, takže na ně se nesahá,
- sloupce pro idempotentní připomínky: `doplatek_reminder_14_at`, `doplatek_reminder_3_at`, `doplatek_overdue_alert_at` (timestamptz),
- tabulka `registration_payments`: `id uuid pk`, `registration_id uuid fk → registrations on delete cascade`,
  `kind text CHECK IN ('plna','zaloha','doplatek')`, `amount_kc int > 0`,
  `comgate_trans_id text UNIQUE NOT NULL`, `status text CHECK IN ('pending','paid','cancelled','refunded') DEFAULT 'pending'`,
  `paid_at timestamptz`, `fakturoid_invoice_id text`, `created_at timestamptz default now()`.
  Zapnuté RLS bez policies, takže k tabulce se dostane jen service role,
- `create_registration()` se nahradí: přijme `payment_plan` z payloadu a místo
  v kapacitě drží `payment_status IN ('completed','partial')` nebo čerstvá
  pending platba (< 60 min). Stejné pravidlo musí platit i v
  `/api/term-capacity` a v hubu.

`payment_amount` zůstává **plná cena** a určuje, kdy je zaplaceno vše.

## Tok platby

**`/api/payment/comgate/create`** přijme `{ registrationId, plan? }`:
1. `completed` → 409 (beze změny).
2. `partial` → druh `doplatek`, částka = `payment_amount − součet zaplacených řádků`.
3. `pending` → plán = `plan` z těla (validovaný), jinak `registration.payment_plan`.
   Když `zalohaDostupna` neplatí (po termínu nebo turnus bez zálohy), přepne se na `plna`.
   Zvolený plán se uloží na registraci.
   **Kontrola kapacity znovu** (oprava díry z grillingu): spočítají se ostatní
   registrace, které drží místo (bez té právě placené). Když je plno → 409
   `capacityFull`. Kontroluje se jen u první platby, u doplatku ne.
4. Vytvoří se transakce v Comgate (refId = id registrace, label
   „Weeks tábor – záloha/doplatek – jméno dítěte“), vloží se řádek do
   `registration_payments` a **zároveň** se `registrations.comgate_payment_id`
   přepíše na tohle transId. Hub ho zobrazuje a stávající ochrana proti
   zastaralému callbacku pak funguje dál.

**GET `/api/payment/comgate/create?registrationId=`** (nové) vrací jen
`{ stav, plan, castky: { plna, zaloha, doplatek }, doplatekDo }` a žádná
osobní data. Stránka `/platba` z toho vykreslí volbu.

**Callback**: hledá nejdřív v `registration_payments` podle `transId`, když
tam nic není, použije legacy cestu (`registrations.comgate_payment_id`, dnešní
kód beze změny). U nové cesty:
- aktualizuje řádek platby (`paid` / `cancelled` / `pending`),
- přepočítá `payment_status`: součet `paid` ≥ `payment_amount` → `completed`
  + `status='paid'`; jinak, když je něco zaplaceno, → `partial`
  + `status='confirmed'` (místo je jisté, ale nedoplacené). U `cancelled`
  se registrace ruší jen tehdy, když ještě nic zaplaceno nebylo. Zrušený
  doplatek nesmí zrušit přihlášku se zaplacenou zálohou.
- faktura **per řádek** (atomický claim na `registration_payments.fakturoid_invoice_id`),
  položka „Záloha na …“ / „Doplatek …“ / dnešní text u plné platby. První
  vystavená faktura se navíc zapíše do `registrations.fakturoid_invoice_id`,
  kde ji čte hub,
- potvrzovací e-mail jen u první platby (dnešní claim na
  `confirmation_sent_at`), „Doplatek přijat“ u doplatku,
- Meta `Purchase` jen u první zaplacené platby, s hodnotou plné ceny.
  Doplatek konverzi neposílá.

**Přihláška** (`/api/register` + `registrationSchema`): přijme volitelné
`payment_plan` (`plna|zaloha`, výchozí `zaloha`). Server ho přepne na `plna`,
když `zalohaDostupna` neplatí, a pošle ho do `create_registration`.

**Potvrzovací stránka**: `/api/registration/[id]` navíc vrací `payment_plan`.
`partial` se bere jako úspěch („Záloha přijata“).
Prohlížečový Purchase/GA purchase se odpálí jen při `(plna && completed)` nebo
`(zaloha && partial)`, takže návrat po doplatku konverzi znovu nezapočítá.

## Cron doplatků

Nová route `/api/cron/doplatek` (denně, `vercel.json`, `CRON_SECRET` jako
ostatní): bere registrace s `payment_status='partial'` a `status <> 'cancelled'`
a `doplatekDo` čte z turnusu:
- `doplatekDo − 14 ≤ dnes < doplatekDo − 3` a ještě bez připomínky → připomínka 1, claim `doplatek_reminder_14_at`,
- `doplatekDo − 3 ≤ dnes ≤ doplatekDo` → připomínka 2, claim `doplatek_reminder_3_at`
  (kdo zálohu zaplatí až 2 dny před termínem, dostane jen tuhle),
- `dnes > doplatekDo` → jeden e-mail týmu na `SITE.email` se seznamem, claim `doplatek_overdue_alert_at`.
- „dnes“ = pražské datum (`isoDate` z `src/lib/dates.ts`), ne UTC.

Výběr okna je čistá funkce (`doplatekKrok(dnes, doplatekDo, odeslano)`) s unit testy.

Stávající cron `payment-reminder` (24 h po nezaplacené přihlášce) zůstává.
`partial` z něj vypadne sám. V jeho e-mailu přibude řádek „nebo záloha 2 000 Kč“.

## VOP (`/podminky`)

- 19.2: smlouva vzniká „úhradou zálohy nebo celé ceny“.
- nový **21.4 Záloha a doplatek**: výše zálohy a termín doplatku jsou uvedeny
  u turnusu. Pořadatel pošle připomínky. Když doplatek nedorazí ani do 7 dnů od
  upozornění, může pořadatel místo uvolnit a uhrazenou částku vrátit podle čl. 22.
- Platí jen pro nové přihlášky (podmínky se přijímají při přihlášce, uložené
  `vop_accepted_at` to dokládá).

## Hub (`weeks-hub-deploy`, malá úprava na **main**, ne na `feat/turnusy`)

- `RegistrationPaymentStatus` + `PAYMENT_STATUS_CONFIG.partial = { label: 'Záloha zaplacena', color: amber }`.
- Počty obsazenosti a „zaplaceno“: `useRegistrations.ts:41`, `api/turnusy/route.ts:42`,
  `lib/utils/registrace.ts:23-25`, `EkonomikaPanel.tsx:39` (tržba = jen opravdu
  zaplacené, tedy u `partial` záloha; hub nemá tabulku plateb, proto zatím
  `payment_amount` jen u `completed` a `partial` jako samostatný řádek s počtem).
- Bez fallbacku by hub na `partial` spadl (`StatusBadges.tsx:32`,
  `RegistrationDetailPanel.tsx:161`). Proto **pořadí nasazení: migrace → hub → web.**

## ⚑ Doplnil jsem (grilling o tom nemluvil), prosím zkontrolovat

1. **Storno u nedoplacené přihlášky**: poplatek se počítá z celé ceny, ale
   **nikdy se nepožaduje víc, než rodič zaplatil**. Příklad: storno 20 dní
   před táborem (50 % = 2 995 Kč) se zaplacenou jen zálohou → nevrací se nic
   a nic se nedoplácí. Do VOP 22 přibude jedna věta.
2. **Refund route v administraci** (`/api/admin/refund`) u `partial` a u
   přihlášek s více platbami **odmítne** a pošle tě vracet ručně v Comgate (jako
   v červenci). Vracení po řádcích je samostatná práce, teď ji nikdo nepotřebuje.
3. `status='confirmed'` pro „záloha zaplacena“. V hubu se zobrazí jako „Potvrzeno“
   (fialově), platební štítek „Záloha zaplacena“ (amber).
4. Nástupní list dál chodí jen `completed`, takže nedoplacená přihláška ho nedostane.
   Doplatek je splatný 31. 5., nástupní list chodí týden před táborem.
5. FAQ na webu dostane otázku „Můžu zaplatit zálohu?“.

## Mimo rozsah

Vracení peněz po řádcích plateb, zobrazení jednotlivých plateb v hubu, splátky
na víc než dvě části, zálohy u Prahy (dostane je přidáním `zaloha` k turnusu,
až se otevře).

## Ověření

- Unit testy: výpočet částky (plna/zaloha/doplatek, po termínu, turnus bez
  zálohy), přepočet stavu z řádků, validace turnusu, okna cronu.
- `npm run build` + celé testy.
- Po nasazení E2E na produkci jako 11. 10.: registrace se zálohou → Comgate
  → **zrušení** platby → callback `cancelled`, přihláška zrušená, faktura
  žádná → smazat testovací řádek. Ostrou zálohu ověří první skutečný rodič
  (hlídat Fakturoid a e-mail).
