import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getTurnusy, getTurnusyByCity } from '@/lib/turnusy'
import type { CityId } from '@/lib/cities'
import { reportError } from '@/lib/observability'

export const dynamic = 'force-dynamic'

/**
 * Veřejná obsazenost turnusů — kolik míst zbývá.
 *
 * Místo drží JAKÁKOLIV registrace se stavem jiným než 'cancelled' — přesně to
 * pravidlo, kterým kapacitu vynucuje create_registration() (migrace 011).
 * Kdyby se tyhle dvě pravidla rozešla, odznak „zbývá X míst" by sliboval místo,
 * které je fakticky pryč.
 *
 * Bez parametru vrací všechny turnusy; `?mesto=` zúží na jedno město.
 *
 * Při chybě vrací prázdná data (200), takže stránka jen vynechá odznaky místo
 * toho, aby se rozbila. Žádné osobní údaje — jen počty podle term_id.
 */
export async function GET(request: NextRequest) {
  const mesto = new URL(request.url).searchParams.get('mesto') as CityId | null

  try {
    const turnusy = mesto ? getTurnusyByCity(mesto) : getTurnusy()

    // term_id -> kapacita turnusu
    const capacityByTerm: Record<string, number> = {}
    for (const turnus of turnusy) {
      capacityByTerm[turnus.id] = turnus.capacity
    }

    if (Object.keys(capacityByTerm).length === 0) {
      return NextResponse.json({ data: {} })
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('registrations')
      .select('term_id')
      .in('term_id', Object.keys(capacityByTerm))
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
      { data: result },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    )
  } catch (e) {
    reportError(e, { route: 'term-capacity', mesto })
    return NextResponse.json({ data: {} })
  }
}
