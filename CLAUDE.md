# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Weeks** is a website for weekend IT camps for children (ages 10-15) held at HWLab in Prague, operated under DDM Praha 6. The site must appeal to two audiences: parents (who pay) and teenagers (who decide if they want to attend).

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + custom design tokens
- **Animations**: Framer Motion
- **CMS**: Sanity (headless CMS) - to be configured
- **Hosting**: Vercel (free tier)
- **Forms**: Resend/Formspree for email collection
- **Analytics**: Google Analytics 4, Facebook Pixel

## Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Build & Production
npm run build        # Create production build
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## Project Structure

```
/src
  /app                    # Next.js App Router pages
    layout.tsx            # Root layout with metadata
    page.tsx              # Homepage
    globals.css           # Global styles + Tailwind
  /components
    /layout               # Header, Footer
    /sections             # Page sections (Hero, Program, USP, etc.)
    /ui                   # Reusable UI components (to be added)
    /forms                # Form components (to be added)
  /lib
    /sanity               # Sanity client config (to be added)
    /analytics            # GA/FB helpers (to be added)
    utils.ts              # Utility functions (cn for classnames)

/docs
  ROADMAP.md              # Full project roadmap and phases

/sanity                   # Sanity Studio (to be added)
```

## Design System

### Colors (Tailwind classes)
- **Primary** (`primary-*`): Indigo - tech/energy feel
- **Accent** (`accent-*`): Cyan - engagement
- **Trust** (`trust-*`): Emerald - professional/safe
- **CTA** (`cta-*`): Amber - call to action buttons

### Component Classes
- `btn-primary` - Main CTA button (amber)
- `btn-secondary` - Secondary button (primary indigo)
- `btn-outline` - Outline button
- `section-container` - Max-width container with padding
- `section-padding` - Standard section vertical padding
- `heading-1/2/3` - Typography hierarchy
- `text-gradient` - Gradient text effect

## Key Requirements

### Must Have
- Program presentation (3D printing, VR, IoT activities)
- Clear CTAs linking to DDM registration system
- Email collection form (waiting list/newsletter)
- Team/About section emphasizing DDM Praha 6 and HWLab backing
- Partner logos (DDM Praha 6, HWLab)
- Contact info and HWLab location map
- Mobile-first responsive design

### Design Guidelines
- Modern, high-tech visual style with animations and interactive elements
- Must look professional (not like a student project)
- Must appeal to teenagers (not "cringe" or generic)
- Formal tone ("vykani") for parent-facing content
- Technical terms should be explained in accessible language

### Target Audience
1. **Primary**: Parents - need to trust the quality, safety, and educational value
2. **Secondary**: Teenagers (13-15) - need to find it cool and engaging
3. **Tertiary**: DDM Praha 6, HWLab partners - must represent them professionally

## Language

All user-facing content is in Czech. Code and documentation can be in English.

## Available AI Agents

Located in `.claude/agents/`:
- `frontend-developer` - React/Next.js components, responsive design
- `ui-ux-designer` - Wireframes, user flows, design system
- `backend-architect` - Sanity schemas, API routes
- `content-marketer` - Czech copy, marketing content
- `seo-analyzer` - SEO optimization, analytics setup
- `code-reviewer` - Code quality review
- `fullstack-developer` - End-to-end development
- `prompt-engineer` - AI prompt optimization

## Next Steps

1. Set up Sanity CMS with content schemas
2. Add analytics (GA4, FB Pixel)
3. Implement waitlist form with email integration
4. Add GDPR/cookie consent
5. Create remaining pages (/program, /o-nas, /kontakt, /gdpr)
