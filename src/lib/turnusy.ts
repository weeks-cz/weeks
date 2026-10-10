import { getCityPoradi, getVenue, type CityId, type VenueId } from './cities'
import type { FocusId } from './focus'
import { getTabor, type Tabor, type TaborId } from './tabory'

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
  /** Adresa stránky termínu: /tabory/termin/[slug]. Město v slugu kvůli vyhledávačům. */
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
  /**
   * Témata, kterým se na turnusu děti věnují (`src/lib/tabory.ts`).
   *
   * Pole, i když je v něm dnes vždy jeden prvek. Je to levná pojistka: až
   * poběží v jednom týdnu dvě paralelní skupiny s různými tématy, nevynutí si
   * to migraci `term_id` ani změnu adresy, která už je na faktuře.
   */
  taborIds: TaborId[]
  /** Věkové rozmezí účastníků ve tvaru `'9-15'`. */
  ageRange: string
  /** Čím je tenhle turnus jiný — jedna až dvě věty na kartu. */
  perex: string
  /**
   * Minimální počet dětí, při kterém se turnus koná, a den, do kterého o tom
   * pořadatel rozhodne. Pravidlo pro případ, že se minimum nenaplní, stojí ve
   * VOP (čl. 22); tady jsou jen čísla konkrétního turnusu. Bez pole web žádné
   * minimum neslibuje.
   */
  minimum?: { deti: number; rozhodnemeDo: string }
}

/**
 * Ostrá data.
 *
 * Léto 2027 v Karlových Varech je v prodeji od 10. 10. 2026: dva týdenní
 * turnusy ve FabLabu VARY&TE (prostor potvrzený pro léto 2027), 5 990 Kč —
 * o tisíc víc než léto 2026 (4 990 Kč). Praha zůstává `chystame` — nemá
 * potvrzené místo ani termín, web o ní mluví v budoucím čase a sbírá kontakty.
 *
 * Placeholder `kv-leto-2027` (slug `karlovy-vary-leto-2027`) se 10. 10. 2026
 * rozdělil na dva skutečné termíny. Registraci na něj nikdo udělat nemohl
 * (byl `chystame`), takže jeho id na žádné faktuře není; adresa přesměrovává
 * na `/tabory?mesto=karlovy-vary` (`next.config.js`).
 *
 * Cena má jediný zdroj: `/tabory`, stránky tématu i termínu, `EventSchema`
 * i server při registraci (`payment-pricing.ts`) ji čtou výhradně odtud.
 *
 * POZOR — název programu na faktuře: `RegistrationForm` dál ukládá do pole
 * `program` id tábora (`turnus.taborIds[0]`, např. `'chytre-technologie'`),
 * ale e-maily,
 * faktura z Fakturoidu, upomínka na platbu i nástupní list už tohle pole
 * nečtou — název tábora odvozuje server přes `getTrustedProgramName`
 * (`payment-pricing.ts`) ze `term_id` a z entity tábor, stejně jako cenu,
 * kapacitu, město i termín. Uložená hodnota `program` slouží už jen jako záloha pro staré
 * registrace, jejichž turnus mezi aktuálními už není.
 */
