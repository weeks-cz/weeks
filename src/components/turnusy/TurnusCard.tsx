'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import { getFocusTurnusu, type Turnus } from '@/lib/turnusy'
import { getFocusModules } from '@/lib/focus'
import { SpotsLeftBadge } from './SpotsLeft'
import { turnusLabels } from './turnus-labels'

// `turnusLabels` bydlí v samostatném souboru bez `'use client'`, aby ji šlo
// volat i ze serverové stránky `/tabory/termin/[slug]` — server nesmí zavolat
// funkci exportovanou z klientského modulu, smí ji jen vykreslit jako
// komponentu. Re-export tady drží stávající importy (`RegistrationForm`,
// testy) beze změny.
export { turnusLabels }

export function TurnusCard({ turnus, spotsLeft }: { turnus: Turnus; spotsLeft?: number }) {
  const reduced = useReducedMotion()
  const l = turnusLabels(turnus)
  const zamereni = getFocusModules(getFocusTurnusu(turnus))

  // Živá kapacita se může vyčerpat dřív, než se to projeví ve statickém
  // `status` v datech — `turnusLabels` o `spotsLeft` neví (je to čistá funkce
  // nad daty turnusu). Kartu proto tady dorovnáme, ať nenabízí registraci na
  // turnus, který je podle živých dat vyprodaný: stejné popisky jako `plno`.
  const vyprodano = spotsLeft === 0
  const stav = vyprodano ? 'Obsazeno' : l.stav
  const ctaText = vyprodano ? 'Chci vědět o volném místě' : l.ctaText
  const ctaHref = vyprodano ? null : l.ctaHref
  const prodejny = ctaHref !== null

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`card-maker flex flex-col bg-paper p-6 ${
        prodejny ? 'border border-ink/15' : 'border border-dashed border-ink/25'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <p className="mono-label">{l.mesto}</p>
        {prodejny && spotsLeft !== undefined ? (
          <SpotsLeftBadge spotsLeft={spotsLeft} maxCapacity={turnus.capacity} />
        ) : (
          <span className="font-mono text-xs uppercase tracking-wider text-ink/50">{stav}</span>
        )}
      </div>

      <h3 className="font-display text-xl font-semibold text-ink flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-ink/40 flex-shrink-0" aria-hidden="true" />
        {l.datum}
      </h3>

      <p className="flex items-center gap-2 text-sm text-ink-500 mb-3">
        <MapPin className="w-4 h-4 text-ink/40 flex-shrink-0" aria-hidden="true" />
        {l.misto}
      </p>

      {zamereni.length > 0 && (
        <p className="font-mono text-xs text-ink/50 mb-3">
          {zamereni.map((z) => z.name).join(' · ')}
        </p>
      )}

      <p className="text-sm text-ink-500 mb-6 flex-1">{turnus.perex}</p>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-ink/15">
        {l.cena ? (
          <span className="font-mono text-sm font-semibold text-ink whitespace-nowrap">
            {l.cena}
          </span>
        ) : (
          <span className="font-mono text-xs text-ink/40">cenu upřesníme</span>
        )}
        <Link
          href={ctaHref ?? `/tabory/termin/${turnus.slug}`}
          className={prodejny ? 'btn-primary text-sm' : 'btn-outline text-sm'}
        >
          {ctaText}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  )
}
