import { NextRequest, NextResponse } from 'next/server'
import { registrationSchema } from '@/lib/registration'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('registrations')
      .insert({
        ...parsed.data,
        status: 'pending',
        payment_status: 'pending',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Registration insert error:', error)
      return NextResponse.json({ error: 'Failed to create registration' }, { status: 500 })
    }

    return NextResponse.json({
      registrationId: data.id,
      paymentUrl: `/platba/${data.id}`,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
