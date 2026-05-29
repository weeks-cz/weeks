import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { createPayment } from '@/lib/comgate'
import { getTrustedPriceKc } from '@/lib/payment-pricing'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { registrationId } = await request.json()
    if (!registrationId) {
      return NextResponse.json({ error: 'Missing registrationId' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data: reg, error } = await supabase
      .from('registrations')
      .select('id, location_id, program, parent_email, child_name')
      .eq('id', registrationId)
      .single()

    if (error || !reg) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
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

    await supabase
      .from('registrations')
      .update({ comgate_trans_id: transId, payment_status: 'pending' })
      .eq('id', reg.id)

    return NextResponse.json({ redirectUrl: redirect })
  } catch (e) {
    console.error('Comgate create error:', e)
    return NextResponse.json({ error: 'Payment init failed' }, { status: 500 })
  }
}
