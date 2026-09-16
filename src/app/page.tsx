import { HeroSection } from '@/components/sections/HeroSection'
import { TickerStrip } from '@/components/ui/TickerStrip'
import { USPSection } from '@/components/sections/USPSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { OrganizationSchema, LocalBusinessSchema, EventSchema } from '@/components/seo/StructuredData'
import { nejblizsiTurnusy } from '@/lib/turnusy'
import { NejblizsiTurnusy } from '@/components/sections/NejblizsiTurnusy'
import { KdeASKym } from '@/components/sections/KdeASKym'
import { Rozcesti } from '@/components/sections/Rozcesti'

export default function Home() {
  return (
    <>
      <OrganizationSchema />
      <LocalBusinessSchema />
      {/* Stejný výřez, jaký ukazuje `NejblizsiTurnusy` níž — strukturovaná
          data na úvodce nesmí vypsat turnus, který na ní není vidět. */}
      <EventSchema turnusy={nejblizsiTurnusy()} />
      <Header />
      <main>
        <HeroSection />
        <TickerStrip />
        <NejblizsiTurnusy />
        <USPSection />
        <KdeASKym />
        <Rozcesti />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
