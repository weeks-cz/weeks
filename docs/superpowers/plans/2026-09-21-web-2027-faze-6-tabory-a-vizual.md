# Fáze 6 — tábory jako kategorie a vizuální systém

> **Pro agenty:** POVINNÁ PODŘÍZENÁ DOVEDNOST: použij superpowers:subagent-driven-development
> (doporučeno) nebo superpowers:executing-plans a proveď plán úkol po úkolu.
> Kroky používají zaškrtávací syntaxi (`- [ ]`).

**Cíl:** Postavit nad turnus entitu **tábor** (téma), rozdělit dnešní `/tabor`
na tři úrovně adres `/tabory`, `/tabory/[tema]` a `/tabory/termin/[slug]`,
a promítnout schválenou vizuální variantu B z `/nahled/b` do ostrých komponent.

**Architektura:** Jednosměrný řetěz importů `turnusy.ts → tabory.ts → focus.ts`.
Tábor vlastní téma (název, perex, `focus[]`, program po dnech), turnus vlastní
termín (město, místo, datum, cena, kapacita, stav) a ukazuje na téma přes
`taborIds: TaborId[]`. Nic, co dnes čte `turnus.focus`, nesmí po fázi 6 existovat —
zaměření se čte přes tábor. `id` turnusu se nemění, protože je v `registrations.term_id`
a na fakturách.

**Tech Stack:** Next.js 16 App Router (Turbopack), TypeScript, Tailwind,
Framer Motion, Vitest 2 (prostředí `node`, bez jsdom), schema.org JSON-LD.

**Spec:** `docs/superpowers/specs/2026-09-21-web-2027-faze-6-tabory-a-vizual-design.md`
Navazuje na `2026-09-15-web-2027-design.md` a na fáze 4–5 popsané v `CLAUDE.md`.

## Global Constraints

- Veškerý text pro návštěvníka **česky**, vykáním. Kód i komentáře česky
  (`CLAUDE.md` je výjimka — ta je anglicky).
- **Cena, termín, místo a kapacita se čtou výhradně z `src/lib/turnusy.ts`.**
  Téma, program a zaměření výhradně z `src/lib/tabory.ts`. Nikde se nedopočítávají.
- **`id` turnusu se NIKDY nemění** — je v `registrations.term_id` a na fakturách.
  Mění se jen adresa stránky a zdroj názvu tábora.
- **Nevymýšlej ceny, termíny ani reference.** Chystaný tábor dostane perex
  a body „co si dítě zkusí" v rovině záměru — žádný harmonogram, galerii, cenu
  ani vybavení. Stejné pravidlo jako u `/firmy` (`PARTNERSTVI_ZATIM`,
  prázdné `reference`).
- **Nedokládej nic, co web nedokládá jinde.** Doložitelné je: jeden lektor na
  pět dětí, proškolení v první pomoci, kapacita z dat, oběd v ceně, Po–Pá 8:00–17:00.
- **HWLab ani FabLab VARY&TE nejsou partneři.** FabLab je *místo konání* jednoho
  turnusu, u `/firmy` jen *možnost*. Složka `public/images/hwlab/` je historický
  název — fotky jsou z táborů Weeks, ale HWLab se nikde nesmí objevit jako
  pořadatel ani místo.
