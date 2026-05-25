# Dvoudenní 3D tisk — návrh (design spec)

**Datum:** 2026-05-25
**Stav:** odsouhlaseno, připraveno k naplánování
**Repozitáře:** `weeks_web` (web) + `weeks-hub` (admin) + Supabase migrace

## Cíl

Vypsat na webu nový **dvoudenní tábor 3D tisku** (víkend 2.–3. 7. 2026, 2 990 Kč,
max 15 dětí) jako vizuálně odlišený speciál na stránce `/tabor-3d-tisk`, jasně
oddělený od základního jednodenního 3D tisku (1 den, 1 490 Kč).

Tábor má dvě klíčové zvláštnosti:
1. **Flexibilní docházka** — dva dny na sebe navazují, ale dítě může přijít i jen
   na jeden den; program se přizpůsobí (personalizovaný pro 1denní i 2denní účast).
2. **Dvojí cesta přihlášení** — celý víkend poběží přes registraci DDM Praha 6
   (vypsáno jako dvoudenní, odkaz zatím není); jednodenní účast DDM neumožňuje,
   proto pro ni zájemci nechají email / zavolají / napíšou na infomail a my se ozveme.

## Architektura (současný stav)

Zdroj pravdy = sdílená Supabase tabulka `camps`.
- **Web** ji čte (`getCampsForProgram`) a renderuje; vystavuje na `/api/camps`
  (obohacuje o živou DDM kapacitu).
