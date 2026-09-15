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
      'Největší kreativní centrum v Karlovarském kraji s FabLabem, GameDev arenou a profesionálními vzdělávacími prostory.',
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

export function getVenue(id: VenueId): Venue {
  return VENUES[id]
}
