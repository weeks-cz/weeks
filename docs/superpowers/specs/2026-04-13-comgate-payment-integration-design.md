# Comgate Payment Gateway Integration — Design Spec

**Date:** 2026-04-13
**Status:** Draft — awaiting user review
**Branch:** `feature/multi-city-expansion`

## Context

The `feature/multi-city-expansion` branch has a complete registration system with a mock payment gateway. This spec designs the replacement of `PaymentMock` with a real Comgate integration.

**Current mock flow:**
```
RegistrationForm → POST /api/register → DB insert (pending)
  → redirect /platba/{id} → PaymentMock (fake card form)
  → POST /api/payment/mock → DB update (paid)
  → redirect /registrace/{id} → RegistrationConfirmation
```

## Payment Flow with Comgate

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User fills RegistrationForm, clicks "Přejít k platbě"       │
│    → POST /api/register → creates registration (status=pending) │
│    → returns { registrationId, paymentUrl: "/platba/{id}" }     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ 2. /platba/{id} page loads → auto-calls POST /api/payment/create│
│    Backend: creates Comgate payment via API                      │
│    → saves comgate_trans_id to registration                      │
│    → returns { redirectUrl: "https://pay1.comgate.cz/..." }     │
│    Frontend: redirects browser to Comgate gateway                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ 3. Customer pays on Comgate (cards, bank transfer, Apple Pay)   │
│    → Comgate sends webhook to POST /api/payment/webhook         │
│    → Comgate redirects customer to /platba/navrat?id={regId}    │
│    (These happen roughly simultaneously)                         │
└───────────┬───────────────────────────────────┬─────────────────┘
            │                                   │
┌───────────▼───────────┐   ┌───────────────────▼─────────────────┐
│ 4a. Webhook handler   │   │ 4b. Return page /platba/navrat      │
│ Verifies via Comgate  │   │ Calls GET /api/payment/status/{id}  │
│ GET /v2.0/status      │   │ Shows loading → checks DB status    │
│ Updates DB:           │   │ If paid → redirect /registrace/{id} │
│   payment_status=done │   │ If pending → poll, then show retry  │
│   status=paid         │   │ If cancelled → show error + retry   │
└───────────────────────┘   └───────────────────┬─────────────────┘
                                                │
                            ┌───────────────────▼─────────────────┐
                            │ 5. /registrace/{id} — Confirmation  │
                            │ (existing component, unchanged)      │
                            └─────────────────────────────────────┘
```

## Files to Change/Create

### New files
| File | Purpose |
|------|---------|
| `src/lib/comgate.ts` | Comgate API client (create payment, verify status, refund) |
| `src/app/api/payment/create/route.ts` | Creates Comgate payment, returns redirect URL |
| `src/app/api/payment/webhook/route.ts` | Receives Comgate push notifications, verifies, updates DB |
| `src/app/api/payment/status/[id]/route.ts` | Returns current payment status for a registration |
| `src/app/platba/navrat/page.tsx` | Return page after Comgate redirect |
| `src/components/registration/PaymentRedirect.tsx` | Loading screen while creating Comgate payment |
| `supabase/migrations/010_comgate_fields.sql` | Add comgate_trans_id + payment_error columns |

### Modified files
| File | Change |
|------|--------|
| `src/app/platba/[id]/page.tsx` | Replace `PaymentMock` with `PaymentRedirect` |
| `src/lib/registration.ts` | Add payment status types |

### Deleted files
| File | Reason |
|------|--------|
| `src/components/registration/PaymentMock.tsx` | Replaced by real payment |
| `src/app/api/payment/mock/route.ts` | Replaced by `/api/payment/create` + webhook |

## Component Details

### 1. `src/lib/comgate.ts` — Comgate API Client

Thin wrapper around Comgate REST API. No npm package needed — the API is simple HTTP.

```typescript
// Core functions:
createPayment(params: {
  registrationId: string    // our internal ID → refId
  amount: number            // in CZK (we convert to halere internally)
  label: string             // e.g. "MIX tábor - 4.-5.7.2026"
  email: string             // parent email
  returnUrl: string         // /platba/navrat?id={registrationId}
}) → { transId: string, redirectUrl: string }

