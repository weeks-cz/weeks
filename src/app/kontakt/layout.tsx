import type { Metadata } from 'next'
import { SITE } from '@/lib/site'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'

const pageTitle = 'Kontakt'
// Popisek dřív mluvil o víkendových kempech a adrese HWLab (Kongresové
// centrum Praha) — obojí je pryč, viz Project Overview v CLAUDE.md.
// `SITE.legalName` končí tečkou ("Weeks s.r.o.") — věta proto nesmí skončit
// hned za ní, jinak vznikne dvojtečkování ("s.r.o..").
const pageDescription = `Kontaktujte ${SITE.legalName}, IČO ${SITE.ico} — e-mail, telefon i místa konání turnusů týdenního IT tábora pro děti najdete na této stránce.`
const pageUrl = `${SITE.url}/kontakt`

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
    // Next slučuje `openGraph` z layoutů jen mělce — vlastní blok tu proto musí
    // nést i obrázek, jinak přebije kořenový a náhled zmizí (viz opravné kolo 2).
    images: [
      {
        url: `${SITE.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: pageTitle,
      },
    ],
  },
  // Twitter dědí ze stejného důvodu, z jakého potřebuje vlastní `openGraph` —
  // vlastní blok na téhle úrovni jen mělce přebije kořenový (viz opravné kolo 2).
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
  { name: 'Kontakt', url: `${SITE.url}/kontakt` },
]

export default function KontaktLayout({
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
