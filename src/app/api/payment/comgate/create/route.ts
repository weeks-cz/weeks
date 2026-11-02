import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { createPayment } from '@/lib/comgate'
import { registrationToken } from '@/lib/registration-token'
import { API_ERRORS } from '@/lib/api-messages'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { reportError } from '@/lib/observability'
import { pragueIsoDate } from '@/lib/dates'
import { getTurnusById } from '@/lib/turnusy'
import { obsazenaMista, zaplaceno } from '@/lib/registration-payments'
import {
  castkaDoplatku,
  castkyPlatby,
  duvodBlokovaniPlatby,
  isPaymentPlan,
  labelPlatby,
  platnyPlan,
  zalohaDostupna,
  type PaymentKind,
  type PaymentPlan,
} from '@/lib/zaloha'

export const dynamic = 'force-dynamic'

/**
 * Založení platby u Comgate.
 *
 * Tři případy podle stavu registrace:
 * - `completed` → 409, už zaplaceno (beze změny).
 * - `partial` → doplatek: částka = cena minus součet zaplacených plateb.
 * - jinak → první platba: záloha, nebo plná cena. Plán určuje server
 *   (`zalohaDostupna`), tělo jen nabídne volbu. Tahle platba zabírá místo,
 *   proto se znovu ověří kapacita (ostatní držitelé místa bez této registrace).
 *
 * Každá platba dostane vlastní řádek v `registration_payments`. Callback podle
 * něj pozná, o kterou platbu jde; `registrations.comgate_payment_id` se přepisuje
 * dál kvůli hubu a staré ochraně proti zastaralému callbacku.
 */
