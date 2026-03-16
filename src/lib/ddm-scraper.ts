// DDM camp IDs and term metadata
export const DDM_TERMS: Record<string, { termNumber: number; dates: string; location: string }> = {
  '736': { termNumber: 3, dates: '28.–29. března', location: 'DDM Praha 6 – Bílá hora' },
}

export const KNOWN_DDM_IDS = Object.keys(DDM_TERMS)

export interface DDMCapacity {
  spotsLeft: number
  maxCapacity: number
}

export async function scrapeDDMCapacity(ddmId: string): Promise<DDMCapacity | null> {
  try {
    const url = `https://www.ddmp6.cz/tabory/?id=${ddmId}`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WeeksCZ/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'cs,en;q=0.5',
      },
      signal: AbortSignal.timeout(10000),
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
