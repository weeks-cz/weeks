# Multi-City Expansion: Praha + Karlovy Vary

**Date:** 2026-04-10
**Status:** Approved
**Scope:** Website visual rework + registration system + mock payment

## Context

Weeks is expanding from Prague-only IT camps to a second city — Karlovy Vary, with potential collaboration with Vary&Te creative center (varyete.cz). This requires:

1. Website adapted for multiple cities
2. Own registration system (KV won't use DDM Praha 6)
3. Payment flow (mock for now, real gateway later)
4. Admin visibility into registrations via weeks-hub (Supabase)

### Key Constraints

- Prague DDM Praha 6 partnership remains unchanged — DDM stays as organizer for Prague events
- KV events organized by Weeks as own entity (exact legal entity TBD)
- Prague URLs must NOT change (SEO preservation)
- KV programs are 1:1 copy of Prague for now (placeholder content)
- Payment gateway is mock/test mode today, replaceable with Stripe/Comgate later
- No admin UI changes in weeks-hub — registrations visible directly in Supabase

## Architecture: Route Groups + Location Config

### Routing

- `weeks.cz/*` → Prague (default, slug: `''`) — all existing URLs preserved
- `weeks.cz/karlovy-vary/*` → Karlovy Vary (slug: `'karlovy-vary'`)
- City switcher in header for easy switching between cities
- Campaign URLs link directly to KV pages (e.g., `weeks.cz/karlovy-vary`)

### Location Config (`src/lib/locations.ts`)

Central configuration file defining everything per city:

```typescript
interface Venue {
  name: string              // 'HWLab Praha' | 'Vary&Te'
  fullName: string          // 'Kongresové centrum Praha' | 'Vary&Te Creative Center'
  address: string
  city: string
  postalCode: string
  geo: { lat: number; lng: number }
  description: string
  transport?: string        // 'Metro C - Vyšehrad' | null
  url?: string              // external website
}

interface Organizer {
  name: string              // 'DDM Praha 6' | 'Weeks'
  fullName: string
  url?: string
}

interface Location {
  id: string                // 'praha' | 'karlovy-vary'
  name: string              // 'Praha' | 'Karlovy Vary'
  slug: string              // '' | 'karlovy-vary'
  isDefault: boolean
  organizer: Organizer
  venues: Venue[]
  registrationType: 'ddm' | 'internal'
  contact: {
    phone: string
    email: string
  }
  seo: {
    titleSuffix: string
    description: string
  }
  programs: ProgramConfig[]
  terms: TermConfig[]
}

interface ProgramConfig {
  id: string                    // 'mix', '3d-tisk', 'iot'
  name: string                  // 'MIX - Tábor chytrých technologií'
  slug: string                  // 'tabor-chytrych-technologii'
  campType: 'weekend' | 'oneday'
  price: number                 // 2990 | 1490
  capacity: number              // 15
  ageRange: string              // '10-15'
}

interface TermConfig {
  id: string                    // 'kv-2026-04-25-3d-tisk'
  program: string               // '3d-tisk'
  startDate: string             // '2026-04-25' ISO date
  endDate: string               // '2026-04-25'
  status: 'confirmed' | 'preparing' | 'cancelled'
  registrationUrl?: string      // DDM URL (only for ddm registrationType)
  ddmId?: string                // DDM event ID
  venue?: string                // venue name override (if different from default)
}
```

### Prague Location

```typescript
{
  id: 'praha',
  name: 'Praha',
  slug: '',
  isDefault: true,
  organizer: { name: 'DDM Praha 6', fullName: 'Dům dětí a mládeže Praha 6', url: 'https://ddmp6.cz' },
  venues: [
    { name: 'HWLab Praha', address: '5. května 11', city: 'Praha 4 - Nusle', postalCode: '140 00', geo: { lat: 50.0621, lng: 14.4285 }, transport: 'Metro C - Vyšehrad' },
    { name: 'DDM Praha 6', address: 'U Boroviček 5', city: 'Praha 6', postalCode: '163 00', geo: { lat: 50.0830, lng: 14.3350 } }
  ],
  registrationType: 'ddm',
  contact: { phone: '+420 703 046 440', email: 'info@weeks.cz' }
}
```

### Karlovy Vary Location

```typescript
{
  id: 'karlovy-vary',
  name: 'Karlovy Vary',
  slug: 'karlovy-vary',
  isDefault: false,
  organizer: { name: 'Weeks', fullName: 'Weeks (právní forma bude upřesněna)' },
  venues: [
    { name: 'Vary&Te', fullName: 'Vary&Te Creative Center', address: 'TBD', city: 'Karlovy Vary', postalCode: 'TBD', geo: { lat: 50.2318, lng: 12.8714 }, url: 'https://varyete.cz' }
  ],
  registrationType: 'internal',
  contact: { phone: '+420 703 046 440', email: 'info@weeks.cz' }
}
```

## Location Context (React)

```typescript
// src/contexts/LocationContext.tsx
const LocationContext = createContext<Location>(LOCATIONS.praha)

export function LocationProvider({ location, children }) {
  return <LocationContext.Provider value={location}>{children}</LocationContext.Provider>
}

export function useLocation() {
  return useContext(LocationContext)
}
```

Set in layout per route group. All location-aware components consume via `useLocation()`.

## Component Rework

### Components that become location-aware

| Component | Prague behavior | KV behavior |
|-----------|----------------|-------------|
| **Header** | As today + city switcher | Same layout, KV active |
| **HeroSection** | "Nově v Praze!" | "Nově v Karlových Varech!" |
| **USPSection** | DDM Praha 6, metro Vyšehrad | Vary&Te, KV-specific |
| **TrustSection** | HWLab + DDM partners | Vary&Te as partner |
| **ContactSection** | 2 Prague venues | Vary&Te venue card |
| **Footer** | DDM + HWLab addresses | Vary&Te address |
| **CTASection** | DDM registration links | "Registrovat dítě" → internal flow |
| **FAQSection** | DDM-specific answers | Weeks-specific answers |
| **StructuredData** | Prague schema.org | KV schema.org |

### Components that stay unchanged

- Design system (colors, fonts, animations)
- ProgramSection layout
- CookieConsent
- MotionProvider

### City Switcher (`CitySwitcher.tsx`)

- Rendered in Header, visually subtle
- Shows current city name with toggle to switch
- On switch: navigates to equivalent page with different prefix
- Example: `/tabor-3d-tisk` ↔ `/karlovy-vary/tabor-3d-tisk`

## KV Pages — Thin Wrappers

KV pages are NOT copies of Prague pages. They are thin routing entry points that reuse shared page components:

```typescript
// src/app/karlovy-vary/tabor-3d-tisk/page.tsx
import { CampPage } from '@/components/pages/CampPage'
import { LOCATIONS } from '@/lib/locations'

export default function KV3DTisk() {
  return <CampPage location={LOCATIONS['karlovy-vary']} program="3d-tisk" />
}
```

Existing Prague pages will be refactored to use the same shared components:

```typescript
// src/app/tabor-3d-tisk/page.tsx (refactored)
import { CampPage } from '@/components/pages/CampPage'
import { LOCATIONS } from '@/lib/locations'

export default function Praha3DTisk() {
  return <CampPage location={LOCATIONS['praha']} program="3d-tisk" />
}
```

## Registration System

### User Flow (KV only — Prague keeps DDM links)

```
1. Parent on /karlovy-vary/tabor-3d-tisk
2. Clicks "Registrovat dítě" on a specific term
3. → /registrace?location=karlovy-vary&program=3d-tisk&term=2026-04-25
4. Multi-step form:
   Step 1: Parent info (name, email, phone, address)
   Step 2: Child info (name, birthdate, insurance, health, experience)
   Step 3: Term confirmation + consents (VOP, GDPR, marketing opt-in)
   Step 4: Summary → submit
5. → /platba/[registrationId] (mock payment page)
6. → /registrace/[id] (confirmation page)
```

### Registration Form Fields

**Parent (zákonný zástupce):**
- `parent_name` — jméno a příjmení (required)
- `parent_email` — email (required)
- `parent_phone` — telefon (required)
- `parent_address` — fakturační adresa (required)

**Child (dítě):**
- `child_name` — jméno a příjmení (required)
- `child_birthdate` — datum narození (required)
- `child_insurance` — zdravotní pojišťovna (required)
- `child_health_notes` — zdravotní omezení, alergie (optional)
- `child_experience` — zkušenosti s technologiemi (optional)

**Consents:**
- `vop_consent` — souhlas s VOP (required)
- `gdpr_consent` — souhlas se zpracováním osobních údajů (required)
- `marketing_consent` — marketingový souhlas (optional)

### Supabase Schema

New table in shared Supabase instance (weeks-hub database):

```sql
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Status workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'cancelled')),

  -- Location & program
  location_id TEXT NOT NULL,          -- 'karlovy-vary'
  program TEXT NOT NULL,              -- '3d-tisk', 'iot', 'mix'
  term_id TEXT NOT NULL,              -- identifier for specific term
  term_start DATE NOT NULL,
  term_end DATE NOT NULL,

  -- Parent info
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_address TEXT NOT NULL,

  -- Child info
  child_name TEXT NOT NULL,
  child_birthdate DATE NOT NULL,
  child_insurance TEXT NOT NULL,
  child_health_notes TEXT,
  child_experience TEXT,

  -- Consents
  vop_consent BOOLEAN NOT NULL DEFAULT FALSE,
  gdpr_consent BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,

  -- Payment
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  payment_method TEXT,
  payment_amount INTEGER,             -- in CZK (integer, no decimals)
  payment_completed_at TIMESTAMPTZ,

  -- Admin
  notes TEXT,
  processed_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_registrations_location ON registrations(location_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_email ON registrations(parent_email);
```

RLS policies:

```sql
-- Public can insert registrations (from weeks.cz website)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create registrations"
  ON registrations FOR INSERT
  WITH CHECK (true);

-- Only authenticated weeks team can read/update
CREATE POLICY "Weeks team can view registrations"
  ON registrations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Weeks team can update registrations"
  ON registrations FOR UPDATE
  USING (auth.role() = 'authenticated');
```

Supabase: Uses the SAME Supabase project as weeks-hub (`qtxiwtinwcagsyhwaeda`). weeks.cz uses the anon key for public inserts, service role key for API routes that need elevated access.

### API Routes

**`POST /api/register`**
- Validates form data
- Creates registration in Supabase (status: pending)
- Returns `{ registrationId, paymentUrl }`

**`POST /api/payment/mock`**
- Accepts `{ registrationId }`
- Updates payment_status to 'completed', status to 'paid'
- Returns `{ success: true, redirectUrl }`

**`GET /api/registration/[id]`**
- Returns registration status for confirmation page
- Public access (by registration UUID — unguessable)

### Mock Payment Page (`/platba/[id]`)

- Looks like a real payment gateway (card number, expiry, CVV fields)
- Prominent "TESTOVACÍ REŽIM" banner
- "Zaplatit [amount] Kč" button → always succeeds
- Redirects to `/registrace/[id]` confirmation
- Later: replace with Stripe Checkout / Comgate redirect (same flow, different provider)

### Confirmation Page (`/registrace/[id]`)

- Shows registration status (pending / paid / confirmed)
- Summary of registration details
- "Děkujeme za registraci" message
- Later: PDF confirmation download, email notification

## File Structure — New & Modified Files

### New Files

```
src/
  lib/
    locations.ts                        # Central location config
    registration.ts                     # Registration validation & helpers
    supabase.ts                         # Supabase client for weeks.cz
  contexts/
    LocationContext.tsx                  # React context
  app/
    karlovy-vary/
      layout.tsx                        # Sets LocationContext to KV
      page.tsx                          # KV homepage
      tabor-chytrych-technologii/
        page.tsx
        layout.tsx                      # SEO metadata
      tabor-3d-tisk/
        page.tsx
        layout.tsx
      tabor-iot/
        page.tsx
        layout.tsx
      kontakt/
        page.tsx
        layout.tsx
    registrace/
      page.tsx                          # Registration form
      [id]/
        page.tsx                        # Confirmation
    platba/
      [id]/
        page.tsx                        # Mock payment
    api/
      register/
        route.ts
      payment/
        mock/
          route.ts
      registration/
        [id]/
          route.ts
  components/
    pages/
      CampPage.tsx                      # Shared camp page component
      HomePage.tsx                      # Shared homepage component
    registration/
      RegistrationForm.tsx              # Multi-step form
      PaymentMock.tsx                   # Mock gateway UI
      RegistrationConfirmation.tsx      # Confirmation UI
    ui/
      CitySwitcher.tsx                  # Header city toggle
```

### Modified Files (refactor to location-aware)

```
src/
  app/
    layout.tsx                          # + Supabase env, default location
    page.tsx                            # Refactor to use shared HomePage
    tabor-3d-tisk/page.tsx              # Thin wrapper using CampPage
    tabor-iot/page.tsx                  # Thin wrapper using CampPage
    tabor-chytrych-technologii/page.tsx # Thin wrapper using CampPage
  components/
    layout/
      Header.tsx                        # + CitySwitcher
      Footer.tsx                        # Dynamic per location
    sections/
      HeroSection.tsx                   # location prop
      USPSection.tsx                    # location prop
      TrustSection.tsx                  # location prop
      ContactSection.tsx                # location prop
      CTASection.tsx                    # DDM links vs internal registration
      FAQSection.tsx                    # location-aware answers
    seo/
      StructuredData.tsx                # Multi-location schemas
```

## SEO & Sitemap

- `sitemap.ts` updated to generate URLs for both Prague and KV
- Prague pages: canonical at `weeks.cz/*` (no prefix, unchanged)
- KV pages: canonical at `weeks.cz/karlovy-vary/*`
- Each city generates its own structured data (schema.org) with correct addresses and geo
- All dates use Europe/Prague timezone

## City Switcher Navigation

- Maps equivalent pages between cities: `/tabor-3d-tisk` ↔ `/karlovy-vary/tabor-3d-tisk`
- If target page doesn't exist in selected city → redirect to city homepage
- Available page mapping defined in locations config

## Prague Route Preservation

Prague pages stay at ROOT level (`/tabor-3d-tisk`, NOT `/(praha)/tabor-3d-tisk`). This preserves all existing URLs, SEO rankings, and backlinks. No route group wrapper for Prague — only KV gets a prefix. This is an intentional asymmetry for SEO preservation.

## Analytics

- GA4 tracks `location` as custom event parameter on all events
- Enables filtering Prague vs KV traffic in GA4 reports
- Registration events include location_id

## Out of Scope

- Real payment gateway (Stripe/Comgate) — mock only
- Automated email notifications after registration
- Invoice/receipt generation
- Admin UI for registrations in weeks-hub (data visible in Supabase directly)
- Sanity CMS migration
- Mobile app
- Additional cities beyond Praha + KV
- Changes to existing Prague DDM registration flow

## Open Decisions (non-blocking for implementation)

- KV organizer legal entity name — placeholder "Weeks" used until finalized
- Vary&Te exact address and GPS — placeholder values, update when confirmed
- Prague waitlist future — stays on Formspree/DDM for now, potential migration to Supabase later
- Real payment gateway provider (Stripe vs Comgate) — decided when ready for production payments
