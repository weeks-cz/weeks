# Ad Landing Page `/duben` — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a minimal, high-conversion ad landing page at `/duben` for Instagram campaign promoting IoT (18.4) and 3D tisk (19.4) one-day camps.

**Architecture:** Single Next.js page component (`'use client'`) with inline state management for two independent email forms. Uses existing waitlist API, analytics functions, and design tokens. No new components needed — everything lives in one focused page file.

**Tech Stack:** Next.js App Router, Tailwind CSS, Framer Motion, existing `/api/waitlist` endpoint, existing GA4 analytics

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/app/duben/page.tsx` | Landing page (self-contained client component) |
| Create | `src/app/duben/layout.tsx` | Minimal layout (no Header/Footer, just html essentials) |

No modifications to existing files needed — existing analytics functions already accept the parameters we need.

---

### Task 1: Create minimal layout for `/duben`

**Files:**
- Create: `src/app/duben/layout.tsx`

This layout overrides the root layout's Header/Footer. The root `layout.tsx` already provides `<html>`, fonts, GA4, MotionProvider, and CookieConsent — so this nested layout only needs to set page-specific metadata and wrap children without navigation.

- [ ] **Step 1: Create the layout file**

```tsx
// src/app/duben/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IT tábory 18.–19. dubna | Weeks',
  description: 'Jednodenní IT tábory pro děti v Praze. IoT & elektronika (So 18.4.) a 3D tisk (Ne 19.4.). Přihlaste dítě přes DDM Praha 6.',
  robots: 'noindex, nofollow',
}

export default function DubenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 2: Verify layout renders**

Run: `npm run dev`
Navigate to `http://localhost:3000/duben` — should show blank page (no 404), no Header/Footer from root layout should appear since we haven't added children content yet. Actually the root layout's Header/Footer come from individual pages, not root layout — verify by checking that the page loads with just the root layout's font and GA4.

- [ ] **Step 3: Commit**

```bash
git add src/app/duben/layout.tsx
git commit -m "feat: add minimal layout for /duben ad landing page"
```

---

### Task 2: Create the landing page component

**Files:**
- Create: `src/app/duben/page.tsx`

This is the main landing page. It's a single `'use client'` component containing:
1. Logo (centered, links to `/`)
2. Headline
3. Two camp cards (IoT + 3D tisk) with DDM CTA buttons
4. Pre-framing text under each CTA
5. Lead capture email form per card (záchranná síť)
6. Personal assistance section

**Key patterns to follow (from CTASection.tsx):**
- Form state: `useState` for email, gdprConsent, isSubmitting, isSubmitted, error
- Submit to `/api/waitlist` with `program`, `termin`, `gdprConsent`
- Framer Motion: `motion.div` with `initial={{ opacity: 0, y: 20 }}` + `whileInView`
- GDPR checkbox pattern from CTASection lines 242-256
- Color tokens: trust-500 (IoT/emerald), primary-500 (3D tisk/indigo), cta-500 (amber buttons)

- [ ] **Step 1: Create page.tsx with full implementation**

The page should contain:

**Constants at top:**
```tsx
const CAMPS = [
  {
    id: 'iot',
    title: 'IoT & elektronika',
    date: 'Sobota 18. dubna',
    termin: '18. dubna 2026',
    description: 'Micro:bit, Arduino, senzory a vlastní chytré zařízení. Jeden den, plný zážitků.',
    price: '1 490 Kč',
    ddmUrl: 'https://www.ddmp6.cz/tabory/?id=773',
    icon: Cpu,                    // from lucide-react
    gradient: 'from-trust-500/30 to-trust-400/20',
    iconBg: 'bg-trust-500',
    buttonBg: 'bg-trust-500 hover:bg-trust-400',
    buttonShadow: 'hover:shadow-trust-500/30',
    dotColor: 'bg-trust-400',
  },
  {
    id: '3d-tisk',
    title: '3D tisk',
    date: 'Neděle 19. dubna',
    termin: '19. dubna 2026',
    description: 'Od 3D návrhu po hotový výtisk na profesionální tiskárně. Jeden den, vlastní výtvor.',
    price: '1 490 Kč',
    ddmUrl: 'https://www.ddmp6.cz/tabory/?id=775',
    icon: Printer,                // from lucide-react
    gradient: 'from-primary-500/30 to-primary-400/20',
    iconBg: 'bg-primary-500',
    buttonBg: 'bg-primary-500 hover:bg-primary-400',
    buttonShadow: 'hover:shadow-primary-500/30',
    dotColor: 'bg-primary-400',
  },
] as const
```

**Component structure:**
```
<main> (min-h-screen, dark gradient bg)
  <Logo> (centered, link to /)
  <Headline> ("IT tábory pro děti tento víkend")
  <div grid 1col→2col> (camp cards)
    {CAMPS.map(camp => <CampCard />)}
  </div>
  <PersonalAssistance> (phone + WhatsApp)
</main>
```

**Each CampCard contains:**
- Icon badge + camp title + date
- 1-line description
- Price badge
- "Přihlásit dítě →" button (amber, `<a>` to DDM URL, `target="_blank"`, `rel="noopener"`)
- Pre-framing text (small gray text explaining DDM process)
- Divider
- "Nestíháte teď?" email mini-form with GDPR checkbox
- Each card manages its own form state independently

**PersonalAssistance section:**
- Centered text block below cards
- Phone: `tel:+420703046440`
- WhatsApp: `https://wa.me/420703046440`

**Analytics on DDM button click:**
```tsx
onClick={() => {
  trackRegistrationClick({
    termId: camp.id,
    termDates: camp.date,
    termLocation: 'DDM Praha 6',
    spotsAvailable: 15,
    outboundUrl: camp.ddmUrl,
    campType: 'oneday',
  })
}}
```

**Analytics on email form submit:**
```tsx
trackInterestSubmit({
  programId: camp.id,
  programTitle: camp.title,
  termin: camp.termin,
  campType: 'oneday',
})
```

- [ ] **Step 2: Run dev server and verify the page renders**

Run: `npm run dev`
Navigate to `http://localhost:3000/duben`
Verify:
- Logo displays and links to `/`
- Two cards show with correct colors (emerald IoT, indigo 3D tisk)
- DDM buttons open correct URLs in new tab
- Email forms submit and show success state
- Pre-framing text is visible under CTA buttons
- Personal assistance section shows phone + WhatsApp links
- Page is responsive (test at 375px mobile width)
- No Header/Footer visible

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds, `/duben` page listed in output

- [ ] **Step 5: Commit**

```bash
git add src/app/duben/page.tsx
git commit -m "feat: add /duben ad landing page for April 18-19 camps

Minimal conversion-focused landing page for Instagram ad campaign.
Two camp cards (IoT 18.4, 3D tisk 19.4) with direct DDM registration,
pre-framing text, lead capture forms, and personal assistance section."
```
