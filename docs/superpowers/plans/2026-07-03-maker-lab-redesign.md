# Maker Lab Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle weeks.cz (tokens + header/footer + homepage + /tabor-3d-tisk) into the "maker lab" aesthetic with existing brand colors, on branch `design/maker-lab`, delivering a Vercel preview URL today.

**Architecture:** Token-first redesign — new fonts, neutrals (paper/ink), shape language and utility classes land in `tailwind.config.ts` + `globals.css` + `layout.tsx` first; then components are restyled to the new language, page by page. No logic, copy, form, analytics, or SEO changes anywhere.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS 3, Framer Motion, next/font (Google Fonts self-hosted).

## Global Constraints

- Branch: `design/maker-lab` (already created; spec committed).
- NEVER `git add -A` / `git add .` — repo root contains stray untracked files. Always add exact paths.
- Copy, prices, terms, DDM links, forms (Formspree/waitlist), analytics events (GA4/Pixel/Sklik), consent gating, SEO metadata, structured data: **unchanged**. Visual layer only.
- All user-facing text in Czech; do not reword existing copy.
- `prefers-reduced-motion` support must survive (MotionProvider stays; keep existing `useReducedMotion` usages).
- Brand color scales (primary/accent/trust/cta) stay exactly as defined today; new additions are `paper` and `ink` neutrals only.
- Camp accent mapping stays: MIX = primary(indigo), 3D tisk = primary, IoT = trust(emerald), CTA buttons = cta(amber).
- Verification per task: `npm run build` passes; visual check in running dev server (`npm run dev`, localhost:3000).
- Out-of-scope pages (KV, e-shop, registrace, legal, program, o-nás, kontakt) are NOT edited — they inherit tokens. If a token change *breaks* their layout (not just restyles), fix forward minimally.

## Design Recipes (canonical patterns — use everywhere)

**Mono label (section tags, metadata rows, "kóty"):**
```tsx
<span className="mono-label">01 — PROČ WEEKS</span>
// globals.css provides: font-mono text-xs uppercase tracking-[0.2em] text-ink/60
```

**Maker card (replaces gradient/shadow cards):**
```tsx
<div className="card-maker p-6">
  {/* card-maker = bg-white border border-ink/15 rounded-md transition-all duration-200
      hover:shadow-hard hover:-translate-y-0.5 hover:-translate-x-0.5 */}
  <div className="mono-label mb-3">SO+NE · 2 990 KČ · MAX 15</div>
  ...
</div>
```

**Hard shadow CTA:**
```tsx
<Link href="..." className="btn-primary">Nezávazná registrace</Link>
// btn-primary = bg-cta-500 text-ink border border-ink rounded-md font-semibold
//               shadow-hard-sm hover:shadow-hard hover:-translate-y-0.5 ...
```

**Blueprint grid background (hero, dark section):**
```tsx
<section className="relative bg-paper blueprint-grid">…</section>
// .blueprint-grid: CSS linear-gradient grid lines, indigo at low opacity, 32px cell
```

**Dark (ink) section:** `bg-ink text-paper` + `blueprint-grid-dark` variant; accents `text-accent-400` / amber CTAs unchanged.

---

