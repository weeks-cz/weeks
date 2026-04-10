# Multi-City Expansion Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand weeks.cz from Prague-only to multi-city (Praha + Karlovy Vary) with location-aware components, own registration system for KV, and mock payment gateway.

**Architecture:** Path-based routing — Prague stays at root (`/`), KV at `/karlovy-vary/*`. Central `locations.ts` config drives all location-specific content. React Context propagates location to components. Registration system writes to shared Supabase (weeks-hub) database. Mock payment simulates real gateway flow.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion, Supabase (@supabase/supabase-js — new dependency), Zod (new — form validation)

**Spec:** `docs/superpowers/specs/2026-04-10-multi-city-expansion-design.md`

---

## File Map

### New Files
| File | Responsibility |
|------|---------------|
| `src/lib/locations.ts` | Central location config (venues, organizers, programs, terms) |
| `src/lib/supabase.ts` | Supabase browser + server clients for weeks.cz |
| `src/lib/registration.ts` | Registration validation (Zod schemas) + helpers |
| `src/contexts/LocationContext.tsx` | React context for current city |
| `src/components/ui/CitySwitcher.tsx` | Header city toggle component |
| `src/components/registration/RegistrationForm.tsx` | Multi-step registration form |
| `src/components/registration/PaymentMock.tsx` | Mock payment gateway UI |
| `src/components/registration/RegistrationConfirmation.tsx` | Post-payment confirmation |
| `src/app/karlovy-vary/layout.tsx` | KV route layout (sets LocationContext) |
| `src/app/karlovy-vary/page.tsx` | KV homepage |
| `src/app/karlovy-vary/tabor-3d-tisk/page.tsx` | KV 3D tisk camp page |
| `src/app/karlovy-vary/tabor-3d-tisk/layout.tsx` | KV 3D tisk SEO metadata |
| `src/app/karlovy-vary/tabor-iot/page.tsx` | KV IoT camp page |
| `src/app/karlovy-vary/tabor-iot/layout.tsx` | KV IoT SEO metadata |
| `src/app/karlovy-vary/tabor-chytrych-technologii/page.tsx` | KV MIX camp page |
| `src/app/karlovy-vary/tabor-chytrych-technologii/layout.tsx` | KV MIX SEO metadata |
| `src/app/karlovy-vary/kontakt/page.tsx` | KV contact page |
| `src/app/karlovy-vary/kontakt/layout.tsx` | KV contact SEO metadata |
| `src/app/registrace/page.tsx` | Registration form page |
| `src/app/registrace/[id]/page.tsx` | Registration confirmation page |
| `src/app/platba/[id]/page.tsx` | Mock payment page |
| `src/app/api/register/route.ts` | POST registration API |
| `src/app/api/payment/mock/route.ts` | POST mock payment API |
| `src/app/api/registration/[id]/route.ts` | GET registration status API |
| `supabase/migrations/009_registrations.sql` | Registrations table + RLS |

### Modified Files
| File | Changes |
|------|---------|
| `package.json` | Add @supabase/supabase-js, zod |
| `src/app/layout.tsx` | Remove hardcoded Praha from metadata, make dynamic |
| `src/app/page.tsx` | Wrap with LocationProvider (Praha default) |
| `src/app/sitemap.ts` | Add KV URLs |
| `src/components/layout/Header.tsx` | Add CitySwitcher |
| `src/components/layout/Footer.tsx` | Make location-aware |
| `src/components/sections/HeroSection.tsx` | Make location-aware |
| `src/components/sections/USPSection.tsx` | Make location-aware |
| `src/components/sections/TrustSection.tsx` | Make location-aware |
| `src/components/sections/ContactSection.tsx` | Make location-aware |
| `src/components/sections/CTASection.tsx` | Add internal registration CTA for KV |
| `src/components/sections/FAQSection.tsx` | Make location-aware |
| `src/components/seo/StructuredData.tsx` | Multi-location schema.org |
| `src/lib/analytics.ts` | Add location param to events |

---

## Task 1: Install Dependencies + Location Config

**Files:**
- Modify: `package.json`
- Create: `src/lib/locations.ts`
- Create: `src/contexts/LocationContext.tsx`

- [ ] **Step 1: Install new dependencies**

```bash
cd C:/Users/lukol/Downloads/weeks_web && npm install @supabase/supabase-js zod
```

- [ ] **Step 2: Create `src/lib/locations.ts`**

Central config file with all location data. This is the single source of truth for all city-specific content.

