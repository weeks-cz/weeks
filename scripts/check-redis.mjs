// Verifies Upstash Redis connectivity using the same env fallback the app uses.
// Run: node --env-file=.env.local scripts/check-redis.mjs
import { Redis } from '@upstash/redis'

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
if (!url || !token) { console.error('FAIL: no Redis creds in env'); process.exit(1) }
console.log('Using URL:', url)

const r = new Redis({ url, token })
const key = 'weeks:healthcheck'
const val = 'ok-' + process.pid
await r.set(key, val, { ex: 60 })
const got = await r.get(key)
await r.del(key)
console.log(got === val ? `PASS: write/read round-trip OK (${got})` : `FAIL: got ${got}`)
process.exit(got === val ? 0 : 1)
