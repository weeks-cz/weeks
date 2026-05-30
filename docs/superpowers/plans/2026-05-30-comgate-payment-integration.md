# Comgate Payment Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mock payment with a real Comgate bank-transfer integration (callback as source of truth) and add the mandatory e-shop legal content so Comgate can verify and enable live payments.

**Architecture:** A server-only `lib/comgate.ts` isolates all Comgate protocol knowledge. `/platba/[id]` calls `POST /api/payment/comgate/create` (server derives the price from a trusted source, calls Comgate `create`, stores `transId`, returns the gateway redirect URL). Comgate notifies the public `POST /api/payment/comgate/callback` (authoritative — verifies via `status`, updates DB idempotently). The return page polls the public `GET /api/payment/comgate/status` for instant UI. Middleware exposes legal pages + callback/status publicly while keeping the order flow behind basic auth.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Zod, Supabase (service-role server client), Vitest (added here for unit tests), Comgate v1.0 REST protocol.

---

## File Structure

**New:**
- `vitest.config.ts` — Vitest config (node environment, `src` alias).
- `src/lib/comgate.ts` — server-only Comgate client: config, price conversion, request builder, `createPayment`, `getStatus`, status mapping, callback verification.
- `src/lib/comgate.test.ts` — unit tests for the pure logic in `comgate.ts`.
- `src/lib/payment-pricing.ts` — server-side trusted price lookup (`getTrustedPriceKc`).
- `src/lib/payment-pricing.test.ts` — unit tests for price lookup.
- `src/lib/middleware-auth.ts` — extracted pure path-classification logic (`isPublicPath`, `isProtectedPath`).
- `src/lib/middleware-auth.test.ts` — unit tests for path classification.
- `src/app/api/payment/comgate/create/route.ts` — create payment (behind auth).
- `src/app/api/payment/comgate/callback/route.ts` — Comgate notification (public).
- `src/app/api/payment/comgate/status/route.ts` — status poll for return page (public).
- `src/components/registration/PaymentRedirect.tsx` — replaces `PaymentMock`.
- `docs/superpowers/sql/2026-05-30-comgate-trans-id.sql` — manual migration.

**Modified:**
- `src/middleware.ts` — use `lib/middleware-auth.ts`; add public carve-outs.
- `src/app/platba/[id]/page.tsx` — render `PaymentRedirect`.
- `src/components/registration/RegistrationConfirmation.tsx` — read real status, fix email text.
- `src/app/karlovy-vary/podminky/page.tsx` — bank-transfer-only, Comgate operator, fix GDPR link, address.
- `src/app/karlovy-vary/gdpr/page.tsx` — Comgate processor, address.
- `src/app/podminky/page.tsx` — soften "není e-shop", add KV link.
- `src/app/gdpr/page.tsx` — add KV note/link.
- `package.json` — add `test` script + Vitest dev deps.

**Deleted:**
- `src/app/api/payment/mock/route.ts`
- `src/components/registration/PaymentMock.tsx`

---

## Task 1: Add Vitest test infrastructure

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Vitest**

Run:
```bash
npm install -D vitest@^2
```
Expected: adds `vitest` to devDependencies, no errors.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
```

- [ ] **Step 3: Add `test` script to `package.json`**

In the `"scripts"` block add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Create a temporary smoke test to verify the runner**

Create `src/lib/_smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest'

