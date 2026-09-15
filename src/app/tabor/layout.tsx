import type { Metadata } from 'next'
import { SITE } from '@/lib/site'

const title = 'Letní příměstský tábor chytrých technologií | Weeks'
const description =
  'Týdenní příměstský tábor pro děti 9–15 let. 3D tisk, 3D modelování a IoT s Arduinem, jeden lektor na pět dětí, oběd i materiál v ceně.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE.url}/tabor` },
  openGraph: {
    title,
    description,
    url: `${SITE.url}/tabor`,
    type: 'website',
    locale: 'cs_CZ',
  },
}

export default function TaborLayout({ children }: { children: React.ReactNode }) {
  return children
}
