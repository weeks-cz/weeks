# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Weeks** is a website for a weekly summer příměstský (day) IT camp for children (ages 9-15) in Prague and Karlovy Vary, operated by **Weeks s.r.o.** — not DDM Praha 6. The old catalog of weekend/one-day camp formats and per-city pages is gone: there's now a single product (Monday–Friday, 8:00–17:00) sold as **turnusy** (terms), one per city, see `src/lib/turnusy.ts`. It appeals to two audiences: parents (who pay) and teenagers (who decide if they want to attend).

The move off DDM Praha 6 now covers the whole site: `/o-nas`, `/kontakt`, `/gdpr` and `/podminky` all name **Weeks s.r.o.** (IČO 29984360) as organizer — DDM Praha 6 and HWLab survive only in code comments documenting what was removed and why. The registration backend no longer assumes DDM either: `src/lib/locations.ts` is now a 45-line city→contact map for the registration/e-mail flow (price, date, capacity and venue all belong to the turnus, not to a location), and the camp name on invoices and confirmation e-mails is derived server-side from the turnus (`getTrustedProgramName` in `src/lib/payment-pricing.ts`), not read from a DDM program catalog.

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
npm run lint         # Currently broken — Next 16 removed `next lint`; needs a direct ESLint/Biome invocation instead
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
      ...                    # registration, Comgate payment, cron (nástupní list, payment reminder — see vercel.json), shop and admin routes — predate this phase, see /src/app/api
    /tabor                  # THE product page: turnus grid, city filter, FAQ, interest form
    /tabor/[turnus]         # One page per turnus — slug carries the city, e.g. /tabor/karlovy-vary-leto-2027
    /o-nas                  # About page (team with real names) — organizer is Weeks s.r.o., see Project Overview
    /kontakt                # Contact page — same
    /gdpr                   # GDPR page — same
    /podminky               # Terms page — same
    /eshop, /registrace, /platba, /go  # Shop, registration + Comgate payment flow, QR redirects — predate this phase
    /studio                 # Sanity Studio
  /components
    /layout
      Header.tsx            # Navigation (logo = home link)
      Footer.tsx            # Footer with links
    /sections
      HeroSection.tsx       # Homepage hero ("IT tábory, kde děti tvoří budoucnost")
      NejblizsiTurnusy.tsx  # Homepage preview of nearest turnusy (slice of /tabor's list)
      USPSection.tsx        # Unique selling points
      KdeASKym.tsx          # Homepage "kde a s kým" — venues turnusy actually have + the 3-person team, no partner logos (replaces a deleted TrustSection that borrowed trust from DDM/HWLab)
      Rozcesti.tsx          # Homepage "co Weeks dělá" — tábor / firmy (dead link, `/firmy` is phase 4) / e-shop / učebna
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
      TickerStrip.tsx       # Scrolling topic strip on the homepage, right under the hero
  /lib
    turnusy.ts               # Turnus data + `getTurnusy`/`getTurnus`/`isBookable` — source of truth for price/date/capacity
    cities.ts                # City + venue registry — `getCity`/`getVenue`
    focus.ts                 # Focus modules (3d-tisk, iot, vr, ...) shown per turnus
    site.ts                  # `SITE` (Weeks s.r.o., contact, legal) + shared FAQ
    locations.ts             # City → contact map (phone/e-mail) for the registration/e-mail flow only — price, date, capacity and venue belong to the turnus, not here (see the warning above `TURNUSY` in turnusy.ts)
    utils.ts                # cn() classnames utility
    analytics.ts            # GA4 + FB Pixel tracking
    ...                      # registration, Comgate payment, Fakturoid, e-mail — predate this phase, out of scope here
  /sanity
    /lib                    # Sanity client, queries
    /schemas                # CMS content schemas

/docs
  /superpowers              # Plans, specs and runbooks for work done in this repo. ROADMAP, UI/UX spec and content reference used to live here too — moved to the private weeks-internal repo, see "Repo & team workflow" below

