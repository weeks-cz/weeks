# Fáze 5 — dotažení: strukturovaná data, zachráněný obsah, analytika

> **Pro agenty:** POVINNÁ PODŘÍZENÁ DOVEDNOST: použij superpowers:subagent-driven-development
> a proveď plán úkol po úkolu. Kroky používají zaškrtávací syntaxi (`- [ ]`).

**Cíl:** Dotáhnout věci, které zbyly po strukturální přestavbě — stránky turnusů
dostanou strukturovaná data, zachráněný obsah modulů zaměření se konečně vykreslí,
z analytiky zmizí mrtvé funkce se starými cenami a `/firmy` začne měřit poptávky.

**Architektura:** Beze změny datového modelu. Všechno jsou doplňky nad tím, co
už v repozitáři je: `turnusy.ts` zůstává jediným zdrojem pravdy o ceně a termínu,
`focus.ts` o obsahu zaměření. Logika, která se dá zkazit tiše (výběr turnusů do
strukturovaných dat, dostupnost), se vystěhuje do čisté funkce s testy —
komponenty v `.tsx` se ve vitestu (prostředí `node`, bez jsdom) testovat nedají.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind, Vitest 2, schema.org JSON-LD.

**Spec:** `docs/superpowers/specs/2026-09-15-web-2027-design.md`, fáze 5 v tabulce
„Postup": „Dotažení: mimosezónní stav, sitemap, strukturovaná data, analytické
události". Průzkum skutečného stavu: `.superpowers/sdd/faze-5-pruzkum.md`.

## Global Constraints

- Veškerý text pro návštěvníka **česky**, vykáním. Kód a komentáře taky česky
  (`CLAUDE.md` je výjimka — ta je anglicky).
- **Cena, termín, místo a kapacita se čtou výhradně z `src/lib/turnusy.ts`.**
  Nikde se nedopočítávají ani nezadávají znovu.
- **Nevymýšlej ceny.** Ceník na rok 2027 neexistuje a rozhoduje o něm majitel.
  Kde by kód potřeboval cenu, která není v datech, se buď nevykreslí nic, nebo
  se to zapíše jako otázka pro majitele — nikdy se nedosadí odhad.
- **Nedokládej nic, co web nedokládá jinde** — žádné pojištění účastníků, žádné
  certifikace, žádné sliby doby odezvy. Doložitelné je: poměr jeden lektor na
  pět dětí, proškolení v první pomoci (doslovně z `getSiteFaq()`), kapacita
  odvozená z dat.
- **HWLab Praha není domluvený a FabLab VARY&TE nemá podepsané partnerství.**
  Ani jeden se nesmí uvádět jako partner.
- **Weeks s.r.o. je neplátce DPH** — nikde se nevyčísluje daň.
- Identita se bere ze `src/lib/site.ts`, nikdy natvrdo.
- Vizuální jazyk „maker lab": `bg-paper` / `bg-ink`, rámečky `border-ink/15`,
  mono popisky `mono-label`, karty `card-maker`, mřížka `blueprint-grid`.
- Animace respektují `prefers-reduced-motion` (`useReducedMotion`).
- Přístupnost: každý input má svázaný `<label>`, prvek bez viditelného textu
  `aria-label`, obrázky `alt` a mimo první obrazovku `loading="lazy"`.
- **Strukturovaná data nesmí tvrdit nic, co na stránce není vidět.** Google i
  rodič mají vidět totéž.
- `npm run lint` je rozbité (Next 16 zrušil `next lint`). Bránou je `npm test`,
  `npx tsc --noEmit` a `npm run build`.
- **Nikdy `git add -A`** — v kořeni repozitáře leží soukromé soubory mimo verzování.
- Větev `feat/web-2027`. Commituj po každém úkolu, podpisový řádek
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
- Repozitář je **veřejný** — žádná obchodní strategie ani interní čísla.

## Pořadí provádění

**1 → 2 → 3 → 4 → 5.** Úkoly 1 a 2 sahají do stejných stránek, proto jdou po
sobě. Úkoly 3, 4 a 5 jsou na sobě nezávislé.

## Mapa souborů

**Vzniká:**

