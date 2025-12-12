# UI/UX Specification - Weeks Website

> **Version:** 1.0
> **Date:** December 2025
> **Author:** UI/UX Designer Agent
> **Project:** Weeks - Weekend IT Camps for Children

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [User Personas](#user-personas)
3. [User Journey Map](#user-journey-map)
4. [Information Architecture](#information-architecture)
5. [Homepage Wireframe Specification](#homepage-wireframe-specification)
6. [Mobile-First Considerations](#mobile-first-considerations)
7. [CTA Strategy](#cta-strategy)
8. [Interaction Design Patterns](#interaction-design-patterns)
9. [Accessibility Requirements](#accessibility-requirements)
10. [Success Metrics](#success-metrics)

---

## Executive Summary

The Weeks website serves as a conversion-focused landing page for weekend IT camps targeting children ages 10-15. The design must balance two distinct audiences with conflicting needs: **parents** (decision makers and payers) require trust signals and professional presentation, while **teenagers** (influencers) need modern, engaging visuals that don't feel "cringe".

### Design Philosophy

- **Dual-tone approach**: Professional trust-building for parents, modern tech aesthetic for teens
- **Mobile-first**: Primary traffic expected from mobile devices (parents researching on-the-go)
- **Conversion-focused**: Every section guides toward registration or waitlist signup
- **Performance**: Fast loading to reduce bounce rate (target <3s on 3G)

---

## User Personas

### Persona 1: Parent Petra

**Demographics:**
- Age: 38-45
- Role: Mother/Father of 12-year-old
- Location: Prague or suburbs
- Income: Middle to upper-middle class
- Education: University degree
- Tech-savviness: Moderate (uses smartphone, social media)

**Goals:**
- Find meaningful weekend activity for their child
- Ensure safety and professional supervision
- Give their child educational opportunities
- Have free time on weekends ("detox")
- Value for money

**Pain Points:**
- Worried about child's screen time at home
- Lack of structured weekend activities
- Concerns about safety with unknown organizations
- Difficulty judging quality of educational programs
- Child resistant to "boring" activities

**Motivations:**
- Child's future career opportunities
- Social development (meeting like-minded peers)
- Productive use of free time
- Peace of mind (trusted organization)

**Information Needs:**
- Who supervises the children?
- What safety measures are in place?
- What will my child actually learn/create?
- How much does it cost?
- What's the daily schedule?
- Can I trust this organization?

**Behavioral Patterns:**
- Researches on mobile during commute/breaks
- Reads reviews and testimonials
- Checks for institutional backing (DDM)
- Compares multiple options before deciding
- Discusses with child before registering
- Likely to sign up after 2-3 website visits

**Preferred Communication:**
- Formal Czech ("vykání")
- Clear, jargon-free explanations
- Emphasis on safety and credentials
- Transparent pricing and terms

**Key Quote:**
> "I want my son to do something productive on weekends, but it needs to be somewhere I can trust, and he needs to actually want to go."

---

### Persona 2: Teen Tomáš

**Demographics:**
- Age: 13-15
- School level: 7th-9th grade (základní škola)
- Location: Prague
- Interests: Gaming, YouTube, technology, friends
- Tech-savviness: High (digital native)

**Goals:**
- Do something interesting on weekends
- Learn cool tech skills
- Create things to show friends
- Access equipment they don't have at home
- Meet other tech-interested kids

**Pain Points:**
- Parents want them to do "educational" activities (boring)
- Most camps/programs feel childish
- Treated like they don't understand technology
- Limited access to advanced equipment (3D printers, VR)
- Bored on weekends

**Motivations:**
- Social status (being the kid who made something cool)
- Hands-on learning (not just theory)
- Access to professional tools
- Creative freedom
- Fun experience

**Information Needs:**
- What specific things will I create?
- Is this going to be boring lectures?
- What equipment do they have?
- Will I be treated like a child?
- Who else goes there?
- Can I show off what I make?

**Behavioral Patterns:**
- Shows website to friends (social proof)
- Scrolls quickly, attention span ~30 seconds
- Attracted to visuals and videos
- Skeptical of "educational" marketing
- Influenced by peer opinions
- Makes snap judgments on "cool factor"

**Preferred Communication:**
- Visual-first (images, videos, demos)
- Authentic, not "trying too hard"
- Focus on outcomes (what they'll make)
- Modern, tech aesthetic
- Respect their intelligence

**Key Quote:**
> "I'm not going to some boring camp where they teach me PowerPoint. Show me I can actually make something real with VR or 3D printing."

---

### Persona 3: Secondary - DDM/HWLab Partner

**Demographics:**
- Representative of DDM Praha 6 or HWLab
- Professional stakeholder

**Goals:**
- Proper brand representation
- Professional image
- Compliance with regulations
- Quality educational program promotion

**Information Needs:**
- Brand logo usage
- Legal compliance
- Accurate representation of partnership
- Contact information accuracy

**Expectations:**
- Professional presentation
- No misrepresentation
- GDPR compliance
- Proper attribution

---

## User Journey Map

### Journey Stage 1: Awareness

**Touchpoint:** Social media ad, Google search, word-of-mouth

**User State:**
- Parent Petra: "My child needs weekend activities"
- Teen Tomáš: "I'm bored, need something to do"

**Actions:**
- Clicks on ad/search result
- Lands on homepage
- First impression formed in <3 seconds

**Emotions:**
- Petra: Cautiously optimistic, evaluating
- Tomáš: Skeptical, ready to dismiss

**Pain Points:**
- Slow loading = immediate bounce
- Unclear value proposition
- Generic "camp" aesthetic

**Opportunities:**
- Strong hero with clear value prop
- Visual proof of equipment/activities
- Immediate trust signals (DDM logo)

**Design Requirements:**
- Fast First Contentful Paint (<1.8s)
- Clear headline answering "What is this?"
- Eye-catching visuals (not stock photos)
- Above-fold DDM/HWLab logos

---

### Journey Stage 2: Consideration

**Touchpoint:** Scrolling homepage, exploring sections

**User State:**
- Petra: "Is this legitimate and worth the money?"
- Tomáš: "Is this actually cool or just another boring thing?"

**Actions:**
- Scrolls through program sections
- Reads USPs
- Checks FAQ
- Looks for pricing/dates
- Shows page to family member

**Emotions:**
- Petra: Building trust, comparing mentally
- Tomáš: Getting interested or losing interest fast

**Pain Points:**
- Too much text (Tomáš bounces)
- Not enough detail (Petra remains skeptical)
- No clear next steps
- Unclear pricing

**Opportunities:**
- Program cards with visual appeal
- Balance of detail and brevity
- Video/photo evidence
- Clear safety/supervision messaging
- Peer testimonials (for Tomáš)

**Design Requirements:**
- Scannable content hierarchy
- Visual program showcase
- Trust indicators throughout
- FAQ addressing parent concerns
- Progress indicators (scroll-based)

---

### Journey Stage 3: Decision

**Touchpoint:** CTA sections, registration links

**User State:**
- Petra: "Should I sign up now or wait?"
- Tomáš: "I actually want to do this"

**Actions:**
- Parent-teen discussion
- Checking available dates
- Reviewing pricing details
- Clicking registration link
- OR joining waitlist

**Emotions:**
- Petra: Ready but needs final reassurance
- Tomáš: Excited, wants to secure spot

**Pain Points:**
- Registration system (DDM) is external
- No immediate dates available
- Unclear capacity limits
- Fear of commitment

**Opportunities:**
- Clear CTA hierarchy
- Waitlist option (low friction)
- Scarcity messaging (limited spots)
- Easy handoff to DDM system

**Design Requirements:**
- Primary CTA: "Register Now" (DDM link)
- Secondary CTA: "Join Waitlist" (email form)
- Clear expectation setting
- Confirmation feedback
- Multiple CTA placements

---

### Journey Stage 4: Action

**Touchpoint:** Form submission or external registration

**User State:**
- Petra: Completing registration
- Tomáš: Telling friends about it

**Actions:**
- Fills out waitlist form
- OR redirected to DDM system
- Receives confirmation
- Shares with friends/family

**Emotions:**
- Relief (secured spot)
- Anticipation
- Validation of decision

**Pain Points:**
- Complex DDM registration process
- No confirmation from website
- Uncertainty about next steps

**Opportunities:**
- Email confirmation (waitlist)
- Clear next steps messaging
- Social sharing prompts
- Calendar save option

**Design Requirements:**
- Success state for waitlist
- Clear messaging post-DDM redirect
- Follow-up email template
- Sharing incentive

---

### Journey Stage 5: Post-Registration

**Touchpoint:** Email communications, social media

**User State:**
- Waiting for camp date
- Staying engaged

**Actions:**
- Receives reminder emails
- Prepares for camp
- Tells peers

**Emotions:**
- Excitement
- Impatience
- Satisfaction

**Opportunities:**
- Newsletter with prep info
- Community building
- Referral program

**Design Requirements:**
- Email templates
- Preparation guide
- Referral tracking (future)

---

## Information Architecture

### Site Map

```
/ (Homepage - Single Page Landing)
│
├── Header (sticky)
│   ├── Logo
│   ├── Navigation
│   │   ├── Program (anchor link)
│   │   ├── O nás (anchor link)
│   │   ├── Termíny (anchor link)
│   │   └── Kontakt (anchor link)
│   └── CTA Button: "Přihlásit se"
│
├── Section 1: Hero
│   ├── Headline
│   ├── Subheadline
│   ├── Primary CTA: "Přihlásit se"
│   ├── Secondary CTA: "Přidej se na waitlist"
│   └── Hero visual/video
│
├── Section 2: Co je Weeks
│   ├── Brief explanation
│   ├── Key stats (age range, time, location)
│   └── Transition to program
│
├── Section 3: Program
│   ├── Section headline
│   ├── Program Card: 3D Tisk
│   ├── Program Card: VR/AR
│   ├── Program Card: IoT & Robotika
│   └── Link: "Více o programu"
│
├── Section 4: Proč Weeks (USP Grid)
│   ├── USP 1: Exkluzivní HWLab vybavení
│   ├── USP 2: Učení skrze tvorbu
│   ├── USP 3: Odborní instruktoři
│   ├── USP 4: DDM zázemí a pojištění
│   ├── USP 5: Víkendový "detox" pro rodiče
│   └── USP 6: Kompletní servis (oběd, aktivity)
│
├── Section 5: Důvěra (Trust Signals)
│   ├── DDM Praha 6 logo + description
│   ├── HWLab logo + description
│   ├── Safety highlights (BOZP, pojištění, dozor)
│   └── Location advantage (Vyšehrad, Praha)
│
├── Section 6: Termíny & CTA
│   ├── Upcoming dates (from Sanity)
│   ├── Registration status
│   ├── Primary CTA: "Přihlásit se přes DDM"
│   └── Secondary CTA: Waitlist form
│
├── Section 7: FAQ
│   ├── Accordion: Parent questions
│   ├── Accordion: Practical info
│   └── Accordion: Safety/supervision
│
├── Section 8: Kontakt
│   ├── Quick contact info
│   ├── Interactive map (HWLab location)
│   ├── Contact form (optional)
│   └── Social media links
│
└── Footer
    ├── About links
    ├── Legal links (GDPR, Podmínky)
    ├── DDM & HWLab attribution
    ├── Social media
    └── Copyright

---

Future Pages (Separate Routes):
├── /program (Detailed program breakdown)
├── /o-nas (About DDM, HWLab, team)
├── /terminy (Full calendar, registration)
├── /kontakt (Full contact page)
├── /gdpr (Privacy policy)
└── /podminky (Terms & conditions)
```

### Navigation Hierarchy

**Primary Navigation:**
1. Program (anchor to section)
2. Proč Weeks (anchor to USP)
3. Termíny (anchor to dates)
4. Kontakt (anchor to contact)

**Mobile Navigation:**
- Hamburger menu
- Same structure
- CTA button prominent

**Footer Navigation:**
- About (O nás, Tým)
- Legal (GDPR, Podmínky)
- Social (Instagram, Facebook)
- Partners (DDM, HWLab)

---

### Content Hierarchy

**Level 1 - Critical (Above fold):**
- Hero headline & value proposition
- Primary CTA
- Trust signals (logos)

**Level 2 - Important (First scroll):**
- Program overview
- Key USPs
- Visual proof

**Level 3 - Supporting (Deep scroll):**
- Detailed USPs
- FAQ
- Contact info

**Level 4 - Necessary (Footer):**
- Legal
- Full contact
- Partners

---

## Homepage Wireframe Specification

### Section 1: Hero

**Purpose:** Capture attention, communicate value, drive action

**Layout (Desktop):**
```
┌─────────────────────────────────────────────────────────┐
│ Header (sticky, transparent/white)                       │
│ [Logo]              [Nav Links]      [Přihlásit se CTA] │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  ┌─────────────────────┐  ┌────────────────────────┐   │
│  │  CONTENT COLUMN     │  │   VISUAL COLUMN        │   │
│  │  (50% width)        │  │   (50% width)          │   │
│  │                     │  │                        │   │
│  │  H1: Víkendové IT   │  │   [Hero Image/Video:   │   │
│  │  tábory pro děti    │  │    Kids working with   │   │
│  │  10-15 let          │  │    3D printer, VR,     │   │
│  │                     │  │    excited faces]      │   │
│  │  P: Objevuj 3D tisk,│  │                        │   │
│  │  VR a robotiku v    │  │   Subtle animation:    │   │
│  │  HWLabu Praha.      │  │   Floating tech icons  │   │
│  │  Každou sobotu 9-17.│  │   or parallax effect   │   │
│  │                     │  │                        │   │
│  │  [CTA Button XL]    │  │                        │   │
│  │  Přihlásit se       │  │                        │   │
│  │  [CTA Button M]     │  │                        │   │
│  │  Přidej se na       │  │                        │   │
│  │  waitlist           │  │                        │   │
│  │                     │  │                        │   │
│  │  Trust badges:      │  │                        │   │
│  │  [DDM logo] [HWLab] │  │                        │   │
│  └─────────────────────┘  └────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Layout (Mobile):**
```
┌─────────────────────────┐
│ [Logo]  [☰]  [CTA]      │
├─────────────────────────┤
│                         │
│  H1: Víkendové IT       │
│  tábory pro děti        │
│  10-15 let              │
│                         │
│  [Hero Image]           │
│  (Square or 4:3)        │
│                         │
│  P: Objevuj 3D tisk,    │
│  VR a robotiku v        │
│  HWLabu...              │
│                         │
│  [Přihlásit se CTA]     │
│  [Waitlist CTA]         │
│                         │
│  [DDM] [HWLab logos]    │
│                         │
└─────────────────────────┘
```

**Content Specifications:**

**Headline (H1):**
- Font: Bold, 48-64px desktop, 32-40px mobile
- Color: Primary dark (gray-900)
- Max width: 600px
- Line height: 1.2
- Example: "Víkendové IT tábory pro děti 10-15 let"

**Subheadline (P):**
- Font: Regular, 20-24px desktop, 16-18px mobile
- Color: Gray-700
- Max width: 540px
- Line height: 1.5
- Example: "Objevuj 3D tisk, VR a robotiku v HWLabu Praha. Každou sobotu 9:00-17:00 pod záštitou DDM Praha 6."

**Primary CTA:**
- Text: "Přihlásit se"
- Style: btn-primary (amber background)
- Size: XL (56px height desktop, 48px mobile)
- Icon: Arrow right →
- State: Hover lifts + glow effect

**Secondary CTA:**
- Text: "Přidej se na waitlist"
- Style: btn-secondary (outline)
- Size: L (48px height)
- Icon: Email ✉
- State: Hover fill

**Visual Requirements:**
- Hero image: High-quality photo of real children (10-15 age) using equipment
- NOT stock photos
- Authentic HWLab environment
- Visible: 3D printer, VR headset, or robot
- Kids showing engagement (smiling, focused)
- Good lighting, professional but not overly staged
- Alternative: Short looping video (15s, autoplay, muted)

**Trust Badges:**
- DDM Praha 6 logo (grayscale or brand colors)
- HWLab logo
- Size: 80-100px height
- Arranged horizontally
- Subtle hover: color reveal

**Animations:**
- Fade in on load: Headline (delay 0ms), Subheadline (delay 200ms), CTAs (delay 400ms)
- Parallax: Hero image moves slightly on scroll
- CTA pulse: Subtle animation loop

**Rationale:**
- Two-column layout balances copy (parents) with visuals (teens)
- Immediate trust signals reduce bounce
- Dual CTAs accommodate different decision stages
- Hero imagery provides emotional connection

---

### Section 2: Co je Weeks

**Purpose:** Quick orientation for new visitors, bridge to program details

**Layout (Desktop & Mobile):**
```
┌─────────────────────────────────────────────────┐
│              [Centered Layout]                   │
│                                                  │
│  H2: Co je Weeks?                               │
│                                                  │
│  P: Weeks jsou víkendové IT tábory pro děti     │
│  10-15 let, které probíhají každou sobotu       │
│  v HWLabu na Vyšehradě. Děti si vyzkouší        │
│  3D tisk, virtuální realitu a robotiku pod      │
│  vedením odborných instruktorů.                 │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  STAT    │ │  STAT    │ │  STAT    │        │
│  │  [Icon]  │ │  [Icon]  │ │  [Icon]  │        │
│  │  10-15   │ │  9-17h   │ │  Vyšehrad│        │
│  │  let     │ │  sobota  │ │  Praha   │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Content Specifications:**

**Headline (H2):**
- Font: Bold, 36-40px desktop, 28-32px mobile
- Color: Gray-900
- Center aligned

**Body (P):**
- Font: Regular, 18-20px desktop, 16px mobile
- Color: Gray-700
- Max width: 700px
- Center aligned
- Line height: 1.6

**Stats Cards:**
- 3 cards in a row (stack on mobile)
- Icon above text
- Number/value large: 24-28px, bold
- Label small: 14-16px, gray-600
- Subtle border or background
- Icons: Calendar, Clock, Location pin

**Animations:**
- Fade in on scroll into view
- Stats count-up animation (10→10, 9→9, etc.)

**Rationale:**
- Quickly orients confused visitors
- Stats provide scannable key info
- Bridges emotional hero to logical program section

---

### Section 3: Program

**Purpose:** Showcase activities, appeal to teens visually, inform parents

**Layout (Desktop):**
```
┌──────────────────────────────────────────────────────┐
│                                                       │
│  H2: Co děti zažijí                                  │
│  P: Praktické workshopy s nejmodernější technikou    │
│                                                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ CARD 1  │  │ CARD 2  │  │ CARD 3  │             │
│  │         │  │         │  │         │             │
│  │ [Icon/  │  │ [Icon/  │  │ [Icon/  │             │
│  │  Image] │  │  Image] │  │  Image] │             │
│  │         │  │         │  │         │             │
│  │ 3D Tisk │  │ VR/AR   │  │ IoT &   │             │
│  │ & Makerz│  │ Zážitky │  │ Robot.  │             │
│  │         │  │         │  │         │             │
│  │ Brief   │  │ Brief   │  │ Brief   │             │
│  │ descrip │  │ descrip │  │ descrip │             │
│  │         │  │         │  │         │             │
│  │ [→ Více]│  │ [→ Více]│  │ [→ Více]│             │
│  └─────────┘  └─────────┘  └─────────┘             │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Layout (Mobile):**
```
┌────────────────────┐
│  H2: Co děti zažijí│
│  P: Praktické...   │
│                    │
│  ┌──────────────┐ │
│  │   CARD 1     │ │
│  │   (Full W)   │ │
│  └──────────────┘ │
│  ┌──────────────┐ │
│  │   CARD 2     │ │
│  └──────────────┘ │
│  ┌──────────────┐ │
│  │   CARD 3     │ │
│  └──────────────┘ │
│                    │
└────────────────────┘
```

**Program Card Specifications:**

**Card Container:**
- Background: White with subtle shadow
- Border radius: 16px
- Padding: 32px (24px mobile)
- Hover state: Lift (translateY -8px) + shadow increase
- Transition: 300ms ease

**Card Icon/Image:**
- Size: 80x80px or 240px wide image
- Style: Gradient icon or real photo
- Color: Program-specific gradient
  - 3D: Indigo to Purple
  - VR: Cyan to Blue
  - IoT: Emerald to Teal

**Card Title (H3):**
- Font: Bold, 24-28px
- Color: Gray-900
- Margin bottom: 12px

**Card Description (P):**
- Font: Regular, 16-18px
- Color: Gray-700
- Line height: 1.6
- Max: 2-3 sentences
- Focus on outcome for kids

**Card Link:**
- Text: "→ Více o programu"
- Style: Inline link with arrow
- Color: Primary-600
- Hover: Underline

**Content Examples:**

**Card 1: 3D Tisk & Maker Workshop**
- Icon: 3D printer or cube
- Description: "Navrhni si vlastní 3D model v Tinkercad a vytiskni ho na profesionální 3D tiskárně. Odnášíš si domů svůj výtvor."
- Appeal: Tangible outcome (take home object)

**Card 2: VR/AR Zážitky**
- Icon: VR headset
- Description: "Vyzkoušej si nejnovější VR technologie a vytvoř vlastní virtuální prostředí. Zažij budoucnost zábavy a vzdělávání."
- Appeal: Cutting-edge tech, unique experience

**Card 3: IoT & Robotika**
- Icon: Robot or circuit
- Description: "Postav a naprogramuj vlastního robota. Naučíš se Arduino, senzory a základy elektroniky hravou formou."
- Appeal: Programming skills, hands-on

**Animations:**
- Stagger reveal: Cards fade in one by one (200ms delay each)
- Hover: 3D tilt effect (subtle)
- Icon: Subtle float animation loop

**Rationale:**
- Visual cards appeal to teens (quick scan)
- Outcome-focused copy appeals to parents (learning)
- "Take home" aspect proves value
- Link to detailed page for interested users

---

### Section 4: Proč Weeks (USP Grid)

**Purpose:** Differentiate from competitors, build trust, justify price

**Layout (Desktop):**
```
┌──────────────────────────────────────────────────────┐
│  H2: Proč zvolit Weeks?                              │
│                                                       │
│  ┌───────┐ ┌───────┐ ┌───────┐                      │
│  │ USP 1 │ │ USP 2 │ │ USP 3 │                      │
│  └───────┘ └───────┘ └───────┘                      │
│  ┌───────┐ ┌───────┐ ┌───────┐                      │
│  │ USP 4 │ │ USP 5 │ │ USP 6 │                      │
│  └───────┘ └───────┘ └───────┘                      │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Layout (Mobile):**
```
┌────────────────────┐
│  H2: Proč Weeks?   │
│                    │
│  ┌──────────────┐ │
│  │   USP 1      │ │
│  └──────────────┘ │
│  ┌──────────────┐ │
│  │   USP 2      │ │
│  └──────────────┘ │
│  ... (6 total)     │
└────────────────────┘
```

**USP Card Specifications:**

**Card Container:**
- Background: Gradient background (subtle)
- Border: None or 1px subtle
- Border radius: 12px
- Padding: 24px
- Aspect ratio: Square or 4:3

**Card Icon:**
- Size: 48x48px
- Style: Line icon with accent color
- Positioned top-left or centered

**Card Title:**
- Font: Semibold, 18-20px
- Color: Gray-900
- Margin bottom: 8px

**Card Description:**
- Font: Regular, 14-16px
- Color: Gray-700
- Line height: 1.5
- Max: 1-2 sentences

**USP Content:**

**USP 1: Exkluzivní HWLab vybavení**
- Icon: Tools/Equipment
- Title: "Exkluzivní vybavení HWLabu"
- Description: "Přístup k profesionálním 3D tiskárnům, VR headsetům, CNC frézám a dalším technologiím za statisíce korun."
- Target: Both (parents: value, teens: cool factor)

**USP 2: Učení skrze tvorbu**
- Icon: Lightbulb/Hands
- Title: "Učení skrze tvorbu"
- Description: "Žádná nuda. Každý si odnáší domů vlastní projekt - 3D tisk, naprogramovaného robota nebo VR aplikaci."
- Target: Both (parents: learning, teens: tangible outcome)

**USP 3: Odborní instruktoři**
- Icon: User/Teacher
- Title: "Odborní instruktoři"
- Description: "Naši lektoři jsou profesionálové z IT oboru s pedagogickou praxí, ne jen studenti na brigádě."
- Target: Parents (trust)

**USP 4: DDM Praha 6 záštita**
- Icon: Shield/Check
- Title: "Pod záštitou DDM Praha 6"
- Description: "Kompletní pojištění, prověření personál, BOZP a certifikované prostory podle standardů DDM."
- Target: Parents (safety, legal)

**USP 5: Víkendový "detox"**
- Icon: Calendar/Coffee
- Title: "Sobotní "detox" pro rodiče"
- Description: "Každou sobotu 9:00-17:00. Děti mají smysluplný program a vy čas na sebe nebo povinnosti."
- Target: Parents (lifestyle benefit)

**USP 6: Kompletní servis**
- Icon: Checklist/Star
- Title: "Kompletní servis"
- Description: "Oběd, svačiny, všechny materiály a přístup k technologiím. Stačí přijít."
- Target: Parents (convenience)

**Animations:**
- Stagger reveal: Grid fades in row by row
- Hover: Subtle scale (1.02x) and shadow
- Icons: Color transition on hover

**Rationale:**
- Grid layout = scannable
- Mix of parent-focused (safety, convenience) and teen-focused (equipment, outcomes)
- Differentiates from generic camps
- Builds value perception

---

### Section 5: Důvěra (Trust Signals)

**Purpose:** Reduce parent anxiety, legitimize program, show institutional backing

**Layout (Desktop):**
```
┌──────────────────────────────────────────────────────┐
│  H2: Pod záštitou důvěryhodných institucí            │
│                                                       │
│  ┌────────────────────┐  ┌────────────────────┐     │
│  │  DDM PRAHA 6       │  │  HWLAB PRAHA       │     │
│  │  [Large Logo]      │  │  [Large Logo]      │     │
│  │                    │  │                    │     │
│  │  Short description │  │  Short description │     │
│  │  of partnership    │  │  of partnership    │     │
│  │  and what it means │  │  and what it means │     │
│  │  for parents       │  │  for parents       │     │
│  └────────────────────┘  └────────────────────┘     │
│                                                       │
│  ┌────────────────────────────────────────────┐     │
│  │  SAFETY HIGHLIGHTS (3-4 icons)            │     │
│  │  [Icon] Pojištění | [Icon] Dozor | [Icon]│     │
│  │  BOZP | [Icon] Certifikované prostory     │     │
│  └────────────────────────────────────────────┘     │
│                                                       │
│  ┌────────────────────────────────────────────┐     │
│  │  LOCATION HIGHLIGHT                        │     │
│  │  "HWLab Vyšehrad - moderní makerspace      │     │
│  │  v centru Prahy"                           │     │
│  │  [Small map preview or photo]              │     │
│  └────────────────────────────────────────────┘     │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Content Specifications:**

**Headline (H2):**
- Font: Bold, 36-40px
- Center aligned
- Color: Gray-900

**Partner Cards:**
- Background: White
- Border: Subtle gray
- Padding: 40px
- Logo: Max 200px width, center aligned
- Description: 16-18px, gray-700, 2-3 sentences

**DDM Praha 6 Description Example:**
"Dům dětí a mládeže Praha 6 garantuje profesionální zázemí, kompletní pojištění dětí i personálu a dodržování všech bezpečnostních standardů. DDM má 70 let zkušeností se vzděláváním dětí."

**HWLab Description Example:**
"HWLab je jeden z nejmodernějších makerspace v ČR vybavený technologiemi za miliony korun. Prostory splňují všechny bezpečnostní normy pro práci s dětmi."

**Safety Icons:**
- Row of 4 icons with labels
- Icon size: 40px
- Labels: 14px
- Color: Trust-500 (emerald)
- Icons: Shield (Pojištění), Eye (Dozor 1:8), Clipboard (BOZP), Certificate (Certifikace)

**Location Highlight:**
- Small section below
- Photo of HWLab exterior or map preview
- Text: Emphasize Prague center location, accessibility
- Link to full contact/map section

**Rationale:**
- Institutional backing = parent trust
- Safety details address #1 parent concern
- Location signals legitimacy
- Logos provide visual credibility

---

### Section 6: Termíny & CTA

**Purpose:** Convert visitors to registrations or waitlist signups

**Layout (Desktop):**
```
┌──────────────────────────────────────────────────────┐
│  H2: Přihlášení                                      │
│  P: Vyber si termín nebo se přidej na waitlist       │
│                                                       │
│  ┌────────────────────────────────────────────┐     │
│  │  DATE CARDS (if available from Sanity)     │     │
│  │                                             │     │
│  │  ┌───────────┐  ┌───────────┐             │     │
│  │  │ DATE 1    │  │ DATE 2    │             │     │
│  │  │ 15.1.2026 │  │ 22.1.2026 │             │     │
│  │  │ 9:00-17:00│  │ 9:00-17:00│             │     │
│  │  │ Míst: 12  │  │ Obsazeno  │             │     │
│  │  │ [CTA]     │  │ [Waitlist]│             │     │
│  │  └───────────┘  └───────────┘             │     │
│  └────────────────────────────────────────────┘     │
│                                                       │
│  OR (if no dates available)                          │
│                                                       │
│  ┌────────────────────────────────────────────┐     │
│  │  WAITLIST MODE                             │     │
│  │                                             │     │
│  │  H3: Momentálně nejsou otevřené termíny    │     │
│  │  P: Přidej se na waitlist a budeš první,   │     │
│  │  kdo se dozví o nových termínech           │     │
│  │                                             │     │
│  │  [Email input field]                       │     │
│  │  [Submit CTA: "Přidat na waitlist"]        │     │
│  │                                             │     │
│  └────────────────────────────────────────────┘     │
│                                                       │
│  PRICING INFO                                        │
│  "Cena: 1500 Kč / sobota (včetně obědů a materiálu)"│
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Date Card Specifications:**

**Card Container:**
- Background: White
- Border: 2px solid primary-200
- Border radius: 12px
- Padding: 24px
- Width: 280px (desktop), full (mobile)

**Date Display:**
- Font: Bold, 28px
- Color: Primary-600
- Format: "15. ledna 2026"

**Time:**
- Font: Regular, 16px
- Color: Gray-700

**Capacity Indicator:**
- Available: "Volných míst: X" (green badge)
- Low: "Poslední místa!" (amber badge)
- Full: "Obsazeno" (gray badge)

**CTA Button:**
- Available: "Přihlásit se" (primary, links to DDM)
- Full: "Přidat na waitlist" (secondary)

**Waitlist Form Specifications:**

**Container:**
- Max width: 480px
- Center aligned
- Background: Light gradient
- Padding: 40px
- Border radius: 16px

**Headline (H3):**
- Font: Bold, 24px
- Color: Gray-900
- Center aligned

**Description (P):**
- Font: Regular, 16px
- Color: Gray-700
- Center aligned
- Margin bottom: 24px

**Email Input:**
- Width: 100%
- Height: 48px
- Border: 2px solid gray-300
- Border radius: 8px
- Placeholder: "tvuj@email.cz"
- Focus state: Border primary-500
- Validation: Email format

**Submit Button:**
- Text: "Přidat na waitlist"
- Style: btn-primary (full width)
- Height: 48px
- Icon: Email or Arrow
- Loading state: Spinner
- Success state: Checkmark + "Přidáno!"

**Privacy Note:**
- Small text below form
- Font: 12px, gray-600
- Text: "Tvůj email použijeme jen pro info o nových termínech. Žádný spam."
- Link to GDPR

**Animations:**
- Form submit: Button loading spinner
- Success: Form transforms to success message with checkmark animation
- Error: Red shake animation

**Rationale:**
- Clear date presentation reduces confusion
- Dual path (register vs. waitlist) captures all users
- Capacity indicators create urgency
- Simple email form = low friction
- Pricing transparency = trust

---

### Section 7: FAQ

**Purpose:** Answer common parent questions, reduce support burden

**Layout (Desktop & Mobile):**
```
┌──────────────────────────────────────────────────────┐
│  H2: Často kladené dotazy                            │
│                                                       │
│  ┌────────────────────────────────────────────┐     │
│  │  [+] Jak vypadá typická sobota na Weeks?   │     │
│  └────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────┐     │
│  │  [-] Jaké je věkové rozmezí?                │     │
│  │  Tábory jsou určeny pro děti 10-15 let...  │     │
│  └────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────┐     │
│  │  [+] Potřebuje dítě předchozí zkušenosti?  │     │
│  └────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────┐     │
│  │  [+] Co je zahrnuto v ceně?                │     │
│  └────────────────────────────────────────────┘     │
│  ... (8-12 questions total)                          │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Accordion Specifications:**

**Container:**
- Max width: 800px
- Center aligned

**Question (Button):**
- Font: Semibold, 18-20px
- Color: Gray-900
- Padding: 20px 24px
- Background: White
- Border: 1px solid gray-200
- Border radius: 8px
- Margin bottom: 12px
- Cursor: pointer
- Hover: Background gray-50
- Icon: [+] or [-] (right aligned)

**Answer (Collapsible):**
- Font: Regular, 16px
- Color: Gray-700
- Padding: 0 24px 20px 24px
- Line height: 1.6
- Smooth expand/collapse: 300ms ease

**Animation:**
- Icon rotation: [+] rotates to [-]
- Content: Height expand with fade in
- Stagger: Slight delay if opening multiple

**FAQ Content Categories:**

**Praktické informace:**
1. Jak vypadá typická sobota na Weeks?
2. Jaké je věkové rozmezí?
3. Co je zahrnuto v ceně?
4. Potřebuje dítě vlastní notebook?
5. Můžete zajistit dopravu?

**Bezpečnost a dozor:**
6. Jaký je poměr dětí na instruktora?
7. Jak řešíte bezpečnost při práci s technikou?
8. Máte pojištění dětí?
9. Co když se dítě zraní?

**Program a vzdělávání:**
10. Potřebuje dítě předchozí zkušenosti s programováním?
11. Co si dítě odnese domů?
12. Jsou aktivity přizpůsobeny různým úrovním?

**Administrativa:**
13. Jak probíhá registrace?
14. Jaká je storno podmínka?
15. Můžu přijít na prohlídku?

**Answer Examples:**

**Q: Jak vypadá typická sobota na Weeks?**
A: "Děti přicházejí v 9:00. Program začíná úvodním briefingem, pokračuje praktickým workshopem (3D tisk, VR, nebo robotika podle plánu), přestávka na oběd a odpolední projektová práce. Končíme v 17:00 prezentací toho, co děti vytvořily. Každý si odnáší svůj projekt domů."

**Q: Jaký je poměr dětí na instruktora?**
A: "Maximálně 8 dětí na jednoho instruktora. Při práci s nebezpečnými stroji (CNC, 3D tiskárny) je dozor ještě intenzivnější. Bezpečnost je naše priorita č. 1."

**Q: Co je zahrnuto v ceně?**
A: "Vše. Oběd, svačiny, všechny materiály (filament na 3D tisk, elektronické součástky), přístup k technologiím a odborné vedení. Dítě si odnáší všechny své výtvory."

**Rationale:**
- Accordion = space-efficient, scannable
- Categories help users find relevant questions
- Proactive answering reduces "Contact us" burden
- Detailed answers build trust

---

### Section 8: Kontakt

**Purpose:** Provide contact options, show location, final CTA

**Layout (Desktop):**
```
┌──────────────────────────────────────────────────────┐
│  H2: Kontakt                                         │
│                                                       │
│  ┌────────────────────┐  ┌────────────────────┐     │
│  │  CONTACT INFO      │  │  MAP               │     │
│  │                    │  │                    │     │
│  │  HWLab Praha       │  │  [Interactive map  │     │
│  │  Vyšehrad          │  │   showing HWLab    │     │
│  │                    │  │   location]        │     │
│  │  Email:            │  │                    │     │
│  │  weeks@ddmpraha6   │  │  [Get Directions]  │     │
│  │                    │  │                    │     │
│  │  Tel:              │  │                    │     │
│  │  +420 XXX XXX     │  │                    │     │
│  │                    │  │                    │     │
│  │  Adresa:           │  │                    │     │
│  │  Na Topolce 52/20 │  │                    │     │
│  │  Praha 2, 128 00  │  │                    │     │
│  │                    │  │                    │     │
│  │  [Social Icons]    │  │                    │     │
│  │  FB | IG          │  │                    │     │
│  └────────────────────┘  └────────────────────┘     │
│                                                       │
│  ┌────────────────────────────────────────────┐     │
│  │  FINAL CTA                                 │     │
│  │  Ještě váháš? Napiš nám nebo zavolej!      │     │
│  │  [CTA: Kontaktovat] [CTA: Přihlásit se]   │     │
│  └────────────────────────────────────────────┘     │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Content Specifications:**

**Contact Info:**
- Font: Regular, 16-18px
- Color: Gray-700
- Each item clickable:
  - Email: mailto: link
  - Phone: tel: link (mobile)
  - Address: Opens map
- Icons next to each (envelope, phone, location)

**Social Icons:**
- Size: 40x40px
- Color: Gray on default, brand color on hover
- Links open in new tab
- Platforms: Facebook, Instagram (as available)

**Map:**
- Embedded Google Maps or similar
- Interactive (zoom, pan)
- Marker at HWLab location
- "Get Directions" button below
- Fallback: Static map image with link

**Final CTA:**
- Background: Light gradient
- Padding: 32px
- Center aligned
- Headline: 20px, semibold
- Two buttons:
  - "Kontaktovat" (secondary, opens email)
  - "Přihlásit se" (primary, scrolls to registration)

**Rationale:**
- Multiple contact options (email, phone, address)
- Map provides concrete location reassurance
- Clickable elements = mobile-friendly
- Final CTA = last conversion opportunity

---

### Footer

**Purpose:** Legal compliance, navigation, branding

**Layout (Desktop):**
```
┌──────────────────────────────────────────────────────┐
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ ABOUT       │ │ LEGAL       │ │ PARTNERS    │   │
│  │             │ │             │ │             │   │
│  │ O nás       │ │ GDPR        │ │ [DDM Logo]  │   │
│  │ Tým         │ │ Podmínky    │ │ [HWLab Logo]│   │
│  │ Program     │ │ Cookies     │ │             │   │
│  │ Kontakt     │ │             │ │ Socials:    │   │
│  │             │ │             │ │ [FB] [IG]   │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                       │
│  ──────────────────────────────────────────────────  │
│                                                       │
│  © 2026 Weeks - DDM Praha 6 | Vytvořeno s 💙 v Praze│
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Content Specifications:**

**Column 1: About**
- Links to main pages
- Font: 14px, gray-600
- Hover: Primary color
- Line height: 2

**Column 2: Legal**
- Required GDPR links
- Same styling as Column 1
- Must be clearly visible

**Column 3: Partners**
- Partner logos (60px height)
- Grayscale, color on hover
- Social icons below
- Links open in new tab

**Bottom Bar:**
- Background: Darker gray
- Font: 12px, gray-500
- Copyright notice
- Optional: "Made with ❤ in Prague"

**Mobile Layout:**
- Single column
- Sections stack
- Same content

**Rationale:**
- Legal compliance (GDPR)
- Navigation backup
- Partner attribution
- Professional closure

---

## Mobile-First Considerations

### Design Principles

**1. Touch-First Interface**
- Minimum tap target: 44x44px
- Spacing between interactive elements: 8px minimum
- No hover-dependent functionality
- Swipe gestures where appropriate

**2. Performance**
- Images: WebP format, lazy loading
- Critical CSS inline
- Defer non-critical scripts
- Target: <3s load on 3G

**3. Content Hierarchy**
- Most important content first
- Shorter paragraphs (2-3 sentences)
- Scannable headings
- Clear visual hierarchy

**4. Navigation**
- Sticky header with hamburger menu
- CTA always visible (sticky or in nav)
- Breadcrumbs for deep pages
- Back to top button after 2 screens

### Responsive Breakpoints

```css
/* Mobile First Approach */
:root {
  /* Base styles for mobile (320px+) */
}

/* Small tablets */
@media (min-width: 640px) {
  /* sm: Larger phones, small tablets */
}

/* Tablets */
@media (min-width: 768px) {
  /* md: Tablets portrait */
}

/* Desktop */
@media (min-width: 1024px) {
  /* lg: Tablets landscape, desktop */
}

/* Large desktop */
@media (min-width: 1280px) {
  /* xl: Large desktop */
}
```

### Mobile-Specific Optimizations

**Hero Section (Mobile):**
- Single column (content stacks)
- Hero image 100% width, 60vh height
- Headline: 32-36px (smaller than desktop)
- CTAs: Full width stacked buttons
- Trust logos: Centered, smaller

**Program Cards (Mobile):**
- Single column
- Full width cards
- Reduced padding (16px vs 32px)
- Tap to expand detail (not hover)

**USP Grid (Mobile):**
- Single column
- Cards with left-aligned icons
- Horizontal card layout (icon + text)

**FAQ (Mobile):**
- Full width accordion
- Larger tap targets
- Auto-scroll to expanded question

**Forms (Mobile):**
- Full width inputs
- Large submit button (48px height)
- Keyboard-appropriate input types
- Auto-focus on email input

**Navigation (Mobile):**
```
┌─────────────────────────┐
│ [Logo]      [☰]  [CTA]  │
└─────────────────────────┘

When hamburger clicked:
┌─────────────────────────┐
│ [Logo]      [X]         │
├─────────────────────────┤
│ Program                 │
│ Proč Weeks             │
│ Termíny                │
│ Kontakt                │
├─────────────────────────┤
│ [Přihlásit se CTA]     │
└─────────────────────────┘
```

### Mobile Testing Checklist

- [ ] All text readable without zoom
- [ ] Forms easy to fill on mobile keyboard
- [ ] No horizontal scrolling
- [ ] Images load fast
- [ ] CTAs easily tappable
- [ ] Phone numbers tap to call
- [ ] Emails tap to open mail app
- [ ] Address tap to open maps
- [ ] Animations don't slow performance
- [ ] Works in both portrait and landscape

---

## CTA Strategy

### CTA Hierarchy

**Primary CTA: "Přihlásit se"**
- Purpose: Drive to DDM registration
- Style: btn-primary (amber background)
- Placement:
  - Hero (above fold)
  - After Program section
  - Termíny section
  - Footer
  - Sticky header (mobile)
- Text variations:
  - "Přihlásit se"
  - "Registrovat se"
  - "Rezervovat místo"
- Link: Opens DDM registration system in new tab
- Tracking: GA4 event "registration_click"

**Secondary CTA: "Přidat na waitlist"**
- Purpose: Capture leads when no dates available
- Style: btn-secondary (outline or secondary color)
- Placement:
  - Hero (if waitlist mode)
  - Termíny section (always)
  - After FAQ
- Text: "Přidat na waitlist" or "Dej mi vědět o termínech"
- Action: Opens modal with email form OR inline form
- Tracking: GA4 event "waitlist_signup"

**Tertiary CTAs:**
- "Více o programu" - Links to detail pages
- "Kontaktovat" - Opens email/form
- "Zobrazit FAQ" - Scrolls to FAQ
- Social share buttons (future)

### CTA Placement Strategy

**Above Fold (Hero):**
- Most critical conversion point
- Both primary and secondary visible
- Clear hierarchy (primary larger/brighter)

**After Program:**
- Users now understand what Weeks offers
- Primary: "Přihlásit se" (high intent)
- Context: "Zkus si 3D tisk, VR a robotiku"

**After USP Grid:**
- Users convinced of value
- Primary: "Rezervovat místo"
- Context: Emphasize scarcity

**Termíny Section:**
- Decision point
- Primary: Per-date registration
- Secondary: Waitlist form

**After FAQ:**
- Objections answered
- Secondary: "Ještě otázky? Kontaktuj nás"
- Primary: "Už tě přesvědčujeme? Přihlaš se"

### CTA Copy Guidelines

**Do:**
- Use action verbs ("Přihlaš se", "Rezervuj", "Zkus")
- Create urgency ("Poslední místa")
- Be specific ("Přihlásit dítě na 15.1.")
- Offer value ("Dej nám email, dostaneš info o termínech")

**Don't:**
- Generic ("Klikni zde", "Odeslat")
- Vague ("Více informací")
- Passive ("Formulář")
- Negative ("Nemáš místo? Waitlist")

### CTA States

**Default State:**
- Clear, readable
- Sufficient contrast (WCAG AA)
- Visual weight appropriate to hierarchy

**Hover State (Desktop):**
- Subtle lift (2-4px translateY)
- Brightness increase or glow
- Cursor: pointer
- Transition: 200-300ms

**Active State:**
- Slight scale down (0.98)
- Darker shade
- Immediate feedback

**Loading State:**
- Spinner animation
- Text: "Načítání..." or "Odesílání..."
- Disabled (prevent double-click)

**Success State:**
- Checkmark icon
- Text: "Odesláno!" or "Přidáno!"
- Green background
- Auto-hide or persist

**Error State:**
- Red border/background
- Error message below
- Shake animation
- Retry option

### Conversion Tracking

**Events to Track:**

```javascript
// Primary CTA - Registration Click
gtag('event', 'registration_click', {
  'event_category': 'conversion',
  'event_label': 'DDM Registration',
  'value': 1500 // Price in CZK
});

// Secondary CTA - Waitlist Signup
gtag('event', 'generate_lead', {
  'event_category': 'conversion',
  'event_label': 'Waitlist Email',
  'value': 1
});

// Tertiary CTA - Program Detail View
gtag('event', 'view_item', {
  'event_category': 'engagement',
  'event_label': 'Program Detail - 3D Print',
});

// Form Interactions
gtag('event', 'form_start', {
  'event_category': 'engagement',
  'event_label': 'Waitlist Form'
});
```

**Facebook Pixel Events:**

```javascript
// Registration Click
fbq('track', 'InitiateCheckout', {
  value: 1500,
  currency: 'CZK'
});

// Waitlist Signup
fbq('track', 'Lead', {
  content_name: 'Waitlist'
});
```

### A/B Testing Opportunities

**Test Variations:**
1. CTA text: "Přihlásit se" vs "Rezervovat místo" vs "Chci se přihlásit"
2. CTA color: Amber vs Green vs Blue
3. CTA position: Hero vs Sticky vs Both
4. Waitlist headline: "Přidej se na waitlist" vs "Dostaneš info jako první"
5. Scarcity: "Zbývá X míst" vs No scarcity message

**Success Metrics:**
- Click-through rate (CTR)
- Conversion rate (CR)
- Bounce rate
- Time on page
- Scroll depth

---

## Interaction Design Patterns

### Animation Principles

**Purpose of Animation:**
- Guide attention
- Provide feedback
- Indicate state changes
- Delight users (subtly)
- NOT distraction

**Animation Duration:**
- Micro-interactions: 200-300ms
- State changes: 300-400ms
- Page transitions: 400-600ms
- Never >1000ms

**Easing Functions:**
- Entrance: ease-out (starts fast, slows down)
- Exit: ease-in (starts slow, speeds up)
- Movement: ease-in-out (smooth both ends)
- Bounce: For success states only

### Specific Interactions

**1. Scroll-Based Animations**

```javascript
// Fade in on scroll into view
IntersectionObserver triggers when element 20% visible
Animation: opacity 0 → 1, translateY(20px) → 0
Duration: 600ms
Easing: ease-out
```

**Elements to animate:**
- Section headings
- Program cards (stagger)
- USP grid items (stagger)
- Stats counters

**2. Hover Effects**

**Cards (Program, USP):**
- Lift: translateY(-8px)
- Shadow: Increase blur and spread
- Duration: 300ms
- Easing: ease-out
- Optional: Subtle 3D tilt (5-10deg)

**Buttons:**
- Scale: 1.02x or lift 2px
- Glow: Box-shadow with primary color
- Icon: Slide or bounce
- Duration: 200ms

**3. Click/Tap Feedback**

**Buttons:**
- Active state: Scale(0.98)
- Ripple effect (Material Design style)
- Color darken
- Duration: 100ms

**Links:**
- Underline animation (left to right)
- Color transition
- Icon movement

**4. Form Interactions**

**Input Focus:**
- Border color change (gray → primary)
- Label move up (if floating label)
- Duration: 200ms

**Validation:**
- Success: Green border, checkmark icon
- Error: Red border, shake animation, error text
- Duration: 300ms

**Submit:**
- Button → Loading spinner
- Form → Success message (slide up)
- Confetti or checkmark animation
- Duration: 400ms

**5. FAQ Accordion**

**Expand:**
- Icon rotation: [+] → [-] (180deg)
- Content: Height 0 → auto (with max-height trick)
- Fade in: opacity 0 → 1
- Duration: 300ms
- Easing: ease-in-out

**6. Navigation**

**Mobile Menu:**
- Slide in from right
- Overlay fade in
- Menu items stagger fade in
- Duration: 400ms

**Sticky Header:**
- Scroll down: Slide up (hide)
- Scroll up: Slide down (show)
- Background: Transparent → White with shadow
- Duration: 300ms

**7. Loading States**

**Page Load:**
- Skeleton screens (not spinners)
- Progressive image loading (blur up)
- Content fade in when ready

**Data Loading:**
- Spinner for buttons
- Skeleton for content blocks
- Shimmer effect

### Micro-Interactions

**1. Like/Favorite (Future):**
- Heart icon fill animation
- Particle burst
- Scale pulse

**2. Copy to Clipboard:**
- Icon: Clipboard → Checkmark
- Tooltip: "Zkopírováno!"
- Duration: 2000ms (then reset)

**3. Share:**
- Share icon pulse
- Modal slide up
- Share options fade in stagger

**4. Scroll to Top:**
- Button: Fade in after 2 screens
- Click: Smooth scroll animation
- Icon: Arrow bounce

### Accessibility Considerations

**Respect User Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Focus States:**
- Visible outline (not outline: none)
- High contrast
- Animation on focus

**Keyboard Navigation:**
- Tab order logical
- Skip to content link
- Focus trap in modals

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

**1. Perceivable**

**Color Contrast:**
- Body text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum
- Test tool: WebAIM Contrast Checker

**Text Alternatives:**
- All images have alt text
- Decorative images: alt=""
- Icons have aria-label or sr-only text
- Form inputs have labels

**Adaptable:**
- Semantic HTML (h1-h6, nav, main, footer)
- Reading order matches visual order
- No information by color alone

**Distinguishable:**
- Text resizable to 200% without loss
- Line height 1.5 minimum
- Paragraph spacing 2x font size
- No text images (use real text)

**2. Operable**

**Keyboard Accessible:**
- All functionality via keyboard
- No keyboard traps
- Visible focus indicators
- Skip to main content link

**Enough Time:**
- No time limits on forms
- Auto-playing animations can be paused
- Session timeouts have warnings

**Seizures:**
- No flashing >3 times per second
- No large flashing areas

**Navigable:**
- Page titles descriptive
- Focus order logical
- Link purpose clear from text
- Multiple ways to find pages
- Headings and labels descriptive

**3. Understandable**

**Readable:**
- Language declared (lang="cs")
- Unusual words explained
- Reading level appropriate (B1-B2)

**Predictable:**
- Navigation consistent
- Consistent identification
- No change on focus
- No change on input

**Input Assistance:**
- Error messages clear
- Labels and instructions
- Error prevention (confirmations)
- Suggestions for corrections

**4. Robust**

**Compatible:**
- Valid HTML
- ARIA used correctly
- Status messages announced

### Czech-Specific Accessibility

**Language:**
- HTML lang attribute: `<html lang="cs">`
- Proper Czech diacritics (č, ř, ž, etc.)
- Czech date formats (d. m. yyyy)

**Cultural:**
- Formal "vykání" for adults
- Appropriate imagery (Czech context)
- Local conventions (currency, address format)

### Screen Reader Optimization

**ARIA Labels:**
```html
<!-- Navigation -->
<nav aria-label="Hlavní navigace">

<!-- Search -->
<input type="search" aria-label="Hledat na webu">

<!-- Status messages -->
<div role="status" aria-live="polite">
  Email byl přidán na waitlist
</div>

<!-- Modal -->
<div role="dialog" aria-labelledby="modal-title" aria-modal="true">
```

**Skip Links:**
```html
<a href="#main-content" class="skip-link">
  Přeskočit na hlavní obsah
</a>
```

**Landmark Regions:**
```html
<header role="banner">
<nav role="navigation">
<main role="main" id="main-content">
<aside role="complementary">
<footer role="contentinfo">
```

### Form Accessibility

**Labels:**
```html
<label for="email">
  Váš email
  <span aria-label="povinné" class="required">*</span>
</label>
<input
  type="email"
  id="email"
  name="email"
  required
  aria-required="true"
  aria-describedby="email-help"
>
<small id="email-help">
  Použijeme pouze pro info o termínech
</small>
```

**Error Messages:**
```html
<input
  type="email"
  id="email"
  aria-invalid="true"
  aria-describedby="email-error"
>
<div id="email-error" role="alert">
  Prosím zadejte platný email
</div>
```

### Testing Checklist

- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Color contrast passes
- [ ] Text scalable to 200%
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Focus visible
- [ ] No flashing content
- [ ] Valid HTML
- [ ] ARIA used correctly
- [ ] Works with prefers-reduced-motion

### Tools

- **axe DevTools** - Browser extension
- **WAVE** - Web accessibility evaluator
- **Lighthouse** - Chrome DevTools
- **NVDA** - Free screen reader (testing)
- **Contrast Checker** - WebAIM

---

## Success Metrics

### Launch Criteria (Week 1)

**Technical:**
- [ ] Lighthouse Performance Score >90
- [ ] First Contentful Paint <1.8s
- [ ] Largest Contentful Paint <2.5s
- [ ] Cumulative Layout Shift <0.1
- [ ] Time to Interactive <3.5s
- [ ] Zero critical console errors
- [ ] Mobile responsive (all breakpoints)
- [ ] Cross-browser tested (Chrome, Safari, Firefox, Edge)

**Functional:**
- [ ] All CTAs link correctly
- [ ] Waitlist form submits successfully
- [ ] DDM registration handoff works
- [ ] Contact forms send emails
- [ ] Map loads and is interactive
- [ ] FAQ accordions expand/collapse
- [ ] Analytics tracking verified
- [ ] GDPR cookie consent working

**Content:**
- [ ] All copy reviewed and approved
- [ ] Images optimized and loading
- [ ] No Lorem Ipsum placeholder text
- [ ] Czech diacritics correct
- [ ] Links not broken
- [ ] Meta descriptions present
- [ ] Open Graph images set

### User Behavior Metrics (Month 1)

**Engagement:**
- Time on page: >90 seconds (target)
- Bounce rate: <50% (target)
- Scroll depth: >60% reach FAQ (target)
- Pages per session: >1.5 (target)

**Conversion:**
- Registration click rate: >5% of visitors (target)
- Waitlist signup rate: >10% of visitors (target)
- CTA click-through rate: >15% (target)
- Form completion rate: >80% (started → submitted)

**Traffic:**
- Unique visitors: 500+ (Month 1 target)
- Mobile traffic: >60% (expected)
- Returning visitors: >20% (target)
- Direct traffic: >30% (indicates brand awareness)

### Long-Term Success (3-6 Months)

**Business Outcomes:**
- Camps reach 80%+ capacity through website referrals
- Waitlist has 50+ active subscribers
- <5% cancellation rate
- Positive parent testimonials collected

**User Satisfaction:**
- Parent feedback: "Professional and trustworthy"
- Teen feedback: "Actually looks cool"
- Partner feedback: "Properly represents our brand"
- No complaints about usability

**Technical Health:**
- Core Web Vitals: All green
- Accessibility score: >95
- SEO ranking: Top 10 for "IT tábory Praha děti"
- Email deliverability: >95%

### Analytics Dashboard

**Key Metrics to Monitor:**

```javascript
// Google Analytics 4
- Total users (weekly, monthly)
- New vs Returning
- Traffic sources (organic, social, direct, referral)
- Top landing pages
- Goal completions:
  - Registration clicks
  - Waitlist signups
  - Contact form submissions
  - Program page views
- User flow (homepage → registration)
- Drop-off points
- Device breakdown (mobile, desktop, tablet)
- Browser breakdown
- Location (Prague vs other)

// Heatmap (Future - Hotjar/Microsoft Clarity)
- Click heatmaps
- Scroll maps
- Session recordings (anonymized)
```

### Iteration Priorities

**Based on Data, Prioritize:**

**If High Bounce Rate:**
- Improve hero message clarity
- Reduce page load time
- Test different hero images

**If Low Registration Rate:**
- Simplify CTA copy
- Add scarcity signals
- Increase trust elements
- A/B test CTA placement

**If Low Waitlist Signups:**
- Shorten form (just email)
- Add incentive ("Budeš první")
- Test modal vs inline form

**If High Mobile Bounce:**
- Optimize mobile performance
- Review mobile UX
- Test mobile-specific CTAs

**If High FAQ Engagement:**
- Move FAQ higher on page
- Add FAQ to navigation
- Create dedicated FAQ page

---

## Appendix A: Design System Reference

### Typography Scale

```css
/* Headings */
.heading-1 {
  font-size: 3rem;    /* 48px */
  line-height: 1.2;
  font-weight: 700;
}

.heading-2 {
  font-size: 2.25rem; /* 36px */
  line-height: 1.25;
  font-weight: 700;
}

.heading-3 {
  font-size: 1.5rem;  /* 24px */
  line-height: 1.3;
  font-weight: 600;
}

/* Body */
.text-large {
  font-size: 1.25rem; /* 20px */
  line-height: 1.6;
}

.text-base {
  font-size: 1rem;    /* 16px */
  line-height: 1.5;
}

.text-small {
  font-size: 0.875rem; /* 14px */
  line-height: 1.4;
}
```

### Color Palette

```css
:root {
  /* Primary - Indigo */
  --primary-50: #EEF2FF;
  --primary-100: #E0E7FF;
  --primary-500: #6366F1;
  --primary-600: #4F46E5;
  --primary-900: #312E81;

  /* Accent - Cyan */
  --accent-50: #ECFEFF;
  --accent-500: #06B6D4;
  --accent-600: #0891B2;

  /* Trust - Emerald */
  --trust-50: #ECFDF5;
  --trust-500: #10B981;
  --trust-600: #059669;

  /* CTA - Amber */
  --cta-400: #FBBF24;
  --cta-500: #F59E0B;
  --cta-600: #D97706;

  /* Neutral */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-900: #111827;
}
```

### Spacing Scale

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-24: 6rem;    /* 96px */
}
```

### Component Classes

```css
/* Buttons */
.btn-primary {
  background: var(--cta-500);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 200ms ease;
}

.btn-primary:hover {
  background: var(--cta-600);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4);
}

.btn-secondary {
  border: 2px solid var(--primary-500);
  color: var(--primary-600);
  background: transparent;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 200ms ease;
}

.btn-secondary:hover {
  background: var(--primary-500);
  color: white;
}

/* Sections */
.section-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-padding {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

@media (min-width: 768px) {
  .section-padding {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
}

/* Cards */
.card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 300ms ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Gradients */
.text-gradient {
  background: linear-gradient(
    135deg,
    var(--primary-500),
    var(--accent-500)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bg-gradient {
  background: linear-gradient(
    135deg,
    var(--primary-50),
    var(--accent-50)
  );
}
```

---

## Appendix B: Content Tone Guidelines

### Voice & Tone

**Brand Voice:**
- Professional but approachable
- Enthusiastic but not over-the-top
- Technical but accessible
- Confident but humble

**Tone for Parents:**
- Formal "vykání" (Vy, Váš, Vaše)
- Reassuring and trustworthy
- Detail-oriented
- Emphasis on safety and quality

**Tone for Teens:**
- Respectful (still vykání, but less formal)
- Enthusiastic about technology
- Outcome-focused (what you'll create)
- Not trying too hard to be cool

### Writing Guidelines

**Do:**
- Use active voice ("Vytvoříte", not "Bude vytvořeno")
- Be specific ("3D tiskárny Prusa i3" vs "moderní vybavení")
- Show outcomes ("Odnesete si vlastní 3D model" vs "Naučíte se 3D tisk")
- Address concerns directly ("Poměr 1:8 garantuje bezpečnost" vs "Máme dozor")

**Don't:**
- Use jargon without explanation
- Make unsupported claims ("nejlepší", "jedinečný")
- Talk down to teens
- Be overly salesy

### Example Headlines

**Good:**
- "Víkendové IT tábory pro děti 10-15 let"
- "Objevuj 3D tisk, VR a robotiku v HWLabu"
- "Každou sobotu 9-17h pod záštitou DDM Praha 6"

**Bad:**
- "Nejlepší IT tábor v Praze!" (unsupported claim)
- "Fun coding camp for kids" (English, vague)
- "Staň se IT géniem za víkend!" (unrealistic)

---

## Appendix C: Asset Requirements

### Images Needed

**Hero Section:**
- High-res photo (2560x1440px) of kids 10-15 using HWLab equipment
- Alternative: 15-second looping video
- Format: WebP (with JPG fallback)
- Must show: Happy kids, recognizable tech (3D printer/VR), HWLab space

**Program Cards (3 images):**
- 3D Printing: Kid holding printed object, printer visible (800x600px)
- VR: Kid wearing VR headset, engaged expression (800x600px)
- IoT/Robotics: Kid with programmed robot or Arduino setup (800x600px)
- Format: WebP

**Trust Section:**
- DDM Praha 6 logo (vector/SVG or high-res PNG)
- HWLab logo (vector/SVG or high-res PNG)
- HWLab exterior or interior photo (1200x800px)

**Location:**
- HWLab building exterior (1200x800px)
- Or embedded Google Maps screenshot

**Open Graph:**
- OG image for social sharing (1200x630px)
- Must include: Logo, headline, key visual

### Icons Needed

**Program Icons (3):**
- 3D Printer icon
- VR Headset icon
- Robot/Circuit icon
- Style: Line icons, consistent set
- Format: SVG
- Size: 80x80px (scalable)

**USP Icons (6):**
- Tools (Equipment)
- Hands/Creation (Learning)
- User/Teacher (Instructors)
- Shield (Safety)
- Calendar (Schedule)
- Checklist (Service)
- Style: Same as program icons

**UI Icons:**
- Arrow right →
- Chevron down ˅
- Email ✉
- Phone ☎
- Location 📍
- Plus/Minus [+] [-]
- Close ✕
- Menu ☰
- Social: Facebook, Instagram
- Loading spinner

### Video (Optional)

**Hero Video:**
- Duration: 15-30 seconds
- Format: MP4 (H.264)
- Resolution: 1920x1080
- Autoplay: Yes
- Muted: Yes
- Loop: Yes
- Fallback: Poster image
- Content: Time-lapse of kids creating projects

---

## Appendix D: Technical Implementation Notes

### SEO Requirements

**Meta Tags:**
```html
<head>
  <title>Weeks - Víkendové IT tábory pro děti 10-15 let | Praha</title>
  <meta name="description" content="Víkendové IT tábory v HWLabu Praha. Děti 10-15 let si vyzkouší 3D tisk, VR a robotiku. Každou sobotu 9-17h pod záštitou DDM Praha 6.">
  <meta name="keywords" content="IT tábory děti Praha, víkendové tábory, 3D tisk pro děti, VR tábor, robotika děti">

  <!-- Open Graph -->
  <meta property="og:title" content="Weeks - Víkendové IT tábory">
  <meta property="og:description" content="3D tisk, VR a robotika pro děti 10-15 let v Praze">
  <meta property="og:image" content="/og-image.jpg">
  <meta property="og:url" content="https://weeks.cz">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Weeks - Víkendové IT tábory">
  <meta name="twitter:description" content="3D tisk, VR a robotika pro děti 10-15 let">
  <meta name="twitter:image" content="/twitter-card.jpg">

  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Weeks - IT tábory",
    "description": "Víkendové IT tábory pro děti",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Na Topolce 52/20",
      "addressLocality": "Praha 2",
      "postalCode": "128 00",
      "addressCountry": "CZ"
    },
    "telephone": "+420-XXX-XXX-XXX",
    "email": "weeks@ddmpraha6.cz"
  }
  </script>
</head>
```

### Performance Budget

**Page Weight:**
- HTML: <50KB
- CSS: <100KB
- JS: <200KB (total)
- Images: <500KB (above fold), <2MB (total)
- Fonts: <100KB

**Requests:**
- Total: <50 requests
- Critical path: <10 requests

**Load Times:**
- First Contentful Paint: <1.8s
- Speed Index: <3.0s
- Time to Interactive: <3.5s
- Total Blocking Time: <200ms

### Browser Support

**Minimum Support:**
- Chrome: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Edge: Last 2 versions
- Mobile Safari (iOS): Last 2 versions
- Chrome Android: Last 2 versions

**Progressive Enhancement:**
- Core content accessible without JS
- CSS Grid with flexbox fallback
- Modern features with feature detection

---

## Document Version History

**v1.0 - December 2025**
- Initial comprehensive UI/UX specification
- User personas (Parent, Teen, Partner)
- User journey map (5 stages)
- Complete information architecture
- Detailed homepage wireframes (8 sections)
- Mobile-first guidelines
- CTA strategy and tracking
- Interaction design patterns
- Accessibility requirements (WCAG 2.1 AA)
- Success metrics and KPIs

---

## Next Steps

1. **Review & Approval**
   - Share with team for feedback
   - Validate personas with real parents/teens
   - Confirm DDM/HWLab requirements

2. **Asset Collection**
   - Commission photography at HWLab
   - Collect partner logos
   - Create/source icons

3. **Content Writing**
   - Write all copy following tone guidelines
   - Translate technical terms appropriately
   - Create FAQ content

4. **Design Mockups**
   - Create high-fidelity mockups in Figma
   - Design system implementation
   - Mobile and desktop versions

5. **Development**
   - Frontend implementation
   - CMS integration
   - Form functionality
   - Analytics setup

6. **Testing**
   - User testing with parents and teens
   - Accessibility audit
   - Performance testing
   - Cross-browser QA

7. **Launch**
   - Soft launch to limited audience
   - Gather feedback
   - Iterate based on data
   - Full launch

---

**End of UI/UX Specification**
