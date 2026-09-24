import type { Metadata } from 'next'
import { SITE } from '@/lib/site'

const title = 'Letní příměstské tábory pro děti | Weeks'
const description =
  'Týdenní příměstské tábory pro děti 9–15 let v Praze a Karlových Varech. 3D tisk a IoT s Arduinem v malých skupinkách, oběd v ceně.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE.url}/tabory` },
  openGraph: {
    title,
    description,
    url: `${SITE.url}/tabory`,
    siteName: SITE.name,
    type: 'website',
    locale: 'cs_CZ',
    // Next slučuje `openGraph` z layoutů jen mělce — vlastní blok tu proto musí
    // nést i obrázek, jinak přebije kořenový a náhled zmizí.
    images: [
      {
        url: `${SITE.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${SITE.url}/opengraph-image`],
  },
}

/**
 * Layout tu existuje jen kvůli metadatům výš — a jen pro výpis; stránky témat
 * i termínů si je přepisují vlastním `generateMetadata`.
 *
 * Drobečkové JSON-LD sem NEPATŘÍ: tenhle layout obaluje i `/tabory/[tema]`
 * a `/tabory/termin/[slug]`, takže by se na nich vykreslily dvě protichůdné
 * cesty naráz. Každá stránka si drobečky vykresluje sama.
 */
export default function TaboryLayout({ children }: { children: React.ReactNode }) {
  return children
}