export const TURNUSY: Turnus[] = [
  {
    id: 'kv-2027-cervenec',
    slug: 'karlovy-vary-2027-cervenec',
    city: 'karlovy-vary',
    venueId: 'fablab-varyte',
    start: '2027-07-26',
    end: '2027-07-30',
    priceKc: 5990,
    capacity: 15,
    minimum: { deti: 10, rozhodnemeDo: '2027-06-30' },
    status: 'otevreno',
    taborIds: ['chytre-technologie'],
    ageRange: '9-15',
    perex:
      'Týden 3D tisku a elektroniky ve FabLabu VARY&TE v Karlových Varech. Oběd, pitný režim i materiál jsou v ceně.',
  },
  {
    id: 'kv-2027-srpen',
    slug: 'karlovy-vary-2027-srpen',
    city: 'karlovy-vary',
    venueId: 'fablab-varyte',
    start: '2027-08-02',
    end: '2027-08-06',
    priceKc: 5990,
    capacity: 15,
    minimum: { deti: 10, rozhodnemeDo: '2027-06-30' },
    status: 'otevreno',
    taborIds: ['chytre-technologie'],
    ageRange: '9-15',
    perex:
      'Týden 3D tisku a elektroniky ve FabLabu VARY&TE v Karlových Varech. Oběd, pitný režim i materiál jsou v ceně.',
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
    taborIds: ['chytre-technologie'],
    ageRange: '9-15',
    perex:
      'Týdenní příměstský tábor v Praze.',
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
 *
 * Když termín nemá ani jeden — což je dnešní stav, oba turnusy jsou `chystame`
 * — rozhoduje pořadí města z `cities.ts`, ne pořadí zápisu v `TURNUSY`.
 * Jinak by o tom, jestli je nahoře Praha nebo Karlovy Vary, rozhodovalo to,
 * který řádek kdo dřív napsal.
 */
export function getTurnusy(list: Turnus[] = TURNUSY): Turnus[] {
  return list
    .filter((t) => t.status !== 'uzavreno')
    .slice()
    .sort((a, b) => {
      if (a.start === null && b.start === null) {
        return getCityPoradi(a.city) - getCityPoradi(b.city)
      }
      if (a.start === null) return 1
      if (b.start === null) return -1
      return a.start.localeCompare(b.start)
    })
}

/**
 * Výřez turnusů pro úvodku — ta je rozcestí, ne katalog, a ukazuje jen
 * několik nejbližších. Zbytek nechává na `/tabor`.
 *
 * POZOR: strukturovaná data na úvodce MUSÍ čerpat ze stejného výřezu jako to,
 * co je na ní vidět (`NejblizsiTurnusy`). Kdyby `EventSchema` na úvodce bralo
 * celý seznam, našel by tam vyhledávač po vypsání dalších termínů událost
 * s datem a cenou, které na stránce nikde nestojí — a to je přesně to, čemu
 * `turnusyProSchema` brání u jednotlivých turnusů.
 */
export function nejblizsiTurnusy(pocet = 3, list: Turnus[] = TURNUSY): Turnus[] {
  return getTurnusy(list).slice(0, pocet)
}

/**
 * Ohlášení otevřeného přihlašování pro úvodku — z dat, ne natvrdo.
 *
 * Bere jen prodejné turnusy: rok z nejbližšího z nich, města ze všech. Při
 * jednom městě vede rovnou na jeho výpis, při víc městech na celý `/tabory`.
 * Když nic prodat nejde, vrací `null` a úvodka nic neohlašuje.
 */
export function oznameniPrihlasovani(
  list: Turnus[] = TURNUSY
): { rok: number; mesta: CityId[]; href: string } | null {
  const prodejne = getTurnusy(list).filter(isBookable)
  if (prodejne.length === 0) return null
  const rok = new Date(`${prodejne[0].start}T12:00:00`).getFullYear()
  const mesta = Array.from(new Set(prodejne.map((t) => t.city)))
  const href = mesta.length === 1 ? `/tabory?mesto=${mesta[0]}` : '/tabory'
  return { rok, mesta, href }
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
 * Tábory (témata), kterým se turnus věnuje.
 *
 * Neznámé id se tiše přeskočí — na nesmysl v datech upozorní `validateTurnusy`
 * při `npm test`, ne rozbitá stránka u rodiče.
 */
export function getTaboryTurnusu(turnus: Turnus): Tabor[] {
  return turnus.taborIds
    .map((id) => getTabor(id))
    .filter((t): t is Tabor => t !== undefined)
}

/** Zaměření turnusu — sjednocení zaměření jeho táborů, bez duplicit. */
export function getFocusTurnusu(turnus: Turnus): FocusId[] {
  return Array.from(new Set(getTaboryTurnusu(turnus).flatMap((t) => t.focus)))
}

/** Turnusy jednoho tématu — pro stránku tábora i pro výpis seskupený podle města. */
export function getTurnusyByTabor(taborId: TaborId, list: Turnus[] = TURNUSY): Turnus[] {
  return getTurnusy(list).filter((t) => t.taborIds.includes(taborId))
}

/**
 * Města, která mají co nabídnout. Podle délky tohohle seznamu se rozhoduje,
 * jestli se na /tabor vůbec ukáže filtr měst — při jednom městě je přepínání
 * jen překážka.
 */
export function getCitiesWithTurnusy(list: Turnus[] = TURNUSY): CityId[] {
  return Array.from(new Set(getTurnusy(list).map((t) => t.city)))
}

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

    if (turnus.minimum) {
      if (turnus.minimum.deti <= 0 || turnus.minimum.deti > turnus.capacity) {
        problems.push(`Turnus "${turnus.id}": minimum dětí musí být mezi 1 a kapacitou.`)
      }
      if (turnus.start !== null && turnus.minimum.rozhodnemeDo >= turnus.start) {
        problems.push(
          `Turnus "${turnus.id}": o konání se musí rozhodnout před začátkem turnusu.`
        )
      }
    }

    if (!/^\d{1,2}-\d{1,2}$/.test(turnus.ageRange)) {
      problems.push(`Turnus "${turnus.id}": věkové rozmezí musí být ve tvaru "9-15".`)
    }
  }

  return problems
}
