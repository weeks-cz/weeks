import { NextResponse } from 'next/server'
import { scrapeDDMCapacity, KNOWN_DDM_IDS } from '@/lib/ddm-scraper'

// In-memory cache: { [ddmId]: { spotsLeft, maxCapacity, fetchedAt } }
const cache = new Map<string, { spotsLeft: number; maxCapacity: number; fetchedAt: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idsParam = searchParams.get('ids')

  // Determine which IDs to fetch
  const ids = idsParam
    ? idsParam.split(',').filter(id => KNOWN_DDM_IDS.includes(id.trim()))
    : KNOWN_DDM_IDS

  if (ids.length === 0) {
    return NextResponse.json({ error: 'No valid DDM IDs provided' }, { status: 400 })
  }

  const now = Date.now()
  const results: Record<string, { spotsLeft: number; maxCapacity: number; cached: boolean }> = {}

  // Fetch all IDs in parallel
  await Promise.all(
    ids.map(async (id) => {
      const trimmedId = id.trim()

      // Check cache
      const cached = cache.get(trimmedId)
      if (cached && (now - cached.fetchedAt) < CACHE_TTL_MS) {
        results[trimmedId] = {
          spotsLeft: cached.spotsLeft,
          maxCapacity: cached.maxCapacity,
          cached: true,
        }
        return
      }

      // Scrape fresh data
      const data = await scrapeDDMCapacity(trimmedId)
      if (data) {
        cache.set(trimmedId, { ...data, fetchedAt: now })
        results[trimmedId] = { ...data, cached: false }
      } else if (cached) {
        // Use stale cache if scraping fails
        results[trimmedId] = {
          spotsLeft: cached.spotsLeft,
          maxCapacity: cached.maxCapacity,
          cached: true,
        }
      }
    })
  )

  return NextResponse.json(
    { data: results, timestamp: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  )
}
