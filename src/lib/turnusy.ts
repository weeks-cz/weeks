import { getVenue, type CityId, type VenueId } from './cities'
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
  /** Věkové rozmezí účastníků ve tvaru `'9-15'`. */
  ageRange: string
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
 *
 * Dvojí zdroj ceny, kterým tenhle odstavec dřív varoval, je vyřešený:
 * `/tabor`, `/tabor/[turnus]` i `EventSchema`
 * (`src/components/seo/StructuredData.tsx`) čtou cenu výhradně odtud —
 * `locations.ts` do strukturovaných dat ani do žádné stránky už nezasahuje.
 * `EventSchema` navíc turnus ve stavu `chystame` do JSON-LD vůbec nepustí,
 * takže sama o sobě žádnou cenu nedopočítá ani nedomyslí.
 *
 * POZOR — název programu na faktuře: `RegistrationForm` dál ukládá do pole
 * `program` id zaměření (`turnus.focus[0]`, např. `'3d-tisk'`), ale e-maily,
 * faktura z Fakturoidu, upomínka na platbu i nástupní list už tohle pole
 * nečtou — název tábora odvozuje server přes `getTrustedProgramName`
 * (`payment-pricing.ts`) ze `term_id`, stejně jako cenu, kapacitu, město
 * i termín. Uložená hodnota `program` slouží už jen jako záloha pro staré
 * registrace, jejichž turnus mezi aktuálními už není.
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
    ageRange: '9-15',
    perex:
      'Týdenní příměstský tábor ve FabLabu VARY&TE. Termíny na léto 2027 vypíšeme na podzim.',
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
    ageRange: '9-15',
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

    if (!/^\d{1,2}-\d{1,2}$/.test(turnus.ageRange)) {
      problems.push(`Turnus "${turnus.id}": věkové rozmezí musí být ve tvaru "9-15".`)
    }
  }

  return problems
}
