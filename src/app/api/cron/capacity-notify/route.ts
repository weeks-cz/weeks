import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { scrapeDDMCapacity, KNOWN_DDM_IDS, DDM_TERMS } from '@/lib/ddm-scraper'
import type { DDMCapacity } from '@/lib/ddm-scraper'
import { reportError, reportMessage } from '@/lib/observability'

const REDIS_KEY = 'capacity-state'

type CapacityState = Record<string, DDMCapacity>

function getRedis() {
  // Vercel's Upstash Marketplace integration injects KV_REST_API_* names; accept
  // both so it works regardless of which naming the env uses.
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

async function sendDiscordNotification(embeds: object[]) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL not configured')
    return
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds }),
  })

  if (!res.ok) {
    console.error(`Discord webhook failed: ${res.status} ${await res.text()}`)
  }
}

function buildEmbed(
  ddmId: string,
  prev: DDMCapacity,
  curr: DDMCapacity
): object {
  const term = DDM_TERMS[ddmId]
  const spotsDecreased = curr.spotsLeft < prev.spotsLeft
  const diff = Math.abs(prev.spotsLeft - curr.spotsLeft)

  const color = spotsDecreased ? 0x22c55e : 0xef4444 // green / red
  const emoji = spotsDecreased ? '🟢' : '🔴'
  const title = spotsDecreased
    ? `${emoji} Nová přihláška!${diff > 1 ? ` (${diff}x)` : ''}`
    : `${emoji} Odhlášení${diff > 1 ? ` (${diff}x)` : ''}`

  return {
    title,
    description: [
      `**Termín ${term.termNumber}** (${term.dates}) — ${term.location}`,
      `Volná místa: **${prev.spotsLeft}/${prev.maxCapacity}** → **${curr.spotsLeft}/${curr.maxCapacity}**`,
    ].join('\n'),
    color,
    timestamp: new Date().toISOString(),
  }
}

export async function GET(request: Request) {
  // Verify authorization
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  // Fail closed: a missing CRON_SECRET must NOT open the endpoint to the public.
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // A missing Redis/scrape is an environment/external condition, not a code bug:
  // surface it to Sentry (so it's not silently lost like before) but ACK with 200
  // so the daily cron doesn't show a perpetual hard failure. Unexpected exceptions
  // fall through to the catch below and are reported as errors with a 500.
  try {
    const redis = getRedis()
    if (!redis) {
      reportMessage('Capacity-notify skipped: UPSTASH_REDIS not configured', {
        route: 'cron/capacity-notify',
      })
      return NextResponse.json({ ok: false, skipped: 'redis-not-configured' })
    }

    // Scrape current capacity for all terms
    const current: CapacityState = {}
    await Promise.all(
      KNOWN_DDM_IDS.map(async (id) => {
        const data = await scrapeDDMCapacity(id)
        if (data) current[id] = data
      })
    )

    if (Object.keys(current).length === 0) {
      reportMessage('Capacity-notify skipped: scraped 0 DDM terms', {
        route: 'cron/capacity-notify',
        knownIds: KNOWN_DDM_IDS.length,
      })
      return NextResponse.json({ ok: false, skipped: 'no-data-scraped' })
    }

    // Load previous state from Redis
    const previous = await redis.get<CapacityState>(REDIS_KEY)

    // Compare and build notifications
    const embeds: object[] = []

    if (previous) {
      for (const id of KNOWN_DDM_IDS) {
        const prev = previous[id]
        const curr = current[id]
        if (!prev || !curr) continue

        if (prev.spotsLeft !== curr.spotsLeft) {
          embeds.push(buildEmbed(id, prev, curr))
        }
      }
    }

    // Send Discord notification if there are changes
    if (embeds.length > 0) {
      await sendDiscordNotification(embeds)
    }

    // Save current state to Redis
    await redis.set(REDIS_KEY, current)

    return NextResponse.json({
      ok: true,
      checked: Object.keys(current).length,
      changes: embeds.length,
      timestamp: new Date().toISOString(),
    })
  } catch (e) {
    // Previously an uncaught throw here produced a bare 500 that never reached
    // Sentry (this route had no reportError) — the reason the daily failure was
    // invisible. Now it's reported.
    reportError(e, { route: 'cron/capacity-notify', reason: 'unhandled' })
    return NextResponse.json({ error: 'Capacity check failed' }, { status: 500 })
  }
}
