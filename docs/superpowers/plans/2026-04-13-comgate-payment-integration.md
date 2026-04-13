# Comgate Payment Integration — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mock payment gateway with real Comgate integration on the `feature/multi-city-expansion` branch.

**Architecture:** Redirect-based payment flow — our server creates a payment via Comgate API, redirects the customer to Comgate's hosted gateway, receives webhook notification + customer redirect back. All Comgate communication is server-side. Supabase is the single source of truth for payment state.

**Tech Stack:** Next.js 16 App Router, Supabase (PostgreSQL + RLS), Comgate REST API (no SDK — plain fetch), Zod validation, Framer Motion

**Spec:** `docs/superpowers/specs/2026-04-13-comgate-payment-integration-design.md`

**Branch:** `feature/multi-city-expansion` (checkout before starting)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/comgate.ts` | CREATE | Comgate API client — createPayment, getStatus, refund |
| `src/lib/registration.ts` | MODIFY | Add payment status type exports |
| `src/app/api/payment/create/route.ts` | CREATE | Creates Comgate payment, saves transId, returns redirect URL |
| `src/app/api/payment/webhook/route.ts` | CREATE | Receives Comgate notifications, verifies, updates DB |
| `src/app/api/payment/status/[id]/route.ts` | CREATE | Returns registration payment status from DB |
| `src/components/registration/PaymentRedirect.tsx` | CREATE | Loading screen → auto-redirect to Comgate |
| `src/app/platba/navrat/page.tsx` | CREATE | Return page after Comgate payment |
| `src/app/platba/[id]/page.tsx` | MODIFY | Swap PaymentMock → PaymentRedirect |
| `src/components/registration/RegistrationConfirmation.tsx` | MODIFY | Fix aspirational email text |
| `supabase/migrations/010_comgate_fields.sql` | CREATE | Add comgate_trans_id, payment_error columns |
| `src/components/registration/PaymentMock.tsx` | DELETE | Replaced by PaymentRedirect |
| `src/app/api/payment/mock/route.ts` | DELETE | Replaced by /api/payment/create + webhook |

---

## Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/010_comgate_fields.sql`

- [ ] **Step 1: Write the migration**

```sql
-- 010_comgate_fields.sql
-- Add Comgate payment gateway fields to registrations table

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS comgate_trans_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_error TEXT;

CREATE INDEX IF NOT EXISTS idx_registrations_comgate
  ON registrations(comgate_trans_id);

-- Expand payment_status to include 'cancelled'
ALTER TABLE registrations
  DROP CONSTRAINT IF EXISTS registrations_payment_status_check;
ALTER TABLE registrations
  ADD CONSTRAINT registrations_payment_status_check
  CHECK (payment_status IN ('pending', 'completed', 'refunded', 'cancelled'));
```

- [ ] **Step 2: Apply migration to Supabase**

Run in Supabase SQL Editor (dashboard → SQL Editor → paste & run). Or via CLI:
```bash
npx supabase db push
```

- [ ] **Step 3: Verify columns exist**

Run in Supabase SQL Editor:
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'registrations' AND column_name IN ('comgate_trans_id', 'payment_error');
```
Expected: 2 rows returned.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/010_comgate_fields.sql
git commit -m "feat: add Comgate fields to registrations table"
```

---

## Task 2: Comgate API Client

**Files:**
- Create: `src/lib/comgate.ts`

- [ ] **Step 1: Add env vars to `.env.local`**

```env
COMGATE_MERCHANT_ID=your_merchant_id
COMGATE_SECRET=your_secret
COMGATE_TEST=true
```

- [ ] **Step 2: Write the Comgate client**

```typescript
// src/lib/comgate.ts

const COMGATE_API_URL = 'https://payments.comgate.cz/v1.0'

interface CreatePaymentParams {
  registrationId: string
  amount: number        // in CZK (whole crowns)
  label: string
  email: string
  returnUrl: string
}

interface CreatePaymentResult {
  transId: string
  redirectUrl: string
}

interface PaymentStatus {
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'AUTHORIZED'
  price: number
  curr: string
  label: string
  refId: string
  method: string
  email: string
  transId: string
}

function getCredentials() {
  const merchant = process.env.COMGATE_MERCHANT_ID
  const secret = process.env.COMGATE_SECRET
  const test = process.env.COMGATE_TEST === 'true'
  if (!merchant || !secret) {
    throw new Error('Missing COMGATE_MERCHANT_ID or COMGATE_SECRET env vars')
  }
  return { merchant, secret, test }
}

export async function createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
  const { merchant, secret, test } = getCredentials()

  const body = new URLSearchParams({
    merchant,
    secret,
    price: String(params.amount * 100), // CZK → haléře
    curr: 'CZK',
    label: params.label,
    refId: params.registrationId,
    email: params.email,
    method: 'ALL',
    prepareOnly: 'true',
    ...(test ? { test: 'true' } : {}),
  })

  const response = await fetch(`${COMGATE_API_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const text = await response.text()
  const result = Object.fromEntries(new URLSearchParams(text))

  if (result.code !== '0') {
    console.error('Comgate createPayment error:', result)
    throw new Error(result.message || 'Comgate payment creation failed')
  }

  return {
    transId: result.transId,
    redirectUrl: result.redirect,
  }
}

