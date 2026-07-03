import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, CheckCircle2, ExternalLink } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductInterestButton } from '@/components/shop/ProductInterestButton'
import { formatPrice, getShopProductBySlug, productConceptNotice } from '@/lib/shop'
import { ProductTracking } from '@/components/shop/ProductTracking'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getShopProductBySlug(slug)
  if (!product) return { title: { absolute: 'Produkt nenalezen | Weeks' } }
  const url = `https://weeks.cz/eshop/${product.slug}`
  return {
    title: { absolute: `${product.name} | Weeks E-shop` },
    description: `${product.name} — stavebnice a projekt Weeks pro mladé tvůrce, navazuje na výukovou Učebnu Weeks.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.name} | Weeks E-shop`,
      url,
      type: 'website',
      locale: 'cs_CZ',
    },
  }
}

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getShopProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="bg-paper">
        <ProductTracking productSlug={product.slug} productName={product.name} />
        <section className="pt-32 pb-12">
          <div className="section-container">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/eshop"
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-primary-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Zpět na přehled sad
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative aspect-[5/4] overflow-hidden rounded-md border border-ink shadow-hard bg-paper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex border border-ink rounded-sm px-2.5 py-1 font-mono text-xs font-medium text-ink bg-paper">
                    {product.badge}
                  </span>
                  <span className="inline-flex border border-ink/20 rounded-sm px-2.5 py-1 font-mono text-xs font-medium text-ink bg-paper">
                    {product.categoryLabel}
                  </span>
                </div>
                <p className="mt-5 text-sm font-mono text-primary-600">{product.subtitle}</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink">{product.name}</h1>
                <p className="mt-5 text-lg leading-8 text-ink-500">{product.longDescription}</p>

                <div className="mt-6 rounded-md border border-primary-500/20 bg-primary-50 p-5 text-sm font-medium leading-6 text-primary-900">
                  {product.unlocks}
                </div>

                {product.compatibility && (
                  <div className="mt-3 rounded-md border border-amber-300/30 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                    {product.compatibility}
                  </div>
                )}

                <div className="mt-3 rounded-md border border-amber-300/30 bg-amber-50 p-5 text-sm font-medium leading-6 text-amber-900">
                  {productConceptNotice}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Cena', value: formatPrice(product.price) },
                    { label: 'Doporučený věk', value: product.ageRange },
                    { label: 'Obtížnost', value: product.level },
                  ].map((item) => (
                    <div key={item.label} className="rounded-md border border-ink/15 bg-paper-soft p-4">
                      <p className="text-sm text-ink-500">{item.label}</p>
                      <p className="mt-1 font-mono font-semibold text-ink">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ProductInterestButton
                    productSlug={product.slug}
                    productName={product.name}
                    productType={product.type}
                    buttonLabel="Mám zájem o tento produkt"
                  />
                  <a
                    href="https://iot.weeks.cz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                  >
                    Učebna
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="section-container grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-md border border-ink/15 bg-paper p-6 card-maker lg:col-span-1">
              <h2 className="text-xl font-bold text-ink">Co obsahuje</h2>
              <ul className="mt-5 space-y-3">
                {product.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-ink-500">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-trust-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-ink/15 bg-paper p-6 card-maker">
              <h2 className="text-xl font-bold text-ink">Odemčení v Učebně</h2>
              <div className="mt-5 flex items-start gap-3 rounded-md border border-primary-500/20 bg-primary-50 p-4 text-sm leading-6 text-primary-900">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <p>
                  Produkt odemkne odpovídající část Weeks Učebny. U celé sady jde o úroveň, u kitu o navazující level a u malého projektu jen o konkrétní lekci.
                </p>
              </div>
              <ul className="mt-5 space-y-3">
                {product.projects.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-ink-500">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-primary-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://iot.weeks.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
              >
                Podívat se do Učebny
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="rounded-md border border-ink/15 bg-paper p-6 card-maker">
              <h2 className="text-xl font-bold text-ink">Proč dává smysl</h2>
              <ul className="mt-5 space-y-3">
                {product.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-ink-500">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-primary-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-ink bg-ink text-paper p-6 shadow-hard lg:col-span-3">
              <h2 className="text-xl font-bold">Komu ji doporučujeme</h2>
              <ul className="mt-5 grid grid-cols-1 gap-3 text-sm leading-6 text-paper/80 md:grid-cols-3">
                {product.idealFor.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-cta-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-md border border-ink/20 bg-ink/30 p-4 text-sm leading-6 text-paper/80">
                Nejste si jistí výběrem? Dejte nám u produktu zájem a do poznámky napište věk dítěte, předchozí zkušenosti a jestli už doma máte Starter sadu.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
