import type { Metadata } from 'next'

const pageTitle = 'O nás'
const pageDescription = 'Poznejte lektorský tým Weeks - zkušené lektory víkendových IT kempů pro děti. VR, programování, 3D tisk, grafika. Organizátor: DDM Praha 6. Místo konání: HWLab Praha.'
const pageUrl = 'https://weeks.cz/o-nas'

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

export default function ONasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
