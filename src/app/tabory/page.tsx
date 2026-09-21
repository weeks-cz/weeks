'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Calendar, Clock, Gauge, MapPin, Users, Utensils } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import { TaborCard } from '@/components/tabory/TaborCard'
import { TurnusInterestForm } from '@/components/turnusy/TurnusInterestForm'
import { filtrMest, platneMesto } from '@/components/turnusy/TurnusList'
import { getCity, getVenue, type CityId, type VenueId } from '@/lib/cities'
import { SITE } from '@/lib/site'
import { getAktivniTabory, getChystaneTabory } from '@/lib/tabory'
import { getCitiesWithTurnusy, getTurnusy, getTurnusyByCity } from '@/lib/turnusy'

/**
 * Výpis táborů — rozcestí, které vede rodiče v pořadí město → téma → termín.
 *
 * Tohle pořadí není kosmetika: rodič nejdřív ví, kam dítě dokáže dovézt, pak
 * ho zajímá téma a teprve nakonec termín. Seznam je proto seskupený podle
 * města, uvnitř města stojí karta tématu a teprve v ní jsou termíny.
 *
 * Stránka je klientská kvůli `?mesto=` (`useSearchParams`) — stejně jako dřív
 * `/tabor`. Díky tomu zůstává staticky předgenerovaná a filtr běží v prohlížeči,
 * místo aby se stránka kvůli jednomu parametru vykreslovala na každý požadavek.
 */

/** Společné pro všechny tábory. Kapacitu a věk bere z dat, ne z paměti. */
function spolecneFakty() {
  const turnusy = getTurnusy()
  const kapacita = turnusy.reduce((max, t) => Math.max(max, t.capacity), 0)
  const vek = turnusy[0]?.ageRange.replace('-', '–') ?? '9–15'
  return [
    { icon: Calendar, label: '5 dní', sublabel: 'Po – Pá' },
    { icon: Clock, label: '8:00–17:00', sublabel: 'každý den' },
    { icon: Users, label: `${vek} let`, sublabel: 'věk dětí' },
    { icon: Gauge, label: `Max ${kapacita}`, sublabel: 'dětí v turnusu' },
    { icon: Utensils, label: 'Oběd', sublabel: 'v ceně' },
  ]
}

