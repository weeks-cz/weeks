# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Weeks** is a website for a weekly summer příměstský (day) IT camp for children (ages 9-15) in Prague and Karlovy Vary, operated by **Weeks s.r.o.** — not DDM Praha 6. The old catalog of weekend/one-day camp formats and per-city pages is gone: there's now a single product (Monday–Friday, 8:00–17:00) sold as **turnusy** (terms), one per city, see `src/lib/turnusy.ts`. It appeals to two audiences: parents (who pay) and teenagers (who decide if they want to attend).

The move off DDM Praha 6 only covers the product itself (site copy, structured data, the `SITE` object) — `/o-nas`, `/kontakt`, `/gdpr` and `/podminky` still describe DDM Praha 6 and HWLab as organizer/venue, and the registration backend (`src/lib/locations.ts`, `src/lib/ddm-scraper.ts`, confirmation e-mails) still assumes DDM. That migration is scoped for a later phase — don't read those pages/files as reflecting the current operator.

**Live URL:** https://weeks.cz
**GitHub:** https://github.com/weeks-cz/weeks (public; transferred from lxkask/weeks on 2026-05-09)

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS + custom design tokens
- **Animations**: Framer Motion (with prefers-reduced-motion support)
- **CMS**: Sanity (headless CMS) - schemas ready, studio at `/studio`
- **Hosting**: Vercel
- **Domain**: weeks.cz (DNS at subreg.cz)
- **Forms**: Formspree (admin@weeks.cz account, form ID: mrezolbj)
- **Analytics**: GA4 configured (G-9955Q5FRRX)

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Project Structure

```
/src
  /app
    layout.tsx              # Root layout with SEO metadata + GA4
    page.tsx                # Homepage — rozcestí (hero, nearest turnusy, USP, FAQ, contact), not a program catalog
    opengraph-image.tsx     # Generated OG/Twitter share image (next/og `ImageResponse`, no static file)
    globals.css             # Global styles + Tailwind (maker-lab design tokens)
    sitemap.ts              # Dynamic sitemap (weeks.cz URLs, one entry per turnus)
    not-found.tsx           # 404 page
    /api
      /waitlist/route.ts    # Interest/waitlist form API (Formspree)
      /contact/route.ts     # Contact form API
      /cron/capacity-notify/route.ts  # Daily capacity check cron (Vercel)
      ...                    # registration, Comgate payment, shop and admin routes — predate this phase, see /src/app/api
    /tabor                  # THE product page: turnus grid, city filter, FAQ, interest form
    /tabor/[turnus]         # One page per turnus — slug carries the city, e.g. /tabor/karlovy-vary-leto-2027
    /o-nas                  # About page (team with real names) — still describes DDM Praha 6/HWLab, see Project Overview
    /kontakt                # Contact page — same DDM/HWLab caveat
    /gdpr                   # GDPR page — same DDM/HWLab caveat
    /podminky               # Terms page — same DDM/HWLab caveat
    /eshop, /registrace, /platba, /go  # Shop, registration + Comgate payment flow, QR redirects — predate this phase
    /studio                 # Sanity Studio
  /components
    /layout
      Header.tsx            # Navigation (logo = home link)
      Footer.tsx            # Footer with links
    /sections
      HeroSection.tsx       # Homepage hero ("IT tábory, kde děti tvoří budoucnost")
      NejblizsiTurnusy.tsx  # Homepage preview of nearest turnusy (slice of /tabor's list)
      Rozcesti.tsx          # Homepage "co Weeks dělá" — tábor / firmy / e-shop / učebna
      USPSection.tsx        # Unique selling points
      FAQSection.tsx        # Accordion FAQ — reads `getSiteFaq()` from `@/lib/site`
      ContactSection.tsx    # Contact info + email signup (GDPR consent checkbox)
    /turnusy
      TurnusList.tsx         # /tabor grid + city filter (`filtrMest`, built on `getCitiesWithTurnusy`)
      TurnusCard.tsx         # One turnus card — labels/CTA text come from `turnus-labels.ts`
      TurnusInterestForm.tsx # Non-binding "notify me" form for turnusy that aren't bookable yet (GDPR checkbox)
      VenueShowcase.tsx, ProjectGallery.tsx, SpotsLeft.tsx  # Venue photos, project gallery, live capacity badge
    /providers
      MotionProvider.tsx    # Framer Motion reduced-motion support
    /seo
      StructuredData.tsx    # Schema.org markup — price/date read only from turnusy, never from locations.ts
    /ui
      CookieConsent.tsx     # GDPR cookie banner
      KVRegionNudge.tsx     # Geo-nudge for Karlovarsko visitors → /tabor?mesto=karlovy-vary
  /lib
    turnusy.ts               # Turnus data + `getTurnusy`/`getTurnus`/`isBookable` — source of truth for price/date/capacity
    cities.ts                # City + venue registry — `getCity`/`getVenue`
    focus.ts                 # Focus modules (3d-tisk, iot, vr, ...) shown per turnus
    site.ts                  # `SITE` (Weeks s.r.o., contact, legal) + shared FAQ
    locations.ts             # Legacy per-city/DDM content, still backing the registration/payment flow — see the warning above `TURNUSY` in turnusy.ts
    utils.ts                # cn() classnames utility
    analytics.ts            # GA4 + FB Pixel tracking
    ...                      # registration, Comgate payment, Fakturoid, e-mail — predate this phase, out of scope here
  /sanity
    /lib                    # Sanity client, queries
    /schemas                # CMS content schemas

/docs
  ROADMAP.md                # Project roadmap
  UI_UX_SPEC.md             # UI/UX specification
  CONTENT_CS.md             # Czech content reference

/public
  /images/hwlab             # HWLab photos (still used by /o-nas, /kontakt — see Project Overview)
  /images/weeks-logo.png    # Logo
  og-image-v2.jpg           # Superseded by `src/app/opengraph-image.tsx` — kept only for comparison, nothing links to it anymore
  favicon.ico               # Favicon (multi-size)
  apple-touch-icon.png      # Apple touch icon
  robots.txt                # Robots rules
  site.webmanifest          # PWA manifest
```

