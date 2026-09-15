import { SITE } from '@/lib/site'
import { getCity, getVenue } from '@/lib/cities'
import { getTurnusy, isBookable } from '@/lib/turnusy'
import { turnusLabels } from '@/components/turnusy/turnus-labels'

// Schema.org JSON-LD. Identita provozovatele (Organization, LocalBusiness) čte
// výhradně ze `SITE` — jeden produkt, jeden provozovatel, žádná lokace. Event
// čte výhradně z turnusů, ne z `locations.ts`: viz varování nad `TURNUSY`
// v `src/lib/turnusy.ts`.

function jsonLd(schema: unknown, key?: string) {
  return <script key={key} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
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
    image: `${SITE.url}/og-image-v2.jpg`,
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
 * Jedna položka Event za každý turnus, který je opravdu v prodeji.
 *
 * Nic se nedopočítává záložní hodnotou — `isBookable` zaručuje, že turnus má
 * termín, místo i cenu, takže schema čte přímo z něj. Když v prodeji není
 * žádný turnus (dnešní stav), nevykreslí se nic: prázdná nebo vymyšlená
 * nabídka by Googlu i rodiči ukázala něco, co neexistuje.
 */
export function EventSchema() {
  const prodejneTurnusy = getTurnusy().filter(isBookable)
  if (prodejneTurnusy.length === 0) return null

  return (
    <>
      {prodejneTurnusy.map((turnus) => {
        // `isBookable` zaručuje start, end, priceKc i venueId — non-null assert je bezpečný.
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
            availability: 'https://schema.org/InStock',
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
