# Dvoudenní 3D tisk — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vypsat na webu dvoudenní 3D tisk (víkend 2.–3. 7. 2026, 2 990 Kč) jako odlišený speciál na `/tabor-3d-tisk` s flexibilní docházkou (1 i 2 dny) a dvojí cestou přihlášení; v hubu umožnit jeho správu klikáním.

**Architecture:** Sdílená Supabase tabulka `camps` je zdroj pravdy. Tábor = řádek `program='3d-tisk'` + `camp_type='weekend'`. Web víkendové termíny odfiltruje do vlastního bucketu a vykreslí novou komponentou nad sekcí Termíny. Hub dostane do typu a modálů chybějící pole (program/typ/cena/ddm_id) + novou vlajku `single_day_option`.

**Tech Stack:** Next.js 16 (App Router, TS), Tailwind, Framer Motion, Supabase. **Žádný test framework** — ověřování přes `npm run lint`, `npm run build` (typová kontrola) a vizuální kontrolu v dev serveru.

**Repos / pracovní adresáře:**
- Web: `C:/Users/lukol/Downloads/weeks_web` (větev `feature/dvoudenni-3d-tisk`)
- Hub: `C:/Users/lukol/Downloads/weeks-hub-deploy`

**File structure:**
- `weeks-hub-deploy/supabase/migrations/010_camps_single_day.sql` — nový (migrace)
- `weeks_web/src/lib/camps.ts` — upravit (sloupec + weekend bucket)
- `weeks_web/src/components/camps/WeekendCampHighlight.tsx` — nový (UI sekce + formuláře)
- `weeks_web/src/app/tabor-3d-tisk/page.tsx` — upravit (předat weekend)
- `weeks_web/src/app/tabor-3d-tisk/client.tsx` — upravit (vykreslit sekci)
- `weeks-hub-deploy/src/types/database.ts` — upravit (Camp pole)
- `weeks-hub-deploy/src/components/camps/CreateCampModal.tsx` — upravit (pole)
- `weeks-hub-deploy/src/components/camps/CampDetailModal.tsx` — upravit (pole)
- `weeks-hub-deploy/src/hooks/useCamps.ts` — upravit (insert)

---

## Task 1: Supabase migrace — single_day_option + dorovnání sloupců

**Files:**
- Create: `weeks-hub-deploy/supabase/migrations/010_camps_single_day.sql`

- [ ] **Step 1: Vytvořit migrační soubor**

```sql
-- ===== 010: single_day_option + dorovnání web sloupců na camps =====
-- Vlajka pro tábory, kde lze přijít jen na jeden den (dvoudenní 3D tisk).
ALTER TABLE camps ADD COLUMN IF NOT EXISTS single_day_option BOOLEAN NOT NULL DEFAULT false;

-- Idempotentní dorovnání sloupců, které v produkci existují, ale chyběly v repo migracích
-- (web je čte: program/camp_type/price/ddm_id/day_label/location_detail/display_order).
ALTER TABLE camps ADD COLUMN IF NOT EXISTS program TEXT;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS camp_type TEXT;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS price INTEGER;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS ddm_id TEXT;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS day_label TEXT;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS location_detail TEXT;
ALTER TABLE camps ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;
```

- [ ] **Step 2: Aplikovat na živou Supabase**

Spustit obsah souboru v **Supabase → SQL Editor** (projekt `cuy78njh`). Je idempotentní, na existující data bezpečný.

- [ ] **Step 3: Ověřit, že sloupec existuje**

V SQL Editoru spustit:
```sql
select column_name from information_schema.columns
where table_name = 'camps' and column_name = 'single_day_option';
```
Expected: vrátí 1 řádek `single_day_option`.

- [ ] **Step 4: Commit (v hub repu)**

```bash
cd C:/Users/lukol/Downloads/weeks-hub-deploy
git checkout -b feature/dvoudenni-3d-tisk
git add supabase/migrations/010_camps_single_day.sql
git commit -m "feat(db): single_day_option + dorovnání web sloupců na camps"
```

---

## Task 2: Web — camps.ts (nový sloupec + weekend bucket)

**Files:**
- Modify: `weeks_web/src/lib/camps.ts`

- [ ] **Step 1: Přidat sloupec do `CampRow`**

V interface `CampRow` (za řádek `ddm_id: string | null`) přidat:
```ts
  single_day_option: boolean
```

