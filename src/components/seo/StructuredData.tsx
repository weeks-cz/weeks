import { SITE } from '@/lib/site'
import { getCity, getVenue } from '@/lib/cities'
import type { Turnus } from '@/lib/turnusy'
import { turnusLabels } from '@/components/turnusy/turnus-labels'
import { serializeJsonLd } from './json-ld'
import { turnusyProSchema } from './schema-turnusy'

// Schema.org JSON-LD. Identita provozovatele (Organization, LocalBusiness) čte
// výhradně ze `SITE` — jeden produkt, jeden provozovatel, žádná lokace. Event
// čte výhradně z turnusů, ne z `locations.ts`: viz varování nad `TURNUSY`
// v `src/lib/turnusy.ts`.

// Obsah se skládá `serializeJsonLd`, ne holým `JSON.stringify` — ten neescapuje
// `<`, takže název produktu v drobečkách e-shopu (chodí z weeks-hubu, tedy
// zvenčí) by uměl ukončit skriptovou značku. Viz `json-ld.ts`.
function jsonLd(schema: unknown, key?: string) {
  return <script key={key} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
}

/** Rozloží `SITE.address` („Arbesovo náměstí 70/4, Smíchov, 150 00 Praha 5") na ulici, PSČ a město. */
function parseAddress(address: string): { street: string; postalCode: string; city: string } {
  const parts = address.split(',').map((part) => part.trim())
  const last = parts[parts.length - 1] ?? ''
  const match = last.match(/^(\d{3}\s?\d{2})\s+(.+)$/)
  return {
    street: parts.slice(0, -1).join(', '),
    postalCode: match ? match[1] : '',
    city: match ? match[2] : last,
  }
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/images/weeks-logo.png`,
    telephone: SITE.phone,
    email: SITE.email,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'ICO',
      value: SITE.ico,
    },
  }
  return jsonLd(schema)
}

export function LocalBusinessSchema() {
  const { street, postalCode, city } = parseAddress(SITE.address)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#localbusiness`,
    name: `${SITE.name} – IT tábory pro děti`,
    image: `${SITE.url}/opengraph-image`,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: 'Kč',
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: city,
      postalCode,
      addressCountry: 'CZ',
    },
    serviceType: [
      'IT tábory pro děti',
      'programování pro děti',
      '3D tisk pro děti',
      'VR tábory pro děti',
      'IoT a elektronika pro děti',
    ],
  }
  return jsonLd(schema)
}

/**
 * Jedna položka Event za každý turnus, který má co slíbit — v prodeji nebo
 * vyprodaný (`turnusyProSchema`, viz `./schema-turnusy`).
 *
 * Nic se nedopočítává záložní hodnotou — `turnusyProSchema` zaručuje, že
 * turnus má termín, místo i cenu, takže schema čte přímo z něj. Když takový
 * turnus není žádný (dnešní stav — oba turnusy jsou `chystame`), nevykreslí
 * se nic: prázdná nebo vymyšlená nabídka by Googlu i rodiči ukázala něco,
 * co neexistuje.
 *
 * Vlastnost `turnusy` je nepovinná schválně: úvodka chce schema za všechny
 * turnusy v nabídce (volá se bez argumentu), zatímco stránka jednoho turnusu
 * chce jen ten svůj (`<EventSchema turnusy={[turnus]} />`).
 */
export function EventSchema({ turnusy }: { turnusy?: Turnus[] } = {}) {
  const polozky = turnusyProSchema(turnusy)
  if (polozky.length === 0) return null

  return (
    <>
      {polozky.map(({ turnus, dostupnost }) => {
        // `turnusyProSchema` zaručuje start, end, priceKc i venueId — non-null assert je bezpečný.
        const venue = getVenue(turnus.venueId!)
        const mesto = getCity(turnus.city).name
        const url = `${SITE.url}/tabor/${turnus.slug}`
        const { datum } = turnusLabels(turnus)

        const schema = {
          '@context': 'https://schema.org',
          '@type': 'Event',
          '@id': `${url}/#event`,
          name: `Letní IT tábor ${mesto} — ${datum}`,
          startDate: turnus.start,
          endDate: turnus.end,
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: venue.fullName || venue.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: venue.street,
              addressLocality: venue.city,
              postalCode: venue.postalCode,
              addressCountry: 'CZ',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: String(venue.geo.lat),
              longitude: String(venue.geo.lng),
            },
          },
          organizer: {
            '@type': 'Organization',
            name: SITE.legalName,
            url: SITE.url,
          },
          offers: {
            '@type': 'Offer',
            url,
            availability: dostupnost,
            price: String(turnus.priceKc),
            priceCurrency: 'CZK',
          },
          inLanguage: 'cs-CZ',
          isAccessibleForFree: false,
        }
        return jsonLd(schema, turnus.id)
      })}
    </>
  )
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return jsonLd(schema)
}