## Product: turnus-based summer camp

There is exactly **one product** now — a Monday–Friday weekly příměstský (day)
camp, 8:00–17:00, sold per term ("turnus"). No more weekend vs. one-day split,
no more per-city pages, no more 7-program catalog.

- **Data model**: `src/lib/turnusy.ts` exports `TURNUSY` (the source of truth
  for price, date, capacity, venue and status) plus `getTurnusy`, `getTurnus`,
  `isBookable`. **Never** read price or date from `src/lib/locations.ts` —
  that file is legacy and still only backs the registration/payment backend.
- **Focus**: 3D tisk, 3D modelování, IoT s Arduinem per turnus (`src/lib/focus.ts`).
- **Age**: 9–15 (`turnus.ageRange`, currently `'9-15'` for both turnusy).
- **Cities**: Praha and Karlovy Vary (`src/lib/cities.ts`). City is a
  *property* of a turnus, not a branch of the site — filter with
  `/tabor?mesto=<city>`, and a turnus's own URL embeds the city in the slug
  (e.g. `/tabor/karlovy-vary-leto-2027`).
- **Current data (this phase)**: both turnusy (`praha-leto-2027`,
  `kv-leto-2027`) are `chystame` — no confirmed date, price or venue yet.
  Summer 2027 terms are expected to go live around October 2026. Until then
  the site's main job is collecting contacts (`TurnusInterestForm`), not
  selling — `isBookable(turnus)` is what flips a turnus card from a "notify
  me" form to a real "Přihlásit dítě" registration CTA.
- **Known data bug**: registration currently saves `turnus.focus[0]` (a focus
  id like `'3d-tisk'`) into the `program` field, but invoices/e-mails expect
  a program id from `locations.ts`. See the warning comment above `TURNUSY`
  in `src/lib/turnusy.ts` and the guard test in `src/lib/turnusy.test.ts` —
  no turnus may go `otevreno` until that's fixed.

### Redirects (old structure → `/tabor`)

Defined in `next.config.js` `redirects()` — permanent 301s, not app routes:
- `/program`, `/tabor-chytrych-technologii`, `/tabor-3d-tisk`, `/tabor-iot`, `/kveten` → `/tabor`
- `/karlovy-vary`, `/karlovy-vary/letni-primestsky`, `/karlovy-vary/tabor-chytrych-technologii` → `/tabor?mesto=karlovy-vary`
- `/karlovy-vary/o-nas`, `/karlovy-vary/kontakt`, `/karlovy-vary/gdpr`, `/karlovy-vary/podminky` → their Prague equivalents

## Design System

### Colors (Tailwind)
- **Primary** (`primary-*`): Indigo - tech/energy
- **Accent** (`accent-*`): Cyan - engagement
- **Trust** (`trust-*`): Emerald - professional/safe
- **CTA** (`cta-*`): Amber - call to action

