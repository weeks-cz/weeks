import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import {
  buildDoplatekReminderEmail,
  buildDoplatekOverdueAlert,
  sendEmail,
  isEmailConfigured,
  type DoplatekOverdueRow,
} from '@/lib/email'
import { formatTermLabel, pragueIsoDate } from '@/lib/dates'
import { reportMessage } from '@/lib/observability'
import { getTrustedProgramName } from '@/lib/payment-pricing'
import { getTurnusById } from '@/lib/turnusy'
import { castkaDoplatku, doplatekKrok, type DoplatekKrok } from '@/lib/zaloha'
import { zaplaceno } from '@/lib/registration-payments'
import { SITE } from '@/lib/site'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://weeks.cz'

// Denní cron doplatků: připomínky 14 a 3 dny před `doplatekDo` a jedno upozornění
// týmu den po termínu. Vybírá přihlášky se `payment_status='partial'` (záloha
// zaplacená, doplatek ne). Okno určuje `doplatekKrok`; každý krok má vlastní
// atomický claim na sloupci, takže opakovaný běh e-mail neodešle dvakrát.
// Selhání odeslání claim uvolní, aby se další běh pokusil znovu.
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
  const dnes = pragueIsoDate()

  const { data: candidates, error } = await supabase
    .from('registrations')
    .select(
      'id, parent_email, child_name, program, location_id, term_id, term_start, term_end, payment_amount, doplatek_reminder_14_at, doplatek_reminder_3_at, doplatek_overdue_alert_at'
    )
    .eq('payment_status', 'partial')
    .neq('status', 'cancelled')

  if (error) {
    reportMessage('Doplatek cron: query failed', { error })
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  const COLUMN: Record<Exclude<DoplatekKrok, 'upozorneni-tymu'>, string> = {
    'pripominka-14': 'doplatek_reminder_14_at',
    'pripominka-3': 'doplatek_reminder_3_at',
  }

  let sent = 0
  let failed = 0
  const overdue: Array<{ row: DoplatekOverdueRow; column: 'doplatek_overdue_alert_at' }> = []

  for (const reg of candidates ?? []) {
    const turnus = getTurnusById(reg.term_id as string)
    if (!turnus?.zaloha) {
      reportMessage('Doplatek cron: turnus bez zálohy nebo neznámý', {
        registrationId: reg.id,
        term_id: reg.term_id,
      })
      continue
    }
    const doplatekDo = turnus.zaloha.doplatekDo

    const krok = doplatekKrok(dnes, doplatekDo, {
      r14: reg.doplatek_reminder_14_at !== null,
      r3: reg.doplatek_reminder_3_at !== null,
      upozorneni: reg.doplatek_overdue_alert_at !== null,
    })
    if (!krok) continue

    const priceKc = reg.payment_amount as number
    const zbyvaKc = castkaDoplatku(priceKc, await zaplaceno(supabase, reg.id as string))
    if (zbyvaKc <= 0) continue

    let programName: string
    try {
      programName = getTrustedProgramName(reg.term_id as string)
    } catch {
      programName = reg.program as string
    }

    if (krok === 'upozorneni-tymu') {
      // Upozornění jde jedním e-mailem na konci běhu. Claim je tady, aby se
      // přihláška do seznamu dostala jen jednou.
      const { data: claimed } = await supabase
        .from('registrations')
        .update({ doplatek_overdue_alert_at: new Date().toISOString() })
        .eq('id', reg.id)
        .is('doplatek_overdue_alert_at', null)
        .select('id')
      if (!claimed || claimed.length === 0) continue
      overdue.push({
        row: {
          registrationId: reg.id as string,
          childName: reg.child_name as string,
          parentEmail: reg.parent_email as string,
          zbyvaKc,
          doplatekDo,
        },
        column: 'doplatek_overdue_alert_at',
      })
      continue
    }

    const column = COLUMN[krok]
    const { data: claimed } = await supabase
      .from('registrations')
      .update({ [column]: new Date().toISOString() })
      .eq('id', reg.id)
      .is(column, null)
      .select('id')
    if (!claimed || claimed.length === 0) continue

    try {
      const { subject, html } = buildDoplatekReminderEmail({
        childName: reg.child_name as string,
        programName,
        termLabel: formatTermLabel(reg.term_start as string, reg.term_end as string),
        zbyvaKc,
        doplatekDo,
        paymentUrl: `${SITE_URL}/platba/${reg.id}?location=${reg.location_id}`,
      })
      await sendEmail({ to: reg.parent_email as string, subject, html })
      sent++
    } catch (e) {
      failed++
      await supabase.from('registrations').update({ [column]: null }).eq('id', reg.id)
      reportMessage('Doplatek reminder send failed', {
        registrationId: reg.id,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  if (overdue.length > 0) {
    try {
      const { subject, html } = buildDoplatekOverdueAlert(overdue.map((o) => o.row))
      await sendEmail({ to: SITE.email, subject, html })
      sent++
    } catch (e) {
      failed++
      // Bez odeslaného upozornění se claimy uvolní, ať se příští běh pokusí znovu.
      for (const o of overdue) {
        await supabase.from('registrations').update({ [o.column]: null }).eq('id', o.row.registrationId)
      }
      reportMessage('Doplatek overdue alert failed', {
        count: overdue.length,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  // Heartbeat: jedna řádka v logu potvrdí, že cron běžel, i když nic neposlal.
  console.log('[doplatek] heartbeat', { candidates: candidates?.length ?? 0, sent, failed, overdue: overdue.length, dnes })
  return NextResponse.json({
    ok: true,
    dnes,
    candidates: candidates?.length ?? 0,
    sent,
    failed,
    overdue: overdue.length,
  })
}