getPaymentStatus(transId: string) → {
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'AUTHORIZED'
  // + other fields
}

refundPayment(transId: string, amount?: number) → { success: boolean }
```

**API details:**
- Endpoint: `POST https://payments.comgate.cz/v1.0/create`
- Auth: merchant + secret in POST body
- Price in halere (cents): `2990 Kč → 299000`
- Currency: `CZK`
- Method: `ALL` (let customer choose on Comgate gateway)
- Response: `code=0&transId=XXXX&redirect=https://pay1.comgate.cz/...`

### 2. `src/app/api/payment/create/route.ts`

```
POST /api/payment/create
Body: { registrationId: string }

1. Fetch registration from Supabase (verify exists, status=pending)
2. Call comgate.createPayment(...)
3. Save comgate_trans_id to registration in DB
4. Return { redirectUrl: "https://pay1.comgate.cz/..." }
```

**Idempotency state machine:**
```
registration.status === 'paid'       → return error('Already paid')
registration.status === 'cancelled'  → allow new Comgate payment
registration.status === 'pending' && comgate_trans_id exists
                                     → create new payment (old one expired/cancelled)
registration.status === 'pending' && no comgate_trans_id
                                     → create first payment (normal flow)
```

**Amount validation:** Before creating payment, verify `registration.payment_amount` matches expected program price (guard against price changes between form fill and payment).

### 3. `src/app/api/payment/webhook/route.ts`

```
POST /api/payment/webhook
Body: application/x-www-form-urlencoded (transId, merchant, status, ...)

1. Parse form body
2. Find registration by comgate_trans_id
3. VERIFY: Call comgate.getPaymentStatus(transId) — never trust webhook data alone
4. If verified PAID:
   - Update registration: payment_status='completed', status='paid', payment_method='comgate'
   - payment_completed_at = now()
5. If CANCELLED:
   - Update registration: payment_status='cancelled', payment_error=reason
6. Return 200 OK (required by Comgate — they retry up to 1000× on non-2xx)
```

**Security:**
- Comgate sends webhooks from Cloudflare IPs
- We verify every webhook by calling the status API independently — never trust webhook data alone
- Always return 200 OK to Comgate (even on verification failure) to prevent retry storms; log suspicious requests
- Validate `Content-Type: application/x-www-form-urlencoded` header
- Add timeout (5s) on the verification status API call to prevent hanging

### 4. `src/app/platba/navrat/page.tsx` — Return Page

After payment, Comgate redirects the customer here. This page:

1. Reads `?id={registrationId}` from URL
2. Calls `GET /api/payment/status/{id}`
3. Shows states:
   - **Paid** → green checkmark animation → auto-redirect to `/registrace/{id}` after 2s
   - **Pending** → spinner + "Ověřujeme platbu..." → poll every 3s (max 30s), then show "Platba se zpracovává. Zkontrolujte stav na této stránce později." + link to `/registrace/{id}`
   - **Cancelled/Failed** → red X + "Platba se nezdařila" + "Zkusit znovu" button (creates new payment)

### 5. `src/components/registration/PaymentRedirect.tsx`

Replaces `PaymentMock.tsx`. Simple loading screen:

1. On mount, calls `POST /api/payment/create` with `registrationId`
2. Immediately disables any re-trigger (prevent double-click / double mount)
3. Shows: Comgate logo + "Přesměrováváme na platební bránu..." + spinner
4. On success: `window.location.href = redirectUrl` (full redirect, not Next.js router)
5. On error: "Nepodařilo se vytvořit platbu" + retry button + phone number fallback

No card form — all payment UI is on Comgate's side.

### 6. DB Migration `010_comgate_fields.sql`