```typescript
// Types
export interface Venue {
  name: string
  fullName: string
  address: string
  city: string
  postalCode: string
  geo: { lat: number; lng: number }
  description: string
  transport?: string
  url?: string
  mapQuery?: string
}

export interface Organizer {
  name: string
  fullName: string
  url?: string
}

export interface ProgramConfig {
  id: string
  name: string
  slug: string
  campType: 'weekend' | 'oneday'
  price: number
  capacity: number
  ageRange: string
  color: string       // tailwind color prefix: 'primary', 'trust', 'accent'
}

export interface TermConfig {
  id: string
  program: string
  startDate: string
  endDate: string
  day: string          // 'sobota' | 'neděle'
  status: 'confirmed' | 'preparing' | 'cancelled'
  registrationUrl?: string
  ddmId?: string
  venue?: string
}

export interface Location {
  id: string
  name: string
  slug: string
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
  hero: {
    badge: string
    subtitle: string
  }
  usps: {
    organizer: { title: string; description: string }
    location: { title: string; description: string }
  }
  faq: {
    locationAnswer: string
    organizerAnswer: string
  }
  // Pages available in this location (for city switcher)
  availablePages: string[]
}

// Shared programs (same for both cities for now)
const SHARED_PROGRAMS: ProgramConfig[] = [
  { id: 'mix', name: 'MIX - Tábor chytrých technologií', slug: 'tabor-chytrych-technologii', campType: 'weekend', price: 2990, capacity: 15, ageRange: '10-15', color: 'primary' },
  { id: '3d-tisk', name: '3D tisk', slug: 'tabor-3d-tisk', campType: 'oneday', price: 1490, capacity: 15, ageRange: '10-15', color: 'primary' },
  { id: 'iot', name: 'IoT & elektronika', slug: 'tabor-iot', campType: 'oneday', price: 1490, capacity: 15, ageRange: '10-15', color: 'trust' },
]

const AVAILABLE_PAGES = [
  '',
  'tabor-chytrych-technologii',
  'tabor-3d-tisk',
  'tabor-iot',
  'kontakt',
]

export const LOCATIONS: Record<string, Location> = {
  'praha': {
    id: 'praha',
    name: 'Praha',
    slug: '',
    isDefault: true,
    organizer: {
      name: 'DDM Praha 6',
      fullName: 'Dům dětí a mládeže Praha 6',
      url: 'https://ddmp6.cz',
    },
    venues: [
      {
        name: 'HWLab Praha',
        fullName: 'Kongresové centrum Praha',
        address: '5. května 11',
        city: 'Praha 4 - Nusle',
        postalCode: '140 00',
        geo: { lat: 50.0621, lng: 14.4285 },
        description: 'Moderní technologické centrum v Kongresovém centru Praha s profesionálním vybavením pro 3D tisk, VR a programování.',
        transport: 'Metro C - Vyšehrad (5 min pěšky)',
        mapQuery: 'HWLab+Praha,+5.+května+11,+Praha+4',
      },
      {
        name: 'DDM Praha 6',
        fullName: 'DDM Praha 6 – Bílá hora',
        address: 'U Boroviček 5',
        city: 'Praha 6',
        postalCode: '163 00',
        geo: { lat: 50.0830, lng: 14.3350 },
        description: 'Dům dětí a mládeže Praha 6 s více než 70 lety zkušeností v práci s dětmi a mládeží.',
        mapQuery: 'DDM+Praha+6,+U+Boroviček+5,+Praha+6',
      },
    ],
    registrationType: 'ddm',
    contact: { phone: '+420 703 046 440', email: 'info@weeks.cz' },
    seo: {
      titleSuffix: 'Praha',
      description: 'Víkendové a jednodenní IT kempy pro děti 10-15 let v Praze. 3D tisk, IoT, programování a virtuální realita v profesionálním prostředí HWLab.',
    },
    programs: SHARED_PROGRAMS,
    terms: [
      // Prague terms managed by DDM — kept here for reference, actual data from camp pages
    ],
    hero: {
      badge: 'Nově v Praze!',
      subtitle: 'Víkendové i jednodenní formáty v Praze — 3D tisk, IoT, programování a virtuální realita pro děti 10–15 let.',
    },
    usps: {
      organizer: {
        title: 'Organizováno DDM Praha 6',
        description: 'Záštitu nad kempy drží DDM Praha 6. Garantujeme bezpečnost a kvalitu s více než 70 lety zkušeností v práci s dětmi.',
      },
      location: {
        title: 'Metro až ke dveřím',
        description: 'Kongresové centrum Praha — 5 minut pěšky od metra Vyšehrad. Snadný přístup z celé Prahy.',
      },
    },
    faq: {
      locationAnswer: 'Kempy probíhají v HWLab Praha (Kongresové centrum Praha, 5. května 11, Praha 4) a DDM Praha 6 (U Boroviček 5, Praha 6). HWLab je 5 minut pěšky od metra Vyšehrad.',
      organizerAnswer: 'Kempy organizuje DDM Praha 6 (Dům dětí a mládeže Praha 6), pod jehož záštitou projekt Weeks funguje.',
    },
    availablePages: AVAILABLE_PAGES,
  },

  'karlovy-vary': {
    id: 'karlovy-vary',
    name: 'Karlovy Vary',
    slug: 'karlovy-vary',
    isDefault: false,
    organizer: {
      name: 'Weeks',
      fullName: 'Weeks',
    },
    venues: [
      {
        name: 'Vary&Te',
        fullName: 'Vary&Te Creative Center',
        address: 'Karlovy Vary',
        city: 'Karlovy Vary',
        postalCode: '360 01',
        geo: { lat: 50.2318, lng: 12.8714 },
        description: 'Největší kreativní centrum v Karlovarském kraji s FabLabem, GameDev arenou a profesionálními vzdělávacími prostory.',
        url: 'https://varyete.cz',
        mapQuery: 'Vary&Te+Karlovy+Vary',
      },
    ],
    registrationType: 'internal',
    contact: { phone: '+420 703 046 440', email: 'info@weeks.cz' },
    seo: {
      titleSuffix: 'Karlovy Vary',
      description: 'IT kempy pro děti 10-15 let v Karlových Varech. 3D tisk, IoT, programování a virtuální realita ve Vary&Te Creative Center.',
    },
    programs: SHARED_PROGRAMS,
    terms: [
      // KV terms — placeholder, will be filled when confirmed
      { id: 'kv-2026-05-10-3d-tisk', program: '3d-tisk', startDate: '2026-05-10', endDate: '2026-05-10', day: 'sobota', status: 'preparing' as const },
      { id: 'kv-2026-05-11-iot', program: 'iot', startDate: '2026-05-11', endDate: '2026-05-11', day: 'neděle', status: 'preparing' as const },
      { id: 'kv-2026-05-17-mix', program: 'mix', startDate: '2026-05-17', endDate: '2026-05-18', day: 'sobota', status: 'preparing' as const },
    ],
    hero: {
      badge: 'Nově v Karlových Varech!',
      subtitle: 'Víkendové i jednodenní formáty v Karlových Varech — 3D tisk, IoT, programování a virtuální realita pro děti 10–15 let.',
    },
    usps: {
      organizer: {
        title: 'Organizováno Weeks',
        description: 'Kempy organizuje tým Weeks s důrazem na kvalitu výuky, bezpečnost dětí a profesionální přístup.',
      },
      location: {
        title: 'Vary&Te Creative Center',
        description: 'Největší kreativní centrum v Karlovarském kraji — FabLab, GameDev arena a moderní vzdělávací prostory.',
      },
    },
    faq: {
      locationAnswer: 'Kempy probíhají ve Vary&Te Creative Center v Karlových Varech — největším kreativním centru v Karlovarském kraji s profesionálním FabLabem a GameDev arenou.',
      organizerAnswer: 'Kempy v Karlových Varech organizuje přímo tým Weeks ve spolupráci s Vary&Te Creative Center.',
    },
    availablePages: AVAILABLE_PAGES,
  },
}

export const DEFAULT_LOCATION = LOCATIONS['praha']

export function getLocationBySlug(slug: string): Location {
  if (!slug || slug === '') return DEFAULT_LOCATION
  return LOCATIONS[slug] || DEFAULT_LOCATION
}

export function getLocationById(id: string): Location {
  return LOCATIONS[id] || DEFAULT_LOCATION
}

export function getAllLocations(): Location[] {
  return Object.values(LOCATIONS)
}

export function buildPath(location: Location, page: string): string {
  if (location.isDefault) return `/${page}`
  return `/${location.slug}/${page}`
}

export function getEquivalentPath(currentPath: string, targetLocation: Location): string {
  // Strip current location prefix
  let page = currentPath.replace(/^\//, '')
  for (const loc of getAllLocations()) {
    if (loc.slug && page.startsWith(loc.slug + '/')) {
      page = page.slice(loc.slug.length + 1)
      break
    } else if (loc.slug && page === loc.slug) {
      page = ''
      break
    }
  }
  // Check if target location has this page
  if (!targetLocation.availablePages.includes(page)) {
    page = '' // fallback to homepage
  }
  return buildPath(targetLocation, page)
}
```

