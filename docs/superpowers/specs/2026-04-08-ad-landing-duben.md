# Ad Landing Page `/duben`

## Purpose

Dedicated landing page for Instagram ad campaign promoting two one-day IT camps on April 18-19, 2026. Optimized for conversion — minimal distractions, direct path to DDM registration.

## URL

`/duben` — short, memorable, works in IG bio and ad links.

## Layout

Minimal ad landing page: logo only, no site navigation, no footer. Dark background consistent with existing site aesthetic.

## Page Structure (top to bottom)

### 1. Logo
- weeks.cz logo, centered
- Click → homepage (`/`)

### 2. Headline
- Short, energetic headline (e.g., "Vyber si IT tábor na tento víkend")
- Subheadline with date context

### 3. Two Camp Cards (side by side on desktop, stacked on mobile)

**Card A: IoT & elektronika — Sobota 18. 4.**
- Trust/emerald gradient (consistent with site design system)
- Icon badge, camp name, date + time
- 1-2 sentence description
- Price: 1 490 Kč
- CTA button: "Přihlásit dítě" → `https://www.ddmp6.cz/tabory/?id=773`
- Pre-framing text below button: "Přihlášení probíhá přes oficiální systém DDM Praha 6. Budete potřebovat rodné číslo dítěte. Zabere to asi 3 minuty."

**Card B: 3D tisk — Neděle 19. 4.**
- Primary/indigo gradient (consistent with site design system)
- Icon badge, camp name, date + time
- 1-2 sentence description
- Price: 1 490 Kč
- CTA button: "Přihlásit dítě" → `https://www.ddmp6.cz/tabory/?id=775`
- Pre-framing text below button (same as Card A)

### 4. Záchranná síť (Lead Capture) — one per card, below the pre-framing text
- Copy: "Nestíháte teď? Nechte nám e-mail, pošleme připomínku s návodem."
- Email input + submit button
- GDPR consent checkbox: "Souhlasím se zpracováním osobních údajů" (link to `/gdpr`)
- Submit disabled until GDPR checkbox checked
- Submits to `/api/waitlist` with `program: 'iot'` or `program: '3d-tisk'` and `termin` field matching the card's date
- On success: inline confirmation message

### 5. Osobní asistence
- Copy: "Zasekli jste se v systému DDM nebo si nevíte rady? Zavolejte na +420 703 046 440 nebo napište na WhatsApp, rádi vám s přihláškou rovnou pomůžeme."
- Phone number as clickable tel: link
- WhatsApp as clickable `https://wa.me/420703046440` link

## Technical Details

### SEO
- `noindex, nofollow` — temporary ad page, should not appear in search results

### Analytics
- Reuse existing `trackRegistrationClick()` with `source: 'ad_duben'` parameter for DDM CTA clicks
- Reuse existing `trackInterestSubmit()` for email lead capture submissions
- Support UTM parameters from Instagram ads for attribution

### SEO Implementation
```typescript
export const metadata: Metadata = {
  robots: 'noindex, nofollow',
}
```

### Responsive Design
- Two cards side by side on desktop (md+ breakpoint)
- Stacked on mobile
- Touch-friendly CTA buttons

### Visual Style
- Dark background gradient (matching site's primary-900 palette)
- Card gradients matching existing camp color coding (emerald for IoT, indigo for 3D tisk)
- Amber CTA buttons (existing `btn-primary` style)
- Framer Motion entrance animations (respecting prefers-reduced-motion)

## Files to Create/Modify

- **Create:** `src/app/duben/page.tsx` — the landing page
- **Modify:** `src/lib/analytics.ts` — add ad landing page tracking event (if not already flexible enough)

## Dependencies

- Existing design system (Tailwind tokens, fonts)
- Existing Formspree waitlist API
- Existing GA4 setup
- DDM registration URLs (already confirmed and active)