- **Weeks s.r.o. je neplátce DPH** — nikde se nevyčísluje daň.
- Identita se bere ze `src/lib/site.ts`, nikdy natvrdo.
- **Role barev** (viz spec „Barvy nesou význam") — barva se smí použít jen ve své roli:
  `cta`/amber = akce a stav · `accent`/cyan = technologie · `trust`/emerald =
  klid rodičů · `primary`/indigo = základ značky · `ink`/`paper` = plocha a text.
- **Rytmus sekcí:** mezi sousedními sekcemi musí být předěl — buď změna pozadí,
  nebo `border-y`. Dvě sekce se stejným pozadím a bez linky nesmí jít po sobě.
- **Každá stránka má aspoň jeden tmavý blok** (`bg-ink`) jako kotvu.
- **Nosný text se neschovává pod animaci.** U H1, perexu a CTA se animuje posun
  (`y`), ne viditelnost (`opacity: 0`) — jinak je stránka prázdná pokaždé, když
  se animace nespustí.
- Animace respektují `prefers-reduced-motion` (`useReducedMotion`).
- Přístupnost: každý input má svázaný `<label>`, prvek bez viditelného textu
  `aria-label`, obrázky `alt` a mimo první obrazovku `loading="lazy"`.
  V `<dl>` stojí `<dt>` ve zdroji před svým `<dd>` (vizuální pořadí řeší `order-last`).
- **Strukturovaná data nesmí tvrdit nic, co na stránce není vidět.**
- `npm run lint` je rozbitý (Next 16 zrušil `next lint`) — ověřuje se
  `npm test` a `npm run build`.

## Odchylky od specu (vědomé, drobné)

- **Tábor má jen `id`, ne zvlášť `id` a `slug`.** Spec je v tabulce uvádí zvlášť,
  ale tábor na rozdíl od turnusu nikde nesedí v databázi ani na faktuře, takže
  dvě pole by se jen mohla rozejít. `id` je zároveň adresa.
- **Denní harmonogram (typický den) zůstává jedna sdílená konstanta**
  `DENNI_HARMONOGRAM` v `tabory.ts`, ne kopie na každém táboře — je stejný pro
  všechny tábory (8:00–17:00) a čtyřikrát opsaný by se rozešel.

## Pořadí provádění

Úkoly jdou po sobě, každý končí funkčním webem (`npm test` + `npm run build`).
Bloky odpovídají krokům 6a–6f ze specu:

| Úkol | Blok | Co |
|---|---|---|
| 1–2 | 6a | Entita tábor, `taborIds` na turnusu, název na faktuře |
| 3–6 | 6b | Tři úrovně rout, přesměrování, sitemapa, navigace |
| 7–8 | 6c | Vizuální systém varianty B na úvodku |
| 9 | 6d | Rozpuštění `KdeASKym`, KV nudge pryč, `gap-2` |
| 10–11 | 6e | `/firmy`, `/o-nas` |
| 12 | 6f | Úklid náhledů, kontrola dat, `CLAUDE.md` |

## Mapa souborů

**Nové:**
- `src/lib/tabory.ts` — entita tábor: data, čtecí funkce, validace
- `src/lib/tabory.test.ts` — chování funkcí nad vlastními daty
- `src/lib/tabory-data.test.ts` — kontrola ostrých dat (vzor: `turnusy-data.test.ts`)
- `src/app/tabory/layout.tsx` — metadata výpisu
- `src/app/tabory/page.tsx` — výpis: město → téma → termín
- `src/app/tabory/[tema]/page.tsx` — popis tábora
- `src/app/tabory/termin/[slug]/page.tsx` — konkrétní turnus
- `src/components/tabory/TaborCard.tsx` — karta tématu (výpis i sekce „chystáme")
- `src/components/sections/ProRodice.tsx` — emerald pás „Co máte jisté"
- `src/components/sections/ProDeti.tsx` — tmavý cyan blok s interaktivní mřížkou
- `src/components/sections/FotoPas.tsx` — fotka přes celou šířku s tvrzením
- `src/components/ui/MrizkaSekce.tsx` — přestěhovaná z `nahled/`

**Měněné:**
- `src/lib/turnusy.ts` — `focus` pryč, `taborIds` dovnitř, nové čtecí funkce
- `src/lib/payment-pricing.ts:65-74` — název tábora z entity tábor
- `src/components/registration/RegistrationForm.tsx:80,134,165,181,246`
- `src/components/turnusy/TurnusCard.tsx:21` + cílová adresa
- `src/components/seo/StructuredData.tsx:105` — adresa turnusu
- `src/app/sitemap.ts`, `next.config.js`, `src/app/api/revalidate/route.ts`
- `src/components/layout/Header.tsx:12,24`, `Footer.tsx:10`
- `src/app/page.tsx`, `HeroSection.tsx`, `TickerStrip.tsx`, `USPSection.tsx`,
  `ContactSection.tsx`, `Rozcesti.tsx`, `NejblizsiTurnusy.tsx`
- `src/app/firmy/page.tsx`, `src/app/o-nas/page.tsx`
- `src/app/kontakt/page.tsx`, `src/app/gdpr/page.tsx`, `src/app/podminky/page.tsx`
  (jen vizuální sjednocení, texty beze změny)
- `src/app/globals.css` — `btn-outline` dostane `gap-2`
- `src/lib/turnusy.test.ts`, `turnusy-data.test.ts`, `payment-pricing.test.ts`,
  `schema-turnusy.test.ts`, `turnus-card-labels.test.ts`
- `CLAUDE.md`

**Mazané:**
- `src/app/tabor/**` (4 soubory) — nahrazeno `/tabory`
- `src/components/sections/KdeASKym.tsx` — obsah rozpuštěn
- `src/components/ui/KVRegionNudge.tsx` + mount v `layout.tsx:6,129`
- `src/app/api/geo/route.ts` — bez konzumenta
- `src/app/nahled/**`, `src/components/nahled/VariantaA.tsx`, `VariantaB.tsx`

---

### Task 1: Entita tábor (`src/lib/tabory.ts`)

Tábor je téma („co se tam dělá"), turnus termín („kdy a kde"). Tenhle úkol
vytvoří entitu a její data; napojení na turnus přijde v úkolu 2, takže po
tomhle úkolu ještě nikdo `tabory.ts` nečte — zato ho už drží testy.

**Files:**
- Create: `src/lib/tabory.ts`
- Create: `src/lib/tabory.test.ts`
- Create: `src/lib/tabory-data.test.ts`

**Interfaces:**
- Consumes: `FocusId`, `getFocusModules` z `src/lib/focus.ts`
- Produces:
  - `type TaborId = 'chytre-technologie' | 'game-dev' | 'ai' | 'webovy-tabor'`
  - `type TaborStatus = 'aktivni' | 'chystame'`
  - `interface DenProgramu { den: string; ikona: IkonaDne; title: string; description: string; highlights: string[] }`
  - `type IkonaDne = 'tisk' | 'model' | 'iot' | 'vr' | 'projekt'`
  - `interface Tabor { id, name, shortName, status, perex, popis, focus, zkusiSi?, program?, faq? }`
  - `TABORY: Tabor[]`, `DENNI_HARMONOGRAM: Array<{ time, title, description }>`
  - `getTabory(): Tabor[]`, `getTabor(id: string): Tabor | undefined`,
    `getAktivniTabory()`, `getChystaneTabory()`,
    `zkusiSiTabora(tabor: Tabor): string[]`, `validateTabory(list?): string[]`

- [ ] **Step 1: Napiš padající test**

Vytvoř `src/lib/tabory.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  getTabor,
  getAktivniTabory,
  getChystaneTabory,
  zkusiSiTabora,
  validateTabory,
  type Tabor,
} from './tabory'

const aktivni: Tabor = {
  id: 'chytre-technologie',
  name: 'Tábor chytrých technologií',
  shortName: 'Chytré technologie',
  status: 'aktivni',
  perex: 'Celý týden 3D tisk, modelování a IoT s Arduinem.',
  popis: 'Týden rozdělený na dva bloky — tři dny 3D tisk, dva dny elektronika.',
  focus: ['3d-tisk', 'iot'],
  program: [
    { den: 'Pondělí', ikona: 'tisk', title: 'Start', description: 'Popis dne.', highlights: ['a'] },
  ],
}

const chystany: Tabor = {
  id: 'game-dev',
  name: 'Herní vývoj',
  shortName: 'Herní vývoj',
  status: 'chystame',
  perex: 'Vlastní hra od nápadu po hratelnou verzi.',
  popis: 'Tábor teprve chystáme.',
  focus: ['herni-vyvoj'],
  zkusiSi: ['Postaví si vlastní úroveň', 'Rozpohybuje postavu', 'Dá hru zahrát ostatním'],
}

describe('getTabor', () => {
  it('najde tábor podle adresy', () => {
    expect(getTabor('game-dev', [aktivni, chystany])?.name).toBe('Herní vývoj')
  })

  it('u neznámé adresy vrátí undefined — stránka z toho udělá 404', () => {
    expect(getTabor('neexistuje', [aktivni, chystany])).toBeUndefined()
  })
})

describe('rozdělení podle stavu', () => {
  it('aktivní a chystané se nemíchají', () => {
    expect(getAktivniTabory([aktivni, chystany]).map((t) => t.id)).toEqual(['chytre-technologie'])
    expect(getChystaneTabory([aktivni, chystany]).map((t) => t.id)).toEqual(['game-dev'])
  })
})

describe('zkusiSiTabora', () => {
  it('u chystaného tábora vrátí jeho vlastní body — žádné zaměření zatím nemá obsah', () => {
    expect(zkusiSiTabora(chystany)).toHaveLength(3)
  })

  it('u aktivního tábora body odvodí ze zaměření, ať se text nepíše dvakrát', () => {
    const body = zkusiSiTabora(aktivni)
    expect(body.length).toBeGreaterThan(3)
    expect(body.some((b) => b.includes('model'))).toBe(true)
  })

  it('vlastní body mají přednost i u aktivního tábora', () => {
    expect(zkusiSiTabora({ ...aktivni, zkusiSi: ['jen tohle'] })).toEqual(['jen tohle'])
  })
})

describe('validateTabory', () => {
  it('čistá data nehlásí nic', () => {
    expect(validateTabory([aktivni, chystany])).toEqual([])
  })

  it('odhalí duplicitní id — dva tábory by měly stejnou adresu', () => {
    expect(validateTabory([aktivni, { ...chystany, id: 'chytre-technologie' }])).toHaveLength(1)
  })

  it('aktivní tábor bez programu je chyba — stránka by byla prázdná', () => {
    const problemy = validateTabory([{ ...aktivni, program: undefined }])
    expect(problemy.join(' ')).toContain('chytre-technologie')
  })

  it('chystaný tábor nesmí mít program — nesmí tvrdit, co se na něm bude dít', () => {
    const problemy = validateTabory([{ ...chystany, program: aktivni.program }])
    expect(problemy.join(' ')).toContain('game-dev')
  })

  it('chystaný tábor bez vlastních bodů je chyba — ze zaměření je nemá odkud vzít', () => {
    const problemy = validateTabory([{ ...chystany, zkusiSi: undefined }])
    expect(problemy.join(' ')).toContain('game-dev')
  })
})
```

- [ ] **Step 2: Spusť test a ověř, že padá**

Run: `npm test -- src/lib/tabory.test.ts`
Expected: FAIL — `Failed to resolve import "./tabory"`.

- [ ] **Step 3: Napiš `src/lib/tabory.ts`**

```ts
import { getFocusModules, type FocusId } from './focus'

/**
 * Tábor — téma, ne termín.
 *
 * Nad turnusem (`turnusy.ts`) stojí tábor: „co se tam dělá". Turnus říká
 * „kdy a kde". Rozdělení vzniklo, když k táboru chytrých technologií přibyla
 * další témata — jedna stránka by je nepobrala a čtyři adresy `/tabor-*` byly
 * přesně to, co přestavba webu rušila.
 *
 * Na tábor ukazuje turnus přes `taborIds`, ne naopak. Import jde jedním směrem
 * `turnusy.ts → tabory.ts → focus.ts`; tenhle soubor proto `turnusy.ts`
 * neimportuje a nesmí o turnusech nic vědět.
 *
 * Tábor nemá `slug` zvlášť od `id`: na rozdíl od turnusu nesedí v databázi ani
 * na faktuře, takže dvě pole by se jen mohla rozejít. `id` je zároveň adresa.
 */

export type TaborId = 'chytre-technologie' | 'game-dev' | 'ai' | 'webovy-tabor'

export type TaborStatus =
  /** Běží, má program i turnusy. */
  | 'aktivni'
  /** Chystá se. Stránka smí říct záměr, ne program, cenu ani vybavení. */
  | 'chystame'

/** Klíč ikony dne. Schválně řetězec, ne komponenta z `lucide-react`: data
 *  musí jít načíst v testu (prostředí `node`) bez Reactu. Mapa klíč → ikona
 *  žije ve stránce, která dny vykresluje. */
export type IkonaDne = 'tisk' | 'model' | 'iot' | 'vr' | 'projekt'

export interface DenProgramu {
  den: string
  ikona: IkonaDne
  title: string
  description: string
  highlights: string[]
}

export interface Tabor {
  id: TaborId
  /** Plný název — do nadpisu stránky a na fakturu. */
  name: string
  /** Krátký název — na karty a do drobečků. */
  shortName: string
  status: TaborStatus
  /** Jedna až dvě věty na kartu. */
  perex: string
  /** Odstavec do hera stránky tématu. */
  popis: string
  focus: FocusId[]
  /**
   * „Co si dítě zkusí". U aktivního tábora se nechává prázdné a body se
   * odvodí ze zaměření (`focus.tryOut`), ať se stejný text nepíše dvakrát.
   * U chystaného tábora je povinné — zaměření pro něj obsah nemá.
   */
  zkusiSi?: string[]
  /** Program Po–Pá. Jen aktivní tábor; chystaný nesmí slibovat, co se bude dít. */
  program?: DenProgramu[]
  /** Otázky, které se týkají právě tohohle tématu. Obecné jsou v `site.ts`. */
  faq?: Array<{ question: string; answer: string }>
}

/**
 * Typický den. Jedna sdílená konstanta, ne kopie na každém táboře — rozvrh je
 * stejný pro všechna témata a čtyřikrát opsaný by se rozešel. Vykresluje se
 * jen na stránce aktivního tábora.
 */
export const DENNI_HARMONOGRAM = [
  { time: '8:00', title: 'Příchod dětí', description: '' },
  { time: '8:30', title: 'Ranní rozcvička', description: 'Krátká hra nebo výzva na rozehřátí před hlavním programem.' },
  { time: '9:00', title: 'Výukový blok I', description: 'Hlavní téma dne — výuka s lektorem, ukázky, diskuze.' },
  { time: '10:30', title: 'Přestávka', description: 'Svačina a pití.' },
  { time: '10:45', title: 'Výukový blok II', description: 'Praktická část — děti pracují samostatně nebo ve dvojicích na svém projektu.' },
  { time: '12:00', title: 'Oběd', description: 'Zajištěný oběd pro všechny účastníky (v ceně tábora).' },
  { time: '13:00', title: 'Venkovní aktivita', description: 'Pohyb, vzduch, hry. V případě špatného počasí organizovaný program uvnitř.' },
  { time: '14:00', title: 'Odpolední blok', description: 'Pokračování práce na projektech, nová témata nebo kreativní výzvy.' },
  { time: '15:00', title: 'Přestávka', description: 'Odpolední pauza a svačina.' },
  { time: '15:15', title: 'Tvůrčí práce', description: 'Samostatná práce na vlastním projektu, individuální přístup lektorů.' },
  { time: '16:00', title: 'Dokončení a úklid', description: 'Dokončení projektů, úklid pracoviště a shrnutí dne.' },
  { time: '17:00', title: 'Postupný odchod', description: 'Prostor pro dotazy rodičů.' },
] as const

/**
 * Ostrá data.
 *
 * POZOR — tři tábory ve stavu `chystame` jsou zatím jen záměr. Nemají potvrzený
 * program, termín, cenu ani vybavení a jejich texty psal Claude jako návrh
 * k opravě zakladatelem. Dokud nedodá potvrzené znění, nedoplňuje se sem
 * harmonogram, galerie, cena ani konkrétní technika — stejné pravidlo jako
 * u prázdných `reference` v `firmy.ts`.
 */
export const TABORY: Tabor[] = [
  {
    id: 'chytre-technologie',
    name: 'Tábor chytrých technologií',
    shortName: 'Chytré technologie',
    status: 'aktivni',
    perex:
      'Celý týden 3D tisk, 3D modelování a IoT s Arduinem. Hotový výrobek, který si dítě odveze domů.',
    popis:
      'Týden je rozdělený na dva tematické bloky — první tři dny věnujeme 3D tisku a modelování, ve čtvrtek a v pátek se vrhneme na IoT s Arduinem.',
    focus: ['3d-tisk', 'iot', 'vr'],
    program: [
      {
        den: 'Pondělí',
        ikona: 'tisk',
        title: '3D tisk — základy',
        description:
          'Úvod do světa 3D tisku. Jak tiskárna funguje, jak najít a připravit model a jak ho poslat na tisk. Každý si spustí svůj první výtisk.',
        highlights: ['Princip FDM tisku', 'Práce s modelem online', 'Spuštění prvního tisku'],
      },
      {
        den: 'Úterý',
        ikona: 'model',
        title: '3D modelování',
        description:
          'Z hotových modelů k vlastním kreacím. Děti se naučí základy 3D modelování a navrhnou vlastní objekt, který si druhý den vytisknou.',
        highlights: ['Základy 3D softwaru', 'Vlastní návrh modelu', 'Příprava pro tisk'],
      },
      {
        den: 'Středa',
        ikona: 'tisk',
        title: '3D tisk vlastních modelů',
        description:
          'Tisk vlastních návrhů z úterý, dokončování, broušení a finální úpravy. Vše si děti odnesou domů.',
        highlights: ['Tisk vlastních modelů', 'Post-processing', 'Hotové výtisky domů'],
      },
      {
        den: 'Čtvrtek',
        ikona: 'iot',
        title: 'IoT & Arduino — úvod',
        description:
          'Co je to IoT a k čemu slouží. Seznámení s Arduinem a Micro:bitem, práce se senzory a LED diodami, první programy.',
        highlights: ['Arduino & Micro:bit', 'Senzory a LED', 'První IoT obvod'],
      },
      {
        den: 'Pátek',
        ikona: 'projekt',
        // Bez slibu, že si dítě elektroniku odveze domů: modul `iot` ve
        // `focus.ts` říká, že Micro:bity a Arduina zůstávají v laboratoři.
        title: 'IoT projekt + výstava',
        description:
          'Dokončení vlastního IoT zařízení a malá výstava pro rodiče. Děti prezentují, co za týden vytvořily.',
        highlights: ['Vlastní IoT zařízení', 'Prezentace pro rodiče', 'Dokončený projekt'],
      },
    ],
  },
  {
    id: 'game-dev',
    name: 'Tábor herního vývoje',
    shortName: 'Herní vývoj',
    status: 'chystame',
    perex: 'Vlastní hra od nápadu po hratelnou verzi — úrovně, ovládání i zvuk.',
    popis:
      'Tábor teprve chystáme. Chceme na něm dojít od nápadu k hratelné hře, kterou si děti na konci týdne navzájem zahrají.',
    focus: ['herni-vyvoj'],
    zkusiSi: [
      'Postaví si vlastní úroveň a rozpohybuje v ní postavu',
      'Napíše pravidla hry — co se stane, když hráč vyhraje nebo prohraje',
      'Zkusí si, jak se do hry dostane zvuk a hudba',
      'Dá hru zahrát ostatním a uvidí, co jim v ní nefunguje',
    ],
  },
  {
    id: 'ai',
    name: 'Tábor umělé inteligence',
    shortName: 'Umělá inteligence',
    status: 'chystame',
    perex: 'Jak modely uvnitř fungují a jak se s nimi dá postavit něco vlastního.',
    popis:
      'Tábor teprve chystáme. Chceme na něm ukázat, co model doopravdy dělá, když odpovídá — a nechat děti postavit si vlastního pomocníka.',
    focus: [],
    zkusiSi: [
      'Zkusí si, co se v modelu děje, než odpoví',
      'Postaví si vlastního pomocníka na konkrétní úlohu',
      'Uvidí, kde se model splete a proč se mu nedá věřit slepě',
      'Vyzkouší generování obrázků a jeho hranice',
    ],
  },
  {
    id: 'webovy-tabor',
    name: 'Webový tábor',
    shortName: 'Weby',
    status: 'chystame',
    perex: 'Vlastní stránka, která žije na internetu — od návrhu po spuštění.',
    popis:
      'Tábor teprve chystáme. Chceme, aby si každé dítě odneslo adresu vlastní stránky, kterou může poslat kamarádům.',
    focus: [],
    zkusiSi: [
      'Napíše vlastní stránku v HTML a CSS',
      'Rozpohybuje ji kouskem JavaScriptu',
      'Vyzkouší si, jak vypadá na mobilu',
      'Vystaví ji na adresu, kterou si může otevřít kdokoli',
    ],
  },
]

/** Tábory v pořadí, v jakém se mají ukazovat: aktivní napřed. */
export function getTabory(list: Tabor[] = TABORY): Tabor[] {
  return list
    .slice()
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'aktivni' ? -1 : 1))
}

export function getTabor(id: string, list: Tabor[] = TABORY): Tabor | undefined {
  return list.find((t) => t.id === id)
}

export function getAktivniTabory(list: Tabor[] = TABORY): Tabor[] {
  return getTabory(list).filter((t) => t.status === 'aktivni')
}

export function getChystaneTabory(list: Tabor[] = TABORY): Tabor[] {
  return getTabory(list).filter((t) => t.status === 'chystame')
}

/**
 * Body „co si dítě zkusí". Vlastní body tábora mají přednost; jinak se
 * poskládají ze zaměření, aby se stejný text nepsal na dvou místech.
 */
export function zkusiSiTabora(tabor: Tabor): string[] {
  if (tabor.zkusiSi && tabor.zkusiSi.length > 0) return tabor.zkusiSi
  return getFocusModules(tabor.focus).flatMap((m) => m.tryOut)
}

/**
 * Kontrola úplnosti táborů. Hlídá to, co typový systém neuhlídá: jedinečnost
 * adres a to, že chystaný tábor nic neslibuje. Běží v testech nad ostrými daty.
 */
export function validateTabory(list: Tabor[] = TABORY): string[] {
  const problems: string[] = []
  const seen = new Set<string>()

  for (const tabor of list) {
    if (seen.has(tabor.id)) {
      problems.push(`Duplicitní id "${tabor.id}" — dva tábory by měly stejnou adresu.`)
    }
    seen.add(tabor.id)

    if (tabor.status === 'aktivni') {
      if (!tabor.program || tabor.program.length === 0) {
        problems.push(`Tábor "${tabor.id}" je aktivní, ale nemá program — stránka by byla prázdná.`)
      }
      if (tabor.focus.length === 0) {
        problems.push(`Tábor "${tabor.id}" je aktivní, ale nemá zaměření.`)
      }
    }

    if (tabor.status === 'chystame') {
      if (tabor.program) {
        problems.push(
          `Tábor "${tabor.id}" se teprve chystá, ale má program — chystaný tábor nesmí tvrdit, co se na něm bude dít.`
        )
      }
      if (!tabor.zkusiSi || tabor.zkusiSi.length === 0) {
        problems.push(
          `Tábor "${tabor.id}" se teprve chystá a nemá vlastní body „co si dítě zkusí" — ze zaměření je nemá odkud vzít.`
        )
      }
    }
  }

  return problems
}
```

- [ ] **Step 4: Spusť test a ověř, že prochází**

Run: `npm test -- src/lib/tabory.test.ts`
Expected: PASS, 9 testů.

- [ ] **Step 5: Test ostrých dat**

Vytvoř `src/lib/tabory-data.test.ts` (vzor: `turnusy-data.test.ts`):

```ts
import { describe, it, expect } from 'vitest'
import { TABORY, validateTabory, getAktivniTabory, zkusiSiTabora } from './tabory'

