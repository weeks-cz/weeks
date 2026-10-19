import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Check, Mail, MessageCircleQuestion, Minus, Phone, ShieldCheck, Star,
} from 'lucide-react'
import { GoogleRecenze } from '@/components/sections/GoogleRecenze'
import { getCity, getVenue } from '@/lib/cities'
import { GOOGLE_PROFIL, RECENZE, maRecenze } from '@/lib/recenze'
import { MIMO_CENU, PROVOZNI_DOBA, SITE, V_CENE } from '@/lib/site'
import { zkusiSiTabora } from '@/lib/tabory'
import { getTaboryTurnusu, getTurnusy, getTurnusyByTabor, isBookable, type Turnus } from '@/lib/turnusy'
import { NakupniBox, type VariantaTerminu } from './NakupniBox'
import { NakupniLista } from './NakupniLista'
import { TerminGalerie, type FotkaGalerie } from './TerminGalerie'
import { TurnusCard } from './TurnusCard'
import { TurnusInterestForm } from './TurnusInterestForm'
import { VenueShowcase } from './VenueShowcase'
import { ZaverecneTlacitko } from './ZaverecneTlacitko'
import { cenaZaDen, datumCesky, datumKratce, turnusLabels } from './turnus-labels'

/**
 * Stránka termínu jako detail produktu.
 *
 * Termín je to, co se na webu prodává, takže stránka přebírá logiku detailu
 * produktu z e-shopu (pravidla DP-001 až DP-019 skillu `shoptet-ux`): fotka,
 * název, datum, cena, stav míst, hodnocení, přepínač termínů a jedno tlačítko
 * nahoře; důvěra (záruka, co je v ceně, kontakt na člověka) hned u tlačítka;
 * lepicí lišta, když tlačítko odjede.
 *
 * Popis tábora se sem pořád NEOPISUJE — žije na stránce tématu. Sekce „Co děti
 * čeká" je strukturovaný výtah (body ze zaměření a pět řádků týdne), ne kopie
 * odstavců, takže vedle sebe nestojí dvě skoro shodné stránky.
 */

/** Skutečné fotky z táborů Weeks. Místo konání přidá svoje fotky zvlášť. */
const FOTKY_Z_TABORA: FotkaGalerie[] = [
  {
    src: '/images/hwlab/hero-print-day.webp',
    alt: 'Děti a lektoři v dílně u 3D tiskáren, na plátně promítnuté logo Weeks',
  },
  { src: '/images/tabor/vytisk-v-ruce.webp', alt: 'Vlastní návrh, vytištěný na táboře' },
  { src: '/images/tabor/slicer-model.webp', alt: 'Děti u monitoru s modelem připraveným k tisku v PrusaSliceru' },
  { src: '/images/tabor/microbit-editor.webp', alt: 'Chlapec skládá program pro micro:bit z barevných bloků' },
  {
    src: '/images/tabor/iot-led-palec.webp',
    alt: 'Chlapec u stolu ukazuje palec nahoru, před ním nepájivé pole s rozsvícenými LED diodami a Arduino',
  },
]

const ZKRATKY_DNU: Record<string, string> = {
  Pondělí: 'Po',
  Úterý: 'Út',
  Středa: 'St',
  Čtvrtek: 'Čt',
  Pátek: 'Pá',
}

