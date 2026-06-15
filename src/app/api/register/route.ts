import { NextRequest, NextResponse } from 'next/server'
import { registrationSchema } from '@/lib/registration'
import { createServerClient } from '@/lib/supabase'
import { getTrustedCapacity, getTrustedPriceKc } from '@/lib/payment-pricing'
import { API_ERRORS } from '@/lib/api-messages'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { reportError, reportMessage } from '@/lib/observability'
import { buildRegistrationReceivedEmail, sendEmail, isEmailConfigured } from '@/lib/email'
import { getLocationById } from '@/lib/locations'
import { formatTermLabel } from '@/lib/dates'

const SITE_URL = 'https://weeks.cz'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Abuse guard: max 10 registration attempts per IP per 10 min. Fail-open.
    const ip = clientIp(request)
    const limited = await rateLimit(`register:${ip}`, 10, 600)
    if (!limited.ok) {
      return NextResponse.json({ error: API_ERRORS.rateLimited }, { status: 429 })
    }

    const body = await request.json()
    const parsed = registrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: API_ERRORS.validation, details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Capacity AND price are resolved server-side from trusted config — never from
    // the client. The client-supplied payment_amount is ignored (anti-tampering):
    // the stored amount, the Comgate charge, and the Fakturoid invoice must all agree.
    let maxCapacity: number
    let trustedPrice: number
    try {
      maxCapacity = getTrustedCapacity(parsed.data.location_id, parsed.data.program)
      trustedPrice = getTrustedPriceKc(parsed.data.location_id, parsed.data.program)
    } catch (e) {
      // Only non-PII identifiers in the monitoring context — never the parent/child data.
      reportError(e, {
        route: 'register',
        reason: 'capacity-lookup',
        location_id: parsed.data.location_id,
        program: parsed.data.program,
        term_id: parsed.data.term_id,
      })
      return NextResponse.json({ error: API_ERRORS.invalidRequest }, { status: 400 })
    }

    const supabase = createServerClient()

    // Atomic, race-safe insert: the DB function takes a per-term advisory lock,
    // re-counts active registrations, and inserts only if there is room.
    const { data: newId, error } = await supabase.rpc('create_registration', {
      payload: { ...parsed.data, payment_amount: trustedPrice, vop_accepted_ip: ip },
      max_capacity: maxCapacity,
    })

    if (error) {
      // The function raises 'CAPACITY_FULL' when the term is sold out.
      if (typeof error.message === 'string' && error.message.includes('CAPACITY_FULL')) {
        return NextResponse.json({ error: API_ERRORS.capacityFull }, { status: 409 })
      }
      reportError(error, { route: 'register', reason: 'rpc-insert' })
      return NextResponse.json({ error: API_ERRORS.registrationFailed }, { status: 500 })
    }

    // Instant "registration received — please pay" email. Best-effort: a failure
    // here must NOT fail the registration (the row is already safely inserted),
    // so it's caught and only reported.
    if (isEmailConfigured()) {
      try {
        const d = parsed.data
        const location = getLocationById(d.location_id)
        const programCfg = location.programs.find((p) => p.id === d.program)
        const { subject, html } = buildRegistrationReceivedEmail({
          childName: d.child_name,
          programName: programCfg?.name ?? d.program,
          termLabel: formatTermLabel(d.term_start, d.term_end),
          locationName: location.name,
          priceKc: trustedPrice,
          paymentUrl: `${SITE_URL}/platba/${newId}?location=${d.location_id}`,
        })
        await sendEmail({ to: d.parent_email, subject, html })
      } catch (e) {
        reportMessage('Registration-received email failed', {
          registrationId: newId,
          error: e instanceof Error ? e.message : String(e),
        })
      }
    }

    return NextResponse.json({
      registrationId: newId,
      paymentUrl: `/platba/${newId}`,
    })
  } catch (e) {
    reportError(e, { route: 'register', reason: 'unhandled' })
    return NextResponse.json({ error: API_ERRORS.invalidRequest }, { status: 400 })
  }
}