describe('ostrá data táborů', () => {
  it('seznam není prázdný — jinak by kontroly níž proběhly naprázdno', () => {
    expect(TABORY.length).toBeGreaterThan(0)
  })

  it('projdou kontrolou úplnosti', () => {
    expect(validateTabory(TABORY)).toEqual([])
  })

  it('aspoň jeden tábor je aktivní — jinak nemá web co prodávat', () => {
    expect(getAktivniTabory(TABORY).length).toBeGreaterThan(0)
  })

  it('každý tábor má perex i popis — jsou to jediné texty na kartě a v heru', () => {
    for (const tabor of TABORY) {
      expect(tabor.perex.length, `tábor ${tabor.id} — perex`).toBeGreaterThan(20)
      expect(tabor.popis.length, `tábor ${tabor.id} — popis`).toBeGreaterThan(20)
    }
  })

  it('každý tábor má aspoň tři body „co si dítě zkusí"', () => {
    for (const tabor of TABORY) {
      expect(zkusiSiTabora(tabor).length, `tábor ${tabor.id}`).toBeGreaterThanOrEqual(3)
    }
  })

  it('aktivní tábor má program na celý pracovní týden', () => {
    for (const tabor of getAktivniTabory(TABORY)) {
      expect(tabor.program, `tábor ${tabor.id}`).toHaveLength(5)
    }
  })
})
```

- [ ] **Step 6: Spusť celou sadu**

Run: `npm test`
Expected: PASS, všechny soubory včetně dvou nových.

- [ ] **Step 7: Commit**

```bash
git add src/lib/tabory.ts src/lib/tabory.test.ts src/lib/tabory-data.test.ts
git commit -m "feat(tabory): tábor jako samostatná entita nad turnusem

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Turnus ukazuje na tábor (`taborIds`), název na faktuře z tábora

