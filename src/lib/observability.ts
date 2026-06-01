import 'server-only'
import * as Sentry from '@sentry/nextjs'

// Central server-side error reporter. Call sites use this instead of bare
// console.error so error forwarding (Sentry) lives in one place. Payment/money
// failures are the reason this exists — we want to know immediately, not by
// trawling Vercel logs after the fact.

export function reportError(error: unknown, context?: Record<string, unknown>) {
  console.error('[error]', context ?? {}, error)
  try {
    Sentry.captureException(error, context ? { extra: context } : undefined)
  } catch {
    // Never let error reporting throw and mask the original failure.
  }
}

/**
 * For expected, non-exception failure conditions worth alerting on (e.g. a
 * payment callback we couldn't reconcile). Sends a message-level event.
 */
export function reportMessage(
  message: string,
  context?: Record<string, unknown>
) {
  console.error('[alert]', message, context ?? {})
  try {
    Sentry.captureMessage(message, {
      level: 'error',
      extra: context,
    })
  } catch {
    // swallow
  }
}
