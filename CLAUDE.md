# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Weeks** is a website for weekend IT camps for children (ages 10-15) held at HWLab in Prague, operated under DDM Praha 6. The site appeals to two audiences: parents (who pay) and teenagers (who decide if they want to attend).

**Live URL:** https://weeksweb.vercel.app
**GitHub:** https://github.com/lxkask/weeks

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS + custom design tokens
- **Animations**: Framer Motion (with prefers-reduced-motion support)
- **CMS**: Sanity (headless CMS) - schemas ready, studio at `/studio`
- **Hosting**: Vercel
- **Forms**: Formspree (waitlist + contact)
- **Analytics**: Pending setup (GA4, FB Pixel)

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
    layout.tsx              # Root layout with SEO metadata
    page.tsx                # Homepage
    globals.css             # Global styles + Tailwind
    sitemap.ts              # Dynamic sitemap
    not-found.tsx           # 404 page
    /api
      /waitlist/route.ts    # Waitlist form API
      /contact/route.ts     # Contact form API
    /program                # Program page
    /o-nas                  # About page
    /kontakt                # Contact page
    /gdpr                   # GDPR page
    /podminky               # Terms page
    /studio                 # Sanity Studio
  /components
    /layout
      Header.tsx            # Navigation with skip-to-content
      Footer.tsx            # Footer with links
    /sections
      HeroSection.tsx       # Hero with background image
      ProgramSection.tsx    # 4 program areas
      USPSection.tsx        # Unique selling points
      TrustSection.tsx      # Partners (DDM, HWLab)
      CTASection.tsx        # Waitlist form
      FAQSection.tsx        # Accordion FAQ
      ContactSection.tsx    # Contact info
    /providers
      MotionProvider.tsx    # Framer Motion reduced-motion support
    /seo
      StructuredData.tsx    # Schema.org markup
    /ui
      CookieConsent.tsx     # GDPR cookie banner
  /lib
    utils.ts                # cn() classnames utility
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

**Phase 1 (MVP)**: 95% complete

### Implemented
- [x] All pages: Homepage, /program, /o-nas, /kontakt, /gdpr, /podminky
- [x] Waitlist form with Formspree
- [x] Contact form with Formspree
- [x] SEO: OG image, favicons, sitemap, structured data
- [x] Accessibility: ARIA labels, skip-to-content, aria-live, prefers-reduced-motion
- [x] Cookie consent banner (GDPR)
- [x] Responsive design (mobile-first)
- [x] Framer Motion animations
- [x] Sanity CMS schemas + Studio

### Pending (Blocked)
- [ ] Analytics (GA4, FB Pixel) - waiting for central email
- [ ] Real phone number - using placeholder

## Environment Variables

### Vercel (configured)
```
NEXT_PUBLIC_FORMSPREE_ID=mrbnrqld        # Waitlist + Contact forms
NEXT_PUBLIC_SANITY_PROJECT_ID=cuy78njh
NEXT_PUBLIC_SANITY_DATASET=production
```

### To be added
```
NEXT_PUBLIC_GA_ID=                       # Google Analytics 4
NEXT_PUBLIC_FB_PIXEL_ID=                 # Facebook Pixel
```

## Analytics Setup (When Ready)

1. Create central email for analytics accounts
2. Create GA4 property -> get Measurement ID (`G-XXXXXXXXXX`)
3. Create Facebook Pixel -> get Pixel ID
4. Add to Vercel Environment Variables
5. Create `src/lib/analytics/` with tracking components

## Contact Info Update (When Ready)

Phone placeholder `+420 XXX XXX XXX` needs updating in:
- `src/app/kontakt/page.tsx`
- `src/components/sections/ContactSection.tsx`
- `src/components/seo/StructuredData.tsx`

## Notes for Future Sessions

- Web is fully functional and deployed
- Waitlist is actively collecting signups
- All critical SEO and accessibility items completed
- Main blockers are external (email, phone number)
