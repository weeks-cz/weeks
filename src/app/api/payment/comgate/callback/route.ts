import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@/lib/supabase'
import { getComgateConfig, getStatus, verifyCallbackIdentity } from '@/lib/comgate'
import { reportError, reportMessage } from '@/lib/observability'
import { issuePaidInvoice, isFakturoidConfigured } from '@/lib/fakturoid'
import { buildConfirmationEmail, buildConfirmationZalohaEmail, buildDoplatekPrijatEmail, sendEmail, isEmailConfigured } from '@/lib/email'
import { getLocationById } from '@/lib/locations'
import { formatTermLabel, pragueIsoDate } from '@/lib/dates'
import { sendMetaEvent, isMetaCapiConfigured } from '@/lib/meta-capi'
import { getTrustedProgramName } from '@/lib/payment-pricing'
import { getTurnusById } from '@/lib/turnusy'
import { stavZPlateb, castkaDoplatku, maOdeslatPurchase, type PaymentKind } from '@/lib/zaloha'
import { zaplaceno } from '@/lib/registration-payments'

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
    .select('id, parent_name, parent_email, parent_address, program, location_id, term_id, term_start, term_end, payment_amount')

  if (!claimed || claimed.length === 0) return // already issued or in progress
  const reg = claimed[0]

  try {
    let programName: string
    try {
      programName = getTrustedProgramName(reg.term_id as string)
    } catch {
      // Stará registrace na turnus, který už v konfiguraci není — uložená
      // hodnota je to jediné, co o ní víme.
      programName = reg.program as string
      reportMessage('Fakturoid invoice: term_id not found in turnusy, falling back to stored program', {
        registrationId,
        term_id: reg.term_id,
        fallbackProgram: reg.program,
      })
    }
    const invoiceId = await issuePaidInvoice({
      parentName: reg.parent_name as string,
      parentEmail: reg.parent_email as string,
      parentAddress: reg.parent_address as string,
      registrationId: reg.id as string,
      programName,
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
async function ensureConfirmationEmail(
  supabase: SupabaseClient,
  registrationId: string,
  zaloha?: { zaplaceno: number; zbyvaKc: number; doplatekDo: string; doplatekUrl: string }
) {
  if (!isEmailConfigured()) return

  const { data: claimed } = await supabase
    .from('registrations')
    .update({ confirmation_sent_at: new Date().toISOString() })
    .eq('id', registrationId)
    .is('confirmation_sent_at', null)
    .select('id, parent_email, child_name, program, location_id, term_id, term_start, term_end, payment_amount')

  if (!claimed || claimed.length === 0) return
  const reg = claimed[0]

  try {
    const location = getLocationById(reg.location_id as string)
    let programName: string
    try {
      programName = getTrustedProgramName(reg.term_id as string)
    } catch {
      // Stará registrace na turnus, který už v konfiguraci není — uložená
      // hodnota je to jediné, co o ní víme.
      programName = reg.program as string
      reportMessage('Confirmation email: term_id not found in turnusy, falling back to stored program', {
        registrationId,
        term_id: reg.term_id,
        fallbackProgram: reg.program,
      })
    }
    const common = {
      childName: reg.child_name as string,
      programName,
      termLabel: formatTermLabel(reg.term_start as string, reg.term_end as string),
      locationName: location.name,
    }
    const { subject, html } = zaloha
      ? buildConfirmationZalohaEmail({ ...common, ...zaloha })
      : buildConfirmationEmail({ ...common, priceKc: reg.payment_amount as number })
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
    .select('parent_name, parent_email, parent_phone, parent_address, location_id, term_id, payment_amount')
    .eq('id', registrationId)
    .single()
  if (!reg) return

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
      // Turnus id, ne čitelný název tábora — prohlížečový Purchase
      // (`trackPaymentCompleted`) posílá pod stejným `event_id` totéž. Dokud
      // se stránky lišily, rozhodoval o uložené hodnotě závod, kdo dorazil
      // první. Identifikátor navíc nezávisí na textaci názvu tábora.
      contentName: reg.term_id as string,
    },
  })
}

// ── Nová cesta: platba má řádek v registration_payments ─────────────────────

const REG_FIELDS =
  'id, parent_name, parent_email, parent_phone, parent_address, location_id, program, term_id, term_start, term_end, child_name, payment_amount, payment_status, comgate_payment_id'

/**
 * Faktura za jednu platbu (řádek `registration_payments`). Claim je na řádku
 * platby, takže každá platba (záloha, doplatek, plná) má vlastní doklad. První
 * vystavená faktura se navíc zapíše do registrace, odkud ji čte hub.
 */
async function ensurePaidInvoiceRow(
  supabase: SupabaseClient,
  platbaId: string,
  reg: Record<string, unknown>,
  kind: PaymentKind,
  amountKc: number
) {
  if (!isFakturoidConfigured()) return

  const { data: claimed } = await supabase
    .from('registration_payments')
    .update({ fakturoid_invoice_id: 'pending' })
    .eq('id', platbaId)
    .is('fakturoid_invoice_id', null)
    .select('id')

  if (!claimed || claimed.length === 0) return // already issued or in progress

  try {
    let programName: string
    try {
      programName = getTrustedProgramName(reg.term_id as string)
    } catch {
      programName = reg.program as string
      reportMessage('Fakturoid invoice (row): term_id not found in turnusy, falling back to stored program', {
        registrationId: reg.id,
        term_id: reg.term_id,
        fallbackProgram: reg.program,
      })
    }
    const termLabel = formatTermLabel(reg.term_start as string, reg.term_end as string)
    const polozka =
      kind === 'zaloha'
        ? `Záloha na ${programName} — ${termLabel}`
        : kind === 'doplatek'
          ? `Doplatek na ${programName} — ${termLabel}`
          : undefined
    const invoiceId = await issuePaidInvoice({
      parentName: reg.parent_name as string,
      parentEmail: reg.parent_email as string,
      parentAddress: reg.parent_address as string,
      registrationId: reg.id as string,
      programName,
      termLabel,
      priceKc: amountKc,
      polozka,
      // Fakturoid email is a paid-plan feature; only send for real (live) payments.
      sendEmail: process.env.COMGATE_TEST === 'false',
    })
    await supabase.from('registration_payments').update({ fakturoid_invoice_id: invoiceId }).eq('id', platbaId)
    await supabase
      .from('registrations')
      .update({ fakturoid_invoice_id: invoiceId })
      .eq('id', reg.id as string)
      .is('fakturoid_invoice_id', null)
  } catch (e) {
    await supabase.from('registration_payments').update({ fakturoid_invoice_id: null }).eq('id', platbaId)
    reportMessage('Fakturoid invoice generation failed', {
      registrationId: reg.id,
      platbaId,
      kind,
      error: e instanceof Error ? e.message : String(e),
    })
  }
}

/** E-mail „Doplatek přijat“. Posílá se jen u platby, která právě přepnula řádek na paid. */
async function sendDoplatekPrijatEmail(reg: Record<string, unknown>, doplatekKc: number) {
  if (!isEmailConfigured()) return
  try {
    let programName: string
    try {
      programName = getTrustedProgramName(reg.term_id as string)
    } catch {
      programName = reg.program as string
    }
    const { subject, html } = buildDoplatekPrijatEmail({
      childName: reg.child_name as string,
      programName,
      termLabel: formatTermLabel(reg.term_start as string, reg.term_end as string),
      doplatekKc,
    })
    await sendEmail({ to: reg.parent_email as string, subject, html })
  } catch (e) {
    reportMessage('Doplatek email failed', {
      registrationId: reg.id,
      error: e instanceof Error ? e.message : String(e),
    })
  }
}

/**
 * Zpracování callbacku pro platbu s vlastním řádkem. Vrací `false`, když se nepovedl
 * zápis do DB — Comgate pak doručí callback znovu (stejně jako u legacy cesty).
 *
 * Stav registrace se počítá ze součtu zaplacených řádků (`stavZPlateb`), ne z jednoho
 * callbacku. Zrušená platba registraci ruší jen tehdy, když ještě nic nezaplatila,
 * a jen když jde o aktuální transakci — zrušený doplatek nesmí zrušit přihlášku se
 * zaplacenou zálohou.
 */
async function zpracujPlatbuRadek(
  supabase: SupabaseClient,
  status: 'paid' | 'cancelled' | 'pending',
  platba: { id: string; registration_id: string; comgate_trans_id: string; kind: PaymentKind; amount_kc: number }
): Promise<boolean> {
  // 1) Řádek platby. Přechod na paid je atomický: jen jeden callback ho „vyhraje“
  //    a pošle e-mail doplatku. Opakované doručení nic nezmění.
  let prechodNaZaplaceno = false
  if (status === 'paid') {
    const { data: flipped, error } = await supabase
      .from('registration_payments')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', platba.id)
      .neq('status', 'paid')
      .select('id')
    if (error) return false
    prechodNaZaplaceno = (flipped?.length ?? 0) > 0
  } else if (status === 'cancelled') {
    const { error } = await supabase
      .from('registration_payments')
      .update({ status: 'cancelled' })
      .eq('id', platba.id)
      .eq('status', 'pending')
    if (error) return false
  }

  if (status === 'pending') return true

  // 2) Registrace podle součtu zaplacených plateb.
  const { data: reg, error: regError } = await supabase
    .from('registrations')
    .select(REG_FIELDS)
    .eq('id', platba.registration_id)
    .single()
  if (regError || !reg) return false

  const cena = reg.payment_amount as number
  const zaplacenoKc = await zaplaceno(supabase, platba.registration_id)
  const jeAktualni = reg.comgate_payment_id === platba.comgate_trans_id

  if (status === 'cancelled') {
    if (!jeAktualni || zaplacenoKc > 0) return true // zrušený doplatek / stará transakce nic nerozbije
    const { error } = await supabase
      .from('registrations')
      .update({ comgate_status: 'cancelled', payment_status: 'pending', status: 'cancelled' })
      .eq('id', platba.registration_id)
    return !error
  }

  // status === 'paid'
  const stav = stavZPlateb(cena, zaplacenoKc)
  const update: Record<string, unknown> = {
    payment_status: stav.payment_status,
    status: stav.status,
    payment_method: 'comgate_bank_transfer',
  }
  if (jeAktualni) update.comgate_status = 'paid'
  if (stav.payment_status === 'completed') update.payment_completed_at = new Date().toISOString()
  const { error: updateError } = await supabase.from('registrations').update(update).eq('id', platba.registration_id)
  if (updateError) {
    reportMessage('Comgate callback: failed to persist payment status (row path)', {
      route: 'comgate/callback',
      registrationId: platba.registration_id,
      transId: platba.comgate_trans_id,
      updateError,
    })
    return false
  }

  // 3) Vedlejší efekty. Faktura má vlastní claim, takže se může opakovat bezpečně.
  const reg2 = reg as Record<string, unknown>
  await ensurePaidInvoiceRow(supabase, platba.id, reg2, platba.kind, platba.amount_kc)

  if (platba.kind === 'doplatek') {
    if (prechodNaZaplaceno) await sendDoplatekPrijatEmail(reg2, platba.amount_kc)
    return true
  }

  // Potvrzení a konverze jen u první platby (plná nebo záloha); claimy to hlídají.
  if (platba.kind === 'zaloha') {
    const turnus = getTurnusById(reg.term_id as string)
    if (turnus?.zaloha) {
      await ensureConfirmationEmail(supabase, platba.registration_id, {
        zaplaceno: platba.amount_kc,
        zbyvaKc: castkaDoplatku(cena, zaplacenoKc),
        doplatekDo: turnus.zaloha.doplatekDo,
        doplatekUrl: `https://weeks.cz/platba/${platba.registration_id}?location=${reg.location_id}`,
      })
    } else {
      reportMessage('Comgate callback: záloha zaplacena u turnusu bez zálohy, posílám plné potvrzení', {
        registrationId: platba.registration_id,
        term_id: reg.term_id,
      })
      await ensureConfirmationEmail(supabase, platba.registration_id)
    }
  } else {
    await ensureConfirmationEmail(supabase, platba.registration_id)
  }
  if (maOdeslatPurchase(platba.kind === 'zaloha' ? 'zaloha' : 'plna', stav.payment_status)) {
    await ensurePurchaseConversion(supabase, platba.registration_id)
  }
  // Pozn.: `pragueIsoDate` se tu nepoužívá — záloha se po zaplacení nepřepočítává.
  return true
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

    // Nová cesta: platba má vlastní řádek v registration_payments. Bez řádku
    // (registrace založená dřív, než existovaly zálohy) jde callback legacy cestou níže.
    const { data: platba } = await supabase
      .from('registration_payments')
      .select('id, registration_id, comgate_trans_id, kind, amount_kc')
      .eq('comgate_trans_id', transId)
      .maybeSingle()
    if (platba) {
      if (platba.registration_id !== registrationId) {
        reportMessage('Comgate callback: transId patří jiné registraci', { transId, registrationId })
        return new NextResponse('code=0&message=OK', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        })
      }
      const ok = await zpracujPlatbuRadek(supabase, status, platba as Parameters<typeof zpracujPlatbuRadek>[2])
      if (!ok) return new NextResponse('code=1&message=db error', { status: 500 })
      return new NextResponse('code=0&message=OK', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

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
