import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTurnusy, isBookable, nejblizsiTurnusy } from '@/lib/turnusy'
import { EventSchema } from '@/components/seo/StructuredData'
import { TurnusCard } from '@/components/turnusy/TurnusCard'

/**
 * Serverová komponenta — turnusy jsou statická data, žádná interaktivita
 * navíc tu není potřeba (karty samotné jsou klientské kvůli Framer Motion,
 * to řeší `TurnusCard`).
 *
 * Úvodka ukazuje jen výřez (`nejblizsiTurnusy()`) a zbytek nechává na
 * `/tabor`, kde je celý seznam i filtr podle města — tahle sekce je rozcestí,
 * ne katalog. Výřez je schválně sdílená funkce v `@/lib/turnusy`: ze stejného
 * výřezu čerpá `EventSchema` na úvodce (`src/app/page.tsx`), aby strukturovaná
 * data nevypsala turnus, který na stránce není vidět.
 *
 * Trojstav (prodejny / vyprodáno / nic k prodeji) i formulace se ale počítají
 * ze VŠECH turnusů, ne jen z výřezu — a musí znít stejně jako na `/tabor`,
 * jinak si úvodka slibuje věci, které karta vedle ní hned popírá.
 */
export function NejblizsiTurnusy() {
  const vsechnyTurnusy = getTurnusy()
  const turnusy = nejblizsiTurnusy()

  const prodejny = vsechnyTurnusy.some(isBookable)
  const vyprodano = !prodejny && vsechnyTurnusy.some((t) => t.status === 'plno')

  return (
    <>
      {/* Strukturovaná data úvodky vykresluje tatáž komponenta, která vykresluje
          karty, a ze stejné proměnné. Dřív stála na úvodce samostatně a braly
          se do nich VŠECHNY prodejné turnusy, zatímco vidět byly tři — dokud
          jsou turnusy dva, nepozná se to, ale při vypsání termínů by Google
          našel událost, která na stránce nestojí. Takhle se ty dva seznamy
          nemají jak rozejít. */}
      <EventSchema turnusy={turnusy} />
      <section className="section-padding bg-paper-soft border-y border-ink/15">
        <div className="section-container">
          <div className="max-w-3xl mb-12">
            <p className="mono-label mb-4">Turnusy</p>
            <h2 className="heading-2 text-ink mb-4">
              Nejbližší <span className="text-primary-600">turnusy</span>
            </h2>
            {turnusy.length > 0 && (
              <p className="text-lg text-ink-500">
                {prodejny
                  ? 'Cenu, obsazenost i přesné datum najdete u vybraného turnusu.'
                  : vyprodano
                    ? 'Aktuální turnusy jsou obsazené. Nechte nám kontakt a ozveme se, jakmile se uvolní místo nebo vypíšeme další termín.'
                    : 'Termíny na příští léto vypisujeme na podzim. Vyberte si město a nechte nám kontakt — ozveme se vám mezi prvními.'}
              </p>
            )}
          </div>

          {turnusy.length === 0 ? (
            <p className="text-lg text-ink-500 max-w-xl">
              Termíny na příští léto vypíšeme na podzim.{' '}
              <Link href="/tabor#turnusy" className="text-primary-600 hover:underline font-medium">
                Nechte nám kontakt
              </Link>{' '}
              a ozveme se vám mezi prvními.
            </p>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {turnusy.map((turnus) => (
                  <TurnusCard key={turnus.id} turnus={turnus} />
                ))}
              </div>

              <div className="mt-10">
                <Link href="/tabor" className="btn-outline group">
                  Všechny turnusy
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
