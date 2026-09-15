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
        url: `${SITE.url}/og-image-v2.jpg`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
}

export default function TaborLayout({ children }: { children: React.ReactNode }) {
  return children
}
