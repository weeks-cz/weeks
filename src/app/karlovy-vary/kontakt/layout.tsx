import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt | Weeks Karlovy Vary',
  description: 'Kontaktujte nás ohledně IT kempů Weeks v Karlových Varech. VARY&TE Creative Center.',
  alternates: { canonical: 'https://weeks.cz/karlovy-vary/kontakt' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