export async function getPaymentStatus(transId: string): Promise<PaymentStatus> {
  const { merchant, secret } = getCredentials()

  const body = new URLSearchParams({ merchant, secret, transId })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(`${COMGATE_API_URL}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: controller.signal,
    })

    const text = await response.text()
    const result = Object.fromEntries(new URLSearchParams(text))

    if (result.code !== '0') {
      console.error('Comgate getStatus error:', result)
      throw new Error(result.message || 'Failed to get payment status')
    }

    return result as unknown as PaymentStatus
  } finally {
    clearTimeout(timeout)
  }
}

export async function refundPayment(transId: string, amount?: number): Promise<boolean> {
  const { merchant, secret } = getCredentials()

  const body = new URLSearchParams({
    merchant,
    secret,
    transId,
    ...(amount ? { amount: String(amount * 100) } : {}),
  })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(`${COMGATE_API_URL}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: controller.signal,
    })

    const text = await response.text()
    const result = Object.fromEntries(new URLSearchParams(text))

    if (result.code !== '0') {
      console.error('Comgate refund error:', result)
      return false
    }

    return true
  } finally {
    clearTimeout(timeout)
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/comgate.ts
git commit -m "feat: add Comgate API client library"
```

---

## Task 3: Update Registration Types

**Files:**
- Modify: `src/lib/registration.ts`

- [ ] **Step 1: Add payment status types at the end of the file**

After the existing `INSURANCE_OPTIONS` export, add:

```typescript
export type PaymentStatus = 'pending' | 'completed' | 'refunded' | 'cancelled'
export type RegistrationStatus = 'pending' | 'paid' | 'confirmed' | 'cancelled'
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/registration.ts
git commit -m "feat: add payment and registration status types"
```

---

## Task 4: Payment Create API Endpoint

**Files:**
- Create: `src/app/api/payment/create/route.ts`

- [ ] **Step 1: Write the endpoint**

```typescript
// src/app/api/payment/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { createPayment } from '@/lib/comgate'
import { getLocationById } from '@/lib/locations'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { registrationId } = await request.json()

    if (!registrationId) {
      return NextResponse.json({ error: 'Missing registrationId' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Fetch registration
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .single()

    if (fetchError || !registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    // Idempotency state machine
    if (registration.status === 'paid') {
      return NextResponse.json({ error: 'Payment already completed' }, { status: 400 })
    }

    // Validate amount against program config
    const location = getLocationById(registration.location_id)
    const program = location.programs.find(p => p.id === registration.program)
    if (program && registration.payment_amount !== program.price) {
      return NextResponse.json({ error: 'Payment amount mismatch' }, { status: 400 })
    }

    // Build return URL
    const host = request.headers.get('host') || 'weeks.cz'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const returnUrl = `${protocol}://${host}/platba/navrat?id=${registrationId}&location=${registration.location_id}`

    // Create Comgate payment
    const { transId, redirectUrl } = await createPayment({
      registrationId,
      amount: registration.payment_amount,
      label: `${program?.name || registration.program} - Weeks.cz`,
      email: registration.parent_email,
      returnUrl,
    })

    // Save transId to registration
    const { error: updateError } = await supabase
      .from('registrations')
      .update({ comgate_trans_id: transId })
      .eq('id', registrationId)

    if (updateError) {
      console.error('Failed to save transId:', updateError)
      return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 })
    }

    return NextResponse.json({ redirectUrl })
  } catch (err) {
    console.error('Payment create error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Payment creation failed' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/payment/create/route.ts
git commit -m "feat: add Comgate payment creation API endpoint"
```

---

## Task 5: Webhook Handler

**Files:**
- Create: `src/app/api/payment/webhook/route.ts`

- [ ] **Step 1: Write the webhook handler**

```typescript
// src/app/api/payment/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getPaymentStatus } from '@/lib/comgate'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Validate content type
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/x-www-form-urlencoded')) {
      console.warn('Webhook: unexpected content-type:', contentType)
      return new NextResponse('OK', { status: 200 })
    }

    // Parse form body
    const text = await request.text()
    const params = new URLSearchParams(text)
    const transId = params.get('transId')
    const webhookStatus = params.get('status')

    if (!transId) {
      console.warn('Webhook: missing transId')
      return new NextResponse('OK', { status: 200 })
    }

    console.log(`Webhook received: transId=${transId}, status=${webhookStatus}`)

    const supabase = createServerClient()

    // Find registration by transId
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('id, status, payment_status')
      .eq('comgate_trans_id', transId)
      .single()

    if (fetchError || !registration) {
      console.warn(`Webhook: registration not found for transId=${transId}`)
      return new NextResponse('OK', { status: 200 })
    }

    // Already processed — skip
    if (registration.payment_status === 'completed') {
      console.log(`Webhook: payment already completed for transId=${transId}`)
      return new NextResponse('OK', { status: 200 })
    }

    // VERIFY with Comgate API — never trust webhook data alone
    let verifiedStatus: string
    try {
      const comgateStatus = await getPaymentStatus(transId)
      verifiedStatus = comgateStatus.status
    } catch (err) {
      console.error(`Webhook: failed to verify transId=${transId}:`, err)
      // Still return 200 to prevent retry storm — will be picked up on next webhook
      return new NextResponse('OK', { status: 200 })
    }

    console.log(`Webhook: verified status=${verifiedStatus} for transId=${transId}`)

    if (verifiedStatus === 'PAID') {
      await supabase
        .from('registrations')
        .update({
          payment_status: 'completed',
          status: 'paid',
          payment_method: 'comgate',
          payment_completed_at: new Date().toISOString(),
        })
        .eq('id', registration.id)
    } else if (verifiedStatus === 'CANCELLED') {
      await supabase
        .from('registrations')
        .update({
          payment_status: 'cancelled',
          payment_error: 'Payment cancelled or declined',
        })
        .eq('id', registration.id)
    }
    // PENDING and AUTHORIZED — no DB update, wait for final status

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('Webhook handler error:', err)
    // Always return 200 to prevent Comgate retry storms
    return new NextResponse('OK', { status: 200 })
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/payment/webhook/route.ts
git commit -m "feat: add Comgate webhook handler with status verification"
```

---

## Task 6: Payment Status API

**Files:**
- Create: `src/app/api/payment/status/[id]/route.ts`

- [ ] **Step 1: Write the status endpoint**

```typescript
// src/app/api/payment/status/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('registrations')
    .select('id, status, payment_status, payment_error')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
  }

  return NextResponse.json({
    id: data.id,
    status: data.status,
    paymentStatus: data.payment_status,
    paymentError: data.payment_error,
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/payment/status/\[id\]/route.ts
git commit -m "feat: add payment status API endpoint"
```

---

## Task 7: PaymentRedirect Component

**Files:**
- Create: `src/components/registration/PaymentRedirect.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/registration/PaymentRedirect.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle, Phone } from 'lucide-react'

interface PaymentRedirectProps {
  registrationId: string
}

export function PaymentRedirect({ registrationId }: PaymentRedirectProps) {
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const initiated = useRef(false)

  async function initiatePayment() {
    setError(null)

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Nepodařilo se vytvořit platbu')
      }

      // Full browser redirect to Comgate gateway
      window.location.href = data.redirectUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se vytvořit platbu')
      setIsRetrying(false)
    }
  }

  useEffect(() => {
    // Prevent double-trigger from React StrictMode / double mount
    if (initiated.current) return
    initiated.current = true
    initiatePayment()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleRetry() {
    setIsRetrying(true)
    initiated.current = false
    initiatePayment()
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Nepodařilo se vytvořit platbu</h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>

          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="btn-primary w-full mb-4 disabled:opacity-50"
          >
            {isRetrying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Zkouším znovu...
              </>
            ) : (
              'Zkusit znovu'
            )}
          </button>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Potřebujete pomoc?</p>
            <a
              href="tel:+420703046440"
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <Phone className="w-4 h-4" />
              +420 703 046 440
            </a>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg text-center">
        <Loader2 className="w-12 h-12 text-primary-500 mx-auto mb-6 animate-spin" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Přesměrováváme na platební bránu</h2>
        <p className="text-sm text-gray-500">Budete přesměrováni na zabezpečenou platební stránku Comgate...</p>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/registration/PaymentRedirect.tsx
git commit -m "feat: add PaymentRedirect component for Comgate gateway"
```

---

## Task 8: Return Page After Payment

**Files:**
- Create: `src/app/platba/navrat/page.tsx`

- [ ] **Step 1: Write the return page**

```tsx
// src/app/platba/navrat/page.tsx
'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, XCircle, RefreshCw } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LocationProvider } from '@/contexts/LocationContext'
import { getLocationById, DEFAULT_LOCATION } from '@/lib/locations'
import Link from 'next/link'

function ReturnContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const registrationId = searchParams.get('id')
  const locationId = searchParams.get('location') || ''

  const [status, setStatus] = useState<'loading' | 'paid' | 'pending' | 'cancelled' | 'error'>('loading')
  const [pollCount, setPollCount] = useState(0)

  const checkStatus = useCallback(async () => {
    if (!registrationId) {
      setStatus('error')
      return
    }

    try {
      const response = await fetch(`/api/payment/status/${registrationId}`)
      if (!response.ok) {
        setStatus('error')
        return
      }

      const data = await response.json()

      if (data.paymentStatus === 'completed') {
        setStatus('paid')
      } else if (data.paymentStatus === 'cancelled') {
        setStatus('cancelled')
      } else {
        setStatus('pending')
      }
    } catch {
      setStatus('error')
    }
  }, [registrationId])

  // Initial check + polling
  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  useEffect(() => {
    if (status !== 'pending' || pollCount >= 10) return // max 30s (10 × 3s)

    const timer = setTimeout(() => {
      setPollCount(c => c + 1)
      checkStatus()
    }, 3000)

    return () => clearTimeout(timer)
  }, [status, pollCount, checkStatus])

  // Auto-redirect on paid
  useEffect(() => {
    if (status !== 'paid' || !registrationId) return
    const timer = setTimeout(() => {
      router.push(`/registrace/${registrationId}`)
    }, 2000)
    return () => clearTimeout(timer)
  }, [status, registrationId, router])

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg text-center">

          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-spin" />
              <h1 className="text-lg font-semibold text-gray-900 mb-2">Ověřujeme platbu...</h1>
            </>
          )}

          {status === 'paid' && (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.5 }}>
                <CheckCircle2 className="w-20 h-20 text-trust-500 mx-auto mb-4" />
              </motion.div>
              <h1 className="text-lg font-semibold text-gray-900 mb-2">Platba přijata!</h1>
              <p className="text-sm text-gray-500">Přesměrováváme na potvrzení registrace...</p>
            </>
          )}

          {status === 'pending' && pollCount >= 10 && (
            <>
              <Loader2 className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h1 className="text-lg font-semibold text-gray-900 mb-2">Platba se zpracovává</h1>
              <p className="text-sm text-gray-600 mb-6">
                Zpracování platby trvá déle než obvykle. Zkontrolujte stav později.
              </p>
              {registrationId && (
                <Link href={`/registrace/${registrationId}`} className="btn-primary">
                  Zkontrolovat stav registrace
                </Link>
              )}
            </>
          )}

          {status === 'pending' && pollCount < 10 && (
            <>
              <Loader2 className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-spin" />
              <h1 className="text-lg font-semibold text-gray-900 mb-2">Ověřujeme platbu...</h1>
              <p className="text-sm text-gray-500">Může to trvat několik sekund.</p>
            </>
          )}

          {status === 'cancelled' && (
            <>
              <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
              <h1 className="text-lg font-semibold text-gray-900 mb-2">Platba se nezdařila</h1>
              <p className="text-sm text-gray-600 mb-6">
                Platba byla zrušena nebo zamítnuta. Můžete to zkusit znovu.
              </p>
              {registrationId && (
                <Link href={`/platba/${registrationId}`} className="btn-primary">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Zkusit znovu
                </Link>
              )}
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
              <h1 className="text-lg font-semibold text-gray-900 mb-2">Něco se pokazilo</h1>
              <p className="text-sm text-gray-600 mb-6">
                Nepodařilo se ověřit stav platby.
              </p>
              <Link href="/" className="btn-primary">
                Zpět na hlavní stránku
              </Link>
            </>
          )}

        </div>
      </motion.div>
    </main>
  )
}

