# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Weeks** is a website for a weekly summer příměstský (day) IT camp for children (ages 9-15) in Prague and Karlovy Vary, operated by **Weeks s.r.o.** — not DDM Praha 6. The old catalog of weekend/one-day camp formats and per-city pages is gone: there's now a single product (Monday–Friday, 8:30–16:30 — `PROVOZNI_DOBA` in `src/lib/site.ts`) sold as **turnusy** (terms), one per city, see `src/lib/turnusy.ts`. It appeals to two audiences: parents (who pay) and teenagers (who decide if they want to attend).

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
    sitemap.ts              # Dynamic sitemap (weeks.cz URLs, one entry per tábor and per turnus)
    not-found.tsx           # 404 page
    /api
      /waitlist/route.ts    # Interest/waitlist form API (Formspree)
      /contact/route.ts     # Contact form API
      ...                    # registration, Comgate payment, cron (nástupní list, payment reminder — see vercel.json), shop and admin routes — predate this phase, see /src/app/api
    /tabory                 # Camp listing — grouped by city, then theme, then term
    /tabory/[tema]          # One page per theme; the camp description lives HERE and nowhere else
    /tabory/termin/[slug]   # One page per turnus — date, price, venue, registration
    /oslavy                 # Kids' parties — one open offer with examples, not packages; own inquiry form, see "/oslavy" below
    /firmy                  # B2B page — three offers (kids' days for employees, workshops, partnerships) + one inquiry form, see "/firmy (phase 4)" below
    /o-nas                  # About page (team with real names) — organizer is Weeks s.r.o., see Project Overview
    /kontakt                # Contact page — same
    /gdpr                   # GDPR page — same
    /podminky               # Terms page — same
    /eshop, /registrace, /platba, /go  # Shop, registration + Comgate payment flow, QR redirects — predate this phase. `/eshop` still works but is commented out of the header, footer and Rozcesti (team has not decided whether to run it)
    /studio                 # Sanity Studio
  /components
    /layout
      Header.tsx            # Navigation (logo = home link)
      Footer.tsx            # Footer with links
    /sections
      HeroSection.tsx       # Homepage hero ("IT tábory, kde děti tvoří budoucnost")
      NejblizsiTurnusy.tsx  # Homepage preview of nearest turnusy (slice of /tabory's list)
      ProRodice.tsx         # Emerald strip "Co máte jisté" — only claims the site can back (small groups, first aid, capacity from data, hours from `PROVOZNI_DOBA`)
      ProDeti.tsx           # Dark cyan block "Co si postavíš" + the interactive grid; content read from the running tábor's focus modules
      FotoPas.tsx           # Full-width camp photo carrying one claim `DENNI_HARMONOGRAM` backs (outdoors at 13:00)
      GoogleRecenze.tsx     # Google review carousel (scroll-snap, no library) — renders only when `src/lib/recenze.ts` has reviews + a profile URL
      InstagramPas.tsx      # Strip of hand-picked IG posts above the closing CTA — renders only when `src/lib/instagram.ts` has posts
      Rozcesti.tsx          # Homepage "co Weeks dělá" — tábor / firmy / e-shop / učebna
      FAQSection.tsx        # Accordion FAQ — reads `getSiteFaq()` from `@/lib/site`
      ContactSection.tsx    # Contact info + email signup (GDPR consent checkbox)
    /tabory
      TaborCard.tsx          # Theme tile on /tabory — theme, technologies, its terms in that city
    /turnusy
      TurnusList.tsx         # Turnus grid + city filter (`filtrMest`) + live capacity; used by the dark terms section on /tabory/[tema]
      TurnusCard.tsx         # One turnus card — labels/CTA text come from `turnus-labels.ts`
      TurnusInterestForm.tsx # Non-binding "notify me" form for turnusy that aren't bookable yet (GDPR checkbox)
      VenueShowcase.tsx, ProjectGallery.tsx, SpotsLeft.tsx  # Venue photos, project gallery (no hardcoded image list — items come from the calling page's focus modules), live capacity badge
    /firmy
      FirmyPoptavka.tsx      # `/firmy` inquiry form — one form, three modes via `?typ=`, posts to `/api/contact`
    /providers
      MotionProvider.tsx    # Framer Motion reduced-motion support
    /seo
      StructuredData.tsx    # Schema.org markup — `OrganizationSchema`, `LocalBusinessSchema`, `EventSchema`, `BreadcrumbSchema`; price/date read only from turnusy, never from locations.ts
      schema-turnusy.ts     # `turnusyProSchema()` — which turnusy may appear in `EventSchema` and with what `Offer.availability` (InStock/SoldOut); a turnus missing date, price or venue never renders, at any status (+ `schema-turnusy.test.ts`)
    /ui
      CookieConsent.tsx     # GDPR cookie banner
      MrizkaSekce.tsx       # Interactive blueprint grid (cells light up behind the cursor); hangs on any section, cleans up its timers
      TickerStrip.tsx       # Scrolling topic strip on the homepage, right under the hero (amber — role "akce a stav")
  /lib
    tabory.ts                # Tábor (theme) data + `getTabor`/`getAktivniTabory`/`zkusiSiTabora` + `DENNI_HARMONOGRAM` — source of truth for theme, focus and weekly program
    turnusy.ts               # Turnus data + `getTurnusy`/`getTurnus`/`isBookable` + `getTaboryTurnusu`/`getFocusTurnusu`/`getTurnusyByTabor` — source of truth for price/date/capacity
    cities.ts                # City + venue registry — `getCity`/`getVenue`
    focus.ts                 # Focus modules (3d-tisk, iot, vr, ...) — owned by the tábor, read by a turnus through it
    firmy.ts                 # `/firmy` offer content (three B2B offers) — `getNabidky`/`getNabidka`, `reference` fields intentionally empty, see "/firmy (phase 4)" below
    oslavy.ts                # `/oslavy` content — flat lists (`PRIKLADY`, `ZAJISTIME`, `POTREBUJEME`, `MISTA`), deliberately no id catalogue and no `reference` field, see "/oslavy" below
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
  favicon.ico               # Favicon (multi-size)
  apple-touch-icon.png      # Apple touch icon
  robots.txt                # Robots rules
  site.webmanifest          # PWA manifest
