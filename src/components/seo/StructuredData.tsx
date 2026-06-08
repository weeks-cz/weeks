import { type Location, DEFAULT_LOCATION } from '@/lib/locations'

// Schema.org JSON-LD, location-aware. Renderuje se per-lokace (na homepage Prahy a KV),
// ne globálně v root layoutu — jinak by KV stránky nesly pražská data (DDM, HWLab).

const CITY_WIKIDATA: Record<string, string> = {
  praha: 'https://www.wikidata.org/wiki/Q1085',
  'karlovy-vary': 'https://www.wikidata.org/wiki/Q43287',
}

function locationUrl(location: Location): string {
  return location.isDefault ? 'https://weeks.cz' : `https://weeks.cz/${location.slug}`
}

function phoneDigits(location: Location): string {
  return location.contact.phone.replace(/\s/g, '')
}

function jsonLd(schema: unknown) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function OrganizationSchema({ location = DEFAULT_LOCATION }: { location?: Location }) {
  const venue = location.venues[0]
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: `Weeks – IT tábory pro děti (${location.name})`,
    alternateName: 'Weeks',
    url: locationUrl(location),
    logo: 'https://weeks.cz/images/weeks-logo.png',
    description: location.seo.description,
    email: location.contact.email,
    telephone: phoneDigits(location),
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address,
      addressLocality: venue.city,
      postalCode: venue.postalCode,
      addressRegion: location.name,
      addressCountry: 'CZ',
    },
  }
  // Praha běží pod záštitou DDM Praha 6; KV provozuje Weeks (Lukáš Kubík) samostatně.
  if (location.organizer.name === 'DDM Praha 6') {
    schema.parentOrganization = {
      '@type': 'Organization',
      name: location.organizer.fullName,
      alternateName: location.organizer.name,
    }
  }
  return jsonLd(schema)
}

export function LocalBusinessSchema({ location = DEFAULT_LOCATION }: { location?: Location }) {
  const venue = location.venues[0]
  const url = locationUrl(location)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}/#localbusiness`,
    name: `Weeks – IT tábory pro děti (${location.name})`,
    image: 'https://weeks.cz/og-image-v2.jpg',
    description: location.seo.description,
    url,
    telephone: phoneDigits(location),
    email: location.contact.email,
    priceRange: 'Kč',
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address,
      addressLocality: venue.city,
      addressRegion: location.name,
      postalCode: venue.postalCode,
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: String(venue.geo.lat),
      longitude: String(venue.geo.lng),
    },
    areaServed: {
      '@type': 'City',
      name: location.name,
      ...(CITY_WIKIDATA[location.id] ? { '@id': CITY_WIKIDATA[location.id] } : {}),
    },
    serviceType: ['IT kempy pro děti', 'programování pro děti', '3D tisk pro děti', 'VR kempy pro děti', 'robotika pro děti'],
  }
  return jsonLd(schema)
}

export function EventSchema({ location = DEFAULT_LOCATION }: { location?: Location }) {
  const url = locationUrl(location)
  const mainProgram = location.programs.find((p) => p.id === 'mix') ?? location.programs[0]

  // Datumy z konfigurace lokace (pokud existují), jinak nejbližší letní rozsah —
  // ať schema neukazuje propadlý termín.
  const activeTerms = location.terms.filter((t) => t.status !== 'cancelled')
  const starts = activeTerms.map((t) => t.startDate).sort()
  const ends = activeTerms.map((t) => t.endDate).sort()
  const startDate = starts[0] ?? '2026-07-04'
  const endDate = ends[ends.length - 1] ?? '2026-08-30'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${url}/#event`,
    name: `IT tábory chytrých technologií – Weeks ${location.name}`,
    description: `IT tábory zaměřené na 3D tisk, virtuální realitu, programování a IoT pro děti ve věku ${location.programs[0]?.ageRange ?? '10-15'} let v ${location.name}.`,
    image: 'https://weeks.cz/og-image-v2.jpg',
    startDate,
    endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: location.venues.map((v) => ({
      '@type': 'Place',
      name: v.fullName || v.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: v.address,
        addressLocality: v.city,
        addressRegion: location.name,
        postalCode: v.postalCode,
        addressCountry: 'CZ',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: String(v.geo.lat),
        longitude: String(v.geo.lng),
      },
    })),
    organizer: {
      '@type': 'Organization',
      name: location.organizer.name,
      url: location.organizer.url || url,
    },
    performer: {
      '@type': 'Organization',
      name: 'Weeks',
      url: 'https://weeks.cz',
    },
    offers: {
      '@type': 'Offer',
      url,
      availability: 'https://schema.org/InStock',
      price: String(mainProgram?.price ?? 2990),
      priceCurrency: 'CZK',
      validFrom: '2026-02-01',
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: `Děti ${location.programs[0]?.ageRange ?? '10-15'} let`,
    },
    inLanguage: 'cs-CZ',
    isAccessibleForFree: false,
  }
  return jsonLd(schema)
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
