import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowRight,
  Box,
  Check,
  ChevronDown,
  Cpu,
  Gamepad2,
  Headset,
  Printer,
  Sparkles,
  Star,
} from 'lucide-react'
import { FAQSection } from '@/components/sections/FAQSection'
import { FotoPas } from '@/components/sections/FotoPas'
import { GoogleRecenze } from '@/components/sections/GoogleRecenze'
import { NakupniLista } from '@/components/turnusy/NakupniLista'
import { ProjectGallery } from '@/components/turnusy/ProjectGallery'
import { TurnusInterestForm } from '@/components/turnusy/TurnusInterestForm'
import { TurnusList } from '@/components/turnusy/TurnusList'
import { VenueShowcase } from '@/components/turnusy/VenueShowcase'
import { datumKratce } from '@/components/turnusy/turnus-labels'
import { MrizkaSekce } from '@/components/ui/MrizkaSekce'
import { getCity, getVenue, type VenueId } from '@/lib/cities'
import { getFocusModules, type FocusId } from '@/lib/focus'
import { GOOGLE_PROFIL, maRecenze } from '@/lib/recenze'
import { PROVOZNI_DOBA, getSiteFaq } from '@/lib/site'
import { DENNI_HARMONOGRAM, getAktivniTabory, zkusiSiTabora, type IkonaDne, type Tabor } from '@/lib/tabory'
import { getTurnusyByTabor, isBookable } from '@/lib/turnusy'

/**
 * Stránka tématu — jediné místo, kde žije popis tábora.
 *
 * Deset sekcí místo dřívějších dvanácti a zhruba poloviční délka: týdenní
 * program a typický den jsou jedna časová osa (den se rozbalí), praktické
 * informace se přestěhovaly do častých dotazů, kde už většinou byly.
 *
 * Rytmus sekcí drží pravidlo z CLAUDE.md — sousední sekce mají jiné pozadí
 * nebo linku, tmavé bloky kotví začátek, střed i termíny.
 *
 * Serverová komponenta: nosný text se nesmí schovat pod nespuštěnou animaci.
 */

const IKONY_DNE: Record<IkonaDne, LucideIcon> = {
  tisk: Printer,
  model: Box,
  iot: Cpu,
  vr: Headset,
  projekt: Sparkles,
}

const IKONY_ZAMERENI: Record<FocusId, LucideIcon> = {
  '3d-tisk': Box,
  iot: Cpu,
  vr: Headset,
  'herni-vyvoj': Gamepad2,
}

/** Fotka do hera — skutečná z tábora. Na výšku: dítě s tím, co si samo navrhlo. */
const FOTKA_HERA = {
  src: '/images/tabor/vytisk-v-ruce.webp',
  alt: 'Vlastní návrh, vytištěný na táboře',
  width: 896,
  height: 1195,
}

function Drobecky({ tabor }: { tabor: Tabor }) {
  return (
    <nav
      aria-label="Drobečková navigace"
      className="mb-6 font-mono text-xs uppercase tracking-[0.2em] md:mb-8"
    >
      <Link href="/" className="text-paper/50 transition-colors hover:text-paper">
        Domů
      </Link>
      <span className="mx-2 text-paper/30">/</span>
      <Link href="/tabory" className="text-paper/50 transition-colors hover:text-paper">
        Tábory
      </Link>
      <span className="mx-2 text-paper/30">/</span>
      <span className="text-paper">{tabor.shortName}</span>
    </nav>
  )
}

function Hodnoceni() {
  if (!maRecenze()) return null
  return (
    <a href="#recenze" className="inline-flex items-center gap-1.5 text-sm text-paper/80 hover:text-paper">
      <Star className="h-4 w-4 fill-cta-400 text-cta-400" aria-hidden="true" />
      <strong className="text-paper">{GOOGLE_PROFIL.prumer}</strong> · {GOOGLE_PROFIL.pocet} hodnocení na
      Google
    </a>
  )
}

export function TemaDetail({ tabor }: { tabor: Tabor }) {
  return tabor.status === 'aktivni' ? <AktivniTema tabor={tabor} /> : <ChystaneTema tabor={tabor} />
}

