import type { Metadata } from 'next'
import { SITE } from '@/lib/site'

const pageTitle = 'Kontakt'
// Popisek dřív mluvil o víkendových kempech a adrese HWLab (Kongresové
// centrum Praha) — obojí je pryč, viz Project Overview v CLAUDE.md.
const pageDescription = `Kontaktujte ${SITE.legalName}. E-mail, telefon i místa konání turnusů týdenního IT tábora pro děti najdete na této stránce.`
const pageUrl = `${SITE.url}/kontakt`

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

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
