import type { Metadata } from 'next'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Calendar, Check, Clock, Cpu, Gamepad2, Glasses, Printer, Users, Wallet } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getTurnus, getTurnusy, isBookable } from '@/lib/turnusy'
import { getCity, getVenue } from '@/lib/cities'
import { getFocusModules, type FocusId } from '@/lib/focus'
import { SITE } from '@/lib/site'
import { TurnusCard } from '@/components/turnusy/TurnusCard'
import { turnusLabels } from '@/components/turnusy/turnus-labels'
import { VenueShowcase } from '@/components/turnusy/VenueShowcase'
import { TurnusInterestForm } from '@/components/turnusy/TurnusInterestForm'

/**
 * Vizuál zaměření pro tuhle stránku — `@/lib/focus` schválně nese jen obsah
 * (název, popis, odrážky), ne ikonu ani barvu, protože ty jsou věcí
 * vykreslení, ne dat. Barvy sdílejí paletu s kartami na `/tabor`.
 */
const focusVisual: Record<FocusId, { icon: LucideIcon; color: 'primary' | 'accent' | 'trust' }> = {
  '3d-tisk': { icon: Printer, color: 'primary' },
  'iot': { icon: Cpu, color: 'trust' },
  'vr': { icon: Glasses, color: 'accent' },
  'herni-vyvoj': { icon: Gamepad2, color: 'accent' },
}

const colorMap = {
  primary: { bg: 'bg-primary-50', icon: 'text-primary-600', check: 'text-primary-500' },
  accent: { bg: 'bg-accent-50', icon: 'text-accent-600', check: 'text-accent-500' },
  trust: { bg: 'bg-trust-50', icon: 'text-trust-600', check: 'text-trust-500' },
} as const

