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
  /**
   * Popis místa — vykresluje se na `/o-nas`, na `/tabory` u svého města
   * a na stránkách tématu a termínu (přes `VenueShowcase`). Je to
   * tvrzení o cizí firmě, které Weeks nijak nedokládá, takže bez superlativů
   * a bez údajů, které nemáme odkud ověřit.
   */
  description: string
  url?: string
  /** Dotaz pro odkaz do map. */
  mapQuery: string
  /** Fotky prostoru pro `VenueShowcase`. Bez fotek se galerie nevykresluje. */
  photos?: string[]
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
      'Kreativní centrum v Karlovarském kraji s FabLabem, GameDev arenou a vzdělávacími prostory.',
    url: 'https://varyete.cz',
    mapQuery: 'Kreativní+centrum+Vary%26Te+Karlovy+Vary',
    photos: [
      '/images/varyete/fablab-1.avif',
      '/images/varyete/fablab-5.avif',
      '/images/varyete/fablab-6.avif',
    ],
  },
}

export function getCity(id: CityId): City {
  return CITIES[id]
}

export function getAllCities(): City[] {
  return Object.values(CITIES)
}

/**
 * Pořadí města ve výpisech. Jediné místo, kde se rozhoduje, že Praha stojí
 * nad Karlovými Vary — pořadí se tím drží pořadím v `CITIES` a nevzniká
 * podruhé v datech turnusů, kde by se rozešlo.
 */
export function getCityPoradi(id: CityId): number {
  return Object.keys(CITIES).indexOf(id)
}

export function getVenue(id: VenueId): Venue {
  return VENUES[id]
}
