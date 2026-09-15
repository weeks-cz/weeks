'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import { isBookable, type Turnus } from '@/lib/turnusy'
import { getCity, getVenue } from '@/lib/cities'
import { getFocusModules } from '@/lib/focus'
import { SpotsLeftBadge } from './SpotsLeft'

const MESICE_2P = [
  'ledna', 'února', 'března', 'dubna', 'května', 'června',
  'července', 'srpna', 'září', 'října', 'listopadu', 'prosince',
]

function denMesic(iso: string): { den: number; mesic: number; rok: number } {
  const d = new Date(iso + 'T12:00:00')
  return { den: d.getDate(), mesic: d.getMonth(), rok: d.getFullYear() }
}

/** Rozsah termínu česky: „12. – 16. července 2027", přes měsíce „29. července – 2. srpna 2027". */
function rozsahData(startIso: string, endIso: string): string {
  const a = denMesic(startIso)
  const b = denMesic(endIso)
  if (a.mesic === b.mesic && a.rok === b.rok) {
    return `${a.den}. – ${b.den}. ${MESICE_2P[b.mesic]} ${b.rok}`
  }
  return `${a.den}. ${MESICE_2P[a.mesic]} – ${b.den}. ${MESICE_2P[b.mesic]} ${b.rok}`
}

/**
 * Popisky karty turnusu jako čistá funkce — aby šly otestovat bez vykreslování.
 * Turnus, který není v prodeji, nedostane odkaz na registraci: `ctaHref` je
 * `null` a karta místo tlačítka nabídne sběr kontaktu.
 */
export function turnusLabels(turnus: Turnus) {
  const prodejny = isBookable(turnus)

  const datum =
    turnus.start && turnus.end ? rozsahData(turnus.start, turnus.end) : 'Termín upřesníme'

  const misto = turnus.venueId ? getVenue(turnus.venueId).name : 'Místo upřesníme'

  // toLocaleString vkládá mezi tisíce nezalomitelnou mezeru (U+00A0) — necháváme
  // ji záměrně, i před „Kč": cena se na úzké kartě nesmí zalomit uprostřed čísla.
  const cena = turnus.priceKc !== null ? `${turnus.priceKc.toLocaleString('cs-CZ')} Kč` : ''

  const stav =
    turnus.status === 'plno'
      ? 'Obsazeno'
      : turnus.status === 'chystame'
        ? 'Chystáme'
        : turnus.status === 'uzavreno'
          ? 'Proběhlo'
          : 'Přijímáme přihlášky'

  const ctaText = prodejny
    ? 'Přihlásit dítě'
    : turnus.status === 'plno'
      ? 'Chci vědět o volném místě'
      : turnus.status === 'uzavreno'
        ? 'Chci vědět o dalších termínech'
        : 'Chci vědět, až otevřeme'

  return {
    datum,
    mesto: getCity(turnus.city).name,
    misto,
    cena,
    stav,
    ctaText,
    ctaHref: prodejny ? `/registrace?term=${turnus.id}` : null,
  }
}

export function TurnusCard({ turnus, spotsLeft }: { turnus: Turnus; spotsLeft?: number }) {
  const reduced = useReducedMotion()
  const l = turnusLabels(turnus)
  const zamereni = getFocusModules(turnus.focus)

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
          href={ctaHref ?? `/tabor/${turnus.slug}`}
          className={prodejny ? 'btn-primary text-sm' : 'btn-outline text-sm'}
        >
          {ctaText}
          <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  )
}
