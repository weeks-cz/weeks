# Učebna nav link — Design Spec

## Purpose

Add a discreet, "internal-feeling" navigation link from `weeks.cz` to the IoT learning platform at `iot.weeks.cz` so kids attending camps can find it from the marketing site, without turning it into a CTA that pulls casual visitors away from the conversion funnel.

The link is intentionally low-promotion: visible enough that a camper actively looking for "where is that thing the lecturer showed us" finds it within a few seconds, quiet enough that a parent comparing camp prices doesn't click it on impulse and bounce.

This is a **single-link nav addition**, not a platform launch. `iot.weeks.cz` stays `noindex` and PIN-gated; the v2 Next.js refactor (separate spec, in progress) is unaffected by this change.

## Audience

- **Primary:** kids currently or recently at a Weeks camp who want to open the IoT learning platform on their tablet/phone via the public marketing site (faster than typing `iot.weeks.cz` from memory)
- **Secondary:** lecturers who occasionally point a kid to "klikni na Učebna" instead of dictating the URL
- **Explicitly NOT a target:** parents in the buying journey, organic search visitors, casual readers

## Scope Decisions

| # | Topic | Decision |
|---|-------|----------|
| 1 | Label | "Učebna" — neutral, descriptive, slightly schoolish (a feature, because it deters adults looking for a CTA). |
| 2 | Visual weight | Quieter than other nav items: smaller font (`text-sm`), lower opacity / lighter color, no hover-underline. |
| 3 | Position (desktop) | Right of the regular nav items, immediately left of the `Vybrat termín` CTA. |
| 4 | Position (mobile) | Last item in hamburger menu, separated from regular nav items by a hairline border, above the `Vybrat termín` CTA. |
| 5 | Click behavior | Opens in new tab (`target="_blank" rel="noopener noreferrer"`) with a small external-link icon (Lucide `ExternalLink`). |
| 6 | Footer | **Not** in footer. Footer is marketing/legal; Učebna is utility and would visually misalign. Revisit if/when a paid layer is added. |
| 7 | URL | `https://iot.weeks.cz/` — no query string, no UTM. |
| 8 | Analytics | Light GA4 event `ucebna_click` with `source: 'desktop' \| 'mobile'`. Used to verify the "internal vibe" works (low click rate from non-campers expected). |
| 9 | Architecture | Add directly to `Header.tsx` as a hardcoded `<Link>` — no `UtilityLink.tsx` abstraction (YAGNI; if a second utility link arrives, refactor then). |
| 10 | Future-proofing | URL is hardcoded in one place; when a payment gateway or paid tier appears, only the link's destination/label changes — placement and visual contract stay. |

## Architecture

### Files modified

- `src/components/layout/Header.tsx` — desktop nav adds an `<a>` (not `<Link>`, because external) between the `navigation.map(…)` block and the `Vybrat termín` CTA; mobile menu adds the same link as a final item with a separator border.
- `src/lib/analytics.ts` — adds `trackUcebnaClick(source: 'desktop' | 'mobile')` mirroring the existing `trackNavCTA` shape.

### Files NOT touched

- `src/components/layout/Footer.tsx` — out of scope per Decision #6.
- `src/components/sections/*` — no homepage section gets an Učebna teaser; that would contradict the "low promotion" intent.
- `iot.weeks.cz` repo — gating, noindex, and the v2 refactor stay as planned. This change is one-directional (weeks.cz → iot.weeks.cz only).
- `next.config.ts`, `vercel.json`, `robots.txt`, `sitemap.ts` — Učebna is an external link, not a route on weeks.cz, so none of these need changes.

### Component changes — desktop

In the existing nav row inside `Header.tsx`, after the `navigation.map(...)` block and before the `Vybrat termín` CTA, render:

```tsx
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
```

Distinguishing details vs other nav items:
- `text-sm` (vs implicit `text-base` / `font-medium` on regular items)
- Lighter color (`/60` and `gray-500` vs `/90` and `gray-600`)
- No hover underline pseudo-element
- External-link icon
- Renders as `<a>`, not Next.js `<Link>` (external destination)

### Component changes — mobile

