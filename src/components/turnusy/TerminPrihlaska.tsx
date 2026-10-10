'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Turnus } from '@/lib/turnusy'
import { SpotsLeftBadge, useTermCapacity } from './SpotsLeft'
import { TurnusInterestForm } from './TurnusInterestForm'

/**
 * Výzva k přihlášce na stránce prodejného termínu, se živou kapacitou.
 *
 * Stránka termínu je statická (`generateStaticParams`), kdežto obsazenost se
 * mění s každou registrací — proto žije v klientské komponentě a dotahuje se
 * z `/api/term-capacity`, stejně jako na výpisu `/tabory`.
 *
 * Dokud data nedorazí (nebo když dotaz selže), ukazuje se tlačítko bez
 * odznaku: neznámá obsazenost nesmí registraci schovat. Když je turnus podle
 * živých dat plný, tlačítko ustoupí formuláři zájmu o volné místo — registrace
 * by stejně skončila hláškou o vyčerpané kapacitě (`CAPACITY_FULL`).
 */
export function TerminPrihlaska({
  turnus,
  ctaText,
  ctaHref,
}: {
  turnus: Turnus
  ctaText: string
  ctaHref: string
}) {
  const capacity = useTermCapacity(turnus.city)
  const spotsLeft = capacity?.[turnus.id]?.spotsLeft

  if (spotsLeft === 0) {
    return <TurnusInterestForm turnus={turnus} source={`turnus-${turnus.slug}`} vyprodano />
  }

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <Link href={ctaHref} className="btn-primary group inline-flex px-8 py-4">
        {ctaText}
        <ArrowRight
          className="h-5 w-5 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
      {spotsLeft !== undefined && <SpotsLeftBadge spotsLeft={spotsLeft} />}
    </div>
  )
}
