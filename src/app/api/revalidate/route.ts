import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

// Invalidates the `camps` cache tag and revalidates all camp pages.
// Called by weeks-hub after create/update/delete on the camps table.
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

  revalidateTag('camps', 'default')
  revalidatePath('/tabor-3d-tisk', 'page')
  revalidatePath('/tabor-iot', 'page')
  revalidatePath('/tabor-chytrych-technologii', 'page')

  return NextResponse.json({ ok: true, revalidated: ['camps'], at: new Date().toISOString() })
}

// Allow GET for quick manual testing / health check (still requires secret)
export async function GET(request: NextRequest) {
  return POST(request)
}