In the existing mobile menu inside `Header.tsx`, after the `navigation.map(...)` block and before the `Vybrat termín` CTA wrapper, render:

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
```

Distinguishing details vs other mobile nav items:
- Hairline `border-t` separator above (visually segments "this is a different category")
- `text-sm` + `text-gray-500` (vs `text-gray-700` and base size)
- Same external-link icon as desktop
- Closes mobile menu on click (matches existing pattern)

### Analytics helper

Append to `src/lib/analytics.ts`:

```ts
export function trackUcebnaClick(source: 'desktop' | 'mobile') {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'ucebna_click', { source })
  }
}
```

Mirrors the shape of the existing `trackNavCTA` helper. Event will be visible in GA4 → Reports → Events; no custom dashboard needed.

## Data Flow

1. Visitor reads `weeks.cz` (any page that renders `<Header />`)
2. Sees "Učebna ↗" in the right portion of the nav (desktop) or at the bottom of the mobile menu
3. Clicks → `trackUcebnaClick('desktop' | 'mobile')` fires the GA4 event
4. New tab opens at `https://iot.weeks.cz/`
5. The IoT platform handles the visitor with its own gating (TopicSelect → PIN entry per the v2 refactor)

No state, no async, no error handling on the weeks.cz side — it's an `<a>` tag.

## Accessibility

- `aria-label="Učebna — výuková platforma (otevře se v nové záložce)"` on both desktop and mobile so screen readers announce the destination context and the new-tab behavior
- `aria-hidden="true"` on the `<ExternalLink>` icon (its meaning is in the aria-label)
- Color contrast: at the lighter weights chosen (`text-gray-500` on white, `text-white/60` on the dark transparent header), contrast is ≥ 4.5:1 on the scrolled state and ≥ 4.5:1 on the dark backdrop — verified against the existing nav palette which uses similar tokens
- Keyboard: standard `<a>` focus ring inherited from the global focus styles (no custom override)

## Testing

Manual verification (no automated test for one external nav link):

- [ ] Desktop, scrolled = false: "Učebna ↗" renders in white-ish at the right of the nav, doesn't visually compete with the orange `Vybrat termín` CTA
- [ ] Desktop, scrolled = true: "Učebna ↗" turns gray, still clearly subordinate to other nav items (smaller, lighter)
- [ ] Mobile menu: "Učebna ↗" is the last item before the CTA, visually separated by a thin top border
- [ ] Click on either renders the GA4 event in the network tab (filter by `g/collect`)
- [ ] Click opens `iot.weeks.cz` in a new tab and the `weeks.cz` tab still has its scroll position
- [ ] Hover on desktop: color shifts but no underline appears (distinct from other nav items)
- [ ] No regression on existing nav items (Program / Proč Weeks / O nás / Kontakt) — same hover-underline behavior

## Out of Scope

- Footer link
- Homepage section / banner / teaser promoting the platform
- Změny na `iot.weeks.cz` (gating, public demo, accounts) — the v2 refactor (separate spec) handles platform-side changes
- Payment gateway integration — explicitly future, the link is positioned to allow it without redesign
- UTM / referrer tracking on the outbound link — `iot.weeks.cz` doesn't measure inbound traffic, so any tracking would be unused

## Success Criteria

- [ ] "Učebna ↗" link visible in desktop navbar (right of "Kontakt", left of "Vybrat termín CTA"), styled lighter and smaller than other nav items
- [ ] "Učebna ↗" link visible in mobile hamburger menu as the last item before the CTA, separated by a hairline border
- [ ] Clicking the link opens `https://iot.weeks.cz/` in a new tab
- [ ] GA4 event `ucebna_click` with `source: 'desktop' | 'mobile'` fires on click
- [ ] No visual regression on existing nav items
- [ ] `aria-label` announces the destination and new-tab behavior to screen readers
- [ ] Lighthouse accessibility score on `weeks.cz/` does not drop after the change

## References

- Existing nav: `src/components/layout/Header.tsx`
- Existing analytics helpers: `src/lib/analytics.ts` (`trackNavCTA`)
- Platform v2 spec (separate, parallel work): `docs/superpowers/specs/2026-04-22-iot-platform-v2-nextjs-refactor-design.md`