- [ ] **Step 2: Přidat pole do `TermDisplay`**

V interface `TermDisplay` (za `ddmId: string | null`) přidat:
```ts
  singleDayOption: boolean
```

- [ ] **Step 3: Mapovat v `toDisplay`**

V `toDisplay` do vraceného objektu (za `ddmId: row.ddm_id,`) přidat:
```ts
    singleDayOption: row.single_day_option ?? false,
```
(`?? false` ošetří případ, kdy sloupec ještě neexistuje a Supabase vrátí `undefined`.)

- [ ] **Step 4: Přidat `weekend` bucket do `getCampsForProgram`**

Nahradit celé tělo a signaturu `getCampsForProgram` tímto:
```ts
export async function getCampsForProgram(program: string): Promise<{
  open: TermDisplay[]
  openNoLink: TermDisplay[]
  collectingInterest: TermDisplay[]
  full: TermDisplay[]
  weekend: TermDisplay[]              // camp_type === 'weekend' — vykresleno zvlášť
  confirmed: TermDisplay[]
  upcoming: TermDisplay[]
}> {
  const rows = await getCamps()
  const today = new Date().toISOString().slice(0, 10)

  const filtered = rows
    .filter(r => r.program === program && r.end_date >= today && r.status !== 'closed')
    .map(toDisplay)

  const open: TermDisplay[] = []
  const openNoLink: TermDisplay[] = []
  const collectingInterest: TermDisplay[] = []
  const full: TermDisplay[] = []
  const weekend: TermDisplay[] = []

  for (const term of filtered) {
    if (term.campType === 'weekend') { weekend.push(term); continue }
    if (term.status === 'full') full.push(term)
    else if (term.status === 'open_with_link' && term.registrationUrl) open.push(term)
    else if (term.status === 'open_no_link') openNoLink.push(term)
    else collectingInterest.push(term)
  }

  return {
    open, openNoLink, collectingInterest, full, weekend,
    confirmed: open,
    upcoming: [...openNoLink, ...collectingInterest],
  }
}
```

- [ ] **Step 5: Lint + typová kontrola**

Run: `cd C:/Users/lukol/Downloads/weeks_web && npm run lint`
Expected: bez nových chyb v `camps.ts`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/camps.ts
git commit -m "feat(camps): single_day_option + weekend bucket v getCampsForProgram"
```

---

## Task 3: Web — komponenta WeekendCampHighlight

**Files:**
- Create: `weeks_web/src/components/camps/WeekendCampHighlight.tsx`

- [ ] **Step 1: Vytvořit komponentu (celý obsah souboru)**

```tsx
'use client'

import { motion } from 'framer-motion'
import { Calendar, Check, Sparkles, Users, Clock, Phone, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { trackInterestSubmit, trackRegistrationFormOpen, trackRegistrationClick } from '@/lib/analytics'
import type { TermDisplay } from '@/lib/camps'

const INFO_PHONE_LABEL = '+420 703 046 440'
const INFO_PHONE_HREF = 'tel:+420703046440'
const INFO_EMAIL = 'admin@weeks.cz'

type Program = '3d-tisk' | 'iot'

interface WeekendCampHighlightProps {
  terms: TermDisplay[]
  program: Program
  programTitle: string
}

function formatPrice(price: number | null): string {
  if (price == null) return ''
  return `${price.toLocaleString('cs-CZ')} Kč`
}

export function WeekendCampHighlight({ terms, program, programTitle }: WeekendCampHighlightProps) {
  if (terms.length === 0) return null
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {terms.map((term) => (
        <WeekendCard key={term.id} term={term} program={program} programTitle={programTitle} />
      ))}
    </div>
  )
}