| Soubor | Zodpovědnost |
|---|---|
| `src/components/seo/schema-turnusy.ts` | Výběr turnusů do strukturovaných dat a jejich dostupnost — čistá funkce |
| `src/components/seo/schema-turnusy.test.ts` | Hlídá, že se do schematu nedostane turnus bez termínu, místa nebo ceny |

**Mění se:** `src/components/seo/StructuredData.tsx`, `src/app/tabor/[turnus]/page.tsx`,
`src/app/tabor/page.tsx`, `src/app/tabor/layout.tsx`, `src/app/o-nas/page.tsx`,
`src/app/kontakt/page.tsx`, `src/app/firmy/page.tsx`,
`src/components/turnusy/ProjectGallery.tsx`, `src/lib/analytics.ts`,
`src/components/firmy/FirmyPoptavka.tsx`, `CLAUDE.md`.

**Sdílené soubory:** `src/app/tabor/[turnus]/page.tsx` mění úkoly 1 a 3 (v tomhle
pořadí), `src/app/tabor/` mění úkol 2 (jen `layout.tsx`) a úkol 3 (jen `page.tsx`).

---

### Task 1: Strukturovaná data na stránce turnusu

Dnes vykresluje `EventSchema` položky za všechny prodejné turnusy — a visí jen
na úvodce (`src/app/page.tsx:18`). **Stránka konkrétního turnusu, tedy jediná
stránka odpovídající jedné skutečné události s datem, místem a cenou, nemá
strukturovaná data žádná.**

Druhá vada: výběr běží přes `isBookable`, který propustí jen stav `otevreno`.
Vyprodaný turnus (`plno`) tak ze strukturovaných dat zmizí úplně, místo aby se
ukázal jako vyprodaný. Pro Google i pro rodiče je „vyprodáno" užitečnější
informace než ticho.

**Files:**
- Create: `src/components/seo/schema-turnusy.ts`, `src/components/seo/schema-turnusy.test.ts`
- Modify: `src/components/seo/StructuredData.tsx`, `src/app/tabor/[turnus]/page.tsx`

**Interfaces:**
- Consumes: `getTurnusy`, `type Turnus` z `@/lib/turnusy`
- Produces: `turnusyProSchema(list?): TurnusProSchema[]`; `EventSchema({ turnusy? })`

- [ ] **Step 1: Napiš padající test**

Vytvoř `src/components/seo/schema-turnusy.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { turnusyProSchema } from './schema-turnusy'
import type { Turnus } from '@/lib/turnusy'

const uplny: Turnus = {
  id: 'test-uplny',
  slug: 'test-uplny',
  // `VenueId` je dnes jediné: 'fablab-varyte', a je v Karlových Varech.
  // Město turnusu s městem místa musí souhlasit (viz kontrola v `turnusy.ts`).
  city: 'karlovy-vary',
  start: '2027-07-05',
  end: '2027-07-09',
  priceKc: 7900,
  venueId: 'fablab-varyte',
  capacity: 15,
  status: 'otevreno',
  focus: ['3d-tisk'],
  ageRange: '9-15',
  perex: 'Testovací turnus.',
}

describe('turnusyProSchema', () => {
  it('turnus v prodeji je k dispozici', () => {
    const r = turnusyProSchema([uplny])
    expect(r).toHaveLength(1)
    expect(r[0].dostupnost).toBe('https://schema.org/InStock')
  })

  it('vyprodaný turnus se ukáže jako vyprodaný, ne že zmizí', () => {
    const r = turnusyProSchema([{ ...uplny, status: 'plno' }])
    expect(r).toHaveLength(1)
    expect(r[0].dostupnost).toBe('https://schema.org/SoldOut')
  })

  it('uzavřený turnus se neukazuje vůbec', () => {
    expect(turnusyProSchema([{ ...uplny, status: 'uzavreno' }])).toHaveLength(0)
  })

  it('chystaný turnus se neukazuje — nemá co slíbit', () => {
    expect(
      turnusyProSchema([
        { ...uplny, status: 'chystame', start: null, end: null, priceKc: null, venueId: null },
      ])
    ).toHaveLength(0)
  })

  it('turnus bez ceny se neukazuje, i kdyby byl otevřený', () => {
    expect(turnusyProSchema([{ ...uplny, priceKc: null }])).toHaveLength(0)
  })

  it('turnus bez místa se neukazuje — schema by nemělo co napsat do adresy', () => {
    expect(turnusyProSchema([{ ...uplny, venueId: null }])).toHaveLength(0)
  })

  it('bez argumentu bere skutečná data a nespadne', () => {
    expect(Array.isArray(turnusyProSchema())).toBe(true)
  })
})
```

