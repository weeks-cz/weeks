import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Calendar, Check, Clock, Users, Wallet } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { EventSchema, BreadcrumbSchema } from '@/components/seo/StructuredData'
import { TurnusCard } from '@/components/turnusy/TurnusCard'
import { turnusLabels } from '@/components/turnusy/turnus-labels'
import { TurnusInterestForm } from '@/components/turnusy/TurnusInterestForm'
import { VenueShowcase } from '@/components/turnusy/VenueShowcase'
import { getCity, getVenue } from '@/lib/cities'
import { PROVOZNI_DOBA, SITE } from '@/lib/site'
import { zkusiSiTabora } from '@/lib/tabory'
import { getTurnus, getTurnusy, getTaboryTurnusu, isBookable } from '@/lib/turnusy'

/**
 * Stránka konkrétního termínu — nejkratší ze tří úrovní.
 *
 * Popis tábora se sem schválně NEDUPLIKUJE. Při několika tématech, dvou
 * městech a více termínech by vznikla řada skoro shodných stránek a vyhledávač
 * by si z nich vybral jednu sám. Popis proto žije jen na stránce tématu a sem
 * vede odkaz „Celý popis tábora“ plus tři body výtahu.
 *
 * Adresa je `/tabory/termin/[slug]`, ne vnořená pod téma: turnus může mít témat
 * víc a změna tématu by jinak vynutila přesměrování adresy, která je na
 * vydané faktuře.
 */

