import type { Metadata } from 'next'
import { SITE } from '@/lib/site'

const pageTitle = 'O nás'
const pageDescription = `Poznejte lektorský tým Weeks - týdenní příměstský IT tábor pro děti 9-15 let. VR, programování, 3D tisk, IoT s Arduinem. Pořádá ${SITE.legalName}, IČO ${SITE.ico}.`
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
    images: [
      {
        url: 'https://weeks.cz/opengraph-image',
        width: 1200,
        height: 630,
        alt: pageTitle,
      },
    ],
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