Kdyby typ `Turnus` měl jiná pole, než tenhle objekt vyjmenovává, nevymýšlej si je —
otevři `src/lib/turnusy.ts` a doplň test podle skutečného typu.

- [ ] **Step 2: Pusť test a ověř, že padá**

Run: `npm test -- src/components/seo/schema-turnusy.test.ts`

Expected: FAIL — modul neexistuje

- [ ] **Step 3: Napiš modul**

Vytvoř `src/components/seo/schema-turnusy.ts`:

```ts
import { getTurnusy, type Turnus } from '@/lib/turnusy'

export type Dostupnost = 'https://schema.org/InStock' | 'https://schema.org/SoldOut'

export interface TurnusProSchema {
  turnus: Turnus
  dostupnost: Dostupnost
}

/**
 * Které turnusy se smí objevit ve strukturovaných datech a s jakou dostupností.
 *
 * Proti `isBookable` je to o jeden stav širší: vyprodaný turnus (`plno`) se
 * ukáže jako `SoldOut`, ne aby ze schematu zmizel. „Vyprodáno" je pro Google
 * i pro rodiče užitečnější než ticho — a je to pravda, kterou stránka stejně
 * ukazuje.
 *
 * Turnus bez termínu, ceny nebo místa se nevykreslí za žádného stavu: schema
 * nemá co napsat do `startDate`, `offers.price` ani do adresy, a dopočítat to
 * záložní hodnotou by znamenalo slíbit něco, co neplatí.
 */
export function turnusyProSchema(list: Turnus[] = getTurnusy()): TurnusProSchema[] {
  return list
    .filter(
      (t) => t.start !== null && t.end !== null && t.priceKc !== null && t.venueId !== null
    )
    .filter((t) => t.status === 'otevreno' || t.status === 'plno')
    .map((t) => ({
      turnus: t,
      dostupnost:
        t.status === 'plno'
          ? ('https://schema.org/SoldOut' as const)
          : ('https://schema.org/InStock' as const),
    }))
}
```

- [ ] **Step 4: Pusť test a ověř, že prochází**

Run: `npm test -- src/components/seo/schema-turnusy.test.ts`

Expected: PASS (7 testů)

- [ ] **Step 5: Přepoj `EventSchema` na nový výběr**

V `src/components/seo/StructuredData.tsx`:

1. Nahraď import `isBookable` importem `turnusyProSchema` z `./schema-turnusy`.
2. Podpis změň na `export function EventSchema({ turnusy }: { turnusy?: Turnus[] } = {})`.
   Nepovinná vlastnost, takže dnešní volání bez vlastností na úvodce funguje dál.
3. Uvnitř: `const polozky = turnusyProSchema(turnusy)`, `if (polozky.length === 0) return null`,
   a v mapě ber `turnus` i `dostupnost` z položky.
4. `availability` ve schematu ber z `dostupnost`, ne natvrdo `InStock`.
5. Non-null asserty (`turnus.venueId!`) zůstávají — `turnusyProSchema` je zaručuje
   stejně jako dřív `isBookable`. Uprav u nich komentář, ať odkazuje na novou funkci.
6. Doplň komentář, proč je vlastnost nepovinná: úvodka chce všechny turnusy,
   stránka turnusu jen ten svůj.

- [ ] **Step 6: Přidej schema na stránku turnusu**

V `src/app/tabor/[turnus]/page.tsx` naimportuj `EventSchema` a `BreadcrumbSchema`
z `@/components/seo/StructuredData` a vykresli je hned za `<Header />`:

```tsx
<EventSchema turnusy={[turnus]} />
<BreadcrumbSchema
  items={[
    { name: 'Úvod', url: SITE.url },
    { name: 'Tábor', url: `${SITE.url}/tabor` },
    { name: turnusLabels(turnus).datum, url: `${SITE.url}/tabor/${turnus.slug}` },
  ]}
/>
```

