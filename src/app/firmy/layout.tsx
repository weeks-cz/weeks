import type { Metadata } from 'next'
import { SITE } from '@/lib/site'

const pageTitle = 'Weeks pro firmy'
// Popis pro vyhledávače pojmenovává tři nabídky a pořadatele, ale schválně
// nezmiňuje cenu ani reference — ceník neexistuje a `reference` je zatím
// prázdné pole v `src/lib/firmy.ts`.
const pageDescription = `${SITE.legalName} nabízí firmám dny pro děti zaměstnanců, workshopy pro tým a partnerství s letním IT táborem pro děti.`
const pageUrl = `${SITE.url}/firmy`

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
    // nést i obrázek, jinak přebije kořenový a náhled zmizí (stejná past jako
    // ve fázi 3, viz komentář v `src/app/kontakt/layout.tsx`).
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
  // vlastní blok na téhle úrovni jen mělce přebije kořenový, takže bez
  // vlastního obrázku by se stránka sdílela bez náhledu.
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
    images: [`${SITE.url}/opengraph-image`],
  },
}

export default function FirmyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
