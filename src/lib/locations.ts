import { SITE } from './site'

/**
 * Mapa měst na kontaktní údaje pro registrační a e-mailovou cestu — nic víc.
 * Cena, termín, kapacita i místo konání jsou vlastnost turnusu (`turnusy.ts`,
 * `cities.ts`), ne lokality; sem nepatří (viz varování nad `TURNUSY` a nad
 * voláním `getTurnusById` v `nastupni-list/route.ts`).
 *
 * Telefon a e-mail se sem nepíší natvrdo — jediným zdrojem identity Weeks je
 * `SITE` v `site.ts`. Obojí bylo v obou městech stejné a dvojí zápis znamenal,
 * že změna čísla na jednom místě se do e-mailů rodičům nemusí dostat.
 */
export interface Location {
  id: string
  name: string
  slug: string
  isDefault: boolean
  contact: {
    phone: string
    email: string
  }
}

export const LOCATIONS: Record<string, Location> = {
  'praha': {
    id: 'praha',
    name: 'Praha',
    slug: '',
    isDefault: true,
    contact: { phone: SITE.phone, email: SITE.email },
  },

  'karlovy-vary': {
    id: 'karlovy-vary',
    name: 'Karlovy Vary',
    slug: 'karlovy-vary',
    isDefault: false,
    contact: { phone: SITE.phone, email: SITE.email },
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
