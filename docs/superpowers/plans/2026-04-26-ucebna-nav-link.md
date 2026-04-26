# Učebna Nav Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a discreet "Učebna ↗" link in the `weeks.cz` navbar (desktop + mobile) pointing to `iot.weeks.cz`, with a light GA4 event for click tracking — no footer, no banner, no CTA styling.

**Architecture:** Two files touched in `weeks_web` repo. One new helper in `src/lib/analytics.ts` for the GA4 event. Two surgical edits to `src/components/layout/Header.tsx` — one for desktop nav, one for mobile menu — both styled quieter than surrounding nav items per the spec.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, Framer Motion (already in `Header.tsx`), Lucide React (`ExternalLink` icon), GA4 via `@next/third-parties/google` (already used in `analytics.ts`).

---

## Design Reference

Spec: `docs/superpowers/specs/2026-04-26-ucebna-nav-link-design.md`

## Scope

Single small feature, single repo (`weeks_web`). No decomposition. Three sequential tasks plus a manual smoke-test task.

## Execution Context

Runs in the **current working directory** `C:\Users\lukol\Downloads\weeks_web` (this is NOT the `weeks-iot` repo). The `iot.weeks.cz` platform is unaffected.

Before starting:
- Working tree on `main` should be clean of unrelated edits to `Header.tsx` / `analytics.ts` (untracked images and the unrelated `MIX.docx` in repo root are fine — leave them alone)
- `npm install` already done (existing project; `node_modules/` present)

## File Structure Plan

```
weeks_web/
├── src/
│   ├── lib/
│   │   └── analytics.ts                 # MODIFY — append trackUcebnaClick helper
│   └── components/
│       └── layout/
│           └── Header.tsx               # MODIFY — add Učebna link to desktop nav + mobile menu
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-04-26-ucebna-nav-link-design.md  # already exists (spec)
        └── plans/
            └── 2026-04-26-ucebna-nav-link.md          # this file
```

**Files NOT modified:**
- `src/components/layout/Footer.tsx` — out of scope per spec Decision #6
- Any homepage section component — Učebna does not get a teaser
- `next.config.ts` / `vercel.json` / `robots.txt` / `sitemap.ts` — Učebna is an external link, not a route on weeks.cz

## Convention Note

The spec example uses `(window as any).gtag(...)` directly. The actual codebase wraps GA4 calls through `sendGAEvent` from `@next/third-parties/google` (see existing helpers in `src/lib/analytics.ts` like `trackNavCTA`). **This plan uses `sendGAEvent` to match the existing convention** — same observable behavior, consistent with every other tracker in the file.

---

## Task 1: [Agent] Add `trackUcebnaClick` helper to analytics.ts

**Files:**
- Modify: `src/lib/analytics.ts` (append at end of file)

- [ ] **Step 1: Append the helper function**

Open `src/lib/analytics.ts` and append at the very end of the file (after `trackRegistrationFormOpen`):

```typescript

// Učebna nav link click — tracks how often visitors discover the IoT learning platform
// from weeks.cz nav. Expected to be low (campers + lecturers only); high values would
// suggest the link is mis-styled and pulling casual visitors away from the funnel.
export function trackUcebnaClick(source: 'desktop' | 'mobile') {
  sendGAEvent('event', 'ucebna_click', { source })
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Lint**

```bash
npm run lint -- src/lib/analytics.ts
```

Expected: no errors, no warnings.

- [ ] **Step 4: Commit**

```bash
git add src/lib/analytics.ts && git commit -m "feat(analytics): add trackUcebnaClick for nav link to iot.weeks.cz"
```

---

## Task 2: [Agent] Add Učebna link to `Header.tsx` (desktop + mobile)

**Files:**
- Modify: `src/components/layout/Header.tsx` (3 surgical edits)

> **Why one task for both viewports:** they live in the same file, share the import + handler, and a partial rollout (desktop only or mobile only) would be a regression for the other viewport. One commit, both ready.

- [ ] **Step 1: Add `ExternalLink` to the lucide-react import**

Find this line in `src/components/layout/Header.tsx`:

```typescript
import { Menu, X, ChevronRight } from 'lucide-react'
```

Replace with:

```typescript
import { Menu, X, ChevronRight, ExternalLink } from 'lucide-react'
```

- [ ] **Step 2: Add `trackUcebnaClick` to the analytics import**

Find this line:

```typescript
import { trackNavCTA } from '@/lib/analytics'
```

Replace with:

```typescript
import { trackNavCTA, trackUcebnaClick } from '@/lib/analytics'
```

- [ ] **Step 3: Insert the desktop Učebna link before the CTA**

Find this block in the desktop navigation section (the `<div className="hidden md:flex items-center gap-1">` block), specifically the part right after the closing `</Link>` of the `navigation.map(...)` and before the `<Link href="/#prihlasit" ...>` CTA:

```tsx
          ))}
          <Link
            href="/#prihlasit"
            className="ml-4 btn-primary group"
            onClick={() => trackNavCTA('desktop')}
          >
            Vybrat termín