- [ ] **Step 3: Create `src/contexts/LocationContext.tsx`**

```typescript
'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { type Location, DEFAULT_LOCATION } from '@/lib/locations'

const LocationContext = createContext<Location>(DEFAULT_LOCATION)

export function LocationProvider({ location, children }: { location: Location; children: ReactNode }) {
  return <LocationContext.Provider value={location}>{children}</LocationContext.Provider>
}

export function useLocation(): Location {
  return useContext(LocationContext)
}
```

- [ ] **Step 4: Verify build compiles**

```bash
cd C:/Users/lukol/Downloads/weeks_web && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/locations.ts src/contexts/LocationContext.tsx package.json package-lock.json
git commit -m "feat: add location config and context for multi-city support"
```

---

## Task 2: Supabase Client + Registration Schema

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/lib/registration.ts`
- Create: `supabase/migrations/009_registrations.sql`

- [ ] **Step 1: Create `src/lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client (for client components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client (for API routes — uses service role for elevated access)
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceRoleKey)
}
```

- [ ] **Step 2: Create `src/lib/registration.ts`**

Zod validation schemas for registration form:

```typescript
import { z } from 'zod'

export const parentSchema = z.object({
  parent_name: z.string().min(3, 'Jméno musí mít alespoň 3 znaky'),
  parent_email: z.string().email('Zadejte platný e-mail'),
  parent_phone: z.string().regex(/^\+?[0-9\s]{9,15}$/, 'Zadejte platné telefonní číslo'),
  parent_address: z.string().min(10, 'Zadejte úplnou adresu'),
})

