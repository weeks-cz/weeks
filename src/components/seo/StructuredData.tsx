export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Weeks - Víkendové IT kempy pro děti',
    alternateName: 'Weeks',
    url: 'https://weeksweb.vercel.app',
    logo: 'https://weeksweb.vercel.app/logo.png',
    description: 'Víkendové IT kempy pro děti 10-15 let v Praze. 3D tisk, VR, programování a IoT.',
    email: 'info@weeks.cz',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Vnislavova 2',
      addressLocality: 'Praha 2 - Vyšehrad',
      postalCode: '128 00',
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
    '@id': 'https://weeksweb.vercel.app/#localbusiness',
    name: 'Weeks - Víkendové IT kempy pro děti',
    image: 'https://weeksweb.vercel.app/og-image.jpg',
    description: 'Víkendové IT kempy pro děti 10-15 let na Vyšehradě. 3D tisk, VR, programování a IoT. Expert instruktoři, moderní vybavení, pod záštitou DDM Praha 6.',
    url: 'https://weeksweb.vercel.app',
    telephone: '+420123456789',
    email: 'info@weeks.cz',
    priceRange: 'Kč',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Vnislavova 2',
      addressLocality: 'Praha 2',
      addressRegion: 'Praha',
      postalCode: '128 00',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '50.0636',
      longitude: '14.4217',
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
    '@id': 'https://weeksweb.vercel.app/#event',
    name: 'Víkendové IT kempy pro děti - Weeks',
    description: 'Víkendové IT kempy zaměřené na 3D tisk, virtuální realitu, programování a IoT pro děti ve věku 10-15 let. Každou sobotu a neděli na Vyšehradě v Praze.',
    image: 'https://weeksweb.vercel.app/og-image.jpg',
    startDate: '2024-12-14',
    endDate: '2025-06-30',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'HWLab Praha',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Vnislavova 2',
        addressLocality: 'Praha 2',
        addressRegion: 'Vyšehrad',
        postalCode: '128 00',
        addressCountry: 'CZ',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '50.0636',
        longitude: '14.4217',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'DDM Praha 6',
      url: 'https://weeksweb.vercel.app',
    },
    performer: {
      '@type': 'Organization',
      name: 'Weeks',
      url: 'https://weeksweb.vercel.app',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://weeksweb.vercel.app',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'CZK',
      validFrom: '2024-12-01',
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