export async function POST(request: NextRequest) {
  try {
    // Abuse guard: max 15 payment-init attempts per IP per 10 min. Fail-open.
    const ip = clientIp(request)
    const limited = await rateLimit(`pay:${ip}`, 15, 600)
    if (!limited.ok) {
      return NextResponse.json({ error: API_ERRORS.rateLimited }, { status: 429 })
    }

    const { registrationId, plan: planZBody } = await request.json()
    if (!registrationId) {
      return NextResponse.json({ error: API_ERRORS.invalidRequest }, { status: 400 })
    }
    if (planZBody !== undefined && !isPaymentPlan(planZBody)) {
      return NextResponse.json({ error: API_ERRORS.invalidRequest }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data: reg, error } = await supabase
      .from('registrations')
      .select(
        'id, location_id, term_id, program, child_name, parent_email, status, payment_status, payment_amount, payment_plan'
      )
      .eq('id', registrationId)
      .single()

    if (error || !reg) {
      return NextResponse.json({ error: API_ERRORS.notFound }, { status: 404 })
    }

    // Guard against double payment: if this registration is already paid, do NOT
    // start a new Comgate transaction (which would also reset payment_status back
    // to 'pending'). The registration email keeps a pay link in the parent's inbox,
    // so an already-paid parent re-clicking it is a real path. A gateway-'cancelled'
    // registration keeps payment_status 'pending', so retries still work.
    if (reg.payment_status === 'completed') {
      return NextResponse.json({ error: API_ERRORS.alreadyPaid }, { status: 409 })
    }

    // Vrácené peníze a zrušená přihláška s platbou se znovu neplatí. Jinak by se
    // staré `paid` řádky sečetly s novou platbou a registrace by se tiše přepnula.
    const { data: radky, error: radkyError } = await supabase
      .from('registration_payments')
      .select('status')
      .eq('registration_id', reg.id)
    if (radkyError) throw radkyError
    const zaplaceneRadky = (radky ?? []).filter((r) => r.status === 'paid').length
    const refundovaneRadky = (radky ?? []).filter((r) => r.status === 'refunded').length
    const duvod = duvodBlokovaniPlatby(
      { payment_status: reg.payment_status as string | null, status: reg.status as string | null },
      zaplaceneRadky,
      refundovaneRadky
    )
    if (duvod) {
      return NextResponse.json({ error: duvod }, { status: 409 })
    }

    // Částku NEODVOZUJEME znovu z dnešního ceníku — platí ta, kterou server zapsal
    // při vzniku registrace. Turnus mohl mezitím zmizet z nabídky, ale nezaplacená
    // registrace musí jít doplatit. Záloha se přepočítává, protože ta má termín.
    const priceKc = reg.payment_amount as number | null
    if (!priceKc || priceKc <= 0) {
      reportError(new Error('Registrace nemá uloženou částku k zaplacení'), {
        route: 'payment/comgate/create',
        registrationId: reg.id,
      })
      return NextResponse.json({ error: API_ERRORS.paymentInitFailed }, { status: 400 })
    }

    const dnes = pragueIsoDate()
    const turnus = getTurnusById(reg.term_id as string)

    let kind: PaymentKind
    let amountKc: number
    let plan: PaymentPlan | null = null

    if (reg.payment_status === 'partial') {
      // Doplatek: zbytek ceny, bez další kontroly kapacity (místo už drží záloha).
      kind = 'doplatek'
      amountKc = castkaDoplatku(priceKc, await zaplaceno(supabase, reg.id as string))
      if (amountKc <= 0) {
        return NextResponse.json({ error: API_ERRORS.alreadyPaid }, { status: 409 })
      }
    } else {
      // První platba. Plán: volba z těla, jinak to, co rodič zvolil při přihlášce.
      // `platnyPlan` ji přepne na plnou, když záloha není dostupná.
      const pozadovany = (planZBody ?? reg.payment_plan ?? 'plna') as PaymentPlan
      plan = turnus ? platnyPlan(pozadovany, zalohaDostupna(turnus, dnes)) : 'plna'
      kind = plan === 'zaloha' ? 'zaloha' : 'plna'
      amountKc = plan === 'zaloha' && turnus?.zaloha ? turnus.zaloha.castkaKc : priceKc

      // Oprava díry z grillingu: přihláška, která visela na platbě, mohla místo
      // mezitím ztratit. Ověříme, že pro ni na turnusu ještě je místo.
      if (turnus) {
        const obsazeno = await obsazenaMista(supabase, reg.term_id as string, reg.id as string)
        if (obsazeno >= turnus.capacity) {
          return NextResponse.json({ error: API_ERRORS.capacityFull }, { status: 409 })
        }
      }
    }

    const origin = request.nextUrl.origin
    const { transId, redirect } = await createPayment({
      registrationId: reg.id as string,
      priceKc: amountKc,
      // Plná platba má popisek jako dřív; záloha a doplatek se v Comgate poznají.
      label: labelPlatby(kind, reg.child_name as string | null),
      email: (reg.parent_email as string) ?? '',
      returnBaseUrl: origin,
      locationId: reg.location_id as string,
      confirmToken: registrationToken(reg.id as string),
    })

    // Diagnostic: is the service-role key reaching the function? (boolean only — no secret leak)
    console.log('[comgate/create] hasServiceRole:', !!process.env.SUPABASE_SERVICE_ROLE_KEY, 'transId:', transId)

    // Řádek platby dřív než cokoli jiného: callback ho musí najít, i kdyby se
    // následující zápis do registrace nepovedl.
    const { error: paymentInsertError } = await supabase.from('registration_payments').insert({
      registration_id: reg.id,
      kind,
      amount_kc: amountKc,
      comgate_trans_id: transId,
      status: 'pending',
    })
    if (paymentInsertError) {
      reportError(paymentInsertError, {
        route: 'comgate/create',
        reason: 'insert-payment-row',
        registrationId: reg.id,
        transId,
      })
      return NextResponse.json({ error: API_ERRORS.paymentInitFailed }, { status: 500 })
    }

    // Persist the transId — and VERIFY it actually wrote a row. A silent 0-row update
    // (e.g. RLS blocking because the anon key is in use) must NOT proceed: that would
    // mean the customer pays but we can never match the callback. Fail loudly instead.
    // U doplatku se `payment_status` nechává na 'partial' (ne přepisovat na pending).
    const update: Record<string, unknown> =
      plan === null
        ? { comgate_payment_id: transId, comgate_status: 'pending' }
        : { comgate_payment_id: transId, comgate_status: 'pending', payment_status: 'pending', payment_plan: plan }
    const { data: updated, error: updateError } = await supabase
      .from('registrations')
      .update(update)
      .eq('id', reg.id)
      .select('id')

    if (updateError || !updated || updated.length === 0) {
      reportError(updateError ?? new Error('transId persisted 0 rows'), {
        route: 'comgate/create',
        reason: 'persist-transId',
        updatedCount: updated?.length ?? 0,
        registrationId: reg.id,
        transId,
      })
      return NextResponse.json({ error: API_ERRORS.paymentInitFailed }, { status: 500 })
    }

    return NextResponse.json({ redirectUrl: redirect })
  } catch (e) {
    reportError(e, { route: 'comgate/create', reason: 'unhandled' })
    return NextResponse.json({ error: API_ERRORS.gatewayUnavailable }, { status: 502 })
  }
}

/**
 * Stav platby a částky pro stránku `/platba`. Vrací jen čísla a stav, žádná
 * osobní data — stránka z toho vykreslí volbu (záloha / celá částka) nebo
 * jen doplatek. Stejně jako POST se nic nezapisuje.
 */
export async function GET(request: NextRequest) {
  const registrationId = request.nextUrl.searchParams.get('registrationId')
  if (!registrationId) {
    return NextResponse.json({ error: API_ERRORS.invalidRequest }, { status: 400 })
  }

  try {
    const supabase = createServerClient()
    const { data: reg, error } = await supabase
      .from('registrations')
      .select('id, term_id, payment_status, payment_amount, payment_plan')
      .eq('id', registrationId)
      .single()

    if (error || !reg) {
      return NextResponse.json({ error: API_ERRORS.notFound }, { status: 404 })
    }

    const priceKc = (reg.payment_amount as number | null) ?? 0
    const turnus = getTurnusById(reg.term_id as string)
    const doplatekDo = turnus?.zaloha?.doplatekDo ?? null

    if (reg.payment_status === 'completed') {
      return NextResponse.json({
        stav: 'completed',
        plan: reg.payment_plan,
        castky: { plna: priceKc, zaloha: null, doplatek: 0 },
        doplatekDo,
      })
    }

    if (reg.payment_status === 'partial') {
      const doplatek = castkaDoplatku(priceKc, await zaplaceno(supabase, reg.id as string))
      return NextResponse.json({
        stav: 'partial',
        plan: 'zaloha',
        castky: { plna: priceKc, zaloha: null, doplatek },
        doplatekDo,
      })
    }

    const dnes = pragueIsoDate()
    const plan = turnus
      ? platnyPlan(isPaymentPlan(reg.payment_plan) ? reg.payment_plan : 'plna', zalohaDostupna(turnus, dnes))
      : 'plna'
    return NextResponse.json({
      stav: 'pending',
      plan,
      castky: castkyPlatby(priceKc, turnus ?? {}, dnes),
      doplatekDo,
    })
  } catch (e) {
    reportError(e, { route: 'comgate/create', reason: 'get-unhandled' })
    return NextResponse.json({ error: API_ERRORS.notFound }, { status: 404 })
  }
}
