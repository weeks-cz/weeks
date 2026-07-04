# Design Variants (Dark Editorial + Soft Premium) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Two full-scope visual redesign variants of weeks.cz — `design/dark-editorial` (dark tech editorial) and `design/soft-premium` (soft premium) — each delivering a Vercel preview URL, so the team compares four options (production, maker-lab, A, B).

**Architecture:** Token-first redesign per variant, same discipline as maker-lab: fonts + colors + utility classes land first (`tailwind.config.ts`, `globals.css`, `layout.tsx`), then a small set of reusable "wow" primitives, then components restyled page by page. No logic, copy, form, analytics, or SEO changes anywhere. Variant A is built fully on its branch, then Variant B fresh from `origin/main`.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS 3, Framer Motion, next/font (Google Fonts self-hosted).

## Global Constraints (both variants)

- Branches: `design/dark-editorial` (exists, spec committed), `design/soft-premium` (create from `origin/main`, then cherry-pick the docs commits from A).
- NEVER `git add -A` / `git add .` — repo root contains stray untracked files. Always add exact paths.
- Copy, prices, terms, DDM links, forms (Formspree/waitlist/registration/Comgate), analytics events (GA4/Meta Pixel+CAPI/Sklik), consent gating, SEO metadata, structured data: **unchanged**. Visual layer only.
- All user-facing text in Czech; do not reword existing copy.
- `prefers-reduced-motion`: every new animation must be disabled under it — CSS animations via a global media-query block; JS effects via `useReducedMotion()` from framer-motion. Touch devices: cursor/tilt/magnetic effects must no-op.
- Brand color scales (primary indigo / accent cyan / trust emerald / cta amber) stay exactly as defined today. New additions are neutrals only.
- Camp accent mapping stays: MIX = primary(indigo), 3D tisk = primary, IoT = trust(emerald), CTA buttons = cta(amber).
- Verification per task: `npm run build` passes; visual check in `npm run dev` (localhost:3000), desktop + ~375 px width.
- Homepage on main = Hero, Program, USP, Trust, UpcomingTerms, CTA, FAQ, Contact (no SummerBanner — already removed). GallerySection + TermsList live on camp pages.
- Hero photo: reuse maker-lab asset — on each branch run
  `git checkout design/maker-lab -- public/images/hwlab/hero-print-day.webp` and apply the maker-lab `next.config.js` qualities change (`git diff origin/main design/maker-lab -- next.config.js` → same 3 lines).
- Commits authored as Lukáš (repo git config already `lukoluko8@gmail.com`); push needs the lxkask/lukoluko8 GitHub auth.

## Execution order

1. Part A (Tasks A1–A12) on `design/dark-editorial` — current branch.
2. Part B (Tasks B1–B12): `git checkout -b design/soft-premium origin/main`, cherry-pick the spec+plan docs commits from `design/dark-editorial`, then implement.

---

# PART A — `design/dark-editorial` ("Dark Tech Editorial")

Premium dark tech. Ink-dark base across the whole site, brand colors as neon accents, light "paper islands" for trust-heavy sections.

## A-Recipes (canonical patterns — use everywhere in Part A)

**Palette usage:** base bg `bg-night` (#0A0C16), raised surfaces `bg-night-800` (#12152A), borders `border-white/10`, body text `text-slate-300`, headings `text-white`. Accents: cyan (`accent-400`) = interactive/glow, amber (`cta-500`) = CTA, indigo (`primary-400/500`) = decorative, emerald (`trust-400`) = IoT identity.

**Section header:**
```tsx
<p className="data-label mb-4">01 / TÁBORY</p>
<h2 className="heading-2">…</h2>
// .data-label = font-mono text-xs uppercase tracking-[0.25em] text-accent-400
```

**Glow card (default card pattern):**
```tsx
<div className="card-glow p-6">…</div>
// .card-glow = bg-night-800 border border-white/10 rounded-lg transition-all duration-300
//              hover:border-accent-400/60 hover:shadow-glow
```

**Paper island (trust sections — TrustSection, team on /o-nas, DDM blocks):**
```tsx
<section className="paper-island">…</section>
// .paper-island = bg-slate-50 text-night rounded-2xl (used as inset panel inside dark section,
// with .data-label recolored via .paper-island .data-label { color: #4F46E5 })
```

**CTA:** `.btn-primary` = amber, dark text, glow on hover (full def in Task A1). Secondary = outlined cyan.

**Camp accent on cards:** 2px top border strip — MIX `border-t-primary-400`, 3D tisk `border-t-primary-400`, IoT `border-t-trust-400` + matching `data-label` color.

**Dark form inputs:** `bg-night border border-white/15 text-white placeholder:text-slate-500 rounded-lg focus:border-accent-400 focus:ring-1 focus:ring-accent-400`.

---

### Task A1: Tokens — fonts, night palette, glow shadows, global classes, hero asset

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx` (font imports lines 3, 16–27; body className line 107)
- Modify: `next.config.js` (qualities line from maker-lab)
- Create: `public/images/hwlab/hero-print-day.webp` (checkout from maker-lab)

**Interfaces:**
- Produces: Tailwind utilities `bg-night`, `bg-night-800`, `bg-night-700`, `shadow-glow`, `shadow-glow-amber`, `font-display`, `font-mono`; CSS classes `.data-label`, `.card-glow`, `.paper-island`, `.noise`, `.aurora`, restyled `.btn-primary/.btn-secondary/.btn-outline`, `.heading-1/2/3`, `.text-gradient`. All later A-tasks consume these.

- [ ] **Step 1: Fonts in `src/app/layout.tsx`**

```tsx
import { Space_Grotesk, Manrope, JetBrains_Mono } from 'next/font/google'

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})
```

Body: `` <body className={`${manrope.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}> ``. Nothing else in layout.tsx changes.

- [ ] **Step 2: Tokens in `tailwind.config.ts`**

In `theme.extend.colors` add (existing scales stay verbatim):

```ts
night: {
  DEFAULT: '#0A0C16',
  800: '#12152A',
  700: '#1B1F3A',
},
```

Replace `fontFamily`:

```ts
fontFamily: {
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
},
```

Add to `theme.extend.boxShadow`:

```ts
boxShadow: {
  glow: '0 0 24px 0 rgba(34, 211, 238, 0.25)',
  'glow-amber': '0 0 24px 0 rgba(245, 158, 11, 0.35)',
},
```

- [ ] **Step 3: Rewrite `src/app/globals.css` base + components layers**

