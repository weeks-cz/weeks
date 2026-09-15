# Fáze 1: Datový model turnusů — implementační plán

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nahradit tři rozházené zdroje pravdy o tom, co se prodává, jednou entitou „turnus" a přepnout na ni důvěryhodné odvození ceny a kapacity.

**Architecture:** Nové moduly `cities.ts`, `focus.ts` a `turnusy.ts` v `src/lib/` zavádějí město jako číselník, zaměření jako obsahový modul a turnus jako jedinou prodejní jednotku. Výběrové funkce jsou čisté a berou seznam turnusů jako nepovinný parametr, takže testy pracují s fixturami místo ostrých dat. Trust chain (`payment-pricing.ts` → `/api/register`) přechází z dvojice `location_id` + `program` na `term_id`. Platba a upomínka přestávají cenu odvozovat a čtou částku uloženou u registrace. Stránky se v této fázi **nemění** — `locations.ts` zůstává naživu pro staré stránky až do fáze 2.

**Tech Stack:** TypeScript, Next.js 16 (App Router), Vitest 2, Zod, Supabase.

**Spec:** `docs/superpowers/specs/2026-09-15-web-2027-design.md`

## Global Constraints

- Veškerý text pro uživatele je **česky**, vykáním. Kód a komentáře taky česky, ať odpovídají okolí.
- **Weeks s.r.o. je neplátce DPH** — nikde se nevyčísluje daň, žádné „vč. DPH".
- `Turnus.id` putuje do `registrations.term_id` a odkazuje se na něj faktura. **Jednou vydané id se nikdy nemění.**
- Do databáze se dál ukládá `city` jako `location_id` a `id` turnusu jako `term_id`. **Žádná datová migrace.**
- `npm run lint` je rozbité napříč repozitářem (Next 16 zrušil `next lint`). Bránou je `npm test` a `npm run build`.
- **Nikdy `git add -A`** — v kořeni repozitáře leží soukromé soubory mimo verzování.
- Větev: `feat/web-2027`. Commituj po každém úkolu.
- Tento repozitář je **veřejný** — žádná obchodní strategie ani interní čísla.

---

### Task 1: Města a místa konání jako číselník

Město dnes nese v `locations.ts` celý paralelní web (programy, USP, FAQ, hero texty). Po sjednocení z něj zbude jen identita místa. Místa konání (`Venue`) se stěhují sem, protože se mění spolu s městem.

**Files:**
- Create: `src/lib/cities.ts`
- Test: `src/lib/cities.test.ts`

**Interfaces:**
- Consumes: nic
- Produces:
  - `type CityId = 'praha' | 'karlovy-vary'`
  - `type VenueId = 'fablab-varyte'`
  - `interface City { id: CityId; name: string; region: string; geo: { lat: number; lng: number } }`
  - `interface Venue { id: VenueId; cityId: CityId; name: string; fullName: string; street: string; city: string; postalCode: string; geo: { lat: number; lng: number }; description: string; url?: string; mapQuery: string }`
  - `getCity(id: CityId): City`
  - `getAllCities(): City[]`
  - `getVenue(id: VenueId): Venue`

- [ ] **Step 1: Napiš padající test**

Vytvoř `src/lib/cities.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getCity, getAllCities, getVenue } from './cities'

describe('getCity', () => {
  it('vrátí město podle id', () => {
    expect(getCity('karlovy-vary').name).toBe('Karlovy Vary')
    expect(getCity('praha').name).toBe('Praha')
  })

  it('u každého města zná kraj a souřadnice pro strukturovaná data', () => {
    for (const city of getAllCities()) {
      expect(city.region.length).toBeGreaterThan(0)
      expect(city.geo.lat).toBeGreaterThan(48)
      expect(city.geo.lat).toBeLessThan(52)
      expect(city.geo.lng).toBeGreaterThan(12)
      expect(city.geo.lng).toBeLessThan(19)
    }
  })
})

describe('getAllCities', () => {
  it('vrátí obě města', () => {
    expect(getAllCities().map((c) => c.id).sort()).toEqual(['karlovy-vary', 'praha'])
  })
})

describe('getVenue', () => {
  it('vrátí místo konání i s městem, do kterého patří', () => {
    const venue = getVenue('fablab-varyte')
    expect(venue.cityId).toBe('karlovy-vary')
    expect(venue.name).toBe('FabLab VARY&TE')
  })

  it('každé místo konání ukazuje do existujícího města', () => {
    const cityIds = getAllCities().map((c) => c.id)
    expect(cityIds).toContain(getVenue('fablab-varyte').cityId)
  })
})
```

- [ ] **Step 2: Pusť test a ověř, že padá**

Run: `npm test -- src/lib/cities.test.ts`
Expected: FAIL — `Failed to resolve import "./cities"`

- [ ] **Step 3: Napiš implementaci**

Vytvoř `src/lib/cities.ts`:

```ts
/**
 * Města a místa konání jako číselník.
 *
 * Po sjednocení webu není město větví stránek, ale vlastností turnusu. Zbývá
 * z něj jen identita místa: jméno, kraj a souřadnice pro strukturovaná data.
 * Všechno ostatní (cena, kapacita, program, termín) patří turnusu.
 */

export type CityId = 'praha' | 'karlovy-vary'
export type VenueId = 'fablab-varyte'

export interface City {
  id: CityId
  name: string
  /** Kraj — jde do strukturovaných dat a do popisků pro vyhledávače. */
  region: string
  geo: { lat: number; lng: number }
}

export interface Venue {
  id: VenueId
  cityId: CityId
  name: string
  fullName: string
  street: string
  city: string
  postalCode: string
  geo: { lat: number; lng: number }
  description: string
  url?: string
  /** Dotaz pro odkaz do map. */
  mapQuery: string
}

const CITIES: Record<CityId, City> = {
  'praha': {
    id: 'praha',
    name: 'Praha',
    region: 'Praha',
    geo: { lat: 50.0755, lng: 14.4378 },
  },
  'karlovy-vary': {
    id: 'karlovy-vary',
    name: 'Karlovy Vary',
    region: 'Karlovarský kraj',
    geo: { lat: 50.2318, lng: 12.8714 },
  },
}

const VENUES: Record<VenueId, Venue> = {
  'fablab-varyte': {
    id: 'fablab-varyte',
    cityId: 'karlovy-vary',
    name: 'FabLab VARY&TE',
    fullName: 'FabLab v Kreativním centru VARY&TE',
    street: 'Dykova',
    city: 'Stará Role',
    postalCode: '360 17',
    geo: { lat: 50.2318, lng: 12.8714 },
    description:
      'Největší kreativní centrum v Karlovarském kraji s FabLabem, GameDev arenou a profesionálními vzdělávacími prostory.',
    url: 'https://varyete.cz',
    mapQuery: 'Kreativní+centrum+Vary%26Te+Karlovy+Vary',
  },
}

export function getCity(id: CityId): City {
  return CITIES[id]
}

export function getAllCities(): City[] {
  return Object.values(CITIES)
}

export function getVenue(id: VenueId): Venue {
  return VENUES[id]
}
```

