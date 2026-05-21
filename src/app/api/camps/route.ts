import { NextResponse } from 'next/server'
import { scrapeDDMCapacity } from '@/lib/ddm-scraper'
import { fetchCampsRaw, type CampRow } from '@/lib/camps'

// Public machine-readable camps endpoint. Source of truth is the shared
// Supabase `camps` table managed via weeks-hub. Live DDM capacity is
// fetched on-demand and merged in for camps with a ddm_id.
//
// Response shape preserved for backwards compatibility with weeks-hub's
// existing /api/sync-camps consumer.

interface CampTermPayload {
  id: string
  title: string
  campType: 'weekend' | 'oneday' | null
  program: string | null
  startDate: string
  endDate: string
  location: string | null
  locationDetail: string | null
  capacity: number
  spotsLeft: number | null
  enrolledCount: number | null
  status: CampRow['status']
  registrationUrl: string | null
  price: number | null
  ddmId: string | null
}

function toPayload(row: CampRow, live?: { spotsLeft: number; maxCapacity: number }): CampTermPayload {
  if (live) {
    const enrolled = Math.max(0, live.maxCapacity - live.spotsLeft)
    return {
      id: row.web_source_id || row.id,
      title: row.title,
      campType: row.camp_type,
      program: row.program,
      startDate: row.start_date,
      endDate: row.end_date,
      location: row.location,
      locationDetail: row.location_detail,
      capacity: live.maxCapacity,
      spotsLeft: live.spotsLeft,
      enrolledCount: enrolled,
      status: live.spotsLeft <= 0 ? 'full' : row.status,
      registrationUrl: row.registration_url,
      price: row.price,
      ddmId: row.ddm_id,
    }
  }
  return {
    id: row.web_source_id || row.id,
    title: row.title,
    campType: row.camp_type,
    program: row.program,
    startDate: row.start_date,
    endDate: row.end_date,
    location: row.location,
    locationDetail: row.location_detail,
    capacity: row.capacity,
    spotsLeft: row.ddm_id ? null : row.capacity - row.enrolled_count,
    enrolledCount: row.ddm_id ? null : row.enrolled_count,
    status: row.status,
    registrationUrl: row.registration_url,
    price: row.price,
    ddmId: row.ddm_id,
  }
}

export async function GET() {
  const rows = await fetchCampsRaw()

  // Enrich with live DDM capacity where ddm_id is set
  const ddmIds = Array.from(new Set(rows.filter(r => r.ddm_id).map(r => r.ddm_id!)))
  const capacityData: Record<string, { spotsLeft: number; maxCapacity: number }> = {}

  await Promise.all(
    ddmIds.map(async (ddmId) => {
      const data = await scrapeDDMCapacity(ddmId)
      if (data) capacityData[ddmId] = data
    })
  )

  const camps = rows.map(row =>
    toPayload(row, row.ddm_id ? capacityData[row.ddm_id] : undefined)
  )

  return NextResponse.json(
    { camps, timestamp: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