### Component Classes
- `btn-primary` - Main CTA button (amber)
- `btn-secondary` - Secondary button (indigo)
- `btn-outline` - Outline button
- `section-container` - Max-width container
- `section-padding` - Vertical section padding
- `heading-1/2/3` - Typography
- `text-gradient` - Gradient text

## Key Requirements

### Design Guidelines
- Modern, high-tech visual style with animations
- Professional appearance (not like a student project)
- Appeals to teenagers (not generic)
- Formal tone ("vykani") for parent-facing content
- Technical terms explained accessibly

### Target Audience
1. **Primary**: Parents - trust quality, safety, educational value
2. **Secondary**: Teenagers (13-15) - find it cool/engaging
3. **Tertiary**: venue partners (e.g. FabLab VARY&TE in Karlovy Vary, see `src/lib/cities.ts`) - professional representation

### Language
All user-facing content is in Czech. Code/docs can be in English.

## Current Status

**Structural rebuild (single turnus-based product, Weeks s.r.o. as operator)**: Complete for the product/marketing pages (`/`, `/tabor`, `/tabor/[turnus]`).
**Status**: No turnus is bookable yet — both turnusy are `chystame`, with no confirmed date/price/venue. Summer 2027 terms are expected around October 2026; until then the site's job is collecting contacts, not selling.

### Implemented

_The checklist below predates the restructure and describes the old site (weekend/one-day formats, `/program`, `/tabor-3d-tisk`, `/tabor-iot`, DDM registration links). It's kept as a historical record — for what's actually live now, see "Product: turnus-based summer camp" and "Project Structure" above._

- [x] All pages: Homepage, /program, /o-nas, /kontakt, /gdpr, /podminky
- [x] Weekend camp page: /tabor-chytrych-technologii (confirmed terms, DDM registration)
- [x] One-day camp pages: /tabor-3d-tisk, /tabor-iot with confirmed + připravujeme terms
- [x] 7 camp programs with marketing-friendly descriptions
- [x] Waitlist form with program selection + optional termin field (Formspree on admin@weeks.cz)
- [x] Contact form with Formspree
- [x] One-day camps prominent on homepage: "Jednodenní" + "Nově" badges, gradient cards
- [x] ProgramSection: all 3 camps in equal 3-col grid + 4-col specializations grid
- [x] SummerBanner: amber gradient banner after hero → summer MIX terms
- [x] Summer 2026 MIX interest form: multi-select checkboxes at #leto section
- [x] "Nezávazná registrace" CTA with 14-day notice explanation (replaces "Mám zájem")
- [x] Confirmed one-day terms (11-12.4, 18-19.4) with DDM registration links
- [x] Alternating So/Ne schedule for one-day camps (April–May)
- [x] IoT: Micro:bit + Arduino throughout (descriptions, steps, practical info)
- [x] 3D tisk: printer models showcase (MK3S, MK4S, Mini+, CORE One, etc.)
- [x] One-day camp capacity: 15 kids (same as MIX)
- [x] Other program cards clickable → link to /program#[id]
- [x] Production domain: weeks.cz
- [x] SEO: OG image, favicons, sitemap, structured data
- [x] Accessibility: ARIA labels, aria-live, prefers-reduced-motion
- [x] Cookie consent banner (GDPR)
- [x] Responsive design (mobile-first)
- [x] Framer Motion animations
- [x] Sanity CMS schemas + Studio
- [x] Google Analytics 4 (G-9955Q5FRRX)
- [x] Google Search Console verified
- [x] Vercel cron: daily capacity check at 8:00 UTC
- [x] Team review feedback implemented (December 2024)

### Social Media (December 2024)
- [x] Instagram: @weeks.cz (bio complete)
- [x] Facebook: Weeks - It kempy pro děti (page created)
- [ ] Facebook Pixel - set up when ready for ads
- [ ] FB + IG accounts linked in Meta Business Suite

### Pending (blocked or future)
- [ ] Facebook Pixel - when ready for ads
- [x] Real phone number: +420 703 046 440 (confirmed April 2026)
- [ ] DDM confirmation - before marketing launch

## Environment Variables

### Vercel (configured)
```
NEXT_PUBLIC_FORMSPREE_ID=mrezolbj        # Waitlist + Contact forms (admin@weeks.cz)
NEXT_PUBLIC_SANITY_PROJECT_ID=cuy78njh
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_GA_ID=G-9955Q5FRRX           # Google Analytics 4
```

### To be added (when ready)
```
NEXT_PUBLIC_FB_PIXEL_ID=                 # Facebook Pixel (after ads setup)
```

## Team (O nás page)

