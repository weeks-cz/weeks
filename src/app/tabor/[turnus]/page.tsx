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
import { ProjectGallery } from '@/components/turnusy/ProjectGallery'
import { EventSchema, BreadcrumbSchema } from '@/components/seo/StructuredData'

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
          url: `${SITE.url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    // Twitter ze stejného důvodu potřebuje vlastní blok, ne jen dědit z kořene —
    // viz komentář u `openGraph` výš i `src/app/tabor/layout.tsx`.
    twitter: {
      card: 'summary_large_image',
      title,
      description: turnus.perex,
      images: [`${SITE.url}/opengraph-image`],
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
  // Otázky ze všech modulů zaměření, které tenhle turnus má — po skupinách,
  // ne v jednom seznamu. Moduly kladou doslova stejnou otázku („Co si děti
  // odnesou domů?") s různou odpovědí, a bez názvu modulu nad skupinou nemá
  // čtenář jak poznat, která odpověď patří k čemu. Modul bez `faq`
  // (vr, herni-vyvoj) nepřidá skupinu žádnou.
  const faqSkupiny = zamereni
    .map((z) => ({ id: z.id, name: z.name, otazky: z.faq ?? [] }))
    .filter((skupina) => skupina.otazky.length > 0)
  // Fotky projektů ze stejných modulů, štítek u obrázku je název modulu.
  const galerie = zamereni.flatMap((z) =>
    (z.gallery ?? []).map((img) => ({ ...img, tag: z.name }))
  )

  return (
    <>
      <Header />
      {/* Poslední položka drobečků musí textem odpovídat tomu, co stránka
          níž doopravdy ukazuje ({l.mesto} — {l.datum}), ne jen datu — jinak
          strukturovaná data tvrdí něco jiného, než je vidět. */}
      <EventSchema turnusy={[turnus]} />
      <BreadcrumbSchema
        items={[
          { name: 'Domů', url: SITE.url },
          // Stejný název, jakým se `/tabor` označuje sama (viditelný drobeček
          // i schema tam): jedna adresa nesmí mít v drobečkách dva názvy.
          { name: 'Letní příměstský tábor', url: `${SITE.url}/tabor` },
          { name: `${l.mesto} — ${l.datum}`, url: `${SITE.url}/tabor/${turnus.slug}` },
        ]}
      />
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
                  Letní příměstský tábor
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
                  // V `<dl>` musí `<dt>` (název údaje, tady drobný popisek)
                  // stát v kódu před svým `<dd>`. Vizuálně patří pod hodnotu,
                  // což řeší `flex flex-col` + `order-last` na `<dt>` — pořadí
                  // na obrazovce se tím nemění, jen pořadí ve zdroji.
                  <div
                    key={fact.sublabel}
                    className={`flex flex-col p-4 border-ink/15 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${i > 0 ? 'sm:border-l' : ''}`}
                  >
                    <fact.icon className="w-4 h-4 text-primary-600 mb-2" aria-hidden="true" />
                    <dt className="order-last font-mono text-xs text-ink/50 uppercase tracking-wider mt-0.5">{fact.sublabel}</dt>
                    <dd className="font-display text-sm font-semibold text-ink">{fact.label}</dd>
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

                      {/* Vybavení — jen přenosný hardware (IoT). Modely tiskáren
                          (`focus.printers`) se schválně nevykreslují: je to inventář
                          prostoru, který pro 2027 není domluvený, viz komentář
                          u těch dat v `src/lib/focus.ts`. */}
                      {z.hardware && z.hardware.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-ink/15">
                          <p className="mono-label mb-2">Hardware</p>
                          <div className="flex flex-wrap gap-1.5">
                            {z.hardware.map((item) => (
                              <span
                                key={item}
                                className="font-mono text-xs px-2 py-0.5 rounded-sm border border-ink/20 bg-white text-ink/60"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* FAQ k zaměření — otázky, které nesou moduly tohohle turnusu; prostý
            seznam, ne akordeon (ten je vyhrazený pro `FAQSection`/`getSiteFaq()`) */}
        {faqSkupiny.length > 0 && (
          <section className="section-padding bg-paper-soft border-y border-ink/15">
            <div className="section-container">
              <div className="max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                  <p className="mono-label mb-4">FAQ</p>
                  <h2 className="heading-2 text-ink">
                    Časté dotazy <span className="text-primary-600">k zaměření</span>
                  </h2>
                </div>
                {/* Popisek skupiny se vykreslí i u jediného modulu — zobrazení,
                    které se mění podle počtu skupin, je horší než jeden nadpis
                    navíc. */}
                <div className="space-y-10">
                  {faqSkupiny.map((skupina) => (
                    <div key={skupina.id}>
                      <p className="mono-label mb-4">{skupina.name}</p>
                      <div className="space-y-4">
                        {skupina.otazky.map((item) => (
                          <div key={item.question} className="card-maker p-6">
                            <h3 className="font-display font-semibold text-ink mb-2">{item.question}</h3>
                            <p className="text-ink-500 text-sm leading-relaxed">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Co si dítě odnese — galerie projektů ze zaměření tohohle turnusu */}
        {galerie.length > 0 && <ProjectGallery polozky={galerie} />}

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
