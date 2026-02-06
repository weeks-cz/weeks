import type { Metadata } from 'next'

const pageTitle = 'Tábor chytrých technologií'
const pageDescription = 'Víkendový tábor pro děti 10–15 let v Praze. 3D tisk, IoT programování a virtuální realita. Sobota + neděle, 9:00–17:00. Organizátor: DDM Praha 6.'
const pageUrl = 'https://weeks.cz/tabor-chytrych-technologii'

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

export default function TaborLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