- [ ] **Step 4: Pusť test a ověř, že prochází**

Run: `npm test -- src/lib/cities.test.ts`
Expected: PASS, 4 testy

- [ ] **Step 5: Commit**

```bash
git add src/lib/cities.ts src/lib/cities.test.ts
git commit -m "feat(turnusy): města a místa konání jako číselník

Po sjednocení webu není město větví stránek, ale vlastností turnusu.
Zbývá z něj identita místa pro strukturovaná data.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Zaměření jako obsahový modul

Stránky `/tabor-3d-tisk` a `/tabor-iot` ve fázi 2 zaniknou. Jejich obsah se nezahazuje — stává se z něj modul, který si turnus přitáhne podle svého zaměření. Tím se ten samý popis dá použít na `/tabor` i na stránce konkrétního turnusu.

**Files:**
- Create: `src/lib/focus.ts`
- Test: `src/lib/focus.test.ts`

**Interfaces:**
- Consumes: nic
- Produces:
  - `type FocusId = '3d-tisk' | 'iot' | 'vr' | 'herni-vyvoj'`
  - `interface FocusModule { id: FocusId; name: string; short: string; tryOut: string[] }`
  - `getFocus(id: FocusId): FocusModule`
  - `getFocusModules(ids: FocusId[]): FocusModule[]`

- [ ] **Step 1: Napiš padající test**

Vytvoř `src/lib/focus.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getFocus, getFocusModules, FOCUS_IDS } from './focus'

describe('getFocus', () => {
  it('vrátí modul zaměření podle id', () => {
    expect(getFocus('3d-tisk').name).toBe('3D tisk')
    expect(getFocus('iot').name).toBe('IoT a elektronika')
  })
})

