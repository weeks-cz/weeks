import type { Metadata } from 'next'

const pageTitle = 'Programy'
const pageDescription = 'Vyberte si z 7 víkendových IT programů pro děti: MIX, 3D tisk, IoT & elektronika, 3D modelování, tvorba webu, vývoj her, programování. Pro děti 10-15 let v Praze.'
const pageUrl = 'https://weeks.cz/program'

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

export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
