import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { buildPaymentReminderEmail, sendEmail, isEmailConfigured } from '@/lib/email'
import { getLocationById } from '@/lib/locations'
import { getTrustedPriceKc } from '@/lib/payment-pricing'
import { formatTermLabel, isoDate } from '@/lib/dates'
import { reportMessage } from '@/lib/observability'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://weeks.cz'

// Daily cron: send a one-time payment reminder ~24h after an unpaid registration.
// Targets registrations that are still pending (not paid, not gateway-cancelled),
// created between 24h and 7 days ago, whose term hasn't started, and that haven't
// been reminded yet. Sends exactly once via an atomic claim on
// payment_reminder_sent_at. Configured in vercel.json.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  // Fail closed: a missing CRON_SECRET must NOT open the endpoint to the public.
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ error: 'Resend not configured' }, { status: 500 })
  }

  const supabase = createServerClient()
  const now = Date.now()
  const olderThan = new Date(now - 24 * 60 * 60 * 1000).toISOString() // created ≤ 24h ago
  const notBefore = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString() // created ≥ 7d ago
  const today = isoDate()

  // Candidates: unpaid + not gateway-cancelled, within the reminder window, term
  // still in the future, not yet reminded.
  const { data: candidates, error } = await supabase
    .from('registrations')
    .select('id, parent_email, child_name, program, location_id, term_start, term_end')
    .eq('payment_status', 'pending')
    .eq('status', 'pending')
    .is('payment_reminder_sent_at', null)
    .lte('created_at', olderThan)
    .gte('created_at', notBefore)
    .gte('term_start', today)

  if (error) {
    reportMessage('Payment reminder cron: query failed', { error })
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  let sent = 0
  let failed = 0

  for (const reg of candidates ?? []) {
    // Atomic claim — guards against overlapping cron runs sending twice.
    const { data: claimed } = await supabase
      .from('registrations')
      .update({ payment_reminder_sent_at: new Date().toISOString() })
      .eq('id', reg.id)
      .is('payment_reminder_sent_at', null)
      .select('id')
    if (!claimed || claimed.length === 0) continue

    try {
      const location = getLocationById(reg.location_id as string)
      const programCfg = location.programs.find((p) => p.id === reg.program)
      const priceKc = getTrustedPriceKc(reg.location_id as string, reg.program as string)
      const paymentUrl = `${SITE_URL}/platba/${reg.id}?location=${reg.location_id}`
      const { subject, html } = buildPaymentReminderEmail({
        childName: reg.child_name as string,
        programName: programCfg?.name ?? (reg.program as string),
        locationName: location.name,
        termLabel: formatTermLabel(reg.term_start as string, reg.term_end as string),
        priceKc,
        paymentUrl,
      })
      await sendEmail({ to: reg.parent_email as string, subject, html })
      sent++
    } catch (e) {
      failed++
      // Release the claim so the next run retries.
      await supabase
        .from('registrations')
        .update({ payment_reminder_sent_at: null })
        .eq('id', reg.id)
      reportMessage('Payment reminder send failed', {
        registrationId: reg.id,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  return NextResponse.json({
    ok: true,
    window: { notBefore, olderThan },
    candidates: candidates?.length ?? 0,
    sent,
    failed,
  })
}
