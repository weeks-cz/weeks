import type { Metadata } from 'next'

const pageTitle = 'Jednodenní tábor IoT & elektroniky pro děti | Weeks'
const pageDescription = 'Jednodenní tábor IoT a elektroniky pro děti 10–15 let v Praze. Micro:bit, senzory a vlastní chytré zařízení. Sobota 9:00–17:00. Organizátor: DDM Praha 6.'
const pageUrl = 'https://weeks.cz/tabor-iot'

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

export default function TaborIoTLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