Drobečky ve schematu musí odpovídat drobečkům, které jsou na stránce vidět
(`page.tsx:118-122`) — název poslední položky proto ber ze stejného zdroje jako
viditelný text. Když se texty rozejdou, Google to čte jako podvod. Zkontroluj,
jaký text je na stránce doopravdy, a použij ten; `turnusLabels(turnus).datum`
výš je návrh, ne příkaz.

- [ ] **Step 7: Ověř a commitni**

Run: `npx tsc --noEmit && npm test && npm run build`

Expected: bez chyb

Ověř i výstup: oba turnusy jsou dnes `chystame`, takže na jejich stránkách
**nesmí** být žádný `Event` — jen drobečky. Soubor si najdi (cestu neber jako
danou) a do reportu napiš výstup:

```bash
grep -o '"@type":"[A-Za-z]*"' .next/server/app/tabor/praha-leto-2027.html | sort | uniq -c
```

Expected: `BreadcrumbList` ano, `Event` ne.

```bash
git add src/components/seo/ "src/app/tabor/[turnus]/page.tsx"
git commit -m "feat(seo): strukturovaná data na stránce turnusu

Stránka jednoho turnusu je jediná stránka, která odpovídá jedné skutečné
události — a neměla schema žádné. Výběr turnusů se navíc přestěhoval do
čisté funkce, aby šel otestovat, a vyprodaný turnus se nově ukáže jako
vyprodaný místo aby zmizel.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Drobečky na zbylých stránkách

`BreadcrumbSchema` má dnes jen `/gdpr` a `/podminky`. Chybí na `/tabor`, `/o-nas`,
`/kontakt` a `/firmy` — přitom všechny čtyři jsou na webu druhá úroveň.

**Files:**
- Modify: `src/app/tabor/layout.tsx`, `src/app/o-nas/page.tsx`,
  `src/app/kontakt/page.tsx`, `src/app/firmy/page.tsx`

**Interfaces:**
- Consumes: `BreadcrumbSchema` z `@/components/seo/StructuredData`
- Produces: nic

- [ ] **Step 1: Přidej drobečky na tři serverové stránky**

Vzor je `src/app/gdpr/page.tsx:89`. Do `/o-nas`, `/kontakt` a `/firmy` přidej
hned za `<Header />`:

```tsx
<BreadcrumbSchema
  items={[
    { name: 'Úvod', url: SITE.url },
    { name: '<název stránky>', url: `${SITE.url}/<cesta>` },
  ]}
/>
```

Názvy ber shodné s tím, jak na stránky odkazuje hlavička
(`src/components/layout/Header.tsx`) — ne vymyšlené nové.

- [ ] **Step 2: Přidej drobečky na `/tabor`**

`src/app/tabor/page.tsx` je klientská komponenta (`'use client'`). Schema patří
do `src/app/tabor/layout.tsx`, ne do stránky — layout je serverový, takže se
JSON-LD nedostane do klientského balíku a vykreslí se na serveru. Napiš k tomu
komentář, proč to u téhle jediné stránky vypadá jinak než u ostatních.

Layout dnes vrací `children`; změň ho tak, aby vrátil fragment s drobečky
a `children`.

- [ ] **Step 3: Ověř a commitni**

Run: `npx tsc --noEmit && npm test && npm run build`

Ověř, že se schema opravdu vygenerovalo do HTML všech čtyř stránek (cesty si
najdi, neber je jako dané):

```bash
for p in tabor o-nas kontakt firmy; do echo -n "$p: "; grep -c 'BreadcrumbList' .next/server/app/$p.html; done
```

Expected: každá stránka `1`

```bash
git add src/app/tabor/layout.tsx src/app/o-nas/page.tsx src/app/kontakt/page.tsx src/app/firmy/page.tsx
git commit -m "feat(seo): drobečky do strukturovaných dat na zbylých stránkách

Dosud je měly jen /gdpr a /podminky. Na /tabor jde schema do layoutu —
stránka je klientská a JSON-LD nemá co dělat v klientském balíku.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Vyložit zachráněný obsah zaměření