function MestoSekce({ city, index }: { city: CityId; index: number }) {
  const mesto = getCity(city)
  const turnusyMesta = getTurnusyByCity(city)
  const tabory = getAktivniTabory().filter((tabor) =>
    turnusyMesta.some((t) => t.taborIds.includes(tabor.id))
  )

  // Místa konání — jen ta, která turnus v tomhle městě doopravdy má. Karta
  // se sem přestěhovala z rušené sekce „Kde a s kým“ na úvodce: „kde to je“
  // dává smysl vedle města, ke kterému patří.
  const venues = Array.from(
    new Set(turnusyMesta.map((t) => t.venueId).filter((id): id is VenueId => id !== null))
  ).map((id) => getVenue(id))

  return (
    <div className={index > 0 ? 'mt-16 border-t border-ink/15 pt-16' : ''}>
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="heading-2 text-ink">{mesto.name}</h2>
        <p className="mono-label">{mesto.region}</p>
      </div>

      {/* Téma a místo stojí v jedné mřížce vedle sebe: „co se tam dělá“ a „kde
          to je“ jsou dvě poloviny téže odpovědi. Když místo ještě není
          domluvené, řekne to karta rovnou — prázdné místo v mřížce by nechalo
          rodiče hádat. */}
      <div className="grid gap-6 md:grid-cols-2">
        {tabory.map((tabor, i) => (
          <TaborCard
            key={tabor.id}
            tabor={tabor}
            index={i}
            turnusy={turnusyMesta.filter((t) => t.taborIds.includes(tabor.id))}
          />
        ))}

        {venues.map((venue) => (
          <div key={venue.id} className="card-maker flex gap-4 p-7">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-ink/15 bg-white"
              aria-hidden="true"
            >
              <MapPin className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <p className="mono-label mb-2">Místo konání</p>
              <h3 className="mb-1 font-display text-lg font-semibold text-ink">{venue.name}</h3>
              <p className="mb-3 text-ink-500">{venue.description}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${venue.mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.15em] text-primary-600 hover:underline"
              >
                Zobrazit v mapě
              </a>
            </div>
          </div>
        ))}

        {venues.length === 0 && (
          <div className="flex gap-4 rounded-md border border-dashed border-ink/25 bg-paper-soft p-7">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-dashed border-ink/25"
              aria-hidden="true"
            >
              <MapPin className="h-6 w-6 text-ink/40" />
            </div>
            <div>
              <p className="mono-label mb-2">Místo konání</p>
              <h3 className="mb-1 font-display text-lg font-semibold text-ink">Upřesníme</h3>
              <p className="text-ink-500">
                Prostor pro {mesto.name} ještě domlouváme. Jakmile bude jistý,
                najdete ho tady i u konkrétního termínu.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function VypisMest() {
  const searchParams = useSearchParams()
  const turnusy = getTurnusy()
  const mesta = filtrMest(turnusy)
  const vybrane = platneMesto(searchParams.get('mesto'), mesta)
  const zobrazena = vybrane ? [vybrane] : getCitiesWithTurnusy()

  return (
    <>
      {mesta.length > 0 && (
        <nav className="mb-12 flex flex-wrap gap-2" aria-label="Filtr podle města">
          <Link
            href="/tabory"
            scroll={false}
            aria-current={vybrane === undefined ? 'true' : undefined}
            className={`border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
              vybrane === undefined
                ? 'border-ink bg-ink text-paper'
                : 'border-ink/25 text-ink-500 hover:border-ink hover:text-ink'
            }`}
          >
            Všechna města
          </Link>
          {mesta.map((m) => (
            <Link
              key={m.id}
              href={`/tabory?mesto=${m.id}`}
              scroll={false}
              aria-current={vybrane === m.id ? 'true' : undefined}
              className={`border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                vybrane === m.id
                  ? 'border-ink bg-ink text-paper'
                  : 'border-ink/25 text-ink-500 hover:border-ink hover:text-ink'
              }`}
            >
              {m.name} ({m.pocet})
            </Link>
          ))}
        </nav>
      )}

      {zobrazena.map((city, i) => (
        <MestoSekce key={city} city={city} index={i} />
      ))}
    </>
  )
}

export default function TaboryPage() {
  const reduced = useReducedMotion()
  const chystane = getChystaneTabory()
  const fakty = spolecneFakty()

  // Nosný text animuje jen posun, ne viditelnost: kdyby se animace nespustila
  // (zamrzlá záložka, chyba JS, pomalá hydratace), zůstal by nadpis prázdný.
  const anim = (delay = 0) =>
    reduced ? {} : { initial: { y: 16 }, animate: { y: 0 }, transition: { duration: 0.4, delay } }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Domů', url: SITE.url },
          { name: 'Tábory', url: `${SITE.url}/tabory` },
        ]}
      />
      <Header />
      <main>
        {/* Hero — tmavá kotva stránky */}
        <section className="relative overflow-hidden bg-ink blueprint-grid-dark pb-20 pt-32 lg:pb-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 select-none font-display text-[26rem] font-bold leading-none text-paper/[0.04]"
          >
            W
          </div>

          <div className="section-container relative z-10">
            <nav aria-label="Drobečková navigace" className="mb-8 font-mono text-xs uppercase tracking-[0.2em]">
              <Link href="/" className="text-paper/50 transition-colors hover:text-accent-300">
                Domů
              </Link>
              <span className="mx-2 text-paper/30">/</span>
              <span className="font-medium text-paper">Tábory</span>
            </nav>

            <motion.h1 {...anim()} className="heading-1 mb-6 max-w-3xl text-paper">
              Letní příměstské tábory,
              <br />
              kde děti <span className="text-accent-400">něco postaví</span>
            </motion.h1>

            <motion.p {...anim(0.05)} className="mb-8 max-w-2xl text-lg leading-relaxed text-paper/70">
              Týden od pondělí do pátku, malá skupina a hotová věc, kterou si dítě
              odveze domů. Vyberte si město a téma — u každého tématu najdete jeho
              termíny.
            </motion.p>

            <motion.div {...anim(0.1)}>
              <a href="#mesta" className="btn-primary group">
                Vybrat tábor
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Společné fakty — amber pruh v roli „stav“, zároveň předěl pod herem */}
        <section className="border-y border-ink bg-cta-400" aria-label="Co mají všechny tábory společné">
          <div className="section-container">
            <dl className="grid grid-cols-2 divide-ink/20 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
              {fakty.map((fakt, i) => (
                // V `<dl>` musí `<dt>` (název údaje) stát ve zdroji před svým
                // `<dd>`. Vizuálně patří pod hodnotu, což řeší `order-last`.
                <div
                  key={fakt.sublabel}
                  className={`flex flex-col px-4 py-5 ${i > 0 ? 'border-ink/20 max-lg:border-l-0' : ''}`}
                >
                  <fakt.icon className="mb-2 h-4 w-4 text-ink/70" aria-hidden="true" />
                  <dt className="order-last mt-0.5 font-mono text-xs uppercase tracking-wider text-ink/60">
                    {fakt.sublabel}
                  </dt>
                  <dd className="font-display text-sm font-semibold text-ink">{fakt.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Města a jejich témata */}
        <section id="mesta" className="section-padding scroll-mt-24 bg-paper">
          <div className="section-container">
            <div className="mb-12 max-w-3xl">
              <p className="mono-label mb-4">Kde tábory běží</p>
              <h2 className="sr-only">Tábory podle měst</h2>
              <p className="text-lg text-ink-500">
                Město je vlastnost termínu, ne samostatná větev webu. Vyberte si
                svoje a uvidíte jen to, co je dostupné u vás.
              </p>
            </div>

            <Suspense
              fallback={
                <p className="text-ink-500" role="status">
                  Načítáme nabídku…
                </p>
              }
            >
              <VypisMest />
            </Suspense>
          </div>
        </section>

        {/* Chystaná témata */}
        {chystane.length > 0 && (
          <section className="section-padding border-y border-ink/15 bg-paper-soft">
            <div className="section-container">
              <div className="mb-12 max-w-3xl">
                <p className="mono-label mb-4">Co chystáme</p>
                <h2 className="heading-2 mb-4 text-ink">
                  Další <span className="text-accent-600">témata</span>
                </h2>
                <p className="text-lg text-ink-500">
                  Tyhle tábory teprve stavíme — zatím nemají termín ani cenu. Když
                  nám necháte kontakt, ozveme se vám, jakmile budou.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {chystane.map((tabor, i) => (
                  <TaborCard key={tabor.id} tabor={tabor} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sběr kontaktů */}
        <section className="section-padding relative overflow-hidden border-y border-ink bg-cta-400">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-10 select-none font-display text-[22rem] font-bold leading-none text-ink/[0.06]"
          >
            W
          </div>
          <div className="section-container relative z-10 max-w-3xl">
            <TurnusInterestForm source="tabory" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
