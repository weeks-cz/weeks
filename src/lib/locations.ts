// Central location configuration for multi-city support
// All location-specific content is defined here — components read from this config

export interface Venue {
  name: string
  fullName: string
  address: string
  city: string
  postalCode: string
  geo: { lat: number; lng: number }
  description: string
  transport?: string
  url?: string
  mapQuery?: string
}

export interface Organizer {
  name: string
  fullName: string
  url?: string
  logoUrl?: string
}

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
  ddmId?: string
  venue?: string
}

export interface Location {
  id: string
  name: string
  slug: string
  isDefault: boolean
  organizer: Organizer
  venues: Venue[]
  registrationType: 'ddm' | 'internal'
  contact: {
    phone: string
    email: string
  }
  seo: {
    titleSuffix: string
    description: string
  }
  programs: ProgramConfig[]
  terms: TermConfig[]
  hero: {
    badge: string
    subtitle: string
  }
  usps: {
    organizer: { title: string; description: string }
    location: { title: string; description: string }
    technology?: { title: string; description: string }
    schedule?: { title: string; description: string }
  }
  safetyFeatures?: Array<{ title: string; description: string }>
  faq: {
    locationAnswer: string
    organizerAnswer: string
  }
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
    organizer: {
      name: 'DDM Praha 6',
      fullName: 'Dům dětí a mládeže Praha 6',
      url: 'https://ddmp6.cz',
    },
    venues: [
      {
        name: 'HWLab Praha',
        fullName: 'Kongresové centrum Praha',
        address: '5. května 11',
        city: 'Praha 4 - Nusle',
        postalCode: '140 00',
        geo: { lat: 50.0621, lng: 14.4285 },
        description: 'Moderní technologické centrum v Kongresovém centru Praha s profesionálním vybavením pro 3D tisk, VR a programování.',
        transport: 'Metro C - Vyšehrad (5 min pěšky)',
        mapQuery: 'HWLab+Praha,+5.+května+11,+Praha+4',
      },
      {
        name: 'DDM Praha 6',
        fullName: 'DDM Praha 6 – Bílá hora',
        address: 'U Boroviček 5',
        city: 'Praha 6',
        postalCode: '163 00',
        geo: { lat: 50.0830, lng: 14.3350 },
        description: 'Dům dětí a mládeže Praha 6 s více než 70 lety zkušeností v práci s dětmi a mládeží.',
        mapQuery: 'DDM+Praha+6,+U+Boroviček+5,+Praha+6',
      },
    ],
    registrationType: 'ddm',
    contact: { phone: '+420 703 046 440', email: 'info@weeks.cz' },
    seo: {
      titleSuffix: 'Praha',
      description: 'Víkendové a jednodenní IT kempy pro děti 10-15 let v Praze. 3D tisk, IoT, programování a virtuální realita v profesionálním prostředí HWLab.',
    },
    programs: SHARED_PROGRAMS,
    terms: [],
    hero: {
      badge: 'Nově v Praze!',
      subtitle: 'Víkendové i jednodenní formáty v Praze — 3D tisk, IoT, programování a virtuální realita pro děti 10–15 let.',
    },
    usps: {
      organizer: {
        title: 'Organizováno DDM Praha 6',
        description: 'Záštitu nad kempy drží DDM Praha 6. Garantujeme bezpečnost a kvalitu s více než 70 lety zkušeností v práci s dětmi.',
      },
      location: {
        title: 'Metro až ke dveřím',
        description: 'Kongresové centrum Praha — 5 minut pěšky od metra Vyšehrad. Snadný přístup z celé Prahy.',
      },
    },
    faq: {
      locationAnswer: 'Kempy probíhají v HWLab Praha (Kongresové centrum Praha, 5. května 11, Praha 4) a DDM Praha 6 (U Boroviček 5, Praha 6). HWLab je 5 minut pěšky od metra Vyšehrad.',
      organizerAnswer: 'Kempy organizuje DDM Praha 6 (Dům dětí a mládeže Praha 6), pod jehož záštitou projekt Weeks funguje.',
    },
    availablePages: AVAILABLE_PAGES,
  },

  'karlovy-vary': {
    id: 'karlovy-vary',
    name: 'Karlovy Vary',
    slug: 'karlovy-vary',
    isDefault: false,
    organizer: {
      name: 'Weeks',
      fullName: 'Lukáš Kubík, IČO 24878511',
      logoUrl: '/images/weeks-logo.png',
    },
    venues: [
      {
        name: 'FabLab Vary&Te',
        fullName: 'FabLab v Kreativní Centrum Vary&Te',
        address: 'Dykova',
        city: 'Stará Role',
        postalCode: '360 17',
        geo: { lat: 50.2318, lng: 12.8714 },
        description: 'Největší kreativní centrum v Karlovarském kraji s FabLabem, GameDev arenou a profesionálními vzdělávacími prostory.',
        url: 'https://varyete.cz',
        mapQuery: 'Kreativní+centrum+Vary%26Te+Karlovy+Vary',
      },
    ],
    registrationType: 'internal',
    contact: { phone: '+420 703 046 440', email: 'info@weeks.cz' },
    seo: {
      titleSuffix: 'Karlovy Vary',
      description: 'IT kempy pro děti 10-15 let v Karlových Varech. 3D tisk, IoT, programování a virtuální realita ve Vary&Te Creative Center.',
    },
    programs: [
      { id: 'letni-primestsky', name: 'Letní příměstský tábor chytrých technologií', slug: 'letni-primestsky', campType: 'week' as const, price: 7490, capacity: 12, ageRange: '10-15', color: 'accent' },
    ],
    terms: [
      { id: 'kv-2026-07-07-letni', program: 'letni-primestsky', startDate: '2026-07-07', endDate: '2026-07-11', day: 'pondělí–pátek', status: 'preparing' as const },
    ],
    hero: {
      badge: 'Nově v Karlových Varech!',
      subtitle: 'Letní příměstský tábor v Karlových Varech — 3D tisk, IoT, VR a programování pro děti 10–15 let.',
    },
    usps: {
      organizer: {
        title: 'Organizováno Weeks',
        description: 'Tábory organizuje tým Weeks s důrazem na kvalitu výuky, bezpečnost dětí a profesionální přístup.',
      },
      location: {
        title: 'Vary&Te Creative Center',
        description: 'Největší kreativní centrum v Karlovarském kraji — FabLab, GameDev arena a moderní vzdělávací prostory.',
      },
      technology: {
        title: 'Vybavení FabLab Vary&Te',
        description: 'Vaše dítě pracuje ve FabLabu — průmyslové 3D tiskárny, VR headsety a pokročilá IoT zařízení. Profesionální zázemí největšího kreativního centra v kraji.',
      },
      schedule: {
        title: 'Kompletní servis od 8 do 16',
        description: 'Celý týden oběd, svačiny, přestávky a střídání aktivit. Rodiče mají klid, děti mají postaráno o vše.',
      },
    },
    safetyFeatures: [
      { title: 'Pojištění účastníků', description: 'Komplexní pojištění' },
      { title: 'Malé skupiny', description: '1 lektor na 5 dětí' },
      { title: 'Okamžitý kontakt', description: 'Rodič vždy informován' },
      { title: 'Proškolení lektoři', description: 'Kurz první pomoci' },
    ],
    faq: {
      locationAnswer: 'Tábor probíhá ve FabLab v Kreativním centru Vary&Te, Dykova, Stará Role, Karlovy Vary — největším kreativním centru v Karlovarském kraji s profesionálním FabLabem a GameDev arenou.',
      organizerAnswer: 'Tábory v Karlových Varech organizuje Lukáš Kubík (Weeks) ve spolupráci s Kreativním centrem Vary&Te.',
    },
    availablePages: ['', 'letni-primestsky', 'o-nas', 'gdpr', 'podminky', 'kontakt'],
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
