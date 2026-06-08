import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

// Stateless access token for a registration's confirmation page.
//
// Derived by HMAC-SHA256 from the server-only service-role key (always present
// wherever registrations work, never exposed to clients). This prevents IDOR:
// holding the registration UUID alone is NOT enough to read its PII via
// /api/registration/[id] — you also need this token, which only the server can
// compute. The token is appended to the Comgate return URLs server-side.

function hmacKey(): string {
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!k) throw new Error('SUPABASE_SERVICE_ROLE_KEY required to derive registration token')
  return k
}

export function registrationToken(id: string): string {
  return createHmac('sha256', hmacKey()).update(id).digest('hex').slice(0, 32)
}

export function verifyRegistrationToken(id: string, token: string | null | undefined): boolean {
  if (!token) return false
  let expected: string
  try {
    expected = registrationToken(id)
  } catch {
    return false
  }
  const a = Buffer.from(token)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