```css
@layer base {
  :root {
    --background: 10 12 22;
    --foreground: 248 250 252;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-night text-slate-300 antialiased;
  }

  ::selection {
    @apply bg-accent-400 text-night;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center px-6 py-3
           bg-cta-500 hover:bg-cta-400 text-night font-semibold rounded-lg
           transition-all duration-300 hover:shadow-glow-amber
           focus:outline-none focus:ring-2 focus:ring-cta-500 focus:ring-offset-2 focus:ring-offset-night;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center px-6 py-3
           border border-accent-400/60 text-accent-400 font-semibold rounded-lg
           transition-all duration-300 hover:bg-accent-400/10 hover:shadow-glow
           focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night;
  }

  .btn-outline {
    @apply inline-flex items-center justify-center px-6 py-3
           border border-white/20 text-white font-semibold rounded-lg
           transition-all duration-300 hover:border-white hover:bg-white/5
           focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-night;
  }

  .section-container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .section-padding {
    @apply py-16 md:py-24;
  }

  .heading-1 {
    @apply font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.98] text-white;
  }

  .heading-2 {
    @apply font-display text-3xl md:text-5xl font-bold tracking-tight text-white;
  }

  .heading-3 {
    @apply font-display text-2xl md:text-3xl font-semibold tracking-tight text-white;
  }

  .text-gradient {
    @apply bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent;
  }

  .data-label {
    @apply font-mono text-xs uppercase tracking-[0.25em] text-accent-400;
  }

  .card-glow {
    @apply bg-night-800 border border-white/10 rounded-lg
           transition-all duration-300
           hover:border-accent-400/60 hover:shadow-glow;
  }

  .paper-island {
    @apply bg-slate-50 text-night rounded-2xl;
  }

  .paper-island .data-label {
    color: #4f46e5;
  }

  .noise {
    position: relative;
  }

  .noise::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .aurora {
    position: absolute;
    border-radius: 9999px;
    filter: blur(90px);
    opacity: 0.35;
    animation: aurora-drift 18s ease-in-out infinite alternate;
    pointer-events: none;
  }

  @keyframes aurora-drift {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    100% {
      transform: translate3d(60px, -40px, 0) scale(1.15);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .aurora {
      animation: none;
    }
  }
}
```

Keep the existing `@layer utilities` block (animation-delay helpers) as is. Paper islands inside get standard slate text — inside `.paper-island` use `text-night` headings and `text-slate-600` body inline where needed.

- [ ] **Step 4: Hero asset + next.config**

```bash
git checkout design/maker-lab -- public/images/hwlab/hero-print-day.webp
```

Apply the same `next.config.js` change maker-lab made (see `git diff origin/main design/maker-lab -- next.config.js` — the added `qualities` line in the `images` block, copy it verbatim).

- [ ] **Step 5: Verify build + smoke check**

Run: `npm run build` → succeeds. `npm run dev` → site renders dark with new fonts; pages will look rough until later tasks — that's expected; nothing crashes.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.ts src/app/globals.css src/app/layout.tsx next.config.js public/images/hwlab/hero-print-day.webp
git commit -m "feat(design): dark editorial tokens - fonts, night palette, glow shadows, global classes"
```

---

### Task A2: Wow primitives — SpotlightCursor, AuroraGlow, CountUp, MagneticButton

**Files:**
- Create: `src/components/effects/SpotlightCursor.tsx`
- Create: `src/components/effects/AuroraGlow.tsx`
- Create: `src/components/effects/CountUp.tsx`
- Create: `src/components/effects/MagneticButton.tsx`
- Modify: `src/app/layout.tsx` (mount SpotlightCursor inside body, next to CookieConsent)

**Interfaces:**
- Produces: `<SpotlightCursor />` (no props, global), `<AuroraGlow className?: string />` (decorative blob group for section backgrounds), `<CountUp value: number, suffix?: string, className?: string />`, `<MagneticButton className?: string, children>` (wrapper div, not a button — wrap existing Links).

- [ ] **Step 1: SpotlightCursor.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export function SpotlightCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(34, 211, 238, 0.06), transparent 70%)`
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  if (reduced) return null
  return <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30" />
}
```

- [ ] **Step 2: AuroraGlow.tsx**

```tsx
import { cn } from '@/lib/utils'

export function AuroraGlow({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="aurora w-[40rem] h-[40rem] -top-40 -left-20 bg-primary-600/50" />
      <div className="aurora w-[30rem] h-[30rem] top-1/3 right-0 bg-accent-500/40 [animation-delay:-6s]" />
      <div className="aurora w-[24rem] h-[24rem] bottom-0 left-1/3 bg-cta-500/25 [animation-delay:-12s]" />
    </div>
  )
}
```

- [ ] **Step 3: CountUp.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export function CountUp({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { duration: 1.6, bounce: 0 })

  useEffect(() => {
    if (inView) motionVal.set(value)
  }, [inView, value, motionVal])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
    })
  }, [spring, suffix])

  if (reduced) return <span className={className}>{`${value}${suffix}`}</span>
  return <span ref={ref} className={className}>{`0${suffix}`}</span>
}
```

- [ ] **Step 4: MagneticButton.tsx**

```tsx
'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 20 })
  const sy = useSpring(y, { stiffness: 300, damping: 20 })

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((e.clientX - rect.left - rect.width / 2) * 0.2)
        y.set((e.clientY - rect.top - rect.height / 2) * 0.2)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 5: Mount SpotlightCursor in `src/app/layout.tsx`**

Import and render `<SpotlightCursor />` inside `<body>` after the providers (sibling of `<CookieConsent />`).

- [ ] **Step 6: Verify + Commit**

`npm run build` passes; dev: moving the mouse shows a faint cyan spotlight; no effect with DevTools emulated `prefers-reduced-motion: reduce`.

```bash
git add src/components/effects/SpotlightCursor.tsx src/components/effects/AuroraGlow.tsx src/components/effects/CountUp.tsx src/components/effects/MagneticButton.tsx src/app/layout.tsx
git commit -m "feat(design): dark editorial wow primitives - spotlight cursor, aurora, countup, magnetic button"
```

---

### Task A3: Header + Footer

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: A1 classes; `MagneticButton` from A2 (header CTA). Component props/exports unchanged.

- [ ] **Step 1: Header.tsx** — keep all nav links, logic, aria. Bar: `bg-night/80 backdrop-blur-md border-b border-white/10`. Links `text-slate-300 hover:text-white`, active/hover underline `decoration-accent-400 underline-offset-8 decoration-2`. CTA: wrap the existing Link in `<MagneticButton>` + `.btn-primary`. Logo: if the PNG logo is dark-on-light, add `brightness-0 invert` filter class so it reads on dark; verify visually. Mobile menu: fullscreen `bg-night` overlay, links `font-display text-4xl font-bold text-white`, cyan `data-label` tagline (`WEEKS — IT TÁBORY · PRAHA & KARLOVY VARY`) at bottom.

- [ ] **Step 2: Footer.tsx** — keep all links/columns/legal. `bg-night border-t border-white/10`, column headings `.data-label`, links `text-slate-400 hover:text-accent-400`. Add oversized watermark `font-display text-6xl md:text-8xl font-bold text-white/5 select-none` "WEEKS" row, `aria-hidden="true"`.

- [ ] **Step 3: Verify + Commit** — build + dev (desktop nav, mobile menu, footer on / and /kontakt).

```bash
git add src/components/layout/Header.tsx src/components/layout/Footer.tsx
git commit -m "feat(design): dark editorial header and footer"
```

---

### Task A4: HeroSection

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`