- **Hub** ji edituje (`useCamps`) a `sync-camps` z ní jen obnovuje počty/kapacitu.
- `camp_type` (`weekend`/`oneday`) už v tabulce existuje → 2denní 3D tisk = řádek
  `program='3d-tisk'` + `camp_type='weekend'`. Web ho dnes chybně řadí mezi
  jednodenní termíny (hláška „9:00–17:00, 1 den"); je potřeba ho odfiltrovat
  a vykreslit zvlášť.
- **Mezera v hubu:** typ `Camp` ani modaly `CreateCampModal` / `CampDetailModal`
  neznají `program`, `camp_type`, `price`, `ddm_id` — tato pole se dnes plní mimo
  hub (přímo v Supabase). Pro „přidat do hubu" je doplníme.

## Změny

### 1. Supabase (migrace)

Nová migrace `weeks-hub/supabase/migrations/010_camps_single_day.sql`:
- `ALTER TABLE camps ADD COLUMN IF NOT EXISTS single_day_option BOOLEAN NOT NULL DEFAULT false;`
- Idempotentně (`ADD COLUMN IF NOT EXISTS`) dorovnat sloupce, které v produkci
  existují, ale v repo migracích chybí, ať je schéma v repu v souladu s prod:
  `program TEXT`, `camp_type TEXT`, `price INTEGER`, `ddm_id TEXT`,
  `day_label TEXT`, `location_detail TEXT`, `display_order INTEGER DEFAULT 0`.
- Migraci je nutné aplikovat na živou Supabase (web čte `single_day_option`).

`single_day_option` řídí zobrazení bloku „jen jeden den".

### 2. Hub (weeks-hub)

- `src/types/database.ts` → rozšířit interface `Camp` o:
  `program: string | null`, `camp_type: 'weekend' | 'oneday' | null`,
  `price: number | null`, `ddm_id: string | null`, `single_day_option: boolean`.
- `src/components/camps/CreateCampModal.tsx` → přidat pole:
  - **Program** (select: `3d-tisk` = „3D tisk", `iot` = „IoT", `tech` = „MIX / chytré technologie")
  - **Typ** (select: `oneday` = „Jednodenní", `weekend` = „Víkendový")
  - **Cena (Kč)** (number)
  - **DDM ID** (text, volitelné)
  - **„Umožnit přihlášení jen na 1 den"** (checkbox → `single_day_option`)
  - (registrace URL už existuje)
- `src/components/camps/CampDetailModal.tsx` → stejná pole do edit formu i do
  read-only zobrazení.
- `src/hooks/useCamps.ts` → `createCamp` a `updateCamp` rozšířit o nová pole
  (insert/update do Supabase).
- Nová pole jsou volitelná, aby nerozbila existující kód a tábory.

### 3. Web (weeks_web)

- `src/lib/camps.ts`:
  - `CampRow` → přidat `single_day_option: boolean`.
  - `TermDisplay` → přidat `singleDayOption: boolean`; mapovat v `toDisplay`.
  - `getCampsForProgram` → přidat výstupní bucket `weekend: TermDisplay[]`
    (termíny s `campType==='weekend'`), a tyto **vyřadit** z bucketů
    `open/openNoLink/collectingInterest/full`, aby se neukázaly jako jednodenní.
- `src/app/tabor-3d-tisk/page.tsx` → předat `weekend` do klienta.
- `src/app/tabor-3d-tisk/client.tsx` → vykreslit `<WeekendCampHighlight>` **nad
  sekcí Termíny** (jen pokud `weekend.length > 0`).
- Nová komponenta `src/components/camps/WeekendCampHighlight.tsx`:
  - **Hlavička:** badge „NOVĚ · Dvoudenní tábor 3D tisku", `weekendDateLabel`
    (2.–3. července), `2 990 Kč`, „2 dny", „max 15 dětí".
  - **Pitch + flexibilita:** krátký popis (dva navazující dny, větší projekty)
    + zvýrazněná věta: *„Stačí přijít i jen na jeden den — program dítěti
    přizpůsobíme."*
  - **Blok A „Celý víkend (oba dny)":** podle statusu termínu:
    - `open_no_link` (aktuální stav): „Registrace přes DDM Praha 6 — brzy
      otevřeme. Nechte email a dáme vědět." → email + GDPR →
      `POST /api/waitlist` s `program='3d-tisk'`,
      `termin='Dvoudenní 3D tisk 2.–3. 7. 2026 — celý víkend'`.
    - `open_with_link` (až bude DDM odkaz): tlačítko „Přihlásit se" na
      `registrationUrl` (jako u potvrzených jednodenních termínů).
  - **Blok B „Chceš přijít jen na jeden den?"** (jen když `singleDayOption`):
    email + select **den** (sobota / neděle) + GDPR checkbox →
    `POST /api/waitlist` s `program='3d-tisk'`,
    `termin='Dvoudenní 3D tisk 2.–3. 7. 2026 — jen jeden den (sobota|neděle)'`.
    Vedle viditelně **+420 703 046 440** a **admin@weeks.cz** s textem
    „nebo nám rovnou zavolejte / napište".
  - Reuse vzhledu/tříd ze stávajícího `TermsList` (stejná paleta primary/indigo).
  - Analytika: `trackInterestSubmit` / `trackRegistrationFormOpen` jako jinde
    (campType `'weekend'`).

`/api/waitlist` se **nemění** — den se zakóduje do volného pole `termin`.
`program='3d-tisk'` už je ve `VALID_PROGRAMS`.

## Mimo rozsah / ověřit při implementaci

- **Žádný rigidní 2denní harmonogram** (kvůli personalizaci) — jen krátký popis
  dvou dnů. Plný rozpis případně doplníme později.
- **Homepage „nejbližší termíny"** (`getNearestTermsByProgram`,
  `getAllUpcomingTerms`) víkendový 3D tisk přirozeně zachytí — ověřit, že se
  zobrazí se správnou cenou (2 990, ne 1 490) a víkendovým datem, případně
  ošetřit.
- **Vložení řádku tábora:** po rozšíření hubu půjde založit klikáním; pro lokální
  test webu lze seedovat přímo v Supabase.
- **Nasazení hubu:** přes squash workflow kvůli Vercel Hobby author blocku
  (viz CLAUDE.md).

## Akceptační kritéria

1. Na `/tabor-3d-tisk` je nad Termíny výrazná sekce dvoudenního 3D tisku
   (2.–3. 7., 2 990 Kč, 2 dny), vizuálně oddělená od jednodenního.
2. Sekce jasně sděluje, že jeden den stačí a program se přizpůsobí.
3. Celý víkend: stav „brzy otevřeme přes DDM" + funkční sběr emailu.
4. Jen jeden den: email + den + GDPR odešle do `/api/waitlist`; vedle je telefon
   a infomail.
5. Víkendový 3D tisk se neukazuje mezi jednodenními termíny.
6. V hubu lze tábor založit/upravit klikáním včetně program/typ/cena/ddm_id
   a vlajky „jen 1 den".