function WeekendCard({ term, program, programTitle }: { term: TermDisplay; program: Program; programTitle: string }) {
  const year = term.startDate.slice(0, 4)
  const baseTermin = `Dvoudenní ${programTitle} ${term.weekendDateLabel} ${year}`
  const hasLink = term.status === 'open_with_link' && !!term.registrationUrl

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-white shadow-xl border border-primary-100 overflow-hidden"
    >
      {/* Horní gradientový pruh */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cta-400 text-gray-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> NOVĚ
          </span>
          <h3 className="text-xl font-bold text-white">Dvoudenní tábor {programTitle}</h3>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-white/90 text-sm">
          <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {term.weekendDateLabel}</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" /> 2 dny</span>
          <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4" /> max {term.capacity} dětí</span>
          {term.price != null && <span className="font-bold text-white">{formatPrice(term.price)}</span>}
        </div>
      </div>

      <div className="p-6">
        {/* Pitch */}
        <p className="text-gray-600 mb-4">
          Dva navazující dny u 3D tiskáren — víc času na vlastní projekty, větší výtisky
          a prostor projít si celý proces od návrhu po hotový kus do detailu.
        </p>

        {/* Flexibilita */}
        <div className="flex gap-3 p-4 rounded-xl bg-cta-50 border border-cta-200 mb-6">
          <Check className="w-5 h-5 text-cta-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Stačí přijít i jen na jeden den.</span>{' '}
            Není to problém — program dítěti přizpůsobíme, ať dorazí na oba dny, nebo jen na jeden.
          </p>
        </div>

        {/* Dvě cesty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Blok A: celý víkend */}
          <div className="rounded-2xl border border-gray-200 p-5">
            <h4 className="font-semibold text-gray-900 mb-1">Celý víkend (oba dny)</h4>
            {hasLink ? (
              <>
                <p className="text-sm text-gray-500 mb-4">Registrace přes DDM Praha 6.</p>
                <a
                  href={term.registrationUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackRegistrationClick({
                    termId: term.id,
                    termDates: term.weekendDateLabel,
                    termLocation: term.location || 'HWLab Praha',
                    spotsAvailable: Math.max(0, term.capacity - term.enrolledCount),
                    outboundUrl: term.registrationUrl!,
                    campType: 'weekend',
                  })}
                  className="w-full inline-flex items-center justify-center px-5 py-3 bg-cta-500 hover:bg-cta-400 text-gray-900 font-semibold rounded-xl transition-all text-sm"
                >
                  Přihlásit se <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Registrace poběží přes DDM Praha 6 — brzy ji otevřeme. Nechte email a dáme vědět.
                </p>
                <WaitlistForm
                  program={program}
                  programTitle={programTitle}
                  termin={`${baseTermin} — celý víkend`}
                  buttonLabel="Dejte mi vědět"
                />
              </>
            )}
          </div>

          {/* Blok B: jen jeden den */}
          {term.singleDayOption && (
            <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-5">
              <h4 className="font-semibold text-gray-900 mb-1">Chceš přijít jen na jeden den?</h4>
              <p className="text-sm text-gray-500 mb-4">
                Napište nám a domluvíme se na jednodenní účasti.
              </p>
              <SingleDayForm program={program} programTitle={programTitle} baseTermin={baseTermin} />
              <div className="mt-4 pt-4 border-t border-primary-100 space-y-2 text-sm">
                <a href={INFO_PHONE_HREF} className="flex items-center gap-2 text-gray-700 hover:text-primary-700">
                  <Phone className="w-4 h-4 text-primary-600" /> {INFO_PHONE_LABEL}
                </a>
                <a href={`mailto:${INFO_EMAIL}`} className="flex items-center gap-2 text-gray-700 hover:text-primary-700">
                  <Mail className="w-4 h-4 text-primary-600" /> {INFO_EMAIL}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function WaitlistForm({ program, programTitle, termin, buttonLabel = 'Odeslat' }: {
  program: Program; programTitle: string; termin: string; buttonLabel?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [gdpr, setGdpr] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true); setError(null)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, program, termin, gdprConsent: gdpr }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Něco se pokazilo')
      setSubmitted(true)
      trackInterestSubmit({ programId: program, programTitle, termin, campType: 'weekend' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se odeslat. Zkuste to znovu.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-3 bg-trust-50 border border-trust-200 rounded-xl text-center">
        <Check className="w-5 h-5 text-trust-600 mx-auto mb-1" />
        <p className="text-sm font-medium text-trust-800">Děkujeme! Dáme vám vědět.</p>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); trackRegistrationFormOpen({ programId: program, programTitle, termin, campType: 'weekend' }) }}
        className="w-full inline-flex items-center justify-center px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors text-sm"
      >
        {buttonLabel}
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="váš@email.cz" required
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
      />
      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input type="checkbox" checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} required className="mt-0.5 w-4 h-4 text-primary-600 focus:ring-primary-400" />
        <span>Souhlasím se <Link href="/gdpr" className="underline">zpracováním osobních údajů</Link></span>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting || !gdpr || !email.trim()}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed">
        {submitting ? 'Odesílám…' : 'Odeslat'}
      </button>
    </form>
  )
}

