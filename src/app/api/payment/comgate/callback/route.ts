import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@/lib/supabase'
import { getComgateConfig, getStatus, verifyCallbackIdentity } from '@/lib/comgate'
import { reportError, reportMessage } from '@/lib/observability'
import { issuePaidInvoice, isFakturoidConfigured } from '@/lib/fakturoid'
import { buildConfirmationEmail, sendEmail, isEmailConfigured } from '@/lib/email'
import { getLocationById } from '@/lib/locations'
import { formatTermLabel } from '@/lib/dates'
import { sendMetaEvent, isMetaCapiConfigured } from '@/lib/meta-capi'

export const dynamic = 'force-dynamic'

/**
 * Generate the Fakturoid daňový doklad for a settled registration — exactly once.
 *
 * Idempotency: atomically claim by flipping fakturoid_invoice_id NULL → 'pending'
 * (only one concurrent callback wins). If the claim returns no row, another call
 * already handled it. On API failure we release the claim so a later callback can
 * retry. Invoice failure is alerted but does NOT fail the Comgate acknowledgement
 * (the payment is already recorded; the doc can be regenerated).
 */
async function ensurePaidInvoice(supabase: SupabaseClient, registrationId: string) {
  if (!isFakturoidConfigured()) return

  const { data: claimed } = await supabase
    .from('registrations')
    .update({ fakturoid_invoice_id: 'pending' })
    .eq('id', registrationId)
    .is('fakturoid_invoice_id', null)
    .select('id, parent_name, parent_email, parent_address, program, location_id, term_start, term_end, payment_amount')

  if (!claimed || claimed.length === 0) return // already issued or in progress
  const reg = claimed[0]

  try {
    const location = getLocationById(reg.location_id as string)
    const programCfg = location.programs.find((p) => p.id === reg.program)
    const invoiceId = await issuePaidInvoice({
      parentName: reg.parent_name as string,
      parentEmail: reg.parent_email as string,
      parentAddress: reg.parent_address as string,
      registrationId: reg.id as string,
      programName: programCfg?.name ?? (reg.program as string),
      termLabel: formatTermLabel(reg.term_start as string, reg.term_end as string),
      priceKc: reg.payment_amount as number,
      // Fakturoid email is a paid-plan feature; only send for real (live) payments.
      sendEmail: process.env.COMGATE_TEST === 'false',
    })
    await supabase
      .from('registrations')
      .update({ fakturoid_invoice_id: invoiceId })
      .eq('id', registrationId)
  } catch (e) {
    // Release the claim so the next callback/retry re-attempts.
    await supabase
      .from('registrations')
      .update({ fakturoid_invoice_id: null })
      .eq('id', registrationId)
    reportMessage('Fakturoid invoice generation failed', {
      registrationId,
      error: e instanceof Error ? e.message : String(e),
    })
  }
}

/**
 * Send the post-payment confirmation email — exactly once. Same atomic-claim
 * idempotency as the invoice: flip confirmation_sent_at NULL → now() (one
 * callback wins), release on send failure so a retry can re-send.
 */
async function ensureConfirmationEmail(supabase: SupabaseClient, registrationId: string) {
  if (!isEmailConfigured()) return

  const { data: claimed } = await supabase
    .from('registrations')
    .update({ confirmation_sent_at: new Date().toISOString() })
    .eq('id', registrationId)
    .is('confirmation_sent_at', null)
    .select('id, parent_email, child_name, program, location_id, term_start, term_end, payment_amount')

  if (!claimed || claimed.length === 0) return
  const reg = claimed[0]

  try {
    const location = getLocationById(reg.location_id as string)
    const programCfg = location.programs.find((p) => p.id === reg.program)
    const { subject, html } = buildConfirmationEmail({
      childName: reg.child_name as string,
      programName: programCfg?.name ?? (reg.program as string),
      termLabel: formatTermLabel(reg.term_start as string, reg.term_end as string),
      locationName: location.name,
      priceKc: reg.payment_amount as number,
    })
    await sendEmail({ to: reg.parent_email as string, subject, html })
  } catch (e) {
    await supabase
      .from('registrations')
      .update({ confirmation_sent_at: null })
      .eq('id', registrationId)
    reportMessage('Confirmation email failed', {
      registrationId,
      error: e instanceof Error ? e.message : String(e),
    })
  }
}

