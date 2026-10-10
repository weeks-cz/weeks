'use client'

import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'

export type TermCapacity = { spotsLeft: number; maxCapacity: number }
export type CapacityMap = Record<string, TermCapacity>

/**
 * Fetches live remaining-spots per term for a location once on mount.
 * Returns null until loaded (callers should render nothing meanwhile — never a
 * fake number). Fail-quiet: stays null if the request fails.
 */
export function useTermCapacity(mesto?: string): CapacityMap | null {
  const [map, setMap] = useState<CapacityMap | null>(null)
  useEffect(() => {
    let cancelled = false
    const url = mesto ? `/api/term-capacity?mesto=${encodeURIComponent(mesto)}` : '/api/term-capacity'
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!cancelled && j && j.data) setMap(j.data as CapacityMap)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [mesto])
  return map
}

/** Czech plural for "místo": 1 místo, 2–4 místa, 0 & 5+ míst. */
function mistoLabel(n: number): string {
  if (n === 1) return 'místo'
  if (n >= 2 && n <= 4) return 'místa'
  return 'míst'
}

/**
 * Od kolika volných míst níž se počet ukazuje. Nad tím web mlčí: „Zbývá
 * 15 míst z 15“ na čerstvě otevřeném turnusu působí, jako by o něj nikdo
 * nestál (rozhodnutí 10. 10. 2026 — ukazovat až po prvních pěti registracích).
 */
export const UKAZAT_VOLNA_MISTA_OD = 10

/**
 * Text odznaku, nebo `null`, když se nemá ukázat nic. Čistá funkce — aby šlo
 * pravidlo otestovat bez vykreslování a aby karta i stránka termínu věděly,
 * jestli místo odznaku ukázat stav.
 */
export function volnaMistaText(spotsLeft: number): string | null {
  if (spotsLeft <= 0) return 'Obsazeno'
  if (spotsLeft > UKAZAT_VOLNA_MISTA_OD) return null
  return `Zbývá ${spotsLeft} ${mistoLabel(spotsLeft)}`
}

/**
 * Odznak volných míst. Render only for confirmed terms and only once real
 * capacity data is available — nikdy vymyšlené číslo. Jantarová je barva
 * role „akce a stav“; obsazený turnus je neutrální, už se nedá nic udělat.
 */
export function SpotsLeftBadge({ spotsLeft }: { spotsLeft: number }) {
  const text = volnaMistaText(spotsLeft)
  if (text === null) return null
  const cls =
    spotsLeft <= 0 ? 'border-ink/20 bg-white text-ink/50' : 'border-cta-600 bg-cta-50 text-cta-700'

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-xs px-2 py-0.5 rounded-sm border ${cls}`}>
      <Users className="w-3.5 h-3.5" aria-hidden="true" />
      {text}
    </span>
  )
}
