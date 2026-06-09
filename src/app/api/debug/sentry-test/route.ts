import { NextRequest, NextResponse } from 'next/server'
import { reportMessage } from '@/lib/observability'

// DOČASNÝ endpoint — pouze pro ověření, že Sentry přijímá eventy. Po ověření smazat.
// Gated jednorázovým klíčem, ať ho netriggeruje kdokoli. Neposílá žádná data, jen
// jednu testovací zprávu do Sentry.
export const dynamic = 'force-dynamic'

const TEST_KEY = 'wk-sentry-check-7f3a9c21'

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('key') !== TEST_KEY) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  reportMessage('Sentry connectivity test — deliberate, please ignore', {
    route: 'debug/sentry-test',
  })
  return NextResponse.json({ ok: true, note: 'Sent a test event — check Sentry → Issues.' })
}
