import { type Location, DEFAULT_LOCATION } from '@/lib/locations'

export function OrganizationSchema({ location }: { location?: Location }) {
  const loc = location || DEFAULT_LOCATION
  const primaryVenue = loc.venues[0]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Weeks - Víkendové IT kempy pro děti',
    alternateName: 'Weeks',
    url: 'https://weeks.cz',
    logo: 'https://weeks.cz/images/weeks-logo.png',
    description: 'Víkendové IT kempy pro děti 10-15 let v Praze. 3D tisk, VR, programování a IoT.',
    email: loc.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: primaryVenue.address,
      addressLocality: primaryVenue.city,
      postalCode: primaryVenue.postalCode,
      addressRegion: loc.name,
      addressCountry: 'CZ',
    },
    parentOrganization: {
      '@type': 'Organization',
      name: loc.organizer.fullName,
      alternateName: loc.organizer.name,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocalBusinessSchema({ location }: { location?: Location }) {
  const loc = location || DEFAULT_LOCATION
  const primaryVenue = loc.venues[0]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://weeks.cz/#localbusiness',
    name: 'Weeks - Víkendové IT kempy pro děti',
    image: 'https://weeks.cz/og-image.jpg',
    description: `Víkendové IT kempy pro děti 10-15 let v ${loc.name}. 3D tisk, VR, programování a IoT. Expert instruktoři, moderní vybavení. Organizátor: ${loc.organizer.name}.`,
    url: 'https://weeks.cz',
    telephone: loc.contact.phone,
    email: loc.contact.email,
    priceRange: 'Kč',
    address: {
      '@type': 'PostalAddress',
      streetAddress: primaryVenue.address,
      addressLocality: primaryVenue.city,
      addressRegion: loc.name,
      postalCode: primaryVenue.postalCode,
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: String(primaryVenue.geo.lat),
      longitude: String(primaryVenue.geo.lng),
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    areaServed: {
      '@type': 'City',
      name: loc.name,
      '@id': 'https://www.wikidata.org/wiki/Q1085',
    },
    serviceType: ['IT kempy pro děti', 'programování pro děti', '3D tisk pro děti', 'VR kempy pro děti', 'robotika pro děti'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function EventSchema({ location }: { location?: Location }) {
  const loc = location || DEFAULT_LOCATION

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': 'https://weeks.cz/#event',
    name: 'Tábor chytrých technologií - Weeks',
    description: `Víkendové IT kempy zaměřené na 3D tisk, virtuální realitu, programování a IoT pro děti ve věku 10-15 let v ${loc.name}.`,
    image: 'https://weeks.cz/og-image.jpg',
    startDate: '2026-03-14',
    endDate: '2026-03-29',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: loc.venues.map((venue) => ({
      '@type': 'Place',
      name: venue.fullName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: venue.address,
        addressLocality: venue.city,
        addressRegion: loc.name,
        postalCode: venue.postalCode,
        addressCountry: 'CZ',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: String(venue.geo.lat),
        longitude: String(venue.geo.lng),
      },
    })),
    organizer: {
      '@type': 'Organization',
      name: loc.organizer.name,
      url: 'https://weeks.cz',
    },
    performer: {
      '@type': 'Organization',
      name: 'Weeks',
      url: 'https://weeks.cz',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://weeks.cz/tabor-chytrych-technologii',
      availability: 'https://schema.org/InStock',
      price: '2990',
      priceCurrency: 'CZK',
      validFrom: '2026-02-01',
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: 'Děti 10-15 let',
    },
    inLanguage: 'cs-CZ',
    isAccessibleForFree: false,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
