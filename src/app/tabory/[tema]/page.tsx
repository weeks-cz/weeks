import type { Metadata } from 'next'
import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight, Box, Check, Clock, Cpu, Headset, MapPin, Printer, Sparkles,
  Users, Utensils,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import { FAQSection } from '@/components/sections/FAQSection'
import { ProjectGallery } from '@/components/turnusy/ProjectGallery'
import { TurnusList } from '@/components/turnusy/TurnusList'
import { TurnusInterestForm } from '@/components/turnusy/TurnusInterestForm'
import { VenueShowcase } from '@/components/turnusy/VenueShowcase'
import { getVenue, type VenueId } from '@/lib/cities'
import { getFocusModules } from '@/lib/focus'
import { SITE, getSiteFaq } from '@/lib/site'
import {
  DENNI_HARMONOGRAM, getAktivniTabory, getTabor, getTabory, zkusiSiTabora,
  type IkonaDne, type Tabor,
} from '@/lib/tabory'
import { getTurnusyByTabor, isBookable } from '@/lib/turnusy'

/**
 * Stránka tématu — jediné místo, kde žije popis tábora.
 *
 * Stránky termínů popis schválně neopakují: při čtyřech tématech, dvou městech
 * a několika termínech by web měl sadu skoro shodných stránek a vyhledávač by
 * si z nich vybral jednu sám.
 *
 * Serverová komponenta bez animací — stejně jako stránka termínu. Nosný text
 * se tak nemůže schovat pod nespuštěnou animaci a stránka nepotřebuje k tomu,
 * aby se dala přečíst, ani kilobajt JavaScriptu.
 */

/** Ikona dne podle klíče z dat. Mapa žije tady, aby `tabory.ts` zůstal bez Reactu. */
const IKONY: Record<IkonaDne, LucideIcon> = {
  tisk: Printer,
  model: Box,
  iot: Cpu,
  vr: Headset,
  projekt: Sparkles,
}

/**
 * Fotky z tábora k jednotlivým zaměřením.
 *
 * Stojí jako pás pod mřížkou modulů, ne uvnitř karty: fotku má zatím jen jedno
 * zaměření ze tří a karta s obrázkem vedle dvou bez něj mřížku rozhodí.
 */
const FOTKY_ZAMERENI: Record<string, { src: string; alt: string; popisek: string }> = {
  iot: {
    src: '/images/tabor/iot-led-palec.webp',
    alt: 'Chlapec u stolu ukazuje palec nahoru, před ním nepájivé pole s rozsvícenými LED diodami a Arduino',
    popisek:
      'První obvod, který se rozsvítí, je na táboře malý obřad. Od téhle chvíle dítě ví, že tomu rozumí.',
  },
}

