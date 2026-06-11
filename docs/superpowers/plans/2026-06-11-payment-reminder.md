# Payment Reminder Cron Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send a one-time payment-reminder email ~24 h after an unpaid (`pending`) camp registration, with a one-click link to finish the Comgate payment.

**Architecture:** Reuse the existing cron pattern (`CRON_SECRET` guard + atomic claim on a `*_sent_at` column) from `nastupni-list`. A new daily Vercel cron queries abandoned-but-recent pending registrations, atomically claims each via a new `payment_reminder_sent_at` column, and sends a transactional email built by a new pure template in `email.ts`.

**Tech Stack:** Next.js 16 App Router (route handler), Supabase (`@supabase/supabase-js`, service role), Resend (email), Vitest (tests).

**Spec:** `docs/superpowers/specs/2026-06-11-payment-reminder-design.md`

---

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/email.ts` | Add `buildPaymentReminderEmail` — pure template (subject + HTML). |
| `src/lib/email.test.ts` | Unit tests for the new template. |
| `supabase/migrations/017_registrations_payment_reminder.sql` | Add `payment_reminder_sent_at` idempotency column. |
| `src/app/api/cron/payment-reminder/route.ts` | Cron handler: query candidates, claim, send. |
| `vercel.json` | Register the daily cron. |

Build order: **template (TDD) → migration → cron route → schedule → verify**. The template is built and tested first because the route imports it.

---

## Task 1: Payment reminder email template

**Files:**
- Modify: `src/lib/email.ts`
- Test: `src/lib/email.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `src/lib/email.test.ts`. Also update the import on line 2 to include the new function:

```ts
// line 2 becomes:
import { buildConfirmationEmail, buildNastupniListEmail, buildPaymentReminderEmail } from './email'
```

Append this describe block to the end of the file:

```ts
describe('buildPaymentReminderEmail', () => {
  const r = buildPaymentReminderEmail({
    childName: 'Tomáš Novák',
    programName: 'Letní příměstský tábor chytrých technologií',
    locationName: 'Karlovy Vary',
    termLabel: '3. 8. 2026 – 7. 8. 2026',
    priceKc: 4990,
    paymentUrl: 'https://weeks.cz/platba/abc-123?location=karlovy-vary',
  })
  it('has a Czech subject with the program name', () => {
    expect(r.subject).toBe('Dokončení registrace – Letní příměstský tábor chytrých technologií')
  })
  it('includes the payment link, child name, term and price', () => {
    expect(r.html).toContain('https://weeks.cz/platba/abc-123?location=karlovy-vary')
    expect(r.html).toContain('Tomáš Novák')
    expect(r.html).toContain('3. 8. 2026 – 7. 8. 2026')
    // cs-CZ groups with a non-breaking space — compare via the same formatter.
    expect(r.html).toContain(`${(4990).toLocaleString('cs-CZ')} Kč`)
  })
  it('frames the spot as reserved only after payment, with a no-pressure opt-out', () => {
    expect(r.html).toContain('místo se rezervuje až po zaplacení')
    expect(r.html).toContain('ignorovat')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/email.test.ts`
Expected: FAIL — `buildPaymentReminderEmail is not a function` (or import error).

- [ ] **Step 3: Write minimal implementation**

Append to `src/lib/email.ts` (after `buildNastupniListEmail`, end of file). Reuses the existing module-private `layout()` helper:

