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
        url: `${SITE.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: pageTitle,
      },
    ],
  },
  // Twitter dědí ze stejného důvodu, z jakého potřebuje vlastní obrázek
  // `openGraph` — vlastní blok na téhle úrovni jen mělce přebíjí kořenový.
  // Dřívější oprava spravila jen `openGraph` a na tenhle blok zapomněla.
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
    images: [`${SITE.url}/opengraph-image`],
  },
}

export default function ONasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