Fáze 2 vytáhla ze zanikajících stránek `/tabor-3d-tisk` a `/tabor-iot` obsah do
modulů zaměření — **a nikdo ho pak nevykreslil.** `FocusModule`
(`src/lib/focus.ts:11-25`) má pole `printers`, `hardware`, `gallery` a `faq`;
grep přes `src/app` a `src/components` ukazuje, že se vykresluje jedině `tryOut`.
Sedm modelů tiskáren, hardware k Arduinu, dvě galerie a osm otázek leží v kódu
jako mrtvá data. Záchrana proběhla, vyložení nákladu ne.

Druhá vada: `src/components/turnusy/ProjectGallery.tsx:10-15` má vlastní natvrdo
psaný seznam šesti obrázků vedle `focus.gallery` — dva zdroje pravdy pro totéž,
přičemž jeden z nich nikdo nečte.

**Files:**
- Modify: `src/app/tabor/[turnus]/page.tsx`, `src/app/tabor/page.tsx`,
  `src/components/turnusy/ProjectGallery.tsx`

**Interfaces:**
- Consumes: `getFocusModules`, `type FocusModule` z `@/lib/focus`
- Produces: `ProjectGallery({ polozky? })`

> **Pozor na pořadí:** úkol 1 už do `src/app/tabor/[turnus]/page.tsx` přidal
> strukturovaná data hned za `<Header />`. Nesahej na ně.

- [ ] **Step 1: Vykresli vybavení u zaměření**

Na stránce turnusu se dnes u každého modulu zaměření vykresluje `tryOut`
(`page.tsx:199`). Pod ten seznam přidej — **jen když je pole neprázdné** —
řádek s vybavením:

- `printers` → mono popisek `Tiskárny, na kterých děti pracují` a hodnoty jako
  drobné štítky.
- `hardware` → mono popisek `Hardware` a hodnoty stejně.

Prázdné pole nesmí vykreslit nadpis ani rámeček — moduly `vr` a `herni-vyvoj`
vybavení nemají a nesmí po nich zůstat prázdné místo.

- [ ] **Step 2: Vykresli FAQ zaměření**

Pod seznam zaměření přidej sekci s otázkami, které nesou moduly daného turnusu
(`faq` posbírané ze všech jeho modulů). Vykresli je jako prostý seznam
otázka/odpověď, ne jako rozbalovací akordeon — akordeon na `/tabor` je součástí
`FAQSection` a čte `getSiteFaq()`; tohle je jiný obsah a nemá se s ním míchat.

Když žádný modul turnusu FAQ nemá, sekce se nevykreslí vůbec.

- [ ] **Step 3: Propoj galerii s daty zaměření**

Pozor, `ProjectGallery` **dnes na stránce turnusu vůbec není** — vykresluje se
na `/tabor` (`src/app/tabor/page.tsx:502`). Úkol má dvě části:

1. Komponenta dostane nepovinnou vlastnost:

```tsx
export function ProjectGallery({
  polozky,
}: {
  polozky?: Array<{ src: string; alt: string; tag?: string }>
})
```

Když vlastnost přijde, vykreslí ji; když ne, chová se jako dnes.

2. Natvrdo psaný seznam šesti obrázků (`ProjectGallery.tsx:10-15`) zmiz. Obě
   volající stránky si položky složí z modulů zaměření:
   - `/tabor` ze **všech** modulů, které má aspoň jeden turnus,
   - stránka turnusu jen z modulů **toho svého** turnusu (a rovnou tam
     `ProjectGallery` přidej — dnes ji nemá).

   `tag` ber z `modul.name` (tedy „3D tisk", „IoT a elektronika") — dnešní
   štítky jsou psané ručně a jde je odvodit. Popisek pod obrázkem ber z `alt`.

Všech 14 obrázků z `focus.gallery` na disku existuje (ověřeno v `public/images/gallery/`)
a dnešních šest natvrdo psaných je jejich podmnožina — proto se seznam maže,
ne doplňuje. **Přesto si existenci ověř sám** (`ls public/images/gallery/`);
kdyby některý chyběl, je to nález do reportu, ne důvod si cestu domyslet.

