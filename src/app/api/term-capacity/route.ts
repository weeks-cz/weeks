import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getLocationById } from '@/lib/locations'
import { reportError } from '@/lib/observability'

export const dynamic = 'force-dynamic'

/**
 * Public per-term remaining-spots for a location's internally-booked camps (KV).
 *
 * A seat is held by ANY registration whose status <> 'cancelled' — the exact rule
 * create_registration() uses to enforce capacity (migration 011). Mirroring it here
 * means the "Zbývá X míst" badge never over-promises a spot that's actually taken.
 *
 * Fail-open: on any error returns empty data (200) so the UI simply omits badges
 * rather than breaking the page. No PII is returned — only term_id counts.
 */
export async function GET(request: NextRequest) {
  const locationId = new URL(request.url).searchParams.get('location') ?? 'karlovy-vary'
  try {
    const location = getLocationById(locationId)

    // term_id -> max capacity (from the term's program config)
    const capacityByTerm: Record<string, number> = {}
    for (const term of location.terms) {
      const program = location.programs.find((p) => p.id === term.program)
      if (program) capacityByTerm[term.id] = program.capacity
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('registrations')
      .select('term_id')
      .eq('location_id', locationId)
      .neq('status', 'cancelled')
    if (error) throw error

    const taken: Record<string, number> = {}
    for (const row of data ?? []) {
      const t = row.term_id as string
      taken[t] = (taken[t] ?? 0) + 1
    }

    const result: Record<string, { spotsLeft: number; maxCapacity: number }> = {}
    for (const [termId, maxCapacity] of Object.entries(capacityByTerm)) {
      result[termId] = {
        spotsLeft: Math.max(0, maxCapacity - (taken[termId] ?? 0)),
        maxCapacity,
      }
    }

    return NextResponse.json(
      { location: locationId, data: result },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    )
  } catch (e) {
    reportError(e, { route: 'term-capacity', locationId })
    return NextResponse.json({ location: locationId, data: {} })
  }
}
