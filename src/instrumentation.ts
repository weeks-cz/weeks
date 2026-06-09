import * as Sentry from '@sentry/nextjs'

// Server-side error monitoring. Deliberately scoped to the server/edge runtimes
// only — the money path (registration + Comgate payment APIs) runs there, and we
// keep Sentry out of the client bundle to avoid shipping it to every visitor.
//
// No-op unless SENTRY_DSN is set AND we're in production, so local dev and
// preview stay quiet.
//
// NOTE: this file MUST live in src/ (not the repo root) because the project uses a
// src/ directory — Next.js only picks up src/instrumentation.ts in that case.

const dsn = process.env.SENTRY_DSN
const enabled = !!dsn && process.env.NODE_ENV === 'production'

export async function register() {
  if (!enabled) return
  if (
    process.env.NEXT_RUNTIME === 'nodejs' ||
    process.env.NEXT_RUNTIME === 'edge'
  ) {
    Sentry.init({
      dsn,
      enabled,
      tracesSampleRate: 0, // errors only — no performance tracing
      environment: process.env.VERCEL_ENV || 'production',
    })
  }
}

export const onRequestError = Sentry.captureRequestError
