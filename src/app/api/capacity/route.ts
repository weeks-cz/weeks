import { NextResponse } from 'next/server'

// In-memory cache: { [ddmId]: { spotsLeft, maxCapacity, fetchedAt } }
const cache = new Map<string, { spotsLeft: number; maxCapacity: number; fetchedAt: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

// DDM camp IDs we know about
const KNOWN_DDM_IDS = ['734', '735', '736']

async function scrapeDDMCapacity(ddmId: string): Promise<{ spotsLeft: number; maxCapacity: number } | null> {
  try {
    const url = `https://www.ddmp6.cz/tabory/?id=${ddmId}`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WeeksCZ/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'cs,en;q=0.5',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    if (!response.ok) {
      console.error(`DDM fetch failed for id=${ddmId}: ${response.status}`)
      return null
    }

    const html = await response.text()

    // Parse "Počet volných míst: <span class="pull-right">14</span>"
    const spotsMatch = html.match(/Po(?:č|&#x10D;)et\s+voln(?:ý|&#xFD;)ch\s+m(?:í|&#xED;)st:\s*(?:<[^>]*>\s*)*(\d+)/i)
      || html.match(/voln.ch\s+m.st[^<]*<[^>]*>(\d+)/i)
    // Parse "Max. počet účastníků: <span class="pull-right">15</span>"
    const maxMatch = html.match(/Max\.\s*po(?:č|&#x10D;)et\s+(?:ú|&#xFA;)(?:č|&#x10D;)astn(?:í|&#xED;)k(?:ů|&#x16F;):\s*(?:<[^>]*>\s*)*(\d+)/i)
      || html.match(/Max\.\s*po.et\s+..astn.k.:\s*(?:<[^>]*>\s*)*(\d+)/i)

    if (!spotsMatch) {
      console.error(`Could not parse spots for DDM id=${ddmId}`)
      return null
    }

    return {
      spotsLeft: parseInt(spotsMatch[1], 10),
      maxCapacity: maxMatch ? parseInt(maxMatch[1], 10) : 15,
    }
  } catch (error) {
    console.error(`Error scraping DDM id=${ddmId}:`, error)
    return null
  }
}

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