export function generateStaticParams() {
  return getTabory().map((tabor) => ({ tema: tabor.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tema: string }>
}): Promise<Metadata> {
  const { tema } = await params
  const tabor = getTabor(tema)
  if (!tabor) return {}

  const title = `${tabor.name} | Weeks`
  const url = `${SITE.url}/tabory/${tabor.id}`

  return {
    title: { absolute: title },
    description: tabor.perex,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: tabor.perex,
      url,
      siteName: SITE.name,
      type: 'website',
      locale: 'cs_CZ',
      images: [{ url: `${SITE.url}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: tabor.perex,
      images: [`${SITE.url}/opengraph-image`],
    },
  }
}

function Drobecky({ tabor }: { tabor: Tabor }) {
  return (
    <nav aria-label="Drobečková navigace" className="mb-8 font-mono text-xs uppercase tracking-[0.2em]">
      <Link href="/" className="text-ink/50 transition-colors hover:text-primary-600">
        Domů
      </Link>
      <span className="mx-2 text-ink/30">/</span>
      <Link href="/tabory" className="text-ink/50 transition-colors hover:text-primary-600">
        Tábory
      </Link>
      <span className="mx-2 text-ink/30">/</span>
      <span className="font-medium text-ink">{tabor.shortName}</span>
    </nav>
  )
}

/** Tábor, který se teprve chystá: záměr, sběr kontaktu a odkaz na běžící tábor. */
function ChystanyTabor({ tabor }: { tabor: Tabor }) {
  const bezici = getAktivniTabory()

  return (
    <main>
      <section className="relative overflow-hidden border-b border-ink/15 bg-paper blueprint-grid pb-16 pt-32">
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <Drobecky tabor={tabor} />

            <p className="mono-label mb-6 inline-block rounded-sm border border-ink bg-cta-300 px-2.5 py-1 text-ink">
              Chystáme
            </p>

            <h1 className="heading-1 mb-6 text-ink">{tabor.name}</h1>

            <p className="max-w-2xl text-lg leading-relaxed text-ink-500 md:text-xl">{tabor.popis}</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-paper">
        <div className="section-container">
          <div className="max-w-3xl">
            <p className="mono-label mb-4">Záměr</p>
            <h2 className="heading-2 mb-8 text-ink">
              Co si dítě <span className="text-accent-600">zkusí</span>
            </h2>

            <ul className="space-y-4">
              {zkusiSiTabora(tabor).map((bod) => (
                <li key={bod} className="flex gap-3 border-b border-ink/15 pb-4 text-lg text-ink-500">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-accent-600" aria-hidden="true" />
                  {bod}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-ink-500">
              Program, termín ani cenu zatím nemáme potvrzené — jakmile budou,
              najdete je tady jako první.
            </p>
          </div>
        </div>
      </section>

      {/* Sběr kontaktu je u chystaného tábora hlavní obsah, proto dostává tmavý
          blok — zároveň je to kotva stránky, která jinak žádnou nemá. */}
      <section className="section-padding border-y border-ink bg-ink blueprint-grid-dark">
        <div className="section-container">
          <div className="max-w-3xl">
            <TurnusInterestForm source={`tabor-${tabor.id}`} />
          </div>
        </div>
      </section>

      {bezici.length > 0 && (
        <section className="section-padding bg-paper-soft">
          <div className="section-container">
            <div className="max-w-3xl">
              <p className="mono-label mb-4">Zatím běží</p>
              <h2 className="heading-2 mb-6 text-ink">Tábor, na který se přihlásit jde</h2>
              <div className="flex flex-wrap gap-4">
                {bezici.map((b) => (
                  <Link key={b.id} href={`/tabory/${b.id}`} className="btn-outline group">
                    {b.name}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

/** Běžící tábor: celý popis, program, termíny. */
function AktivniTabor({ tabor }: { tabor: Tabor }) {
  const turnusy = getTurnusyByTabor(tabor.id)
  const prodejny = turnusy.some(isBookable)
  const zamereni = getFocusModules(tabor.focus)

  const venueIds = Array.from(
    new Set(turnusy.map((t) => t.venueId).filter((id): id is VenueId => id !== null))
  )

  const galerie = zamereni.flatMap((z) => (z.gallery ?? []).map((img) => ({ ...img, tag: z.name })))

  const fotky = zamereni.map((z) => FOTKY_ZAMERENI[z.id]).filter((f) => f !== undefined)

  // Obecné otázky rodičů plus ty, které se týkají zrovna tohohle zaměření.
  const faq = [
    ...getSiteFaq(),
    ...zamereni.flatMap((z) => z.faq ?? []),
    ...(tabor.faq ?? []),
  ].filter((otazka, i, vse) => vse.findIndex((o) => o.question === otazka.question) === i)

  const kapacita = turnusy.reduce((max, t) => Math.max(max, t.capacity), 0)
  const vek = turnusy[0]?.ageRange.replace('-', '–') ?? '9–15'

  const fakty = [
    { icon: Clock, label: '8:00–17:00', sublabel: 'Po – Pá' },
    { icon: Users, label: `${vek} let`, sublabel: 'věk dětí' },
    { icon: Users, label: `Max ${kapacita}`, sublabel: 'dětí v turnusu' },
    { icon: Utensils, label: 'Oběd', sublabel: 'v ceně' },
  ]

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/15 bg-paper blueprint-grid pb-20 pt-32">
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <Drobecky tabor={tabor} />

            <p className="mono-label mb-6 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-600" aria-hidden="true" />
              Pondělí – Pátek · 8:00 – 17:00
            </p>

            <h1 className="heading-1 mb-6 text-ink">{tabor.name}</h1>

            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-ink-500 md:text-xl">
              {tabor.popis}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#turnusy" className="btn-primary group px-8 py-4">
                {prodejny ? 'Přihlásit dítě' : 'Chci vědět o termínech'}
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
              <a href="#program" className="btn-outline px-8 py-4">
                Co děti čeká
              </a>
            </div>

            {/* Technický štítek tábora. V `<dl>` stojí `<dt>` ve zdroji před
                svým `<dd>`; vizuálně patří pod hodnotu, což řeší `order-last`. */}
            <dl className="mt-12 grid grid-cols-2 overflow-hidden rounded-md border border-ink bg-white sm:grid-cols-4">
              {fakty.map((fakt, i) => (
                <div
                  key={fakt.sublabel}
                  className={`flex flex-col border-ink/15 p-4 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${i > 0 ? 'sm:border-l' : ''}`}
                >
                  <fakt.icon className="mb-2 h-4 w-4 text-accent-600" aria-hidden="true" />
                  <dt className="order-last mt-0.5 font-mono text-xs uppercase tracking-wider text-ink/50">
                    {fakt.sublabel}
                  </dt>
                  <dd className="font-display text-sm font-semibold text-ink">{fakt.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Zaměření — co se na táboře dělá */}
      <section id="program" className="section-padding scroll-mt-24 bg-paper">
        <div className="section-container">
          <div className="mb-12 max-w-3xl">
            <p className="mono-label mb-4">Program</p>
            <h2 className="heading-2 mb-4 text-ink">
              Co si dítě <span className="text-accent-600">zkusí</span>
            </h2>
            <p className="text-lg text-ink-500">
              Týden stojí na {zamereni.length} tématech. Každé má svůj den a všechna
              končí něčím, co dítě samo postavilo.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {zamereni.map((z) => (
              <article key={z.id} className="card-maker flex flex-col overflow-hidden">
                <div className="h-1.5 bg-accent-400" aria-hidden="true" />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-3 font-display text-xl font-semibold text-ink">{z.name}</h3>
                  <p className="mb-5 text-ink-500">{z.short}</p>
                  <ul className="space-y-2">
                    {z.tryOut.map((bod) => (
                      <li key={bod} className="flex gap-2 text-sm text-ink-500">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
                        {bod}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Fotka je na výšku a jde přes ni vidět celý obvod — výřez na šířku
              by uřízl právě to, o čem mluví popisek. Proto se nekrope a text
              stojí vedle ní. */}
          {fotky.map((fotka) => (
            <figure
              key={fotka.src}
              className="mt-16 grid items-center gap-8 border-t border-ink/15 pt-12 md:grid-cols-2"
            >
              <Image
                src={fotka.src}
                alt={fotka.alt}
                width={1500}
                height={2000}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 45vw"
                className="mx-auto h-auto max-h-[520px] w-auto rounded-md border border-ink/15"
              />
              <figcaption className="max-w-md">
                <p className="mono-label mb-4">Z tábora</p>
                <p className="font-display text-2xl font-semibold leading-snug text-ink">
                  {fotka.popisek}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Týdenní přehled */}
      {tabor.program && (
        <section
          id="harmonogram"
          className="section-padding scroll-mt-24 border-y border-ink/15 bg-paper-soft"
        >
          <div className="section-container">
            <div className="mb-12 max-w-3xl">
              <p className="mono-label mb-4">Týden po dnech</p>
              <h2 className="heading-2 mb-4 text-ink">
                Co se děje <span className="text-accent-600">který den</span>
              </h2>
              <p className="text-lg text-ink-500">
                Projekty na sebe navazují — to, co dítě začne v pondělí, si v pátek
                odnese domů.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {tabor.program.map((den) => {
                const Ikona = IKONY[den.ikona]
                return (
                  <article key={den.den} className="card-maker flex flex-col overflow-hidden">
                    <div className="border-b border-ink/15 bg-ink p-4">
                      <p className="mb-1 font-mono text-xs uppercase tracking-wider text-paper/60">
                        {den.den}
                      </p>
                      <div className="flex items-center gap-2">
                        <Ikona className="h-5 w-5 text-accent-400" aria-hidden="true" />
                        <h3 className="font-display text-sm font-bold text-paper">{den.title}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="mb-3 text-xs text-ink-500">{den.description}</p>
                      <ul className="space-y-1.5">
                        {den.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-1.5 text-xs text-ink-500">
                            <Check className="h-3.5 w-3.5 shrink-0 text-accent-600" aria-hidden="true" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Typický den */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="mb-12 max-w-3xl">
            <p className="mono-label mb-4">Rozvrh dne</p>
            <h2 className="heading-2 mb-4 text-ink">
              Typický <span className="text-accent-600">den tábora</span>
            </h2>
            <p className="text-lg text-ink-500">
              Střídáme tvoření, přestávky a pohyb venku. Rozvrh je stejný pro všechny
              naše tábory.
            </p>
          </div>

          <ol className="mx-auto max-w-2xl overflow-hidden rounded-md border border-ink">
            {DENNI_HARMONOGRAM.map((item, i) => (
              <li
                key={item.time}
                className={`flex gap-4 p-4 ${i < DENNI_HARMONOGRAM.length - 1 ? 'border-b border-ink/15' : ''}`}
              >
                <span className="w-14 shrink-0 font-mono text-sm font-semibold text-accent-600">
                  {item.time}
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{item.title}</p>
                  {item.description && <p className="mt-0.5 text-xs text-ink-500">{item.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Místa konání — jedno za každé odlišné místo, které turnusy tématu mají */}
      {venueIds.map((id) => (
        <VenueShowcase key={id} venue={getVenue(id)} />
      ))}

      {/* Praktické informace */}
      <section className="section-padding border-y border-ink/15 bg-paper-soft">
        <div className="section-container">
          <div className="mb-12 max-w-3xl">
            <p className="mono-label mb-4">Než se přihlásíte</p>
            <h2 className="heading-2 text-ink">Praktické informace</h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            {[
              {
                icon: Utensils,
                title: 'Stravování',
                text: 'Oběd každý den v ceně. Na dopoledne a odpoledne si děti přinesou vlastní svačinu. Pitný režim zajištěn po celý den.',
              },
              {
                icon: Printer,
                title: 'Vybavení',
                text: 'Vybavení, které program vyžaduje, je připravené na místě konání. Děti nenosí nic technického.',
              },
              {
                icon: Users,
                title: 'Kapacita',
                text: `Nejvýše ${kapacita} dětí na turnus. Jeden lektor na pět dětí — na každé dítě zbude čas.`,
              },
              {
                icon: MapPin,
                title: 'Místo',
                text: 'Přesnou adresu najdete u konkrétního termínu — místo se liší podle města.',
              },
            ].map((info) => (
              <div key={info.title} className="card-maker flex gap-4 p-6">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-accent-50"
                  aria-hidden="true"
                >
                  <info.icon className="h-5 w-5 text-accent-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-display font-semibold text-ink">{info.title}</h3>
                  <p className="text-sm text-ink-500">{info.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectGallery polozky={galerie} />

      {/* Termíny */}
      <section
        id="turnusy"
        className="section-padding scroll-mt-24 border-y border-ink bg-ink text-paper blueprint-grid-dark"
      >
        <div className="section-container">
          <div className="mb-12 max-w-3xl">
            <p className="mono-label-dark mb-4 text-accent-300">Termíny</p>
            <h2 className="heading-2 mb-4 text-paper">
              Kdy a kde <span className="text-accent-400">tábor běží</span>
            </h2>
            <p className="text-lg text-paper/70">
              {prodejny
                ? 'Cenu, obsazenost i přesné datum najdete u vybraného termínu.'
                : 'Termíny na příští léto vypisujeme na podzim. Nechte nám kontakt — ozveme se vám mezi prvními.'}
            </p>
          </div>

          {/* `TurnusList` sem patří i kvůli živé kapacitě: sama si dotáhne
              obsazenost z /api/term-capacity, takže karta neslibuje místo,
              které je mezitím pryč. Filtr měst si zapne sama, až bude téma
              běžet ve víc městech. */}
          <TurnusList turnusy={turnusy} />

          <div className="mt-16">
            <TurnusInterestForm source={`tabor-${tabor.id}`} />
          </div>
        </div>
      </section>

      <FAQSection polozky={faq} />

      {/* Závěrečné CTA */}
      <section className="section-padding relative overflow-hidden border-y border-ink bg-cta-400">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-10 select-none font-display text-[22rem] font-bold leading-none text-ink/[0.06]"
        >
          W
        </div>
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <h2 className="heading-2 mb-5 text-ink">
              {prodejny
                ? `Na jeden turnus bereme nejvýš ${kapacita} dětí`
                : 'Chcete vědět o termínech mezi prvními?'}
            </h2>
            <p className="mb-8 text-lg text-ink/80">
              {prodejny
                ? 'Malá skupina je důvod, proč se dětem na táboře daří — a taky důvod, proč se místa plní.'
                : 'Nechte nám kontakt a ozveme se vám dřív, než se termíny objeví na webu.'}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#turnusy" className="btn-secondary group">
                {prodejny ? 'Přihlásit dítě' : 'Nechat kontakt'}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
              <Link href="/kontakt" className="btn-outline">
                Máte dotazy?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default async function TaborTemaPage({ params }: { params: Promise<{ tema: string }> }) {
  const { tema } = await params
  const tabor = getTabor(tema)
  if (!tabor) notFound()

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Domů', url: SITE.url },
          { name: 'Tábory', url: `${SITE.url}/tabory` },
          { name: tabor.shortName, url: `${SITE.url}/tabory/${tabor.id}` },
        ]}
      />
      <Header />
      {tabor.status === 'aktivni' ? (
        <AktivniTabor tabor={tabor} />
      ) : (
        <ChystanyTabor tabor={tabor} />
      )}
      <Footer />
    </>
  )
}
