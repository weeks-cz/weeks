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
      <main className="bg-night">
        <ProductTracking productSlug={product.slug} productName={product.name} />
        <section className="pt-32 pb-12">
          <div className="section-container">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/eshop"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-accent-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Zpět na přehled sad
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[32px] bg-slate-100 p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover rounded-2xl"
                />
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full bg-primary-950/50 px-4 py-2 text-sm font-medium text-primary-400 border border-primary-500/30">
                    {product.badge}
                  </span>
                  <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-slate-300 border border-white/15">
                    {product.categoryLabel}
                  </span>
                </div>
                <p className="mt-5 data-label">{product.subtitle}</p>
                <h1 className="mt-2 heading-2 text-white">{product.name}</h1>
                <p className="mt-5 text-lg leading-8 text-slate-300">{product.longDescription}</p>

                <div className="mt-6 rounded-2xl bg-primary-950/40 border border-primary-500/30 p-5 text-sm font-medium leading-6 text-primary-300">
                  {product.unlocks}
                </div>

                {product.compatibility && (
                  <div className="mt-3 rounded-2xl bg-cta-950/40 border border-cta-500/30 p-5 text-sm leading-6 text-cta-300">
                    {product.compatibility}
                  </div>
                )}

                <div className="mt-3 rounded-2xl bg-cta-950/40 border border-cta-500/30 p-5 text-sm font-medium leading-6 text-cta-300">
                  {productConceptNotice}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Cena', value: formatPrice(product.price) },
                    { label: 'Doporučený věk', value: product.ageRange },
                    { label: 'Obtížnost', value: product.level },
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl bg-night-800 border border-white/10 p-4">
                      <p className="data-label text-xs">{item.label}</p>
                      <p className="mt-1 font-semibold text-white font-mono text-accent-400">{item.value}</p>
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
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-night-800 px-5 py-3 font-semibold text-slate-300 transition-colors hover:border-accent-400 hover:text-accent-300"
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
            <div className="card-glow lg:col-span-1">
              <h2 className="text-xl font-bold text-white">Co obsahuje</h2>
              <ul className="mt-5 space-y-3">
                {product.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-trust-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-glow">
              <h2 className="text-xl font-bold text-white">Odemčení v Učebně</h2>
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-primary-950/40 border border-primary-500/30 p-4 text-sm leading-6 text-primary-300">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />
                <p>
                  Produkt odemkne odpovídající část Weeks Učebny. U celé sady jde o úroveň, u kitu o navazující level a u malého projektu jen o konkrétní lekci.
                </p>
              </div>
              <ul className="mt-5 space-y-3">
                {product.projects.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://iot.weeks.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-400 transition-colors hover:text-accent-300"
              >
                Podívat se do Učebny
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="card-glow">
              <h2 className="text-xl font-bold text-white">Proč dává smysl</h2>
              <ul className="mt-5 space-y-3">
                {product.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-glow lg:col-span-3 bg-night-700">
              <h2 className="text-xl font-bold text-white">Komu ji doporučujeme</h2>
              <ul className="mt-5 grid grid-cols-1 gap-3 text-sm leading-6 text-slate-300 md:grid-cols-3">
                {product.idealFor.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cta-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-300">
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