**Interfaces:**
- Consumes: A1 classes, `AuroraGlow` + `MagneticButton` from A2. Existing CTA hrefs, copy, analytics stay.

- [ ] **Step 1: Restyle** — structure: `<section className="relative bg-night noise overflow-hidden">` with `<AuroraGlow />` behind content. Grid `lg:grid-cols-12`: left 7 cols — `data-label` kicker (`LÉTO 2026 · PRAHA & KARLOVY VARY`), `heading-1` headline (existing copy; one key word wrapped in `text-gradient`), subheadline `text-lg text-slate-400 max-w-xl`, CTAs (`MagneticButton` + `.btn-primary`, second `.btn-outline`), trust chips as `data-label text-slate-500` row. Right 5 cols — hero photo `hero-print-day.webp` in `rounded-lg border border-white/15 overflow-hidden` frame with cyan corner glow (`shadow-glow`), mono caption `HWLAB — PRAHA 6` under it. Keep Framer Motion staggered fade-up entrances; delete old gradient/blob decorations.

- [ ] **Step 2: Verify + Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat(design): dark editorial hero with aurora glow"
```

---

### Task A5: ProgramSection + USPSection + TrustSection

**Files:**
- Modify: `src/components/sections/ProgramSection.tsx`
- Modify: `src/components/sections/USPSection.tsx`
- Modify: `src/components/sections/TrustSection.tsx`

**Interfaces:**
- Consumes: A1 classes, `CountUp` from A2, camp accent mapping.

- [ ] **Step 1: ProgramSection** — keep data arrays, links, analytics, grid structure (3-col camps + 4-col specializations). Camp cards → `.card-glow` + camp-accent top strip (`border-t-2 border-t-primary-400` / `border-t-trust-400`), mono metadata row (`data-label` recolored per camp), badges as `font-mono text-xs border border-white/20 rounded px-2 py-0.5 text-slate-300`. Section header per A-Recipes (`01 / TÁBORY`). Specialization cards: `.card-glow` without metadata row. Remove all gradient card backgrounds.

- [ ] **Step 2: USPSection** — numbered rows: `font-mono text-sm text-white/30` index (`01`–`04`), `heading-3` title, `text-slate-400` body, `border-t border-white/10` separators. Where the section shows figures (1:5 ratio, capacity 15), render the number through `<CountUp>` (e.g. `<CountUp value={15} />` in `font-display text-5xl text-accent-400`). Keep Lucide icons inline `w-5 h-5 text-accent-400`.

- [ ] **Step 3: TrustSection** — THE paper island: `<section className="section-padding bg-night"><div className="section-container"><div className="paper-island p-8 md:p-12">…</div></div></section>`. Inside: headings `text-night`, body `text-slate-600`, partner logos unfiltered (light bg suits them), `data-label` header (`PARTNEŘI A ZÁZEMÍ` — indigo via the paper-island override). Keep all copy (DDM, HWLab, 1:5).

- [ ] **Step 4: Verify + Commit**

```bash
git add src/components/sections/ProgramSection.tsx src/components/sections/USPSection.tsx src/components/sections/TrustSection.tsx
git commit -m "feat(design): dark editorial program, USP and trust sections"
```

---

### Task A6: UpcomingTermsSection + CTASection + FAQSection + ContactSection

**Files:**
- Modify: `src/components/sections/UpcomingTermsSection.tsx`
- Modify: `src/components/sections/CTASection.tsx`
- Modify: `src/components/sections/FAQSection.tsx`
- Modify: `src/components/sections/ContactSection.tsx`

**Interfaces:**
- Consumes: A1/A2. `UpcomingTermsSection` keeps `terms` prop, `CTASection` keeps `nextTerms` prop — signatures unchanged.

- [ ] **Step 1: UpcomingTermsSection** — term rows as `.card-glow` list items: `font-mono text-accent-400` date left, camp name `font-display text-white` + place center, status/CTA right. Confirmed = solid + small `.btn-primary`; připravujeme = `border-dashed border-white/25` + existing interest link. Keep data source + links.

- [ ] **Step 2: CTASection** — hero-grade dark block: wrapper `relative bg-night-800 noise overflow-hidden border-y border-white/10` + `<AuroraGlow className="opacity-60" />`. Header `data-label` (`VYBER SI TÁBOR`) + `heading-2`. 3 camp cards `.card-glow` on `bg-night` (darker-on-dark) with camp top strips and mono metadata. CTAs amber `.btn-primary` in `MagneticButton`. Email signup: keep logic/Formspree wiring, dark input per A-Recipes.

- [ ] **Step 3: FAQSection** — keep accordion logic + copy. Items `border-t border-white/10` (+ final border-b), `font-mono text-sm text-accent-400/70` index (`Q01`…), question `font-display font-semibold text-white`, answer `text-slate-400`.

- [ ] **Step 4: ContactSection** — two-column: left `data-label` (`KONTAKT`) + `heading-2` + mono-labeled contact rows (`TEL`, `E-MAIL`, `ADRESA`) in `text-slate-300`; right form with dark inputs per A-Recipes. Keep form wiring.

- [ ] **Step 5: Verify + Commit** — full homepage pass: night base, aurora hero, paper island rhythm.

```bash
git add src/components/sections/UpcomingTermsSection.tsx src/components/sections/CTASection.tsx src/components/sections/FAQSection.tsx src/components/sections/ContactSection.tsx
git commit -m "feat(design): dark editorial terms, CTA, FAQ and contact sections"
```

---

### Task A7: Camp pages — TermsList, GallerySection, /tabor-3d-tisk, /tabor-iot, /tabor-chytrych-technologii

**Files:**
- Modify: `src/components/camps/TermsList.tsx`
- Modify: `src/components/sections/GallerySection.tsx`
- Modify: `src/app/tabor-3d-tisk/client.tsx`
- Modify: `src/app/tabor-iot/client.tsx`
- Modify: `src/app/tabor-chytrych-technologii/client.tsx` (+ `page.tsx` only if it carries bg classes)

**Interfaces:**
- Consumes: A1/A2. All data (terms, prices, DDM URLs, forms, analytics) unchanged. TermsList/GallerySection props unchanged.

- [ ] **Step 1: TermsList** — same ticket pattern as A6 Step 1 (shared component used by camp pages; if UpcomingTermsSection duplicates markup, keep each file self-consistent). Confirmed = `.card-glow` + amber CTA to DDM URL; připravujeme = dashed + inline interest form with dark inputs.

- [ ] **Step 2: GallerySection** — thumbnails in `rounded-lg border border-white/10 hover:border-accent-400/60 hover:shadow-glow` frames; keep lightbox/portal logic untouched; lightbox backdrop already dark — verify contrast.

- [ ] **Step 3: Each camp page client.tsx** — apply per A-Recipes, keeping every schedule item, price, FAQ, form:
  - Hero: `bg-night noise` + small `AuroraGlow`, `data-label` breadcrumb (`TÁBORY / 3D TISK` etc.), `heading-1`, spec-sheet `dl` grid (`VĚK / KAPACITA / CENA / ČAS` — values from existing page data) in `card-glow` cells with `data-label` keys + `font-display text-white` values.
  - Day program: timeline — `font-mono text-sm text-accent-400` times left, `border-l border-white/15` line with `w-2 h-2 bg-accent-400 rounded-full -ml-1` nodes, titles `text-white` + descriptions `text-slate-400` right.
  - 3D tisk printer showcase: `.card-glow` cells, `font-mono text-white` model names (MK4S, CORE One, …).
  - Camp accent respected: 3D tisk indigo, IoT emerald, MIX indigo (top strips + `data-label` tint).
  - Terms via restyled TermsList; remaining sections follow homepage patterns.

- [ ] **Step 4: Verify + Commit** — build + dev all three pages, desktop & 375 px; DDM links still ddmp6.cz; interest form still fires network call.

```bash
git add src/components/camps/TermsList.tsx src/components/sections/GallerySection.tsx src/app/tabor-3d-tisk/client.tsx src/app/tabor-iot/client.tsx src/app/tabor-chytrych-technologii/client.tsx
git commit -m "feat(design): dark editorial camp pages + shared terms/gallery"
```

---

### Task A8: Karlovy Vary section

**Files:**
- Modify: `src/app/karlovy-vary/_components/KVRegistrationSection.tsx`
- Modify: `src/app/karlovy-vary/_components/ProjectGallery.tsx`
- Modify: `src/app/karlovy-vary/_components/SpotsLeft.tsx`
- Modify: `src/app/karlovy-vary/_components/VenueShowcase.tsx`
- Modify: `src/app/karlovy-vary/tabor-chytrych-technologii/page.tsx`
- Modify: `src/app/karlovy-vary/letni-primestsky/page.tsx`
- Modify: `src/app/karlovy-vary/o-nas/page.tsx`
- Modify: `src/app/karlovy-vary/kontakt/page.tsx`

**Interfaces:**
- Consumes: A1/A2. Registration flow entry, pricing, Comgate/analytics wiring unchanged.

- [ ] **Step 1: KV camp + letni-primestsky pages** — same treatment as A7 camp pages (night hero + spec sheet + timeline + `.card-glow` cards). `SpotsLeft` badge: `font-mono text-cta-400 border border-cta-500/40 rounded px-2 py-0.5 bg-cta-500/10`. `VenueShowcase`/`ProjectGallery`: bordered glow frames like GallerySection. `KVRegistrationSection`: dark inputs per A-Recipes, amber submit `.btn-primary`; keep every field, validation, tracking.

- [ ] **Step 2: KV o-nas + kontakt** — o-nas team block inside a `paper-island`; kontakt mirrors A6 ContactSection.

- [ ] **Step 3: Verify + Commit** — build + dev /karlovy-vary/* pages; registration form renders all fields and submits (dev network check).

```bash
git add src/app/karlovy-vary/_components/KVRegistrationSection.tsx src/app/karlovy-vary/_components/ProjectGallery.tsx src/app/karlovy-vary/_components/SpotsLeft.tsx src/app/karlovy-vary/_components/VenueShowcase.tsx src/app/karlovy-vary/tabor-chytrych-technologii/page.tsx src/app/karlovy-vary/letni-primestsky/page.tsx src/app/karlovy-vary/o-nas/page.tsx src/app/karlovy-vary/kontakt/page.tsx
git commit -m "feat(design): dark editorial Karlovy Vary section"
```

---

### Task A9: E-shop

**Files:**
- Modify: `src/app/eshop/page.tsx`
- Modify: `src/app/eshop/[slug]/page.tsx`
- Modify: `src/app/eshop/kosik/page.tsx`
- Modify: `src/components/shop/ProductCatalog.tsx`
- Modify: `src/components/shop/CartPageClient.tsx`
- Modify: `src/components/shop/AddToCartButton.tsx`
- Modify: `src/components/shop/CartButton.tsx`
- Modify: `src/components/shop/ProductInterestButton.tsx`

**Interfaces:**
- Consumes: A1/A2. ShopProvider state, cart logic, prices, interest wiring unchanged.

- [ ] **Step 1: Catalog + product detail** — product cards `.card-glow` with `font-mono` price `text-accent-400`; product images on `bg-night-800` may need light padding backplate (`bg-slate-100 rounded-md p-4` behind transparent PNGs — visual check per product). Detail page: `data-label` category, `heading-2` name, amber `AddToCartButton` via `.btn-primary`.
- [ ] **Step 2: Cart** — `CartPageClient` rows `border-b border-white/10`, quantities `font-mono`, totals `font-display text-white`; `CartButton` badge `bg-cta-500 text-night`.
- [ ] **Step 3: Verify + Commit** — add-to-cart flow works in dev.

```bash
git add src/app/eshop/page.tsx "src/app/eshop/[slug]/page.tsx" src/app/eshop/kosik/page.tsx src/components/shop/ProductCatalog.tsx src/components/shop/CartPageClient.tsx src/components/shop/AddToCartButton.tsx src/components/shop/CartButton.tsx src/components/shop/ProductInterestButton.tsx
git commit -m "feat(design): dark editorial e-shop"
```

---

### Task A10: Registration + payment flow

**Files:**
- Modify: `src/components/registration/RegistrationForm.tsx`
- Modify: `src/components/registration/RegistrationConfirmation.tsx`
- Modify: `src/components/registration/PaymentRedirect.tsx`
- Modify: `src/app/registrace/page.tsx`, `src/app/registrace/[id]/page.tsx`, `src/app/platba/[id]/page.tsx` (bg wrapper classes only)

**Interfaces:**
- Consumes: A1. Every field, validation, step tracking, Comgate call, customer_note field: unchanged.

- [ ] **Step 1: RegistrationForm** — dark inputs per A-Recipes, section groups separated `border-t border-white/10` with `data-label` group titles, submit `.btn-primary`. Error states `text-red-400 border-red-400/60`. GDPR checkboxes `accent-accent-400`.
- [ ] **Step 2: Confirmation + PaymentRedirect** — `.card-glow` summary card, `font-mono` order/payment data, statuses: success `text-trust-400`, pending `text-cta-400`.
- [ ] **Step 3: Verify + Commit** — dev: registration form fully rendered, validation errors visible on dark, summary readable.

```bash
git add src/components/registration/RegistrationForm.tsx src/components/registration/RegistrationConfirmation.tsx src/components/registration/PaymentRedirect.tsx src/app/registrace/page.tsx "src/app/registrace/[id]/page.tsx" "src/app/platba/[id]/page.tsx"
git commit -m "feat(design): dark editorial registration and payment flow"
```

---

### Task A11: Static, legal + landing pages, banners

**Files:**
- Modify: `src/app/program/page.tsx`
- Modify: `src/app/o-nas/page.tsx`
- Modify: `src/app/kontakt/page.tsx`
- Modify: `src/app/gdpr/page.tsx`, `src/app/podminky/page.tsx`
- Modify: `src/app/karlovy-vary/gdpr/page.tsx`, `src/app/karlovy-vary/podminky/page.tsx`
- Modify: `src/app/kveten/page.tsx`
- Modify: `src/app/not-found.tsx`
- Modify: `src/components/ui/CookieConsent.tsx`
- Modify: `src/components/ui/KVRegionNudge.tsx`

**Interfaces:**
- Consumes: A1/A2. Legal text, cookie categories + consent logic, nudge geo logic: unchanged.

- [ ] **Step 1: program/o-nas/kontakt** — homepage patterns; o-nas team grid inside `paper-island` (member icons `text-primary-600` — indigo, per the paper-island override). Program page: alternating 2-col rows with `data-label` indices.
- [ ] **Step 2: Legal pages (both cities)** — readability first: content column `max-w-3xl`, headings `font-display text-white`, body `text-slate-300 leading-relaxed`, `data-label` section numbers. No cards.
- [ ] **Step 3: kveten + not-found** — kveten keeps minimal no-nav layout, dark restyle of its two cards + lead form. 404: `font-display text-8xl text-gradient` code + `.btn-primary` home link.
- [ ] **Step 4: CookieConsent + KVRegionNudge** — `bg-night-800 border border-white/15 rounded-lg shadow-glow` panels, amber primary / outline secondary buttons, keep all toggles + logic.
- [ ] **Step 5: Verify + Commit**

```bash
git add src/app/program/page.tsx src/app/o-nas/page.tsx src/app/kontakt/page.tsx src/app/gdpr/page.tsx src/app/podminky/page.tsx src/app/karlovy-vary/gdpr/page.tsx src/app/karlovy-vary/podminky/page.tsx src/app/kveten/page.tsx src/app/not-found.tsx src/components/ui/CookieConsent.tsx src/components/ui/KVRegionNudge.tsx
git commit -m "feat(design): dark editorial static, legal and landing pages + banners"
```

---

### Task A12: Final QA + push + Vercel preview

**Files:** none (verification only)

- [ ] **Step 1:** `npm run build` + `npm run lint` → both pass.
- [ ] **Step 2:** Cross-page QA in dev (desktop + 375 px): /, all 3 camp pages, /karlovy-vary + KV camp pages, /eshop + kosik, /registrace, /program, /o-nas, /kontakt, /gdpr, /kveten, 404. Reduced-motion emulation: no aurora/spotlight/magnetic/countup motion. Cookie banner + KV nudge functional.
- [ ] **Step 3:** Contrast sanity: body text `text-slate-300` on `bg-night` (passes AA), never `text-slate-500` for essential copy.
- [ ] **Step 4:** `git push -u origin design/dark-editorial` (lxkask/lukoluko8 auth), grab Vercel preview URL, confirm publicly accessible.

---

# PART B — `design/soft-premium` ("Soft Premium")

Light, airy, premium-trustworthy. Warm white base, pastel brand washes, serif display, glass + soft depth.

## B-Recipes (canonical patterns — use everywhere in Part B)

**Palette usage:** base bg `bg-cream` (#FDFCFA), tinted section bands `bg-primary-50`, `bg-accent-50`, `bg-trust-50` (alternate for section rhythm), text `text-slate-900` headings / `text-slate-600` body. Full-strength brand colors only in accents: CTAs amber, links indigo-600, IoT emerald-600.

**Section header:**
```tsx
<p className="eyebrow mb-4">Tábory</p>
<h2 className="heading-2">…</h2>
// .eyebrow = text-sm font-semibold uppercase tracking-[0.15em] text-primary-600
```

**Soft card (default card pattern):**
```tsx
<div className="card-soft p-8">…</div>
// .card-soft = bg-white rounded-3xl shadow-soft transition-all duration-300
//              hover:shadow-bloom hover:-translate-y-1
```

**Glass surface (header, sticky/floating elements):** `.glass = bg-white/70 backdrop-blur-md border border-white/60 shadow-soft`.

**CTA:** `.btn-primary` = amber pill (`rounded-full`), soft shadow bloom on hover (full def in Task B1).

**Camp accent on cards:** pastel wash header block — MIX/3D tisk `bg-primary-50` with `text-primary-700` metadata, IoT `bg-trust-50` with `text-trust-700`.

**Light form inputs:** `bg-white border border-slate-200 rounded-2xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 placeholder:text-slate-400`.

---

### Task B1: Branch + tokens — fonts, cream palette, soft shadows, global classes, hero asset

**Files:**
- Modify: `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `next.config.js`
- Create: `public/images/hwlab/hero-print-day.webp`

