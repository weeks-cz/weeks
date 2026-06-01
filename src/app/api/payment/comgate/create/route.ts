import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { createPayment } from '@/lib/comgate'
import { getTrustedPriceKc } from '@/lib/payment-pricing'
import { API_ERRORS } from '@/lib/api-messages'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { reportError } from '@/lib/observability'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Abuse guard: max 15 payment-init attempts per IP per 10 min. Fail-open.
    const ip = clientIp(request)
    const limited = await rateLimit(`pay:${ip}`, 15, 600)
    if (!limited.ok) {
      return NextResponse.json({ error: API_ERRORS.rateLimited }, { status: 429 })
    }

    const { registrationId } = await request.json()
    if (!registrationId) {
      return NextResponse.json({ error: API_ERRORS.invalidRequest }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data: reg, error } = await supabase
      .from('registrations')
      .select('id, location_id, program, parent_email, child_name')
      .eq('id', registrationId)
      .single()

    if (error || !reg) {
      return NextResponse.json({ error: API_ERRORS.notFound }, { status: 404 })
    }

    const priceKc = getTrustedPriceKc(reg.location_id as string, reg.program as string)

    const origin = request.nextUrl.origin
    const { transId, redirect } = await createPayment({
      registrationId: reg.id as string,
      priceKc,
      label: `Weeks tábor – ${reg.child_name ?? 'registrace'}`,
      email: (reg.parent_email as string) ?? '',
      returnBaseUrl: origin,
    })

    // Diagnostic: is the service-role key reaching the function? (boolean only — no secret leak)
    console.log('[comgate/create] hasServiceRole:', !!process.env.SUPABASE_SERVICE_ROLE_KEY, 'transId:', transId)

    // Persist the transId — and VERIFY it actually wrote a row. A silent 0-row update
    // (e.g. RLS blocking because the anon key is in use) must NOT proceed: that would
    // mean the customer pays but we can never match the callback. Fail loudly instead.
    const { data: updated, error: updateError } = await supabase
      .from('registrations')
      .update({ comgate_payment_id: transId, comgate_status: 'pending', payment_status: 'pending' })
      .eq('id', reg.id)
      .select('id')

    if (updateError || !updated || updated.length === 0) {
      reportError(updateError ?? new Error('transId persisted 0 rows'), {
        route: 'comgate/create',
        reason: 'persist-transId',
        updatedCount: updated?.length ?? 0,
        registrationId: reg.id,
        transId,
      })
      return NextResponse.json({ error: API_ERRORS.paymentInitFailed }, { status: 500 })
    }

    return NextResponse.json({ redirectUrl: redirect })
  } catch (e) {
    reportError(e, { route: 'comgate/create', reason: 'unhandled' })
    return NextResponse.json({ error: API_ERRORS.gatewayUnavailable }, { status: 502 })
  }
}
