import type { Metadata } from 'next'
import { SITE } from '@/lib/site'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'

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


// Drobečky patří do layoutu, ne do stránky: `page.tsx` je klientská komponenta
// (`'use client'`), takže by se JSON-LD zbytečně vezlo i do klientského balíku.
// Layout je serverový, schema se vykreslí na serveru a do balíku nespadne.
// Text položek souhlasí s viditelným drobečkem na stránce i s hlavičkou.
const breadcrumbItems = [
  { name: 'Domů', url: SITE.url },
  { name: 'O nás', url: `${SITE.url}/o-nas` },
]

export default function ONasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      {children}
    </>
  )
}
