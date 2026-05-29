import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('registrations')
    .select('status, payment_status')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  // Normalize the DB columns to a UI-friendly value ('paid' | 'pending').
  const paid =
    data.status === 'paid' || data.status === 'confirmed' || data.payment_status === 'completed'
  return NextResponse.json({ paymentStatus: paid ? 'paid' : 'pending' })
}