- [ ] **Step 4: Ověř a commitni**

Run: `npx tsc --noEmit && npm test && npm run build`

Do reportu napiš, které obrázky z `focus.gallery` na disku existují a které ne.

```bash
git add "src/app/tabor/[turnus]/page.tsx" src/components/turnusy/ProjectGallery.tsx
git commit -m "feat(tabor): vykreslit obsah zaměření zachráněný ze zrušených stránek

Tiskárny, hardware, galerie a FAQ se do modulů zaměření vytáhly ve fázi 2,
než se staré stránky smazaly — a nikdo je pak nevykreslil. Ležely v kódu
jako mrtvá data.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Úklid analytiky a měření poptávek z `/firmy`

V `src/lib/analytics.ts` leží šest funkcí, které nikdo nevolá — ověřeno greppem
přes celý `src/` mimo samotný `analytics.ts`:

| Funkce | Použití | Poznámka |
|---|---|---|
| `trackInterestSubmit` | 0 | posílá `value: 1490` |
| `trackProgramInterest` | 0 | |
| `trackRegistrationClick` | 0 | posílá `value: campType === 'oneday' ? 1490 : 2990` |
| `trackRegistrationFormOpen` | 0 | |
| `trackViewCampDetail` | 0 | |
| `trackViewOneDayCamp` | 0 | |

Všech šest patří ke zrušeným formátům (jednodenní tábory, `/program`, odkazy do
DDM). Dvě z nich posílají do GA i Mety hodnotu konverze ve starých cenách.
**Smazat, ne aktualizovat** — cena na rok 2027 není rozhodnutá.

Druhá věc: `/firmy` dnes neměří nic.

**Files:**
- Modify: `src/lib/analytics.ts`, `src/components/firmy/FirmyPoptavka.tsx`

**Interfaces:**
- Consumes: nic
- Produces: `trackFirmyPoptavka({ typ }: { typ: string }): void`

- [ ] **Step 1: Smaž šest mrtvých funkcí**

Než smažeš, ověř si počet použití každé z nich sám:

```bash
for f in trackInterestSubmit trackProgramInterest trackRegistrationClick trackRegistrationFormOpen trackViewCampDetail trackViewOneDayCamp; do echo -n "$f: "; grep -rn "$f" src/ --include=*.ts --include=*.tsx | grep -vc "src/lib/analytics.ts"; done
```

Expected: všechny `0`. **Když některá vyjde jinak než nula, nemaž ji** a napiš
to do reportu — znamená to, že se průzkum mýlil.

Smaž i komentáře, které patří jen k nim.

- [ ] **Step 2: Sjednoť zastaralý komentář**

`src/lib/analytics.ts:87` říká „Off-season: kontakt zanechaný na příští sezónu
(KV po létě 2026)". Mimosezónní stav už není výjimka pro jedno město, ale výchozí
chování celého webu. Komentář přepiš, ať to odpovídá.

- [ ] **Step 3: Přidej událost pro firemní poptávku**

Do `analytics.ts` přidej funkci ve stejném tvaru jako `trackSeasonInterest`
(tedy **jen GA, ne Meta** — na firemní poptávky necílí žádná kampaň a falešná
hodnota konverze by zašuměla optimalizaci; napiš to do komentáře):

```ts
// Firemní poptávka odeslaná z /firmy. Rozměr nese id nabídky, ne její nadpis —
// ať analytika nezávisí na textaci, kterou tým může kdykoliv přepsat.
export function trackFirmyPoptavka(params: { typ: string }) {
  sendGAEvent('event', 'firmy_poptavka_submit', {
    event_category: 'firmy',
    typ: params.typ,
  })
}
```

Zavolej ji ve `FirmyPoptavka.tsx` po úspěšném odeslání, na stejném místě, kde
se dnes přepíná na potvrzovací obrazovku. **Nikdy ji nevolej při chybě.**

- [ ] **Step 4: Ověř a commitni**

Run: `npx tsc --noEmit && npm test && npm run build`

```bash
git add src/lib/analytics.ts src/components/firmy/FirmyPoptavka.tsx
git commit -m "chore(analytics): smazat mrtvé funkce a začít měřit firemní poptávky

