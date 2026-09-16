import type { Metadata } from 'next'
import { SITE } from '@/lib/site'

const title = 'Letní příměstský tábor chytrých technologií | Weeks'
const description =
  'Týdenní příměstský tábor pro děti 9–15 let. 3D tisk, 3D modelování a IoT s Arduinem, jeden lektor na pět dětí, oběd i materiál v ceně.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE.url}/tabor` },
  openGraph: {
    title,
    description,
    url: `${SITE.url}/tabor`,
    siteName: SITE.name,
    type: 'website',
    locale: 'cs_CZ',
    // Next slučuje `openGraph` z layoutů jen mělce — vlastní blok tu proto musí
    // nést i obrázek, jinak přebije kořenový a náhled zmizí (viz opravné kolo 2).
    images: [
      {
        url: `${SITE.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  // Twitter dědí ze stejného důvodu, z jakého potřebuje vlastní `openGraph` —
  // vlastní blok na téhle úrovni jen mělce přebije kořenový (viz opravné kolo 3).
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${SITE.url}/opengraph-image`],
  },
}

export default function TaborLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
