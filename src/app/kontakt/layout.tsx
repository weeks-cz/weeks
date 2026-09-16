import type { Metadata } from 'next'
import { SITE } from '@/lib/site'

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

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