Šest funkcí ke zrušeným formátům nikdo nevolal; dvě z nich posílaly do GA
a Mety hodnotu konverze ve starých cenách. Mrtvý kód s číslem uvnitř je
pozvánka k tomu, aby ho někdo příští sezónu použil.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Mimosezónní stav — ověřit a popsat

Spec počítá s tím, že se web spouští do mrtvé sezóny a že hlavní výzvou není
„přihlásit", ale „nechte kontakt". Po fázích 1-3 to podle všeho platí: `/tabor`
si prodejní stav počítá z turnusů a `SeasonConfig` z `locations.ts` je pryč i s
celým souborem. **Tenhle úkol nic nepřepisuje, dokud neověří, že je co přepisovat.**

**Files:**
- Modify: `CLAUDE.md` (a jen to, co průchod opravdu odhalí jako nepravdivé)

**Interfaces:**
- Consumes: nic
- Produces: nic

- [ ] **Step 1: Projdi web v mrtvé sezóně**

Postav web (`npm run build && npm run start`) a projdi `/`, `/tabor`,
`/tabor/praha-leto-2027`, `/tabor/karlovy-vary-leto-2027` a `/firmy`. U každé
stránky si zapiš:

- Jaká je hlavní výzva k akci? Je to sběr kontaktu, nebo někde zůstalo
  „Přihlásit dítě"?
- Objevuje se někde cena, termín nebo místo, přestože turnusy jsou `chystame`?
- Tvrdí něco, že registrace běží?

Zapiš do reportu, co jsi na každé stránce viděl. **Když je všechno v pořádku,
je správný výsledek „nenašel jsem nic" a nic neopravuješ.**

- [ ] **Step 2: Oprav jen to, co jsi opravdu našel**

Každou opravu zdůvodni v reportu odkazem na to, co jsi viděl v kroku 1.
Nevymýšlej si práci; když průchod nic nenašel, přeskoč rovnou na krok 3.

- [ ] **Step 3: Srovnej `CLAUDE.md` s koncem přestavby**

Do oddílu o fázích napiš, že fáze 5 je hotová, a co v ní vzniklo. Doplň nové
soubory do stromu adresářů (`src/components/seo/schema-turnusy.ts`).

Soubor je **anglicky** — drž jazyk.

- [ ] **Step 4: Ověř a commitni**

Run: `npx tsc --noEmit && npm test && npm run build`

```bash
git add CLAUDE.md
git commit -m "docs: dotáhnout popis projektu po fázi 5

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Hotovo, když

- Stránka turnusu nese `Event` (jen když má turnus termín, cenu i místo) a drobečky.
- Vyprodaný turnus se ve strukturovaných datech ukáže jako vyprodaný, ne že zmizí.
- `/tabor`, `/o-nas`, `/kontakt` a `/firmy` mají drobečky.
- Tiskárny, hardware, galerie a FAQ z modulů zaměření jsou na stránce turnusu vidět.
- V `analytics.ts` není funkce, kterou nikdo nevolá, ani cena ze zrušeného produktu.
- `/firmy` měří odeslanou poptávku s id nabídky.
- `npm test`, `npx tsc --noEmit` i `npm run build` prochází.

## Co tahle fáze schválně nedělá

- **Nestanovuje ceny ani termíny.** To je rozhodnutí majitele; do té doby zůstávají
  turnusy `chystame` a schema se u nich nevykresluje.
- **Nenasazuje.** Nasazení je samostatný krok po odsouhlasení celé přestavby.
- **Neřeší otevřené otázky pro majitele** z fáze 3 — ty mají vlastní dokument
  (`docs/superpowers/plans/2026-09-16-web-2027-faze-3-otazky-pro-majitele.md`).

## Otázka, kterou tahle fáze přidává majiteli

**„Oběd v ceně tábora"** — harmonogram na `/tabor` tvrdí, že oběd je zajištěný
a v ceně tábora. Pro rok 2027 není stanovená cena ani domluvený dodavatel obědů.
Je to slib, který web dává dřív, než ho někdo potvrdil. Nechávám beze změny —
odstranit doložitelnou součást produktu by bylo horší než ji ponechat — ale
majitel to má potvrdit dřív, než web půjde ven.
