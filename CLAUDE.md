# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Weeks** is a website for IT camps for children (ages 10-15) in Prague, operated under DDM Praha 6. The site offers weekend camps (MIX) and one-day camps (3D tisk, IoT). It appeals to two audiences: parents (who pay) and teenagers (who decide if they want to attend).

**Live URL:** https://weeks.cz
**GitHub:** https://github.com/lxkask/weeks

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
    page.tsx                # Homepage (with Suspense for CTASection)
    globals.css             # Global styles + Tailwind
    sitemap.ts              # Dynamic sitemap (weeks.cz URLs)
    not-found.tsx           # 404 page
    /api
      /waitlist/route.ts    # Waitlist form API (handles program selection)
      /contact/route.ts     # Contact form API
      /cron/capacity-notify/route.ts  # Daily capacity check cron (Vercel)
    /program                # Program page (7 programs with CTAs)
    /tabor-chytrych-technologii  # Weekend MIX camp page (spring terms + summer #leto section)
    /tabor-3d-tisk          # One-day 3D printing camp (confirmed + připravujeme terms)
    /tabor-iot              # One-day IoT + Arduino camp (confirmed + připravujeme terms)
    /o-nas                  # About page (team with real names)
    /kontakt                # Contact page
    /gdpr                   # GDPR page
    /podminky               # Terms page
    /studio                 # Sanity Studio
  /components
    /layout
      Header.tsx            # Navigation (logo = home link)
      Footer.tsx            # Footer with links
    /sections
      HeroSection.tsx       # Hero with HWLab background (hwlab-7976)
      ProgramSection.tsx    # One-day camps (prominent) + 4 specializations grid
      SummerBanner.tsx      # Homepage amber banner → summer MIX terms CTA
      USPSection.tsx        # Unique selling points
      TrustSection.tsx      # Partners (DDM, HWLab) - 1:5 ratio
      CTASection.tsx        # 3 camp cards (MIX, 3D tisk, IoT) with gradient BGs + email signup
      FAQSection.tsx        # Accordion FAQ (prices 2990/1490 Kč)
      ContactSection.tsx    # Contact info
    /providers
      MotionProvider.tsx    # Framer Motion reduced-motion support
    /seo
      StructuredData.tsx    # Schema.org markup (weeks.cz URLs, price included)
    /ui
      CookieConsent.tsx     # GDPR cookie banner
  /lib
    utils.ts                # cn() classnames utility
    analytics.ts            # GA4 + FB Pixel tracking (registration, interest, one-day views, summer)
  /sanity
    /lib                    # Sanity client, queries
    /schemas                # CMS content schemas

/docs
  ROADMAP.md                # Project roadmap
  UI_UX_SPEC.md             # UI/UX specification
  CONTENT_CS.md             # Czech content reference

/public
  /images/hwlab             # HWLab photos
  /images/weeks-logo.png    # Logo
  og-image.jpg              # Open Graph image (1200x630)
  favicon.ico               # Favicon (multi-size)
  apple-touch-icon.png      # Apple touch icon
  robots.txt                # Robots rules
  site.webmanifest          # PWA manifest
```

## Programs (7 total) + Camp Formats

The website features 7 camp programs in two formats:

### Weekend camp (víkendový tábor)
- **MIX - Tábor chytrých technologií** (So+Ne, 2 990 Kč) — hero treatment, combines 3D tisk + IoT + VR
- Page: `/tabor-chytrych-technologii` with confirmed DDM terms, live capacity
- Spring terms: 14-15.3, 28-29.3 (term 7-8.3 removed — already passed)
- Summer 2026 terms: 7 weekends (Jul–Aug), multi-select interest form at `#leto`

### One-day camps (jednodenní tábory) — April–May 2026
- **3D tisk** (So/Ne, 1 490 Kč, max 15) — page: `/tabor-3d-tisk`
- **IoT & elektronika** (So/Ne, 1 490 Kč, max 15) — page: `/tabor-iot`, includes Micro:bit + Arduino
- Alternating So/Ne schedule (see Term Schedule below)

### Specializations (no own pages yet)
- **3D modelování** - Blender 3D modeling
- **Tvorba webu** - HTML/CSS web development
- **Vývoj her** - Unity game development
- **Programování** - C# programming basics

