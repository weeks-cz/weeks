import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jednodenní tábor 3D tisku pro děti | Weeks Karlovy Vary',
  description: 'Jednodenní tábor 3D tisku pro děti 10-15 let v Karlových Varech. Návrh, modelování a tisk na profesionálních 3D tiskárnách ve Vary&Te Creative Center. Organizátor: Weeks.',
  alternates: { canonical: 'https://weeks.cz/karlovy-vary/tabor-3d-tisk' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
