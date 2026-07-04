# Design Variants — Dark Editorial & Soft Premium — Design Spec

**Date:** 2026-07-04
**Goal:** Two additional full visual redesign variants of weeks.cz on separate branches, alongside the existing `design/maker-lab` preview, so the team can compare four options (production, maker-lab, dark editorial, soft premium) via Vercel preview URLs and pick a direction.

## Scope

Both variants get the **full maker-lab scope** — attention to detail is a priority:

- Design tokens (`tailwind.config.ts`, `globals.css`, `next/font` setup in `layout.tsx`)
- Header + Footer
- Homepage (all sections incl. gallery, upcoming terms, ticker where applicable)
- Camp pages: `/tabor-3d-tisk`, `/tabor-iot`, `/tabor-chytrych-technologii` (+ shared `TermsList`)
- Karlovy Vary section (all KV pages/components)
- E-shop (catalog, cart, product components)
- Registration + payment flow (form, confirmation, payment redirect)
- Static pages (program, o-nas, kontakt) and legal pages (gdpr, podminky)
- Cookie consent banner, KV region nudge

**Unchanged (hard constraints, same as maker-lab):**

- All copy, prices, terms, DDM registration links
- Forms and APIs (Formspree, waitlist, registration/payment, Comgate)
- Analytics (GA4, Meta Pixel + CAPI, Sklik events, consent gating)
- VOP/GDPR/legal content
- SEO metadata, structured data, sitemap
- `prefers-reduced-motion` support for every animation

## Delivery

- Branch **`design/dark-editorial`** and **`design/soft-premium`**, both cut from `origin/main` (includes the 2.-3.7. camp removal — content identical across all variants).
- The improved hero photo asset from `design/maker-lab` is reused in both variants (asset quality fix, not a design-direction choice); photo *treatment* differs per variant.
- Push → automatic Vercel preview URLs. Production untouched.
- Commits by logical unit (tokens → header/footer → homepage → camp pages → KV → e-shop → registration → static/legal), same discipline as maker-lab.
- Verification per branch: `npm run build` passes + visual check in browser before push.

## Variant A — `design/dark-editorial` ("Dark Tech Editorial")

Premium dark tech look — "like a game studio's site, but serious". Pulls toward the teenager audience.

### Tokens

- **Backgrounds:** ink (near-black with indigo cast, `#0A0C16`-ish) as the base across the whole site; light text. Subtle noise/grain overlay for depth.
- **Brand colors as neon accents:** existing scales stay — cyan for interactions and glow, amber for CTAs, indigo for card surfaces, emerald kept for IoT identity. No new hues.
- **Typography** (Google Fonts via `next/font`, self-hosted): Display **Space Grotesk**, body **Manrope**, mono **JetBrains Mono** for data (dates, prices, capacities).
- **Shape:** medium radii, 1px translucent borders on dark surfaces, glow instead of drop shadows.

### Wow effects

- Spotlight cursor — radial glow following the mouse over dark surfaces (desktop pointer devices only).
- Hero with slowly shifting aurora/gradient glow in brand colors.
- Glow borders on cards on hover.
- Scroll-driven section reveals.
- Animated counters (capacity, term counts).
- Magnetic CTA buttons.

### Risk & mitigation

Dark site can read as less trustworthy to parents → high contrast, generous whitespace, and the trust-focused sections (DDM partnership, team) get light "paper islands" so the site breathes.

## Variant B — `design/soft-premium` ("Soft Premium")

Light, airy, premium-trustworthy — aimed primarily at parents; "private school website with a modern twist".

### Tokens

- **Backgrounds:** warm white; brand colors as pastel washes (indigo-50/100 surfaces) with full-strength color only in accents.
- **Shape:** large radii (`rounded-3xl`), soft layered shadows, glass effect (`backdrop-blur`) on header and cards.
- **Typography** (Google Fonts via `next/font`, self-hosted): Display **Fraunces** (modern serif — premium, human counterpoint to the tech content), body **Plus Jakarta Sans**.

### Wow effects

- Smooth scroll reveals with spring physics.
- Hero with slow ken-burns photo zoom + gradient mesh background.
- Cards with subtle 3D tilt on hover and "blooming" shadow.
- Animated stats counters.
- Partner marquee strip (DDM, HWLab).
- Smooth color transitions between sections.

### Risk & mitigation

Danger of sliding into generic "SaaS template" look → the serif display font and bold asymmetric layouts are the differentiators; avoid centered-hero-with-two-buttons clichés.

## Comparison rationale

The three redesign variants intentionally cover three positions on the teenager ↔ parent axis: dark editorial pulls toward teenagers, soft premium toward parents, maker-lab sits in the middle (authentic workshop speaks to both). Content is identical across all variants so the team votes on design, not copy.

## Alternatives considered

- **Neo-brutalism** and **playful arcade/retro** directions — rejected by founder in favor of dark tech editorial + soft premium, both constrained to the existing weeks brand palette.
- **Preview scope only (homepage + one camp page)** — rejected: founder wants full scope with polished details for a fair comparison.
