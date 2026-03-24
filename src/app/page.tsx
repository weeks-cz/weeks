import { HeroSection } from '@/components/sections/HeroSection'
import { SummerBanner } from '@/components/sections/SummerBanner'
import { ProgramSection } from '@/components/sections/ProgramSection'
import { USPSection } from '@/components/sections/USPSection'
import { TrustSection } from '@/components/sections/TrustSection'
import { UpcomingTermsSection } from '@/components/sections/UpcomingTermsSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <HeroSection />
        <SummerBanner />
        <ProgramSection />
        <USPSection />
        <TrustSection />
        <UpcomingTermsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
