// Central location configuration — dnes už jen jméno lokality a kontakt pro
// registraci, platby a e-maily (viz `getLocationById` v nich). `programs`,
// `terms` a `season` jsou nečtený zbytek staré struktury webu, ponechané pro
// jistotu. Místo konání, cena a datum turnusu jsou vlastnost turnusu — žijí
// v `turnusy.ts` a `cities.ts`, ne tady (viz varování nad `TURNUSY` a nad
// voláním `getTurnusById` v `nastupni-list/route.ts`).

export interface ProgramConfig {
  id: string
  name: string
  slug: string
  campType: 'weekend' | 'oneday' | 'week'
  price: number
  capacity: number
  ageRange: string
  color: string
}

export interface TermConfig {
  id: string
  program: string
  startDate: string
  endDate: string
  day: string
  status: 'confirmed' | 'preparing' | 'cancelled'
  registrationUrl?: string
  venue?: string
}

/**
 * Stav sezóny pro danou lokalitu. Když je `ended`, stránky nezobrazují žádné
 * termíny ani registrační tlačítka — místo nich off-season panel se sběrem
 * kontaktů na další léto. Prázdné `terms` samo o sobě nestačí: u Prahy znamená
 * „termíny se teprve chystají", u KV „sezóna dojela".
 */
export interface SeasonConfig {
  status: 'open' | 'ended'
  /** Nadpis off-season panelu. */
  heading: string
  /** Vysvětlení pro rodiče — co bylo, co bude a kdy. */
  message: string
  /** Sezóna, na kterou sbíráme kontakty (do e-mailu i do GA). */
  nextSeasonLabel: string
}

export interface Location {
  id: string
  name: string
  slug: string
  isDefault: boolean
  contact: {
    phone: string
    email: string
  }
  programs: ProgramConfig[]
  terms: TermConfig[]
  season?: SeasonConfig
  hero: {
    badge: string
    subtitle: string
  }
  safetyFeatures?: Array<{ title: string; description: string }>
  availablePages: string[]
}

const SHARED_PROGRAMS: ProgramConfig[] = [
  { id: 'mix', name: 'MIX - Tábor chytrých technologií', slug: 'tabor-chytrych-technologii', campType: 'weekend', price: 2990, capacity: 15, ageRange: '10-15', color: 'primary' },
  { id: '3d-tisk', name: '3D tisk', slug: 'tabor-3d-tisk', campType: 'oneday', price: 1490, capacity: 15, ageRange: '10-15', color: 'primary' },
  { id: 'iot', name: 'IoT & elektronika', slug: 'tabor-iot', campType: 'oneday', price: 1490, capacity: 15, ageRange: '10-15', color: 'trust' },
]

const AVAILABLE_PAGES = [
  '',
  'tabor-chytrych-technologii',
  'tabor-3d-tisk',
  'tabor-iot',
  'kontakt',
]

export const LOCATIONS: Record<string, Location> = {
  'praha': {
    id: 'praha',
    name: 'Praha',
    slug: '',
    isDefault: true,
    contact: { phone: '+420 703 046 440', email: 'info@weeks.cz' },
    programs: SHARED_PROGRAMS,
    terms: [],
    hero: {
      badge: 'Nově v Praze!',
      subtitle: 'Víkendové i jednodenní formáty v Praze — 3D tisk, IoT, programování a virtuální realita pro děti 10–15 let.',
    },
    availablePages: AVAILABLE_PAGES,
  },

  'karlovy-vary': {
    id: 'karlovy-vary',
    name: 'Karlovy Vary',
    slug: 'karlovy-vary',
    isDefault: false,
    contact: { phone: '+420 703 046 440', email: 'info@weeks.cz' },
    programs: [
      { id: 'letni-primestsky', name: 'Letní příměstský tábor chytrých technologií', slug: 'letni-primestsky', campType: 'week' as const, price: 4990, capacity: 15, ageRange: '9-15', color: 'accent' },
      { id: 'mix', name: 'Víkendový tábor chytrých technologií', slug: 'tabor-chytrych-technologii', campType: 'weekend' as const, price: 2990, capacity: 15, ageRange: '9-15', color: 'primary' },
    ],
    // Léto 2026 dojelo — poslední turnus 27.–31. 7., srpnové termíny zrušeny.
    // Termíny na 2027 sem přibydou na jaře; do té doby off-season panel (viz `season`).
    terms: [],
    season: {
      status: 'ended',
      heading: 'Letní sezóna 2026 je uzavřena',
      message:
        'Letošní turnusy ve FabLabu VARY&TE máme za sebou a registrace jsou zavřené. ' +
        'Termíny na léto 2027 vypíšeme na jaře — nechte nám kontakt a ozveme se vám ' +
        'mezi prvními, ještě než registraci otevřeme veřejně.',
      nextSeasonLabel: 'léto 2027',
    },
    hero: {
      badge: 'Nově v Karlových Varech!',
      subtitle: 'Letní příměstský tábor (Po–Pá) i víkendový MIX (So–Ne) v Karlových Varech — 3D tisk, modelování, IoT, VR a základy programování.',
    },
    safetyFeatures: [
      { title: 'Bezpečné prostředí', description: 'Stálý dohled lektorů' },
      { title: 'Malé skupiny', description: '1 lektor na 5 dětí' },
      { title: 'Okamžitý kontakt', description: 'Rodič vždy informován' },
      { title: 'Proškolení lektoři', description: 'Kurz první pomoci' },
    ],
    availablePages: ['', 'letni-primestsky', 'tabor-chytrych-technologii', 'o-nas', 'gdpr', 'podminky', 'kontakt'],
  },
}

export const DEFAULT_LOCATION = LOCATIONS['praha']

export function getLocationBySlug(slug: string): Location {
  if (!slug || slug === '') return DEFAULT_LOCATION
  return LOCATIONS[slug] || DEFAULT_LOCATION
}

export function getLocationById(id: string): Location {
  return LOCATIONS[id] || DEFAULT_LOCATION
}

export function getAllLocations(): Location[] {
  return Object.values(LOCATIONS)
}

export function buildPath(location: Location, page: string): string {
  if (location.isDefault) return page ? `/${page}` : '/'
  return page ? `/${location.slug}/${page}` : `/${location.slug}`
}

export function getEquivalentPath(currentPath: string, targetLocation: Location): string {
  let page = currentPath.replace(/^\//, '')
  for (const loc of getAllLocations()) {
    if (loc.slug && page.startsWith(loc.slug + '/')) {
      page = page.slice(loc.slug.length + 1)
      break
    } else if (loc.slug && page === loc.slug) {
      page = ''
      break
    }
  }
  if (!targetLocation.availablePages.includes(page)) {
    page = ''
  }
  return buildPath(targetLocation, page)
}