function SingleDayForm({ program, programTitle, baseTermin }: {
  program: Program; programTitle: string; baseTermin: string
}) {
  const [email, setEmail] = useState('')
  const [day, setDay] = useState<'sobota' | 'neděle'>('sobota')
  const [gdpr, setGdpr] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true); setError(null)
    const termin = `${baseTermin} — jen jeden den (${day})`
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, program, termin, gdprConsent: gdpr }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Něco se pokazilo')
      setSubmitted(true)
      trackInterestSubmit({ programId: program, programTitle, termin, campType: 'weekend' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se odeslat. Zkuste to znovu.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-3 bg-trust-50 border border-trust-200 rounded-xl text-center">
        <Check className="w-5 h-5 text-trust-600 mx-auto mb-1" />
        <p className="text-sm font-medium text-trust-800">Děkujeme! Ozveme se vám.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="váš@email.cz" required
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
      />
      <div className="flex gap-2">
        {(['sobota', 'neděle'] as const).map((d) => (
          <button
            type="button" key={d} onClick={() => setDay(d)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${day === d ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'}`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>
      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input type="checkbox" checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} required className="mt-0.5 w-4 h-4 text-primary-600 focus:ring-primary-400" />
        <span>Souhlasím se <Link href="/gdpr" className="underline">zpracováním osobních údajů</Link></span>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting || !gdpr || !email.trim()}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed">
        {submitting ? 'Odesílám…' : 'Napište nám'}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Lint**

Run: `cd C:/Users/lukol/Downloads/weeks_web && npm run lint`
Expected: bez chyb a varování (žádné nepoužité importy) v `WeekendCampHighlight.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/camps/WeekendCampHighlight.tsx
git commit -m "feat(camps): WeekendCampHighlight — sekce 2denního tábora s 1denní variantou"
```

---

## Task 4: Web — zapojit sekci do stránky 3D tisku

**Files:**
- Modify: `weeks_web/src/app/tabor-3d-tisk/page.tsx`
- Modify: `weeks_web/src/app/tabor-3d-tisk/client.tsx`

- [ ] **Step 1: page.tsx — předat `weekend`**

Nahradit tělo `Tabor3DTiskPage`:
```tsx
export default async function Tabor3DTiskPage() {
  const { open, openNoLink, collectingInterest, full, weekend } = await getCampsForProgram('3d-tisk')
  return (
    <Tabor3DTiskClient
      open={open}
      openNoLink={openNoLink}
      collectingInterest={collectingInterest}
      full={full}
      weekend={weekend}
    />
  )
}
```

- [ ] **Step 2: client.tsx — import + prop**

V `client.tsx` přidat import (za řádek s importem `TermsList`):
```tsx
import { WeekendCampHighlight } from '@/components/camps/WeekendCampHighlight'
```
Rozšířit interface `Tabor3DTiskClientProps`:
```tsx
interface Tabor3DTiskClientProps {
  open: TermDisplay[]
  openNoLink: TermDisplay[]
  collectingInterest: TermDisplay[]
  full: TermDisplay[]
  weekend: TermDisplay[]
}
```
A destrukturovat v signatuře komponenty:
```tsx
export default function Tabor3DTiskClient({ open, openNoLink, collectingInterest, full, weekend }: Tabor3DTiskClientProps) {
```

- [ ] **Step 3: client.tsx — vykreslit sekci nad Termíny**

Bezprostředně **před** `{/* Termíny */}` (tj. před `<section id="terminy" ...>`) vložit:
```tsx
        {/* Dvoudenní speciál */}
        {weekend.length > 0 && (
          <section id="dvoudenni" className="section-padding bg-gray-50 scroll-mt-24">
            <div className="section-container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="heading-2 text-gray-900 mb-3">
                  Novinka: <span className="text-gradient">dvoudenní 3D tisk</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Víkendová verze tábora — dva dny a víc prostoru na vlastní projekty.
                  A když to vyjde jen na jeden den, klidně přijďte jen na jeden.
                </p>
              </motion.div>
              <WeekendCampHighlight terms={weekend} program="3d-tisk" programTitle="3D tisk" />
            </div>
          </section>
        )}
```

- [ ] **Step 4: Build + lint**

Run: `cd C:/Users/lukol/Downloads/weeks_web && npm run lint && npm run build`
Expected: build projde bez TS chyb; `/tabor-3d-tisk` se přeloží.

- [ ] **Step 5: Vizuální kontrola (vyžaduje Supabase env v `.env.local`)**

Run: `npm run dev`, otevřít `http://localhost:3000/tabor-3d-tisk`.
- Pokud v Supabase zatím není víkendový řádek, sekce se **nezobrazí** (to je správně — seedneme ji v Task 9).
- Pozn.: bez `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` v `.env.local` je seznam táborů prázdný.

- [ ] **Step 6: Commit**

```bash
git add src/app/tabor-3d-tisk/page.tsx src/app/tabor-3d-tisk/client.tsx
git commit -m "feat(3d-tisk): zobrazit dvoudenní speciál nad sekcí Termíny"
```

---

## Task 5: Hub — rozšířit typ Camp

**Files:**
- Modify: `weeks-hub-deploy/src/types/database.ts`

- [ ] **Step 1: Přidat pole do interface `Camp`**

Do interface `Camp` (za řádek `web_source_id: string | null;`) přidat:
```ts
  program: string | null;
  camp_type: 'weekend' | 'oneday' | null;
  price: number | null;
  ddm_id: string | null;
  day_label: string | null;
  location_detail: string | null;
  display_order: number;
  single_day_option: boolean;
```

- [ ] **Step 2: Lint**

Run: `cd C:/Users/lukol/Downloads/weeks-hub-deploy && npm run lint`
Expected: bez nových chyb.

- [ ] **Step 3: Commit**

```bash
git add src/types/database.ts
git commit -m "feat(types): Camp o program/typ/cena/ddm_id/single_day_option"
```

---

## Task 6: Hub — pole v CreateCampModal

**Files:**
- Modify: `weeks-hub-deploy/src/components/camps/CreateCampModal.tsx`

- [ ] **Step 1: Rozšířit typ `onSubmit`**

V `CreateCampModalProps` nahradit objekt `onSubmit`:
```tsx
  onSubmit: (camp: {
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    location?: string;
    capacity: number;
    status: CampStatus;
    registration_url?: string;
    program?: string;
    camp_type?: 'weekend' | 'oneday';
    price?: number;
    ddm_id?: string;
    single_day_option?: boolean;
  }) => Promise<unknown>;
```

- [ ] **Step 2: Přidat stav**

Za `const [registrationUrl, setRegistrationUrl] = useState('');` přidat:
```tsx
  const [program, setProgram] = useState('');
  const [campType, setCampType] = useState<'weekend' | 'oneday'>('oneday');
  const [price, setPrice] = useState('');
  const [ddmId, setDdmId] = useState('');
  const [singleDayOption, setSingleDayOption] = useState(false);
```

- [ ] **Step 3: Poslat nová pole v `handleSubmit`**

V `await onSubmit({ ... })` přidat za `registration_url`:
```tsx
      program: program || undefined,
      camp_type: campType,
      price: price ? parseInt(price) : undefined,
      ddm_id: ddmId.trim() || undefined,
      single_day_option: singleDayOption,
```
A do resetu za `setRegistrationUrl('');` přidat:
```tsx
    setProgram('');
    setCampType('oneday');
    setPrice('');
    setDdmId('');
    setSingleDayOption(false);
```

- [ ] **Step 4: Přidat pole do formuláře**

Za blok s `Lokace` (`<Input label="Lokace" ... />`) vložit:
```tsx
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Program"
            placeholder="Vyber program"
            options={[
              { value: '3d-tisk', label: '3D tisk' },
              { value: 'iot', label: 'IoT & elektronika' },
              { value: 'tech', label: 'MIX – chytré technologie' },
            ]}
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          />
          <Select
            label="Typ"
            options={[
              { value: 'oneday', label: 'Jednodenní' },
              { value: 'weekend', label: 'Víkendový (2 dny)' },
            ]}
            value={campType}
            onChange={(e) => setCampType(e.target.value as 'weekend' | 'oneday')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Cena (Kč)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            placeholder="napr. 2990"
          />
          <Input
            label="DDM ID (volitelne)"
            value={ddmId}
            onChange={(e) => setDdmId(e.target.value)}
            placeholder="napr. 786"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input
            type="checkbox"
            checked={singleDayOption}
            onChange={(e) => setSingleDayOption(e.target.checked)}
            className="w-4 h-4"
          />
          Umoznit prihlaseni jen na 1 den
        </label>
```

- [ ] **Step 5: Lint + build**

Run: `cd C:/Users/lukol/Downloads/weeks-hub-deploy && npm run lint && npm run build`
Expected: bez chyb.

- [ ] **Step 6: Commit**

```bash
git add src/components/camps/CreateCampModal.tsx
git commit -m "feat(hub): pole program/typ/cena/ddm_id/jen 1 den v CreateCampModal"
```

---

## Task 7: Hub — pole v CampDetailModal (edit)

**Files:**
- Modify: `weeks-hub-deploy/src/components/camps/CampDetailModal.tsx`

- [ ] **Step 1: Přidat stav**

Za `const [registrationUrl, setRegistrationUrl] = useState(camp.registration_url || '');` přidat:
```tsx
  const [program, setProgram] = useState(camp.program || '');
  const [campType, setCampType] = useState<'weekend' | 'oneday'>(camp.camp_type || 'oneday');
  const [price, setPrice] = useState(camp.price != null ? String(camp.price) : '');
  const [ddmId, setDdmId] = useState(camp.ddm_id || '');
  const [singleDayOption, setSingleDayOption] = useState(!!camp.single_day_option);
```

- [ ] **Step 2: Inicializovat v `startEdit`**

Za `setRegistrationUrl(camp.registration_url || '');` (uvnitř `startEdit`) přidat:
```tsx
    setProgram(camp.program || '');
    setCampType(camp.camp_type || 'oneday');
    setPrice(camp.price != null ? String(camp.price) : '');
    setDdmId(camp.ddm_id || '');
    setSingleDayOption(!!camp.single_day_option);
```

- [ ] **Step 3: Poslat nová pole v `handleSave`**

V `onUpdate(camp.id, { ... })` přidat za `registration_url`:
```tsx
      program: program || null,
      camp_type: campType,
      price: price ? parseInt(price) : null,
      ddm_id: ddmId.trim() || null,
      single_day_option: singleDayOption,
```

- [ ] **Step 4: Přidat pole do edit formuláře**

V bloku `if (isEditing)` za `<Input label="Lokace" ... />` vložit:
```tsx
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Program"
              placeholder="Vyber program"
              options={[
                { value: '3d-tisk', label: '3D tisk' },
                { value: 'iot', label: 'IoT & elektronika' },
                { value: 'tech', label: 'MIX – chytré technologie' },
              ]}
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            />
            <Select
              label="Typ"
              options={[
                { value: 'oneday', label: 'Jednodenní' },
                { value: 'weekend', label: 'Víkendový (2 dny)' },
              ]}
              value={campType}
              onChange={(e) => setCampType(e.target.value as 'weekend' | 'oneday')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cena (Kč)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" />
            <Input label="DDM ID" value={ddmId} onChange={(e) => setDdmId(e.target.value)} placeholder="napr. 786" />
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
            <input type="checkbox" checked={singleDayOption} onChange={(e) => setSingleDayOption(e.target.checked)} className="w-4 h-4" />
            Umoznit prihlaseni jen na 1 den
          </label>
```

- [ ] **Step 5: Lint + build**

Run: `cd C:/Users/lukol/Downloads/weeks-hub-deploy && npm run lint && npm run build`
Expected: bez chyb.

- [ ] **Step 6: Commit**

```bash
git add src/components/camps/CampDetailModal.tsx
git commit -m "feat(hub): editace program/typ/cena/ddm_id/jen 1 den v CampDetailModal"
```

---

## Task 8: Hub — insert nových polí v useCamps

**Files:**
- Modify: `weeks-hub-deploy/src/hooks/useCamps.ts`

- [ ] **Step 1: Rozšířit param typ `createCamp`**

V `createCamp` rozšířit objekt parametru `camp` (za `color?: string;`) o:
```ts
    program?: string;
    camp_type?: 'weekend' | 'oneday';
    price?: number;
    ddm_id?: string;
    single_day_option?: boolean;
```

- [ ] **Step 2: Přidat pole do insertu**

V `.insert({ ... })` přidat za `color: camp.color || '#10B981',`:
```ts
        program: camp.program ?? null,
        camp_type: camp.camp_type ?? null,
        price: camp.price ?? null,
        ddm_id: camp.ddm_id ?? null,
        single_day_option: camp.single_day_option ?? false,
```
(Pozn.: `updateCamp` používá `Partial<Camp>` a spreaduje `cleanUpdates`, takže nová pole projdou automaticky — žádná změna není potřeba.)

- [ ] **Step 3: Lint + build**

Run: `cd C:/Users/lukol/Downloads/weeks-hub-deploy && npm run lint && npm run build`
Expected: bez chyb.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useCamps.ts
git commit -m "feat(hub): ukládat program/typ/cena/ddm_id/single_day_option při vytvoření tábora"
```

---

## Task 9: Vytvořit tábor + ověřit end-to-end

**Files:** žádné (datová operace + ověření)

- [ ] **Step 1: Vytvořit řádek tábora**

**Varianta A (přes hub, po nasazení):** v hubu `Nový tábor` → Název „Dvoudenní 3D tisk", datumy 2026-07-02 / 2026-07-03, lokace „HWLab Praha", kapacita 15, status „Otevřeno" (`open_no_link`), Program „3D tisk", Typ „Víkendový (2 dny)", Cena 2990, zaškrtnout „Umoznit prihlaseni jen na 1 den".

**Varianta B (přímo v Supabase SQL editoru, pro okamžité ověření webu):**
```sql
insert into camps
  (title, description, start_date, end_date, location, location_detail,
   capacity, enrolled_count, status, program, camp_type, price,
   single_day_option, display_order, created_by)
values
  ('Dvoudenní 3D tisk', 'Víkendový 3D tisk', '2026-07-02', '2026-07-03',
   'HWLab Praha', null, 15, 0, 'open_no_link', '3d-tisk', 'weekend', 2990,
   true, 10, (select id from users order by created_at limit 1));
```

- [ ] **Step 2: Ověřit na webu**

Run (web): `npm run dev`, otevřít `http://localhost:3000/tabor-3d-tisk`.
Expected:
- Nad sekcí Termíny je sekce „Novinka: dvoudenní 3D tisk" s kartou (2.–3. července, 2 dny, max 15, 2 990 Kč).
- Blok „Celý víkend" ukazuje „brzy otevřeme přes DDM" + tlačítko „Dejte mi vědět".
- Blok „Chceš přijít jen na jeden den?" má email, volbu So/Ne, GDPR + telefon a infomail.
- Víkendový tábor **není** v seznamu jednodenních Termínů.

- [ ] **Step 3: Ověřit odeslání obou formulářů**

Vyplnit a odeslat oba formuláře. Expected: `POST /api/waitlist` vrátí 200 a zobrazí se potvrzení („Dáme vám vědět" / „Ozveme se vám"). V doručené poště admin@weeks.cz dorazí mail s `termin` obsahujícím „celý víkend" resp. „jen jeden den (sobota|neděle)".

- [ ] **Step 4: Ověřit homepage „nejbližší termíny"**

Otevřít `http://localhost:3000/`. Expected: pokud se víkendový 3D tisk objeví mezi nejbližšími termíny, má správné datum (2.–3. července) a cenu 2 990 Kč. **Pokud se zobrazí špatná cena (1 490) nebo rozbité datum**, poznamenat jako navazující úkol (homepage karty nejsou v rozsahu tohoto plánu) — nerefaktorovat tady.

- [ ] **Step 5: Závěrečný build webu**

Run: `cd C:/Users/lukol/Downloads/weeks_web && npm run build`
Expected: úspěšný build.

---

## Nasazení (po dokončení a schválení)

- **Web:** větev `feature/dvoudenni-3d-tisk` → po odsouhlasení squash do `main` (Lukáš autor) → Vercel auto-deploy weeks.cz. Viz CLAUDE.md „Vercel Hobby author block".
- **Hub:** větev `feature/dvoudenni-3d-tisk` → squash do `main` přes stejný workflow → deploy app.weeks.cz.
- **Migrace:** musí být aplikovaná na Supabase **před** deployem webu (web čte `single_day_option`).
