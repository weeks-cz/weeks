import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tábor chytrých technologií pro děti | Weeks Karlovy Vary',
  description: 'Víkendový IT tábor pro děti 10-15 let v Karlových Varech. 3D tisk, IoT, VR a programování ve VARY&TE Creative Center. So + Ne, 2 990 Kč. Organizátor: Weeks.',
  alternates: { canonical: 'https://weeks.cz/karlovy-vary/tabor-chytrych-technologii' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
