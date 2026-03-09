import type { Metadata } from 'next'

const pageTitle = 'Jednodenní tábor 3D tisku pro děti | Weeks'
const pageDescription = 'Jednodenní tábor 3D tisku pro děti 10–15 let v Praze. Návrh modelu, tisk na Prusa tiskárnách a post-processing. Sobota 9:00–17:00. Organizátor: DDM Praha 6.'
const pageUrl = 'https://weeks.cz/tabor-3d-tisk'

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
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
}

export default function Tabor3DTiskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
