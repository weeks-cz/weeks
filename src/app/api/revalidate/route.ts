import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Revalidates the camp pages (/tabory and everything under it).
// Called by weeks-hub when camp data changes.
// The route used to also invalidate a `camps` cache tag, but the tag belonged
// to the deleted src/lib/camps.ts and the camps table it read — nothing tags
// a fetch with it any more, so the call did nothing.
// Protected by REVALIDATE_SECRET — without it the route is a no-op so it can
// be safely deployed before the secret is configured.

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET
  const provided = request.nextUrl.searchParams.get('secret') ||
    request.headers.get('x-revalidate-secret') || ''

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'REVALIDATE_SECRET not configured' },
      { status: 503 }
    )
  }
  if (provided !== expected) {
    return NextResponse.json({ ok: false, error: 'invalid secret' }, { status: 401 })
  }

  // Jednodenní a víkendové tábory dřív měly vlastní stránky; teď žijí pod
  // /tabory, /tabory/[tema] i /tabory/termin/[slug] — 'layout' strhne všechny.
  revalidatePath('/tabory', 'layout')

  return NextResponse.json({ ok: true, revalidated: ['/tabory'], at: new Date().toISOString() })
}

// Allow GET for quick manual testing / health check (still requires secret)
export async function GET(request: NextRequest) {
  return POST(request)
}
