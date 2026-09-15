# Maker Lab Style Guide — rollout reference

Transformation guide for restyling remaining pages to the "maker lab" design. **Styling only** — never change copy, logic, forms, API calls, analytics events, hrefs, SEO metadata, aria attributes, or component props/exports.

## Exemplar files (read these first, mimic their vocabulary)

- `src/components/sections/HeroSection.tsx` — hero layout, mono kóta, framed photo
- `src/components/sections/ProgramSection.tsx` — card-maker cards, badges, section headers
- `src/components/sections/USPSection.tsx` — numbered border-row lists
- `src/components/sections/UpcomingTermsSection.tsx` — ticket rows, urgency markers, small CTAs
- `src/components/sections/CTASection.tsx` — dark ink section pattern
- `src/components/sections/FAQSection.tsx` — accordion styling
- `src/components/sections/ContactSection.tsx` — forms, inputs, contact rows
- `src/app/tabor-3d-tisk/client.tsx` — full camp page: spec sheet, timeline, joined-cell grids

## Token / class replacements (mechanical)

| Old | New |
|---|---|
| `bg-gray-50` (section bg) | `bg-paper` or `bg-paper-soft` (alternate sections; add `border-y border-ink/15` on paper-soft bands) |
| `bg-white` (section bg) | `bg-paper` |
| `bg-gray-900`, `bg-gradient-to-* from-gray-900...` | `bg-ink text-paper blueprint-grid-dark` |
| `bg-gradient-to-* from-primary-600 to-primary-800` (section) | `bg-ink text-paper blueprint-grid-dark border-y border-ink` |
| card `bg-white rounded-2xl shadow-sm border border-gray-100` | `card-maker` (+ `overflow-hidden` if it has an image) |
| `rounded-2xl`/`rounded-xl` | `rounded-md` |
| `rounded-lg`/`rounded-full` (chips, small) | `rounded-sm` (keep `rounded-full` only for avatar photos) |
| pill badge `bg-X-100 text-X-700 rounded-full text-xs font-semibold` | `border border-ink rounded-sm font-mono text-xs font-medium px-2.5 py-1` (bg-paper or white) |
| section eyebrow chip (icon + text in pill) | `<p className="mono-label mb-4">…</p>` |
| `text-gray-900` | `text-ink` |
| `text-gray-600`/`text-gray-500` | `text-ink-500` |
| `text-gray-400` | `text-ink/50` |
| dark-bg `text-white` | `text-paper`; `text-white/70` → `text-paper/70` |
| gradient text `bg-gradient-to-r ... bg-clip-text text-transparent` | `text-primary-600` (on dark: `text-accent-400`) |
| icon-in-colored-circle `w-12 h-12 bg-primary-100 rounded-xl` | `w-12 h-12 bg-white border border-ink/15 rounded-sm` with `text-primary-600` icon; or solid `bg-primary-600 border border-ink rounded-sm` with white icon for emphasis |
| decorative blobs (`blur-3xl` circles, absolute gradient decorations) | DELETE entirely |
| photo dark overlay gradients | delete, or `from-ink via-ink/60 to-ink/20` when text sits on the photo |
| CTA button (amber inline classes) | `btn-primary` |
| secondary/white-outline button on dark | keep custom: `border border-paper/30 text-paper hover:border-paper rounded-md` |
| outline button on light | `btn-outline` |
| input `rounded-xl border-gray-200 focus:ring-primary-500` | `rounded-md bg-white border border-ink/20 text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink` (dark bg: `bg-transparent border-paper/30 text-paper placeholder:text-paper/40 focus:border-paper focus:ring-paper`, add `font-mono text-sm` for email/number inputs) |
| checkbox `rounded border-gray-300` | `rounded-sm border-ink/30` |
| `shadow-lg`/`hover:shadow-xl` on cards | drop; card-maker's hard-shadow hover covers it |
| headings | ensure `font-display` + `text-ink` (`heading-2`/`heading-3` classes already include font-display) |
| prices, dates, times, capacities, phone numbers, technical metadata | wrap in `font-mono` (`text-sm`/`text-xs` as fits) |

## Patterns

- **Section header**: left-aligned `mono-label` eyebrow → `heading-2` (accent word `text-primary-600`) → `text-lg text-ink-500` lead. Center only when the section content is centered (bottom CTAs).
- **Dark section**: max ONE per page — the conversion/terms section. `bg-ink text-paper blueprint-grid-dark border-y border-ink`. Amber `btn-primary` pops there.
- **Timeline / schedule**: mono time left (right-aligned, w-12), `border-l border-ink/30` line with 2×2px `bg-primary-600` square markers, title+desc right (see 3d-tisk `#harmonogram`).
- **Spec sheet / facts**: joined-cell `<dl>` grid — `border border-ink rounded-md overflow-hidden bg-white`, cells `p-4 border-ink/15` with `border-l`/`border-t` between (see 3d-tisk hero).
- **Legal pages (gdpr/podminky)**: minimal — paper bg, mono-label breadcrumb/eyebrow, heading font-display, prose text-ink-500; do NOT restructure legal text.
- **Camp accent colors**: MIX/tech = accent(cyan) icons + primary text accents, 3D tisk = primary(indigo), IoT = trust(emerald), letni-primestsky (KV) = primary. CTAs always amber `btn-primary`.
- Motion: keep existing framer-motion fade-ups; DELETE floating/pulse decorations. Never add new animation libraries.

## Hard rules

- Czech copy stays byte-identical (uppercase rendering only via CSS classes like mono-label).
- Do not touch: `src/lib/**` logic, API routes, analytics calls, form handlers, hrefs, ids (anchors), aria.
- Do not run `npm run build`, `npm run dev`, or git commands — the orchestrator builds and commits.
- `.card-maker` already includes hover corner-marks + hard shadow; don't re-add shadows on top.
