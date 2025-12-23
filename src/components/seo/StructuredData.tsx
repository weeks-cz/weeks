export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Weeks - Víkendové IT kempy pro děti',
    alternateName: 'Weeks',
    url: 'https://weeks.cz',
    logo: 'https://weeks.cz/images/weeks-logo.png',
    description: 'Víkendové IT kempy pro děti 10-15 let v Praze. 3D tisk, VR, programování a IoT.',
    email: 'info@weeks.cz',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5. května 11',
      addressLocality: 'Praha 4 - Nusle',
      postalCode: '140 00',
      addressRegion: 'Praha',
      addressCountry: 'CZ',
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'Dům dětí a mládeže Praha 6',
      alternateName: 'DDM Praha 6',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://weeks.cz/#localbusiness',
    name: 'Weeks - Víkendové IT kempy pro děti',
    image: 'https://weeks.cz/og-image.jpg',
    description: 'Víkendové IT kempy pro děti 10-15 let v Praze. 3D tisk, VR, programování a IoT. Expert instruktoři, moderní vybavení, pod záštitou DDM Praha 6.',
    url: 'https://weeks.cz',
    telephone: '+420123456789',
    email: 'info@weeks.cz',
    priceRange: 'Kč',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5. května 11',
      addressLocality: 'Praha 4 - Nusle',
      addressRegion: 'Praha',
      postalCode: '140 00',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '50.0621',
      longitude: '14.4285',
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
      name: 'Praha',
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

export function EventSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': 'https://weeks.cz/#event',
    name: 'Víkendové IT kempy pro děti - Weeks',
    description: 'Víkendové IT kempy zaměřené na 3D tisk, virtuální realitu, programování a IoT pro děti ve věku 10-15 let. Každou sobotu a neděli v Kongresovém centru Praha.',
    image: 'https://weeks.cz/og-image.jpg',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Kongresové centrum Praha',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '5. května 11',
        addressLocality: 'Praha 4 - Nusle',
        addressRegion: 'Praha',
        postalCode: '140 00',
        addressCountry: 'CZ',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '50.0621',
        longitude: '14.4285',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'DDM Praha 6',
      url: 'https://weeks.cz',
    },
    performer: {
      '@type': 'Organization',
      name: 'Weeks',
      url: 'https://weeks.cz',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://weeks.cz',
      availability: 'https://schema.org/PreOrder',
      price: '2990',
      priceCurrency: 'CZK',
      validFrom: '2025-12-01',
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