describe('FOCUS_IDS', () => {
  it('každé zaměření má jméno, jednovětý popis a aspoň tři věci k vyzkoušení', () => {
    for (const id of FOCUS_IDS) {
      const focus = getFocus(id)
      expect(focus.name.length).toBeGreaterThan(0)
      expect(focus.short.length).toBeGreaterThan(20)
      expect(focus.tryOut.length).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('getFocusModules', () => {
  it('zachová pořadí, v jakém si je turnus vyžádal', () => {
    const modules = getFocusModules(['iot', '3d-tisk'])
    expect(modules.map((m) => m.id)).toEqual(['iot', '3d-tisk'])
  })

  it('u prázdného seznamu vrátí prázdný seznam', () => {
    expect(getFocusModules([])).toEqual([])
  })
})
```

- [ ] **Step 2: Pusť test a ověř, že padá**

Run: `npm test -- src/lib/focus.test.ts`
Expected: FAIL — `Failed to resolve import "./focus"`

- [ ] **Step 3: Napiš implementaci**

Vytvoř `src/lib/focus.ts`. Obsah je vytažený ze stránek `/tabor-3d-tisk` a `/tabor-iot`, které ve fázi 2 zaniknou:

```ts
/**
 * Zaměření turnusu jako znovupoužitelný obsahový modul.
 *
 * Turnusy se od sebe liší tím, čemu se na nich děti věnují. Popis toho, co si
 * dítě vyzkouší, proto nepatří stránce programu (ty zanikají), ale zaměření —
 * odtud si ho přitáhne jak přehled na /tabor, tak stránka konkrétního turnusu.
 */

export type FocusId = '3d-tisk' | 'iot' | 'vr' | 'herni-vyvoj'

export interface FocusModule {
  id: FocusId
  name: string
  /** Jedna věta pro kartu turnusu. */
  short: string
  /** Co si dítě konkrétně vyzkouší — do odrážek na stránce. */
  tryOut: string[]
}

export const FOCUS_IDS: FocusId[] = ['3d-tisk', 'iot', 'vr', 'herni-vyvoj']

const FOCUS: Record<FocusId, FocusModule> = {
  '3d-tisk': {
    id: '3d-tisk',
    name: '3D tisk',
    short:
      'Od vlastního modelu k hotovému výtisku, který si dítě odveze domů.',
    tryOut: [
      'Navrhne si vlastní model a připraví ho k tisku',
      'Osahá si několik typů tiskáren — MK3S, MK4S, Mini+ i CORE One',
      'Uvidí, proč tisk selže, a naučí se tomu předejít',
      'Odveze si vlastní výtisk',
    ],
  },
  'iot': {
    id: 'iot',
    name: 'IoT a elektronika',
    short:
      'Zapojování a programování zařízení, která reagují na okolní svět.',
    tryOut: [
      'Zapojí obvod na nepájivém poli a rozsvítí ho',
      'Naprogramuje Micro:bit i Arduino',
      'Připojí čidlo a nechá zařízení reagovat na teplotu nebo pohyb',
      'Sestaví vlastní malý projekt a předvede ho ostatním',
    ],
  },
  'vr': {
    id: 'vr',
    name: 'Virtuální realita',
    short:
      'Vyzkoušení VR nejen jako hry, ale jako nástroje, se kterým se pracuje.',
    tryOut: [
      'Vyzkouší si VR headset pod dohledem lektora',
      'Projde si prostředí, ve kterém se dá tvořit, ne jen hrát',
      'Pochopí, jak se obraz do headsetu vlastně dostane',
    ],
  },
  'herni-vyvoj': {
    id: 'herni-vyvoj',
    name: 'Herní vývoj',
    short:
      'První vlastní hra — od nápadu po něco, co jde opravdu hrát.',
    tryOut: [
      'Poskládá si jednoduchou scénu a rozpohybuje postavu',
      'Napíše první kus herní logiky',
      'Vyzkouší si, jak se hra ladí, když nedělá to, co má',
    ],
  },
}

export function getFocus(id: FocusId): FocusModule {
  return FOCUS[id]
}

export function getFocusModules(ids: FocusId[]): FocusModule[] {
  return ids.map(getFocus)
}
```

- [ ] **Step 4: Pusť test a ověř, že prochází**

Run: `npm test -- src/lib/focus.test.ts`
Expected: PASS, 4 testy

- [ ] **Step 5: Commit**

```bash
git add src/lib/focus.ts src/lib/focus.test.ts
git commit -m "feat(turnusy): zaměření jako znovupoužitelný obsahový modul

Obsah zanikajících stránek /tabor-3d-tisk a /tabor-iot se stěhuje do
modulů, které si turnus přitáhne podle svého zaměření.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Turnus jako jediná prodejní jednotka

Jádro fáze. Turnus nahrazuje `location.terms[]` i tabulku `camps` jako zdroj pravdy pro veřejný web.

Typ záměrně připouští neúplný turnus (`start`, `end`, `priceKc` a `venueId` smí být `null`), protože „chystáme léto 2027, místo upřesníme" je platný stav, se kterým web spouštíme. Úplnost se vynucuje až u turnusu, který jde koupit — to řeší Task 4.

Výběrové funkce berou seznam jako nepovinný parametr, aby testy pracovaly s fixturami a neopíraly se o ostrá data, která se budou měnit.

**Files:**
- Create: `src/lib/turnusy.ts`
- Test: `src/lib/turnusy.test.ts`

**Interfaces:**
- Consumes: `CityId`, `VenueId` z `./cities`; `FocusId` z `./focus`
- Produces:
  - `type TurnusStatus = 'chystame' | 'otevreno' | 'plno' | 'uzavreno'`
  - `interface Turnus { id: string; slug: string; city: CityId; venueId: VenueId | null; start: string | null; end: string | null; priceKc: number | null; capacity: number; status: TurnusStatus; focus: FocusId[]; perex: string }`
  - `TURNUSY: Turnus[]` — ostrá data
  - `getTurnusy(list?: Turnus[]): Turnus[]` — seřazené, bez uzavřených
  - `getTurnus(slug: string, list?: Turnus[]): Turnus | undefined`
  - `getTurnusById(id: string, list?: Turnus[]): Turnus | undefined`
  - `getTurnusyByCity(city: CityId, list?: Turnus[]): Turnus[]`
  - `getCitiesWithTurnusy(list?: Turnus[]): CityId[]`
  - `isBookable(turnus: Turnus): boolean`

- [ ] **Step 1: Napiš padající test**

Vytvoř `src/lib/turnusy.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  getTurnusy,
  getTurnus,
  getTurnusById,
  getTurnusyByCity,
  getCitiesWithTurnusy,
  isBookable,
  type Turnus,
} from './turnusy'

const otevreny: Turnus = {
  id: 'test-kv-cervenec',
  slug: 'karlovy-vary-cervenec-2027',
  city: 'karlovy-vary',
  venueId: 'fablab-varyte',
  start: '2027-07-12',
  end: '2027-07-16',
  priceKc: 4990,
  capacity: 15,
  status: 'otevreno',
  focus: ['3d-tisk', 'iot'],
  perex: 'Týdenní příměstský tábor ve FabLabu.',
}

const chystany: Turnus = {
  id: 'test-praha-leto',
  slug: 'praha-leto-2027',
  city: 'praha',
  venueId: null,
  start: null,
  end: null,
  priceKc: null,
  capacity: 15,
  status: 'chystame',
  focus: ['3d-tisk'],
  perex: 'Místo konání i termíny upřesníme.',
}

const uzavreny: Turnus = {
  ...otevreny,
  id: 'test-kv-loni',
  slug: 'karlovy-vary-cervenec-2026',
  start: '2026-07-27',
  end: '2026-07-31',
  status: 'uzavreno',
}

const pozdejsi: Turnus = {
  ...otevreny,
  id: 'test-kv-srpen',
  slug: 'karlovy-vary-srpen-2027',
  start: '2027-08-09',
  end: '2027-08-13',
}

const fixture = [pozdejsi, uzavreny, chystany, otevreny]

describe('getTurnusy', () => {
  it('vynechá uzavřené turnusy', () => {
    expect(getTurnusy(fixture).map((t) => t.id)).not.toContain('test-kv-loni')
  })

  it('řadí podle data a turnusy bez data dává nakonec', () => {
    expect(getTurnusy(fixture).map((t) => t.id)).toEqual([
      'test-kv-cervenec',
      'test-kv-srpen',
      'test-praha-leto',
    ])
  })

  it('u prázdného seznamu vrátí prázdný seznam', () => {
    expect(getTurnusy([])).toEqual([])
  })
})

describe('getTurnus', () => {
  it('najde turnus podle slugu', () => {
    expect(getTurnus('karlovy-vary-cervenec-2027', fixture)?.id).toBe('test-kv-cervenec')
  })

  it('najde i uzavřený turnus — stará adresa musí dál něco ukázat', () => {
    expect(getTurnus('karlovy-vary-cervenec-2026', fixture)?.id).toBe('test-kv-loni')
  })

  it('u neznámého slugu vrátí undefined', () => {
    expect(getTurnus('neexistuje', fixture)).toBeUndefined()
  })
})

describe('getTurnusById', () => {
  it('najde turnus podle id, kterým se odkazuje registrace', () => {
    expect(getTurnusById('test-kv-cervenec', fixture)?.slug).toBe('karlovy-vary-cervenec-2027')
  })

  it('u neznámého id vrátí undefined', () => {
    expect(getTurnusById('neexistuje', fixture)).toBeUndefined()
  })
})

describe('getTurnusyByCity', () => {
  it('vrátí jen turnusy daného města', () => {
    expect(getTurnusyByCity('praha', fixture).map((t) => t.id)).toEqual(['test-praha-leto'])
  })
})

describe('getCitiesWithTurnusy', () => {
  it('vrátí města, která mají co nabídnout — podle nich se rozhoduje, jestli ukázat filtr', () => {
    expect(getCitiesWithTurnusy(fixture).sort()).toEqual(['karlovy-vary', 'praha'])
  })

  it('město jen s uzavřeným turnusem se nepočítá', () => {
    expect(getCitiesWithTurnusy([uzavreny])).toEqual([])
  })
})

describe('isBookable', () => {
  it('otevřený a úplný turnus jde koupit', () => {
    expect(isBookable(otevreny)).toBe(true)
  })

  it('chystaný turnus koupit nejde', () => {
    expect(isBookable(chystany)).toBe(false)
  })

  it('plný turnus koupit nejde', () => {
    expect(isBookable({ ...otevreny, status: 'plno' })).toBe(false)
  })

  it('otevřený turnus bez ceny koupit nejde', () => {
    expect(isBookable({ ...otevreny, priceKc: null })).toBe(false)
  })

  it('otevřený turnus bez termínu koupit nejde', () => {
    expect(isBookable({ ...otevreny, start: null, end: null })).toBe(false)
  })
})
```

- [ ] **Step 2: Pusť test a ověř, že padá**

Run: `npm test -- src/lib/turnusy.test.ts`
Expected: FAIL — `Failed to resolve import "./turnusy"`

- [ ] **Step 3: Napiš implementaci**

Vytvoř `src/lib/turnusy.ts`:

```ts
import type { CityId, VenueId } from './cities'
import type { FocusId } from './focus'

/**
 * Turnus — jediná prodejní jednotka webu.
 *
 * Nahrazuje `location.terms[]` i tabulku `camps` jako zdroj pravdy pro veřejný
 * web. Cena a kapacita patří turnusu, ne programu: turnusy se mohou lišit
 * zaměřením i cenou a registrace musí věřit turnusu.
 *
 * Čtení schválně jde přes funkce, ne přes přímý import pole. Až se turnusy
 * přestěhují do hubu (app.weeks.cz), vymění se implementace těchhle funkcí a
 * stránky se nemusí měnit.
 */

export type TurnusStatus =
  /** Víme, že bude, ale termín, místo nebo cena ještě nejsou jisté. */
  | 'chystame'
  /** Jde koupit. Vyžaduje termín, místo i cenu — viz `isBookable`. */
  | 'otevreno'
  /** Kapacita vyčerpána. */
  | 'plno'
  /** Proběhl nebo byl zrušen. Z nabídky mizí, ale adresa dál funguje. */
  | 'uzavreno'

export interface Turnus {
  /**
   * Stabilní klíč. Ukládá se do `registrations.term_id` a odkazuje se na něj
   * faktura — jednou vydané id se NIKDY nemění.
   */
  id: string
  /** Adresa stránky turnusu: /tabor/[slug]. Město v slugu kvůli vyhledávačům. */
  slug: string
  city: CityId
  /** `null`, dokud není místo domluvené. */
  venueId: VenueId | null
  /** ISO datum, `null` dokud není termín jistý. */
  start: string | null
  end: string | null
  /** Konečná cena v korunách. Weeks s.r.o. je neplátce DPH. */
  priceKc: number | null
  capacity: number
  status: TurnusStatus
  focus: FocusId[]
  /** Čím je tenhle turnus jiný — jedna až dvě věty na kartu. */
  perex: string
}

/**
 * Ostrá data.
 *
 * Léto 2027 zatím nemá potvrzené termíny ani místo v Praze, proto oba turnusy
 * stojí ve stavu `chystame` — web o nich mluví v budoucím čase a sbírá kontakty.
 * Až termíny přijdou, doplní se `start`, `end`, `priceKc`, `venueId` a stav se
 * překlopí na `otevreno`.
 */
export const TURNUSY: Turnus[] = [
  {
    id: 'kv-leto-2027',
    slug: 'karlovy-vary-leto-2027',
    city: 'karlovy-vary',
    venueId: 'fablab-varyte',
    start: null,
    end: null,
    priceKc: null,
    capacity: 15,
    status: 'chystame',
    focus: ['3d-tisk', 'iot', 'vr'],
    perex:
      'Týdenní příměstský tábor ve FabLabu VARY&TE. Termíny na léto 2027 vypíšeme na jaře.',
  },
  {
    id: 'praha-leto-2027',
    slug: 'praha-leto-2027',
    city: 'praha',
    venueId: null,
    start: null,
    end: null,
    priceKc: null,
    capacity: 15,
    status: 'chystame',
    focus: ['3d-tisk', 'iot', 'vr'],
    perex:
      'Týdenní příměstský tábor v Praze. Místo konání i termíny upřesníme.',
  },
]

/** Turnus, který si právě teď může někdo koupit. */
export function isBookable(turnus: Turnus): boolean {
  return (
    turnus.status === 'otevreno' &&
    turnus.start !== null &&
    turnus.end !== null &&
    turnus.priceKc !== null &&
    turnus.venueId !== null
  )
}

/**
 * Turnusy v nabídce — bez uzavřených, seřazené podle termínu.
 * Turnusy bez data jdou nakonec: „chystáme" nemá co přeskakovat jistý termín.
 */
export function getTurnusy(list: Turnus[] = TURNUSY): Turnus[] {
  return list
    .filter((t) => t.status !== 'uzavreno')
    .slice()
    .sort((a, b) => {
      if (a.start === null && b.start === null) return 0
      if (a.start === null) return 1
      if (b.start === null) return -1
      return a.start.localeCompare(b.start)
    })
}

/**
 * Turnus podle adresy. Hledá i mezi uzavřenými — adresa proběhlého turnusu
 * má dál něco ukázat, ne spadnout na 404.
 */
export function getTurnus(slug: string, list: Turnus[] = TURNUSY): Turnus | undefined {
  return list.find((t) => t.slug === slug)
}

/** Turnus podle id, kterým se na něj odkazuje registrace. */
export function getTurnusById(id: string, list: Turnus[] = TURNUSY): Turnus | undefined {
  return list.find((t) => t.id === id)
}

export function getTurnusyByCity(city: CityId, list: Turnus[] = TURNUSY): Turnus[] {
  return getTurnusy(list).filter((t) => t.city === city)
}

/**
 * Města, která mají co nabídnout. Podle délky tohohle seznamu se rozhoduje,
 * jestli se na /tabor vůbec ukáže filtr měst — při jednom městě je přepínání
 * jen překážka.
 */
export function getCitiesWithTurnusy(list: Turnus[] = TURNUSY): CityId[] {
  return Array.from(new Set(getTurnusy(list).map((t) => t.city)))
}
```

- [ ] **Step 4: Pusť test a ověř, že prochází**

Run: `npm test -- src/lib/turnusy.test.ts`
Expected: PASS, 16 testů

- [ ] **Step 5: Commit**

```bash
git add src/lib/turnusy.ts src/lib/turnusy.test.ts
git commit -m "feat(turnusy): turnus jako jediná prodejní jednotka

Nahrazuje location.terms[] i tabulku camps jako zdroj pravdy pro web.
Typ připouští neúplný turnus, protože 'chystáme, termín upřesníme' je
stav, se kterým web spouštíme.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Invariant — co je v nabídce, musí být úplné

`isBookable` hlídá jeden turnus. Tenhle úkol hlídá **celý seznam** a hlavně ho hlídá nad ostrými daty, ne nad fixturami. Chrání před tím, aby se do nabídky dostal turnus s chybějící cenou, s duplicitním id (které by v databázi splynulo s jiným) nebo s odkazem na neexistující místo.

Je to jediné místo, kde se testuje ostrý obsah `TURNUSY` — proto přežije i to, když se data změní.

**Files:**
- Modify: `src/lib/turnusy.ts` (přidat `validateTurnusy`)
- Modify: `src/lib/turnusy.test.ts` (přidat popis chování)
- Test: `src/lib/turnusy-data.test.ts` (nový — kontrola ostrých dat)

**Interfaces:**
- Consumes: `Turnus`, `TURNUSY`, `isBookable` z `./turnusy`; `getVenue` z `./cities`
- Produces: `validateTurnusy(list?: Turnus[]): string[]` — seznam popsaných problémů, prázdný = v pořádku

- [ ] **Step 1: Napiš padající testy**

V `src/lib/turnusy.test.ts` doplň `validateTurnusy` do už existujícího importu z `./turnusy`:

```ts
import {
  getTurnusy,
  getTurnus,
  getTurnusById,
  getTurnusyByCity,
  getCitiesWithTurnusy,
  isBookable,
  validateTurnusy,
  type Turnus,
} from './turnusy'
```

A na konec souboru přidej:

```ts
describe('validateTurnusy', () => {
  it('u zdravého seznamu nenajde nic', () => {
    expect(validateTurnusy([otevreny, chystany])).toEqual([])
  })

  it('odhalí dvě turnusy se stejným id — v databázi by splynuly', () => {
    const problems = validateTurnusy([otevreny, { ...chystany, id: otevreny.id }])
    expect(problems.join(' ')).toContain('id')
  })

  it('odhalí dvě turnusy se stejnou adresou', () => {
    const problems = validateTurnusy([otevreny, { ...chystany, slug: otevreny.slug }])
    expect(problems.join(' ')).toContain('slug')
  })

  it('odhalí otevřený turnus bez ceny', () => {
    const problems = validateTurnusy([{ ...otevreny, priceKc: null }])
    expect(problems.join(' ')).toContain('otevreno')
  })

  it('odhalí turnus, jehož místo konání leží v jiném městě', () => {
    const problems = validateTurnusy([{ ...otevreny, city: 'praha' }])
    expect(problems.join(' ')).toContain('jiném městě')
  })

  it('odhalí turnus, který končí dřív, než začíná', () => {
    const problems = validateTurnusy([{ ...otevreny, end: '2027-07-01' }])
    expect(problems.join(' ')).toContain('konec')
  })

  it('odhalí nekladnou kapacitu', () => {
    const problems = validateTurnusy([{ ...otevreny, capacity: 0 }])
    expect(problems.join(' ')).toContain('kapacita')
  })
})
```

Vytvoř `src/lib/turnusy-data.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { TURNUSY, validateTurnusy } from './turnusy'

describe('ostrá data turnusů', () => {
  it('projdou kontrolou úplnosti', () => {
    expect(validateTurnusy(TURNUSY)).toEqual([])
  })

  it('každý turnus má vyplněný perex — je to jediný text na jeho kartě', () => {
    for (const turnus of TURNUSY) {
      expect(turnus.perex.length, `turnus ${turnus.id}`).toBeGreaterThan(20)
    }
  })

  it('každý turnus má aspoň jedno zaměření', () => {
    for (const turnus of TURNUSY) {
      expect(turnus.focus.length, `turnus ${turnus.id}`).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Pusť testy a ověř, že padají**

Run: `npm test -- src/lib/turnusy.test.ts src/lib/turnusy-data.test.ts`
Expected: FAIL — `validateTurnusy is not a function` / `does not provide an export named 'validateTurnusy'`

- [ ] **Step 3: Napiš implementaci**

V `src/lib/turnusy.ts` doplň import `getVenue` na začátek souboru:

```ts
import { getVenue, type CityId, type VenueId } from './cities'
```

(nahrazuje původní `import type { CityId, VenueId } from './cities'`)

A na konec souboru přidej:

```ts
/**
 * Kontrola úplnosti seznamu turnusů.
 *
 * Hlídá to, co typový systém uhlídat nedokáže: jedinečnost klíčů, soulad místa
 * s městem a úplnost turnusu, který je v prodeji. Běží v testech nad ostrými
 * daty, takže se chyba v datech pozná při `npm test`, ne až u rodiče v košíku.
 *
 * Vrací seznam popsaných problémů. Prázdný seznam znamená v pořádku.
 */
export function validateTurnusy(list: Turnus[] = TURNUSY): string[] {
  const problems: string[] = []

  const seenIds = new Set<string>()
  const seenSlugs = new Set<string>()

  for (const turnus of list) {
    if (seenIds.has(turnus.id)) {
      problems.push(`Duplicitní id "${turnus.id}" — v databázi by obě registrace splynuly.`)
    }
    seenIds.add(turnus.id)

    if (seenSlugs.has(turnus.slug)) {
      problems.push(`Duplicitní slug "${turnus.slug}" — dvě turnusy by měly stejnou adresu.`)
    }
    seenSlugs.add(turnus.slug)

    if (turnus.status === 'otevreno' && !isBookable(turnus)) {
      problems.push(
        `Turnus "${turnus.id}" je ve stavu otevreno, ale chybí mu termín, místo nebo cena.`
      )
    }

    if (turnus.venueId !== null && getVenue(turnus.venueId).cityId !== turnus.city) {
      problems.push(
        `Turnus "${turnus.id}": místo konání leží v jiném městě, než turnus tvrdí.`
      )
    }

    if (turnus.start !== null && turnus.end !== null && turnus.end < turnus.start) {
      problems.push(`Turnus "${turnus.id}": konec je dřív než začátek.`)
    }

    if (turnus.capacity <= 0) {
      problems.push(`Turnus "${turnus.id}": kapacita musí být kladná.`)
    }

    if (turnus.priceKc !== null && turnus.priceKc <= 0) {
      problems.push(`Turnus "${turnus.id}": cena musí být kladná.`)
    }
  }

  return problems
}
```

- [ ] **Step 4: Pusť testy a ověř, že procházejí**

Run: `npm test -- src/lib/turnusy.test.ts src/lib/turnusy-data.test.ts`
Expected: PASS, 23 testů v turnusy.test.ts a 3 v turnusy-data.test.ts

- [ ] **Step 5: Commit**

```bash
git add src/lib/turnusy.ts src/lib/turnusy.test.ts src/lib/turnusy-data.test.ts
git commit -m "feat(turnusy): kontrola úplnosti nabídky nad ostrými daty

Hlídá, co typy neuhlídají: jedinečnost id a slugů, soulad místa s městem
a úplnost turnusu v prodeji. Chyba v datech spadne v testech, ne u rodiče
v košíku.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Cena a kapacita se odvozují z turnusu

Dnes se odvozují z dvojice `location_id` + `program` přes `locations.ts`. To znamená tři vyhledání ve třech konfiguracích a možnost, že stránka ukazuje jinou cenu, než jakou naúčtuje registrace. Nově stačí `term_id`.

Zúžení vstupu je zároveň bezpečnostní zlepšení: klient posílá jeden neuhodnutelný identifikátor a server si dohledá všechno ostatní sám.

**Files:**
- Modify: `src/lib/payment-pricing.ts` (celý přepis)
- Modify: `src/lib/payment-pricing.test.ts` (celý přepis)
- Modify: `src/app/api/register/route.ts:41-53`

**Interfaces:**
- Consumes: `getTurnusById`, `isBookable`, `TURNUSY`, `Turnus` z `@/lib/turnusy`
- Produces:
  - `getTrustedPriceKc(termId: string, list?: Turnus[]): number` — vyhodí výjimku, když turnus neexistuje nebo není k prodeji
  - `getTrustedCapacity(termId: string, list?: Turnus[]): number` — totéž

Nepovinný druhý parametr slouží testům, aby nezávisely na ostrých datech. Volající v aplikaci ho nikdy nepředávají.

- [ ] **Step 1: Přepiš test**

Nahraď obsah `src/lib/payment-pricing.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getTrustedPriceKc, getTrustedCapacity } from './payment-pricing'
import { TURNUSY, type Turnus } from './turnusy'

const prodejny: Turnus = {
  id: 'test-prodejny',
  slug: 'test-prodejny',
  city: 'karlovy-vary',
  venueId: 'fablab-varyte',
  start: '2027-07-12',
  end: '2027-07-16',
  priceKc: 4990,
  capacity: 15,
  status: 'otevreno',
  focus: ['3d-tisk'],
  perex: 'Testovací turnus pro ověření důvěryhodné ceny.',
}

describe('getTrustedPriceKc', () => {
  it('vrátí cenu turnusu', () => {
    expect(getTrustedPriceKc('test-prodejny', [prodejny])).toBe(4990)
  })

  it('vyhodí výjimku u neznámého turnusu', () => {
    expect(() => getTrustedPriceKc('neexistuje', [prodejny])).toThrow()
  })

  it('vyhodí výjimku u turnusu, který není v prodeji', () => {
    expect(() =>
      getTrustedPriceKc('test-prodejny', [{ ...prodejny, status: 'chystame' }])
    ).toThrow()
  })

  it('vyhodí výjimku u plného turnusu — nesmí vzniknout nová platba', () => {
    expect(() =>
      getTrustedPriceKc('test-prodejny', [{ ...prodejny, status: 'plno' }])
    ).toThrow()
  })
})

describe('getTrustedCapacity', () => {
  it('vrátí kapacitu turnusu', () => {
    expect(getTrustedCapacity('test-prodejny', [prodejny])).toBe(15)
  })

  it('vyhodí výjimku u neznámého turnusu', () => {
    expect(() => getTrustedCapacity('neexistuje', [prodejny])).toThrow()
  })
})

describe('ostrá data', () => {
  it('žádný turnus v prodeji nesmí mít nulovou nebo zápornou cenu', () => {
    for (const turnus of TURNUSY) {
      if (turnus.status !== 'otevreno') continue
      expect(getTrustedPriceKc(turnus.id), `turnus ${turnus.id}`).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Pusť test a ověř, že padá**

Run: `npm test -- src/lib/payment-pricing.test.ts`
Expected: FAIL. Stará implementace bere `(locationId, program)`, takže `'test-prodejny'` projde jako id lokality, `getLocationById` vrátí výchozí Prahu a hledání programu podle pole turnusů selže — test padá na `No trusted price for location=test-prodejny`.

- [ ] **Step 3: Přepiš implementaci**

Nahraď obsah `src/lib/payment-pricing.ts`:

```ts
import { getTurnusById, isBookable, TURNUSY, type Turnus } from './turnusy'

/**
 * Důvěryhodný zdroj ceny a kapacity pro registraci.
 *
 * Odvozuje se výhradně z turnusu na serveru — NIKDY z částky poslané klientem.
 * Vstupem je `term_id`, protože cena a kapacita patří turnusu, ne programu:
 * dva turnusy se stejným zaměřením se mohou lišit cenou.
 *
 * Turnus, který není v prodeji, vyhodí výjimku. Volající to překládá na
 * chybu 400 — ať už jde o překlep v adrese, nebo o pokus obejít vyprodáno.
 */
function resolveBookable(termId: string, list: Turnus[] = TURNUSY): Turnus {
  const turnus = getTurnusById(termId, list)
  if (!turnus) {
    throw new Error(`Neznámý turnus: ${termId}`)
  }
  if (!isBookable(turnus)) {
    throw new Error(`Turnus ${termId} není v prodeji (stav: ${turnus.status})`)
  }
  return turnus
}

export function getTrustedPriceKc(termId: string, list: Turnus[] = TURNUSY): number {
  // `isBookable` už zaručilo, že cena není null.
  return resolveBookable(termId, list).priceKc as number
}

export function getTrustedCapacity(termId: string, list: Turnus[] = TURNUSY): number {
  return resolveBookable(termId, list).capacity
}
```

- [ ] **Step 4: Pusť test a ověř, že prochází**

Run: `npm test -- src/lib/payment-pricing.test.ts`
Expected: PASS, 7 testů

- [ ] **Step 5: Naval volání v registračním API**

V `src/app/api/register/route.ts` nahraď blok na řádcích 41–42:

```ts
      maxCapacity = getTrustedCapacity(parsed.data.location_id, parsed.data.program)
      trustedPrice = getTrustedPriceKc(parsed.data.location_id, parsed.data.program)
```

za:

```ts
      maxCapacity = getTrustedCapacity(parsed.data.term_id)
      trustedPrice = getTrustedPriceKc(parsed.data.term_id)
```

Uprav i komentář nad blokem (řádky 35–37), ať odpovídá skutečnosti:

```ts
    // Capacity AND price are resolved server-side from the turnus — never from
    // the client. The client-supplied payment_amount is ignored (anti-tampering):
    // the stored amount, the Comgate charge, and the Fakturoid invoice must all agree.
```

- [ ] **Step 6: Ověř, že se nic nerozbilo**

Run: `npm test && npx tsc --noEmit`
Expected: všechny testy PASS, `tsc` bez výstupu

- [ ] **Step 7: Commit**

```bash
git add src/lib/payment-pricing.ts src/lib/payment-pricing.test.ts src/app/api/register/route.ts
git commit -m "feat(turnusy): cena a kapacita se odvozují z turnusu

Místo dvojice location_id + program stačí term_id. Jedno vyhledání místo
tří a užší vstup od klienta. Turnus, který není v prodeji, vyhodí výjimku,
takže vyprodáno nejde obejít podvrženým požadavkem.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Platba a upomínka čtou uloženou částku

Tenhle úkol opravuje chybu, kterou by Task 5 jinak zavedl. `/api/payment/comgate/create` a upomínkový cron dnes cenu **znovu odvozují** z konfigurace pro registraci, která už dávno existuje. Jakmile se zdrojem stane turnus, přestane to fungovat pro registrace na turnus, který se mezitím uzavřel — rodič s nezaplacenou registrací z loňska by na platební odkaz dostal chybu.

Správné je částku neodvozovat vůbec. `registrations.payment_amount` byla zapsána serverem při vzniku registrace, takže je stejně důvěryhodná — a navíc je to ta částka, na kterou rodič kývl.

**Files:**
- Modify: `src/app/api/payment/comgate/create/route.ts:29,46`
- Modify: `src/app/api/cron/payment-reminder/route.ts:40,69`

**Interfaces:**
- Consumes: sloupec `registrations.payment_amount` (INTEGER, migrace 009)
- Produces: nic nového

- [ ] **Step 1: Uprav vytvoření platby**

V `src/app/api/payment/comgate/create/route.ts` přidej `payment_amount` do výběru sloupců (řádek 29):

```ts
      .select('id, location_id, program, parent_email, child_name, payment_status, payment_amount')
```

Nahraď odvození ceny (řádek 46):

```ts
    const priceKc = getTrustedPriceKc(reg.location_id as string, reg.program as string)
```

za čtení uložené částky:

```ts
    // Částku NEODVOZUJEME znovu — platí ta, kterou server zapsal při vzniku
    // registrace a na kterou rodič kývl. Turnus mezitím mohl zmizet z nabídky,
    // ale nezaplacená registrace musí jít doplatit.
    const priceKc = reg.payment_amount as number | null
    if (!priceKc || priceKc <= 0) {
      reportError(new Error('Registrace nemá uloženou částku k zaplacení'), {
        route: 'payment/comgate/create',
        registrationId: reg.id,
      })
      return NextResponse.json({ error: API_ERRORS.invalidRequest }, { status: 400 })
    }
```

Odstraň nepoužitý import na řádku 4:

```ts
import { getTrustedPriceKc } from '@/lib/payment-pricing'
```

`reportError` (řádek 8) i `API_ERRORS` (řádek 6) už v souboru naimportované jsou — nic dalšího přidávat netřeba.

- [ ] **Step 2: Uprav upomínkový cron**

V `src/app/api/cron/payment-reminder/route.ts` přidej `payment_amount` do výběru (řádek 40):

```ts
    .select('id, parent_email, child_name, program, location_id, term_start, term_end, payment_amount')
```

Nahraď odvození ceny (řádek 69):

```ts
      const priceKc = getTrustedPriceKc(reg.location_id as string, reg.program as string)
```

za:

```ts
      // Stejně jako u vytvoření platby: platí uložená částka, ne aktuální ceník.
      const priceKc = reg.payment_amount as number | null
      if (!priceKc || priceKc <= 0) {
        throw new Error(`Registrace ${reg.id} nemá uloženou částku k zaplacení`)
      }
```

Odstraň nepoužitý import na řádku 5:

```ts
import { getTrustedPriceKc } from '@/lib/payment-pricing'
```

Výjimka je v tomhle cyklu zachycena `catch` blokem na řádku ~80, který uvolní nárok a nechá další běh zkusit znovu — to je správné chování.

- [ ] **Step 3: Ověř typovou správnost a build**

Run: `npx tsc --noEmit && npm test`
Expected: `tsc` bez výstupu, všechny testy PASS

Pokud `tsc` hlásí nepoužitý import, odstraň ho.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/payment/comgate/create/route.ts src/app/api/cron/payment-reminder/route.ts
git commit -m "fix(platby): platba a upomínka čtou uloženou částku místo ceníku

Cena se znovu odvozovala z konfigurace pro registraci, která už existuje.
Po přechodu na turnusy by to rozbilo doplacení registrace na turnus, který
se mezitím uzavřel. Platí částka zapsaná serverem při vzniku registrace —
ta, na kterou rodič kývl.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Živá obsazenost počítaná nad turnusy

`/api/term-capacity` dnes iteruje nad `location.terms` a kapacitu bere z `programs[]`. Nově iteruje nad turnusy. Zůstává pravidlo, že místo drží jakákoliv registrace se stavem jiným než `cancelled` — přesně to, co vynucuje `create_registration()` (migrace 011), aby odznak „zbývá X míst" nikdy nesliboval místo, které je fakticky pryč.

Parametr `location` se mění na nepovinný filtr města: bez něj vrátí obsazenost všech turnusů, protože nový přehled na `/tabor` ukazuje obě města najednou.

**Files:**
- Modify: `src/app/api/term-capacity/route.ts` (celý přepis)
- Modify: `src/app/karlovy-vary/_components/SpotsLeft.tsx:18`

**Interfaces:**
- Consumes: `getTurnusy`, `getTurnusyByCity` z `@/lib/turnusy`; `CityId` z `@/lib/cities`
- Produces: `GET /api/term-capacity?mesto=<CityId>` → `{ data: Record<termId, { spotsLeft: number; maxCapacity: number }> }`

- [ ] **Step 1: Přepiš implementaci**

Nahraď obsah `src/app/api/term-capacity/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getTurnusy, getTurnusyByCity } from '@/lib/turnusy'
import type { CityId } from '@/lib/cities'
import { reportError } from '@/lib/observability'

export const dynamic = 'force-dynamic'

/**
 * Veřejná obsazenost turnusů — kolik míst zbývá.
 *
 * Místo drží JAKÁKOLIV registrace se stavem jiným než 'cancelled' — přesně to
 * pravidlo, kterým kapacitu vynucuje create_registration() (migrace 011).
 * Kdyby se tyhle dvě pravidla rozešla, odznak „zbývá X míst" by sliboval místo,
 * které je fakticky pryč.
 *
 * Bez parametru vrací všechny turnusy; `?mesto=` zúží na jedno město.
 *
 * Při chybě vrací prázdná data (200), takže stránka jen vynechá odznaky místo
 * toho, aby se rozbila. Žádné osobní údaje — jen počty podle term_id.
 */
export async function GET(request: NextRequest) {
  const mesto = new URL(request.url).searchParams.get('mesto') as CityId | null

  try {
    const turnusy = mesto ? getTurnusyByCity(mesto) : getTurnusy()

    // term_id -> kapacita turnusu
    const capacityByTerm: Record<string, number> = {}
    for (const turnus of turnusy) {
      capacityByTerm[turnus.id] = turnus.capacity
    }

    if (Object.keys(capacityByTerm).length === 0) {
      return NextResponse.json({ data: {} })
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('registrations')
      .select('term_id')
      .in('term_id', Object.keys(capacityByTerm))
      .neq('status', 'cancelled')
    if (error) throw error

    const taken: Record<string, number> = {}
    for (const row of data ?? []) {
      const t = row.term_id as string
      taken[t] = (taken[t] ?? 0) + 1
    }

    const result: Record<string, { spotsLeft: number; maxCapacity: number }> = {}
    for (const [termId, maxCapacity] of Object.entries(capacityByTerm)) {
      result[termId] = {
        spotsLeft: Math.max(0, maxCapacity - (taken[termId] ?? 0)),
        maxCapacity,
      }
    }

    return NextResponse.json(
      { data: result },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    )
  } catch (e) {
    reportError(e, { route: 'term-capacity', mesto })
    return NextResponse.json({ data: {} })
  }
}
```

- [ ] **Step 2: Sraz jediného volajícího s novým parametrem**

Volající je jeden: `src/app/karlovy-vary/_components/SpotsLeft.tsx:18`. Čte z odpovědi jen `j.data`, takže vypuštěný klíč `location` mu nevadí — mění se jen název parametru.

Nahraď řádek 18:

```ts
    fetch(`/api/term-capacity?location=${encodeURIComponent(locationId)}`)
```

za:

```ts
    fetch(`/api/term-capacity?mesto=${encodeURIComponent(locationId)}`)
```

Hodnota zůstává stejná (`'karlovy-vary'`), protože id lokality a id města se shodují. Tahle komponenta ve fázi 2 zanikne spolu s karlovarskou sekcí — teď ji jen držíme funkční.

Ověř, že jiný volající neexistuje:

Run: `grep -rn "term-capacity" src/ --include="*.tsx" --include="*.ts"`
Expected: jen `SpotsLeft.tsx` a samotná route.

- [ ] **Step 3: Ověř typovou správnost a build**

Run: `npx tsc --noEmit && npm run build`
Expected: `tsc` bez výstupu, build projde

- [ ] **Step 4: Ověř chování za běhu**

Run: `npm run dev` (v samostatném terminálu), pak:

```bash
curl -s http://localhost:3000/api/term-capacity | head -c 200
curl -s "http://localhost:3000/api/term-capacity?mesto=karlovy-vary" | head -c 200
```

Expected: obojí vrátí `{"data":{...}}` se stavem 200. Protože oba ostré turnusy jsou zatím ve stavu `chystame`, obsazenost se u nich spočítá, ale nikdo na ně registrovaný není — očekávej `spotsLeft: 15`.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/term-capacity/route.ts
git commit -m "feat(turnusy): živá obsazenost počítaná nad turnusy

Iteruje nad turnusy místo location.terms a kapacitu bere z turnusu.
Parametr location se mění na nepovinný filtr města, protože nový přehled
na /tabor ukazuje obě města najednou.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Hotovo, když

- `npm test` prochází a pokrývá: číselník měst, moduly zaměření, výběr turnusů, kontrolu úplnosti nad ostrými daty a důvěryhodnou cenu i kapacitu
- `npx tsc --noEmit` je bez chyb
- `npm run build` projde
- `getTrustedPriceKc` a `getTrustedCapacity` berou `term_id`; nic v repozitáři je nevolá s dvojicí `location_id` + `program`
- `/api/payment/comgate/create` ani upomínkový cron cenu neodvozují — čtou `payment_amount`
- `locations.ts` je pořád naživu a staré stránky fungují beze změny (mizí až ve fázi 2)

## Co tahle fáze schválně nedělá

- **Nemění ani jednu stránku.** Stránky přejdou na turnusy ve fázi 2, kdy se zároveň mění struktura webu. Kdyby se to dělalo teď, přepisovaly by se stránky, které za týden zaniknou.
- **Nemaže `locations.ts` ani `camps`.** `locations.ts` drží staré stránky do fáze 2, tabulka `camps` zůstává v databázi kvůli hubu a historii.
- **Nesahá na DDM.** Scraper, cron a `registrationType` mizí ve fázi 3, protože většina jejich volání sedí ve stránkách, které mezitím zaniknou.
