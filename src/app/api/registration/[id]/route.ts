import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { API_ERRORS } from '@/lib/api-messages'
import { reportError } from '@/lib/observability'

export const dynamic = 'force-dynamic'

// Minimal, non-sensitive field set the confirmation page needs. We deliberately
// do NOT expose child_birthdate, child_insurance, child_health_notes,
// parent_phone, parent_address, pickup details, consents or IP — returning those
// to anyone holding the UUID would be a PII leak.
const CONFIRMATION_FIELDS =
  'id, status, payment_status, location_id, program, term_start, term_end, parent_name, parent_email, child_name, payment_amount'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: API_ERRORS.notFound }, { status: 400 })
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

    return NextResponse.json({ registration: data })
  } catch (e) {
    reportError(e, { route: 'registration/[id]', reason: 'fetch' })
    return NextResponse.json({ error: API_ERRORS.notFound }, { status: 404 })
  }
}