export function TerminDetail({ turnus }: { turnus: Turnus }) {
  const l = turnusLabels(turnus)
  const tabor = getTaboryTurnusu(turnus)[0]
  const venue = turnus.venueId ? getVenue(turnus.venueId) : null
  const prodejny = isBookable(turnus)

  // Přepínač termínů: stejné téma, stejné město. Jiná města jen jako odkazy.
  const tematickeTurnusy = tabor ? getTurnusyByTabor(tabor.id) : [turnus]
  const kratce = (t: Turnus) => (t.start && t.end ? datumKratce(t.start, t.end) : 'termín upřesníme')
  const varianty: VariantaTerminu[] = tematickeTurnusy
    .filter((t) => t.city === turnus.city)
    .map((t) => ({ id: t.id, slug: t.slug, label: kratce(t), aktualni: t.id === turnus.id }))
  const jinde: VariantaTerminu[] = tematickeTurnusy
    .filter((t) => t.city !== turnus.city)
    .map((t) => ({
      id: t.id,
      slug: t.slug,
      label: `${getCity(t.city).name} ${t.start ? kratce(t) : '(chystáme)'}`,
      aktualni: false,
    }))
  const dalsiTurnusy = getTurnusy().filter((t) => t.city !== turnus.city)

  // Jen fotky z našich táborů. Fotky místa konání sem nepatří — ukazuje je
  // sekce „Místo konání“ (`VenueShowcase`) a v galerii „z tábora“ by se
  // tvářily jako záběry z něj.
  const fotky: FotkaGalerie[] = FOTKY_Z_TABORA

  const recenzeKmeni = maRecenze() ? RECENZE.find((r) => r.text) : undefined
  const vytah = tabor ? zkusiSiTabora(tabor).slice(0, 4) : []
  const zaDen = cenaZaDen(turnus)

  return (
    <main>
      {/* ── Nákupní blok ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-ink bg-ink text-paper blueprint-grid-dark">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 select-none font-display text-[26rem] font-bold leading-none text-paper/[0.04]"
        >
          W
        </div>

        <div className="section-container relative z-10 pb-12 pt-20 md:pb-20 md:pt-28">
          {/* Na mobilu jen krok zpět — celá drobečková cesta by zabrala dva
              řádky, které chybí tlačítku. Na počítači celá. */}
          <nav aria-label="Drobečková navigace" className="mb-3 font-mono text-xs uppercase tracking-[0.2em] md:mb-6">
            {tabor && (
              <Link
                href={`/tabory/${tabor.id}`}
                className="inline-flex items-center gap-1.5 text-paper/60 hover:text-paper md:hidden"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                {tabor.shortName}
              </Link>
            )}
            <span className="hidden md:inline">
              <Link href="/" className="text-paper/50 transition-colors hover:text-paper">
                Domů
              </Link>
              <span className="mx-2 text-paper/30">/</span>
              <Link href="/tabory" className="text-paper/50 transition-colors hover:text-paper">
                Tábory
              </Link>
              {tabor && (
                <>
                  <span className="mx-2 text-paper/30">/</span>
                  <Link href={`/tabory/${tabor.id}`} className="text-paper/50 transition-colors hover:text-paper">
                    {tabor.shortName}
                  </Link>
                </>
              )}
              <span className="mx-2 text-paper/30">/</span>
              <span className="text-paper">
                {l.mesto} — {l.datum}
              </span>
            </span>
          </nav>

          <div className="grid gap-5 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <TerminGalerie fotky={fotky} />
            </div>

            <div className="lg:col-span-5 lg:row-span-2">
              <p className="mono-label-dark mb-2 text-accent-300 md:mb-3">
                {l.mesto}
                {venue && <> · {venue.name}</>}
              </p>
              <h1 className="font-display text-[1.75rem] font-bold leading-[1.05] tracking-tight text-paper md:text-5xl">
                {tabor ? tabor.name : 'Letní příměstský tábor'}
              </h1>
              <p className="mt-2 font-display text-lg font-semibold text-accent-400 md:mt-3 md:text-2xl">
                {l.datum}
                <span className="block font-sans text-sm font-normal text-paper/60 md:mt-1">
                  Po–Pá · {PROVOZNI_DOBA.rozsah} · {turnus.ageRange.replace('-', '–')} let
                </span>
              </p>
              {maRecenze() && (
                <a
                  href="#recenze"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm text-paper/80 hover:text-paper md:mt-3"
                >
                  <Star className="h-4 w-4 fill-cta-400 text-cta-400" aria-hidden="true" />
                  <strong className="text-paper">{GOOGLE_PROFIL.prumer}</strong> · {GOOGLE_PROFIL.pocet} hodnocení
                  na Google
                </a>
              )}

              <div className="mt-4 md:mt-5">
                <NakupniBox
                  turnus={turnus}
                  cena={l.cena}
                  cenaZaDen={zaDen}
                  stav={l.stav}
                  ctaText={l.ctaText}
                  ctaHref={l.ctaHref}
                  varianty={varianty}
                  jinde={jinde}
                />
              </div>
            </div>

            {/* Kontakt a citace: na mobilu pod nákupním boxem, na počítači pod
                galerií — jinak by tam zůstala prázdná tmavá plocha. Pořadí ve
                zdroji je pořadí na mobilu; na počítači je pravý sloupec
                `row-span-2` a tenhle blok spadne do levého pod galerii. */}
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
              {/* Kontakt u nákupu (DP-015). Schválně bez jména konkrétního
                  člověka (rozhodnutí 2026-10-19) — společný telefon a e-mail ze
                  `SITE`, aby se box nemusel měnit s tím, kdo tábory zrovna vede. */}
              <div className="flex gap-4 rounded-md border border-paper/15 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/20 bg-paper/10">
                  <MessageCircleQuestion className="h-5 w-5 text-paper" aria-hidden="true" />
                </div>
                <div className="min-w-0 text-sm">
                  <p className="text-paper/80">
                    <strong className="text-paper">Nejste si jistí?</strong> Zavolejte nebo napište,
                    rádi vám pomůžeme s výběrem termínu i s čímkoli dalším.
                  </p>
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <a
                      href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-1.5 font-medium text-paper hover:text-cta-300"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      {SITE.phone}
                    </a>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="inline-flex items-center gap-1.5 font-medium text-paper hover:text-cta-300"
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      {SITE.email}
                    </a>
                  </p>
                </div>
              </div>

              {recenzeKmeni && (
                <figure className="border-l-2 border-cta-400 pl-4">
                  <div className="mb-1.5 flex gap-0.5" role="img" aria-label={`Hodnocení ${recenzeKmeni.hvezdicky} z 5 hvězdiček`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        aria-hidden="true"
                        className={n <= recenzeKmeni.hvezdicky ? 'h-3.5 w-3.5 fill-cta-400 text-cta-400' : 'h-3.5 w-3.5 text-paper/20'}
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm italic text-paper/80">„{recenzeKmeni.text}“</blockquote>
                  <figcaption className="mt-1.5 font-mono text-xs text-paper/50">
                    {recenzeKmeni.autor} · Google
                  </figcaption>
                </figure>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Chystaný turnus: formulář zájmu hned pod nákupním blokem, sem míří
          tlačítko „Dát vědět, až otevřeme". */}
      {!prodejny && (
        <section className="section-padding border-b border-ink/15 bg-paper">
          <div className="section-container">
            <TurnusInterestForm turnus={turnus} source={`turnus-${turnus.slug}`} />
          </div>
        </section>
      )}

      {/* ── Co děti čeká ─────────────────────────────────────────────── */}
      {tabor && (
        <section id="program" className="section-padding scroll-mt-24 bg-paper">
          <div className="section-container grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="mono-label mb-4">Co se na táboře dělá</p>
              <h2 className="heading-2 mb-8 text-ink">
                Co dítě za týden <span className="text-accent-600">postaví</span>
              </h2>
              <ul className="space-y-4">
                {vytah.map((bod) => (
                  <li key={bod} className="flex gap-3 text-lg text-ink-500">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-accent-600" aria-hidden="true" />
                    {bod}
                  </li>
                ))}
              </ul>
            </div>

            {tabor.program && (
              <div className="lg:col-span-6">
                <div className="overflow-hidden rounded-md border border-ink">
                  <p className="border-b border-ink bg-ink px-5 py-3 font-mono text-xs uppercase tracking-wider text-paper/70">
                    Týden v kostce
                  </p>
                  <ol>
                    {tabor.program.map((den, i) => (
                      <li
                        key={den.den}
                        className={`flex items-baseline gap-4 bg-white px-5 py-4 ${i > 0 ? 'border-t border-ink/10' : ''}`}
                      >
                        <span className="w-7 shrink-0 font-mono text-sm font-semibold text-accent-600">
                          {ZKRATKY_DNU[den.den] ?? den.den}
                        </span>
                        <span className="font-display font-semibold text-ink">{den.title}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <Link href={`/tabory/${tabor.id}#tyden`} className="btn-outline group mt-6">
                  Celý program a rozvrh dne
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Cena, záruka a průběh přihlášky — důvěra u nákupu (DP-016) ── */}
      {turnus.priceKc !== null && (
        <section id="v-cene" className="section-padding scroll-mt-24 border-y border-ink/15 bg-paper-soft">
          <div className="section-container grid gap-10 lg:grid-cols-3">
            <div>
              <p className="mono-label mb-4">Cena {l.cena}</p>
              <h2 className="heading-3 mb-6 text-ink">Co je v ceně</h2>
              <ul className="space-y-3">
                {V_CENE.map((polozka) => (
                  <li key={polozka} className="flex gap-3 text-ink">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-trust-600" aria-hidden="true" />
                    {polozka}
                  </li>
                ))}
              </ul>
              <p className="mb-3 mt-8 font-mono text-xs uppercase tracking-wider text-ink/50">Není v ceně</p>
              <ul className="space-y-2">
                {MIMO_CENU.map((polozka) => (
                  <li key={polozka} className="flex gap-3 text-sm text-ink-500">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0 text-ink/40" aria-hidden="true" />
                    {polozka}
                  </li>
                ))}
              </ul>
            </div>

            {turnus.minimum && (
              <div id="zaruka" className="scroll-mt-24 rounded-md border border-trust-200 bg-trust-50 p-6">
                <ShieldCheck className="mb-4 h-8 w-8 text-trust-600" aria-hidden="true" />
                <h2 className="heading-3 mb-4 text-ink">Když se tábor nenaplní</h2>
                <p className="text-ink-500">
                  Tábor se koná, když se přihlásí aspoň {turnus.minimum.deti} dětí. Rozhodneme
                  o tom do {datumCesky(turnus.minimum.rozhodnemeDo)} a dáme vám vědět. Když se
                  nekoná, nabídneme vám přesun na jiný termín, nebo vrátíme celou platbu.
                </p>
                <Link href="/podminky" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline">
                  Obchodní podmínky, čl. 22
                </Link>
              </div>
            )}

            <div>
              <h2 className="heading-3 mb-6 text-ink">Jak přihláška probíhá</h2>
              <ol className="space-y-5">
                {[
                  ['Vyplníte přihlášku', 'Údaje o dítěti a o vás. Na alergie a stravování se ptáme rovnou.'],
                  ['Zaplatíte převodem', 'Bezpečně přes platební bránu Comgate, hned při přihlášce.'],
                  ['Dostanete fakturu', 'E-mailem do 14 dnů od platby. Před táborem pošleme vše potřebné k nástupu.'],
                ].map(([nadpis, text], i) => (
                  <li key={nadpis} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-ink bg-paper font-mono text-sm font-semibold text-ink">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-display font-semibold text-ink">{nadpis}</p>
                      <p className="text-sm text-ink-500">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {venue && <VenueShowcase venue={venue} />}

      <GoogleRecenze />

      {dalsiTurnusy.length > 0 && (
        <section className="section-padding border-t border-ink/15 bg-paper-soft">
          <div className="section-container">
            <h2 className="heading-2 mb-10 text-ink">Tábor v dalších městech</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dalsiTurnusy.map((t) => (
                // Formulář zájmu stojí na stránce TOHO turnusu, ne na téhle.
                <TurnusCard key={t.id} turnus={t} zajemHref={`/tabory/termin/${t.slug}#zajem`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Závěrečná výzva ──────────────────────────────────────────── */}
      {prodejny && l.ctaHref && (
        <section
          id="zaverecna-vyzva"
          className="section-padding relative overflow-hidden border-y border-ink bg-cta-400"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-10 select-none font-display text-[22rem] font-bold leading-none text-ink/[0.06]"
          >
            W
          </div>
          <div className="section-container relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mono-label mb-4 text-ink/70">
                {l.mesto} · {l.datum}
              </p>
              <h2 className="heading-2 text-ink">Přihlaste dítě na léto</h2>
              <p className="mt-4 text-lg text-ink/80">
                {l.cena} za celý týden, oběd i materiál v ceně.
              </p>
            </div>
            <ZaverecneTlacitko href={l.ctaHref} text={l.ctaText} termId={turnus.id} />
          </div>
        </section>
      )}

      <NakupniLista
        nadpis={prodejny ? `${l.cena} · ${varianty.find((v) => v.aktualni)?.label ?? l.datum}` : `${l.mesto} · termín upřesníme`}
        podnadpis={tabor ? `${tabor.shortName} · ${l.mesto}` : l.mesto}
        ctaText={prodejny ? l.ctaText : 'Dát vědět'}
        href={prodejny && l.ctaHref ? l.ctaHref : '#zajem'}
        sleduj={['hlavni-cta', 'zajem', 'zaverecna-vyzva']}
        termId={prodejny ? turnus.id : undefined}
      />
    </main>
  )
}