**Interfaces:**
- Produces: Tailwind `bg-cream`, `shadow-soft`, `shadow-soft-lg`, `shadow-bloom`, `font-display`; CSS `.eyebrow`, `.card-soft`, `.glass`, `.mesh-bg`, `.kenburns`, `.marquee-track`, restyled `.btn-primary/.btn-secondary/.btn-outline`, `.heading-1/2/3`, `.text-gradient`.

- [ ] **Step 0: Create branch + docs**

```bash
git checkout -b design/soft-premium origin/main
git cherry-pick <spec-commit-sha> <plan-commit-sha>   # docs commits from design/dark-editorial
```

- [ ] **Step 1: Fonts in `src/app/layout.tsx`**

```tsx
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'opsz'],
})
```

Body: `` <body className={`${jakarta.variable} ${fraunces.variable} font-sans`}> ``.

- [ ] **Step 2: `tailwind.config.ts`**

Colors add: `cream: { DEFAULT: '#FDFCFA', deep: '#F6F4EE' }`. fontFamily: sans = `var(--font-sans)`, display = `var(--font-display), serif` (no mono needed; keep default). boxShadow add:

```ts
boxShadow: {
  soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(79, 70, 229, 0.06)',
  'soft-lg': '0 2px 4px rgba(15, 23, 42, 0.04), 0 16px 48px rgba(79, 70, 229, 0.10)',
  bloom: '0 4px 8px rgba(15, 23, 42, 0.04), 0 24px 64px rgba(79, 70, 229, 0.16)',
},
```

