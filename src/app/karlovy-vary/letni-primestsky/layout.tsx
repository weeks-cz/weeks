import { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Letní příměstský IT tábor v Karlových Varech | Weeks' },
  description: 'Letní příměstský tábor chytrých technologií pro děti 9–15 let v Karlových Varech. 3D tisk, IoT, VR a programování ve VARY&TE. Po–Pá, 8:00–17:00.',
  alternates: { canonical: 'https://weeks.cz/karlovy-vary/letni-primestsky' },
  openGraph: {
    title: 'Letní příměstský IT tábor v Karlových Varech | Weeks',
    description: 'Letní příměstský tábor chytrých technologií pro děti 9–15 let v Karlových Varech. 3D tisk, IoT, VR a programování ve VARY&TE. Po–Pá, 8:00–17:00.',
    url: 'https://weeks.cz/karlovy-vary/letni-primestsky',
    type: 'website',
    locale: 'cs_CZ',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
