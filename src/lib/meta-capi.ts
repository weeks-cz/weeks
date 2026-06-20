import 'server-only'
import { createHash } from 'node:crypto'
import { reportMessage } from '@/lib/observability'

/**
 * Meta Conversions API (server-side events).
 *
 * Why this exists: the browser Pixel only fires when the visitor accepts cookies
 * AND lands back on our page in a tracked browser. iOS / ad-blockers / consent
 * declines are invisible to it — and a starved signal means Meta's optimiser
 * never learns who actually buys. The Comgate callback is server-to-server and
 * always runs, so a Purchase sent from there reaches Meta regardless of cookies.
 *
 * Deduplication: every server event carries an `eventId`. The matching browser
 * event sends the same id via fbq(..., { eventID }). Meta collapses the pair, so
 * a conversion is counted once whether one or both arrive.
 *
 * Best-effort: a failure here is reported but NEVER thrown — it must not break a
 * payment callback or a registration insert.
 */

const GRAPH_VERSION = 'v21.0'

function pixelId(): string | undefined {
  return process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim()
}

function accessToken(): string | undefined {
  return process.env.META_CAPI_ACCESS_TOKEN?.trim()
}

export function isMetaCapiConfigured(): boolean {
  return Boolean(pixelId() && accessToken())
}

// ── PII normalisation + hashing (per Meta's matching spec) ───────────────────
// All identifiers are lower-cased + trimmed, then SHA-256 hex. fbp/fbc, IP and
// user-agent are the exception: they are matched raw, never hashed.

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

/** Email matching norm: trim + lowercase. Exported for tests. */
export function normalizeEmail(email?: string): string | undefined {
  const norm = email?.trim().toLowerCase()
  return norm || undefined
}

/** Phone matching norm: digits only, CZ 9-digit numbers get a 420 prefix. Exported for tests. */
export function normalizePhone(phone?: string): string | undefined {
  if (!phone) return undefined
  let digits = phone.replace(/\D/g, '')
  if (digits.length === 9) digits = `420${digits}`
  return digits || undefined
}

function hashEmail(email?: string): string | undefined {
  const norm = normalizeEmail(email)
  return norm ? sha256(norm) : undefined
}

function hashPhone(phone?: string): string | undefined {
  const norm = normalizePhone(phone)
  return norm ? sha256(norm) : undefined
}

function hashName(name?: string): string | undefined {
  const norm = name?.trim().toLowerCase()
  return norm ? sha256(norm) : undefined
}

/** "Jan Novák" → { fn: hash(jan), ln: hash(novák) }. Single token → fn only. */
function splitName(fullName?: string): { fn?: string; ln?: string } {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? []
  if (parts.length === 0) return {}
  if (parts.length === 1) return { fn: hashName(parts[0]) }
  return { fn: hashName(parts[0]), ln: hashName(parts.slice(1).join(' ')) }
}

/** Pull a Czech ZIP (e.g. "360 01" or "36001") out of a free-form address. */
function hashZipFromAddress(address?: string): string | undefined {
  if (!address) return undefined
  const m = address.match(/\b(\d{3})\s?(\d{2})\b/)
  return m ? sha256(`${m[1]}${m[2]}`) : undefined
}

export interface MetaUserData {
  email?: string
  phone?: string
  fullName?: string
  address?: string
  /** _fbp cookie value — raw, not hashed. */
  fbp?: string
  /** _fbc cookie value (or built from fbclid) — raw, not hashed. */
  fbc?: string
  clientIp?: string
  userAgent?: string
}

function buildUserData(u: MetaUserData): Record<string, string> {
  const { fn, ln } = splitName(u.fullName)
  const out: Record<string, string> = {}
  const em = hashEmail(u.email)
  const ph = hashPhone(u.phone)
  const zp = hashZipFromAddress(u.address)
  if (em) out.em = em
  if (ph) out.ph = ph
  if (fn) out.fn = fn
  if (ln) out.ln = ln
  if (zp) out.zp = zp
  // Country is constant for our audience; hashed 2-letter code per spec.
  out.country = sha256('cz')
  if (u.fbp) out.fbp = u.fbp
  if (u.fbc) out.fbc = u.fbc
  if (u.clientIp) out.client_ip_address = u.clientIp
  if (u.userAgent) out.client_user_agent = u.userAgent
  return out
}

export interface MetaEventInput {
  eventName: 'Purchase' | 'InitiateCheckout' | 'Lead'
  /** Shared with the browser event for deduplication (use the registration id). */
  eventId: string
  userData: MetaUserData
  customData?: {
    value?: number
    currency?: string
    contentName?: string
  }
  eventSourceUrl?: string
}

/**
 * Send one server-side event to Meta. Resolves to true on a 2xx ack, false on
 * any failure or when CAPI isn't configured. Never throws.
 */
export async function sendMetaEvent(input: MetaEventInput): Promise<boolean> {
  const id = pixelId()
  const token = accessToken()
  if (!id || !token) return false // CAPI not configured — silently no-op

  const custom: Record<string, unknown> = {}
  if (input.customData?.value != null) custom.value = input.customData.value
  if (input.customData?.currency) custom.currency = input.customData.currency
  if (input.customData?.contentName) custom.content_name = input.customData.contentName

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: 'website',
        ...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
        user_data: buildUserData(input.userData),
        ...(Object.keys(custom).length ? { custom_data: custom } : {}),
      },
    ],
  }
  const testCode = process.env.META_TEST_EVENT_CODE?.trim()
  if (testCode) payload.test_event_code = testCode

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${id}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        // Never let a slow Graph API hang a payment callback.
        signal: AbortSignal.timeout(3000),
      }
    )
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      reportMessage('Meta CAPI event rejected', {
        eventName: input.eventName,
        eventId: input.eventId,
        httpStatus: res.status,
        // PII is hashed in the body; the response detail is safe to log.
        detail: detail.slice(0, 500),
      })
      return false
    }
    return true
  } catch (e) {
    reportMessage('Meta CAPI event failed to send', {
      eventName: input.eventName,
      eventId: input.eventId,
      error: e instanceof Error ? e.message : String(e),
    })
    return false
  }
}
