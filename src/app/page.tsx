import { HeroSection } from '@/components/sections/HeroSection'
import { TickerStrip } from '@/components/ui/TickerStrip'
import { ProgramSection } from '@/components/sections/ProgramSection'
import { USPSection } from '@/components/sections/USPSection'
import { TrustSection } from '@/components/sections/TrustSection'
import { UpcomingTermsSection } from '@/components/sections/UpcomingTermsSection'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { OrganizationSchema, LocalBusinessSchema, EventSchema } from '@/components/seo/StructuredData'
import { getAllUpcomingTerms, getNearestTermsByProgram } from '@/lib/camps'

export const revalidate = 300

export default async function Home() {
  const [upcomingTerms, nearestTerms] = await Promise.all([
    getAllUpcomingTerms(),
    getNearestTermsByProgram(),
  ])

  return (
    <>
      <OrganizationSchema />
      <LocalBusinessSchema />
      <EventSchema />
      <Header />
      <main id="main">
        <HeroSection />
        <TickerStrip />
        <ProgramSection />
        <USPSection />
        <TrustSection />
        <UpcomingTermsSection terms={upcomingTerms} />
        <CTASection nextTerms={nearestTerms} />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
