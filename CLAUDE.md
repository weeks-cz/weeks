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
    /program                # Program page (7 programs with CTAs)
    /tabor-chytrych-technologii  # Weekend MIX camp page (confirmed terms)
    /tabor-3d-tisk          # One-day 3D printing camp page
    /tabor-iot              # One-day IoT & electronics camp page
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
      ProgramSection.tsx    # MIX hero + 6 specializations (3D tisk/IoT → own pages)
      USPSection.tsx        # Unique selling points
      TrustSection.tsx      # Partners (DDM, HWLab) - 1:5 ratio
      CTASection.tsx        # 3 camp cards (MIX, 3D tisk, IoT) + email signup
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
    analytics.ts            # GA4 + FB Pixel tracking (registration, interest, one-day views)
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

### One-day camps (jednodenní tábory) — March 2026
- **3D tisk** (So, 1 490 Kč) — page: `/tabor-3d-tisk`, terms "Připravujeme"
- **IoT & elektronika** (So, 1 490 Kč) — page: `/tabor-iot`, terms "Připravujeme"

### Specializations (no own pages yet)
- **3D modelování** - Blender 3D modeling
- **Tvorba webu** - HTML/CSS web development
- **Vývoj her** - Unity game development
- **Programování** - C# programming basics

### UX Strategy
- All three camp formats are visually balanced on homepage (CTA section shows 3 equal cards)
- Hero + Header CTA → `/program` or `#program` (neutral, not MIX-only)
- MIX still gets hero treatment in ProgramSection (multi-color gradient card)
- 3D tisk & IoT cards on homepage have "Nově otevřeno" amber badge, link to own pages
- Other 5 specializations link to `/program#[id]` with "Mám zájem" → waitlist
- One-day camp pages have "Připravujeme" terms with inline interest form → `/api/waitlist`
- Waitlist API supports optional `termin` field for one-day camp interest tracking

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
- [x] One-day camp pages: /tabor-3d-tisk, /tabor-iot (March 2026, "Připravujeme" terms)
- [x] 7 camp programs with marketing-friendly descriptions
- [x] Waitlist form with program selection + optional termin field (Formspree on admin@weeks.cz)
- [x] Contact form with Formspree
- [x] 3D tisk & IoT cards → own pages with "Nově otevřeno" badges
- [x] Other program cards clickable → link to /program#[id]
- [x] "Mám zájem" CTAs on /program → one-day pages or waitlist
- [x] Inline interest forms on one-day camp "Připravujeme" terms
- [x] Production domain: weeks.cz
- [x] SEO: OG image, favicons, sitemap, structured data
- [x] Accessibility: ARIA labels, aria-live, prefers-reduced-motion
- [x] Cookie consent banner (GDPR)
- [x] Responsive design (mobile-first)
- [x] Framer Motion animations
- [x] Sanity CMS schemas + Studio
- [x] Google Analytics 4 (G-9955Q5FRRX)
- [x] Google Search Console verified
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

1. **One-day camps**: 3D tisk + IoT as standalone one-day (Saturday) format, 1 490 Kč
2. **Visual balance**: Homepage presents all 3 camp formats equally (not MIX-dominant)
3. **Hero headline**: "IT tábory" (not "Víkendové IT kempy") — covers both formats
4. **Header CTA**: "Vybrat tábor" → `/program` (neutral, not MIX-only)
5. **CTA section**: 3 equal camp cards + email signup (not MIX card + email form)
6. **One-day term status**: "Připravujeme" with dashed border + inline interest form
7. **Colors**: 3D tisk = primary/indigo, IoT = trust/emerald (consistent with program cards)
8. **One-day capacity**: Max 12 kids (vs 15 for weekend MIX)
9. **Analytics**: Separate events for one-day camps (interest_submit, view_oneday_camp)

## Notes for Future Sessions

- Web is fully functional and deployed at weeks.cz
- Waitlist is actively collecting signups to admin@weeks.cz
- All team review feedback has been implemented
- Google Search Console is set up and indexing
- Social media accounts (FB + IG) are created
- One-day camp pages (/tabor-3d-tisk, /tabor-iot) are live with "Připravujeme" terms
- When one-day camp terms are confirmed: add confirmed term cards with DDM registration links
- Next priority: FB Pixel when ready for advertising
- Waiting for: DDM confirmation of one-day camp terms
