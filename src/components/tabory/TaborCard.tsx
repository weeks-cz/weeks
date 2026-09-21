'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { getFocusModules } from '@/lib/focus'
import type { Tabor } from '@/lib/tabory'
import type { Turnus } from '@/lib/turnusy'
import { turnusLabels } from '@/components/turnusy/turnus-labels'

/**
 * Karta tématu — základní dlaždice výpisu `/tabory`.
 *
 * Nese téma, technologie, a pod tím termíny, které to téma v daném městě má.
 * Rodič vybírá v pořadí město → téma → termín, takže seznam turnusů je až
 * uvnitř karty tématu, ne vedle ní.
 *
 * Barvy drží role: cyan (`accent`) = technologie, amber (`cta`) = stav a akce.
 * Karta jinou barvu nepoužívá.
 */
export function TaborCard({
  tabor,
  turnusy = [],
  index = 0,
}: {
  tabor: Tabor
  /** Turnusy tohohle tématu — už zúžené na město, ve kterém karta stojí. */
  turnusy?: Turnus[]
  /** Pořadí v mřížce, jen kvůli odstupňovanému náběhu animace. */
  index?: number
}) {
  const reduced = useReducedMotion()
  const chystame = tabor.status === 'chystame'
  const technologie = getFocusModules(tabor.focus).map((m) => m.name)

  const anim = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.45, delay: index * 0.06 },
      }

  return (
    <motion.article {...anim} className="card-maker flex flex-col overflow-hidden">
      <div className="h-1.5 bg-accent-400" aria-hidden="true" />

      <div className="flex flex-1 flex-col p-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
            {tabor.shortName}
          </h3>
          {chystame && (
            <span className="shrink-0 rounded-sm border border-ink bg-cta-300 px-2.5 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-ink">
              Chystáme
            </span>
          )}
        </div>

        {technologie.length > 0 && (
          <p className="mb-4 inline-block self-start rounded-sm bg-accent-50 px-2.5 py-1 font-mono text-xs uppercase tracking-[0.15em] text-accent-600">
            {technologie.join(' · ')}
          </p>
        )}

        <p className="mb-6 text-ink-500">{tabor.perex}</p>

        {turnusy.length > 0 ? (
          <ul className="mb-7 space-y-3 border-t border-ink/15 pt-5">
            {turnusy.map((turnus) => {
              const l = turnusLabels(turnus)
              return (
                <li key={turnus.id}>
                  <Link
                    href={`/tabory/termin/${turnus.slug}`}
                    className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-sm px-1 py-1 transition-colors hover:bg-paper-soft focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <span className="font-display font-semibold text-ink">{l.datum}</span>
                    <span className="flex items-center gap-1 text-sm text-ink-500">
                      <MapPin className="h-3.5 w-3.5 text-accent-600" aria-hidden="true" />
                      {l.misto}
                    </span>
                    <span className="ml-auto font-mono text-xs uppercase tracking-[0.15em] text-ink/60">
                      {l.cena || l.stav}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mb-7 border-t border-ink/15 pt-5 font-mono text-xs uppercase tracking-[0.15em] text-ink/60">
            {chystame ? 'Zatím bez termínu' : 'Termíny upřesníme'}
          </p>
        )}

        <Link href={`/tabory/${tabor.id}`} className="btn-primary group mt-auto w-full">
          {chystame ? 'Chci vědět víc' : 'Zobrazit tábor'}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.article>
  )
}
