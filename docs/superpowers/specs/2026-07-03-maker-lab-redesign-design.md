# Maker Lab Redesign — Design Spec

**Date:** 2026-07-03
**Goal:** Complete visual redesign of weeks.cz — distinctive "maker lab" aesthetic, keeping the existing brand color palette (matches logo + IG visuals). Delivered as a Vercel preview branch to show the team on today's call.

## Scope

**In scope (fully redesigned):**
- Design tokens (`tailwind.config.ts`, `globals.css`)
- Header + Footer
- Homepage (all sections)
- `/tabor-3d-tisk` camp page

**Out of scope (inherits tokens only):**
- All other pages (KV section, e-shop, registration/payment flow, legal pages, program, o-nas, kontakt). They inherit new typography/radii via shared tokens and component classes — acceptable for preview; full rollout is phase 2 after team approval.

**Unchanged (hard constraints):**
- All copy, prices, terms, DDM registration links
- Forms and APIs (Formspree, waitlist API, registration flow)
- Analytics (GA4, FB Pixel, Sklik events, consent gating)
- VOP/GDPR/legal content
- SEO metadata, structured data, sitemap
- `prefers-reduced-motion` support

## Design direction

"Maker lab" — authentic workshop/lab aesthetic rooted in what the camps actually are (3D printing, soldering, IoT), executed with the **existing brand colors**. Balanced dark-tech accents (single dark sections, dark mobile menu), not a full dark mode.

### 1. Design tokens

- **Colors:** existing scales stay (primary indigo, accent cyan, trust emerald, cta amber). Change is in *usage*: fewer gradients, more solid surfaces and large contrasts. Two new neutrals:
  - `paper` — warm white (`#FAFAF7`-ish) replacing cool gray-50 backgrounds
  - `ink` — deep near-black with indigo cast (`#0C0E1A`-ish) for dark sections and text
- **Typography** (Google Fonts via `next/font`, self-hosted):
  - Display: **Bricolage Grotesque** — characterful, playful-technical, large headlines
  - Body: **Instrument Sans** — clean but not bland
  - Mono: **IBM Plex Mono** — "maker" labels: dimension lines, term dates, prices, technical tags
- **Shape language:** sharper radii (`rounded-md` instead of `rounded-2xl`), visible 1px ink borders instead of soft shadows, hard-edge shadow only as micro-accent on CTAs.
- New utility classes in `globals.css`: blueprint grid background, mono label style, hard-shadow hover.

### 2. Header, Footer, Homepage

- **Header:** paper-white bar, 1px ink bottom border, Instrument Sans nav, amber CTA rectangle with sharp radius + hard-shadow micro-shift on hover. Slight shrink on scroll. Mobile menu = fullscreen ink overlay with large typography (dark-tech moment).
- **Hero:** large editorial type (Bricolage, clamp ~3.5–6rem) on paper background with subtle CSS blueprint grid (indigo at ~5%, pure CSS gradients, no image assets). HWLab photo no longer full-bleed background with overlay — instead cropped photo in a 1px-bordered frame with mono tag (`HWLAB — PRAHA 6`), placed asymmetrically next to text. Mono "dimension" line above headline: `LÉTO 2026 · PRAHA & KARLOVY VARY`.
- **Dark section:** one full homepage section (camps/CTA block) on ink background with cyan/amber accents.
- **Camp cards** (ProgramSection + CTASection): paper cards, 1px ink border, mono metadata row on top (`SO+NE · 2 990 KČ · MAX 15`), accent color only in a small element (number/icon), hover = hard-shadow shift. Each camp keeps its brand color (MIX indigo, 3D tisk primary, IoT emerald) as accent, not as full-card gradient.
- **SummerBanner, USP, Trust, FAQ, Contact:** same language — grid dividers, mono section labels (`01 — PROČ WEEKS`), fewer icons-in-circles, more typography.

### 3. Camp page (/tabor-3d-tisk), motion, details

- **Hero:** mono "spec sheet" (age, capacity, price, time — like a product technical label).
- **Day program:** timeline with dimension lines — mono times left, ink line, descriptions right.
- **Printer showcase:** grid with 1px borders and mono model names (MK4S, CORE One, …).
- **Terms:** rendered as "tickets" — confirmed solid with amber CTA, připravujeme with dashed border. Existing logic and forms unchanged.
- **Motion:** more restrained than current — no floating blobs. Framer Motion stays: subtle fade-up on scroll, hard-shadow shift on hover, section numbers drawing in. `prefers-reduced-motion` respected as before.

## Delivery & rollout

- Branch `design/maker-lab`, commits by logical unit: tokens → header/footer → homepage → camp page.
- Push to GitHub → automatic Vercel preview URL for the call. Production (`main`/weeks.cz) untouched.
- Verification: `npm run build` passes + visual check in browser before push.
- **Known risk:** out-of-scope pages inherit new typography/radii and will look "80% new" — fine for preview; phase 2 rollout page-by-page follows if the team approves.

## Alternatives considered

- **Parallel `/preview` route with duplicated components** — rejected: duplicated code, double work on approval, no real header/footer flow.
- **Full design-system rebuild (shadcn/ui, all 24 pages)** — rejected for today: not achievable at target quality; candidate for phase 2.
- **Direction alternatives** (dark tech editorial, neo-brutalism, soft premium) — rejected in favor of maker lab with existing brand colors, per founder decision.