/** Adres je málo a mění se jen s daty — předgenerují se staticky. */
export function generateStaticParams() {
  return getTurnusy().map((turnus) => ({ slug: turnus.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const turnus = getTurnus(slug)
  if (!turnus) return {}

  const mesto = getCity(turnus.city).name
  const l = turnusLabels(turnus)
  const title = `Letní IT tábor ${mesto} — ${l.datum} | Weeks`
  const url = `${SITE.url}/tabory/termin/${turnus.slug}`

  return {
    title: { absolute: title },
    description: turnus.perex,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: turnus.perex,
      url,
      siteName: SITE.name,
      type: 'website',
      locale: 'cs_CZ',
      // Next slučuje `openGraph` z různých úrovní jen mělce — vlastní blok tu
      // proto musí nést i obrázek a `url`, jinak by se sdílený odkaz na termín
      // v náhledu tvářil jako obecná stránka `/tabory`.
      images: [{ url: `${SITE.url}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: turnus.perex,
      images: [`${SITE.url}/opengraph-image`],
    },
  }
}

export default async function TerminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const turnus = getTurnus(slug)
  if (!turnus) notFound()

  const l = turnusLabels(turnus)
  const tabory = getTaboryTurnusu(turnus)
  const tabor = tabory[0]
  const venue = turnus.venueId ? getVenue(turnus.venueId) : null
  const dalsiTurnusy = getTurnusy().filter((t) => t.id !== turnus.id)
  const prodejny = isBookable(turnus)

  // Tři body výtahu, ne celý popis — ten patří stránce tématu.
  const vytah = tabor ? zkusiSiTabora(tabor).slice(0, 3) : []

  return (
    <>
      <EventSchema turnusy={[turnus]} />
      <BreadcrumbSchema
        items={[
          { name: 'Domů', url: SITE.url },
          { name: 'Tábory', url: `${SITE.url}/tabory` },
          ...(tabor
            ? [{ name: tabor.shortName, url: `${SITE.url}/tabory/${tabor.id}` }]
            : []),
          // Poslední položka musí textem odpovídat tomu, co stránka níž
          // doopravdy ukazuje, ne jen datu.
          { name: `${l.mesto} — ${l.datum}`, url: `${SITE.url}/tabory/termin/${turnus.slug}` },
        ]}
      />
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-ink/15 bg-paper blueprint-grid pb-16 pt-32">
          <div className="section-container relative z-10">
            <div className="max-w-3xl">
              <nav
                aria-label="Drobečková navigace"
                className="mb-8 font-mono text-xs uppercase tracking-[0.2em]"
              >
                <Link href="/" className="text-ink/50 transition-colors hover:text-primary-600">
                  Domů
                </Link>
                <span className="mx-2 text-ink/30">/</span>
                <Link href="/tabory" className="text-ink/50 transition-colors hover:text-primary-600">
                  Tábory
                </Link>
                {tabor && (
                  <>
                    <span className="mx-2 text-ink/30">/</span>
                    <Link
                      href={`/tabory/${tabor.id}`}
                      className="text-ink/50 transition-colors hover:text-primary-600"
                    >
                      {tabor.shortName}
                    </Link>
                  </>
                )}
                <span className="mx-2 text-ink/30">/</span>
                <span className="font-medium text-ink">
                  {l.mesto} — {l.datum}
                </span>
              </nav>

              <p className="mono-label mb-6">{l.mesto}</p>

              <h1 className="heading-1 mb-6 text-ink">
                {tabor ? tabor.name : 'Letní příměstský tábor'} —{' '}
                <span className="text-accent-600">{l.datum}</span>
              </h1>

              <p className="mb-10 max-w-2xl text-lg leading-relaxed text-ink-500 md:text-xl">
                {turnus.perex}
              </p>

              {/* Technický štítek termínu. `<dt>` stojí ve zdroji před svým
                  `<dd>`; vizuálně patří pod hodnotu, což řeší `order-last`. */}
              <dl className="mb-10 grid grid-cols-2 overflow-hidden rounded-md border border-ink bg-white sm:grid-cols-4">
                {[
                  { icon: Calendar, label: '5 dní', sublabel: 'Po – Pá' },
                  { icon: Clock, label: PROVOZNI_DOBA.rozsah, sublabel: 'každý den' },
                  { icon: Users, label: `Max ${turnus.capacity}`, sublabel: 'dětí' },
                  { icon: Wallet, label: l.cena || 'Upřesníme', sublabel: 'cena' },
                ].map((fact, i) => (
                  <div
                    key={fact.sublabel}
                    className={`flex flex-col border-ink/15 p-4 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${i > 0 ? 'sm:border-l' : ''}`}
                  >
                    <fact.icon className="mb-2 h-4 w-4 text-accent-600" aria-hidden="true" />
                    <dt className="order-last mt-0.5 font-mono text-xs uppercase tracking-wider text-ink/50">
                      {fact.sublabel}
                    </dt>
                    <dd className="font-display text-sm font-semibold text-ink">{fact.label}</dd>
                  </div>
                ))}
              </dl>

              {prodejny ? (
                // `prodejny` je stejná podmínka (`isBookable`), ze které
                // `turnusLabels` odvozuje `ctaHref` — v téhle větvi je vyplněné.
                <Link href={l.ctaHref!} className="btn-primary group inline-flex px-8 py-4">
                  {l.ctaText}
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <TurnusInterestForm turnus={turnus} source={`turnus-${turnus.slug}`} />
              )}
            </div>
          </div>
        </section>

        {/* Výtah z tématu a odkaz na jeho celý popis — ten se sem neopisuje. */}
        {tabor && (
          <section className="section-padding bg-paper">
            <div className="section-container">
              <div className="max-w-3xl">
                <p className="mono-label mb-4">Co se na tomhle táboře dělá</p>
                <h2 className="heading-2 mb-6 text-ink">{tabor.name}</h2>

                <ul className="mb-8 space-y-3">
                  {vytah.map((bod) => (
                    <li key={bod} className="flex gap-3 text-lg text-ink-500">
                      <Check className="mt-1 h-5 w-5 shrink-0 text-accent-600" aria-hidden="true" />
                      {bod}
                    </li>
                  ))}
                </ul>

                <Link href={`/tabory/${tabor.id}`} className="btn-outline group">
                  Celý popis tábora
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </section>
        )}

        {venue && <VenueShowcase venue={venue} />}

        {dalsiTurnusy.length > 0 && (
          <section className="section-padding border-t border-ink/15 bg-paper-soft">
            <div className="section-container">
              <h2 className="heading-2 mb-10 text-ink">Další termíny</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {dalsiTurnusy.map((t) => (
                  <TurnusCard key={t.id} turnus={t} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
