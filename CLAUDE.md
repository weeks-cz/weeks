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
- **Analytics**: GA4 configured (G-9955Q5FRRX), FB Pixel pending

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
- [x] Google Analytics 4 - DONE (G-9955Q5FRRX)
- [ ] Facebook Pixel - next step
- [ ] Real phone number - using placeholder
- [ ] Content fixes from team review (see below)

## Environment Variables

### Vercel (configured)
```
NEXT_PUBLIC_FORMSPREE_ID=mrezolbj        # Waitlist + Contact forms (admin@weeks.cz)
NEXT_PUBLIC_SANITY_PROJECT_ID=cuy78njh
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_GA_ID=G-9955Q5FRRX           # Google Analytics 4 (DONE)
```

### To be added
```
NEXT_PUBLIC_FB_PIXEL_ID=                 # Facebook Pixel
```

## Facebook Pixel Setup (Next Session)

1. Go to https://business.facebook.com → Events Manager
2. Create new Pixel for weeks.cz
3. Get Pixel ID (format: 15-digit number)
4. Add to Vercel: `NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXXXXX`
5. Use `@next/third-parties/google` pattern or create FB component

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

## Team Review Feedback (December 2024)

Content and UX fixes from team call - file `Co je špatně - web.txt`:

### High Priority (Text/Content Changes)
- [ ] Change "Registrace otevřena" → "Zájem otevřen" or similar (waitlist, not registration)
- [ ] Button "Přidat na waitlist" - enable only after email + consent filled
- [ ] FAQ: Remove "!" from "Ano!" in beginner question
- [ ] FAQ: Update price 2 490 → **2 990 Kč**, remove snack mention (only lunch)
- [ ] FAQ: Remove sibling discount (needs DDM approval first)
- [ ] FAQ: Remove "98% spokojených" - no camps yet
- [ ] FAQ: Rephrase "můžeme se individuálně domluvit" more professionally
- [ ] FAQ: Remove notebook mention (kids will want to play games)
- [ ] FAQ: Add typical day schedule (needs team input)
- [ ] USP: Change "1 lektor na 8 dětí" → **1 lektor na 5 dětí**
- [ ] "Budeme brzy!" / "První běhy" - consider different wording
- [ ] Review all program descriptions - remove unrealistic promises:
  - Arduino: can't give away full Arduino kit
  - Web: can't publish pages (security risk)
- [ ] Footer: Remove trademark symbol (not registered yet)

### Medium Priority (Legal/Contact)
- [ ] GDPR page: Fix - emails collected by us, not DDM Praha 6
- [ ] Terms page: Fix - we are the operator, not DDM; update old domain references
- [ ] Contact page: Fix hours "9-16" → **9-17**
- [ ] Contact page: Update FAQ section (outdated)
- [ ] Contact form: Verify GDPR consent is handled (separate from waitlist)
- [ ] Phone number: Decide and update placeholder

### Lower Priority (UX/Design)
- [ ] Consider adding "Domů" to navbar (some users don't know logo = home)
- [ ] Program page scroll: When clicking from homepage, lands too low (heading not visible)
- [ ] Homepage cover photo: Consider if there's a better option
- [ ] Map: Highlight HWLab in red
- [ ] About page: "max 8 dětí na lektora" → **max 5**
- [ ] About page team section:
  - Replace profile photos with topic-related graphics
  - Add real names and specializations
  - Keep only 4 instructors (remove coordinator)
  - Consider hiding section until real photos available

## Notes for Future Sessions

- **GA4 is LIVE** - tracking at G-9955Q5FRRX
- Facebook Pixel is next priority
- Team review feedback needs implementation (see above)
- Web is fully functional and deployed at weeks.cz
- Waitlist is actively collecting signups to admin@weeks.cz