- [ ] **Step 3: `globals.css`**

```css
@layer base {
  :root {
    --background: 253 252 250;
    --foreground: 15 23 42;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-cream text-slate-600 antialiased;
  }

  ::selection {
    @apply bg-primary-100 text-primary-900;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center px-7 py-3.5
           bg-cta-500 hover:bg-cta-400 text-white font-semibold rounded-full
           shadow-soft transition-all duration-300
           hover:shadow-bloom hover:-translate-y-0.5
           focus:outline-none focus:ring-2 focus:ring-cta-500 focus:ring-offset-2;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center px-7 py-3.5
           bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-full
           shadow-soft transition-all duration-300
           hover:shadow-bloom hover:-translate-y-0.5
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }

  .btn-outline {
    @apply inline-flex items-center justify-center px-7 py-3.5
           border border-slate-300 text-slate-900 font-semibold rounded-full
           transition-all duration-300 hover:border-primary-400 hover:bg-primary-50
           focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2;
  }

  .section-container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .section-padding {
    @apply py-20 md:py-28;
  }

  .heading-1 {
    @apply font-display text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.02] text-slate-900;
  }

  .heading-2 {
    @apply font-display text-3xl md:text-5xl font-semibold tracking-tight text-slate-900;
  }

  .heading-3 {
    @apply font-display text-2xl md:text-3xl font-semibold tracking-tight text-slate-900;
  }

  .text-gradient {
    @apply bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent;
  }

  .eyebrow {
    @apply text-sm font-semibold uppercase tracking-[0.15em] text-primary-600;
  }

  .card-soft {
    @apply bg-white rounded-3xl shadow-soft transition-all duration-300
           hover:shadow-bloom hover:-translate-y-1;
  }

  .glass {
    @apply bg-white/70 backdrop-blur-md border border-white/60 shadow-soft;
  }

  .mesh-bg {
    background-image:
      radial-gradient(40rem 40rem at 15% 10%, rgba(99, 102, 241, 0.08), transparent 60%),
      radial-gradient(32rem 32rem at 85% 20%, rgba(6, 182, 212, 0.07), transparent 60%),
      radial-gradient(36rem 36rem at 60% 90%, rgba(245, 158, 11, 0.05), transparent 60%);
  }

  .kenburns > img {
    animation: kenburns 24s ease-in-out infinite alternate;
  }

  @keyframes kenburns {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.08);
    }
  }

  .marquee-track {
    display: flex;
    width: max-content;
    animation: marquee 30s linear infinite;
  }

  .marquee-track:hover {
    animation-play-state: paused;
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .kenburns > img,
    .marquee-track {
      animation: none;
    }
  }
}
```