```

## Product: camps (themes) and their terms

The camp is a Monday–Friday weekly příměstský (day) camp, 8:30–16:30 (arrival
8:30–9:00, pickup 16:00–16:30; the only source is `PROVOZNI_DOBA` in
`src/lib/site.ts` — VOP §18/§24 and the late-pickup fee read it too). Since
phase 6 it is described by **two entities, not one**:

| | **Tábor** (`src/lib/tabory.ts`) | **Turnus** (`src/lib/turnusy.ts`) |
|---|---|---|
| What it is | the theme — "what they do there" | the term — "when and where" |
| Owns | name, perex, description, `focus[]`, weekly program, FAQ | city, venue, date, price, capacity, `status` |
| Status | `aktivni` \| `chystame` | `TurnusStatus` (chystame/otevreno/plno/uzavreno) |
| Link | — | `taborIds: TaborId[]` |

`taborIds` is an **array even though it always holds one id today**: a turnus id
is written into `registrations.term_id` and onto issued invoices, so a week that
later runs two parallel groups must not force a data migration or a redirect of
an address that is already on an invoice.

Camps at deploy: `chytre-technologie` (`aktivni`, the whole former `/tabor`
content) plus `game-dev`, `ai` and `webovy-tabor` (`chystame` — intent only:
perex and "co si dítě zkusí", never a program, price, date or equipment;
`validateTabory` rejects a `chystame` tábor that carries a program).

- **Data model**: `src/lib/turnusy.ts` exports `TURNUSY` (the source of truth
  for price, date, capacity, venue and status) plus `getTurnusy`, `getTurnus`,
  `isBookable`, and — for the link to the theme — `getTaboryTurnusu`,
  `getFocusTurnusu`, `getTurnusyByTabor`. **`turnus.focus` no longer exists**;
  focus modules describe the theme, so they are read through the tábor. `src/lib/locations.ts` is no longer a parallel content source:
  after the cleanup it is a 45-line city→contact map (name, slug, and phone /
  e-mail taken from `SITE`) used by the registration and e-mail flow. There is
  no price, date, capacity, venue or program in it to read — those belong to
  the turnus.
- **Focus**: reusable content modules per **tábor**. `FocusId` in
  `src/lib/focus.ts` is `3d-tisk | iot | vr | herni-vyvoj` (3D tisk / IoT
  a elektronika / Virtuální realita / Herní vývoj). `chytre-technologie` uses
  `['3d-tisk', 'iot']`; both current turnusy point at that tábor. **VR is
  deliberately not in that list**: the equipment is not certain and Karlovy Vary
  never ran it, so the site would be promising it on the strength of nothing —
  the weekly programme confirms it, no day contains VR. The `vr` module keeps its
  content in `focus.ts` and returns by adding the id back to `focus`.
- **Age**: 9–15 (`turnus.ageRange`, currently `'9-15'` for both turnusy).
- **Cities**: Praha and Karlovy Vary (`src/lib/cities.ts`). City is a
  *property* of a turnus, not a branch of the site — filter with
  `/tabory?mesto=<city>`, and a turnus's own URL embeds the city in the slug
  (e.g. `/tabory/termin/karlovy-vary-leto-2027`).
- **URLs** (three levels, the funnel a parent actually walks: city → theme → term):
  `/tabory` (listing grouped by city), `/tabory/[tema]` (the description, which
  lives here and **only** here), `/tabory/termin/[slug]` (date, price, venue,
  registration). The term is **not** nested under the theme: with `taborIds`
  being a list, a two-theme turnus would have nowhere to live, and changing a
  theme would force a 301 on an address that is already on an invoice.
- **Current data (this phase)**: both turnusy (`praha-leto-2027`,
  `kv-leto-2027`) are `chystame` — no confirmed date, price or venue yet.
  Summer 2027 terms are expected to go live around October 2026. Until then
  the site's main job is collecting contacts (`TurnusInterestForm`), not
  selling — `isBookable(turnus)` is what flips a turnus card from a "notify
  me" form to a real "Přihlásit dítě" registration CTA.
- **Camp name on invoices/e-mails**: `RegistrationForm` writes
  `turnus.taborIds[0]` (a tábor id like `'chytre-technologie'`) into the
  registration's `program` field, but nothing downstream trusts that field —
  invoices, confirmation e-mails, the payment reminder and the nástupní list
  all derive the camp name server-side from `term_id` via
  `getTrustedProgramName` (`src/lib/payment-pricing.ts`), which names it after
  the tábor ("Letní příměstský tábor (Chytré technologie)"), not after a list
  of its focus modules. The stored
  `program` value survives only as a fallback for old registrations whose
  turnus is no longer in `TURNUSY`. See the comment above `TURNUSY` in
  `src/lib/turnusy.ts`.
- **Structured data**: `/tabory/termin/[slug]` carries `EventSchema` — but only for
  a turnus `turnusyProSchema()` (`src/components/seo/schema-turnusy.ts`)
  clears: date, price and venue all set, status `otevreno` or `plno`. A sold-out
  turnus (`plno`) still renders, as `Offer.availability: SoldOut` — it doesn't
  just disappear like a `chystame` turnus does. Both current turnusy are
  `chystame`, so neither page emits an `Event` today. `/tabory`,
  `/tabory/[tema]`, `/tabory/termin/[slug]`, `/o-nas`, `/kontakt` and `/firmy`
  all carry `BreadcrumbSchema` matching the visible breadcrumb trail (`/firmy`
  has none on-page, so it matches the header link's name instead).
  **Where the JSON-LD lives**: a server layout, but only when that layout has
  no child routes. `/o-nas` and `/kontakt` render it from `layout.tsx`.
  Everything under `/tabory` renders it from its own `page.tsx`, because
  `/tabory/layout.tsx` wraps all three levels — putting a breadcrumb there
  would emit two conflicting `BreadcrumbList` blocks on every theme and term
  page. `/tabory/layout.tsx` therefore carries metadata only.

### Redirects (old structure → `/tabory`)

Defined in `next.config.js` `redirects()` — permanent, not app routes (Next
emits 308 for `permanent: true`):
- `/program`, `/tabor-chytrych-technologii`, `/tabor-3d-tisk`, `/tabor-iot`, `/kveten` → `/tabory`
- `/tabor` → `/tabory`, `/tabor/:slug` → `/tabory/termin/:slug` (the one-page
  detail that phase 6 replaced; it was never in the index, it lived only on
  `feat/web-2027`)
- `/karlovy-vary`, `/karlovy-vary/letni-primestsky`, `/karlovy-vary/tabor-chytrych-technologii` → `/tabory?mesto=karlovy-vary`
- `/karlovy-vary/o-nas`, `/karlovy-vary/kontakt`, `/karlovy-vary/gdpr`, `/karlovy-vary/podminky` → their Prague equivalents

Every rule points straight at its final address — no rule may target one that
redirects again.

## Design System

### Colors (Tailwind) — each carries a role, not a mood

A colour may only be used **in its role**. Before phase 6 the palette had no
rule: four fifths of the site were two neutrals and amber appeared eleven times
in total, while `accent` and `trust` showed up at random, so a reader could not
read them as a system. If a colour does not fit the role, it is not used.

| Colour | Role | Where |
|---|---|---|
| `cta-*` (amber) | action and state | primary buttons, `CHYSTÁME` badge, "zbývá X míst", ticker strip, closing CTA |
| `accent-*` (cyan) | technology | camp themes, the bar on a theme card, icons in the kids' section, grid cells on dark |
| `trust-*` (emerald) | a parent's peace of mind | the "Co máte jisté" strip — small groups, first aid, 8:30–16:30 |
| `primary-*` (indigo) | the brand's base | grid, links, grid cells on light |
| `ink` / `paper` | surface and text | everywhere else |

### Section rhythm

Two adjacent sections must be separated — **either by a change of background
or by `border-y`**. Two sections sharing a background with no line between them
is a bug: that is how `section-padding` twice over produced ~192 px of empty
cream with nothing to hold on to.

**Every page carries at least one dark (`bg-ink`) block** as an anchor.

**Load-bearing text never hides behind an animation.** Animate `y`, not
`opacity` (and never a clip mask), for an H1, perex or CTA — otherwise the page
is blank whenever the animation does not run: a frozen background tab, a JS
error, slow hydration.

**This applies to every `whileInView` reveal, not just headings** (tightened
2026-09-22). `initial={{ opacity: 0 }}` is written into the HTML the server
sends, so the content is genuinely invisible — not merely un-animated — until
hydration finishes and the IntersectionObserver fires. Scrolling fast was enough
to catch camp cards and the "Další témata" section rendering blank.
`src/components/scroll-animace.test.ts` reads the source files and fails on any
line where `whileInView` meets `opacity`; a single component cannot police a
rule that spans components.

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
3. **Tertiary**: the venues a turnus runs in (`src/lib/cities.ts`) - professional representation. They are venues, not partners. **No turnus currently has a venue** (`venueId: null` on both): FabLab VARY&TE ran the 2026 camp but has not confirmed summer 2027, only expressed interest, so it survives on the site only as a past reference on `/o-nas` — never as a venue, a partner, or a promise. This repo is public; don't write a partnership into it.

### Language
All user-facing content is in Czech. Code/docs can be in English.

## Current Status

**Structural rebuild (Weeks s.r.o. as operator)**: Complete across the whole site — the product/marketing pages (`/`, `/tabory`, `/tabory/[tema]`, `/tabory/termin/[slug]`) as well as `/o-nas`, `/kontakt`, `/gdpr` and `/podminky` all describe Weeks s.r.o. as organizer; DDM Praha 6 and HWLab remain only as historical code comments explaining what was removed. `/firmy` (linked from the header, footer and the homepage's Rozcesti section) is built — see "`/firmy` (phase 4)" below.
**Status**: No turnus is bookable yet — both turnusy are `chystame`, with no confirmed date/price/venue. Summer 2027 terms are expected around October 2026; until then the site's job is collecting contacts, not selling.
**Phase 5 (structured data, rescued focus-module content, dead analytics) is done** — see "Phase 5" below.
**Phase 6 (camps as a category, visual system) is done** — see "Phase 6" below.
**Founder feedback on phase 6 is worked in (2026-09-22)**: scroll reveals animate
`y` only (see "Design System" below), the homepage's kids' section shows planned
camps too and every tile links to its own camp, VR left the running camp's focus,
FabLab dropped to a past reference, the e-shop is hidden from navigation and
`/oslavy` was added — see "`/oslavy`" below.

### `/oslavy`

Kids' parties and events, live since 2026-09-22. Spec:
`docs/superpowers/specs/2026-09-22-oslavy-design.md`.

Parents asked for this on their own before the site offered it anywhere; the
nearest page, `/firmy`, addresses HR departments about employee benefits, so a
parent shopping for a tenth birthday did not recognise themselves in it.

- **One open offer, not a catalogue.** `src/lib/oslavy.ts` exports flat lists
  (`PRIKLADY`, `ZAJISTIME`, `POTREBUJEME`, `MISTA`) — deliberately **not** a
  `Record<Id, …>` like `firmy.ts`. Fixed packages would have to state how they
  differ (length, number of children, price) and none of those is confirmed;
  an example promises nothing.
- **Nothing is claimed that cannot be shown.** No price (there is no price
  list), no references or counts (**no party has taken place yet**, confirmed
  2026-09-22), no age range (the programme adapts; age is settled in the
  inquiry), no named venue. `oslavy.test.ts` enforces all of it.
- **Own `form_type`.** `OslavaPoptavka` posts to `/api/contact` with
  `typ: 'oslava'`, which the parser turns into `formType: 'oslavy'`
  (`contact-payload.ts`). Same pre-deploy dependency as `/firmy` — see below.
- **The date field is free text, not `<input type="date">`**: a parent often
  knows "sometime mid-June", and a datepicker would force them to name a day
  that is not settled yet.
- Navigation order is `Tábory · Oslavy · Pro firmy · O nás · Kontakt`, plus a
  tile in the homepage's Rozcesti (where it took the hidden e-shop's place).

### `/firmy` (phase 4)

Phase 4 is done. `/firmy` is a real, statically-generated page: three B2B offers
(`src/lib/firmy.ts` — days for employees' kids, workshops for teams, partnerships),
each stating what Weeks provides vs. what the company needs to provide, plus one
shared inquiry form (`FirmyPoptavka`) that posts to `/api/contact` with a `typ`
field. A valid `typ` makes the parser set `formType: 'firmy'`
(`src/app/api/contact/contact-payload.ts`); the route then sends that to weeks-hub
as `form_type` (`src/app/api/contact/route.ts`) — **weeks-hub must recognize that
value or it silently drops the inquiry; that's a pre-deploy check, not a repo
task.** The same now applies to `oslavy`. The route logs a non-OK hub response
instead of failing the inquiry, so that check has something to look at.

What that failure looks like matters: the inquiry goes to **Formspree first**
and is synced to the hub second, so an unknown `form_type` loses no data — the
e-mail still arrives at admin@weeks.cz. What it loses is the record in the hub,
silently, because the parent sees a confirmation either way. Hence a deploy-time
check rather than a test.

**Weeks has not fulfilled a single corporate booking yet.** There is no price
list, and the `reference` field on every offer in `src/lib/firmy.ts` is
intentionally empty. Do not fill in a reference, a price, or a count of
companies served anywhere in this repo without the founder supplying the real
number.

The page used to *say* so, in a paragraph called `PARTNERSTVI_ZATIM` ("we have
not closed a single partnership yet"). **It was removed on 2026-09-22** — the
founder judged that it weakened the offer more than the silence it replaced.
The lesson is recorded because it recurs: an empty `reference` field reads as a
gap waiting to be filled, and what filled it was an apology. Missing references
are handled by saying nothing, which is why `src/lib/oslavy.ts` has no
`reference` field at all.

The three venue tiles under "Kde to proběhne" are now **two**: "in our own
space" claimed a workshop Weeks does not own, and "in a partner space" named
FabLab VARY&TE, which has signed nothing.

### Phase 5 (structured data, rescued content, analytics cleanup)

Phase 5 is done. It picked up what phase 4 deliberately left out:

- **Structured data**: `EventSchema` and `BreadcrumbSchema`
  (`src/components/seo/StructuredData.tsx`) now render on the turnus page
  (`/tabory/termin/[slug]` since phase 6); `BreadcrumbSchema` also on
  `/tabory`, `/o-nas`, `/kontakt` and `/firmy`. See
  "Structured data" under "Product: turnus-based summer camp" above for what
  gates a turnus into `EventSchema` and where each page's JSON-LD lives.
- **Rescued focus-module content finally renders**: `printers`, `hardware`,
  `gallery` and `faq` (`src/lib/focus.ts`, pulled out of the deleted one-day
  pages back in phase 2) are now shown on the camp page (`/tabory/[tema]`
  since phase 6). `ProjectGallery` no longer carries its own hardcoded list of
  six images — the page builds its items from the tábor's focus modules.
- **`analytics.ts` cleanup**: six functions from the deleted weekend/one-day
  formats — dead since that catalog was removed, called from nowhere — are
  gone, including two that sent the old, now-wrong prices as GA/Meta
  conversion `value`. `/firmy` inquiries are now measured:
  `trackFirmyPoptavka` fires `firmy_poptavka_submit` (GA only, no conversion
  value) with the submitted offer's id as a dimension, not its heading text,
  so the event survives future copy changes.

### Phase 6 (camps as a category, visual system)

Phase 6 is done. Spec:
`docs/superpowers/specs/2026-09-21-web-2027-faze-6-tabory-a-vizual-design.md`,
plan: `docs/superpowers/plans/2026-09-21-web-2027-faze-6-tabory-a-vizual.md`.

- **Two entities instead of one.** `src/lib/tabory.ts` holds the theme; the
  turnus points at it through `taborIds`. `turnus.focus` is gone. See "Product"
  above.
- **Three levels of URLs** replace the one-page `/tabor`: `/tabory`,
  `/tabory/[tema]`, `/tabory/termin/[slug]`. The description lives on the
  theme and **is not repeated on a term page** — otherwise several nearly
  identical pages would compete and a search engine would pick one itself.
- **Visual system from variant B** (built and approved on the throwaway route
  `/nahled/b`, deleted at the end of the phase): colour roles and section
  rhythm, now recorded under "Design System" above.
- **Homepage**: dark hero with a group photo in an offset amber frame; the
  interactive grid moved out of the hero into the kids' section (`ProDeti`,
  `src/components/ui/MrizkaSekce.tsx`); the six-tile `USPSection` split into
  `ProRodice` (emerald, verifiable facts) and `ProDeti` (dark cyan, content
  read from the running tábor's focus modules); a full-width camp photo
  between them; `ContactSection` became the amber closing block and **kept**
  its e-mail form — it is the only contact capture on the homepage.
- **Removed**: `KdeASKym` (dissolved — venues → `/tabory` next to their city,
  team → `/o-nas` where it was a duplicate, 1:5 / first aid / capacity →
  `ProRodice`, phone + e-mail → already in `ContactSection` and the footer),
  `KVRegionNudge` and `/api/geo` (city is a filter now, both turnusy are
  equally `chystame`), `USPSection`, `src/app/nahled/**`.
- **Buttons**: `btn-primary`, `btn-secondary` and `btn-outline` carry `gap-2`;
  24 hand-written `ml-*`/`mr-*` margins on icons inside buttons are gone. Do
  not add one back — the gap belongs to the button.

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

Data live in `TYM` in `src/lib/tym.ts` (moved out of the page 2026-09-24).
All three are **jednatelé of Weeks s.r.o. and lecturers at once**; the role
label comes from the `jednatel` flag ("Jednatel · lektor" vs "Lektor"), so a
new lecturer who does not run the company is one row with `jednatel: false`.
`foto`, `email` and `telefon` are optional — without a photo the card shows the
field icon, without a contact it shows none. This repo is public: only put in
a contact the person wants public.
1. **Kryštof Ježdík** - Herní vývoj & VR (gamepad icon)
2. **Lukáš Kubík** - Programování & web (code icon)
3. **Štěpán Jurenka** - 3D modelování & tisk (box icon)

**Instructor ratio is no longer promised** (2026-09-24): "1:5" depended on how
many children sign up and how many lecturers a term gets, so the site says
"malé skupinky" + the capacity cap from data instead. Don't bring a fixed ratio
back without the founder confirming it.

## Contact Info

Phone: +420 703 046 440 (confirmed April 2026)
Source of truth: `SITE.phone` in `src/lib/site.ts`. `src/lib/locations.ts` reads it from there for the registration/e-mail flow — the number is written down once.

## DNS Configuration

Domain: weeks.cz (registered at subreg.cz)

```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
TXT   @     google-site-verification=5epLUIbGFT0mcISr7rJZPFLcNlcAIFkQXe5cBY9nSdY
```

## Key Decisions Made (December 2024)

1. **Hero text**: "Přijímáme zájemce" (not "Registrace otevřena")
2. **Instructor ratio**: 1:5 (not 1:8) — superseded 2026-09-24, see "Team (O nás page)"
3. **Price**: 2 990 Kč (updated from 2 490)
4. **CTA wording**: "tábory" (not "běhy")
5. **No "Domů" in nav**: Logo serves as home link (standard UX)
6. **No map marker**: Would require paid Google Maps API
7. **Team icons**: Specialized Lucide icons instead of placeholder photos

## Key Decisions Made (March 2026)

_Historical record. Every decision below is about the product that no longer exists — weekend and one-day formats, `/program`, DDM registration links, the 2 990 Kč / 1 490 Kč prices. Kept to explain why things once looked the way they did; for what is live now see "Product: turnus-based summer camp" above._

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

_Historical record, same as the list above: the `/duben` ad landing page and the DDM registration flow it fed are both gone (`/kveten`, its successor, now redirects to `/tabory`)._

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
5. **Redirects**: old routes (`/program`, `/tabor-*`, `/kveten`, `/karlovy-vary*`) permanently redirect to the camp listing — retargeted from `/tabor` to `/tabory` in phase 6 (see `next.config.js`)
6. **Price/date source of truth**: `src/lib/turnusy.ts` only — see the warning above `TURNUSY` and the guard test in `src/lib/turnusy.test.ts`; the theme's source of truth is `src/lib/tabory.ts` (phase 6)
7. **Camp above turnus (phase 6)**: a theme is its own entity, a turnus points at it through `taborIds` (a list, so a future two-group week needs no migration of `term_id`); the description lives on the theme and only there
8. **Colour carries a role (phase 6)**: amber = action/state, cyan = technology, emerald = a parent's peace of mind, indigo = brand base — see "Design System" above
7. **Share image**: `src/app/opengraph-image.tsx` generates the OG/Twitter preview with `next/og`. The old static `public/og-image-v2.jpg` was deleted — it was publicly reachable at `weeks.cz/og-image-v2.jpg` and still rendered the dead offer („Praha · 10–15 let · Víkendové i jednodenní formáty“, „pořádá DDM Praha 6 ve spolupráci s HWLab“)

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
`/tabor-3d-tisk`, `/tabor-iot`, `/tabor-chytrych-technologii` and — since
phase 6 — the one-page `/tabor` itself. See "Redirects" above.

### When Summer 2027 turnusy are confirmed
- Fill in `start`, `end`, `priceKc` and `venueId` on the turnus in
  `src/lib/turnusy.ts` and flip `status` to `otevreno`.
- `isBookable()` then switches the turnus card from the interest form to a
  real "Přihlásit dítě" registration CTA — no DDM link, no manual step.
- Nothing about the theme changes: `tabory.ts` does not carry dates or prices.

### Ad landing pages
None exist right now. `/kveten` (May 2026, 3D tisk/IoT one-day terms)
permanently redirects to `/tabory` (`next.config.js` `redirects()`). Its
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
