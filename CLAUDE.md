# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Weeks** is a website for weekend IT camps for children (ages 10-15) held at HWLab in Prague, operated under DDM Praha 6. The site appeals to two audiences: parents (who pay) and teenagers (who decide if they want to attend).

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
    page.tsx                # Homepage (with Suspense for CTASection)
    globals.css             # Global styles + Tailwind
    sitemap.ts              # Dynamic sitemap
    not-found.tsx           # 404 page
    /api
      /waitlist/route.ts    # Waitlist form API (handles program selection)
      /contact/route.ts     # Contact form API
    /program                # Program page (7 programs with CTAs)
    /o-nas                  # About page
    /kontakt                # Contact page
    /gdpr                   # GDPR page
    /podminky               # Terms page
    /studio                 # Sanity Studio
  /components
    /layout
      Header.tsx            # Navigation
      Footer.tsx            # Footer with links
    /sections
      HeroSection.tsx       # Hero with background image
      ProgramSection.tsx    # MIX hero + 6 specializations (clickable cards)
      USPSection.tsx        # Unique selling points
      TrustSection.tsx      # Partners (DDM, HWLab)
      CTASection.tsx        # Waitlist form (reads ?program= URL param)
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

## Programs (7 total)

The website features 7 weekend camp programs:

1. **MIX - Ochutnej vše** (hero treatment, recommended for beginners)
2. **3D tisk** - 3D printing with Prusa printers
3. **IoT & elektronika** - Arduino, sensors, smart devices
4. **3D modelování** - Blender 3D modeling
5. **Tvorba webu** - HTML/CSS web development
6. **Vývoj her** - Unity game development
7. **Programování** - C# programming basics

### UX Strategy
- MIX is subtly preferred via visual hierarchy (hero card, multi-color gradient)
- No explicit "main program" label (team compromise)
- Specialization cards on homepage link to `/program#[id]`
- Each program has "Mám zájem" CTA → `/?program=[id]#prihlasit`
- Waitlist form pre-selects program from URL parameter

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

### Implemented
- [x] All pages: Homepage, /program, /o-nas, /kontakt, /gdpr, /podminky
- [x] 7 camp programs with marketing-friendly descriptions
- [x] Waitlist form with program selection (Formspree on admin@weeks.cz)
- [x] Contact form with Formspree
- [x] Program cards clickable → link to /program#[id]
- [x] "Mám zájem" CTAs on /program → waitlist with pre-selected program
- [x] Production domain: weeks.cz
- [x] SEO: OG image, favicons, sitemap, structured data
- [x] Accessibility: ARIA labels, aria-live, prefers-reduced-motion
- [x] Cookie consent banner (GDPR)
- [x] Responsive design (mobile-first)
- [x] Framer Motion animations
- [x] Sanity CMS schemas + Studio

### Pending
- [ ] Analytics (GA4, FB Pixel) - Google Workspace issue with admin@weeks.cz
- [ ] Real phone number - using placeholder

## Environment Variables

### Vercel (configured)
```
NEXT_PUBLIC_FORMSPREE_ID=mrezolbj        # Waitlist + Contact forms (admin@weeks.cz)
NEXT_PUBLIC_SANITY_PROJECT_ID=cuy78njh
NEXT_PUBLIC_SANITY_DATASET=production
```

### To be added
```
NEXT_PUBLIC_GA_ID=                       # Google Analytics 4
NEXT_PUBLIC_FB_PIXEL_ID=                 # Facebook Pixel
```

## Analytics Setup (Next Session)

### Problem
- admin@weeks.cz was created as Google Workspace account
- Cannot use it directly for GA4 without Workspace setup

### Options to resolve
1. **Fix Workspace**: Configure Google Workspace properly for admin@weeks.cz
2. **Use personal Google account**: Create GA4 with personal account, add admin@weeks.cz as viewer later
3. **Create different email**: Use a non-Workspace Google account for analytics

### Once resolved
1. Create GA4 property → get Measurement ID (`G-XXXXXXXXXX`)
2. Create Facebook Pixel → get Pixel ID
3. Add to Vercel Environment Variables
4. Create `src/lib/analytics/` with tracking components

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
```

## Notes for Future Sessions

- Web is fully functional and deployed at weeks.cz
- Waitlist is actively collecting signups to admin@weeks.cz
- All critical SEO and accessibility items completed
- Main blocker: Google Workspace issue preventing GA4 setup
- Consider using personal Google account for analytics if Workspace is too complex