```sql
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

## Environment Variables

```env
# Comgate (add to Vercel + .env.local)
COMGATE_MERCHANT_ID=          # 6-digit shop connection ID from portal.comgate.cz
COMGATE_SECRET=               # Password for merchant ID
COMGATE_TEST=true             # "true" for sandbox, remove/false for production
```

No public env vars needed — all Comgate communication is server-side.

## BLOCKER: Vercel IP Whitelisting

Comgate requires whitelisting merchant server IPs for API access. Vercel serverless functions use **dynamic IPs** — this is a potential blocker that must be resolved before implementation.

**Options (ordered by preference):**
1. **Disable IP whitelisting in Comgate portal** — some merchants can opt out; ask during onboarding
2. **Whitelist Vercel's IP ranges** — if Comgate supports CIDR notation, whitelist the `iad1` region range
3. **Lightweight proxy** — route Comgate API calls through Fly.io/Railway/small VPS with fixed IP (~$5/month)
4. **Alternative: GoPay** — if Comgate IP whitelisting proves unworkable, GoPay may not have this restriction

**Action items (must complete BEFORE writing code):**
1. Register Comgate merchant account at comgate.cz
2. Contact Comgate support: "We host on Vercel (serverless). Can we disable IP whitelisting or use CIDR ranges?"
3. Test sandbox access from Vercel deployment
4. If IP whitelisting is strict single-IP only → evaluate proxy cost vs switching to GoPay

**Note:** Comgate sandbox may have different IP policies than production. Test both.

## Race Condition: Webhook vs Return Page

Webhook and customer redirect happen roughly simultaneously. Three scenarios:

1. **Webhook first** (most common): DB already updated when return page polls → shows "paid" immediately
2. **Redirect first**: Return page polls, gets "pending" → keeps polling → webhook arrives → next poll gets "paid"
3. **Neither arrives quickly**: Return page polls for 30s → shows fallback message with link to check later

The status API (`/api/payment/status/[id]`) always reads from DB. No caching. The webhook handler and status API don't need explicit coordination — they both use Supabase as the single source of truth. Supabase row-level updates are atomic.

## Payment Methods Offered

Configure in `createPayment` call:
```
method=ALL
```

This lets the customer choose from all available methods on Comgate's gateway:
- Credit/debit cards (Visa, Mastercard, Maestro)
- Apple Pay, Google Pay
- Czech bank transfers (ČS, KB, ČSOB, Raiffeisen, etc.)
- QR code payments

## Error Handling

| Scenario | Handling |
|----------|----------|
| Comgate API unreachable | Show error on PaymentRedirect, retry button |
| Payment creation fails | Show error + "Kontaktujte nás" fallback with phone number |
| Webhook doesn't arrive | Return page polls status API; after 30s shows "zkontrolujte stav později" + link |
| User closes browser mid-payment | Webhook still fires → DB updated. User can check status via `/registrace/{id}` |
| Double payment attempt | Idempotent: new Comgate payment replaces old trans_id |
| Comgate returns CANCELLED | Show friendly error + retry button on return page |
| Double-click "Přejít k platbě" | PaymentRedirect disables re-trigger on mount; API is idempotent |
| Comgate returns malformed response | Catch in comgate.ts, return generic error, log details |
| Price changed between form and payment | `/api/payment/create` validates amount against program config |
| Refund needed | Admin calls refund via Supabase dashboard or future admin UI |

## Email Confirmation (Future — NOT in this iteration)

Currently not in scope, but the architecture supports it:
- Webhook handler could trigger email via Resend/SendGrid after successful payment
- **Important:** RegistrationConfirmation currently says "Potvrzení jsme odeslali na {email}" — this text must be changed to "Registrace byla úspěšná" until email sending is implemented
- Flagged for follow-up implementation

## Testing Plan

1. **Comgate sandbox mode** (`COMGATE_TEST=true`)
   - Create test payments, verify redirect flow
   - Test webhook delivery to local dev (use ngrok/Cloudflare tunnel)
2. **Manual E2E test:**
   - Fill registration → see redirect → complete test payment → verify DB update → see confirmation
3. **Edge cases:**
   - Cancel payment on Comgate → verify return page shows error
   - Close browser → verify webhook updates DB
   - Double-click "Přejít k platbě" → verify idempotency

## Open Questions for User

1. **Comgate account** — Do you have a Comgate merchant account, or do we need to register?
2. **IP whitelisting** — Need to verify with Comgate whether Vercel dynamic IPs are a problem
3. **Email confirmation** — Should we add email sending in this iteration, or leave for later?
4. **Refund flow** — Is manual Supabase dashboard sufficient, or do you need admin UI?
5. **Praha camps** — Will Praha eventually switch from DDM to internal registration too?
