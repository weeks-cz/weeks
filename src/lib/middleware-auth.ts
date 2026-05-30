// Path classification for the KV pre-launch basic auth. Public carve-outs win
// over protected prefixes (e.g. /karlovy-vary/gdpr is public even though
// /karlovy-vary is protected).

const PROTECTED_PREFIXES = [
  '/karlovy-vary',
  '/registrace',
  '/platba',
  '/api/register',
  '/api/payment',
  '/api/registration',
]

// Reachable without basic auth: legal pages (mandatory for Comgate) and the
// Comgate callback (called server-to-server by Comgate, which has no auth header).
const PUBLIC_PATHS = [
  '/karlovy-vary/gdpr',
  '/karlovy-vary/podminky',
  '/api/payment/comgate/callback',
]

function matches(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + '/')
}

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => matches(pathname, p))
}

export function isProtectedPath(pathname: string): boolean {
  if (isPublicPath(pathname)) return false
  return PROTECTED_PREFIXES.some((p) => matches(pathname, p))
}
