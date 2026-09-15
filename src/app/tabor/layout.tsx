import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Letní příměstský tábor chytrých technologií | Weeks',
  description:
    'Týdenní příměstský tábor pro děti 9–15 let. 3D tisk, 3D modelování a IoT s Arduinem, jeden lektor na pět dětí, oběd i materiál v ceně.',
  alternates: { canonical: 'https://weeks.cz/tabor' },
}

export default function TaborLayout({ children }: { children: React.ReactNode }) {
  return children
}
