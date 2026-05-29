import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getComgateConfig, getStatus, verifyCallbackIdentity } from '@/lib/comgate'

export const dynamic = 'force-dynamic'

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

    // Only act on the callback for the registration's CURRENT transaction. If the
    // user cancelled and retried, a late callback for the superseded transId must
    // not clobber the newer transaction's state. Acknowledge (code=0) but skip.
    const { data: reg } = await supabase
      .from('registrations')
      .select('comgate_trans_id')
      .eq('id', registrationId)
      .single()
    if (!reg || reg.comgate_trans_id !== transId) {
      return new NextResponse('code=0&message=OK', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    // Translate the Comgate-domain status into the DB column vocabulary.
    // DB CHECK: payment_status IN ('pending','completed','refunded');
    //           status IN ('pending','paid','confirmed','cancelled').
    const update: Record<string, unknown> = {}
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
    await supabase.from('registrations').update(update).eq('id', registrationId)

    return new NextResponse('code=0&message=OK', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (e) {
    console.error('Comgate callback error:', e)
    return new NextResponse('code=1&message=error', { status: 500 })
  }
}
