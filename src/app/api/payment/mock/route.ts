import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { registrationId } = await request.json()

    if (!registrationId) {
      return NextResponse.json({ error: 'Missing registrationId' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase
      .from('registrations')
      .update({
        payment_status: 'completed',
        payment_method: 'mock_card',
        payment_completed_at: new Date().toISOString(),
        status: 'paid',
      })
      .eq('id', registrationId)

    if (error) {
      console.error('Payment update error:', error)
      return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      redirectUrl: `/registrace/${registrationId}`,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
