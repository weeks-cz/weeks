import { NextResponse } from 'next/server'

// Lehká geolokace z Vercel hlaviček (zdarma, bez externí služby).
// NEUKLÁDÁ IP — jen z hlaviček odvodí, zda je návštěvník z Karlovarského kraje,
// aby KV nudge oslovil zájemce o Karlovy Vary na pražském webu.
export const dynamic = 'force-dynamic'

// Města Karlovarského kraje (normalizovaně: lowercase, bez diakritiky).
const KV_REGION_CITIES = new Set([
  'karlovy vary', 'sokolov', 'cheb', 'ostrov', 'chodov', 'marianske lazne',
  'as', 'frantiskovy lazne', 'nejdek', 'kraslice', 'horni slavkov', 'nova role',
  'stara role', 'sedlec', 'touzim', 'zlutice', 'bochov', 'habartov',
  'kynsperk nad ohri', 'lomnice', 'olovi', 'rotava', 'dolni rychnov',
])

// Kódy kraje napříč zdroji (Vercel/MaxMind se historicky liší: ISO vs. numerické).
const KV_REGION_CODES = new Set(['ka', 'cz-ka', '41', '122'])

function normalize(s: string): string {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

export async function GET(request: Request) {
  const h = request.headers
  const country = (h.get('x-vercel-ip-country') || '').toUpperCase()
  const region = h.get('x-vercel-ip-country-region') || ''
  const city = safeDecode(h.get('x-vercel-ip-city') || '')

  const isKarlovarsko =
    country === 'CZ' &&
    (KV_REGION_CITIES.has(normalize(city)) || KV_REGION_CODES.has(normalize(region)))

  // region/city vrácené i raw — ať po nasazení ověřím přesný kód kraje na reálném návštěvníkovi.
  return NextResponse.json(
    { country, region, city, isKarlovarsko },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