describe('vitest', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 5: Run it**

Run: `npm test`
Expected: 1 passing test.

- [ ] **Step 6: Delete the smoke test and commit**

```bash
rm src/lib/_smoke.test.ts
git add package.json package-lock.json vitest.config.ts
git commit -m "test: add Vitest for unit testing pure logic"
```

---

## Task 2: Price conversion + Comgate status mapping (pure logic)

**Files:**
- Create: `src/lib/comgate.ts`
- Test: `src/lib/comgate.test.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/comgate.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { korunyToHalere, mapComgateStatus } from './comgate'

describe('korunyToHalere', () => {
  it('converts koruny to integer haléře', () => {
    expect(korunyToHalere(2990)).toBe(299000)
    expect(korunyToHalere(1490)).toBe(149000)
    expect(korunyToHalere(4990)).toBe(499000)
  })
  it('rounds to whole haléře', () => {
    expect(korunyToHalere(10.005)).toBe(1001)
  })
})

describe('mapComgateStatus', () => {
  it('maps PAID to paid', () => {
    expect(mapComgateStatus('PAID')).toBe('paid')
  })
  it('maps CANCELLED to cancelled', () => {
    expect(mapComgateStatus('CANCELLED')).toBe('cancelled')
  })
  it('maps PENDING and AUTHORIZED and unknown to pending', () => {
    expect(mapComgateStatus('PENDING')).toBe('pending')
    expect(mapComgateStatus('AUTHORIZED')).toBe('pending')
    expect(mapComgateStatus('WHATEVER')).toBe('pending')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/comgate.test.ts`
Expected: FAIL — cannot find module './comgate' / exports undefined.

- [ ] **Step 3: Create `src/lib/comgate.ts` with the functions**

```ts
import 'server-only'

export type PaymentStatus = 'paid' | 'cancelled' | 'pending'

/** Comgate accepts price in haléře as an integer (2990 Kč -> 299000). */
export function korunyToHalere(koruny: number): number {
  return Math.round(koruny * 100)
}

/** Map a Comgate status string to our internal payment_status value. */
export function mapComgateStatus(comgateStatus: string): PaymentStatus {
  switch (comgateStatus) {
    case 'PAID':
      return 'paid'
    case 'CANCELLED':
      return 'cancelled'
    default:
      // PENDING, AUTHORIZED, or anything unexpected -> treat as not-yet-paid
      return 'pending'
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/comgate.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/comgate.ts src/lib/comgate.test.ts
git commit -m "feat(comgate): price-to-haléře conversion and status mapping"
```

---

## Task 3: Comgate config + create-request builder (pure logic)

**Files:**
- Modify: `src/lib/comgate.ts`
- Test: `src/lib/comgate.test.ts`

- [ ] **Step 1: Add failing tests**

Append to `src/lib/comgate.test.ts`:
```ts
import { buildCreateParams, type ComgateConfig } from './comgate'

const cfg: ComgateConfig = { merchant: 'M123', secret: 'S456', test: true, method: 'ALL' }

describe('buildCreateParams', () => {
  it('builds form params with price in haléře and prepareOnly', () => {
    const p = buildCreateParams(
      { registrationId: 'reg-1', priceKc: 2990, label: 'Tábor', email: 'a@b.cz', returnBaseUrl: 'https://weeks.cz' },
      cfg
    )
    expect(p.get('merchant')).toBe('M123')
    expect(p.get('secret')).toBe('S456')
    expect(p.get('price')).toBe('299000')
    expect(p.get('curr')).toBe('CZK')
    expect(p.get('test')).toBe('true')
    expect(p.get('prepareOnly')).toBe('true')
    expect(p.get('method')).toBe('ALL')
    expect(p.get('refId')).toBe('reg-1')
    expect(p.get('email')).toBe('a@b.cz')
    expect(p.get('lang')).toBe('cs')
    expect(p.get('country')).toBe('CZ')
  })
  it('points return URLs back at the registration and payment pages', () => {
    const p = buildCreateParams(
      { registrationId: 'reg-1', priceKc: 2990, label: 'Tábor', email: 'a@b.cz', returnBaseUrl: 'https://weeks.cz' },
      cfg
    )
    expect(p.get('url_paid')).toBe('https://weeks.cz/registrace/reg-1')
    expect(p.get('url_pending')).toBe('https://weeks.cz/registrace/reg-1')
    expect(p.get('url_cancelled')).toBe('https://weeks.cz/platba/reg-1')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/comgate.test.ts`
Expected: FAIL — `buildCreateParams` / `ComgateConfig` not exported.

- [ ] **Step 3: Implement in `src/lib/comgate.ts`**

Add:
```ts
export interface ComgateConfig {
  merchant: string
  secret: string
  test: boolean
  method: string
}

/** Reads Comgate config from env. Throws if required vars are missing. */
export function getComgateConfig(): ComgateConfig {
  const merchant = process.env.COMGATE_MERCHANT
  const secret = process.env.COMGATE_SECRET
  if (!merchant || !secret) {
    throw new Error('Comgate config missing: COMGATE_MERCHANT and COMGATE_SECRET are required.')
  }
  return {
    merchant,
    secret,
    test: process.env.COMGATE_TEST !== 'false', // default to test mode unless explicitly false
    // "ALL" relies on the portal restricting to Comgate-Risk-approved methods (bank transfers).
    // Pin a specific method here later to enable cards. Verify exact codes at apidoc.comgate.cz.
    method: process.env.COMGATE_METHOD || 'ALL',
  }
}

export interface CreatePaymentInput {
  registrationId: string
  priceKc: number
  label: string
  email: string
  returnBaseUrl: string
}

export function buildCreateParams(input: CreatePaymentInput, cfg: ComgateConfig): URLSearchParams {
  return new URLSearchParams({
    merchant: cfg.merchant,
    secret: cfg.secret,
    price: String(korunyToHalere(input.priceKc)),
    curr: 'CZK',
    label: input.label,
    refId: input.registrationId,
    method: cfg.method,
    email: input.email,
    prepareOnly: 'true',
    test: String(cfg.test),
    lang: 'cs',
    country: 'CZ',
    url_paid: `${input.returnBaseUrl}/registrace/${input.registrationId}`,
    url_pending: `${input.returnBaseUrl}/registrace/${input.registrationId}`,
    url_cancelled: `${input.returnBaseUrl}/platba/${input.registrationId}`,
  })
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/comgate.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/comgate.ts src/lib/comgate.test.ts
git commit -m "feat(comgate): config loader and create-request builder"
```

---

## Task 4: Response parsing, callback verification, network calls

**Files:**
- Modify: `src/lib/comgate.ts`
- Test: `src/lib/comgate.test.ts`

- [ ] **Step 1: Add failing tests for parsing + verification**

Append to `src/lib/comgate.test.ts`:
```ts
import { parseCreateResponse, verifyCallbackIdentity } from './comgate'

describe('parseCreateResponse', () => {
  it('extracts transId and redirect from a code=0 response', () => {
    const body = 'code=0&message=OK&transId=ABCD-1234&redirect=' +
      encodeURIComponent('https://payments.comgate.cz/client/instructions/index?id=ABCD-1234')
    const r = parseCreateResponse(body)
    expect(r.transId).toBe('ABCD-1234')
    expect(r.redirect).toBe('https://payments.comgate.cz/client/instructions/index?id=ABCD-1234')
  })
  it('throws on a non-zero code', () => {
    expect(() => parseCreateResponse('code=1409&message=invalid+price')).toThrow(/1409/)
  })
})

describe('verifyCallbackIdentity', () => {
  it('accepts when secret and merchant match config', () => {
    const params = new URLSearchParams({ secret: 'S456', merchant: 'M123', transId: 'X', status: 'PAID' })
    expect(verifyCallbackIdentity(params, cfg)).toBe(true)
  })
  it('rejects when secret is wrong', () => {
    const params = new URLSearchParams({ secret: 'WRONG', merchant: 'M123' })
    expect(verifyCallbackIdentity(params, cfg)).toBe(false)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/comgate.test.ts`
Expected: FAIL — functions not exported.

- [ ] **Step 3: Implement parsing, verification, and the fetch-based calls**

Add:
```ts
const CREATE_URL = 'https://payments.comgate.cz/v1.0/create'
const STATUS_URL = 'https://payments.comgate.cz/v1.0/status'

export interface CreateResult {
  transId: string
  redirect: string
}

export function parseCreateResponse(body: string): CreateResult {
  const params = new URLSearchParams(body)
  const code = params.get('code')
  if (code !== '0') {
    throw new Error(`Comgate create failed: code=${code} message=${params.get('message') ?? ''}`)
  }
  const transId = params.get('transId')
  const redirect = params.get('redirect')
  if (!transId || !redirect) {
    throw new Error('Comgate create response missing transId or redirect')
  }
  return { transId, redirect }
}

/** Comgate includes the merchant secret in its callback; verify it matches ours. */
export function verifyCallbackIdentity(params: URLSearchParams, cfg: ComgateConfig): boolean {
  return params.get('secret') === cfg.secret && params.get('merchant') === cfg.merchant
}

export async function createPayment(input: CreatePaymentInput, cfg = getComgateConfig()): Promise<CreateResult> {
  const res = await fetch(CREATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: buildCreateParams(input, cfg).toString(),
  })
  return parseCreateResponse(await res.text())
}

export async function getStatus(transId: string, cfg = getComgateConfig()): Promise<PaymentStatus> {
  const res = await fetch(STATUS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ merchant: cfg.merchant, secret: cfg.secret, transId }).toString(),
  })
  const params = new URLSearchParams(await res.text())
  if (params.get('code') !== '0') {
    throw new Error(`Comgate status failed: code=${params.get('code')} message=${params.get('message') ?? ''}`)
  }
  return mapComgateStatus(params.get('status') ?? '')
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/comgate.test.ts`
Expected: PASS (all comgate tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/comgate.ts src/lib/comgate.test.ts
git commit -m "feat(comgate): response parsing, callback verification, create/status calls"
```

---

## Task 5: Trusted server-side price lookup

**Files:**
- Create: `src/lib/payment-pricing.ts`
- Test: `src/lib/payment-pricing.test.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/payment-pricing.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { getTrustedPriceKc } from './payment-pricing'

describe('getTrustedPriceKc', () => {
  it('returns the configured price for a known KV program', () => {
    expect(getTrustedPriceKc('karlovy-vary', 'mix')).toBe(2990)
    expect(getTrustedPriceKc('karlovy-vary', 'letni-primestsky')).toBe(4990)
  })
  it('throws for an unknown program (never trust client-supplied price)', () => {
    expect(() => getTrustedPriceKc('karlovy-vary', 'nonexistent')).toThrow()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/payment-pricing.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement using the existing locations config**

`src/lib/payment-pricing.ts`:
```ts
import { getLocationById } from './locations'

/**
 * Trusted price source for payments. Resolves price from server-side location
 * config keyed by program id — NEVER from a client-supplied amount.
 */
export function getTrustedPriceKc(locationId: string, program: string): number {
  const location = getLocationById(locationId)
  const cfg = location.programs.find((p) => p.id === program)
  if (!cfg) {
    throw new Error(`No trusted price for location=${locationId} program=${program}`)
  }
  return cfg.price
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/payment-pricing.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/payment-pricing.ts src/lib/payment-pricing.test.ts
git commit -m "feat(payment): trusted server-side price lookup"
```

---

## Task 6: Manual SQL migration file — OBSOLETE (column already exists)

> **Correction (implementation):** The `registrations` table already has `comgate_payment_id` and `comgate_status` columns via `supabase/migrations/010_registrations_kv.sql`. No new column or manual SQL is needed. The code uses `comgate_payment_id` (transId) and `comgate_status` (raw Comgate status). The SQL file below was created then deleted; this task is a no-op.

**Files:**
- Create: `docs/superpowers/sql/2026-05-30-comgate-trans-id.sql`

- [ ] **Step 1: Write the SQL file**

```sql
-- Manual migration — run in the Supabase SQL editor for the shared project.
-- The registrations table is owned/managed by weeks-hub; this only adds a column.
alter table public.registrations
  add column if not exists comgate_trans_id text;

create index if not exists registrations_comgate_trans_id_idx
  on public.registrations (comgate_trans_id);
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/sql/2026-05-30-comgate-trans-id.sql
git commit -m "chore(db): SQL to add comgate_trans_id column (manual run)"
```

> **Note for executor:** This SQL must be run manually in Supabase before the create/callback routes work end-to-end. It does not block writing or unit-testing the routes.

---

## Task 7: Create-payment API route

**Files:**
- Create: `src/app/api/payment/comgate/create/route.ts`

- [ ] **Step 1: Implement the route**

```ts
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

    // Trusted price — derived server-side, never from the stored client amount.
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/payment/comgate/create/route.ts
git commit -m "feat(comgate): create-payment API route with server-side pricing"
```

---

## Task 8: Callback API route (public, authoritative)

**Files:**
- Create: `src/app/api/payment/comgate/callback/route.ts`

- [ ] **Step 1: Implement the route**

```ts
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

    // Re-fetch authoritative status from Comgate rather than trusting the payload.
    const status = await getStatus(transId, cfg)

    const supabase = createServerClient()
    // Idempotent: setting the same state twice is harmless.
    const update: Record<string, unknown> = { payment_status: status }
    if (status === 'paid') {
      update.status = 'paid'
      update.payment_method = 'comgate_bank_transfer'
      update.payment_completed_at = new Date().toISOString()
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/payment/comgate/callback/route.ts
git commit -m "feat(comgate): public callback route (authoritative, idempotent)"
```

---

## Task 9: Status API route (public, for return page)

**Files:**
- Create: `src/app/api/payment/comgate/status/route.ts`

- [ ] **Step 1: Implement the route**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Lightweight read of the DB payment state for the return page. The callback is
// what actually writes state; this just reflects it for the UI.
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('registrations')
    .select('payment_status')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ paymentStatus: data.payment_status })
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/payment/comgate/status/route.ts
git commit -m "feat(comgate): public status route for the return page"
```

---

## Task 10: PaymentRedirect component + wire /platba; delete mock

**Files:**
- Create: `src/components/registration/PaymentRedirect.tsx`
- Modify: `src/app/platba/[id]/page.tsx`
- Delete: `src/components/registration/PaymentMock.tsx`, `src/app/api/payment/mock/route.ts`

- [ ] **Step 1: Create `PaymentRedirect.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Landmark, Loader2, Lock, AlertTriangle } from 'lucide-react'

interface PaymentRedirectProps {
  registrationId: string
}

export function PaymentRedirect({ registrationId }: PaymentRedirectProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePay() {
    setIsProcessing(true)
    setError(null)
    try {
      const res = await fetch('/api/payment/comgate/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      })
      const data = await res.json()
      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error || 'Platbu se nepodařilo zahájit')
      }
      window.location.href = data.redirectUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Platbu se nepodařilo zahájit')
      setIsProcessing(false)
    }
  }

  const isTest = process.env.NEXT_PUBLIC_COMGATE_TEST !== 'false'

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      {isTest && (
        <div className="bg-amber-50 border border-amber-200 rounded-t-2xl px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm font-medium text-amber-800">TESTOVACÍ REŽIM — žádná reálná platba nebude provedena</p>
        </div>
      )}
      <div className={`bg-white border border-gray-200 p-8 shadow-lg ${isTest ? 'rounded-b-2xl border-t-0' : 'rounded-2xl'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <Landmark className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Platba bankovním převodem</h2>
            <p className="text-sm text-gray-500">Zabezpečená platební brána Comgate</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Po kliknutí budete přesměrováni na platební bránu Comgate, kde platbu dokončíte
          zrychleným bankovním převodem přes tlačítko své banky.
        </p>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {isProcessing ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Přesměrovávám na bránu…</>
          ) : (
            <><Lock className="w-5 h-5" /> Přejít k platbě</>
          )}
        </button>
        <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> Platbu zpracovává Comgate a.s.
        </p>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Update `/platba/[id]/page.tsx` to use it**

Replace the `PaymentMock` import and usage:
```tsx
import { PaymentRedirect } from '@/components/registration/PaymentRedirect'
```
and in `PaymentContent`, replace `<PaymentMock registrationId={id} />` with:
```tsx
<PaymentRedirect registrationId={id} />
```

- [ ] **Step 3: Delete the mock files**

```bash
git rm src/components/registration/PaymentMock.tsx src/app/api/payment/mock/route.ts
```

- [ ] **Step 4: Verify build + no stale references**

Run: `npx tsc --noEmit`
Expected: no errors. (If any file still imports `PaymentMock` or `/api/payment/mock`, fix it.)

Run: `git grep -n "PaymentMock\|payment/mock" -- src` 
Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add src/components/registration/PaymentRedirect.tsx src/app/platba/[id]/page.tsx
git commit -m "feat(comgate): PaymentRedirect to gateway; remove mock payment"
```

---

## Task 11: Confirmation page reads real status + fix email text

**Files:**
- Modify: `src/components/registration/RegistrationConfirmation.tsx`

- [ ] **Step 1: Read the current component**

Run: `sed -n '1,200p' src/components/registration/RegistrationConfirmation.tsx`
Identify: where it shows the success message and the "Potvrzení jsme odeslali na email" text.

- [ ] **Step 2: Fetch real payment status on mount**

Add near the top of the component body (after existing hooks):
```tsx
const [paymentStatus, setPaymentStatus] = useState<string | null>(null)

useEffect(() => {
  fetch(`/api/payment/comgate/status?id=${registrationId}`)
    .then((r) => r.json())
    .then((d) => setPaymentStatus(d.paymentStatus ?? null))
    .catch(() => setPaymentStatus(null))
}, [registrationId])
```
Ensure `useState`/`useEffect` are imported from `react`.

- [ ] **Step 3: Branch the UI on status**

- When `paymentStatus === 'paid'`: show the success confirmation.
- When `paymentStatus === 'pending'` or `null`: show "Platbu ověřujeme — jakmile ji banka potvrdí, dáme vám vědět." (no claim that email was sent).
- When `paymentStatus === 'cancelled'`: show "Platba nebyla dokončena." with a link back to `/platba/${registrationId}`.

- [ ] **Step 4: Remove/replace the misleading email line**

Replace any text asserting "Potvrzení jsme odeslali na email" with:
```tsx
<p className="text-gray-600">
  Registrace byla uložena. Potvrzovací e-maily zatím nerozesíláme — v případě dotazů nás
  kontaktujte na info@weeks.cz.
</p>
```

- [ ] **Step 5: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/registration/RegistrationConfirmation.tsx
git commit -m "fix(registration): show real payment status; remove false email claim"
```

---

## Task 12: Middleware path classification (extract + test + carve-outs)

**Files:**
- Create: `src/lib/middleware-auth.ts`, `src/lib/middleware-auth.test.ts`
- Modify: `src/middleware.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/middleware-auth.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { isPublicPath, isProtectedPath } from './middleware-auth'

describe('isPublicPath', () => {
  it('exposes KV legal pages publicly', () => {
    expect(isPublicPath('/karlovy-vary/gdpr')).toBe(true)
    expect(isPublicPath('/karlovy-vary/podminky')).toBe(true)
  })
  it('exposes the Comgate callback and status routes publicly', () => {
    expect(isPublicPath('/api/payment/comgate/callback')).toBe(true)
    expect(isPublicPath('/api/payment/comgate/status')).toBe(true)
  })
  it('does NOT expose the rest of KV or the create route', () => {
    expect(isPublicPath('/karlovy-vary')).toBe(false)
    expect(isPublicPath('/karlovy-vary/tabor-chytrych-technologii')).toBe(false)
    expect(isPublicPath('/api/payment/comgate/create')).toBe(false)
  })
})

describe('isProtectedPath', () => {
  it('protects the order flow but not its public carve-outs', () => {
    expect(isProtectedPath('/karlovy-vary')).toBe(true)
    expect(isProtectedPath('/registrace/abc')).toBe(true)
    expect(isProtectedPath('/platba/abc')).toBe(true)
    expect(isProtectedPath('/api/payment/comgate/create')).toBe(true)
    expect(isProtectedPath('/karlovy-vary/gdpr')).toBe(false)
    expect(isProtectedPath('/api/payment/comgate/callback')).toBe(false)
  })
  it('leaves Praha public pages alone', () => {
    expect(isProtectedPath('/')).toBe(false)
    expect(isProtectedPath('/program')).toBe(false)
    expect(isProtectedPath('/gdpr')).toBe(false)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/middleware-auth.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/middleware-auth.ts`**

```ts
// Path classification for the KV pre-launch basic auth. Public carve-outs win
// over protected prefixes (e.g. /karlovy-vary/gdpr is public even though
// /karlovy-vary is protected).

const PROTECTED_PREFIXES = [
  '/karlovy-vary',
  '/registrace',
  '/platba',
  '/api/register',
  '/api/payment',
]

// Reachable without basic auth: legal pages (mandatory for Comgate) and the
// Comgate callback/status (called by Comgate's server / after gateway return).
const PUBLIC_PATHS = [
  '/karlovy-vary/gdpr',
  '/karlovy-vary/podminky',
  '/api/payment/comgate/callback',
  '/api/payment/comgate/status',
]

function matches(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + '/')
}

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => matches(pathname, p))
}

export function isProtectedPath(pathname: string): boolean {
  if (isPublicPath(pathname)) return false
  return PROTECTED_PREFIXES.some((p) => matches(pathname, p))
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/middleware-auth.test.ts`
Expected: PASS.

- [ ] **Step 5: Refactor `src/middleware.ts` to use it**

Replace the inline `PROTECTED_PREFIXES`/`isProtectedPath` with an import:
```ts
import { isProtectedPath } from '@/lib/middleware-auth'
```
Delete the local `PROTECTED_PREFIXES` array and local `isProtectedPath` function. The line `if (!isProtectedPath(request.nextUrl.pathname))` keeps working unchanged. Update the comment block at the top to mention the public carve-outs (legal pages + Comgate callback/status).

- [ ] **Step 6: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/lib/middleware-auth.ts src/lib/middleware-auth.test.ts src/middleware.ts
git commit -m "feat(middleware): public carve-outs for legal pages + Comgate callback"
```

---

## Task 13: KV VOP content updates

**Files:**
- Modify: `src/app/karlovy-vary/podminky/page.tsx`

- [ ] **Step 1: Rewrite §6.1 (payment methods) to bank transfer only**

Replace the §6.1 block content (currently listing card/Apple/Google Pay) with:
```tsx
<h3 className="text-base font-semibold text-gray-900 mb-2">6.1 Způsob platby</h3>
<p className="text-gray-700 text-base">
  Platba probíhá zrychleným bankovním převodem prostřednictvím platební brány Comgate.
  Po odeslání přihlášky budete přesměrováni na bránu, kde platbu dokončíte tlačítkem své banky.
</p>
```

- [ ] **Step 2: Add the payment service operator to §6**

Add a new block inside §6 (after 6.3):
```tsx
<div className="bg-white p-5 rounded-lg border border-gray-200">
  <h3 className="text-base font-semibold text-gray-900 mb-2">6.4 Provozovatel platební brány</h3>
  <p className="text-gray-700 text-base">
    Platební služby zajišťuje společnost <strong>Comgate a.s.</strong>, IČ: 27924505,
    DIČ: CZ27924505, se sídlem Gočárova třída 1754/48b, Pražské Předměstí, 500 02 Hradec Králové.
  </p>
</div>
```

- [ ] **Step 3: Fix the GDPR link in §10**

Change `href="/gdpr"` to `href="/karlovy-vary/gdpr"` in §10.

- [ ] **Step 4: Add "Hlubočepy" to the pořadatel address (§2 and §15)**

Change `Kováříkova 1145/11, Praha 5, 152 00` to `Kováříkova 1145/11, Hlubočepy, 152 00 Praha 5` in both §2 and §15.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app/karlovy-vary/podminky/page.tsx
git commit -m "content(kv): VOP bank-transfer only, Comgate operator, fix GDPR link"
```

---

## Task 14: KV GDPR content updates

**Files:**
- Modify: `src/app/karlovy-vary/gdpr/page.tsx`

- [ ] **Step 1: Add Comgate to the processors list (§8)**

In the §8 `<ul>` of processors, add:
```tsx
<li><strong>Comgate a.s.</strong> – provozovatel platební brány (zpracování platby), IČ 27924505</li>
```

- [ ] **Step 2: Add "Hlubočepy" to the správce address where present**

If §1 / §12 lists the address, align it to `Kováříkova 1145/11, Hlubočepy, 152 00 Praha 5`. (Current §1 lists only IČO; add the sídlo line for completeness:)
```tsx
<p className="text-gray-700 text-base mb-1">Sídlo: Kováříkova 1145/11, Hlubočepy, 152 00 Praha 5</p>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/app/karlovy-vary/gdpr/page.tsx
git commit -m "content(kv): add Comgate as payment processor in GDPR; add sídlo"
```

---

## Task 15: Praha legal pages — soften "není e-shop" + KV link

**Files:**
- Modify: `src/app/podminky/page.tsx`, `src/app/gdpr/page.tsx`

- [ ] **Step 1: Soften the "není e-shop" notice in Praha /podminky §3**

Replace the "Důležité upozornění" block text with:
```tsx
<p className="text-primary-900 font-medium mb-2">Důležité upozornění</p>
<p className="text-primary-800 text-base">
  Registrace a platby pro tábory v Praze probíhají výhradně přes registrační systém
  DDM Praha 6. Online platby na tomto webu se týkají pouze táborů v Karlových Varech,
  pro které platí samostatné{' '}
  <Link href="/karlovy-vary/podminky" className="underline">obchodní podmínky</Link> a{' '}
  <Link href="/karlovy-vary/gdpr" className="underline">zásady ochrany osobních údajů</Link>,
  jejichž provozovatelem je Lukáš Kubík (IČ 24878511).
</p>
```
(Ensure `Link` is imported — it already is.)

- [ ] **Step 2: Add the same clarifying note to Praha /gdpr §2 (Důležitá informace block)**

Append to the existing "Důležitá informace" block:
```tsx
<p className="text-primary-800 text-base mt-3">
  Pro tábory v Karlových Varech (provozovatel Lukáš Kubík, IČ 24878511) platí samostatné{' '}
  <Link href="/karlovy-vary/gdpr" className="underline">zásady ochrany osobních údajů</Link>.
</p>
```
(Add `import Link from 'next/link'` if not present — verify the existing imports.)

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/app/podminky/page.tsx src/app/gdpr/page.tsx
git commit -m "content(praha): clarify KV online payments + link KV legal pages"
```

---

## Task 16: Final verification + env documentation

**Files:**
- Modify: `.env.example` (create if absent)

- [ ] **Step 1: Document env vars in `.env.example`**

Append (create the file if it does not exist):
```
# Comgate payment gateway (Karlovy Vary registration)
COMGATE_MERCHANT=
COMGATE_SECRET=
COMGATE_TEST=true
COMGATE_METHOD=ALL
# Optional client-side hint to show the test-mode banner on /platba
NEXT_PUBLIC_COMGATE_TEST=true
```

- [ ] **Step 2: Run the full check**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: all unit tests pass, no type errors, build succeeds.

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "docs: document Comgate env vars"
```

- [ ] **Step 4: Manual E2E checklist (requires real env + SQL applied)**

Document for the operator (do not automate):
1. Run the SQL from Task 6 in Supabase.
2. Set `COMGATE_MERCHANT`, `COMGATE_SECRET`, `COMGATE_TEST=true`, `COMGATE_METHOD` locally / on Vercel.
3. `npm run dev`, fill the KV registration form → land on `/platba/[id]`.
4. Click "Přejít k platbě" → redirected to the Comgate test gateway → complete a test bank transfer.
5. Verify: DB row `payment_status='paid'`, `status='paid'`, `payment_completed_at` set; return page shows the paid confirmation.
6. **Closed-tab test:** repeat, but close the tab on the gateway after paying → confirm the callback still set the row to `paid`.
7. Confirm `/karlovy-vary/gdpr` and `/karlovy-vary/podminky` load WITHOUT basic auth; `/karlovy-vary` and `/registrace` still prompt for it.
8. Send Comgate the basic-auth credentials for the order-flow walkthrough.

---

## Self-Review

**Spec coverage:**
- Comgate integration (variant C: create → redirect → callback authoritative + status on return) → Tasks 2–4, 7–11. ✓
- Bank-transfer-only, cards via flag → `COMGATE_METHOD` (Task 3), VOP §6.1 (Task 13). ✓
- Comgate as operator (a.s., IČ, DIČ, address) → Task 13 (§6.4) + Task 14 (processor). ✓
- Server-side trusted price (haléře) → Tasks 2, 5, 7. ✓
- Middleware public carve-outs (legal + callback/status) → Task 12. ✓
- KV GDPR link fix + Hlubočepy → Tasks 13, 14. ✓
- Praha pages soften + link → Task 15. ✓
- Delete mock → Task 10. ✓
- Manual SQL → Task 6. ✓
- Fix misleading email text → Task 11. ✓
- Out of scope (emails, invoices, refunds admin, live cards) → not implemented (correct). ✓

**Placeholder scan:** No "TBD/TODO/handle edge cases" — every code step shows code. Content tasks specify exact replacement text. ✓

**Type consistency:** `PaymentStatus = 'paid'|'cancelled'|'pending'` used consistently across `mapComgateStatus`, callback, status route. `CreatePaymentInput`/`ComgateConfig`/`CreateResult` defined in Task 3–4 and consumed in Task 7–8. `getTrustedPriceKc(locationId, program)` defined Task 5, used Task 7. `isPublicPath`/`isProtectedPath` defined Task 12, used in middleware. ✓

**Known follow-ups (not blockers):** KV VOP §5 mentions a "Jednodenní 1 490 Kč" option that has no matching program in `locations.ts` (KV has only `letni-primestsky` 4990 and `mix` 2990) — flag to founder to reconcile content vs. config. Exact `COMGATE_METHOD` bank-only code + endpoint version to confirm against apidoc.comgate.cz during Task 4/7.