`focus[]` se stěhuje z turnusu na tábor — moduly popisují téma, ne termín.
Všechno, co dnes čte `turnus.focus`, se přepíše na čtení přes tábor. Zároveň
`getTrustedProgramName` přestane skládat název ze zaměření a vezme název tábora.

**Files:**
- Modify: `src/lib/turnusy.ts` (rozhraní `Turnus`, data, `validateTurnusy`, komentář nad `TURNUSY`)
- Modify: `src/lib/payment-pricing.ts:65-74`
- Modify: `src/components/registration/RegistrationForm.tsx:80,134,165,181,246`
- Modify: `src/components/turnusy/TurnusCard.tsx:21`
- Modify: `src/app/tabor/page.tsx:181`, `src/app/tabor/[turnus]/page.tsx:105`
- Modify: `src/lib/turnusy.test.ts`, `src/lib/turnusy-data.test.ts`, `src/lib/payment-pricing.test.ts`
- Modify: `src/components/seo/schema-turnusy.test.ts`, `src/components/turnusy/turnus-card-labels.test.ts` (jen doplnění `taborIds` do testovacích dat)

**Interfaces:**
- Consumes: `TaborId`, `getTabor` z úkolu 1
- Produces:
  - `Turnus.taborIds: TaborId[]` (pole `focus` zaniká)
  - `getTaboryTurnusu(turnus: Turnus): Tabor[]`
  - `getFocusTurnusu(turnus: Turnus): FocusId[]`
  - `getTurnusyByTabor(taborId: TaborId, list?): Turnus[]`

- [ ] **Step 1: Napiš padající testy**

Do `src/lib/turnusy.test.ts` přidej nový blok (testovací turnusy v souboru
dostanou `taborIds: ['chytre-technologie']` místo `focus`):

```ts
describe('vazba turnusu na tábor', () => {
  it('getTaboryTurnusu vrátí tábory, na které turnus ukazuje', () => {
    const t = { ...otevreny, taborIds: ['chytre-technologie'] as TaborId[] }
    expect(getTaboryTurnusu(t).map((x) => x.id)).toEqual(['chytre-technologie'])
  })

  it('getFocusTurnusu poskládá zaměření z táborů, bez duplicit', () => {
    const t = { ...otevreny, taborIds: ['chytre-technologie'] as TaborId[] }
    const focus = getFocusTurnusu(t)
    expect(focus).toContain('3d-tisk')
    expect(new Set(focus).size).toBe(focus.length)
  })

  it('getTurnusyByTabor vybere jen turnusy daného tématu', () => {
    const a = { ...otevreny, id: 'a', slug: 'a', taborIds: ['chytre-technologie'] as TaborId[] }
    const b = { ...otevreny, id: 'b', slug: 'b', taborIds: ['game-dev'] as TaborId[] }
    expect(getTurnusyByTabor('chytre-technologie', [a, b]).map((t) => t.id)).toEqual(['a'])
  })

  it('validateTurnusy odhalí turnus bez tábora — karta by neměla co ukázat', () => {
    const t = { ...otevreny, taborIds: [] as TaborId[] }
    expect(validateTurnusy([t]).join(' ')).toContain(t.id)
  })

  it('validateTurnusy odhalí odkaz na neexistující tábor', () => {
    const t = { ...otevreny, taborIds: ['neexistuje' as TaborId] }
    expect(validateTurnusy([t]).join(' ')).toContain('neexistuje')
  })
})
```

V `src/lib/payment-pricing.test.ts` změň očekávaný název (řádky 91 a 96)
a fixturu (`focus: ['3d-tisk']` → `taborIds: ['chytre-technologie']`):

```ts
expect(nazev).toBe('Letní příměstský tábor (Chytré technologie)')
```

- [ ] **Step 2: Spusť testy a ověř, že padají**

Run: `npm test`
Expected: FAIL — `getTaboryTurnusu is not exported`, typové chyby u `taborIds`.

- [ ] **Step 3: Uprav `src/lib/turnusy.ts`**

1. Import: `import { getTabor, type Tabor, type TaborId } from './tabory'`
   a `import type { FocusId } from './focus'` (zůstává kvůli `getFocusTurnusu`).
2. V rozhraní `Turnus` nahraď `focus: FocusId[]` za:

```ts
  /**
   * Témata, kterým se na turnusu děti věnují (`src/lib/tabory.ts`).
   *
   * Pole, i když je v něm dnes vždy jeden prvek. Je to levná pojistka: až
   * poběží v jednom týdnu dvě paralelní skupiny s různými tématy, nevynutí si
   * to migraci `term_id` ani změnu adresy, která už je na faktuře.
   */
  taborIds: TaborId[]
```

3. V obou ostrých turnusech nahraď `focus: ['3d-tisk', 'iot', 'vr'],` za
   `taborIds: ['chytre-technologie'],`.
4. V komentáři nad `TURNUSY` přepiš odstavec „POZOR — název programu na faktuře":
   `RegistrationForm` ukládá do `program` id tábora (`turnus.taborIds[0]`,
   např. `'chytre-technologie'`), název odvozuje `getTrustedProgramName` z entity
   tábor.