Keep existing `@layer utilities` block.

- [ ] **Step 4: Hero asset + next.config** — same as Task A1 Step 4.

- [ ] **Step 5: Verify + Commit**

```bash
git add tailwind.config.ts src/app/globals.css src/app/layout.tsx next.config.js public/images/hwlab/hero-print-day.webp
git commit -m "feat(design): soft premium tokens - fonts, cream palette, soft shadows, global classes"
```

---

### Task B2: Wow primitives — TiltCard, Marquee, CountUp, motion presets

**Files:**
- Create: `src/components/effects/TiltCard.tsx`
- Create: `src/components/effects/Marquee.tsx`
- Create: `src/components/effects/CountUp.tsx` (identical code to Task A2 Step 3 — copy it verbatim)
- Create: `src/lib/motion.ts`

**Interfaces:**
- Produces: `<TiltCard className?: string, children>` (wrapper for `.card-soft` cards), `<Marquee children>` (duplicates children for seamless loop), `<CountUp value, suffix?, className?>`, `fadeUpSpring` / `staggerContainer` variants from `@/lib/motion`.

- [ ] **Step 1: TiltCard.tsx**

```tsx
'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 25 })
  const sry = useSpring(ry, { stiffness: 200, damping: 25 })

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 6)
        rx.set(-((e.clientY - rect.top) / rect.height - 0.5) * 6)
      }}
      onMouseLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Marquee.tsx**

```tsx
export function Marquee({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden" aria-hidden="false">
      <div className="marquee-track gap-16 pr-16">
        {children}
        <div aria-hidden="true" className="flex gap-16">
          {children}
        </div>
      </div>
    </div>
  )
}
```

(If children need flex layout, callers pass a flex row; duplication block is `aria-hidden`.)

- [ ] **Step 3: CountUp.tsx** — copy the exact component from Task A2 Step 3.

- [ ] **Step 4: `src/lib/motion.ts`**

```ts
import type { Variants } from 'framer-motion'