```ts
export interface PaymentReminderParams {
  childName: string
  programName: string
  locationName: string
  termLabel: string
  priceKc: number
  paymentUrl: string
}

export function buildPaymentReminderEmail(p: PaymentReminderParams): { subject: string; html: string } {
  const body = `
    <p>Dobrý den,</p>
    <p>děkujeme za zájem o náš <strong>${p.programName}</strong> v ${p.locationName}. Registraci pro <strong>${p.childName}</strong> máme rozepsanou, ale zatím u ní nevidíme dokončenou platbu — a místo se rezervuje až po zaplacení (volná místa se obsazují průběžně).</p>
    <p>Dokončit ji můžete jedním kliknutím:</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${p.paymentUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:10px;">Dokončit platbu</a>
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;">Termín</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.termLabel}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Cena</td><td style="padding:6px 0;text-align:right;font-weight:600;">${p.priceKc.toLocaleString('cs-CZ')} Kč</td></tr>
    </table>
    <p>Pokud už o místo nemáte zájem, nic neřešte — stačí tento e-mail ignorovat.</p>
    <p>S pozdravem,<br>tým Weeks</p>`
  return {
    subject: `Dokončení registrace – ${p.programName}`,
    html: layout('Dokončení registrace', body),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/email.test.ts`
Expected: PASS (all describe blocks, including the two existing ones).

- [ ] **Step 5: Commit**

```bash
git add src/lib/email.ts src/lib/email.test.ts
git commit -m "feat(email): payment reminder template"
```

---

## Task 2: Idempotency column migration

**Files:**
- Create: `supabase/migrations/017_registrations_payment_reminder.sql`

- [ ] **Step 1: Write the migration file**

Create `supabase/migrations/017_registrations_payment_reminder.sql`:

```sql
-- Payment reminder: one-time email ~24h after an unpaid registration.
-- This column is the idempotency lock (same pattern as confirmation_sent_at /
-- nastupni_sent_at): NULL = not yet reminded; a timestamp = reminder claimed/sent.
-- The cron releases it back to NULL only if the send fails, so a later run retries.
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS payment_reminder_sent_at TIMESTAMPTZ;
```

- [ ] **Step 2: Apply the migration to the shared Supabase project**

This project has no local Supabase; migrations are applied to the shared instance
(`qtxiwtinwcagsyhwaeda`, owned by weeks-hub). Apply via the Supabase dashboard:

1. Open https://supabase.com/dashboard/project/qtxiwtinwcagsyhwaeda/sql/new
2. Paste the `ALTER TABLE` statement above, run it.

Expected: "Success. No rows returned." (`ADD COLUMN IF NOT EXISTS` is idempotent.)

- [ ] **Step 3: Verify the column exists**

Run (PowerShell), confirms the column is queryable via PostgREST:

```powershell
$KEY = (Get-Content .env.local | Select-String 'SUPABASE_SERVICE_ROLE_KEY=').ToString().Split('=',2)[1]
curl.exe -s "https://qtxiwtinwcagsyhwaeda.supabase.co/rest/v1/registrations?select=id,payment_reminder_sent_at&limit=1" -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
```

Expected: JSON array (e.g. `[{"id":"...","payment_reminder_sent_at":null}]`) — NOT a
`column ... does not exist` error.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/017_registrations_payment_reminder.sql
git commit -m "feat(db): add payment_reminder_sent_at column"
```

---

## Task 3: Payment reminder cron route

**Files:**
- Create: `src/app/api/cron/payment-reminder/route.ts`

This mirrors `src/app/api/cron/nastupni-list/route.ts`. No unit test (parity with the
existing crons, which are not unit-tested — Supabase I/O); verified by typecheck +
an authenticated manual run in Task 5.

- [ ] **Step 1: Write the route**

Create `src/app/api/cron/payment-reminder/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { buildPaymentReminderEmail, sendEmail, isEmailConfigured } from '@/lib/email'
import { getLocationById } from '@/lib/locations'
import { getTrustedPriceKc } from '@/lib/payment-pricing'
import { formatTermLabel, isoDate } from '@/lib/dates'
import { reportMessage } from '@/lib/observability'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://weeks.cz'

// Daily cron: send a one-time payment reminder ~24h after an unpaid registration.
// Targets registrations that are still pending (not paid, not gateway-cancelled),
// created between 24h and 7 days ago, whose term hasn't started, and that haven't
// been reminded yet. Sends exactly once via an atomic claim on
// payment_reminder_sent_at. Configured in vercel.json.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  // Fail closed: a missing CRON_SECRET must NOT open the endpoint to the public.
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ error: 'Resend not configured' }, { status: 500 })
  }

  const supabase = createServerClient()
  const now = Date.now()
  const olderThan = new Date(now - 24 * 60 * 60 * 1000).toISOString() // created ≤ 24h ago
  const notBefore = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString() // created ≥ 7d ago
  const today = isoDate()

  // Candidates: unpaid + not gateway-cancelled, within the reminder window, term
  // still in the future, not yet reminded.
  const { data: candidates, error } = await supabase
    .from('registrations')
    .select('id, parent_email, child_name, program, location_id, term_start, term_end')
    .eq('payment_status', 'pending')
    .eq('status', 'pending')
    .is('payment_reminder_sent_at', null)
    .lte('created_at', olderThan)
    .gte('created_at', notBefore)
    .gte('term_start', today)

  if (error) {
    reportMessage('Payment reminder cron: query failed', { error })
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  let sent = 0
  let failed = 0

  for (const reg of candidates ?? []) {
    // Atomic claim — guards against overlapping cron runs sending twice.
    const { data: claimed } = await supabase
      .from('registrations')
      .update({ payment_reminder_sent_at: new Date().toISOString() })
      .eq('id', reg.id)
      .is('payment_reminder_sent_at', null)
      .select('id')
    if (!claimed || claimed.length === 0) continue

    try {
      const location = getLocationById(reg.location_id as string)
      const programCfg = location.programs.find((p) => p.id === reg.program)
      const priceKc = getTrustedPriceKc(reg.location_id as string, reg.program as string)
      const paymentUrl = `${SITE_URL}/platba/${reg.id}?location=${reg.location_id}`
      const { subject, html } = buildPaymentReminderEmail({
        childName: reg.child_name as string,
        programName: programCfg?.name ?? (reg.program as string),
        locationName: location.name,
        termLabel: formatTermLabel(reg.term_start as string, reg.term_end as string),
        priceKc,
        paymentUrl,
      })
      await sendEmail({ to: reg.parent_email as string, subject, html })
      sent++
    } catch (e) {
      failed++
      // Release the claim so the next run retries.
      await supabase
        .from('registrations')
        .update({ payment_reminder_sent_at: null })
        .eq('id', reg.id)
      reportMessage('Payment reminder send failed', {
        registrationId: reg.id,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  return NextResponse.json({
    ok: true,
    window: { notBefore, olderThan },
    candidates: candidates?.length ?? 0,
    sent,
    failed,
  })
}
```

- [ ] **Step 2: Typecheck the route**

Run: `npx tsc --noEmit`
Expected: no errors. (Confirms imports `getTrustedPriceKc`, `reportMessage`,
`formatTermLabel`, `isoDate`, `buildPaymentReminderEmail` all resolve with matching
signatures.)

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cron/payment-reminder/route.ts
git commit -m "feat(cron): payment reminder route"
```

---

## Task 4: Register the daily cron

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Add the cron entry**

Edit `vercel.json` — add a third entry to the `crons` array (after `nastupni-list`):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "crons": [
    {
      "path": "/api/cron/capacity-notify",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/nastupni-list",
      "schedule": "0 7 * * *"
    },
    {
      "path": "/api/cron/payment-reminder",
      "schedule": "0 9 * * *"
    }
  ]
}
```

- [ ] **Step 2: Validate JSON**

Run (PowerShell): `Get-Content vercel.json -Raw | ConvertFrom-Json | Out-Null; if ($?) { "valid" }`
Expected: prints `valid`.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat(cron): schedule payment reminder daily at 09:00 UTC"
```

---

## Task 5: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Full test suite + lint**

Run: `npm run test` then `npm run lint`
Expected: all tests pass; lint clean.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds; the route `/api/cron/payment-reminder` appears in the route
list as a dynamic (ƒ) function.

- [ ] **Step 3: Local authenticated cron smoke test**

Start the dev server in one shell (`npm run dev`), then in another shell run the route
with the real `CRON_SECRET` from `.env.local`:

```powershell
$SECRET = (Get-Content .env.local | Select-String 'CRON_SECRET=').ToString().Split('=',2)[1]
curl.exe -s "http://localhost:3000/api/cron/payment-reminder" -H "Authorization: Bearer $SECRET"
```

Expected: JSON `{ "ok": true, "window": {...}, "candidates": <n>, "sent": <n>, "failed": 0 }`.
(If `CRON_SECRET` is not in `.env.local`, this step is skipped — note it and rely on the
unauthorized check below + the post-deploy Vercel cron logs.)

- [ ] **Step 4: Verify the unauthorized guard**

```powershell
curl.exe -s -o NUL -w "%{http_code}" "http://localhost:3000/api/cron/payment-reminder"
```

Expected: `401` (no bearer token → rejected).

- [ ] **Step 5: Final confirmation**

Confirm: migration applied to prod Supabase (Task 2), all tasks committed, build green.
The cron will run daily at 09:00 UTC on the next deploy to `main`.

---

## Deployment note

Per `CLAUDE.md`, `main` auto-deploys to weeks.cz and the Vercel Hobby author block
requires Lukáš-authored commits. **The migration (Task 2) must be applied to prod
Supabase BEFORE this code reaches `main`** — otherwise the cron's first run errors on
the missing column. Order: apply migration → merge/deploy code.
