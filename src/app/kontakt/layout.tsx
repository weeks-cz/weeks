import type { Metadata } from 'next'

const pageTitle = 'Kontakt'
const pageDescription = 'Kontaktujte nás ohledně víkendových IT kempů Weeks pro děti. E-mail, telefon, adresa DDM Praha 6.'
const pageUrl = 'https://weeks.cz/kontakt'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'Weeks',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
}

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