/**
 * Send the server-side Meta "Purchase" conversion — the keystone signal the
 * browser Pixel misses for cookie-declining / iOS visitors. event_id is the
 * registration id, shared with the browser Purchase event for deduplication.
 *
 * Best-effort: meta-capi never throws, and Comgate may re-deliver this callback —
 * Meta dedupes repeat sends by (event_id, event_name), so resending is harmless.
 */
async function ensurePurchaseConversion(supabase: SupabaseClient, registrationId: string) {
  if (!isMetaCapiConfigured()) return

  const { data: reg } = await supabase
    .from('registrations')
    .select('parent_name, parent_email, parent_phone, parent_address, program, location_id, payment_amount')
    .eq('id', registrationId)
    .single()
  if (!reg) return

  const location = getLocationById(reg.location_id as string)
  const programCfg = location.programs.find((p) => p.id === reg.program)

  await sendMetaEvent({
    eventName: 'Purchase',
    eventId: registrationId,
    userData: {
      email: reg.parent_email as string,
      phone: reg.parent_phone as string | undefined,
      fullName: reg.parent_name as string | undefined,
      address: reg.parent_address as string | undefined,
    },
    customData: {
      value: reg.payment_amount as number,
      currency: 'CZK',
      contentName: programCfg?.name ?? (reg.program as string),
    },
  })
}

// Comgate sends a server-to-server POST (form-urlencoded). This is the source of
// truth for payment state. Must respond with "code=0&message=OK".
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)
    const cfg = getComgateConfig()

    if (!verifyCallbackIdentity(params, cfg)) {
      return new NextResponse('code=1&message=identity mismatch', { status: 403 })
    }

    const transId = params.get('transId')
    const registrationId = params.get('refId')
    if (!transId || !registrationId) {
      return new NextResponse('code=1&message=missing params', { status: 400 })
    }

    const status = await getStatus(transId, cfg)

    const supabase = createServerClient()

    // Only act on the callback for the registration's CURRENT transaction. If the
    // user cancelled and retried, a late callback for the superseded transId must
    // not clobber the newer transaction's state. Acknowledge (code=0) but skip.
    const { data: reg } = await supabase
      .from('registrations')
      .select('comgate_payment_id')
      .eq('id', registrationId)
      .single()
    if (!reg || reg.comgate_payment_id !== transId) {
      return new NextResponse('code=0&message=OK', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    // Translate the Comgate-domain status into the DB column vocabulary.
    // DB CHECK: payment_status IN ('pending','completed','refunded');
    //           status IN ('pending','paid','confirmed','cancelled').
    const update: Record<string, unknown> = {}
    update.comgate_status = status
    if (status === 'paid') {
      update.payment_status = 'completed'
      update.status = 'paid'
      update.payment_method = 'comgate_bank_transfer'
      update.payment_completed_at = new Date().toISOString()
    } else if (status === 'cancelled') {
      // Keep payment_status 'pending' (DB has no 'cancelled' for it) so a retry is
      // possible; mark the order status cancelled for visibility. Safe now that the
      // transId guard above prevents a stale callback from clobbering a paid retry.
      update.payment_status = 'pending'
      update.status = 'cancelled'
    } else {
      update.payment_status = 'pending'
    }
    const { error: updateError } = await supabase
      .from('registrations')
      .update(update)
      .eq('id', registrationId)

    // A failed write here when the payment is PAID is the worst case: the customer
    // paid but our record didn't flip. Alert immediately. Returning code=1 makes
    // Comgate retry the callback, giving us another chance to reconcile.
    if (updateError) {
      reportMessage('Comgate callback: failed to persist payment status', {
        route: 'comgate/callback',
        status,
        registrationId,
        transId,
        updateError,
      })
      return new NextResponse('code=1&message=db error', { status: 500 })
    }

    // Payment settled → issue the daňový doklad + send confirmation (both
    // idempotent, best-effort — neither failure blocks the Comgate ack).
    if (status === 'paid') {
      await ensurePaidInvoice(supabase, registrationId)
      await ensureConfirmationEmail(supabase, registrationId)
      await ensurePurchaseConversion(supabase, registrationId)
    }

    return new NextResponse('code=0&message=OK', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (e) {
    reportError(e, { route: 'comgate/callback', reason: 'unhandled' })
    return new NextResponse('code=1&message=error', { status: 500 })
  }
}