### UX Strategy
- All three camp formats are visually balanced on homepage (CTA section shows 3 equal cards)
- Hero + Header CTA → `/program` or `#program` (neutral, not MIX-only)
- MIX still gets hero treatment in ProgramSection (multi-color gradient card)
- 3D tisk & IoT cards on homepage have "Jednodenní" + "Nově" badges with pulse animation
- ProgramSection: one-day camps in prominent 2-column layout, other specializations in 4-column grid
- SummerBanner: amber gradient banner after hero → links to `/tabor-chytrych-technologii#leto`
- CTA buttons: "Nezávazná registrace" (replaces "Mám zájem") with 14-day notice explanation
- Confirmed terms show "Potvrzeno" badge + email notification signup (no DDM link yet)
- Připravujeme terms have dashed border + inline non-binding registration form
- Other 4 specializations link to `/program#[id]` with "Mám zájem" → waitlist
- Waitlist API supports optional `termin` field for one-day camp + summer interest tracking
- Summer MIX terms: multi-select checkbox form (not individual cards), sends to waitlist API

### One-day Camp Term Schedule (April–May 2026)

Alternating So/Ne pattern between 3D tisk and IoT:

| Weekend     | Sobota       | Neděle       | Status       |
|-------------|-------------|-------------|--------------|
| 11–12. 4.   | 3D tisk     | IoT         | Potvrzeno    |
| 18–19. 4.   | IoT         | 3D tisk     | Potvrzeno    |
| 25–26. 4.   | 3D tisk     | IoT         | Připravujeme |
| 2–3. 5.     | IoT         | 3D tisk     | Připravujeme |
| 9–10. 5.    | 3D tisk     | IoT         | Připravujeme |
| 17. 5.      | IoT         | —           | Připravujeme |

### Summer MIX Terms (July–August 2026)

Weekend camps only (So+Ne, 2 990 Kč):
- 4–5. 7., 11–12. 7., 18–19. 7., 25–26. 7.
- 1–2. 8., 8–9. 8., 29–30. 8.
- Excluded: 15–16. 8. and 22–23. 8.
- All summer terms are non-binding interest registration (multi-select form)
- Deep link: `/tabor-chytrych-technologii#leto`

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
3. **Tertiary**: DDM Praha 6, HWLab - professional representation

### Language
All user-facing content is in Czech. Code/docs can be in English.

## Current Status

**Phase 1 (MVP)**: Complete
**Status**: Waiting for DDM confirmation before marketing launch

### Implemented
- [x] All pages: Homepage, /program, /o-nas, /kontakt, /gdpr, /podminky
- [x] Weekend camp page: /tabor-chytrych-technologii (confirmed terms, DDM registration)
- [x] One-day camp pages: /tabor-3d-tisk, /tabor-iot with confirmed + připravujeme terms
- [x] 7 camp programs with marketing-friendly descriptions
- [x] Waitlist form with program selection + optional termin field (Formspree on admin@weeks.cz)
- [x] Contact form with Formspree
- [x] One-day camps prominent on homepage: "Jednodenní" + "Nově" badges, gradient cards
- [x] ProgramSection: one-day camps in 2-col prominent layout + 4-col specializations grid
- [x] SummerBanner: amber gradient banner after hero → summer MIX terms
- [x] Summer 2026 MIX interest form: multi-select checkboxes at #leto section
- [x] "Nezávazná registrace" CTA with 14-day notice explanation (replaces "Mám zájem")
- [x] Confirmed one-day terms (11-12.4, 18-19.4) with "Potvrzeno" badge
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
- [ ] Real phone number - using placeholder
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

## Contact Info Update (When Ready)

Phone placeholder `+420 XXX XXX XXX` needs updating in:
- `src/app/kontakt/page.tsx`
- `src/components/sections/ContactSection.tsx`
- `src/components/seo/StructuredData.tsx`

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
17. **Confirmed terms without DDM links**: Show "Potvrzeno" badge + email notification form

## Notes for Future Sessions

- Web is fully functional and deployed at weeks.cz (staging branch merged to main)
- Waitlist is actively collecting signups to admin@weeks.cz
- Google Search Console is set up and indexing
- Social media accounts (FB + IG) are created

### Current term status
- **MIX spring**: 14-15.3 and 28-29.3 confirmed with DDM registration links
- **MIX summer**: 7 weekends (Jul–Aug) — non-binding interest form only
- **One-day confirmed**: 11-12.4 and 18-19.4 — "Potvrzeno" badge, email notification form
- **One-day připravujeme**: 25-26.4 through 17.5 — non-binding registration form

### When next terms are confirmed by DDM
- Replace "Potvrzeno" badge + email form with actual DDM registration links on confirmed terms
- Move připravujeme terms to confirmed as DDM approves them
- Add DDM registration URLs (same pattern as MIX terms)

### Small adjustments pending (user mentioned "drobnosti na upravu")
- User will specify in next session

### Other pending items
- Facebook Pixel — when ready for advertising
- Real phone number — still using placeholder
- DDM confirmation for remaining one-day camp terms (25.4+)
- Summer MIX terms: currently interest-only, will need DDM registration when confirmed
