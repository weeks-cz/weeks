import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Handshake, Users, Wrench } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FirmyPoptavka } from '@/components/firmy/FirmyPoptavka'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import { getNabidky, PARTNERSTVI_ZATIM, type NabidkaId } from '@/lib/firmy'
import { SITE } from '@/lib/site'

// Ikona a popisek „poptat" tlačítka se k nabídce nedají odvodit z dat
// (nadpisy v `src/lib/firmy.ts` jako „Dny pro děti zaměstnanců" se nedají
// bezpečně sklonit do tvaru „Poptat …"), proto jsou tady jako malá UI mapa
// vedle datového zdroje, ne jako duplicitní zdroj obsahu.
const NABIDKA_META: Record<NabidkaId, { icon: typeof Users; poptatLabel: string }> = {
  'deti-zamestnancu': { icon: Users, poptatLabel: 'Poptat den pro děti zaměstnanců' },
  workshopy: { icon: Wrench, poptatLabel: 'Poptat workshop' },
  partnerstvi: { icon: Handshake, poptatLabel: 'Poptat partnerství' },
}

/**
 * Stránka `/firmy` — tři nabídky pro tři různé lidi (HR, office manager,
 * marketing/vedení), jeden sdílený poptávkový formulář dole. Zůstává
 * serverová a staticky předgenerovaná komponenta: `FirmyPoptavka` si
 * `?typ=` z adresy čte sama za vlastní hranicí `Suspense`, takže stránka
 * nesmí sahat na `searchParams` — jinak by ji Next kvůli tomu přepnul na
 * dynamické vykreslování (viz komentář u `FirmyPoptavka`).
 */
export default function FirmyPage() {
  const nabidky = getNabidky()

  // Stránka nemá vlastní viditelný drobečkový řádek (jen odkaz zpět), proto
  // se název přebírá z hlavičky (`Header.tsx`) — „Pro firmy" je tam i tady.
  const breadcrumbItems = [
    { name: 'Domů', url: SITE.url },
    { name: 'Pro firmy', url: `${SITE.url}/firmy` },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-paper blueprint-grid border-b border-ink/15 overflow-hidden pt-32 pb-20">
          <div className="section-container relative z-10">
            <div className="max-w-3xl">
              {/* Breadcrumb */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Zpět na hlavní stránku
              </Link>

              <p className="mono-label mb-6">Pro firmy</p>
              <h1 className="heading-1 text-ink mb-6">Weeks pro firmy</h1>
              <p className="text-lg md:text-xl text-ink-500 mb-10 max-w-2xl leading-relaxed">
                O prázdninách pracujeme s dětmi na 3D tisku, elektronice a virtuální realitě.
                Stejné technologie a lektory nabízíme i firmám — jako den pro děti
                zaměstnanců, workshop pro tým nebo podpora tábora.
              </p>
              <nav aria-label="Přejít na nabídku" className="flex flex-col sm:flex-row gap-4">
                {nabidky.map((n) => (
                  <Link key={n.id} href={`#${n.id}`} className="btn-outline">
                    {n.nadpis}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </section>

        {/* Tři nabídky */}
        {nabidky.map((nabidka, index) => {
          const meta = NABIDKA_META[nabidka.id]
          const Icon = meta.icon
          return (
            <section
              key={nabidka.id}
              id={nabidka.id}
              className={`section-padding border-b border-ink/15 scroll-mt-24 ${
                index % 2 === 0 ? 'bg-paper' : 'bg-paper-soft'
              }`}
            >
              <div className="section-container">
                <div className="max-w-3xl mb-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 bg-white border border-ink/15 rounded-sm flex items-center justify-center flex-shrink-0"
                      aria-hidden="true"
                    >
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h2 className="heading-2 text-ink">{nabidka.nadpis}</h2>
                  </div>
                  <p className="mono-label mb-4">{nabidka.proKoho}</p>
                  <p className="text-lg text-ink-500 leading-relaxed">{nabidka.perex}</p>
                </div>

                <div className="max-w-3xl mb-10">
                  <h3 className="mono-label mb-4">Jak to probíhá</h3>
                  <ul className="space-y-2.5">
                    {nabidka.jakToProbiha.map((item) => (
                      <li key={item} className="flex gap-3 text-ink-500">
                        <Check className="w-4 h-4 mt-1 text-primary-600 flex-shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                  <div className="card-maker p-6">
                    <h3 className="mono-label mb-4">Co zajistíme my</h3>
                    <ul className="space-y-2.5">
                      {nabidka.zajistimeMy.map((item) => (
                        <li key={item} className="flex gap-3 text-ink-500 text-sm">
                          <Check className="w-4 h-4 mt-0.5 text-primary-600 flex-shrink-0" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="card-maker p-6">
                    <h3 className="mono-label mb-4">Co zajistíte vy</h3>
                    <ul className="space-y-2.5">
                      {nabidka.zajistiteVy.map((item) => (
                        <li key={item} className="flex gap-3 text-ink-500 text-sm">
                          <Check className="w-4 h-4 mt-0.5 text-primary-600 flex-shrink-0" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pole je dnes u všech tří nabídek prázdné (Weeks zatím
                    neodbavil žádnou firemní zakázku) — vykresluje se jen
                    tehdy, až v datech doopravdy něco bude. */}
                {nabidka.reference && nabidka.reference.length > 0 && (
                  <div className="max-w-3xl mt-10">
                    <h3 className="mono-label mb-4">Reference</h3>
                    <ul className="space-y-2">
                      {nabidka.reference.map((r) => (
                        <li key={r} className="text-ink-500">
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Přiznání, ne součást nabídky — proto odlišeně: drobněji, v rámečku. */}
                {nabidka.id === 'partnerstvi' && (
                  <div className="max-w-3xl mt-10 border border-ink/15 rounded-md bg-white p-4">
                    <p className="text-sm text-ink-500">{PARTNERSTVI_ZATIM}</p>
                  </div>
                )}

                <div className="mt-10">
                  <Link href={`/firmy?typ=${nabidka.id}#poptavka`} className="btn-secondary group">
                    {meta.poptatLabel}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>
          )
        })}

        {/* Kde a s kým — stejná sekce jako na úvodce */}

        {/* Poptávka */}
        <section id="poptavka" className="section-padding bg-paper-soft border-t border-ink/15 scroll-mt-24">
          <div className="section-container">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <p className="mono-label mb-4">Poptávka</p>
              <h2 className="heading-2 text-ink">Ozvěte se nám</h2>
            </div>
            <FirmyPoptavka />
            {/* Identifikace provozovatele — drobně, ať nepřebíjí formulář nad ní
                (stejný vzor jako na `/kontakt`, viz `src/app/kontakt/page.tsx`). */}
            <p className="font-mono text-xs text-ink-500 text-center mt-8">
              {SITE.legalName}, IČO {SITE.ico}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