5. Přidej funkce:

```ts
/** Tábory (témata), kterým se turnus věnuje. Neznámé id se tiše přeskočí —
 *  na nesmysl v datech upozorní `validateTurnusy`, ne prázdná stránka. */
export function getTaboryTurnusu(turnus: Turnus): Tabor[] {
  return turnus.taborIds
    .map((id) => getTabor(id))
    .filter((t): t is Tabor => t !== undefined)
}

/** Zaměření turnusu — sjednocení zaměření jeho táborů, bez duplicit. */
export function getFocusTurnusu(turnus: Turnus): FocusId[] {
  return Array.from(new Set(getTaboryTurnusu(turnus).flatMap((t) => t.focus)))
}

/** Turnusy jednoho tématu — pro stránku tábora a pro výpis seskupený podle města. */
export function getTurnusyByTabor(taborId: TaborId, list: Turnus[] = TURNUSY): Turnus[] {
  return getTurnusy(list).filter((t) => t.taborIds.includes(taborId))
}
```

6. Do `validateTurnusy` přidej do smyčky:

```ts
    if (turnus.taborIds.length === 0) {
      problems.push(`Turnus "${turnus.id}": chybí tábor — karta by neměla co ukázat.`)
    }

    for (const taborId of turnus.taborIds) {
      if (getTabor(taborId) === undefined) {
        problems.push(
          `Turnus "${turnus.id}": odkazuje na neexistující tábor "${taborId}".`
        )
      }
    }
```

- [ ] **Step 4: Přepiš konzumenty `turnus.focus`**

- `src/lib/payment-pricing.ts:65-74` — místo `getFocusModules(turnus.focus)`:

```ts
  const temata = getTaboryTurnusu(turnus).map((t) => t.shortName)
  return temata.length > 0
    ? `Letní příměstský tábor (${temata.join(', ')})`
    : 'Letní příměstský tábor'
```

  Import `getFocusModules` ze souboru odstraň, přidej `getTaboryTurnusu`.
  **Poznámka:** název na faktuře se tím zkracuje z
  „Letní příměstský tábor (3D tisk, IoT a elektronika, Virtuální realita)"
  na „Letní příměstský tábor (Chytré technologie)". Je to záměr — faktura má
  pojmenovat tábor, ne vyjmenovat jeho obsah.

- `src/components/registration/RegistrationForm.tsx` — `turnus.focus[0] ?? ''`
  → `turnus.taborIds[0] ?? ''` na řádcích 80, 134, 165, 181; na řádku 246
  `getFocusModules(turnus.focus)` → `getFocusTurnusu(turnus)` obalené
  `getFocusModules(...)`.
- `src/components/turnusy/TurnusCard.tsx:21` — `getFocusModules(getFocusTurnusu(turnus))`.
- `src/app/tabor/page.tsx:181` — `turnusy.flatMap((t) => getFocusTurnusu(t))`.
- `src/app/tabor/[turnus]/page.tsx:105` — `getFocusModules(getFocusTurnusu(turnus))`.
- `src/lib/turnusy-data.test.ts:21` — test „každý turnus má aspoň jedno
  zaměření" přepiš na `taborIds`:

```ts
  it('každý turnus ukazuje aspoň na jeden tábor', () => {
    for (const turnus of TURNUSY) {
      expect(turnus.taborIds.length, `turnus ${turnus.id}`).toBeGreaterThan(0)
    }
  })
```

- Ve fixturách `schema-turnusy.test.ts` a `turnus-card-labels.test.ts` nahraď
  `focus: [...]` za `taborIds: ['chytre-technologie']`.

- [ ] **Step 5: Spusť testy a build**

Run: `npm test`
Expected: PASS.

Run: `npm run build`
Expected: úspěšný build, žádná typová chyba.

- [ ] **Step 6: Commit**

```bash
git add src/lib src/components src/app/tabor
git commit -m "refactor(turnusy): zaměření patří tématu, turnus na něj jen ukazuje

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: `/tabory` — výpis město → téma → termín

Rodič vybírá v pořadí město → téma → termín. Výpis je proto seskupený podle
města, uvnitř města řádek na téma, a pod tím turnusy. Sem se stěhují karty míst
konání z rušené `KdeASKym`.

**Files:**
- Create: `src/app/tabory/layout.tsx`
- Create: `src/app/tabory/page.tsx`
- Create: `src/components/tabory/TaborCard.tsx`
- Reference (zdroj obsahu, zatím se nemaže): `src/app/tabor/page.tsx`,
  `src/components/sections/KdeASKym.tsx`

**Interfaces:**
- Consumes: `getTabory`, `getAktivniTabory`, `getChystaneTabory` (úkol 1),
  `getTurnusyByTabor`, `getCitiesWithTurnusy`, `getTurnusyByCity` (úkol 2),
  `filtrMest`, `platneMesto` z `TurnusList.tsx`
- Produces: `TaborCard` — `{ tabor: Tabor; turnusy?: Turnus[]; href: string }`

- [ ] **Step 1: `layout.tsx` s metadaty**

Vytvoř `src/app/tabory/layout.tsx` podle `src/app/tabor/layout.tsx` (45 řádků):
stejná struktura, jen `title`/`description`/`canonical` mluví o všech táborech,
ne o jednom tématu, a canonical je `${SITE.url}/tabory`.
**Drobečkové JSON-LD sem nepatří** — tenhle layout obaluje i `[tema]`
a `termin/[slug]`, takže by se na nich vykreslily dvě protichůdné cesty
(důvod je popsaný v komentáři v `src/app/tabor/page.tsx:189-203`).

- [ ] **Step 2: `TaborCard`**

Vytvoř `src/components/tabory/TaborCard.tsx` — klientská komponenta (`'use client'`,
Framer Motion). Karta nese: barevný pruh `bg-accent-400` nahoře (role „technologie"),
`shortName` jako nadpis, odznak stavu (`bg-cta-300` + `border-ink` pro „Chystáme",
role „akce a stav"), perex, a pak:
- u aktivního tábora s turnusy: seznam turnusů (datum/cena/místo z `turnusLabels`)
  a CTA `Zobrazit tábor` na `/tabory/{tabor.id}`,
- u chystaného: CTA `Chci vědět víc` na `/tabory/{tabor.id}`.

Vizuální jazyk vezmi z karty turnusu ve variantě B
(`src/components/nahled/VariantaB.tsx:180-250`): `card-maker`, `mono-label`,
`<dl>` s `<dt>` před `<dd>`.

- [ ] **Step 3: Stránka `/tabory`**

Vytvoř `src/app/tabory/page.tsx` jako klientskou stránku (`'use client'` —
potřebuje `useSearchParams` pro `?mesto=`, stejně jako dnešní `/tabor`):

1. `BreadcrumbSchema` + viditelný drobeček `Domů / Tábory`.
2. **Hero** (`bg-ink blueprint-grid-dark`, tmavá kotva stránky): H1 „Letní
   příměstské tábory", perex, a `<dl>` se společnými fakty — Po–Pá, 8:00–17:00,
   9–15 let, max 15 dětí, oběd v ceně. Animuje se posun, ne viditelnost.
3. **Pruh technologií** `bg-cta-400 border-y border-ink` (předěl, viz Global Constraints).
4. **Filtr měst** — `filtrMest` + `platneMesto` z `TurnusList.tsx`, zabalené
   v `<Suspense>` (vzor: `TaborInterestForm` v `src/app/tabor/page.tsx:141-154`).
5. **Sekce na město** (`getCitiesWithTurnusy`): nadpis města, karta místa konání
   přenesená z `KdeASKym.tsx` (název, popis, odkaz do map — bez slova „partner"),
   a `TaborCard` za každé téma, které v tom městě turnus má.
6. **Sekce „Co chystáme"** (`bg-paper-soft`): `getChystaneTabory()` jako
   `TaborCard` bez turnusů. Sekce musí říct, že jde o záměr bez termínu.
7. **Závěrečný amber blok** s `TurnusInterestForm` (`source="tabory"`).

- [ ] **Step 4: Ověř v prohlížeči**

Run: `npm run dev` (běží-li, stačí otevřít)
Otevři `http://localhost:3000/tabory` a zkontroluj:
- sekce Praha i Karlovy Vary, v každé karta tématu „Chytré technologie",
- u Karlových Varů karta místa FabLab VARY&TE, u Prahy ne (místo není),
- `?mesto=karlovy-vary` schová pražskou sekci,
- tři chystané tábory v sekci „Co chystáme",
- žádné dvě sousední sekce se stejným pozadím bez linky.

- [ ] **Step 5: Build a commit**