export const childSchema = z.object({
  child_name: z.string().min(3, 'Jméno musí mít alespoň 3 znaky'),
  child_birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Zadejte datum ve formátu RRRR-MM-DD'),
  child_insurance: z.string().min(2, 'Zadejte zdravotní pojišťovnu'),
  child_health_notes: z.string().optional().default(''),
  child_experience: z.string().optional().default(''),
})

export const consentsSchema = z.object({
  vop_consent: z.literal(true, { errorMap: () => ({ message: 'Musíte souhlasit s VOP' }) }),
  gdpr_consent: z.literal(true, { errorMap: () => ({ message: 'Musíte souhlasit se zpracováním osobních údajů' }) }),
  marketing_consent: z.boolean().default(false),
})

export const registrationSchema = parentSchema.merge(childSchema).merge(consentsSchema).extend({
  location_id: z.string(),
  program: z.string(),
  term_id: z.string(),
  term_start: z.string(),
  term_end: z.string(),
  payment_amount: z.number(),
})

export type RegistrationData = z.infer<typeof registrationSchema>

export const INSURANCE_OPTIONS = [
  'VZP (111)',
  'VoZP (201)',
  'ČPZP (205)',
  'OZP (207)',
  'ZPŠ (209)',
  'ZPMV (211)',
  'RBP (213)',
] as const
```

- [ ] **Step 3: Create `supabase/migrations/009_registrations.sql`**

```sql
-- Registration system for internal (non-DDM) camp registrations
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Status workflow: pending → paid → confirmed → cancelled
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'cancelled')),

  -- Location & program
  location_id TEXT NOT NULL,
  program TEXT NOT NULL,
  term_id TEXT NOT NULL,
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
  payment_amount INTEGER,
  payment_completed_at TIMESTAMPTZ,

  -- Admin
  notes TEXT,
  processed_by UUID
);

-- Indexes
CREATE INDEX idx_registrations_location ON registrations(location_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_email ON registrations(parent_email);
CREATE INDEX idx_registrations_term ON registrations(term_id);

-- RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public registration from website)
CREATE POLICY "Anyone can create registrations"
  ON registrations FOR INSERT
  WITH CHECK (true);

-- Anyone can read their own registration (by UUID — unguessable)
CREATE POLICY "Anyone can read registration by id"
  ON registrations FOR SELECT
  USING (true);

-- Authenticated users (weeks team) can update
CREATE POLICY "Authenticated users can update registrations"
  ON registrations FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_registrations_updated_at();
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase.ts src/lib/registration.ts supabase/migrations/009_registrations.sql
git commit -m "feat: add Supabase client, registration validation, and DB migration"
```

---

## Task 3: CitySwitcher Component + Header Integration

**Files:**
- Create: `src/components/ui/CitySwitcher.tsx`
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Create `src/components/ui/CitySwitcher.tsx`**

A subtle toggle in the header. Shows current city with dropdown to switch.

```typescript
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'
import { getAllLocations, getEquivalentPath, type Location } from '@/lib/locations'
import { useLocation } from '@/contexts/LocationContext'

