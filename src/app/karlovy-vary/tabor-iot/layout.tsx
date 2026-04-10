import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jednodenní tábor IoT & elektroniky pro děti | Weeks Karlovy Vary',
  description: 'Jednodenní tábor IoT a elektroniky pro děti 10-15 let v Karlových Varech. Micro:bit, Arduino, senzory a vlastní chytré zařízení ve Vary&Te Creative Center. Organizátor: Weeks.',
  alternates: { canonical: 'https://weeks.cz/karlovy-vary/tabor-iot' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