Run: `npm run build`
Expected: `/tabory` se vygeneruje bez chyby.

```bash
git add src/app/tabory src/components/tabory
git commit -m "feat(tabory): výpis táborů vede rodiče přes město, téma a termín

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: `/tabory/[tema]` — popis tábora

Aktivní tábor dostane osm z deseti dnešních bloků `/tabor`. Chystaný je
schválně chudší — perex, „co si dítě zkusí", formulář zájmu a odkaz na běžící
tábor. Nic víc.

**Files:**
- Create: `src/app/tabory/[tema]/page.tsx`
- Reference: `src/app/tabor/page.tsx` (bloky k přenesení)

**Interfaces:**
- Consumes: `getTabor`, `getTabory`, `zkusiSiTabora`, `DENNI_HARMONOGRAM`,
  `getTurnusyByTabor`, `getFocusModules`, `getSiteFaq`
- Produces: statické cesty přes `generateStaticParams()` ze všech `TABORY`

- [ ] **Step 1: Kostra stránky**

Serverová komponenta (žádné `'use client'` — FAQ harmonika se vyřeší
`FAQSection`, která klientská je):

```tsx
export function generateStaticParams() {
  return getTabory().map((t) => ({ tema: t.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ tema: string }> }) {
  const { tema } = await params
  const tabor = getTabor(tema)
  if (!tabor) return {}
  return {
    title: `${tabor.name} | Weeks`,
    description: tabor.perex,
    alternates: { canonical: `${SITE.url}/tabory/${tabor.id}` },
  }
}

export default async function TaborTemaPage({ params }: { params: Promise<{ tema: string }> }) {
  const { tema } = await params
  const tabor = getTabor(tema)
  if (!tabor) notFound()
  const turnusy = getTurnusyByTabor(tabor.id)
  // …
}
```

- [ ] **Step 2: Bloky pro `aktivni`**

Přenes z `src/app/tabor/page.tsx` (řádky v závorce jsou zdroj):
- hero (206–310) — nadpis z `tabor.name`, perex z `tabor.popis`, drobeček
  `Domů / Tábory / {tabor.shortName}`, spec sheet beze změny;
- „O programu" s moduly zaměření (311–372) — `getFocusModules(tabor.focus)`;
  k modulu IoT patří fotka `/images/tabor/iot-led-palec.webp` (dítě u rozsvíceného
  obvodu), `alt` popisuje, co na ní je, `loading="lazy"`;
- týdenní přehled (373–426) — čte `tabor.program`, ikony přes mapu
  `{ tisk: Printer, model: Box, iot: Cpu, vr: Headset, projekt: Sparkles }`,
  barvy podle role: technologie = `accent`;
- typický den (427–470) — `DENNI_HARMONOGRAM`;
- praktické informace (476–533);
- `ProjectGallery` z galerií zaměření tábora (534–536);
- seznam turnusů (537–576) — `turnusy` tohohle tématu, odkazy na
  `/tabory/termin/{slug}`;
- FAQ (577–604) — `getSiteFaq()` + `faq` z modulů zaměření + `tabor.faq`;
- závěrečné CTA (605–663) — amber blok podle varianty B, ne dnešní trojbarevný
  gradient: `from-accent-600 via-primary-600 to-trust-600` míchá tři role
  najednou a padá s pravidlem barev.

- [ ] **Step 3: Bloky pro `chystame`**

Jen: hero (bez spec sheetu — Po–Pá a cena nejsou u chystaného tématu jisté),
„Co si dítě zkusí" ze `zkusiSiTabora(tabor)`, `TurnusInterestForm`
(`source={'tabor-' + tabor.id}`) jako hlavní obsah, a blok s odkazem na běžící
tábor („Zatím běží: Tábor chytrých technologií →").
**Žádný program, harmonogram, galerie, cena ani seznam turnusů.**

- [ ] **Step 4: Ověř v prohlížeči**

Otevři `/tabory/chytre-technologie` (plná stránka) a `/tabory/game-dev`,
`/tabory/ai`, `/tabory/webovy-tabor` (chudé stránky). Ověř, že chystaná stránka
nikde neuvádí cenu, termín ani vybavení, a že `/tabory/neexistuje` vrací 404.

- [ ] **Step 5: Build a commit**

Run: `npm run build`
Expected: čtyři statické stránky `/tabory/[tema]`.

```bash
git add src/app/tabory
git commit -m "feat(tabory): stránka tématu nese popis tábora, chystaný nic neslibuje

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: `/tabory/termin/[slug]` — konkrétní turnus

Nejkratší ze tří stránek. Popis tématu se sem **neduplikuje** — jinak by web měl
sadu skoro shodných stránek a vyhledávač by si z nich vybral jednu sám.

**Files:**
- Create: `src/app/tabory/termin/[slug]/page.tsx`
- Reference: `src/app/tabor/[turnus]/page.tsx` (323 řádků — zdroj)

- [ ] **Step 1: Přenes stránku turnusu**

Zkopíruj `src/app/tabor/[turnus]/page.tsx` na novou cestu a zkrať ji:
- **nahoře** odkaz „Celý popis tábora →" na `/tabory/{taborIds[0]}`,
- ponech: hero (město, místo, datum, cena, kapacita), `SpotsLeft`, registrační
  nebo zájmové CTA, `VenueShowcase`, „Další termíny",
- **vyhoď** bloky, které opakují popis tématu (moduly zaměření v plném znění,
  týdenní program, galerii) a nahraď je třemi body výtahu ze `zkusiSiTabora`,
- `EventSchema` a `BreadcrumbSchema` zůstávají; drobeček je
  `Domů / Tábory / {tabor.shortName} / {město + termín}`.

- [ ] **Step 2: Ověř, že schema mlčí**

Run: `npm test -- src/components/seo/schema-turnusy.test.ts`
Expected: PASS — oba ostré turnusy jsou `chystame`, takže `turnusyProSchema()`
vrací prázdné pole a stránka neemituje `Event`.

Otevři `/tabory/termin/karlovy-vary-leto-2027`, v HTML ověř, že není
`"@type":"Event"`, ale je `BreadcrumbList`.

- [ ] **Step 3: Build a commit**

```bash
git add src/app/tabory
git commit -m "feat(tabory): stránka termínu je krátká a popis tématu neopakuje

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Přesměrování, sitemapa, navigace, smazání `/tabor`

`/tabor` nikdy nebyl v indexu (žije jen na `feat/web-2027`), takže se adresy
mění zadarmo a nevzniká řetěz 301 → 301.

**Files:**
- Modify: `next.config.js` (blok `redirects()`)
- Modify: `src/app/sitemap.ts`, `src/app/api/revalidate/route.ts`
- Modify: `src/components/layout/Header.tsx:12,24`, `Footer.tsx:10`
- Modify: `src/components/sections/{HeroSection,NejblizsiTurnusy,Rozcesti,ContactSection}.tsx`,
  `src/components/turnusy/{TurnusCard,TurnusList}.tsx`,
  `src/components/registration/RegistrationForm.tsx`,
  `src/app/{kontakt,podminky}/page.tsx`, `src/components/seo/StructuredData.tsx:105`
- Delete: `src/app/tabor/` (4 soubory)

- [ ] **Step 1: Přesměrování**

V `next.config.js` přepiš cíl u stávajících pravidel z `/tabor` na `/tabory`
(`/program`, `/tabor-chytrych-technologii`, `/tabor-3d-tisk`, `/tabor-iot`,
`/kveten`, tři karlovarské na `/tabory?mesto=karlovy-vary`) a přidej dvě nová:

```js
      // `/tabor` byl jednostránkový detail na adrese rozcestníku; témat je teď víc.
      { source: '/tabor', destination: '/tabory', permanent: true },
      { source: '/tabor/:slug', destination: '/tabory/termin/:slug', permanent: true },
```

- [ ] **Step 2: Sitemapa a revalidace**

`src/app/sitemap.ts`: `/tabor` → `/tabory`, turnusy na `/tabory/termin/{slug}`,
a přidej řádek za každý tábor z `getTabory()` (`priority: 0.9` u aktivního,
`0.6` u chystaného).
`src/app/api/revalidate/route.ts`: `revalidatePath('/tabory', 'layout')`.

- [ ] **Step 3: Odkazy napříč webem**

Projdi výskyty a přepiš:

Run: `grep -rn "/tabor\b\|/tabor#\|/tabor/" src --include=*.tsx --include=*.ts`

- `Header.tsx:12` a `Footer.tsx:10` — `{ name: 'Tábory', href: '/tabory' }`,
- `Header.tsx:24` — `ctaHref = '/tabory'` (kotva `#turnusy` na výpisu neexistuje),
- `/tabor#turnusy` → `/tabory`, `/tabor#program` → `/tabory/chytre-technologie#program`,
- `TurnusCard.tsx` — `ctaHref ?? '/tabory/termin/' + turnus.slug`,
- `StructuredData.tsx:105` — `${SITE.url}/tabory/termin/${turnus.slug}`,
- `TurnusList.tsx` — `/tabory?mesto=${m.id}`.

- [ ] **Step 4: Smaž starou větev rout**

```bash
git rm -r src/app/tabor
```

- [ ] **Step 5: Ověř**

Run: `npm test && npm run build`
Expected: PASS a build bez chyb; v `.next` nesmí zbýt route `/tabor`.

Run: `grep -rn "\"/tabor\"\|'/tabor'\|/tabor#\|/tabor/" src --include=*.tsx --include=*.ts`
Expected: žádný výsledek mimo komentáře vysvětlující přesměrování.

V prohlížeči ověř, že `http://localhost:3000/tabor` skončí na `/tabory`
a `/tabor/praha-leto-2027` na `/tabory/termin/praha-leto-2027`.

- [ ] **Step 6: Commit**

```bash
git add -u && git add next.config.js
git commit -m "feat(routy): tábory mají tři úrovně adres, staré cesty na ně míří

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Interaktivní mřížka, tmavý hero, amber pruh

Začátek vizuálního systému. `MrizkaSekce` se z náhledů stěhuje mezi běžné
komponenty a přestává být prototypem.

**Files:**
- Create: `src/components/ui/MrizkaSekce.tsx` (přesun z `src/components/nahled/`)
- Modify: `src/components/sections/HeroSection.tsx`, `src/components/ui/TickerStrip.tsx`
- Modify: `src/components/nahled/VariantaB.tsx` (import nové cesty, aby náhled
  do úklidu v úkolu 12 pořád fungoval)

- [ ] **Step 1: Přesuň `MrizkaSekce`**

```bash
git mv src/components/nahled/MrizkaSekce.tsx src/components/ui/MrizkaSekce.tsx
```

Přepiš úvodní komentář: už to není náhledová komponenta. Zbytek kódu zůstává —
úklid časovačů v `useEffect` je jeho hlavní přednost proti verzi v heru.
Oprav import ve `VariantaB.tsx` na `@/components/ui/MrizkaSekce`.

- [ ] **Step 2: Hero na tmavou**

`HeroSection.tsx` přepiš podle `VariantaB.tsx:95-160`:
- sekce `bg-ink blueprint-grid-dark`, ghost „W" vpravo nahoře,
- dvousloupcový grid: text vlevo, fotka `/images/hwlab/hero-print-day.webp`
  v posunutém amber rámu vpravo (`translate-x-4 translate-y-4 bg-cta-400`),
- **interaktivní mřížka se z hera odstraní** — přesouvá se do sekce „Co si
  postaví" (úkol 8). Smaž stavy a časovače, které ji v `HeroSection` obsluhují.
- animace: H1, perex a CTA animují jen `y`, ne `opacity` (dnešní hero má
  `initial: { opacity: 0 }` — obsah se ztratí pokaždé, když se animace nespustí),
- trojstav textu tlačítka (`prodejny` / `vyprodano` / jinak) zůstává,
  jen odkaz míří na `/tabory`.

- [ ] **Step 3: Ticker na amber**

`TickerStrip.tsx`: tmavý pruh → `bg-cta-400 border-y border-ink`, text `text-ink`
(viz `VariantaB.tsx:163-174`). Obsah hesel zůstává.

- [ ] **Step 4: Ověř**

Otevři `/` a porovnej s `/nahled/b`. Zkontroluj, že hero drží kontrast
(text `paper` na `ink`), fotka má `alt` a `priority`, a že se s vypnutým
JavaScriptem (DevTools → Settings → Debugger → Disable JavaScript) H1 pořád
vykreslí.

- [ ] **Step 5: Build a commit**

```bash
git add -A src/components
git commit -m "feat(vizual): tmavý hero se skupinovou fotkou a amber pruh pod ním

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Úvodka — rytmus sekcí, rodiče a děti zvlášť

Dnešní `USPSection` je jeden seznam šesti dlaždic bez adresáta. Rozdělí se na
emerald pás pro rodiče a tmavý cyan blok pro děti, mezi ně přijde fotopás.

**Files:**
- Create: `src/components/sections/ProRodice.tsx`, `ProDeti.tsx`, `FotoPas.tsx`
- Modify: `src/app/page.tsx`, `src/components/sections/ContactSection.tsx`,
  `Rozcesti.tsx`, `NejblizsiTurnusy.tsx`
- Delete: `src/components/sections/USPSection.tsx`

- [ ] **Step 1: Tři nové sekce**

- `ProRodice.tsx` — `border-y border-trust-200 bg-trust-50 section-padding`,
  tři body z `VariantaB.tsx:36-56`: 1:5, proškolení v první pomoci, 8–17.
  Doplň sem i větu „max 15 dětí" z rušené `KdeASKym` (úkol 9).
- `ProDeti.tsx` — `<MrizkaSekce odstin="tmavy" className="section-padding bg-ink blueprint-grid-dark">`,
  tři karty z `VariantaB.tsx:58-76` (3D tisk, IoT, VR) s ikonami `text-accent-400`.
- `FotoPas.tsx` — fotka `/images/tabor/venku-sablona.webp` přes celou šířku
  s přechodem a tvrzením „Po obědě se jde ven" (`VariantaB.tsx:283-305`).
  Tvrzení musí sedět na `DENNI_HARMONOGRAM` (13:00 venkovní aktivita).
  Obrázek dostane `loading="lazy"` — je pod ohybem.

- [ ] **Step 2: Závěrečný amber blok**

`ContactSection.tsx`: sekce dostane `border-y border-ink bg-cta-400`, ghost „W",
nadpis „Chcete být u toho, až turnusy otevřeme?" a **e-mailový formulář se
souhlasem GDPR zůstává** — je to jediný sběr kontaktů na úvodce. Kontaktní
údaje (telefon, e-mail) zůstávají taky, jen v amber podání.

- [ ] **Step 3: Pořadí sekcí v `src/app/page.tsx`**

```tsx
        <HeroSection />        {/* ink + mřížka */}
        <TickerStrip />        {/* cta-400 + border-y */}
        <NejblizsiTurnusy />   {/* paper */}
        <ProRodice />          {/* trust-50 + border-y */}
        <FotoPas />            {/* fotka */}
        <ProDeti />            {/* ink + interaktivní mřížka */}
        <Rozcesti />           {/* paper-soft */}
        <FAQSection />         {/* paper */}
        <ContactSection />     {/* cta-400 + border-y */}
```

`KdeASKym` z importů i ze stromu zmizí (mazání v úkolu 9), `USPSection` se maže
teď — obsah je rozdělený do `ProRodice` a `ProDeti`.

- [ ] **Step 4: Ověř rytmus**

Projdi `/` odshora dolů a ověř, že **žádné dvě sousední sekce nemají stejné
pozadí bez linky**. Zkontroluj `NejblizsiTurnusy` (paper) vs. `ProRodice`
(trust-50) — předěl je změnou pozadí, to stačí.

Ověř i s `prefers-reduced-motion` (DevTools → Rendering → Emulate CSS
prefers-reduced-motion: reduce): mřížka v `ProDeti` se nespustí a sekce
vypadá normálně.

- [ ] **Step 5: Build a commit**

```bash
git add -A src/app/page.tsx src/components/sections
git commit -m "feat(uvodka): rodiče a děti dostali vlastní sekci, mezi ně patří předěl

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Úklid — `KdeASKym`, KV nudge, `btn-outline`

**Files:**
- Delete: `src/components/sections/KdeASKym.tsx`, `src/components/ui/KVRegionNudge.tsx`,
  `src/app/api/geo/route.ts`
- Modify: `src/app/layout.tsx:6,129`, `src/app/globals.css:43-49`,
  `src/app/firmy/page.tsx` (dočasně — plná úprava v úkolu 10)

- [ ] **Step 1: Ověř, že se obsah `KdeASKym` opravdu nikde neztratil**

| Obsah | Nový domov | Hotovo v |
|---|---|---|
| Místa konání (FabLab) | `/tabory`, ke svému městu | úkol 3 |
| Tým (3 jména) | `/o-nas` (tady to byl duplikát) | už tam je |
| 1:5 · první pomoc · max 15 | `ProRodice` | úkol 8 |
| Telefon + e-mail | `ContactSection` + `Footer` | už tam jsou |

Run: `grep -rn "KdeASKym" src`
Expected: jen `src/app/page.tsx` (odstraněno v úkolu 8) a `src/app/firmy/page.tsx`.

- [ ] **Step 2: Smaž**

```bash
git rm src/components/sections/KdeASKym.tsx src/components/ui/KVRegionNudge.tsx src/app/api/geo/route.ts
```

Z `src/app/layout.tsx` odstraň import (řádek 6) i mount (řádek 129).
Ve `firmy/page.tsx` nahraď `<KdeASKym />` zatím prázdnem — vlastní blok
„Kde to proběhne" přijde v úkolu 10.

- [ ] **Step 3: `btn-outline` dostane `gap-2`**

`src/app/globals.css:44` — `@apply inline-flex items-center justify-center gap-2 px-6 py-3`.
Opraví to všechna tlačítka s ikonou naráz (nejvíc vidět u „Mám zájem"
se srdíčkem v e-shopu).

- [ ] **Step 4: Ověř**

Run: `grep -rn "KVRegionNudge\|api/geo\|KdeASKym" src`
Expected: žádný výsledek.

Run: `npm run build`
Expected: PASS.

V prohlížeči zkontroluj e-shop (`/eshop`) — mezera mezi ikonou a textem tlačítka.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(uklid): rozpustit KdeASKym, smazat KV nudge a srovnat btn-outline

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: `/firmy`

**Files:**
- Modify: `src/app/firmy/page.tsx`

- [ ] **Step 1: Blok „Kde to proběhne"**

Místo `KdeASKym` (která tvrdila pevné místo konání) krátký blok se třemi
možnostmi: u vás ve firmě, v našem prostoru, nebo v partnerském — třeba ve
FabLabu VARY&TE, kde běží tábory. **FabLab jako možnost, ne jako dané místo**,
a nikde slovo „partner" ve smyslu podepsané spolupráce.

- [ ] **Step 2: Tmavý blok a odlišené nabídky**

- Mezi nabídky a poptávkový formulář vlož tmavý blok (`bg-ink blueprint-grid-dark`)
  s ghost „W" — kotva stránky podle Global Constraints.
- Nabídky dostanou číslování `01 / 02 / 03` (`mono-label`) a ikony odlišené
  podle role, ne třikrát stejné indigo.
- `reference` zůstává prázdné a `PARTNERSTVI_ZATIM` zůstává v textu.
  **Žádná reference, cena ani počet odbavených firem.**

- [ ] **Step 3: Ověř a commit**

Otevři `/firmy`, projdi shora dolů: aspoň jeden tmavý blok, předěl mezi
sousedními sekcemi, formulář pořád posílá `typ` (`?typ=` režimy fungují).

```bash
git add src/app/firmy && git commit -m "feat(firmy): místo se u firem domlouvá, stránka to konečně říká

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: `/o-nas` a vizuální sjednocení zbylých stránek

**Files:**
- Modify: `src/app/o-nas/page.tsx`
- Modify: `src/app/kontakt/page.tsx`, `src/app/gdpr/page.tsx`, `src/app/podminky/page.tsx`

- [ ] **Step 1: Reálné fotky místo prostor FabLabu**

Dnes stránka ukazuje tři fotky FabLabu z `cities.ts`, zatímco čtrnáct fotek
z táborů v `public/images/hwlab/` používá jediné místo. Zapoj je — hlavní je
`/images/tabor/skupina-terasa.webp` (skupina s lektorem na terase).
Všechny s `alt` a `loading="lazy"`.

**Nikde nesmí vzniknout tvrzení, že HWLab je pořadatel nebo místo konání** —
název složky je historický zbytek.

- [ ] **Step 2: Tmavý blok**

Přidej tmavou sekci (tým nebo „jak tábor vypadá") — stránka se dnes čte jako
dlouhý krémový svitek.

- [ ] **Step 3: `/kontakt`, `/gdpr`, `/podminky`**

Obsahově jsou hotové, mění se jen vizuál podle systému:
- `/kontakt` dostane tmavý blok (kontaktní údaje nebo mapa), aby se stránka
  nečetla jako dlouhý krémový svitek,
- na všech třech projdi rytmus sekcí — dvě sousední sekce se stejným pozadím
  dostanou `border-y border-ink/15`,
- barvy srovnej do rolí: odkaz `primary`, akce `cta`.
**Texty se nemění.** `/gdpr` a `/podminky` jsou právní dokumenty.

- [ ] **Step 4: Ověř a commit**

```bash
git add src/app/o-nas src/app/kontakt src/app/gdpr src/app/podminky
git commit -m "feat(o-nas): ukázat lidi a tábor na reálných fotkách

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Úklid náhledů, kontrola a `CLAUDE.md`

**Files:**
- Delete: `src/app/nahled/`, `src/components/nahled/`
- Modify: `CLAUDE.md`
- Modify: `docs/superpowers/specs/2026-09-21-web-2027-faze-6-tabory-a-vizual-design.md`
  (hlavička `Stav:`)

- [ ] **Step 1: Smaž náhledy**

```bash
rm -rf src/app/nahled src/components/nahled
```

(Jsou neverzované — `git rm` na ně nesedí.)

Run: `grep -rn "nahled" src`
Expected: žádný výsledek.

- [ ] **Step 2: Kontrola strukturovaných dat**

Run: `npm test`
Expected: PASS včetně `schema-turnusy.test.ts` a `turnusy.test.ts`.

Otevři `/tabory`, `/tabory/chytre-technologie`, `/tabory/game-dev`,
`/tabory/termin/praha-leto-2027`, `/firmy`, `/o-nas`, `/kontakt` a v HTML ověř:
- každá stránka má právě jeden `BreadcrumbList`,
- žádná nemá `"@type":"Event"` (oba turnusy jsou `chystame`),
- drobečkové JSON-LD odpovídá viditelnému drobečku.

- [ ] **Step 3: `CLAUDE.md`**

Přepiš:
- strom `/src/app` — `/tabor` → `/tabory`, `[tema]`, `termin/[slug]`,
- `/src/lib` — přidej `tabory.ts`, u `turnusy.ts` zmiň `taborIds`,
- `/src/components` — `tabory/`, `ui/MrizkaSekce.tsx`, pryč `KdeASKym`, `KVRegionNudge`, `USPSection`,
- sekci „Product: turnus-based summer camp" — dvě entity místo jedné,
- „Redirects" — nová pravidla,
- přidej sekci „Phase 6" po vzoru „Phase 5" (co udělala, co schválně ne),
- pravidlo rolí barev a rytmu sekcí do „Design System".

- [ ] **Step 4: Stav specu**

Ve specu přepiš hlavičku na `**Stav:** implementováno 2026-09-…` a doplň
odkaz na tenhle plán.

- [ ] **Step 5: Závěrečné ověření**

Run: `npm test && npm run build`
Expected: obojí PASS.

- [ ] **Step 6: Commit**

```bash
git add -u && git add CLAUDE.md docs/superpowers
git commit -m "docs: popsat web po šesté fázi a uklidit náhledové routy

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Hotovo, když

- `npm test` i `npm run build` procházejí.
- `/tabory`, `/tabory/[tema]` (4×) a `/tabory/termin/[slug]` (2×) vracejí 200,
  `/tabor` a `/tabor/[slug]` přesměrovávají trvale.
- `turnus.focus` v repozitáři neexistuje; zaměření se čte přes tábor.
- Název na faktuře i v e-mailech se odvozuje z tábora (`getTrustedProgramName`).
- Chystané tábory nikde neuvádějí program, cenu, termín ani vybavení.
- Žádné dvě sousední sekce nemají stejné pozadí bez linky; každá stránka má
  aspoň jeden tmavý blok.
- `KdeASKym`, `KVRegionNudge`, `/api/geo`, `USPSection` a `nahled/*` jsou pryč
  a jejich obsah má nový domov.
- `CLAUDE.md` popisuje web, který v repozitáři opravdu je.

## Co tahle fáze schválně nedělá

- **Nevypisuje letní termíny 2027.** Turnusy zůstávají `chystame`; až přijdou
  termíny, doplní se `start`, `end`, `priceKc`, `venueId` a stav se překlopí.
- **Nesahá na registrační a platební tok.** Mění se jen odvození názvu tábora.
- **Nedoplňuje obsah chystaných táborů nad rámec záměru** — texty jsou návrh
  k opravě zakladatelem.
- **Nemění e-shop** kromě `gap-2` na `btn-outline`.

## Otevřené vstupy od týmu

- **Texty tří chystaných táborů** (`src/lib/tabory.ts`, stav `chystame`) —
  napsal Claude jako návrh, zakladatel opraví před nasazením.
- **Fotky z reálného tábora navíc** — zakladatel zmínil, že další dodá.