/public
  /images/hwlab             # Camp photos from the HWLab space, used by HeroSection on the homepage — the folder name is a leftover, HWLab itself is no longer organizer or venue (see Project Overview)
  /images/weeks-logo.png    # Logo
  /fonts                    # Two static Bricolage Grotesque weights + OFL.txt license, vendored for opengraph-image.tsx (satori can't parse the variable Google Fonts file) — see public/fonts/README.md; the rest of the site loads fonts via next/font/google instead
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
- **Focus**: reusable content modules per turnus. `FocusId` in `src/lib/focus.ts`
  is `3d-tisk | iot | vr | herni-vyvoj` (3D tisk / IoT a elektronika /
  Virtuální realita / Herní vývoj). Both current turnusy use
  `['3d-tisk', 'iot', 'vr']`.
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
- **Camp name on invoices/e-mails**: `RegistrationForm` still writes
  `turnus.focus[0]` (a focus id like `'3d-tisk'`) into the registration's
  `program` field, but nothing downstream trusts that field anymore —
  invoices, confirmation e-mails, the payment reminder and the nástupní list
  all derive the camp name server-side from `term_id` via
  `getTrustedProgramName` (`src/lib/payment-pricing.ts`). The stored
  `program` value survives only as a fallback for old registrations whose
  turnus is no longer in `TURNUSY`. See the comment above `TURNUSY` in
  `src/lib/turnusy.ts`.

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

**Structural rebuild (single turnus-based product, Weeks s.r.o. as operator)**: Complete across the whole site — the product/marketing pages (`/`, `/tabor`, `/tabor/[turnus]`) as well as `/o-nas`, `/kontakt`, `/gdpr` and `/podminky` all describe Weeks s.r.o. as organizer; DDM Praha 6 and HWLab remain only as historical code comments explaining what was removed. `/firmy` (linked from the header, footer and the homepage's Rozcesti section) is a deliberately dead link — that's phase 4, not built yet.
**Status**: No turnus is bookable yet — both turnusy are `chystame`, with no confirmed date/price/venue. Summer 2027 terms are expected around October 2026; until then the site's job is collecting contacts, not selling.

### Social Media (December 2024)
- [x] Instagram: @weeks.cz (bio complete)
- [x] Facebook: Weeks - It kempy pro děti (page created)
- [ ] Facebook Pixel - set up when ready for ads
- [ ] FB + IG accounts linked in Meta Business Suite

### Pending (blocked or future)
- [ ] Facebook Pixel - when ready for ads
- [x] Real phone number: +420 703 046 440 (confirmed April 2026)
- [ ] Summer 2027 turnusy confirmed (date, price, venue) — before marketing launch, see "Current term status" below

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

Real team members with specialized icons (`teamMembers` in `src/app/o-nas/page.tsx`):
1. **Kryštof Ježdík** - VR & Herní vývoj (Gamepad2 icon)
2. **Lukáš Kubík** - Web & Programování (Code icon)
3. **Štěpán Jurenka** - 3D modelování & Tisk (Box icon)

## Contact Info

Phone: +420 703 046 440 (confirmed April 2026)
Source of truth: `SITE.phone` in `src/lib/site.ts`; also duplicated per-city in `src/lib/locations.ts` for the registration/e-mail flow.

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
2. **Operator on the product**: `SITE.legalName` (Weeks s.r.o.) replaces DDM Praha 6 on the homepage, `/tabor` and structured data — `/o-nas`, `/kontakt`, `/gdpr`, `/podminky` and the registration backend followed within the same phase and now say Weeks s.r.o. too (see Project Overview)
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
Both turnusy — `praha-leto-2027` and `kv-leto-2027` (`src/lib/turnusy.ts`) —
are `chystame`: no confirmed date, price or venue yet. The site collects
non-binding interest (`TurnusInterestForm`, Formspree) instead of selling.
Summer 2027 terms are expected to be announced around October 2026.

The old weekend/one-day formats (MIX, one-day 3D tisk/IoT camps) and their
DDM Praha 6 registration links are gone, along with `/program`,
`/tabor-3d-tisk`, `/tabor-iot` and `/tabor-chytrych-technologii` — see
"Redirects" above.

### When Summer 2027 turnusy are confirmed
- Fill in `start`, `end`, `priceKc` and `venueId` on the turnus in
  `src/lib/turnusy.ts` and flip `status` to `otevreno`.
- `isBookable()` then switches the turnus card from the interest form to a
  real "Přihlásit dítě" registration CTA — no DDM link, no manual step.

### Ad landing pages
None exist right now. `/kveten` (May 2026, 3D tisk/IoT one-day terms)
permanently redirects to `/tabor` (`next.config.js` `redirects()`). Its
predecessor `/duben` (April 2026 campaign) was removed before this phase and
has no redirect configured — the route no longer exists and 404s.

### Other pending items
- Facebook Pixel — when ready for advertising
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
