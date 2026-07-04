import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartPageClient } from '@/components/shop/CartPageClient'

// Košík nepatří do vyhledávačů.
export const metadata: Metadata = {
  title: { absolute: 'Košík | Weeks E-shop' },
  robots: { index: false, follow: false },
}

export default function ShopCartPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-night pt-32 pb-20">
        <section className="section-container">
          <div className="mb-10 max-w-3xl">
            <p className="data-label mb-4">Košík</p>
            <h1 className="mt-3 heading-1 text-white">
              Vybrané Weeks sady
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Pošlete nám vybrané sady a kontakt. Potvrdíme dostupnost, doporučíme vhodnou variantu, pokud si nejste jistí, a domluvíme s vámi dokončení objednávky.
            </p>
          </div>

          <CartPageClient />
        </section>
      </main>
      <Footer />
    </>
  )
}
