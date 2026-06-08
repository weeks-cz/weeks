import { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'O nás | Weeks Karlovy Vary' },
  description: 'Tým Weeks za IT tábory pro děti v Karlových Varech. Praktická výuka 3D tisku, programování, IoT a VR ve VARY&TE Creative Center.',
  alternates: { canonical: 'https://weeks.cz/karlovy-vary/o-nas' },
  openGraph: {
    title: 'O nás | Weeks Karlovy Vary',
    description: 'Tým Weeks za IT tábory pro děti v Karlových Varech. Praktická výuka 3D tisku, programování, IoT a VR ve VARY&TE Creative Center.',
    url: 'https://weeks.cz/karlovy-vary/o-nas',
    type: 'website',
    locale: 'cs_CZ',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