export function CitySwitcher() {
  const location = useLocation()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const allLocations = getAllLocations()

  function handleSwitch(target: Location) {
    const newPath = getEquivalentPath(pathname, target)
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-full border border-slate-200 hover:border-primary-300 transition-colors bg-white/80 backdrop-blur-sm"
        aria-label={`Město: ${location.name}. Klikněte pro změnu.`}
      >
        <MapPin className="w-3.5 h-3.5" />
        <span>{location.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-1 right-0 z-50 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[160px]">
            {allLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSwitch(loc)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                  loc.id === location.id ? 'text-primary-600 font-medium bg-primary-50' : 'text-slate-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                {loc.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add CitySwitcher to Header.tsx**

In `src/components/layout/Header.tsx`, add the CitySwitcher import and render it in the header bar.

Add import at top:
```typescript
import { CitySwitcher } from '@/components/ui/CitySwitcher'
```

Insert CitySwitcher in the desktop nav area — before the CTA button, after the nav links. Find the CTA button area in the desktop section and add `<CitySwitcher />` before it.

Also add it in the mobile menu section, before the mobile CTA.

- [ ] **Step 3: Test visually**

```bash
cd C:/Users/lukol/Downloads/weeks_web && npm run dev
```

Open http://localhost:3000 — verify city switcher appears in header. Click it and verify dropdown shows Praha + Karlovy Vary. (KV links won't work yet.)

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/CitySwitcher.tsx src/components/layout/Header.tsx
git commit -m "feat: add city switcher to header"
```

---

## Task 4: Refactor Sections to be Location-Aware

This is the largest task. Each section component needs to read location from context and render appropriate content.

**Files:**
- Modify: `src/app/page.tsx` — wrap with LocationProvider
- Modify: `src/components/sections/HeroSection.tsx`
- Modify: `src/components/sections/USPSection.tsx`
- Modify: `src/components/sections/TrustSection.tsx`
- Modify: `src/components/sections/ContactSection.tsx`
- Modify: `src/components/sections/FAQSection.tsx`
- Modify: `src/components/sections/CTASection.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/seo/StructuredData.tsx`

### General pattern for each component:

1. Add `'use client'` if not already present (needed for useLocation hook)
2. Import `useLocation` from `@/contexts/LocationContext`
3. Get `const location = useLocation()` at top of component
4. Replace hardcoded Prague text with `location.xxx` values

- [ ] **Step 1: Wrap homepage with LocationProvider**

In `src/app/page.tsx`, wrap the content with LocationProvider (Praha default):

```typescript
import { LocationProvider } from '@/contexts/LocationContext'
import { LOCATIONS } from '@/lib/locations'
```

Wrap the component's return JSX with:
```tsx
<LocationProvider location={LOCATIONS['praha']}>
  {/* existing content */}
</LocationProvider>
```

- [ ] **Step 2: Refactor HeroSection.tsx**

Replace hardcoded badge and subtitle:
- Line 38: `"Nově v Praze!"` → `location.hero.badge`
- Lines 64-65: subtitle → `location.hero.subtitle`
- Line 107: `"DDM Praha 6"` → `location.organizer.name`
- Line 117: `"Praha 4 & Praha 6"` → derive from `location.venues`

Add import for `useLocation`, call `const location = useLocation()` in component body.

- [ ] **Step 3: Refactor USPSection.tsx**

Replace:
- Line 24: `"Organizováno DDM Praha 6"` → `location.usps.organizer.title`
- Line 25: DDM description → `location.usps.organizer.description`
- Line 35: Metro/location → `location.usps.location.title` and `.description`

- [ ] **Step 4: Refactor TrustSection.tsx**

This section shows partner cards (DDM + HWLab for Praha, Vary&Te for KV).
Replace the hardcoded partner grid (lines 66-140) with dynamic rendering from `location.venues` and `location.organizer`.

For Praha: show DDM + HWLab cards (as today)
For KV: show Vary&Te card

- [ ] **Step 5: Refactor ContactSection.tsx**

Replace hardcoded venue cards with dynamic list from `location.venues`.
- Line 86 phone number → `location.contact.phone`
- Lines 101-103 DDM organizer → `location.organizer.name`/`.fullName`
- Lines 124-152 venue cards → map `location.venues`

- [ ] **Step 6: Refactor FAQSection.tsx**

Replace location-specific FAQ answers:
- Line 25: DDM Praha 6 reference → `location.faq.organizerAnswer`
- Line 35: Kongresové centrum/metro reference → `location.faq.locationAnswer`

- [ ] **Step 7: Refactor CTASection.tsx**

For camps with `registrationType: 'internal'`:
- Show "Registrovat dítě" button linking to `/registrace?location=XX&program=YY`
- For `registrationType: 'ddm'`: keep current DDM links

Add `useLocation()` and conditionally render CTA based on `location.registrationType`.

- [ ] **Step 8: Refactor Footer.tsx**

Replace:
- Line 31: HWLab description → first venue from `location.venues[0].description` (shortened)
- Lines 35-39: badges → `location.organizer.name` + venue names
- Lines 109-118: venue addresses → map `location.venues`
- Line 139: organizer text → `location.organizer.name`

- [ ] **Step 9: Refactor StructuredData.tsx**

Make all three schemas (Organization, LocalBusiness, Event) dynamic based on location prop.
The component should accept a `location` prop (not use context, since it's in layout.tsx which is a server component).

- [ ] **Step 10: Verify Praha renders identically**

```bash
cd C:/Users/lukol/Downloads/weeks_web && npm run dev
```

Compare pages visually against current production. Praha should look exactly the same.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "refactor: make all sections location-aware for multi-city support"
```

---

## Task 5: KV Route Group + Pages

**Files:**
- Create: `src/app/karlovy-vary/layout.tsx`
- Create: `src/app/karlovy-vary/page.tsx`
- Create: `src/app/karlovy-vary/tabor-3d-tisk/page.tsx`
- Create: `src/app/karlovy-vary/tabor-3d-tisk/layout.tsx`
- Create: `src/app/karlovy-vary/tabor-iot/page.tsx`
- Create: `src/app/karlovy-vary/tabor-iot/layout.tsx`
- Create: `src/app/karlovy-vary/tabor-chytrych-technologii/page.tsx`
- Create: `src/app/karlovy-vary/tabor-chytrych-technologii/layout.tsx`
- Create: `src/app/karlovy-vary/kontakt/page.tsx`
- Create: `src/app/karlovy-vary/kontakt/layout.tsx`

- [ ] **Step 1: Create KV layout**

`src/app/karlovy-vary/layout.tsx`:
```typescript
import { LocationProvider } from '@/contexts/LocationContext'
import { LOCATIONS } from '@/lib/locations'

export default function KarlovyVaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider location={LOCATIONS['karlovy-vary']}>
      {children}
    </LocationProvider>
  )
}
```

- [ ] **Step 2: Create KV homepage**

`src/app/karlovy-vary/page.tsx` — same section structure as Praha homepage but wrapped in KV context (from layout). Import and render all sections:

```typescript
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ProgramSection from '@/components/sections/ProgramSection'
import USPSection from '@/components/sections/USPSection'
import TrustSection from '@/components/sections/TrustSection'
import FAQSection from '@/components/sections/FAQSection'
import ContactSection from '@/components/sections/ContactSection'

export default function KarlovyVaryHome() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProgramSection />
        <USPSection />
        <TrustSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
```

Note: SummerBanner and UpcomingTermsSection are Praha-specific (DDM terms). KV homepage omits these for now since KV terms are all "preparing".

- [ ] **Step 3: Create KV camp pages (thin wrappers)**

Each KV camp page renders the same content as its Praha equivalent but in KV context. Since the actual camp page components are currently full page.tsx files (not extracted), for now the KV pages import from Praha and re-render with KV-specific overrides.

Approach: Create simplified camp pages for KV that show program info + KV terms. These use the location context for venue/organizer info and show the KV terms from `locations.ts`.

Create each KV camp page:

**`src/app/karlovy-vary/tabor-3d-tisk/page.tsx`** — simplified camp page showing:
- Program description (same as Praha)
- KV venue (Vary&Te)
- KV terms (from locations.ts, status: preparing)
- Registration CTA (internal flow → /registrace)

**`src/app/karlovy-vary/tabor-iot/page.tsx`** — same pattern for IoT

**`src/app/karlovy-vary/tabor-chytrych-technologii/page.tsx`** — same pattern for MIX

Each page includes Header + Footer (which read from LocationContext set by the KV layout).

- [ ] **Step 4: Create KV layout metadata files**

Each camp page needs a `layout.tsx` with SEO metadata. Pattern:

```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jednodenní tábor 3D tisku pro děti | Weeks Karlovy Vary',
  description: 'Jednodenní tábor 3D tisku pro děti 10-15 let v Karlových Varech. Vary&Te Creative Center. Organizátor: Weeks.',
  alternates: { canonical: 'https://weeks.cz/karlovy-vary/tabor-3d-tisk' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
```

Create for: tabor-3d-tisk, tabor-iot, tabor-chytrych-technologii, kontakt.

- [ ] **Step 5: Create KV kontakt page**

`src/app/karlovy-vary/kontakt/page.tsx` — contact page showing Vary&Te venue, Weeks contact info. Simplified version of Praha kontakt, using location context.

- [ ] **Step 6: Test KV pages**

```bash
cd C:/Users/lukol/Downloads/weeks_web && npm run dev
```

Navigate to:
- http://localhost:3000/karlovy-vary — KV homepage
- http://localhost:3000/karlovy-vary/tabor-3d-tisk — KV 3D tisk
- http://localhost:3000/karlovy-vary/tabor-iot — KV IoT
- http://localhost:3000/karlovy-vary/kontakt — KV kontakt

Verify: city switcher shows "Karlovy Vary" as active. Content references Vary&Te, Weeks organizer. No DDM/HWLab references.

Test switching: click city switcher → Praha → verify it navigates to equivalent Praha page.

- [ ] **Step 7: Commit**

```bash
git add src/app/karlovy-vary/
git commit -m "feat: add Karlovy Vary pages with location-aware content"
```

---

## Task 6: Update Root Layout Metadata + Sitemap

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/lib/analytics.ts`

- [ ] **Step 1: Update root layout.tsx metadata**

Make metadata less Prague-specific. The root layout metadata should be generic (not city-specific). City-specific SEO is handled by each city's layout.tsx.

Changes:
- Line 27: `siteTitle` → `'Weeks - IT tábory pro děti'` (remove "| Praha")
- Line 28: `siteDescription` → generic description covering both cities
- Line 44: `creator` → `'Weeks'` (not DDM Praha 6 — Weeks is the brand)
- Line 45: `publisher` → `'Weeks'`
- Line 61: OG image alt → remove "v Praze"

- [ ] **Step 2: Update sitemap.ts**

Add KV URLs to sitemap:

```typescript
// After existing Prague entries, add KV entries:
{
  url: `${baseUrl}/karlovy-vary`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.9,
},
{
  url: `${baseUrl}/karlovy-vary/tabor-3d-tisk`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.8,
},
{
  url: `${baseUrl}/karlovy-vary/tabor-iot`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.8,
},
{
  url: `${baseUrl}/karlovy-vary/tabor-chytrych-technologii`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.8,
},
{
  url: `${baseUrl}/karlovy-vary/kontakt`,
  lastModified: new Date(),
  changeFrequency: 'monthly' as const,
  priority: 0.6,
},
```

- [ ] **Step 3: Add location to analytics events**

In `src/lib/analytics.ts`, update tracking functions to include `location` parameter:

Add to `sendGAEvent` calls a `location` property. Update `trackRegistrationClick`, `trackInterestSubmit`, etc. to accept optional `locationId` parameter and pass it as event param.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/sitemap.ts src/lib/analytics.ts
git commit -m "feat: update root metadata, sitemap, and analytics for multi-city"
```

---

## Task 7: Registration API Routes

**Files:**
- Create: `src/app/api/register/route.ts`
- Create: `src/app/api/payment/mock/route.ts`
- Create: `src/app/api/registration/[id]/route.ts`

- [ ] **Step 1: Create POST /api/register**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { registrationSchema } from '@/lib/registration'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('registrations')
      .insert({
        ...parsed.data,
        status: 'pending',
        payment_status: 'pending',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Registration insert error:', error)
      return NextResponse.json({ error: 'Failed to create registration' }, { status: 500 })
    }

    return NextResponse.json({
      registrationId: data.id,
      paymentUrl: `/platba/${data.id}`,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
```

- [ ] **Step 2: Create POST /api/payment/mock**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { registrationId } = await request.json()

    if (!registrationId) {
      return NextResponse.json({ error: 'Missing registrationId' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Simulate payment processing delay
    const { error } = await supabase
      .from('registrations')
      .update({
        payment_status: 'completed',
        payment_method: 'mock_card',
        payment_completed_at: new Date().toISOString(),
        status: 'paid',
      })
      .eq('id', registrationId)

    if (error) {
      console.error('Payment update error:', error)
      return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      redirectUrl: `/registrace/${registrationId}`,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
```

- [ ] **Step 3: Create GET /api/registration/[id]**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
  }

  return NextResponse.json({ registration: data })
}
```

- [ ] **Step 4: Verify API compiles**

```bash
cd C:/Users/lukol/Downloads/weeks_web && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/register/ src/app/api/payment/ src/app/api/registration/
git commit -m "feat: add registration, payment, and status API routes"
```

---

## Task 8: Registration Form UI

**Files:**
- Create: `src/components/registration/RegistrationForm.tsx`
- Create: `src/app/registrace/page.tsx`

- [ ] **Step 1: Create RegistrationForm component**

Multi-step form with 4 steps: Parent → Child → Consents → Summary.

`src/components/registration/RegistrationForm.tsx`:

This is a client component (`'use client'`) with:
- State for current step (1-4)
- Form data state matching `RegistrationData` type
- Per-step validation using Zod schemas (parentSchema, childSchema, consentsSchema)
- Navigation buttons (Zpět / Další / Odeslat)
- On submit: POST to /api/register → redirect to /platba/[id]
- Visual step indicator at top
- Tailwind styling consistent with existing design system (using `btn-primary`, card styles, etc.)

Key UI elements per step:
- Step 1 (Zákonný zástupce): name, email, phone, address inputs
- Step 2 (Dítě): name, birthdate (date input), insurance (select from INSURANCE_OPTIONS), health notes (textarea), experience (textarea)
- Step 3 (Souhlasy): VOP checkbox with link, GDPR checkbox with link, marketing checkbox
- Step 4 (Shrnutí): read-only summary of all data, "Přejít k platbě" button

Pre-fill location, program, term from URL search params.

- [ ] **Step 2: Create registration page**

`src/app/registrace/page.tsx`:

```typescript
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { RegistrationForm } from '@/components/registration/RegistrationForm'
import { LocationProvider } from '@/contexts/LocationContext'
import { getLocationById, DEFAULT_LOCATION } from '@/lib/locations'

export const metadata = {
  title: 'Registrace na tábor | Weeks',
  description: 'Zaregistrujte své dítě na IT tábor Weeks.',
  robots: 'noindex, nofollow',
}

export default function RegistracePage() {
  return (
    <LocationProvider location={DEFAULT_LOCATION}>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="section-container section-padding">
          <Suspense fallback={<div className="text-center py-12">Načítání...</div>}>
            <RegistrationForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </LocationProvider>
  )
}
```

Note: The RegistrationForm itself reads location from URL params (not context), since the registration page serves all cities.

- [ ] **Step 3: Test form flow**

```bash
cd C:/Users/lukol/Downloads/weeks_web && npm run dev
```

Navigate to: http://localhost:3000/registrace?location=karlovy-vary&program=3d-tisk&term=kv-2026-05-10-3d-tisk

Verify:
- Step indicator shows 4 steps
- Step 1: parent fields render, validation works
- Step 2: child fields, insurance dropdown
- Step 3: checkboxes with links
- Step 4: summary with all data
- Submit: POST to /api/register (will fail without Supabase env — expected)

- [ ] **Step 4: Commit**

```bash
git add src/components/registration/RegistrationForm.tsx src/app/registrace/
git commit -m "feat: add multi-step registration form"
```

---

## Task 9: Mock Payment Page

**Files:**
- Create: `src/components/registration/PaymentMock.tsx`
- Create: `src/app/platba/[id]/page.tsx`

- [ ] **Step 1: Create PaymentMock component**

`src/components/registration/PaymentMock.tsx`:

Client component that renders a payment form resembling a real gateway:
- "TESTOVACÍ REŽIM" banner at top (amber/warning colors)
- Card number input (accepts any 16 digits)
- Expiry date input (MM/YY)
- CVV input (3 digits)
- Amount display (from registration data)
- "Zaplatit X Kč" button
- On click: POST to /api/payment/mock → redirect to /registrace/[id]
- Loading state during "processing"
- Visual: card-like container with subtle gradient, professional look

- [ ] **Step 2: Create payment page**

`src/app/platba/[id]/page.tsx`:

```typescript
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { PaymentMock } from '@/components/registration/PaymentMock'
import { LocationProvider } from '@/contexts/LocationContext'
import { DEFAULT_LOCATION } from '@/lib/locations'

export const metadata = {
  title: 'Platba | Weeks',
  robots: 'noindex, nofollow',
}

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <LocationProvider location={DEFAULT_LOCATION}>
      <Header />
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <PaymentMock registrationId={id} />
      </main>
      <Footer />
    </LocationProvider>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/registration/PaymentMock.tsx src/app/platba/
git commit -m "feat: add mock payment gateway page"
```

---

## Task 10: Registration Confirmation Page

**Files:**
- Create: `src/components/registration/RegistrationConfirmation.tsx`
- Create: `src/app/registrace/[id]/page.tsx`

- [ ] **Step 1: Create RegistrationConfirmation component**

Client component that:
- Fetches registration data from GET /api/registration/[id]
- Shows status: pending (amber) / paid (green) / confirmed (green) / cancelled (red)
- Displays summary: child name, program, term dates, amount paid
- Success message: "Děkujeme za registraci! Potvrzení jsme odeslali na [email]."
- (Email not actually sent yet — out of scope, but UI says it will be)
- For paid status: green checkmark animation, confetti-like feel

- [ ] **Step 2: Create confirmation page**

`src/app/registrace/[id]/page.tsx`:

```typescript
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { RegistrationConfirmation } from '@/components/registration/RegistrationConfirmation'
import { LocationProvider } from '@/contexts/LocationContext'
import { DEFAULT_LOCATION } from '@/lib/locations'

export const metadata = {
  title: 'Potvrzení registrace | Weeks',
  robots: 'noindex, nofollow',
}

export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <LocationProvider location={DEFAULT_LOCATION}>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="section-container section-padding">
          <RegistrationConfirmation registrationId={id} />
        </div>
      </main>
      <Footer />
    </LocationProvider>
  )
}
```

- [ ] **Step 3: Test full flow**

```bash
cd C:/Users/lukol/Downloads/weeks_web && npm run dev
```

Full flow test (without Supabase — mock API calls):
1. Go to `/karlovy-vary/tabor-3d-tisk`
2. Click "Registrovat dítě"
3. Fill registration form → Submit
4. Mock payment page → "Zaplatit"
5. Confirmation page → "Děkujeme"

- [ ] **Step 4: Commit**

```bash
git add src/components/registration/RegistrationConfirmation.tsx src/app/registrace/
git commit -m "feat: add registration confirmation page"
```

---

## Task 11: Final Integration + Build Verification

**Files:**
- Modify: various files for integration fixes

- [ ] **Step 1: Verify full build**

```bash
cd C:/Users/lukol/Downloads/weeks_web && npm run build 2>&1 | tail -30
```

Fix any TypeScript or build errors.

- [ ] **Step 2: Test Praha unchanged**

Navigate through all Praha pages and verify nothing changed visually:
- http://localhost:3000 — homepage
- http://localhost:3000/tabor-3d-tisk
- http://localhost:3000/tabor-iot
- http://localhost:3000/kontakt

- [ ] **Step 3: Test KV pages**

- http://localhost:3000/karlovy-vary
- http://localhost:3000/karlovy-vary/tabor-3d-tisk
- http://localhost:3000/karlovy-vary/tabor-iot
- http://localhost:3000/karlovy-vary/kontakt
- City switcher works in both directions

- [ ] **Step 4: Test registration flow**

- http://localhost:3000/registrace?location=karlovy-vary&program=3d-tisk&term=kv-2026-05-10-3d-tisk
- Fill out form, verify validation
- Submit → payment page
- Pay → confirmation page

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: multi-city expansion - Praha + Karlovy Vary with registration system"
```

---

## Environment Variables Needed

Add to `.env.local` (same Supabase instance as weeks-hub):

```env
NEXT_PUBLIC_SUPABASE_URL=https://qtxiwtinwcagsyhwaeda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from weeks-hub .env.local>
SUPABASE_SERVICE_ROLE_KEY=<from weeks-hub .env.local>
```

The migration (`009_registrations.sql`) needs to be run against the Supabase project via Supabase Dashboard or CLI.

---

## Post-Implementation Checklist

- [ ] Praha pages render identically to current production
- [ ] KV pages show Vary&Te, Weeks organizer, KV-specific content
- [ ] City switcher navigates correctly between cities
- [ ] Registration form validates all fields
- [ ] Mock payment "processes" and redirects to confirmation
- [ ] Sitemap includes KV URLs
- [ ] No DDM/HWLab references appear on KV pages
- [ ] `npm run build` succeeds without errors
