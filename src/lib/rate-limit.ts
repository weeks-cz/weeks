import 'server-only'
import { Redis } from '@upstash/redis'

// Lightweight fixed-window rate limiter backed by Upstash Redis (already used by
// the capacity cron). Protects abuse-prone POST endpoints (registration, payment
// init) from spam without adding a new dependency.

function getRedis(): Redis | null {
  // Vercel's Upstash Marketplace integration injects KV_REST_API_* names; accept
  // both so it works regardless of which naming the env uses.
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

export interface RateLimitResult {
  ok: boolean
  remaining: number
}

/**
 * Allow at most `limit` requests per `windowSec` for a given `key`.
 *
 * Fail-open by design: if Redis is unconfigured or unreachable we return ok=true.
 * Blocking a paying parent because our rate-limit store hiccuped would be worse
 * than letting an occasional extra request through. The miss is logged so it's
 * visible in monitoring.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  const redis = getRedis()
  if (!redis) return { ok: true, remaining: limit }
  try {
    const redisKey = `rl:${key}`
    const count = await redis.incr(redisKey)
    if (count === 1) {
      await redis.expire(redisKey, windowSec)
    }
    return { ok: count <= limit, remaining: Math.max(0, limit - count) }
  } catch (e) {
    console.error('[rate-limit] Redis error — failing open:', e)
    return { ok: true, remaining: limit }
  }
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(request: Request): string {
  const h = request.headers
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown'
  )
}
