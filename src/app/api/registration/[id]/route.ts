import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { API_ERRORS } from '@/lib/api-messages'
import { reportError, reportMessage } from '@/lib/observability'
import { verifyRegistrationToken } from '@/lib/registration-token'
import { getTrustedProgramName } from '@/lib/payment-pricing'

export const dynamic = 'force-dynamic'

// Minimal, non-sensitive field set the confirmation page needs. We deliberately
// do NOT expose child_birthdate, child_insurance, child_health_notes,
// parent_phone, parent_address, pickup details, consents or IP — returning those
// to anyone holding the UUID would be a PII leak. `term_id` is not sensitive
// (it already sits in the registration form's own URL) — it's both used below
// to derive the trusted program name and returned to the client as `termId`,
// a stable analytics key that doesn't drift when the display text changes.
const CONFIRMATION_FIELDS =
  'id, status, payment_status, location_id, program, term_id, term_start, term_end, parent_name, parent_email, child_name, payment_amount'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: API_ERRORS.notFound }, { status: 400 })
  }

  // Anti-IDOR: the bare UUID is not enough — require the HMAC access token that
  // only the server can compute (carried on the confirmation URL from Comgate).
  const token = request.nextUrl.searchParams.get('t')
  if (!verifyRegistrationToken(id, token)) {
    return NextResponse.json({ error: API_ERRORS.notFound }, { status: 403 })
  }

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('registrations')
      .select(CONFIRMATION_FIELDS)
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: API_ERRORS.notFound }, { status: 404 })
    }

    // Název programu odvozujeme ze `term_id` stejně jako e-maily a faktura —
    // ne ze syrového pole `program`, které nese jen id zaměření. `term_id`
    // navíc posíláme klientovi zvlášť jako `termId`, aby si ho stránka mohla
    // předat do analytiky jako rozměr nezávislý na textaci názvu.
    const { term_id, program, ...rest } = data
    let programName: string
    try {
      programName = getTrustedProgramName(term_id as string)
    } catch {
      // Stará registrace na turnus, který už v konfiguraci není — uložená
      // hodnota je to jediné, co o ní víme.
      programName = program as string
      reportMessage('Registration confirmation: term_id not found in turnusy, falling back to stored program', {
        registrationId: id,
        term_id,
        fallbackProgram: program,
      })
    }

    return NextResponse.json({ registration: { ...rest, program: programName, termId: term_id } })
  } catch (e) {
    reportError(e, { route: 'registration/[id]', reason: 'fetch' })
    return NextResponse.json({ error: API_ERRORS.notFound }, { status: 404 })
  }
}
