import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTurnusy } from '@/lib/turnusy'
import { TurnusCard } from '@/components/turnusy/TurnusCard'

/**
 * Serverová komponenta — turnusy jsou statická data, žádná interaktivita
 * navíc tu není potřeba (karty samotné jsou klientské kvůli Framer Motion,
 * to řeší `TurnusCard`).
 *
 * Úvodka ukazuje jen výřez (`slice(0, 3)`) a zbytek nechává na `/tabor`,
 * kde je celý seznam i filtr podle města — tahle sekce je rozcestí, ne
 * katalog.
 */
export function NejblizsiTurnusy() {
  const turnusy = getTurnusy().slice(0, 3)

  return (
    <section className="section-padding bg-paper-soft border-y border-ink/15">
      <div className="section-container">
        <div className="max-w-3xl mb-12">
          <p className="mono-label mb-4">Turnusy</p>
          <h2 className="heading-2 text-ink mb-4">
            Nejbližší <span className="text-primary-600">turnusy</span>
          </h2>
          <p className="text-lg text-ink-500">
            Cenu, obsazenost i přesné datum najdete u vybraného turnusu.
          </p>
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
  )
}
