import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { buildNastupniListEmail, sendEmail, isEmailConfigured } from '@/lib/email'
import { getLocationById } from '@/lib/locations'
import { formatTermLabel, isoDate, isoDatePlusDays } from '@/lib/dates'
import { reportMessage } from '@/lib/observability'

export const dynamic = 'force-dynamic'

// Daily cron: send the nástupní list (VOP §12) ~7 days before a camp starts.
// Finds PAID registrations whose term starts within the next 7 days and that
// haven't been sent yet, then sends exactly once (atomic claim on
// nastupni_sent_at). Configured in vercel.json.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ error: 'Resend not configured' }, { status: 500 })
  }

  const supabase = createServerClient()
  const today = isoDate()
  const in7 = isoDatePlusDays(7)

  // Candidates: paid, starting within the window, not yet sent.
  const { data: candidates, error } = await supabase
    .from('registrations')
    .select('id, parent_email, child_name, program, location_id, term_start, term_end')
    .eq('payment_status', 'completed')
    .is('nastupni_sent_at', null)
    .gte('term_start', today)
    .lte('term_start', in7)

  if (error) {
    reportMessage('Nástupní list cron: query failed', { error })
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  let sent = 0
  let failed = 0

  for (const reg of candidates ?? []) {
    // Atomic claim — guards against overlapping cron runs sending twice.
    const { data: claimed } = await supabase
      .from('registrations')
      .update({ nastupni_sent_at: new Date().toISOString() })
      .eq('id', reg.id)
      .is('nastupni_sent_at', null)
      .select('id')
    if (!claimed || claimed.length === 0) continue

    try {
      const location = getLocationById(reg.location_id as string)
      const programCfg = location.programs.find((p) => p.id === reg.program)
      const venue = location.venues[0]
      const { subject, html } = buildNastupniListEmail({
        childName: reg.child_name as string,
        programName: programCfg?.name ?? (reg.program as string),
        termLabel: formatTermLabel(reg.term_start as string, reg.term_end as string),
        venueName: venue?.fullName ?? venue?.name ?? location.name,
        venueAddress: venue ? `${venue.address}, ${venue.postalCode} ${venue.city}` : '',
        contactPhone: location.contact.phone,
        contactEmail: location.contact.email,
      })
      await sendEmail({ to: reg.parent_email as string, subject, html })
      sent++
    } catch (e) {
      failed++
      // Release the claim so the next run retries.
      await supabase
        .from('registrations')
        .update({ nastupni_sent_at: null })
        .eq('id', reg.id)
      reportMessage('Nástupní list send failed', {
        registrationId: reg.id,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  return NextResponse.json({
    ok: true,
    window: { from: today, to: in7 },
    candidates: candidates?.length ?? 0,
    sent,
    failed,
  })
}
