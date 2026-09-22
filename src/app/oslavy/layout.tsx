import type { Metadata } from 'next'
import { SITE } from '@/lib/site'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'

const pageTitle = 'Oslavy pro děti'
// Popis schválně nezmiňuje cenu ani počet odbavených oslav — ceník neexistuje
// a první oslava teprve bude. Viz `src/lib/oslavy.ts`.
const pageDescription = `Technologie na dětskou oslavu — 3D tisk a elektronika přímo na místě, každé dítě si něco odnese. Program i rozsah domluvíme. Pořádá ${SITE.legalName}.`
const pageUrl = `${SITE.url}/oslavy`

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
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
    images: [`${SITE.url}/opengraph-image`],
  },
}

// Drobečky patří do layoutu, ne do stránky: `page.tsx` je klientská komponenta
// kvůli formuláři, takže by se JSON-LD zbytečně vezlo i do klientského balíku.
// `/oslavy` nemá podstránky, takže layout nemůže vykreslit druhý, konkurenční
// `BreadcrumbList` — na rozdíl od `/tabory`, kde proto drobečky bydlí
// v jednotlivých `page.tsx`.
const breadcrumbItems = [
  { name: 'Domů', url: SITE.url },
  { name: 'Oslavy', url: pageUrl },
]

export default function OslavyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      {children}
    </>
  )
}
