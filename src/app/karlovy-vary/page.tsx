import { HeroSection } from '@/components/sections/HeroSection'
import { ProgramSection } from '@/components/sections/ProgramSection'
import { USPSection } from '@/components/sections/USPSection'
import { TrustSection } from '@/components/sections/TrustSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContactSection } from '@/components/sections/ContactSection'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { OrganizationSchema, LocalBusinessSchema, EventSchema } from '@/components/seo/StructuredData'
import { LOCATIONS } from '@/lib/locations'
import { KVRegistrationSection } from './_components/KVRegistrationSection'

const kvLocation = LOCATIONS['karlovy-vary']

export const metadata: Metadata = {
  title: { absolute: 'IT tábory pro děti v Karlových Varech | Weeks' },
  description: kvLocation.seo.description,
  alternates: { canonical: 'https://weeks.cz/karlovy-vary' },
  openGraph: {
    title: 'IT tábory pro děti v Karlových Varech | Weeks',
    description: kvLocation.seo.description,
    url: 'https://weeks.cz/karlovy-vary',
    type: 'website',
    locale: 'cs_CZ',
  },
}

export default function KarlovyVaryHome() {
  return (
    <>
      <OrganizationSchema location={kvLocation} />
      <LocalBusinessSchema location={kvLocation} />
      <EventSchema location={kvLocation} />
      <Header />
      <main id="main">
        <HeroSection />
        <ProgramSection />
        <KVRegistrationSection />
        <USPSection />
        <TrustSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
