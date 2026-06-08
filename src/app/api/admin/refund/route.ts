import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { createServerClient } from '@/lib/supabase'
import { refundPayment } from '@/lib/comgate'
import { reportError } from '@/lib/observability'

export const dynamic = 'force-dynamic'

// Token-gated refund. NOT a public endpoint: the operator computes the refund
// amount per the VOP storno table (see docs runbook) and calls this with a
// Bearer token. There is no admin UI yet — this is the minimal safe mechanism.
//
//   curl -X POST https://weeks.cz/api/admin/refund \
//     -H "Authorization: Bearer $ADMIN_API_TOKEN" \
//     -H "Content-Type: application/json" \
//     -d '{"registrationId":"<uuid>","amountKc":1495}'
//
// Omitting amountKc refunds the full paid amount.

function tokenValid(header: string | null): boolean {
  const token = process.env.ADMIN_API_TOKEN
  if (!token) return false // no token configured → endpoint is closed
  if (!header?.startsWith('Bearer ')) return false
  const provided = header.slice(7)
  const a = Buffer.from(provided)
  const b = Buffer.from(token)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  if (!tokenValid(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { registrationId, amountKc } = await request.json()
    if (!registrationId) {
      return NextResponse.json({ error: 'Missing registrationId' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data: reg, error } = await supabase
      .from('registrations')
      .select('id, comgate_payment_id, payment_status, payment_amount')
      .eq('id', registrationId)
      .single()

    if (error || !reg) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }
    if (!reg.comgate_payment_id) {
      return NextResponse.json({ error: 'Registration has no Comgate transaction' }, { status: 400 })
    }
    // Idempotency: don't double-refund.
    if (reg.payment_status === 'refunded') {
      return NextResponse.json({ ok: true, alreadyRefunded: true })
    }
    if (reg.payment_status !== 'completed') {
      return NextResponse.json(
        { error: `Cannot refund a registration with payment_status='${reg.payment_status}'` },
        { status: 409 }
      )
    }

    // Default to a full refund of the recorded paid amount.
    const refundKc =
      typeof amountKc === 'number' && amountKc > 0
        ? amountKc
        : (reg.payment_amount as number)

    if (!refundKc || refundKc <= 0) {
      return NextResponse.json({ error: 'No valid refund amount' }, { status: 400 })
    }
    // Never refund more than was actually paid.
    if (refundKc > (reg.payment_amount as number)) {
      return NextResponse.json(
        { error: `Refund ${refundKc} Kč exceeds paid amount ${reg.payment_amount} Kč` },
        { status: 400 }
      )
    }

    await refundPayment(reg.comgate_payment_id as string, refundKc)

    // The money is already back at Comgate. Persist the state with a few retries to
    // minimise the orphaned window (refunded at Comgate but DB still 'completed').
    // A second refund attempt on retry is harmless: Comgate rejects an already-
    // refunded transaction, and the payment_status='refunded' guard above short-circuits.
    let updateError: unknown = null
    for (let attempt = 0; attempt < 3; attempt++) {
      const { error: e } = await supabase
        .from('registrations')
        .update({ payment_status: 'refunded', status: 'cancelled' })
        .eq('id', reg.id)
      updateError = e
      if (!e) break
      await new Promise((r) => setTimeout(r, 300))
    }

    if (updateError) {
      // Refund went through at Comgate but our record didn't flip — must be
      // reconciled manually. Surface loudly.
      reportError(updateError, {
        route: 'admin/refund',
        reason: 'refunded-at-comgate-but-db-update-failed',
        registrationId: reg.id,
        refundKc,
      })
      return NextResponse.json(
        { error: 'Refunded at Comgate but failed to update record — reconcile manually' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, registrationId: reg.id, refundedKc: refundKc })
  } catch (e) {
    reportError(e, { route: 'admin/refund', reason: 'unhandled' })
    return NextResponse.json({ error: 'Refund failed' }, { status: 500 })
  }
}
