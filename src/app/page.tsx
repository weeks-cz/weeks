import { HeroSection } from '@/components/sections/HeroSection'
import { TickerStrip } from '@/components/ui/TickerStrip'
import { NejblizsiTurnusy } from '@/components/sections/NejblizsiTurnusy'
import { ProRodice } from '@/components/sections/ProRodice'
import { FotoPas } from '@/components/sections/FotoPas'
import { ProDeti } from '@/components/sections/ProDeti'
import { GoogleRecenze } from '@/components/sections/GoogleRecenze'
import { Rozcesti } from '@/components/sections/Rozcesti'
import { FAQSection } from '@/components/sections/FAQSection'
import { InstagramPas } from '@/components/sections/InstagramPas'
import { ContactSection } from '@/components/sections/ContactSection'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { OrganizationSchema, LocalBusinessSchema } from '@/components/seo/StructuredData'

/**
 * Úvodka — rozcestí, ne katalog.
 *
 * Pořadí sekcí drží pravidlo rytmu: mezi dvěma sousedními sekcemi musí být
 * předěl, buď změnou pozadí, nebo linkou. Dřív šly `USPSection`, `KdeASKym`
 * a `Rozcesti` po sobě se stejným pozadím a bez linky, takže mezi nimi zela
 * skoro dvoustovka pixelů prázdného krému bez záchytného bodu.
 *
 *   hero          ink        + mřížka
 *   ticker        amber      + border-y
 *   turnusy       paper-soft + border-y
 *   pro rodiče    trust-50   + border-y
 *   fotopás       fotka
 *   pro děti      ink        + interaktivní mřížka
 *   recenze       paper      + border-y  (jen když jsou v `recenze.ts`)
 *   rozcestí      paper
 *   FAQ           paper-soft + border-b
 *   instagram     paper      + border-b  (jen když jsou v `instagram.ts`)
 *   kontakt       amber      + border-y
 */
export default function Home() {
  return (
    <>
      <OrganizationSchema />
      <LocalBusinessSchema />
      <Header />
      <main>
        <HeroSection />
        <TickerStrip />
        <NejblizsiTurnusy />
        <ProRodice />
        <FotoPas />
        <ProDeti />
        <GoogleRecenze />
        <Rozcesti />
        <FAQSection />
        <InstagramPas />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