export const fadeUpSpring: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 16 },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
```

- [ ] **Step 5: Verify + Commit**

```bash
git add src/components/effects/TiltCard.tsx src/components/effects/Marquee.tsx src/components/effects/CountUp.tsx src/lib/motion.ts
git commit -m "feat(design): soft premium wow primitives - tilt card, marquee, countup, spring presets"
```

---

### Task B3: Header + Footer

**Files:** `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`

- [ ] **Step 1: Header** — floating glass bar: outer wrapper transparent, inner `glass rounded-full mx-4 mt-4 px-6` (pill header floating over content, `fixed`); links `text-slate-600 hover:text-slate-900 font-medium`; CTA `.btn-primary`. Mobile menu: full-screen `bg-cream/95 backdrop-blur-xl`, links `font-display text-4xl text-slate-900`. Keep all links/logic/aria.
- [ ] **Step 2: Footer** — `bg-cream-deep border-t border-slate-200`; headings `font-display text-slate-900`; links `text-slate-500 hover:text-primary-600`; generous `py-20`.
- [ ] **Step 3: Verify + Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/Footer.tsx
git commit -m "feat(design): soft premium header and footer"
```

---

### Task B4: HeroSection

**Files:** `src/components/sections/HeroSection.tsx`

- [ ] **Step 1: Restyle** — `<section className="relative mesh-bg overflow-hidden">`, asymmetric grid: left — `eyebrow` kicker, `heading-1` with one phrase in italic Fraunces (`font-display italic text-primary-600`), sub `text-xl text-slate-600 max-w-xl`, CTAs (`.btn-primary` + `.btn-outline`), trust chips as pill badges `bg-white shadow-soft rounded-full px-4 py-1.5 text-sm`. Right — hero photo in `rounded-[2.5rem] shadow-soft-lg overflow-hidden kenburns` frame (wrapper div around `next/image` so `.kenburns > img` applies), floating mini-card (`glass rounded-2xl p-4 absolute -bottom-6 -left-6` with `eyebrow`-style `HWLab · Praha 6`). Entrances via `fadeUpSpring` + `staggerContainer` from `@/lib/motion`. Keep copy/CTAs/analytics.
- [ ] **Step 2: Verify + Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat(design): soft premium hero with ken-burns and mesh background"
```

---

### Task B5: ProgramSection + USPSection + TrustSection

**Files:** `src/components/sections/ProgramSection.tsx`, `src/components/sections/USPSection.tsx`, `src/components/sections/TrustSection.tsx`

- [ ] **Step 1: ProgramSection** — camp cards: `<TiltCard className="card-soft overflow-hidden">` with pastel wash header block per camp (B-Recipes), price `font-display text-3xl text-slate-900`, badges as pastel pills. Specializations: plain `.card-soft` (no tilt — reserve wow for the 3 main cards). Keep grids/data/links/analytics.
- [ ] **Step 2: USPSection** — spacious 2×2 grid of `.card-soft p-8` with icon in pastel circle (`bg-primary-50 text-primary-600 rounded-2xl w-12 h-12`), stats via `<CountUp>` in `font-display text-5xl text-primary-600`.
- [ ] **Step 3: TrustSection** — `<Marquee>` of partner logos (grayscale, `opacity-70 hover:opacity-100`) on `bg-cream-deep` band + the 1:5 ratio copy as a `.card-soft` highlight with `<CountUp value={5}>`-style figure (render "1 : 5" with the 5 counted). Keep all copy.
- [ ] **Step 4: Verify + Commit**

```bash
git add src/components/sections/ProgramSection.tsx src/components/sections/USPSection.tsx src/components/sections/TrustSection.tsx
git commit -m "feat(design): soft premium program, USP and trust sections"
```

---

### Task B6: UpcomingTermsSection + CTASection + FAQSection + ContactSection

**Files:** `src/components/sections/UpcomingTermsSection.tsx`, `src/components/sections/CTASection.tsx`, `src/components/sections/FAQSection.tsx`, `src/components/sections/ContactSection.tsx`

- [ ] **Step 1: UpcomingTerms** — `.card-soft` rows: date in pastel square (`bg-primary-50 text-primary-700 rounded-2xl font-display`), camp + place center, CTA right; připravujeme = `border border-dashed border-slate-300 bg-transparent` (no shadow). Section on `bg-primary-50/50` band for color rhythm.
- [ ] **Step 2: CTASection** — the one saturated moment: `bg-primary-600 rounded-[3rem] mx-4 md:mx-8 text-white mesh-bg` inset panel (rounded section-in-section, premium pattern), `heading-2 text-white`, 3 camp cards `.card-soft` (white on indigo), amber CTAs. Email signup: white glass input row (`.glass rounded-full` wrapper, input transparent). Keep props + Formspree wiring.
- [ ] **Step 3: FAQSection** — accordion items as separate `.card-soft rounded-2xl` blocks with generous padding; question `font-display text-lg text-slate-900`; smooth height animation stays. Keep logic/copy.
- [ ] **Step 4: ContactSection** — split card: one large `.card-soft overflow-hidden` grid — left pastel panel (`bg-primary-50 p-10`) with contact rows + icons `text-primary-600`, right form with light inputs per B-Recipes. Keep wiring.
- [ ] **Step 5: Verify + Commit** — homepage rhythm check: cream → pastel bands → indigo inset CTA → cream.

```bash
git add src/components/sections/UpcomingTermsSection.tsx src/components/sections/CTASection.tsx src/components/sections/FAQSection.tsx src/components/sections/ContactSection.tsx
git commit -m "feat(design): soft premium terms, CTA, FAQ and contact sections"
```

---

### Task B7: Camp pages — TermsList, GallerySection, all three camp pages

**Files:** `src/components/camps/TermsList.tsx`, `src/components/sections/GallerySection.tsx`, `src/app/tabor-3d-tisk/client.tsx`, `src/app/tabor-iot/client.tsx`, `src/app/tabor-chytrych-technologii/client.tsx`

- [ ] **Step 1: TermsList** — same pattern as B6 Step 1. Confirmed = `.card-soft` + amber pill CTA to DDM; připravujeme = dashed + inline interest form with light inputs.
- [ ] **Step 2: GallerySection** — masonry-feel grid with `rounded-3xl shadow-soft hover:shadow-bloom hover:-translate-y-1` thumbs; keep lightbox logic.
- [ ] **Step 3: Camp pages** — per B-Recipes, keep all data/forms/analytics:
  - Hero: `mesh-bg`, `eyebrow` breadcrumb, `heading-1` (accent phrase italic per camp color), spec facts as pill row (`bg-white shadow-soft rounded-full px-4 py-2` chips: věk, kapacita, cena, čas — values from existing data).
  - Day program: vertical timeline with pastel dots (`bg-primary-100 border-2 border-primary-500 rounded-full w-4 h-4`), time `font-display text-primary-600`, cards `.card-soft p-6` per item.
  - 3D tisk printers: `<TiltCard className="card-soft">` grid, model names `font-display`.
  - IoT uses trust/emerald pastels, MIX/3D tisk primary/indigo pastels.
- [ ] **Step 4: Verify + Commit** — all three pages, mobile too; DDM links + interest form fire.

```bash
git add src/components/camps/TermsList.tsx src/components/sections/GallerySection.tsx src/app/tabor-3d-tisk/client.tsx src/app/tabor-iot/client.tsx src/app/tabor-chytrych-technologii/client.tsx
git commit -m "feat(design): soft premium camp pages + shared terms/gallery"
```

---

### Task B8: Karlovy Vary section

**Files:** same 8 KV files as Task A8.

- [ ] **Step 1:** KV camp + letni-primestsky pages per B7 camp-page treatment. `SpotsLeft`: amber pastel pill (`bg-cta-50 text-cta-700 rounded-full px-3 py-1 font-semibold`). `VenueShowcase`/`ProjectGallery`: rounded-3xl soft-shadow frames. `KVRegistrationSection`: light inputs, `.btn-primary` submit; keep fields/validation/tracking.
- [ ] **Step 2:** KV o-nas + kontakt mirror B-patterns (split contact card, team `.card-soft` grid).
- [ ] **Step 3: Verify + Commit**

```bash
git add src/app/karlovy-vary/_components/KVRegistrationSection.tsx src/app/karlovy-vary/_components/ProjectGallery.tsx src/app/karlovy-vary/_components/SpotsLeft.tsx src/app/karlovy-vary/_components/VenueShowcase.tsx src/app/karlovy-vary/tabor-chytrych-technologii/page.tsx src/app/karlovy-vary/letni-primestsky/page.tsx src/app/karlovy-vary/o-nas/page.tsx src/app/karlovy-vary/kontakt/page.tsx
git commit -m "feat(design): soft premium Karlovy Vary section"
```

---

### Task B9: E-shop

**Files:** same 8 e-shop files as Task A9.

- [ ] **Step 1:** Product cards `<TiltCard className="card-soft">`, image on `bg-cream-deep rounded-2xl` backplate, price `font-display text-xl text-slate-900`. Detail: `eyebrow` category, big `heading-2`, amber pill add-to-cart.
- [ ] **Step 2:** Cart rows in one `.card-soft` container, dividers `border-slate-100`, totals `font-display`; `CartButton` badge `bg-cta-500 text-white rounded-full`.
- [ ] **Step 3: Verify + Commit**

```bash
git add src/app/eshop/page.tsx "src/app/eshop/[slug]/page.tsx" src/app/eshop/kosik/page.tsx src/components/shop/ProductCatalog.tsx src/components/shop/CartPageClient.tsx src/components/shop/AddToCartButton.tsx src/components/shop/CartButton.tsx src/components/shop/ProductInterestButton.tsx
git commit -m "feat(design): soft premium e-shop"
```

---

### Task B10: Registration + payment flow

**Files:** same 6 files as Task A10.

- [ ] **Step 1:** RegistrationForm inside one large `.card-soft p-8 md:p-12`; field groups with `eyebrow` titles; light inputs per B-Recipes; submit `.btn-primary` full-width on mobile. Errors `text-red-600 border-red-300 bg-red-50`.
- [ ] **Step 2:** Confirmation/PaymentRedirect: `.card-soft` summary, statuses success `text-trust-600 bg-trust-50`, pending `text-cta-700 bg-cta-50` pills.
- [ ] **Step 3: Verify + Commit**

```bash
git add src/components/registration/RegistrationForm.tsx src/components/registration/RegistrationConfirmation.tsx src/components/registration/PaymentRedirect.tsx src/app/registrace/page.tsx "src/app/registrace/[id]/page.tsx" "src/app/platba/[id]/page.tsx"
git commit -m "feat(design): soft premium registration and payment flow"
```

---

### Task B11: Static, legal + landing pages, banners

**Files:** same 11 files as Task A11.

- [ ] **Step 1:** program/o-nas/kontakt — B-patterns; o-nas team as `.card-soft` grid with pastel icon circles; program page alternating rows with pastel band backgrounds.
- [ ] **Step 2:** Legal pages (both cities): `max-w-3xl` column, `font-display` headings, `text-slate-600 leading-relaxed` body, no cards.
- [ ] **Step 3:** kveten: minimal layout kept, two `.card-soft` camp cards + light lead form. 404: `font-display text-8xl text-gradient` + `.btn-primary`.
- [ ] **Step 4:** CookieConsent + KVRegionNudge: `.glass rounded-3xl shadow-soft-lg` panels, amber primary + outline secondary; keep toggles/logic.
- [ ] **Step 5: Verify + Commit**

```bash
git add src/app/program/page.tsx src/app/o-nas/page.tsx src/app/kontakt/page.tsx src/app/gdpr/page.tsx src/app/podminky/page.tsx src/app/karlovy-vary/gdpr/page.tsx src/app/karlovy-vary/podminky/page.tsx src/app/kveten/page.tsx src/app/not-found.tsx src/components/ui/CookieConsent.tsx src/components/ui/KVRegionNudge.tsx
git commit -m "feat(design): soft premium static, legal and landing pages + banners"
```

---

### Task B12: Final QA + push + Vercel preview

- [ ] **Step 1:** `npm run build` + `npm run lint` pass.
- [ ] **Step 2:** Cross-page QA (same page list as A12), reduced-motion emulation (no ken-burns/marquee/tilt/countup), cookie banner + nudge functional, glass header readable over every section it floats above.
- [ ] **Step 3:** `git push -u origin design/soft-premium`, grab Vercel preview URL, confirm public access.
- [ ] **Step 4:** Hand over all three preview URLs (maker-lab memory has the stable one) + production for the team vote.