/** Adresa každého turnusu se předgeneruje staticky — turnusů je málo a mění se jen s daty. */
export function generateStaticParams() {
  return getTurnusy().map((turnus) => ({ turnus: turnus.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ turnus: string }>
}): Promise<Metadata> {
  const { turnus: slug } = await params
  const turnus = getTurnus(slug)
  if (!turnus) return {}

  const mesto = getCity(turnus.city).name
  const l = turnusLabels(turnus)
  const title = `Letní IT tábor ${mesto} — ${l.datum} | Weeks`
  const url = `${SITE.url}/tabor/${turnus.slug}`

  return {
    title,
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
      // proto musí nést i obrázek a siteName, jinak přebije kořenový/`/tabor`
      // blok a náhled zmizí (stejný vzor jako `src/app/tabor/layout.tsx`).
      // Bez vlastního `url` by se navíc sdílený odkaz na konkrétní turnus
      // v náhledu tvářil jako obecná stránka `/tabor`.
      images: [
        {
          url: `${SITE.url}/og-image-v2.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  }
}

export default async function TurnusPage({
  params,
}: {
  params: Promise<{ turnus: string }>
}) {
  const { turnus: slug } = await params
  const turnus = getTurnus(slug)

  if (!turnus) {
    notFound()
  }

  const l = turnusLabels(turnus)
  const zamereni = getFocusModules(turnus.focus)
  const venue = turnus.venueId ? getVenue(turnus.venueId) : null
  const dalsiTurnusy = getTurnusy().filter((t) => t.id !== turnus.id)
  const prodejny = isBookable(turnus)

  return (
    <>
      <Header />
      <main>
        {/* Hlavička — datum, cena a tlačítko, nic navíc */}
        <section className="relative bg-paper blueprint-grid border-b border-ink/15 overflow-hidden pt-32 pb-16">
          <div className="section-container relative z-10">
            <div className="max-w-3xl">
              {/* Drobečková navigace */}
              <div className="mb-8 font-mono text-xs uppercase tracking-[0.2em]">
                <Link href="/" className="text-ink/50 hover:text-primary-600 transition-colors">
                  Domů
                </Link>
                <span className="text-ink/30 mx-2">/</span>
                <Link href="/tabor" className="text-ink/50 hover:text-primary-600 transition-colors">
                  Tábor
                </Link>
                <span className="text-ink/30 mx-2">/</span>
                <span className="text-ink font-medium">
                  {l.mesto} — {l.datum}
                </span>
              </div>

              <p className="mono-label mb-6">{l.mesto}</p>

              <h1 className="heading-1 text-ink mb-6">
                Letní příměstský tábor —{' '}
                <span className="text-primary-600">{l.datum}</span>
              </h1>

              <p className="text-lg md:text-xl text-ink-500 mb-10 max-w-2xl leading-relaxed">
                {turnus.perex}
              </p>

              {/* Spec sheet — stejná mřížka jako na /tabor, jen se čtvrtou kolonkou pro cenu */}
              <dl className="mb-10 grid grid-cols-2 sm:grid-cols-4 border border-ink rounded-md overflow-hidden bg-white">
                {[
                  { icon: Calendar, label: '5 dní', sublabel: 'Po – Pá' },
                  { icon: Clock, label: '8:00–17:00', sublabel: 'každý den' },
                  { icon: Users, label: `Max ${turnus.capacity}`, sublabel: 'dětí' },
                  { icon: Wallet, label: l.cena || 'Upřesníme', sublabel: 'cena' },
                ].map((fact, i) => (
                  <div
                    key={fact.sublabel}
                    className={`p-4 border-ink/15 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${i > 0 ? 'sm:border-l' : ''}`}
                  >
                    <fact.icon className="w-4 h-4 text-primary-600 mb-2" aria-hidden="true" />
                    <dd className="font-display text-sm font-semibold text-ink">{fact.label}</dd>
                    <dt className="font-mono text-xs text-ink/50 uppercase tracking-wider mt-0.5">{fact.sublabel}</dt>
                  </div>
                ))}
              </dl>

              {/* Prodejný turnus dostane tlačítko na registraci, chystaný rovnou formulář zájmu */}
              {prodejny ? (
                // `prodejny` je stejná podmínka (`isBookable`), ze které `turnusLabels`
                // odvozuje `ctaHref` — v téhle větvi je vždycky vyplněné.
                <Link href={l.ctaHref!} className="btn-primary group px-8 py-4 inline-flex items-center">
                  {l.ctaText}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              ) : (
                <TurnusInterestForm turnus={turnus} source={`turnus-${turnus.slug}`} />
              )}
            </div>
          </div>
        </section>

        {/* Zaměření turnusu */}
        {zamereni.length > 0 && (
          <section className="section-padding bg-paper">
            <div className="section-container">
              <div className="max-w-3xl mx-auto mb-12 text-center">
                <p className="mono-label mb-4">Zaměření turnusu</p>
                <h2 className="heading-2 text-ink">
                  Co si dítě <span className="text-primary-600">vyzkouší</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {zamereni.map((z) => {
                  const visual = focusVisual[z.id]
                  const colors = colorMap[visual.color]
                  return (
                    <div key={z.id} className="card-maker p-6">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                        <visual.icon className={`w-6 h-6 ${colors.icon}`} aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-bold text-ink mb-2">{z.name}</h3>
                      <p className="text-ink-500 text-sm mb-4">{z.short}</p>
                      <ul className="space-y-2">
                        {z.tryOut.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-ink-500">
                            <Check className={`w-4 h-4 ${colors.check} flex-shrink-0 mt-0.5`} aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Místo konání — jen když ho turnus má */}
        {venue && <VenueShowcase venue={venue} />}

        {/* Další termíny — vynechá se, když žádné jiné nejsou */}
        {dalsiTurnusy.length > 0 && (
          <section className="section-padding bg-paper-soft border-t border-ink/15">
            <div className="section-container">
              <h2 className="heading-2 text-ink mb-10 text-center">Další termíny</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
