import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Cpu, Package, ShieldCheck, Sparkles } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartButton } from '@/components/shop/CartButton'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { formatPrice, shopProducts } from '@/lib/shop'

export default function ShopPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-primary-50/40 to-accent-50/30 pt-32 pb-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-accent-200/30 blur-3xl" />
            <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl" />
          </div>

          <div className="section-container relative z-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-primary-700 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                  Arduino a IoT sady od Weeks
                </div>
                <h1 className="heading-1 text-gray-900">
                  E-shop pro děti, které chtějí stavět, zapojovat a programovat i doma
                </h1>
                <p className="mt-6 max-w-2xl text-xl leading-8 text-gray-600">
                  Vybíráme sady tak, aby navazovaly na to, co děti zažijí na Weeks. Zatím fungujeme jako poptávkový e-shop: vyberete si sady, pošlete poptávku a my se ozveme s potvrzením a dalším postupem.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CartButton />
                <Link href="/eshop/kosik" className="btn-primary">
                  Poptat vybrané sady
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { icon: Cpu, title: 'Vybrané pro Arduino projekty', text: 'Sady jsme poskládali kolem prvních smysluplných pokusů a domácího bastlení.' },
                { icon: Package, title: 'Přehledný další krok', text: 'Místo složité platby nejdřív získáte lidské potvrzení, doporučení a dostupnost.' },
                { icon: ShieldCheck, title: 'Navazuje na Weeks', text: 'Materiál i obtížnost směřujeme tak, aby to dávalo smysl po táboře nebo jako příprava před ním.' },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100">
                    <item.icon className="h-5 w-5 text-primary-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="section-container">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-600">Nabídka</p>
                <h2 className="heading-2 mt-2 text-gray-900">První IoT sady</h2>
              </div>
              <p className="hidden max-w-xl text-right text-sm leading-6 text-gray-500 lg:block">
                Ceny jsou orientační a potvrzujeme je při poptávce podle aktuální dostupnosti komponent.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              {shopProducts.map((product) => (
                <article
                  key={product.slug}
                  className="group overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow-sm">
                      {product.badge}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-primary-600">{product.subtitle}</p>
                        <h3 className="mt-1 text-2xl font-bold text-gray-900">{product.name}</h3>
                      </div>
                      <div className="rounded-2xl bg-gray-50 px-4 py-2 text-right">
                        <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
                        <p className="text-xs text-gray-500">orientačně</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-600">{product.description}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                        {product.ageRange}
                      </span>
                      <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
                        {product.level}
                      </span>
                      <span className="rounded-full bg-trust-50 px-3 py-1 text-xs font-medium text-trust-700">
                        {product.leadTime}
                      </span>
                    </div>

                    <ul className="mt-5 space-y-2 text-sm text-gray-600">
                      {product.highlights.slice(0, 3).map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <AddToCartButton productSlug={product.slug} productName={product.name} />
                      <Link
                        href={`/eshop/${product.slug}`}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-700"
                      >
                        Detail sady
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