```

Replace with:

```tsx
          ))}
          <a
            href="https://iot.weeks.cz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Učebna — výuková platforma (otevře se v nové záložce)"
            onClick={() => trackUcebnaClick('desktop')}
            className={`ml-2 flex items-center text-sm transition-colors ${
              scrolled ? 'text-gray-500 hover:text-gray-700' : 'text-white/60 hover:text-white/80'
            }`}
          >
            Učebna
            <ExternalLink className="w-3 h-3 ml-1" aria-hidden="true" />
          </a>
          <Link
            href="/#prihlasit"
            className="ml-4 btn-primary group"
            onClick={() => trackNavCTA('desktop')}
          >
            Vybrat termín
```

- [ ] **Step 4: Insert the mobile Učebna link before the mobile CTA**

Find the mobile menu CTA block (inside the `<AnimatePresence>` mobile menu, the `<motion.div ... className="pt-2">` wrapping the mobile `Vybrat termín` Link):

```tsx
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navigation.length * 0.05 }}
                className="pt-2"
              >
                <Link
                  href="/#prihlasit"
                  className="btn-primary w-full text-center justify-center"
                  onClick={() => { trackNavCTA('mobile'); setMobileMenuOpen(false) }}
                >
                  Vybrat termín
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </motion.div>
```

Replace with:

```tsx
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navigation.length * 0.05 }}
                className="border-t border-gray-100 pt-2 mt-2"
              >
                <a
                  href="https://iot.weeks.cz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Učebna — výuková platforma (otevře se v nové záložce)"
                  onClick={() => { trackUcebnaClick('mobile'); setMobileMenuOpen(false) }}
                  className="flex items-center px-4 py-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Učebna
                  <ExternalLink className="w-3 h-3 ml-1.5" aria-hidden="true" />
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navigation.length + 1) * 0.05 }}
                className="pt-2"
              >
                <Link
                  href="/#prihlasit"
                  className="btn-primary w-full text-center justify-center"
                  onClick={() => { trackNavCTA('mobile'); setMobileMenuOpen(false) }}
                >
                  Vybrat termín
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </motion.div>
```

> **Note on the mobile order:** Učebna comes BEFORE the CTA in the JSX so the visual order is `Program · Proč Weeks · O nás · Kontakt · ─── · Učebna ↗ · [Vybrat termín CTA]` (matches spec — separator between regular nav and Učebna; CTA below Učebna). The animation delay for the CTA bumps to `navigation.length + 1` so the staggered fade-in still ends with the CTA last.

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Lint**

```bash
npm run lint -- src/components/layout/Header.tsx
```

Expected: no errors, no warnings.

- [ ] **Step 7: Production build**

```bash
npm run build
```

Expected: build completes; no warnings about missing components or imports; no React hydration warnings printed during prerender.

- [ ] **Step 8: Commit**

```bash
git add src/components/layout/Header.tsx && git commit -m "feat(header): add Učebna link to desktop nav + mobile menu"
```

---

## Task 3: [Agent + Lukáš] Manual smoke test on dev server

**Files:** none (verification only)

> **Why a dedicated task:** the spec is mostly about visual subtlety (lighter/smaller, no underline, hairline separator on mobile). Type-check + build cannot detect "the link is too prominent" or "the separator is invisible on this background." A human eye is the test.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Expected: server starts, `Ready in <Xs>` printed; URL is `http://localhost:3000`.

- [ ] **Step 2: Open browser to `http://localhost:3000`**

- [ ] **Step 3: Verify desktop nav at top of page (header is transparent over hero)**

Visually confirm:
- [ ] "Učebna ↗" appears between "Kontakt" and the orange "Vybrat termín" CTA
- [ ] Učebna text is visibly **lighter** than other nav items (white/60 vs white/90)
- [ ] Učebna text is visibly **smaller** than other nav items (text-sm vs base)
- [ ] External-link icon (small arrow ↗) sits to the right of the word
- [ ] Hover on Učebna: color shifts slightly brighter, **no underline appears**
- [ ] Hover on a regular nav item ("Program"): color shifts AND underline appears below (regression check — existing behavior intact)

