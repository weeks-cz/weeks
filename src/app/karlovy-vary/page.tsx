import { HeroSection } from '@/components/sections/HeroSection'
import { ProgramSection } from '@/components/sections/ProgramSection'
import { USPSection } from '@/components/sections/USPSection'
import { TrustSection } from '@/components/sections/TrustSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function KarlovyVaryHome() {
  return (
    <>
      <Header />
      <main id="main">
        <HeroSection />
        <ProgramSection />
        <USPSection />
        <TrustSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