### Task 1: Design tokens — fonts, colors, shadows, global classes

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx:3,16-26,107`

**Interfaces:**
- Produces: Tailwind utilities `bg-paper`, `bg-ink`, `text-ink`, `border-ink/15`, `shadow-hard`, `shadow-hard-sm`, `font-display`, `font-mono`; CSS classes `.mono-label`, `.card-maker`, `.blueprint-grid`, `.blueprint-grid-dark`; restyled `.btn-primary/.btn-secondary/.btn-outline`, `.heading-1/2/3`, `.section-container`, `.section-padding`. All later tasks consume these.

- [ ] **Step 1: Fonts in `src/app/layout.tsx`**

Replace the font imports and instances (lines 3, 16–26) and body className (line 107):

```tsx
import { Bricolage_Grotesque, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google'

const instrumentSans = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})
```

Body: `` <body className={`${instrumentSans.variable} ${bricolage.variable} ${plexMono.variable} font-sans`}> ``

Nothing else in layout.tsx changes (metadata, analytics, providers untouched).

- [ ] **Step 2: Tokens in `tailwind.config.ts`**

Inside `theme.extend.colors` add (keep existing scales verbatim):

```ts
paper: {
  DEFAULT: '#FAFAF7',
  soft: '#F4F4EE',
},
ink: {
  DEFAULT: '#0C0E1A',
  700: '#232741',
  500: '#4A4F6A',
  300: '#9DA2BC',
},
```

Replace `fontFamily` with:

```ts
fontFamily: {
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
},
```

Add `boxShadow` to `theme.extend`:

```ts
boxShadow: {
  'hard': '4px 4px 0 0 #0C0E1A',
  'hard-sm': '2px 2px 0 0 #0C0E1A',
  'hard-amber': '4px 4px 0 0 #D97706',
},
```

Keep existing `animation`/`keyframes` (float stays defined; usage removed in component tasks).

- [ ] **Step 3: Rewrite `src/app/globals.css` component layer**

Full new content of the `@layer base` and `@layer components` blocks (utilities layer keeps animation-delay helpers):

```css
@layer base {
  :root {
    --background: 250 250 247;
    --foreground: 12 14 26;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-paper text-ink antialiased;
  }

  ::selection {
    @apply bg-cta-300 text-ink;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center px-6 py-3
           bg-cta-500 hover:bg-cta-400 text-ink font-semibold
           border border-ink rounded-md shadow-hard-sm
           transition-all duration-200
           hover:shadow-hard hover:-translate-y-0.5 hover:-translate-x-0.5
           focus:outline-none focus:ring-2 focus:ring-cta-500 focus:ring-offset-2;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center px-6 py-3
           bg-ink hover:bg-ink-700 text-paper font-semibold
           border border-ink rounded-md
           transition-all duration-200
           hover:shadow-hard hover:-translate-y-0.5 hover:-translate-x-0.5
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }

  .btn-outline {
    @apply inline-flex items-center justify-center px-6 py-3
           border border-ink text-ink font-semibold
           rounded-md transition-all duration-200
           hover:bg-ink hover:text-paper
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }

  .section-container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .section-padding {
    @apply py-16 md:py-24;
  }

  .heading-1 {
    @apply font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95];
  }

  .heading-2 {
    @apply font-display text-3xl md:text-5xl font-bold tracking-tight;
  }

  .heading-3 {
    @apply font-display text-2xl md:text-3xl font-semibold tracking-tight;
  }

  .text-gradient {
    @apply text-primary-600;
  }

  .mono-label {
    @apply font-mono text-xs uppercase tracking-[0.2em] text-ink/60;
  }

  .mono-label-dark {
    @apply font-mono text-xs uppercase tracking-[0.2em] text-paper/60;
  }

  .card-maker {
    @apply bg-white border border-ink/15 rounded-md
           transition-all duration-200
           hover:shadow-hard hover:-translate-y-0.5 hover:-translate-x-0.5 hover:border-ink;
  }

  .blueprint-grid {
    background-image:
      linear-gradient(to right, rgba(79, 70, 229, 0.06) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(79, 70, 229, 0.06) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  .blueprint-grid-dark {
    background-image:
      linear-gradient(to right, rgba(165, 180, 252, 0.07) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(165, 180, 252, 0.07) 1px, transparent 1px);
    background-size: 32px 32px;
  }
}
```

Note `.text-gradient` becomes a solid primary color on purpose — kills the gradient-text template look everywhere it's used without touching every file.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds. (Font downloads happen at build time; needs network.)

- [ ] **Step 5: Visual smoke check**

Run `npm run dev`, open localhost:3000 — new fonts + paper background visible sitewide; nothing crashes.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.ts src/app/globals.css src/app/layout.tsx
git commit -m "feat(design): maker lab tokens - fonts, paper/ink neutrals, hard shadows, utility classes"
```

---

### Task 2: Header + Footer

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: Task 1 classes (`mono-label`, `shadow-hard-sm`, `bg-paper`, `bg-ink`, `font-display`).
- Produces: no API changes — component props/exports unchanged.

- [ ] **Step 1: Restyle Header.tsx**

Keep all nav links, logic, aria attributes. Change styling only:
- Bar: `bg-paper/95 backdrop-blur border-b border-ink/15` (remove soft shadow). Scrolled state (existing scroll listener if present, else keep static): reduce padding.
- Nav links: `font-medium text-ink/70 hover:text-ink` with underline offset on hover (`hover:underline underline-offset-8 decoration-2 decoration-cta-500`).
- CTA button: use `.btn-primary` (amber, hard shadow).
- Mobile menu: fullscreen ink overlay — `fixed inset-0 bg-ink text-paper`, links in `font-display text-4xl font-bold`, mono-label-dark tagline at bottom (`WEEKS — IT TÁBORY · PRAHA & KARLOVY VARY`), close button top-right. Preserve existing open/close state logic and aria-expanded.

- [ ] **Step 2: Restyle Footer.tsx**

Keep all links/columns/legal text. Change styling only:
- Background: `bg-ink text-paper` with `blueprint-grid-dark`.
- Column headings: `mono-label-dark`.
- Top edge: `border-t border-ink`.
- Big wordmark row: add `font-display text-5xl md:text-7xl font-bold text-paper/10 select-none` "WEEKS" typographic watermark above the columns (pure decoration, `aria-hidden="true"`).
- Links: `text-paper/70 hover:text-paper`.

- [ ] **Step 3: Verify**

`npm run build` passes; dev server: check desktop nav, mobile menu open/close, footer on homepage + on /kontakt (inherited page — must not break).

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/Footer.tsx
git commit -m "feat(design): maker lab header and footer"
```

---

### Task 3: Hero + SummerBanner

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`
- Modify: `src/components/sections/SummerBanner.tsx`

**Interfaces:**
- Consumes: Task 1 classes. Keeps existing CTA hrefs and analytics calls.

- [ ] **Step 1: Restyle HeroSection.tsx**

Replace the full-bleed photo background + overlay pattern with an asymmetric editorial layout. Target structure (adapt copy/CTAs/analytics from current file verbatim):

```tsx
<section className="relative bg-paper blueprint-grid border-b border-ink/15">
  <div className="section-container grid lg:grid-cols-12 gap-10 items-center py-20 md:py-28">
    <div className="lg:col-span-7">
      <p className="mono-label mb-6">LÉTO 2026 · PRAHA &amp; KARLOVY VARY</p>
      <h1 className="heading-1">{/* existing headline copy */}</h1>
      <p className="mt-6 text-lg text-ink-500 max-w-xl">{/* existing subheadline */}</p>
      <div className="mt-8 flex flex-wrap gap-4">{/* existing CTAs -> btn-primary / btn-outline */}</div>
      {/* existing trust chips -> row of mono-label items separated by ' · ' */}
    </div>
    <div className="lg:col-span-5 relative">
      <div className="border border-ink rounded-md overflow-hidden shadow-hard">
        {/* existing HWLab Image, no overlay */}
      </div>
      <span className="mono-label absolute -bottom-6 right-0">HWLAB — PRAHA 6</span>
    </div>
  </div>
</section>
```

Keep Framer Motion fade-up entrances; delete floating blob/gradient decorations if present.

- [ ] **Step 2: Restyle SummerBanner.tsx**

Keep link target (`/tabor-chytrych-technologii#leto`), copy, analytics. Restyle from amber gradient banner to a "ticket" strip: `bg-cta-500 border-y border-ink`, content row with `mono-label` (`text-ink/70`) prefix `LÉTO 2026`, bold display text, arrow link. No gradient.

- [ ] **Step 3: Verify + Commit**

Build + dev check (desktop & ~375px mobile width).

```bash
git add src/components/sections/HeroSection.tsx src/components/sections/SummerBanner.tsx
git commit -m "feat(design): maker lab hero and summer banner"
```

---

### Task 4: ProgramSection + USPSection + TrustSection

**Files:**
- Modify: `src/components/sections/ProgramSection.tsx`
- Modify: `src/components/sections/USPSection.tsx`
- Modify: `src/components/sections/TrustSection.tsx`

**Interfaces:**
- Consumes: Task 1 classes + camp accent mapping from Global Constraints.

- [ ] **Step 1: ProgramSection.tsx**

Keep data arrays, links, analytics, grid structure (3-col camps + 4-col specializations). Restyle:
- Section header: `mono-label` (`01 — TÁBORY`) + `heading-2`; remove gradient text.
- Camp cards → `card-maker` pattern with mono metadata row (`SO+NE · 2 990 KČ · MAX 15` style — derive values from existing card data, do not invent), camp accent as small solid square/number chip (`bg-primary-600 text-white font-mono`), badges (`Jednodenní`, `Nově`) as mono bordered chips (`border border-ink font-mono text-xs px-2 py-0.5 rounded-sm`).
- Specialization cards: simpler `card-maker` without metadata row.
- Remove per-card background gradients entirely.

- [ ] **Step 2: USPSection.tsx**

Keep copy. Restyle to numbered list style: each USP = grid row with `font-mono text-sm text-ink/40` index (`01`–`04`), `heading-3` title, body text; rows separated by `border-t border-ink/15`. Drop icon-in-colored-circle treatment (keep Lucide icons but render them `w-5 h-5 text-primary-600` inline next to title).

- [ ] **Step 3: TrustSection.tsx**

Keep partner logos/copy (DDM, HWLab, 1:5 ratio). Restyle: paper-soft band (`bg-paper-soft border-y border-ink/15`), `mono-label` header (`PARTNEŘI A ZÁZEMÍ`), logos in bordered cells of a grid (each cell `border border-ink/15` in a joined table look, negative margin trick `-ml-px -mt-px`).

- [ ] **Step 4: Verify + Commit**

Build + dev check.

```bash
git add src/components/sections/ProgramSection.tsx src/components/sections/USPSection.tsx src/components/sections/TrustSection.tsx
git commit -m "feat(design): maker lab program, USP and trust sections"
```

---

### Task 5: UpcomingTermsSection + CTASection (dark) + FAQSection + ContactSection

**Files:**
- Modify: `src/components/sections/UpcomingTermsSection.tsx`
- Modify: `src/components/sections/CTASection.tsx`
- Modify: `src/components/sections/FAQSection.tsx`
- Modify: `src/components/sections/ContactSection.tsx`

**Interfaces:**
- Consumes: Task 1 classes. `UpcomingTermsSection` keeps its `terms` prop, `CTASection` keeps `nextTerms` prop — signatures unchanged.

- [ ] **Step 1: UpcomingTermsSection.tsx**

Terms become "tickets": row/list of `card-maker` items with `font-mono` date block left (`11–12. 4.`), camp name + place center, status/CTA right. Confirmed = solid border + amber `btn-primary` small; připravujeme = `border-dashed border-ink/40` + existing interest link. Keep all term data source and links.

- [ ] **Step 2: CTASection.tsx — THE dark section**

Wrapper: `bg-ink text-paper blueprint-grid-dark border-y border-ink`. Section header `mono-label-dark` (`VYBER SI TÁBOR`) + `heading-2 text-paper`. The 3 camp cards: `bg-ink-700/50 border border-paper/20 rounded-md hover:border-paper` with camp accent only as top border strip (`border-t-2 border-t-accent-400` style per camp: MIX indigo-300, 3D tisk primary-300, IoT trust-300 — light variants for dark bg) and mono metadata row (`mono-label-dark`). CTA buttons stay amber `btn-primary` (pops on ink). Email signup form: keep logic/Formspree wiring, restyle input (`bg-transparent border border-paper/30 text-paper placeholder:text-paper/40 rounded-md font-mono`).

- [ ] **Step 3: FAQSection.tsx**

Keep accordion logic + copy. Restyle: items separated by `border-t border-ink/15` (last also border-b), question row with `font-mono text-sm text-ink/40` index (`Q01`…), `font-display font-semibold` question, plus/minus indicator instead of chevron if trivial (else keep chevron). No card backgrounds.

- [ ] **Step 4: ContactSection.tsx**

Keep contact data + form wiring. Restyle to two-column: left `mono-label` header (`KONTAKT`) + big `heading-2` + contact rows with mono labels (`TEL`, `E-MAIL`, `ADRESA`); right the form with bordered inputs (`border border-ink/20 rounded-md bg-white focus:border-ink focus:ring-1 focus:ring-ink`).

- [ ] **Step 5: Verify + Commit**

Build + dev check of full homepage flow, light→dark→light section rhythm.

```bash
git add src/components/sections/UpcomingTermsSection.tsx src/components/sections/CTASection.tsx src/components/sections/FAQSection.tsx src/components/sections/ContactSection.tsx
git commit -m "feat(design): maker lab terms, dark CTA, FAQ and contact sections"
```

---

### Task 6: /tabor-3d-tisk page

**Files:**
- Modify: `src/app/tabor-3d-tisk/client.tsx`

**Interfaces:**
- Consumes: Task 1 classes. All data (terms, prices, DDM URLs, forms, analytics `trackViewOnedayCamp`/interest events) unchanged.

- [ ] **Step 1: Hero with spec sheet**

Page hero on `bg-paper blueprint-grid`: `mono-label` breadcrumb (`TÁBORY / 3D TISK`), `heading-1`, then a bordered spec-sheet table:

```tsx
<dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 border border-ink rounded-md overflow-hidden bg-white">
  {[['VĚK', '10–15 let'], ['KAPACITA', 'max 15'], ['CENA', '1 490 Kč'], ['ČAS', '8:30–16:30']].map(([k, v]) => (
    <div key={k} className="p-4 border-r border-b sm:border-b-0 border-ink/15 last:border-r-0">
      <dt className="mono-label">{k}</dt>
      <dd className="mt-1 font-display font-semibold">{v}</dd>
    </div>
  ))}
</dl>
```

(Values must come from the existing page data — verify against current copy, do not invent.)

- [ ] **Step 2: Day program as dimension-line timeline**

Restyle the schedule to: left column `font-mono text-sm` times, vertical `border-l border-ink` line with square node markers (`w-2 h-2 bg-primary-600 -ml-1`), right column titles + descriptions. Keep every schedule item's copy.

- [ ] **Step 3: Printer showcase grid**

Bordered joined-cell grid (like TrustSection logos): each printer model in a cell with `font-mono` model name (`MK4S`, `CORE One`, …) and existing descriptions.

- [ ] **Step 4: Terms as tickets + rest of page**

Same ticket pattern as Task 5 Step 1 (confirmed solid + amber CTA to DDM URL; připravujeme dashed + existing inline interest form restyled with bordered inputs). Remaining sections (FAQ/practical info) follow homepage patterns: mono-label headers, border-separated lists, `card-maker` where cards remain. Remove all gradient backgrounds and floating decorations.

- [ ] **Step 5: Verify + Commit**

Build + dev check of /tabor-3d-tisk desktop & mobile; test that the interest form still submits (dev: check network call fires) and DDM links point to ddmp6.cz.

```bash
git add src/app/tabor-3d-tisk/client.tsx
git commit -m "feat(design): maker lab 3D tisk camp page"
```

---

### Task 7: Final QA + push + Vercel preview

**Files:** none (verification only)

- [ ] **Step 1: Full build + lint**

Run: `npm run build` and `npm run lint`
Expected: both pass.

- [ ] **Step 2: Cross-page visual QA in dev server**

Check: homepage (desktop + 375px), /tabor-3d-tisk, and inherited pages /tabor-iot, /program, /kontakt, /karlovy-vary — inherited pages must be visually coherent (new fonts/tokens) and unbroken. Cookie banner + KV nudge still render and function.

- [ ] **Step 3: Push branch**

```bash
git push -u origin design/maker-lab
```

Note: push must run under the lxkask/lukoluko8 GitHub auth (see memory: default account gets 403).

- [ ] **Step 4: Get Vercel preview URL**

Vercel auto-builds the branch. Retrieve the preview URL (Vercel dashboard or `gh` deployment status on the branch) and hand it to Lukáš for the call. Confirm the preview deployment is publicly accessible (no Vercel deployment protection blocking teammates).