Real team members with specialized icons:
1. **Kryštof Ježdík** - VR & Herní vývoj (Gamepad2 icon)
2. **Lukáš Kubík** - Web & Programování (Code icon)
3. **Štěpán Jurenka** - 3D modelování & Tisk (Box icon)
4. **Lukáš Kautský** - Grafika & Design (Palette icon)

## Contact Info

Phone: +420 703 046 440 (confirmed April 2026)
Used in: kontakt page, ContactSection, StructuredData, /kveten landing page

## DNS Configuration

Domain: weeks.cz (registered at subreg.cz)

```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
TXT   @     google-site-verification=5epLUIbGFT0mcISr7rJZPFLcNlcAIFkQXe5cBY9nSdY
```

## Key Decisions Made (December 2024)

1. **Hero text**: "Přijímáme zájemce" (not "Registrace otevřena")
2. **Instructor ratio**: 1:5 (not 1:8)
3. **Price**: 2 990 Kč (updated from 2 490)
4. **CTA wording**: "tábory" (not "běhy")
5. **No "Domů" in nav**: Logo serves as home link (standard UX)
6. **No map marker**: Would require paid Google Maps API
7. **Team icons**: Specialized Lucide icons instead of placeholder photos

## Key Decisions Made (March 2026)

1. **One-day camps**: 3D tisk + IoT as standalone one-day format, 1 490 Kč
2. **Visual balance**: Homepage presents all 3 camp formats equally (not MIX-dominant)
3. **Hero headline**: "IT tábory" (not "Víkendové IT kempy") — covers both formats
4. **Header CTA**: "Vybrat tábor" → `/program` (neutral, not MIX-only)
5. **CTA section**: 3 equal camp cards with gradient backgrounds + email signup
6. **One-day term status**: "Připravujeme" with dashed border + inline interest form
7. **Colors**: 3D tisk = primary/indigo, IoT = trust/emerald (consistent with program cards)
8. **One-day capacity**: Max 15 kids (same as MIX, changed from original 12)
9. **Analytics**: Separate events for one-day camps (interest_submit, view_oneday_camp)
10. **Alternating schedule**: One-day camps alternate So/Ne weekly (not Saturday-only)
11. **"Nezávazná registrace"**: Replaced "Mám zájem" — clearer non-binding intent + 14-day notice
12. **IoT includes Arduino**: Micro:bit + Arduino (not Micro:bit only)
13. **3D tisk content**: Removed "Prusa" brand from step titles, added printer models showcase
14. **3D tisk post-processing**: Removed "broušení a barvení", replaced with "Dokončení a výsledek"
15. **Summer MIX terms**: Multi-select checkbox form (not individual term cards)
16. **SummerBanner**: Prominent amber banner on homepage right after hero
17. **Confirmed one-day terms with DDM links**: Direct "Přihlásit se" buttons to DDM registration
18. **Visual equalization (March 16, 2026)**: MIX lost hero treatment — all 3 camps equal in ProgramSection, CTASection, and program page
19. **Program schedules updated from MIX.docx**: 8:30 arrival, 13:00 lunch + outdoor activity, 15:00 afternoon break, 16:30 departure
20. **One-day schedules derived from MIX**: 3D tisk = MIX Saturday minus VR/overnight prints; IoT = MIX Sunday minus overnight prints

## Key Decisions Made (April 2026)

1. **Ad landing page `/duben`**: Minimal conversion page for IG ads — no Header/Footer, just logo + 2 camp cards + DDM CTAs
2. **Landing page URL**: `/duben` — short, reusable, memorable for IG bio/ads
3. **Pre-framing**: Text under CTA explaining DDM registration process (no mention of rodné číslo)
4. **Záchranná síť**: Lead capture email form per camp card with GDPR checkbox
5. **Osobní asistence**: Phone + WhatsApp section for parents stuck in DDM system
6. **GA4 virtual pageviews**: `/ad/duben` (page load), `/registrace-duben-{campId}` (CTA click), `/lead-duben-{campId}` (email submit)
7. **Landing page noindex**: `robots: 'noindex, nofollow'` — ad-only, not in Google

## Key Decisions Made (September 2026)

