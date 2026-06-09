import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

// DOČASNÝ diagnostický endpoint — ověří, proč Sentry nepřijímá eventy. Po vyřešení smazat.
export const dynamic = 'force-dynamic'

const TEST_KEY = 'wk-sentry-check-7f3a9c21'

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('key') !== TEST_KEY) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const diag = {
    hasDsn: !!process.env.SENTRY_DSN,
    dsnHost: process.env.SENTRY_DSN ? (process.env.SENTRY_DSN.split('@')[1]?.split('/')[0] ?? '?') : null,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    sentryClientInitialized: !!Sentry.getClient(),
  }

  // Pošli event A POČKEJ na odeslání (flush) — v serverless se jinak funkce ukončí
  // dřív, než se event stihne poslat po síti.
  Sentry.captureMessage('Sentry connectivity test — deliberate, please ignore', 'error')
  let flushed: boolean | string = false
  try {
    flushed = await Sentry.flush(3000)
  } catch (e) {
    flushed = `flush error: ${e instanceof Error ? e.message : String(e)}`
  }

  return NextResponse.json({ ...diag, flushed })
}
