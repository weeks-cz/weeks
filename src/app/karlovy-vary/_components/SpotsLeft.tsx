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
export function useTermCapacity(locationId: string): CapacityMap | null {
  const [map, setMap] = useState<CapacityMap | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch(`/api/term-capacity?location=${encodeURIComponent(locationId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!cancelled && j && j.data) setMap(j.data as CapacityMap)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [locationId])
  return map
}

/** Czech plural for "místo": 1 místo, 2–4 místa, 0 & 5+ míst. */
function mistoLabel(n: number): string {
  if (n === 1) return 'místo'
  if (n >= 2 && n <= 4) return 'místa'
  return 'míst'
}

/**
 * Honest scarcity badge. Render only for confirmed terms and only once real
 * capacity data is available. Color/urgency scales with how few spots remain.
 */
export function SpotsLeftBadge({ spotsLeft, maxCapacity }: TermCapacity) {
  if (spotsLeft <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
        <Users className="w-3.5 h-3.5" />
        Vyprodáno
      </span>
    )
  }

  const urgent = spotsLeft <= 4
  const low = spotsLeft <= 7
  const cls = urgent
    ? 'bg-red-50 text-red-700'
    : low
    ? 'bg-amber-50 text-amber-700'
    : 'bg-emerald-50 text-emerald-700'
  const text = urgent
    ? `Poslední ${spotsLeft} ${mistoLabel(spotsLeft)}!`
    : `Zbývá ${spotsLeft} ${mistoLabel(spotsLeft)} z ${maxCapacity}`

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      <Users className="w-3.5 h-3.5" />
      {text}
    </span>
  )
}