1. **Single product**: weekend/one-day formats and per-city pages replaced by one weekly příměstský tábor sold as turnusy (`/tabor`, `/tabor/[turnus]`) — see "Product: turnus-based summer camp" above
2. **Operator on the product**: `SITE.legalName` (Weeks s.r.o.) replaces DDM Praha 6 on the homepage, `/tabor` and structured data — `/o-nas`, `/kontakt`, `/gdpr`, `/podminky` and the registration backend still say DDM Praha 6, deferred to a later phase
3. **Age range**: 9–15 (was 10–15)
4. **Cities**: Praha and Karlovy Vary as a property of a turnus, not a branch of the site — old `/karlovy-vary/*` pages are gone
5. **Redirects**: old routes (`/program`, `/tabor-*`, `/kveten`, `/karlovy-vary*`) permanently redirect to `/tabor` (see `next.config.js`)
6. **Price/date source of truth**: `src/lib/turnusy.ts` only — see the warning above `TURNUSY` and the guard test in `src/lib/turnusy.test.ts`
7. **Share image**: `src/app/opengraph-image.tsx` generates the OG/Twitter preview with `next/og` — the old static `public/og-image-v2.jpg` is unused and kept only for comparison

## Notes for Future Sessions

- Web is fully functional and deployed at weeks.cz (staging branch merged to main)
- Waitlist is actively collecting signups to admin@weeks.cz
- Google Search Console is set up and indexing
- Social media accounts (FB + IG) are created

### Current term status
- **MIX spring**: 28-29.3 confirmed with DDM registration link (14-15.3 removed — passed)
- **MIX summer**: 7 weekends (Jul–Aug) — non-binding interest form only
- **One-day confirmed**: 11-12.4, 18-19.4, and 16-17.5 — DDM registration links active
  - 3D tisk 11.4. → ddmp6.cz/tabory/?id=774
  - IoT 12.4. → ddmp6.cz/tabory/?id=776
  - IoT 18.4. → ddmp6.cz/tabory/?id=773
  - 3D tisk 19.4. → ddmp6.cz/tabory/?id=775
  - 3D tisk 16.5. → ddmp6.cz/tabory/?id=786
  - IoT 17.5. → ddmp6.cz/tabory/?id=787
- **One-day připravujeme**: 25-26.4 through 9-10.5 — non-binding registration form

### When next terms are confirmed by DDM
- Move připravujeme terms to confirmed as DDM approves them
- Add DDM registration URLs (same pattern as confirmed one-day terms)

### Ad landing pages
- **`/kveten`** — live at weeks.cz/kveten, promoting 3D tisk 16.5 + IoT 17.5
  - Minimal layout (noindex, no nav/footer), 2 camp cards with direct DDM registration
  - Lead capture (záchranná síť) + personal assistance (phone/WhatsApp)
  - GA4 virtual pageviews: `/ad/kveten`, `/registrace-kveten-3d-tisk`, `/registrace-kveten-iot`, `/lead-kveten-*`
  - Predecessor: `/duben` (April 18-19 campaign, removed after terms passed) — spec at `docs/superpowers/specs/2026-04-08-ad-landing-duben.md`

### Other pending items
- Facebook Pixel — when ready for advertising
- DDM confirmation for remaining one-day camp terms (25.4+)
- Summer MIX terms: currently interest-only, will need DDM registration when confirmed
- Consider listing on detske-tabory.info (free) and cesketabory.cz for visibility

## Repo & team workflow

- **Org**: `weeks-cz` on GitHub (free, owned by Lukáš). Owners: Lukáš (lukoluko8), Štěpán (step4n), Kryštof (jezdikk), admin@weeks.cz.
- **Sister repos**: `weeks-cz/weeks-hub` (app.weeks.cz), `weeks-cz/weeks-iot` (iot.weeks.cz + klicenka.weeks.cz). All public, code-only.
- **Strategic docs**: live in private repo `weeks-cz/weeks-internal` under `web/docs/`. ROADMAP, content spec, UI/UX spec, plans, specs all moved there 2026-05-09. **Do not commit business strategy or competitive context here** — this repo is public.
- **Deploys**: Vercel auto-deploys `main` branch to weeks.cz on push.
- **Vercel Hobby author block**: Free tier rejects deployments when commit author is not Lukáš (lukoluko8@gmail.com). Commits by step4n or jezdikk hit error: *"Git author X must have access to the project on Vercel"*.
  - **Workaround until Vercel Pro upgrade ($20/mo, deferred until s.r.o.)**: Lukáš (or Claude) squashes Š/K feature branches into a single Lukáš-authored commit on main:
    ```bash
    cd <fresh-clone>
    git checkout main && git pull
    git read-tree -u --reset <feature-branch>
    git -c user.email=lukoluko8@gmail.com commit \
      --author="Lukáš Kubík <lukoluko8@gmail.com>" \
      -m "feat(...): squashed <feature-branch>"
    git push origin main
    ```
  - This pattern was used 6× during 2026-05 batch deploy. Š/K push to feature branches normally; ask Lukáš (or open issue) when ready to deploy.