function AktivniTema({ tabor }: { tabor: Tabor }) {
  const turnusy = getTurnusyByTabor(tabor.id)
  const prodejne = turnusy.filter(isBookable)
  const zamereni = getFocusModules(tabor.focus)
  const venueIds = Array.from(
    new Set(turnusy.map((t) => t.venueId).filter((id): id is VenueId => id !== null)),
  )
  const galerie = zamereni.flatMap((z) => (z.gallery ?? []).map((img) => ({ ...img, tag: z.name })))
  const faq = [...getSiteFaq(), ...zamereni.flatMap((z) => z.faq ?? []), ...(tabor.faq ?? [])].filter(
    (otazka, i, vse) => vse.findIndex((o) => o.question === otazka.question) === i,
  )
  const vek = turnusy[0]?.ageRange.replace('-', '–') ?? '9–15'
  const ceny = prodejne.map((t) => t.priceKc).filter((c): c is number => c !== null)
  const odCeny = ceny.length > 0 ? `${Math.min(...ceny).toLocaleString('cs-CZ')} Kč` : null

  return (
    <main>
      {/* ── 1. Hero s termíny ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink text-paper blueprint-grid-dark">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 select-none font-display text-[26rem] font-bold leading-none text-paper/[0.04]"
        >
          W
        </div>
        <div className="section-container relative z-10 grid items-center gap-12 pb-16 pt-28 md:pb-24 md:pt-36 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Drobecky tabor={tabor} />
            <p className="mono-label-dark mb-5 text-accent-300">
              Po–Pá · {PROVOZNI_DOBA.rozsah} · {vek} let
            </p>
            <h1 className="heading-1 mb-6 text-paper">{tabor.name}</h1>
            <p className="mb-5 max-w-xl text-lg leading-relaxed text-paper/75 md:text-xl">{tabor.popis}</p>
            <Hodnoceni />

            {/* Termíny přímo v heru — rodič, který ví kdy a kde, je o klik od
                termínu. `id` sleduje lepicí lišta. */}
            <div id="vyber-terminu" className="mt-10">
              <p className="mb-3 text-sm font-medium text-paper">Vyberte termín</p>
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {turnusy.map((t) => {
                  const prodejny = isBookable(t)
                  return (
                    <li key={t.id}>
                      <Link
                        href={`/tabory/termin/${t.slug}`}
                        className={`group flex h-full flex-col rounded-md border p-4 transition-all ${
                          prodejny
                            ? 'border-ink bg-paper text-ink shadow-hard-amber hover:-translate-x-0.5 hover:-translate-y-0.5'
                            : 'border-dashed border-paper/30 text-paper/80 hover:border-paper/60'
                        }`}
                      >
                        <span className={`text-sm ${prodejny ? 'text-ink-500' : 'text-paper/60'}`}>
                          {getCity(t.city).name}
                        </span>
                        <span className="font-display text-lg font-bold">
                          {t.start && t.end
                            ? `${datumKratce(t.start, t.end)} ${t.start.slice(0, 4)}`
                            : 'Termín upřesníme'}
                        </span>
                        <span
                          className={`mt-2 inline-flex items-center gap-1 text-sm font-medium ${prodejny ? 'text-ink' : 'text-paper/60'}`}
                        >
                          {prodejny ? 'Přihlásit dítě' : 'Chystáme · dát vědět'}
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <a
                href="#co-si-postavi"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-paper/70 hover:text-paper"
              >
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
                Co děti na táboře čeká
              </a>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-sm lg:col-span-5 lg:block">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-md bg-cta-400"
            />
            <Image
              src={FOTKA_HERA.src}
              alt={FOTKA_HERA.alt}
              width={FOTKA_HERA.width}
              height={FOTKA_HERA.height}
              sizes="(min-width: 1024px) 384px, 0px"
              priority
              className="relative aspect-[3/4] w-full rounded-md border border-paper/20 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Pás faktů — amber předěl mezi dvěma tmavými bloky ───────── */}
      <div className="border-y border-ink bg-cta-400 text-ink">
        <dl className="section-container grid grid-cols-2 gap-y-3 py-4 sm:grid-cols-4">
          {[
            ['5 dní', 'pondělí až pátek'],
            [PROVOZNI_DOBA.rozsah, 'každý den'],
            [`${vek} let`, 'věk dětí'],
            ['Oběd', 'v ceně'],
          ].map(([hodnota, popis]) => (
            <div key={popis} className="flex flex-col">
              <dt className="order-last text-sm text-ink/70">{popis}</dt>
              <dd className="font-display text-lg font-bold">{hodnota}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ── 2. Pro děti ──────────────────────────────────────────────── */}
      <MrizkaSekce
        id="co-si-postavi"
        odstin="tmavy"
        className="section-padding scroll-mt-24 bg-ink text-paper blueprint-grid-dark"
      >
        <div className="section-container">
          <div className="mb-12 max-w-3xl">
            <p className="mono-label-dark mb-4 text-accent-300">Pro děti</p>
            <h2 className="heading-2 mb-4 text-paper">
              Co si <span className="text-accent-400">postavíš</span>
            </h2>
            <p className="text-lg text-paper/70">
              Týden stojí na {zamereni.length === 2 ? 'dvou tématech' : `${zamereni.length} tématech`}. Každé
              končí něčím, co uděláš sám.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {zamereni.map((z) => {
              const Ikona = IKONY_ZAMERENI[z.id]
              return (
                <article
                  key={z.id}
                  className="overflow-hidden rounded-md border border-paper/15 bg-paper/[0.03]"
                >
                  {z.foto && (
                    <div className="relative aspect-[16/9] border-b border-paper/15">
                      <Image
                        src={z.foto.src}
                        alt={z.foto.alt}
                        fill
                        loading="lazy"
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-7">
                    <Ikona className="mb-5 h-9 w-9 text-accent-400" aria-hidden="true" />
                    <h3 className="mb-2 font-display text-2xl font-semibold text-paper">{z.name}</h3>
                    <p className="mb-6 text-paper/70">{z.short}</p>
                    <ul className="space-y-2.5">
                      {z.tryOut.map((bod) => (
                        <li key={bod} className="flex gap-2.5 text-paper/85">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                          {bod}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </MrizkaSekce>

      {/* ── 3. Týden — časová osa, typický den se rozbalí ─────────────── */}
      {tabor.program && (
        <section id="tyden" className="section-padding scroll-mt-24 border-b border-ink/15 bg-paper">
          <div className="section-container grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="mono-label mb-4">Program</p>
                <h2 className="heading-2 mb-4 text-ink">
                  Jak vypadá <span className="text-accent-600">týden</span>
                </h2>
                <p className="text-lg text-ink-500">
                  Projekty na sebe navazují. Co dítě začne v pondělí, to si v pátek ukáže rodičům.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8">
              {/* Osa jako dvousloupcová mřížka: kolečko s ikonou v prvním
                  sloupci, spojnice je jeho okraj dolů. Bez absolutního
                  posouvání, které se rozjede s každou změnou odsazení. */}
              <ol>
                {tabor.program.map((den, i) => {
                  const Ikona = IKONY_DNE[den.ikona]
                  const posledni = i === tabor.program!.length - 1
                  return (
                    <li key={den.den} className="grid grid-cols-[2.5rem_1fr] gap-x-5 sm:gap-x-6">
                      <div className="flex flex-col items-center" aria-hidden="true">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper">
                          <Ikona className="h-5 w-5 text-accent-600" />
                        </span>
                        {!posledni && <span className="w-0.5 flex-1 bg-ink/15" />}
                      </div>
                      <div className={posledni ? '' : 'pb-10'}>
                        <p className="mb-1 pt-2 text-sm font-medium text-accent-600">{den.den}</p>
                        <h3 className="mb-2 font-display text-xl font-semibold text-ink">{den.title}</h3>
                        <p className="mb-3 max-w-2xl text-ink-500">{den.description}</p>
                        <ul className="flex flex-wrap gap-2">
                          {den.highlights.map((h) => (
                            <li
                              key={h}
                              className="rounded-sm bg-accent-50 px-2.5 py-1 text-sm text-accent-800"
                            >
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  )
                })}
              </ol>

              <details className="group mt-12 rounded-md border border-ink bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  Jak vypadá jeden den
                  <ChevronDown
                    className="h-5 w-5 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <ol className="grid border-t border-ink/15 sm:grid-cols-2">
                  {DENNI_HARMONOGRAM.map((item) => (
                    <li key={item.time} className="flex gap-4 border-b border-ink/10 p-4 sm:odd:border-r">
                      <span className="w-12 shrink-0 font-mono text-sm font-semibold text-accent-600">
                        {item.time}
                      </span>
                      <div>
                        <p className="font-display text-sm font-semibold text-ink">{item.title}</p>
                        {item.description && (
                          <p className="mt-0.5 text-xs text-ink-500">{item.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Fotka přes celou šířku ─────────────────────────────────── */}
      <FotoPas />

      {/* ── 5. Co si odnese ──────────────────────────────────────────── */}
      <ProjectGallery polozky={galerie} />

      {/* ── 6. Kde ────────────────────────────────────────────────────── */}
      {venueIds.map((id) => (
        <VenueShowcase key={id} venue={getVenue(id)} />
      ))}

      {/* ── 7. Recenze — před termíny, ať rodič čte cizí zkušenost těsně
             před tím, než si vybere. ───────────────────────────────── */}
      <GoogleRecenze />

      {/* ── 8. Termíny ───────────────────────────────────────────────── */}
      <MrizkaSekce
        odstin="tmavy"
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
              {prodejne.length > 0
                ? 'Cenu, obsazenost i místo najdete u vybraného termínu.'
                : 'Termíny na příští léto vypisujeme na podzim. Nechte nám kontakt — ozveme se vám mezi prvními.'}
            </p>
          </div>
          <TurnusList turnusy={turnusy} />
          <div className="mt-16">
            <TurnusInterestForm source={`tabor-${tabor.id}`} />
          </div>
        </div>
      </MrizkaSekce>

      {/* ── 9. Časté dotazy ──────────────────────────────────────────── */}
      <FAQSection polozky={faq} />

      {/* ── 10. Závěrečná výzva ──────────────────────────────────────── */}
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
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <h2 className="heading-2 mb-5 text-ink">
              {prodejne.length > 0
                ? 'Přihlaste dítě, dokud jsou volná místa'
                : 'Chcete vědět o termínech mezi prvními?'}
            </h2>
            <p className="mb-8 text-lg text-ink/80">
              {prodejne.length > 0
                ? 'Kolik míst ještě zbývá, vidíte u každého termínu.'
                : 'Nechte nám kontakt a ozveme se vám dřív, než se termíny objeví na webu.'}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#turnusy" className="btn-secondary group">
                {prodejne.length > 0 ? 'Vybrat termín' : 'Nechat kontakt'}
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

      <NakupniLista
        nadpis={tabor.shortName}
        podnadpis={odCeny ? `od ${odCeny} za týden · oběd v ceně` : undefined}
        ctaText={prodejne.length > 0 ? 'Vybrat termín' : 'Dát vědět'}
        href="#turnusy"
        sleduj={['vyber-terminu', 'turnusy', 'zaverecna-vyzva']}
      />
    </main>
  )
}

/** Tábor, který se teprve chystá: záměr, sběr kontaktu a odkaz na běžící tábor. */
function ChystaneTema({ tabor }: { tabor: Tabor }) {
  const bezici = getAktivniTabory()

  return (
    <main>
      <section className="relative overflow-hidden border-b border-ink bg-ink text-paper blueprint-grid-dark">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 select-none font-display text-[26rem] font-bold leading-none text-paper/[0.04]"
        >
          W
        </div>
        <div className="section-container relative z-10 pb-16 pt-28 md:pb-24 md:pt-36">
          <div className="max-w-3xl">
            <Drobecky tabor={tabor} />
            <p className="mb-6 inline-block rounded-sm border border-cta-400 bg-cta-400 px-2.5 py-1 text-sm font-semibold text-ink">
              Chystáme
            </p>
            <h1 className="heading-1 mb-6 text-paper">{tabor.name}</h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-paper/75 md:text-xl">{tabor.popis}</p>
            <a href="#zajem" className="btn-primary group px-8 py-4">
              Dát vědět, až ho otevřeme
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
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
              Program, termín ani cenu zatím nemáme potvrzené — jakmile budou, najdete je tady jako první.
            </p>
          </div>
        </div>
      </section>

      <MrizkaSekce odstin="tmavy" className="section-padding border-y border-ink bg-ink blueprint-grid-dark">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <TurnusInterestForm source={`tabor-${tabor.id}`} />
          </div>
        </div>
      </MrizkaSekce>

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