function ReturnPageInner() {
  const searchParams = useSearchParams()
  const locationId = searchParams.get('location') || ''
  const location = locationId ? getLocationById(locationId) : DEFAULT_LOCATION

  return (
    <LocationProvider location={location}>
      <Header />
      <Suspense fallback={
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </main>
      }>
        <ReturnContent />
      </Suspense>
      <Footer />
    </LocationProvider>
  )
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-500">Načítání...</div>}>
      <ReturnPageInner />
    </Suspense>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/platba/navrat/page.tsx
git commit -m "feat: add payment return page with status polling"
```

---

## Task 9: Wire Up /platba/[id] Page

**Files:**
- Modify: `src/app/platba/[id]/page.tsx`

- [ ] **Step 1: Replace PaymentMock with PaymentRedirect**

In `src/app/platba/[id]/page.tsx`, make these changes:

Replace import:
```
- import { PaymentMock } from '@/components/registration/PaymentMock'
+ import { PaymentRedirect } from '@/components/registration/PaymentRedirect'
```

Replace component usage in `PaymentContent`:
```
- <PaymentMock registrationId={id} />
+ <PaymentRedirect registrationId={id} />
```

- [ ] **Step 2: Verify the file looks correct after edits**

The full file should be:
```tsx
'use client'

import { use, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PaymentRedirect } from '@/components/registration/PaymentRedirect'
import { LocationProvider } from '@/contexts/LocationContext'
import { getLocationById, DEFAULT_LOCATION } from '@/lib/locations'

function PaymentContent({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const locationId = searchParams.get('location') || ''
  const location = locationId ? getLocationById(locationId) : DEFAULT_LOCATION

  return (
    <LocationProvider location={location}>
      <Header />
      <main className="min-h-screen bg-slate-50 flex items-center justify-center py-24 px-4">
        <PaymentRedirect registrationId={id} />
      </main>
      <Footer />
    </LocationProvider>
  )
}

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-500">Načítání...</div>}>
      <PaymentContent id={id} />
    </Suspense>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/platba/\[id\]/page.tsx
git commit -m "feat: replace PaymentMock with PaymentRedirect in payment page"
```

---

## Task 10: Fix Confirmation Page Text

**Files:**
- Modify: `src/components/registration/RegistrationConfirmation.tsx`

- [ ] **Step 1: Fix aspirational email text**

In `src/components/registration/RegistrationConfirmation.tsx`, find line ~92:
```
- ? `Potvrzení jsme odeslali na ${registration.parent_email}.`
+ ? 'Registrace byla úspěšně dokončena.'
```

- [ ] **Step 2: Commit**

```bash
git add src/components/registration/RegistrationConfirmation.tsx
git commit -m "fix: remove aspirational email confirmation text"
```

---

## Task 11: Delete Mock Payment Files

**Files:**
- Delete: `src/components/registration/PaymentMock.tsx`
- Delete: `src/app/api/payment/mock/route.ts`

- [ ] **Step 1: Delete the mock files**

```bash
git rm src/components/registration/PaymentMock.tsx
git rm src/app/api/payment/mock/route.ts
```

- [ ] **Step 2: Verify no other files import PaymentMock**

Search for remaining references:
```bash
grep -r "PaymentMock" src/
```
Expected: no results (we already replaced it in Task 9).

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove mock payment files replaced by Comgate"
```

---

## Task 12: Build Verification

- [ ] **Step 1: Run the linter**

```bash
npm run lint
```
Expected: no errors. Fix any lint issues before proceeding.

- [ ] **Step 2: Run the build**

```bash
npm run build
```
Expected: build succeeds with no errors. The build verifies TypeScript types, imports, and Next.js page structure.

- [ ] **Step 3: Fix any build errors**

Common issues to check:
- Missing imports (check all new files)
- TypeScript type errors (especially Supabase column types)
- Next.js dynamic route params types

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build issues from Comgate integration"
```

---

## Task 13: Local Smoke Test

This requires Comgate sandbox credentials. Skip if credentials aren't available yet.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test the payment redirect flow**

1. Navigate to a KV camp registration page
2. Fill out registration form (all 4 steps)
3. Click "Přejít k platbě"
4. Verify: PaymentRedirect shows loading spinner
5. Verify: browser redirects to Comgate gateway (or shows error if no credentials)

- [ ] **Step 3: Test webhook endpoint locally**

Using curl to simulate a Comgate webhook:
```bash
curl -X POST http://localhost:3000/api/payment/webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "transId=test123&status=PAID&merchant=123456"
```
Expected: 200 OK response (even though verification will fail — it should log the error, not crash).

- [ ] **Step 4: Test return page states**

Navigate to `/platba/navrat?id=nonexistent-id`
Expected: shows error state ("Nepodařilo se ověřit stav platby").

- [ ] **Step 5: Test status endpoint**

```bash
curl http://localhost:3000/api/payment/status/nonexistent-id
```
Expected: 404 with `{"error":"Registration not found"}`