- [ ] **Step 4: Scroll the page down ~50 px until the header turns white**

Visually confirm:
- [ ] Učebna text turns gray-500 (visibly muted vs gray-600 of other items)
- [ ] CTA button stays orange and prominent — no visual confusion
- [ ] Hover behavior on Učebna and regular items still as in Step 3

- [ ] **Step 5: Verify GA4 event fires (desktop click)**

Open browser DevTools → Network tab → filter for `g/collect`. Click "Učebna ↗".

Expected:
- New tab opens at `https://iot.weeks.cz/` (the IoT platform — TopicSelect or whatever its current state is)
- A `g/collect` request fires from `localhost:3000` with query string containing `en=ucebna_click` and `ep.source=desktop`

(If `g/collect` does not appear, GA4 may be blocked by a browser extension — disable ad-blocker for `localhost` or test in an incognito window without extensions.)

- [ ] **Step 6: Resize browser to mobile width (≤ 768 px)**

- [ ] **Step 7: Open mobile hamburger menu**

Click the hamburger icon (top-right). Visually confirm in the open mobile menu:
- [ ] Order: `Program · Proč Weeks · O nás · Kontakt`, then a thin gray separator line, then `Učebna ↗`, then `[Vybrat termín CTA]`
- [ ] "Učebna ↗" text is gray-500 (lighter than the gray-700 of regular items)
- [ ] External-link icon sits to the right of the word
- [ ] Tapping Učebna: opens new tab at `iot.weeks.cz` AND closes the mobile menu

- [ ] **Step 8: Verify GA4 event fires (mobile click)**

Same Network-tab check as Step 5. The `g/collect` request should now have `ep.source=mobile`.

- [ ] **Step 9: Verify accessibility — screen reader announce**

In Chrome DevTools → Lighthouse → Accessibility audit on `http://localhost:3000`. Expected: score is identical to or higher than before this change (no new ARIA violations).

If you have NVDA / VoiceOver / TalkBack, additionally verify the link announces as "Učebna — výuková platforma (otevře se v nové záložce), odkaz" — confirms `aria-label` is read correctly.

- [ ] **Step 10: Stop dev server**

`Ctrl+C` in the terminal running `npm run dev`.

- [ ] **Step 11: [Lukáš] Decide: deploy now, or batch with other changes**

If deploying: `git push origin main` → Vercel auto-deploys to `weeks.cz`. After deploy completes (~2 min), repeat Steps 3–8 against `https://weeks.cz/` (live).

If batching: leave the commits on `main` locally; they'll go out with the next push.

---

## Success Criteria (verify after Task 3)

- [ ] "Učebna ↗" link visible in desktop navbar (right of "Kontakt", left of "Vybrat termín CTA"), styled lighter and smaller than other nav items
- [ ] "Učebna ↗" link visible in mobile hamburger menu as the last item before the CTA, separated by a hairline border
- [ ] Clicking the link opens `https://iot.weeks.cz/` in a new tab
- [ ] GA4 event `ucebna_click` with `source: 'desktop' | 'mobile'` fires on click (verified in Network tab)
- [ ] No visual regression on existing nav items (hover-underline on regular items still works)
- [ ] `aria-label` announces the destination and new-tab behavior to screen readers
- [ ] Lighthouse accessibility score on `weeks.cz/` does not drop after the change
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes

## Known Quirks / Gotchas

- **GA4 events in dev:** `sendGAEvent` from `@next/third-parties/google` only fires when the GA4 script has loaded, which depends on `NEXT_PUBLIC_GA_ID` being set. In dev, this is loaded the same way as production. If the `g/collect` request doesn't fire in Step 5, check the console for `gtag is not defined` — that means the GA script didn't load, which is a pre-existing analytics infra issue, not a regression of this change.
- **Header.tsx is `'use client'`:** all the touched code is in a client component, so no SSR concerns. The `<a>` tags render server-side as plain anchors — no hydration mismatch risk.
- **Mobile menu animation delays:** the `transition={{ delay: navigation.length * 0.05 }}` pattern was previously used by the CTA. After this change, Učebna takes that delay and the CTA bumps to `(navigation.length + 1) * 0.05`. If a future nav item is added to the `navigation` array, both delays auto-update because they're computed from `navigation.length`.
- **External link, not Next.js `<Link>`:** Učebna uses a plain `<a>`, not `<Link>` — the destination is on a different domain. Next.js `<Link>` is for in-app navigation and would behave incorrectly for cross-origin URLs.
