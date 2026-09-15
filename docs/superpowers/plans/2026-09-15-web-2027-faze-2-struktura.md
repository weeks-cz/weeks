# Fáze 2: Struktura stránek — implementační plán

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nahradit katalog programů se dvěma paralelními stromy stránek podle města jednou stránkou tábora, stránkou pro každý turnus a přestavěnou úvodkou — a staré adresy poslat na jejich protějšky.

**Architecture:** Nové sdílené komponenty v `src/components/turnusy/` čtou data výhradně přes rozhraní z fáze 1 (`getTurnusy`, `getTurnus`, `getCity`, `getFocusModules`). Stránka `/tabor` vzniká adaptací dnešní karlovarské stránky letního tábora, které se odeberou odkazy na jedno město; `/tabor/[turnus]` je její kratší, prodejní varianta pro konkrétní termín. Úvodka se z katalogu programů mění na rozcestí. Teprve poslední dva úkoly mažou staré stránky a přidávají přesměrování, takže web není mezi commity nikdy rozbitý.

**Tech Stack:** TypeScript, Next.js 16 (App Router), Tailwind, Framer Motion, Vitest 2.

**Spec:** `docs/superpowers/specs/2026-09-15-web-2027-design.md`

## Global Constraints

- Veškerý text pro uživatele je **česky**, vykáním. Kód a komentáře taky česky.
- **Weeks s.r.o. je neplátce DPH** — nikde se nevyčísluje daň, žádné „vč. DPH".
- **Ceny se v této fázi neberou z `locations.ts`.** Každá nová komponenta čte cenu výhradně z turnusu. Varování nad `TURNUSY` v `src/lib/turnusy.ts` platí až do dokončení téhle fáze.
- Vizuální jazyk je „maker lab": papír `bg-paper` / inkoust `bg-ink`, 1px rámečky `border-ink/15`, tvrdé stíny, mono popisky třídou `mono-label`, mřížka `blueprint-grid`. Styl neměň, nové obrazovky skládej z existujících tříd. Předloha: `docs/superpowers/specs/2026-07-03-maker-lab-style-guide.md`.
- Animace musí respektovat `prefers-reduced-motion` — používej `useReducedMotion` z Framer Motion jako okolní kód.
- Přístupnost: každý interaktivní prvek bez viditelného textu má `aria-label`, každý input má svázaný `<label>`, každý `<img>` má `alt` a mimo první obrazovku `loading="lazy"`.
- `npm run lint` je rozbité napříč repozitářem (Next 16 zrušil `next lint`). Bránou je `npm test`, `npx tsc --noEmit` a `npm run build`.
- **Nikdy `git add -A`** — v kořeni repozitáře leží soukromé soubory mimo verzování.
- Větev: `feat/web-2027`. Commituj po každém úkolu, podpisový řádek `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
- Tento repozitář je **veřejný** — žádná obchodní strategie ani interní čísla.

## Pořadí provádění

Čísla úkolů nejsou pořadí. Prováděj je takto:

**3 → 2 → 1 → 4 → 5 → 12 → 6 → 7 → 8 → 9 → 13 → 10 → 11**

Tři místa, kde na pořadí záleží:
- **3 před 2** — karta turnusu importuje `SpotsLeftBadge` z cesty, na kterou ho přesouvá úkol 3.
- **12 před 6** — stránka tábora odkazuje na registraci turnusu; kdyby úkol 12 neproběhl dřív, vedl by odkaz na formulář, který turnus nedohledá.
- **13 před 10** — úkol 13 vytahuje obsah ze stránek, které úkol 10 maže. Opačně by se obsah ztratil.

## Mapa souborů

**Vzniká:**
| Soubor | Zodpovědnost |
|---|---|
| `src/lib/site.ts` | Kontakt, odpovědi do FAQ, výchozí popisy pro vyhledávače — to, co se po sjednocení podle města neliší |
| `src/components/turnusy/TurnusCard.tsx` | Jedna karta turnusu pro všechna tři místa, kde se zobrazuje |
| `src/components/turnusy/TurnusList.tsx` | Seznam turnusů s filtrem měst v adrese |
| `src/components/turnusy/TurnusInterestForm.tsx` | Sběr kontaktu na chystaný turnus |
| `src/components/turnusy/SpotsLeft.tsx` | Přesun z `karlovy-vary/_components`, beze změny chování |
| `src/components/turnusy/VenueShowcase.tsx` | Přesun, místo konání se bere z turnusu |
| `src/components/turnusy/ProjectGallery.tsx` | Přesun beze změny |
| `src/app/tabor/page.tsx`, `layout.tsx` | Vlajková stránka tábora |
| `src/app/tabor/[turnus]/page.tsx`, `layout.tsx` | Detail turnusu |

**Mění se:** `src/app/page.tsx`, `src/components/layout/Header.tsx`, `Footer.tsx`, `src/components/sections/{HeroSection,USPSection,FAQSection,ContactSection}.tsx`, `src/components/seo/StructuredData.tsx`, `src/app/sitemap.ts`, `next.config.js`.

**Mizí (až v posledních dvou úkolech):** `src/app/{program,tabor-3d-tisk,tabor-iot,tabor-chytrych-technologii,kveten}/`, celé `src/app/karlovy-vary/`, `src/components/ui/CitySwitcher.tsx`, `src/contexts/LocationContext.tsx`, `src/components/sections/{ProgramSection,UpcomingTermsSection,CTASection,TrustSection}.tsx`, `src/components/camps/TermsList.tsx`.

`src/lib/locations.ts` v téhle fázi **nemažeme** — drží ho ještě `/api/capacity`, `/api/cron/nastupni-list` a e-maily. Padne ve fázi 3 spolu s DDM.

---

### Task 1: Globální konfigurace webu

Dnes je kontakt, FAQ a popis pro vyhledávače uložený zvlášť u každého města v `locations.ts`, přestože telefon i e-mail jsou pro obě stejné. Po sjednocení to přestává být vlastnost města.

**Files:**
- Create: `src/lib/site.ts`
- Test: `src/lib/site.test.ts`

**Interfaces:**
- Consumes: `getAllCities` z `./cities`
- Produces:
  - `SITE: { name, legalName, ico, address, court, phone, email, url }`
  - `getSiteFaq(): Array<{ question: string; answer: string }>`
  - `getVenuesSentence(): string` — věta „Tábory probíhají v …" složená z míst konání turnusů

- [ ] **Step 1: Napiš padající test**

Vytvoř `src/lib/site.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { SITE, getSiteFaq, getVenuesSentence } from './site'

describe('SITE', () => {
  it('nese údaje Weeks s.r.o. potřebné do patičky a právních textů', () => {
    expect(SITE.legalName).toBe('Weeks s.r.o.')
    expect(SITE.ico).toBe('29984360')
    expect(SITE.court).toContain('Městský soud v Praze')
    expect(SITE.address).toContain('Arbesovo náměstí')
  })

  it('má jeden telefon a jeden e-mail pro celý web', () => {
    expect(SITE.phone).toBe('+420 703 046 440')
    expect(SITE.email).toBe('info@weeks.cz')
  })

  it('nikde nevyčísluje DPH — Weeks s.r.o. je neplátce', () => {
    const vsechnyTexty = JSON.stringify(SITE) + JSON.stringify(getSiteFaq())
    expect(vsechnyTexty).not.toMatch(/DPH/i)
  })
})

describe('getSiteFaq', () => {
  it('vrátí neprázdný seznam otázek, každou s odpovědí', () => {
    const faq = getSiteFaq()
    expect(faq.length).toBeGreaterThan(3)
    for (const item of faq) {
      expect(item.question.length, item.question).toBeGreaterThan(5)
      expect(item.answer.length, item.question).toBeGreaterThan(20)
    }
  })

  it('žádná otázka se neopakuje', () => {
    const otazky = getSiteFaq().map((f) => f.question)
    expect(new Set(otazky).size).toBe(otazky.length)
  })
})

describe('getVenuesSentence', () => {
  it('jmenuje místa konání, která turnusy skutečně mají', () => {
    expect(getVenuesSentence()).toContain('FabLab VARY&TE')
  })

  it('nekončí prázdnou větou, ani když má turnus místo nedomluvené', () => {
    expect(getVenuesSentence().length).toBeGreaterThan(20)
  })
})
```

- [ ] **Step 2: Pusť test a ověř, že padá**

Run: `npm test -- src/lib/site.test.ts`
Expected: FAIL — `Failed to resolve import "./site"`

- [ ] **Step 3: Napiš implementaci**

Vytvoř `src/lib/site.ts`:

```ts
import { getVenue } from './cities'
import { getTurnusy } from './turnusy'

/**
 * Globální konfigurace webu — to, co se po sjednocení měst nijak neliší.
 *
 * Kontakt, odpovědi do FAQ a popisy pro vyhledávače byly dřív uložené zvlášť
 * u každého města v `locations.ts`, přestože telefon i e-mail byly stejné.
 * Vlastností turnusu zůstává jen to, co se turnus od turnusu opravdu mění:
 * místo konání, termín, cena, kapacita a zaměření.
 */
export const SITE = {
  name: 'Weeks',
  legalName: 'Weeks s.r.o.',
  ico: '29984360',
  address: 'Arbesovo náměstí 70/4, Smíchov, 150 00 Praha 5',
  court: 'Městský soud v Praze, sp. zn. C 455169',
  phone: '+420 703 046 440',
  email: 'info@weeks.cz',
  url: 'https://weeks.cz',
} as const

/** Věta o místech konání — složená z turnusů, ne natvrdo. */
export function getVenuesSentence(): string {
  const nazvy = Array.from(
    new Set(
      getTurnusy()
        .map((t) => (t.venueId ? getVenue(t.venueId).name : null))
        .filter((n): n is string => n !== null)
    )
  )

  if (nazvy.length === 0) {
    return 'Místa konání upřesníme u každého turnusu, jakmile je potvrdíme.'
  }
  if (nazvy.length === 1) {
    return `Tábory probíhají v ${nazvy[0]}. Přesné místo najdete u každého turnusu.`
  }
  return `Tábory probíhají v ${nazvy.slice(0, -1).join(', ')} a ${nazvy[nazvy.length - 1]}. Přesné místo najdete u každého turnusu.`
}

export function getSiteFaq(): Array<{ question: string; answer: string }> {
  return [
    {
      question: 'Pro jak staré děti je tábor určený?',
      answer:
        'Pro děti od 9 do 15 let. Skupiny dělíme podle věku a zkušeností, takže starší se nenudí a mladší nezůstanou pozadu.',
    },
    {
      question: 'Musí dítě něco umět dopředu?',
      answer:
        'Ne. Začínáme od nuly a všechno si děti vyzkouší pod vedením lektora. Kdo už něco umí, dostane náročnější zadání.',
    },
    {
      question: 'Kde tábory probíhají?',
      answer: getVenuesSentence(),
    },
    {
      question: 'Kolik dětí je na jednoho lektora?',
      answer:
        'Na jednoho lektora připadá pět dětí. Na turnus bereme nejvýše patnáct dětí, aby se na každé dostalo.',
    },
    {
      question: 'Je v ceně oběd?',
      answer:
        'Ano. V ceně je oběd, pitný režim i veškerý materiál, který dítě během týdne spotřebuje. Nic dalšího se nedoplácí.',
    },
    {
      question: 'Co si dítě odveze domů?',
      answer:
        'Vlastní výtisk z 3D tiskárny a sestavené zařízení, které si samo naprogramovalo. Obojí si odváží domů.',
    },
    {
      question: 'Kdo tábory pořádá?',
      answer: `Tábory pořádá ${SITE.legalName}, IČO ${SITE.ico}. Lektoři jsou proškolení v první pomoci a s dětmi pracují dlouhodobě.`,
    },
  ]
}
```

- [ ] **Step 4: Pusť test a ověř, že prochází**

Run: `npm test -- src/lib/site.test.ts`
Expected: PASS, 7 testů

- [ ] **Step 5: Commit**

```bash
git add src/lib/site.ts src/lib/site.test.ts
git commit -m "feat(struktura): globální konfigurace webu místo údajů u každého města

Kontakt, FAQ a popisy pro vyhledávače se po sjednocení měst neliší —
vlastností turnusu zůstává jen místo, termín, cena, kapacita a zaměření.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Karta turnusu

Jedna komponenta pro tři místa: úvodku (nejbližší dva turnusy), `/tabor` (všechny) a patičku detailu turnusu (další termíny). Musí unést i turnus, který ještě nemá termín, místo ani cenu.

**Files:**
- Create: `src/components/turnusy/TurnusCard.tsx`
- Test: `src/components/turnusy/turnus-card-labels.test.ts`

Vykreslování se v tomhle repozitáři netestuje (vitest běží v prostředí `node`, žádná knihovna na testování komponent není). Testovatelné jsou popisky — proto je čistá funkce, která je počítá, v samostatném exportu.

**Interfaces:**
- Consumes: `Turnus`, `isBookable` z `@/lib/turnusy`; `getCity`, `getVenue` z `@/lib/cities`; `getFocusModules` z `@/lib/focus`
- Produces:
  - `turnusLabels(turnus: Turnus): { datum: string; mesto: string; misto: string; cena: string; stav: string; ctaText: string; ctaHref: string | null }`
  - `TurnusCard({ turnus, spotsLeft }: { turnus: Turnus; spotsLeft?: number })`

- [ ] **Step 1: Napiš padající test**

Vytvoř `src/components/turnusy/turnus-card-labels.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { turnusLabels } from './TurnusCard'
import type { Turnus } from '@/lib/turnusy'

const otevreny: Turnus = {
  id: 'test-otevreny',
  slug: 'karlovy-vary-cervenec-2027',
  city: 'karlovy-vary',
  venueId: 'fablab-varyte',
  start: '2027-07-12',
  end: '2027-07-16',
  priceKc: 4990,
  capacity: 15,
  status: 'otevreno',
  focus: ['3d-tisk', 'iot'],
  ageRange: '9-15',
  perex: 'Týdenní příměstský tábor ve FabLabu.',
}

const chystany: Turnus = {
  id: 'test-chystany',
  slug: 'praha-leto-2027',
  city: 'praha',
  venueId: null,
  start: null,
  end: null,
  priceKc: null,
  capacity: 15,
  status: 'chystame',
  focus: ['3d-tisk'],
  ageRange: '9-15',
  perex: 'Místo konání i termíny upřesníme.',
}

describe('turnusLabels — otevřený turnus', () => {
  const l = turnusLabels(otevreny)

  it('vysází termín česky a v jednom rozsahu', () => {
    expect(l.datum).toBe('12. – 16. července 2027')
  })

  it('pojmenuje město a místo konání', () => {
    expect(l.mesto).toBe('Karlovy Vary')
    expect(l.misto).toBe('FabLab VARY&TE')
  })

  it('uvede cenu s mezerou mezi tisíci a bez zmínky o DPH', () => {
    expect(l.cena).toBe('4 990 Kč')
    expect(l.cena).not.toMatch(/DPH/i)
  })

  it('vede na registraci konkrétního turnusu', () => {
    expect(l.ctaHref).toBe('/registrace?term=test-otevreny')
    expect(l.ctaText).toBe('Přihlásit dítě')
  })
})

describe('turnusLabels — chystaný turnus', () => {
  const l = turnusLabels(chystany)

  it('místo termínu řekne, že se chystá', () => {
    expect(l.datum).toBe('Termín upřesníme')
    expect(l.stav).toBe('Chystáme')
  })

  it('neslibuje místo, které není domluvené', () => {
    expect(l.misto).toBe('Místo upřesníme')
  })

  it('neuvádí cenu, dokud není jistá', () => {
    expect(l.cena).toBe('')
  })

  it('nevede na registraci, ale na sběr kontaktu', () => {
    expect(l.ctaHref).toBeNull()
    expect(l.ctaText).toBe('Chci vědět, až otevřeme')
  })
})

describe('turnusLabels — plný turnus', () => {
  it('nevede na registraci a řekne, že je plno', () => {
    const l = turnusLabels({ ...otevreny, status: 'plno' })
    expect(l.stav).toBe('Obsazeno')
    expect(l.ctaHref).toBeNull()
  })
})

describe('turnusLabels — termín přes dva měsíce', () => {
  it('vysází oba měsíce', () => {
    const l = turnusLabels({ ...otevreny, start: '2027-07-29', end: '2027-08-02' })
    expect(l.datum).toBe('29. července – 2. srpna 2027')
  })
})
```

- [ ] **Step 2: Pusť test a ověř, že padá**

Run: `npm test -- src/components/turnusy/turnus-card-labels.test.ts`
Expected: FAIL — `Failed to resolve import "./TurnusCard"`

- [ ] **Step 3: Napiš implementaci**

Vytvoř `src/components/turnusy/TurnusCard.tsx`. Napiš nejdřív čistou funkci `turnusLabels`, pak komponentu, která z ní čte:

```tsx
'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import { isBookable, type Turnus } from '@/lib/turnusy'
import { getCity, getVenue } from '@/lib/cities'
import { getFocusModules } from '@/lib/focus'
import { SpotsLeftBadge } from './SpotsLeft'

const MESICE_2P = [
  'ledna', 'února', 'března', 'dubna', 'května', 'června',
  'července', 'srpna', 'září', 'října', 'listopadu', 'prosince',
]

function denMesic(iso: string): { den: number; mesic: number; rok: number } {
  const d = new Date(iso + 'T12:00:00')
  return { den: d.getDate(), mesic: d.getMonth(), rok: d.getFullYear() }
}

/** Rozsah termínu česky: „12. – 16. července 2027", přes měsíce „29. července – 2. srpna 2027". */
function rozsahData(startIso: string, endIso: string): string {
  const a = denMesic(startIso)
  const b = denMesic(endIso)
  if (a.mesic === b.mesic && a.rok === b.rok) {
    return `${a.den}. – ${b.den}. ${MESICE_2P[b.mesic]} ${b.rok}`
  }
  return `${a.den}. ${MESICE_2P[a.mesic]} – ${b.den}. ${MESICE_2P[b.mesic]} ${b.rok}`
}

/**
 * Popisky karty turnusu jako čistá funkce — aby šly otestovat bez vykreslování.
 * Turnus, který není v prodeji, nedostane odkaz na registraci: `ctaHref` je
 * `null` a karta místo tlačítka nabídne sběr kontaktu.
 */
export function turnusLabels(turnus: Turnus) {
  const prodejny = isBookable(turnus)

  const datum =
    turnus.start && turnus.end ? rozsahData(turnus.start, turnus.end) : 'Termín upřesníme'

  const misto = turnus.venueId ? getVenue(turnus.venueId).name : 'Místo upřesníme'

  const cena = turnus.priceKc !== null ? `${turnus.priceKc.toLocaleString('cs-CZ')} Kč` : ''

  const stav =
    turnus.status === 'plno'
      ? 'Obsazeno'
      : turnus.status === 'chystame'
        ? 'Chystáme'
        : turnus.status === 'uzavreno'
          ? 'Proběhlo'
          : 'Přijímáme přihlášky'

  return {
    datum,
    mesto: getCity(turnus.city).name,
    misto,
    cena,
    stav,
    ctaText: prodejny ? 'Přihlásit dítě' : 'Chci vědět, až otevřeme',
    ctaHref: prodejny ? `/registrace?term=${turnus.id}` : null,
  }
}

export function TurnusCard({ turnus, spotsLeft }: { turnus: Turnus; spotsLeft?: number }) {
  const reduced = useReducedMotion()
  const l = turnusLabels(turnus)
  const prodejny = l.ctaHref !== null
  const zamereni = getFocusModules(turnus.focus)

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`card-maker flex flex-col bg-paper p-6 ${
        prodejny ? 'border border-ink/15' : 'border border-dashed border-ink/25'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <p className="mono-label">{l.mesto}</p>
        {prodejny && spotsLeft !== undefined ? (
          <SpotsLeftBadge spotsLeft={spotsLeft} maxCapacity={turnus.capacity} />
        ) : (
          <span className="font-mono text-xs uppercase tracking-wider text-ink/50">{l.stav}</span>
        )}
      </div>

      <h3 className="font-display text-xl font-semibold text-ink flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-ink/40 flex-shrink-0" aria-hidden="true" />
        {l.datum}
      </h3>

      <p className="flex items-center gap-2 text-sm text-ink-500 mb-3">
        <MapPin className="w-4 h-4 text-ink/40 flex-shrink-0" aria-hidden="true" />
        {l.misto}
      </p>

      {zamereni.length > 0 && (
        <p className="font-mono text-xs text-ink/50 mb-3">
          {zamereni.map((z) => z.name).join(' · ')}
        </p>
      )}

      <p className="text-sm text-ink-500 mb-6 flex-1">{turnus.perex}</p>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-ink/15">
        {l.cena ? (
          <span className="font-mono text-sm font-semibold text-ink">{l.cena}</span>
        ) : (
          <span className="font-mono text-xs text-ink/40">cenu upřesníme</span>
        )}
        <Link
          href={l.ctaHref ?? `/tabor/${turnus.slug}`}
          className={prodejny ? 'btn-primary text-sm' : 'btn-outline text-sm'}
        >
          {l.ctaText}
          <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  )
}
```

Pozn.: `SpotsLeftBadge` přesuneš v úkolu 3 — teď ještě neexistuje na téhle cestě. Import nech napsaný a **úkol 2 commituj až po úkolu 3**, pokud by build padal; pořadí v seznamu úkolů je ale takové, že úkol 3 běží první. Viz poznámka o pořadí níže.

> **Pořadí: tenhle úkol se provádí AŽ PO úkolu 3.** Karta importuje `SpotsLeftBadge` z `./SpotsLeft`, který na tuhle cestu přesouvá úkol 3.

- [ ] **Step 4: Pusť test a ověř, že prochází**

Run: `npm test -- src/components/turnusy/turnus-card-labels.test.ts`
Expected: PASS, 11 testů

- [ ] **Step 5: Ověř typovou správnost**

Run: `npx tsc --noEmit`
Expected: bez chyb

- [ ] **Step 6: Commit**

```bash
git add src/components/turnusy/TurnusCard.tsx src/components/turnusy/turnus-card-labels.test.ts
git commit -m "feat(struktura): karta turnusu pro úvodku, přehled i detail

Jedna komponenta pro tři místa. Turnus bez termínu, místa nebo ceny je
platný stav — karta ho ukáže čárkovaně a místo registrace nabídne sběr
kontaktu.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Přesun sdílených komponent z karlovarské sekce

`SpotsLeft`, `VenueShowcase` a `ProjectGallery` nejsou na Karlových Varech nijak závislé — jen tam náhodou vznikly. Přestěhují se dřív, než zbytek sekce zanikne.

> **Pořadí: tenhle úkol se provádí PŘED úkolem 2.** Úkol 2 importuje `SpotsLeftBadge` z nové cesty.

**Files:**
- Create: `src/components/turnusy/SpotsLeft.tsx` (přesun z `src/app/karlovy-vary/_components/SpotsLeft.tsx`)
- Create: `src/components/turnusy/VenueShowcase.tsx` (přesun)
- Create: `src/components/turnusy/ProjectGallery.tsx` (přesun)
- Modify: `src/app/karlovy-vary/letni-primestsky/page.tsx` (importy)
- Modify: `src/app/karlovy-vary/_components/KVRegistrationSection.tsx` (importy)

**Interfaces:**
- Consumes: `Venue` z `@/lib/cities`
- Produces:
  - `useTermCapacity(mesto?: string): CapacityMap | null`
  - `SpotsLeftBadge({ spotsLeft, maxCapacity }: { spotsLeft: number; maxCapacity: number })`
  - `VenueShowcase({ venue }: { venue: Venue })`
  - `ProjectGallery()`

- [ ] **Step 1: Přesuň soubory**

```bash
git mv src/app/karlovy-vary/_components/SpotsLeft.tsx src/components/turnusy/SpotsLeft.tsx
git mv src/app/karlovy-vary/_components/VenueShowcase.tsx src/components/turnusy/VenueShowcase.tsx
git mv src/app/karlovy-vary/_components/ProjectGallery.tsx src/components/turnusy/ProjectGallery.tsx
```

- [ ] **Step 2: Odpoj `VenueShowcase` od kontextu lokality**

`VenueShowcase` dnes čte místo konání přes `useLocation()`. Nově ho dostane jako vlastnost, aby šel použít i na stránce turnusu, která žádnou lokalitu nemá. V `src/components/turnusy/VenueShowcase.tsx`:

- odstraň import `useLocation` z `@/contexts/LocationContext` i import `Venue` z `@/lib/locations`,
- přidej `import type { Venue } from '@/lib/cities'`,
- změň signaturu na `export function VenueShowcase({ venue }: { venue: Venue })`,
- odstraň řádek, který si venue bere z lokality, a používej vlastnost `venue`,
- pole `address` z původního typu se v novém jmenuje `street` — uprav čtení adresy.

- [ ] **Step 3: Zúž `useTermCapacity` na nový parametr**

V `src/components/turnusy/SpotsLeft.tsx` změň signaturu z `useTermCapacity(locationId: string)` na `useTermCapacity(mesto?: string)` a sestav adresu tak, aby parametr byl nepovinný:

```ts
    const url = mesto ? `/api/term-capacity?mesto=${encodeURIComponent(mesto)}` : '/api/term-capacity'
    fetch(url)
```

Závislost `useEffect` uprav z `[locationId]` na `[mesto]`.

- [ ] **Step 4: Sraz volající s novými cestami**

Run: `grep -rn "_components/SpotsLeft\|_components/VenueShowcase\|_components/ProjectGallery" src/`

Každý nalezený import přepiš na `@/components/turnusy/…`. Volání `VenueShowcase` doplň o vlastnost `venue` — na karlovarských stránkách předej `location.venues[0]` převedené na nový tvar, nebo (jednodušší a správnější) `getVenue('fablab-varyte')` z `@/lib/cities`. Volání `useTermCapacity(location.id)` nech být, hodnota je pořád platná.

- [ ] **Step 5: Ověř, že se nic nerozbilo**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: `tsc` bez chyb, testy prochází, build projde

- [ ] **Step 6: Commit**

```bash
git add src/components/turnusy/ src/app/karlovy-vary/
git commit -m "refactor(struktura): přesunout sdílené komponenty z karlovarské sekce

SpotsLeft, VenueShowcase a ProjectGallery nejsou na jednom městě závislé.
VenueShowcase nově dostává místo konání vlastností, ne z kontextu lokality,
aby šel použít i na stránce turnusu.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Seznam turnusů s filtrem měst

Filtr se podle specifikace zobrazí, jen když jsou turnusy ve dvou a více městech. Stav filtru patří do adresy (`?mesto=`), aby šel odkaz poslat i použít v reklamě.

**Files:**
- Create: `src/components/turnusy/TurnusList.tsx`
- Test: `src/components/turnusy/turnus-list-filter.test.ts`

**Interfaces:**
- Consumes: `getTurnusy`, `getTurnusyByCity`, `getCitiesWithTurnusy`, `Turnus` z `@/lib/turnusy`; `getCity`, `CityId` z `@/lib/cities`; `TurnusCard`, `useTermCapacity` z sousedních souborů
- Produces:
  - `filtrMest(list: Turnus[]): Array<{ id: CityId; name: string; pocet: number }>` — prázdné pole, když filtr nemá smysl
  - `TurnusList({ turnusy }: { turnusy: Turnus[] })`

- [ ] **Step 1: Napiš padající test**

Vytvoř `src/components/turnusy/turnus-list-filter.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { filtrMest } from './TurnusList'
import type { Turnus } from '@/lib/turnusy'

const kv: Turnus = {
  id: 'kv-1', slug: 'kv-1', city: 'karlovy-vary', venueId: 'fablab-varyte',
  start: '2027-07-12', end: '2027-07-16', priceKc: 4990, capacity: 15,
  status: 'otevreno', focus: ['3d-tisk'], ageRange: '9-15', perex: 'Turnus ve Varech.',
}
const kv2: Turnus = { ...kv, id: 'kv-2', slug: 'kv-2', start: '2027-08-02', end: '2027-08-06' }
const praha: Turnus = {
  ...kv, id: 'praha-1', slug: 'praha-1', city: 'praha', venueId: null,
  start: null, end: null, priceKc: null, status: 'chystame', perex: 'Turnus v Praze.',
}

describe('filtrMest', () => {
  it('při jednom městě filtr nenabídne — přepínání by byla jen překážka', () => {
    expect(filtrMest([kv, kv2])).toEqual([])
  })

  it('při dvou městech vrátí obě i s počty', () => {
    const f = filtrMest([kv, kv2, praha])
    expect(f.map((m) => m.id).sort()).toEqual(['karlovy-vary', 'praha'])
    expect(f.find((m) => m.id === 'karlovy-vary')?.pocet).toBe(2)
    expect(f.find((m) => m.id === 'praha')?.pocet).toBe(1)
  })

  it('pojmenuje města lidsky, ne identifikátorem', () => {
    const f = filtrMest([kv, praha])
    expect(f.find((m) => m.id === 'karlovy-vary')?.name).toBe('Karlovy Vary')
  })

  it('u prázdného seznamu filtr nenabídne', () => {
    expect(filtrMest([])).toEqual([])
  })
})
```

- [ ] **Step 2: Pusť test a ověř, že padá**

Run: `npm test -- src/components/turnusy/turnus-list-filter.test.ts`
Expected: FAIL — `Failed to resolve import "./TurnusList"`

- [ ] **Step 3: Napiš implementaci**

Vytvoř `src/components/turnusy/TurnusList.tsx`:

```tsx
'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { Turnus } from '@/lib/turnusy'
import { getCity, type CityId } from '@/lib/cities'
import { TurnusCard } from './TurnusCard'
import { useTermCapacity } from './SpotsLeft'

/**
 * Města, mezi kterými má smysl filtrovat.
 *
 * Při jednom městě vrací prázdné pole — přepínač nad seznamem, který se vejde
 * na obrazovku, je jen překážka. Přesně tím se web zbavuje překlikávání měst,
 * aniž by o tu možnost přišel při expanzi.
 */
export function filtrMest(list: Turnus[]): Array<{ id: CityId; name: string; pocet: number }> {
  const pocty = new Map<CityId, number>()
  for (const t of list) {
    pocty.set(t.city, (pocty.get(t.city) ?? 0) + 1)
  }
  if (pocty.size < 2) return []
  return Array.from(pocty.entries()).map(([id, pocet]) => ({
    id,
    name: getCity(id).name,
    pocet,
  }))
}

function TurnusListContent({ turnusy }: { turnusy: Turnus[] }) {
  const searchParams = useSearchParams()
  const vybrane = searchParams.get('mesto') as CityId | null
  const mesta = filtrMest(turnusy)

  const zobrazene =
    vybrane && mesta.some((m) => m.id === vybrane)
      ? turnusy.filter((t) => t.city === vybrane)
      : turnusy

  const capacity = useTermCapacity(vybrane ?? undefined)

  if (turnusy.length === 0) {
    return (
      <p className="text-ink-500">
        Termíny na příští léto teprve chystáme. Nechte nám kontakt níž a ozveme se vám mezi prvními.
      </p>
    )
  }

  return (
    <div>
      {mesta.length > 0 && (
        <nav className="flex flex-wrap gap-2 mb-8" aria-label="Filtr podle města">
          <Link
            href="/tabor"
            scroll={false}
            aria-current={vybrane === null ? 'true' : undefined}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-colors ${
              vybrane === null
                ? 'border-ink bg-ink text-paper'
                : 'border-ink/15 text-ink-500 hover:border-ink/40'
            }`}
          >
            Všechna města
          </Link>
          {mesta.map((m) => (
            <Link
              key={m.id}
              href={`/tabor?mesto=${m.id}`}
              scroll={false}
              aria-current={vybrane === m.id ? 'true' : undefined}
              className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-colors ${
                vybrane === m.id
                  ? 'border-ink bg-ink text-paper'
                  : 'border-ink/15 text-ink-500 hover:border-ink/40'
              }`}
            >
              {m.name} ({m.pocet})
            </Link>
          ))}
        </nav>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {zobrazene.map((turnus) => (
          <TurnusCard
            key={turnus.id}
            turnus={turnus}
            spotsLeft={capacity?.[turnus.id]?.spotsLeft}
          />
        ))}
      </div>
    </div>
  )
}

export function TurnusList({ turnusy }: { turnusy: Turnus[] }) {
  // useSearchParams vyžaduje Suspense hranici, jinak Next 16 odmítne prerender.
  return (
    <Suspense fallback={<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" />}>
      <TurnusListContent turnusy={turnusy} />
    </Suspense>
  )
}
```

- [ ] **Step 4: Pusť test a ověř, že prochází**

Run: `npm test -- src/components/turnusy/turnus-list-filter.test.ts`
Expected: PASS, 4 testy

- [ ] **Step 5: Commit**

```bash
git add src/components/turnusy/TurnusList.tsx src/components/turnusy/turnus-list-filter.test.ts
git commit -m "feat(struktura): seznam turnusů s filtrem měst v adrese

Filtr se ukáže, jen když jsou turnusy ve dvou a více městech — tím mizí
překlikávání měst, aniž bychom o tu možnost přišli při expanzi. Stav je
v adrese, aby šel odkaz poslat i použít v reklamě.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Formulář zájmu o chystaný turnus

Web se spouští do mrtvé sezóny — v den nasazení nebude k prodeji ani jeden turnus. Hlavní výzva proto nemůže být „přihlásit", ale „nechte kontakt". Existující off-season panel (`src/app/karlovy-vary/_components/SeasonClosed.tsx`) tohle umí, ale je navázaný na `location.season`. Nová verze se váže na turnus.

**Files:**
- Create: `src/components/turnusy/TurnusInterestForm.tsx`

Formulář odesílá přes `fetch` do Formspree, což se v tomhle repozitáři netestuje jednotkovými testy (žádný jiný formulář testy nemá). Ověření je ruční, v kroku 3.

**Interfaces:**
- Consumes: `Turnus` z `@/lib/turnusy`; `getCity` z `@/lib/cities`; `trackSeasonInterest` z `@/lib/analytics`
- Produces: `TurnusInterestForm({ turnus, source }: { turnus?: Turnus; source: string })` — bez turnusu sbírá zájem o celou příští sezónu

- [ ] **Step 1: Napiš implementaci**

Vytvoř `src/components/turnusy/TurnusInterestForm.tsx`. Vyjdi z `src/app/karlovy-vary/_components/SeasonClosed.tsx` — přečti si ho a zachovej z něj strukturu stavů (odesílání, chyba, potvrzení), vzhled i ošetření chyb. Změny oproti předloze:

- odstraň `useLocation` a všechno, co čte `location.season`; podmínku `if (!season || season.status !== 'ended') return null` vypusť,
- komponenta bere `turnus?: Turnus` a `source: string`,
- nadpis a text se odvozují od turnusu: když je předaný, „Chcete vědět, až tenhle turnus otevřeme?" a pod ním město z `getCity(turnus.city).name`; když není, „Chcete vědět o termínech mezi prvními?",
- do těla odeslaného do Formspree pošli `program` ve tvaru `` `${mesto} — zájem o turnus ${turnus.id}` `` (nebo `Zájem o příští sezónu`, když turnus není), `zdroj: source` a `_subject` ve stejném duchu,
- zachovej volání `trackSeasonInterest`, aby zájem dál chodil do analytiky,
- input pro e-mail i jméno musí mít svázaný `<label>` (v předloze je — nepřijď o něj),
- zachovej `FORMSPREE_ID` z proměnné prostředí se stejným záložním klíčem jako předloha.

- [ ] **Step 2: Ověř typovou správnost a build**

Run: `npx tsc --noEmit && npm run build`
Expected: `tsc` bez chyb, build projde

- [ ] **Step 3: Ověř ručně v prohlížeči**

Spusť `npm run dev` a otevři `http://localhost:3000/karlovy-vary` — ověř, že se původní off-season panel pořád zobrazuje a funguje (nový formulář zatím nikde není použitý, takže se nesmí nic rozbít). Do reportu napiš, co jsi viděl.

- [ ] **Step 4: Commit**

```bash
git add src/components/turnusy/TurnusInterestForm.tsx
git commit -m "feat(struktura): sběr kontaktu na chystaný turnus

Web se spouští do mrtvé sezóny — hlavní výzva nemůže být přihlásit, ale
nechte kontakt. Formulář se váže na turnus místo na sezónu lokality.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Stránka `/tabor`

Vlajková stránka. Vzniká adaptací `src/app/karlovy-vary/letni-primestsky/page.tsx` — 647 řádků hotového obsahu v novém designu, ze kterého se odeberou odkazy na jedno město.

**Files:**
- Create: `src/app/tabor/page.tsx` (adaptace existující stránky)
- Create: `src/app/tabor/layout.tsx`

**Interfaces:**
- Consumes: `getTurnusy` z `@/lib/turnusy`; `getSiteFaq`, `SITE` z `@/lib/site`; `TurnusList`, `ProjectGallery`, `TurnusInterestForm` z `@/components/turnusy/…`
- Produces: stránka na adrese `/tabor`

- [ ] **Step 1: Založ stránku z existující předlohy**

```bash
mkdir -p src/app/tabor
cp src/app/karlovy-vary/letni-primestsky/page.tsx src/app/tabor/page.tsx
```

- [ ] **Step 2: Odpoj stránku od jednoho města**

V `src/app/tabor/page.tsx` proveď tyhle změny. Původní stránku v `karlovy-vary/` **neměň** — pořád musí fungovat, maže se až v úkolu 10.

1. Odstraň importy `useLocation` z `@/contexts/LocationContext` a `buildPath` z `@/lib/locations`. Přidej `import { getTurnusy } from '@/lib/turnusy'` a `import { SITE } from '@/lib/site'`.
2. Importy komponent přepiš z `../_components/…` na `@/components/turnusy/…`.
3. Odstraň import a použití `SeasonClosedPanel` a `CampViewTracker` (analytika turnusů přijde ve fázi 5) a `useTermCapacity`/`SpotsLeftBadge` — obsazenost nově řeší `TurnusList` uvnitř karet.
4. Všechny odkazy `buildPath(location, …)` nahraď statickými cestami (`/`, `/kontakt`).
5. V drobečkové navigaci nech „Domů" → `/` a text stránky změň z „Letní příměstský tábor" beze změny (název zůstává).
6. Nahraď tyhle konkrétní texty:

| Původní | Nové |
|---|---|
| `Celý týden 3D tisk, 3D modelování a IoT s Arduinem — ve FabLabu Kreativního centra VARY&TE v Karlových Varech.` | `Celý týden 3D tisk, 3D modelování a IoT s Arduinem. Malá skupina, jeden lektor na pět dětí a hotový výrobek, který si dítě odveze domů.` |
| `V Karlových Varech je jen 15 míst na turnus` | `Na jeden turnus bereme jen 15 dětí` |
| zbylé výskyty (najdi je příkazem `grep -n "Karlov\|VARY&TE\|Vary" src/app/tabor/page.tsx`) | přepiš tak, aby věta nemluvila o jednom městě; jedinou výjimkou je popis konkrétního místa konání, který se vykresluje z dat turnusu |

7. Celou sekci `id="registrace"` (dnes vypisuje karlovarské termíny) nahraď sekcí `id="turnusy"` se stejným tmavým podkladem, která uvnitř vykreslí `<TurnusList turnusy={getTurnusy()} />` a pod ním `<TurnusInterestForm source="tabor" />`.
8. Sekci s místem konání (`VenueShowcase`) uprav tak, aby se zobrazila jen tehdy, když nějaký turnus místo má — místo je nově vlastnost turnusu, ne stránky. Když žádný turnus místo nemá, sekci vynech.
9. FAQ na stránce vykresli z `getSiteFaq()`.

- [ ] **Step 3: Vytvoř popis pro vyhledávače**

Vytvoř `src/app/tabor/layout.tsx`:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Letní příměstský tábor chytrých technologií | Weeks',
  description:
    'Týdenní příměstský tábor pro děti 9–15 let. 3D tisk, 3D modelování a IoT s Arduinem, jeden lektor na pět dětí, oběd i materiál v ceně.',
  alternates: { canonical: 'https://weeks.cz/tabor' },
}

export default function TaborLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

- [ ] **Step 4: Ověř, že stránka staví a jede**

Run: `npx tsc --noEmit && npm run build`
Expected: `tsc` bez chyb, build projde a ve výpisu rout je `/tabor`

Pak spusť `npm run dev` a otevři `http://localhost:3000/tabor`. Ověř: stránka se vykreslí, sekce turnusů ukazuje obě karty ve stavu „Chystáme" (čárkovaně, bez ceny), filtr měst je vidět (jsou dvě města), a nikde na stránce už není zmínka o jednom konkrétním městě mimo popis místa konání. Do reportu napiš, co jsi viděl.

- [ ] **Step 5: Ověř, že stará stránka pořád funguje**

Otevři `http://localhost:3000/karlovy-vary/letni-primestsky` — musí se dál vykreslovat beze změny. Do reportu napiš výsledek.

- [ ] **Step 6: Commit**

```bash
git add src/app/tabor/
git commit -m "feat(struktura): vlajková stránka /tabor

Adaptace karlovarské stránky letního tábora bez vazby na jedno město.
Termíny nahrazuje seznam turnusů s filtrem měst, místo konání je nově
vlastností turnusu.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Stránka turnusu `/tabor/[turnus]`

Kratší, prodejní varianta. Rodič z reklamy na konkrétní termín chce datum, cenu a tlačítko — ne dlouhé vyprávění. Město v adrese i v titulku vrací lokální SEO ztracené zrušením `/karlovy-vary`.

**Files:**
- Create: `src/app/tabor/[turnus]/page.tsx`
- Create: `src/app/tabor/[turnus]/layout.tsx`

**Interfaces:**
- Consumes: `getTurnus`, `getTurnusy`, `isBookable` z `@/lib/turnusy`; `getCity`, `getVenue` z `@/lib/cities`; `getFocusModules` z `@/lib/focus`; `turnusLabels`, `TurnusCard`, `VenueShowcase`, `TurnusInterestForm` z `@/components/turnusy/…`
- Produces: stránka na adrese `/tabor/[slug]`

- [ ] **Step 1: Napiš stránku**

Vytvoř `src/app/tabor/[turnus]/page.tsx` jako serverovou komponentu (žádné `'use client'`), která:

1. přes `generateStaticParams` vrátí slug každého turnusu z `getTurnusy()`,
2. turnus dohledá `getTurnus(params.turnus)`; když neexistuje, zavolá `notFound()` z `next/navigation`,
3. vykreslí `<Header />`, `<main>` a `<Footer />` ve stejném pořadí jako `/tabor`,
4. v hlavičce stránky ukáže drobečkovou navigaci `Domů → Tábor → <město a termín>`, mono popisek s městem, nadpis s termínem, perex turnusu a pod tím čtyři údaje ve stejné mřížce, jakou používá `/tabor`: délka, čas, kapacita, cena,
5. u prodejného turnusu ukáže výrazné tlačítko `Přihlásit dítě` vedoucí na `/registrace?term=<id>`; u neprodejného místo něj `<TurnusInterestForm turnus={turnus} source={'turnus-' + turnus.slug} />`,
6. vykreslí zaměření turnusu z `getFocusModules(turnus.focus)` — u každého název, jednovětý popis a odrážky `tryOut`,
7. když má turnus místo konání, vykreslí `<VenueShowcase venue={getVenue(turnus.venueId)} />`,
8. na konci stránky vykreslí ostatní turnusy: `getTurnusy().filter(t => t.id !== turnus.id)` v `TurnusCard`, pod nadpisem „Další termíny". Když žádné další nejsou, sekci vynech.

Popisky ber z `turnusLabels(turnus)` — datum, město, místo, cena i stav už umí, není třeba je počítat znovu.

- [ ] **Step 2: Napiš popis pro vyhledávače s městem v titulku**

Vytvoř `src/app/tabor/[turnus]/layout.tsx`, který jen předá `children`, a **do `page.tsx`** přidej `generateMetadata`:

```tsx
export async function generateMetadata({ params }: { params: Promise<{ turnus: string }> }): Promise<Metadata> {
  const { turnus: slug } = await params
  const turnus = getTurnus(slug)
  if (!turnus) return {}

  const mesto = getCity(turnus.city).name
  const l = turnusLabels(turnus)

  return {
    title: `Letní IT tábor ${mesto} — ${l.datum} | Weeks`,
    description: turnus.perex,
    alternates: { canonical: `https://weeks.cz/tabor/${turnus.slug}` },
  }
}
```

Pozn.: v Next 16 je `params` Promise — v `page.tsx` ho rozbal stejně (`const { turnus: slug } = await params`).

- [ ] **Step 3: Ověř, že stránka staví a jede**

Run: `npx tsc --noEmit && npm run build`
Expected: `tsc` bez chyb, build projde a ve výpisu rout jsou obě stránky turnusů

Pak `npm run dev` a otevři `http://localhost:3000/tabor/karlovy-vary-leto-2027` i `http://localhost:3000/tabor/praha-leto-2027`. Ověř, že se obě vykreslí, ukazují správné město, mají formulář zájmu (oba turnusy jsou „chystáme") a v patičce nabízejí ten druhý turnus. Otevři i neexistující slug a ověř, že vrátí 404. Do reportu napiš výsledky.

- [ ] **Step 4: Commit**

```bash
git add src/app/tabor/
git commit -m "feat(struktura): stránka pro každý turnus

Rodič z reklamy na konkrétní termín chce datum, cenu a tlačítko, ne dlouhé
vyprávění. Město v adrese i v titulku vrací lokální SEO, o které přijdeme
zrušením /karlovy-vary.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Přestavěná úvodka

Úvodka přestává být katalogem programů a stává se rozcestím. Podle specifikace **není** stránkou tábora.

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/sections/HeroSection.tsx`
- Modify: `src/components/sections/USPSection.tsx`
- Modify: `src/components/sections/FAQSection.tsx`
- Modify: `src/components/sections/ContactSection.tsx`

**Interfaces:**
- Consumes: `getTurnusy` z `@/lib/turnusy`; `SITE`, `getSiteFaq` z `@/lib/site`; `TurnusCard` z `@/components/turnusy/TurnusCard`
- Produces: přestavěná `/`

- [ ] **Step 1: Odpoj sekce od kontextu lokality**

V `HeroSection.tsx`, `USPSection.tsx`, `FAQSection.tsx` a `ContactSection.tsx` odstraň `useLocation` a nahraď čtení:

- kontakt (`location.contact.phone`, `location.contact.email`) → `SITE.phone`, `SITE.email`
- otázky a odpovědi FAQ → `getSiteFaq()`
- `location.hero.badge` / `location.hero.subtitle` → napiš pevný text: mono kóta `Praha · Karlovy Vary` a podtitul `Týdenní příměstské tábory, kde si děti postaví vlastní věc — od 3D modelu po zařízení, které samy naprogramují.`
- `location.season` a `seasonEnded` → odvoď od turnusů: `const nicKProdeji = getTurnusy().every((t) => !isBookable(t))`; když je `true`, hlavní tlačítko vede na `/tabor#turnusy` s textem `Chci vědět o termínech`, jinak `Vybrat turnus`
- věk v hero (`location.programs[0].ageRange`) → `'9–15'` natvrdo, nebo z prvního turnusu přes `getTurnusy()[0]?.ageRange`
- `location.usps` → ponech texty, které tam dnes jsou pro Karlovy Vary, ale zbav je zmínek o jednom městě

Pozor: tyhle komponenty používají i staré stránky, které ještě žijí. Po téhle změně na nich uvidíš globální kontakt místo lokálního — to je v pořádku, telefon i e-mail jsou pro obě města stejné.

- [ ] **Step 2: Přestav úvodku**

Nahraď obsah `src/app/page.tsx`:

```tsx
import { HeroSection } from '@/components/sections/HeroSection'
import { TickerStrip } from '@/components/ui/TickerStrip'
import { USPSection } from '@/components/sections/USPSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { OrganizationSchema, LocalBusinessSchema, EventSchema } from '@/components/seo/StructuredData'
import { NejblizsiTurnusy } from '@/components/sections/NejblizsiTurnusy'
import { Rozcesti } from '@/components/sections/Rozcesti'

export default function Home() {
  return (
    <>
      <OrganizationSchema />
      <LocalBusinessSchema />
      <EventSchema />
      <Header />
      <main>
        <HeroSection />
        <TickerStrip />
        <NejblizsiTurnusy />
        <USPSection />
        <Rozcesti />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Napiš dvě nové sekce úvodky**

Vytvoř `src/components/sections/NejblizsiTurnusy.tsx` — serverová komponenta, která vezme `getTurnusy().slice(0, 3)`, vykreslí je v `TurnusCard` v mřížce a pod nimi odkaz `Všechny turnusy` na `/tabor`. Když je seznam prázdný, vykreslí místo karet větu `Termíny na příští léto vypíšeme na podzim. Nechte nám kontakt a ozveme se vám mezi prvními.` s odkazem na `/tabor#turnusy`. Vizuálně drž styl ostatních sekcí: `section-padding`, `section-container`, nadpis `heading-2`, mono popisek `mono-label`.

Vytvoř `src/components/sections/Rozcesti.tsx` — čtyři karty ve stejném stylu jako `TurnusCard` (1px rámeček, tvrdý stín), každá s nadpisem, jednou větou a odkazem:

| Nadpis | Věta | Odkaz |
|---|---|---|
| Letní tábor | Týdenní příměstský tábor pro děti 9–15 let. | `/tabor` |
| Pro firmy | Dny pro děti zaměstnanců, workshopy pro týmy a partnerství. | `/firmy` |
| E-shop | Stavebnice a materiál, se kterým děti pracují na táboře. | `/eshop` |
| Učebna | Online kurzy, ve kterých se dá pokračovat i po táboře. | `https://iot.weeks.cz/` |

Odkaz na učebnu je externí — přidej `target="_blank"`, `rel="noopener noreferrer"` a `aria-label` s vysvětlením, že se otevře v nové záložce, stejně jako to dělá `Header.tsx`.

Pozn.: `/firmy` zatím neexistuje — vzniká ve fázi 4. Odkaz nech, ve fázi 4 se zprovozní; do té doby vede na 404, což je na neveřejné větvi v pořádku.

- [ ] **Step 4: Ověř, že úvodka staví a jede**

Run: `npx tsc --noEmit && npm run build`
Expected: bez chyb

`npm run dev`, otevři `http://localhost:3000/`. Ověř: hero má nový podtitul, sekce nejbližších turnusů ukazuje obě karty „Chystáme", rozcestí má čtyři karty, FAQ ukazuje otázky z globální konfigurace, kontakt ukazuje telefon a e-mail. Do reportu napiš, co jsi viděl.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components/sections/
git commit -m "feat(struktura): úvodka jako rozcestí místo katalogu programů

Úvodka není stránkou tábora — vede na tábor, firmy, e-shop a učebnu, a
ukazuje nejbližší turnusy. Sekce se odpojily od kontextu lokality a čtou
globální konfiguraci webu.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Navigace bez přepínače měst

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `SITE` z `@/lib/site`
- Produces: navigace bez `CitySwitcher` a bez `useLocation`

- [ ] **Step 1: Přepiš navigaci v hlavičce**

V `src/components/layout/Header.tsx`:

- odstraň import a obě použití `CitySwitcher` (dnes na řádcích 112 a 126),
- odstraň `useLocation` a větvení odkazů podle lokality,
- položky nabídky nahraď pevným seznamem:

```ts
  const navItems = [
    { name: 'Tábor', href: '/tabor' },
    { name: 'Pro firmy', href: '/firmy' },
    { name: 'E-shop', href: '/eshop' },
    { name: 'O nás', href: '/o-nas' },
    { name: 'Kontakt', href: '/kontakt' },
  ]
```

- hlavní tlačítko (`ctaHref`) nastav na `/tabor#turnusy` s textem `Vybrat turnus`,
- odkaz na učebnu (`https://iot.weeks.cz/`) ponech i s jeho `aria-label`,
- logo dál vede na `/`.

- [ ] **Step 2: Přepiš patičku**

V `src/components/layout/Footer.tsx`:

- odstraň `useLocation` a `buildPath`, odkazy napiš staticky (`/tabor`, `/firmy`, `/eshop`, `/o-nas`, `/kontakt`, `/gdpr`, `/podminky`),
- kontakt čti z `SITE`,
- pod kontakt přidej řádek s identifikací provozovatele: `{SITE.legalName}, IČO {SITE.ico}` a na dalším řádku `{SITE.address}`. Sázej drobně (`font-mono text-xs text-ink/50`), ať to nepřebíjí zbytek patičky.

- [ ] **Step 3: Ověř**

Run: `npx tsc --noEmit && npm run build`
Expected: bez chyb

`npm run dev`, projdi `/`, `/tabor` a `/o-nas`. Ověř, že v hlavičce není přepínač měst, nabídka má pět položek a patička uvádí Weeks s.r.o. s IČO. Do reportu napiš výsledek.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat(struktura): navigace bez přepínače měst

Město přestává být větví webu, takže přepínač v hlavičce nemá co
přepínat. Patička nově uvádí provozovatele Weeks s.r.o. s IČO.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Smazání starých stránek a přesměrování

Poslední a jediný ničivý úkol. Přesměrování vzniká **ve stejném commitu** jako mazání, aby neexistoval okamžik, kdy adresa vrací 404.

**Files:**
- Delete: `src/app/program/`, `src/app/tabor-3d-tisk/`, `src/app/tabor-iot/`, `src/app/tabor-chytrych-technologii/`, `src/app/kveten/`, `src/app/karlovy-vary/`
- Delete: `src/components/ui/CitySwitcher.tsx`, `src/contexts/LocationContext.tsx`
- Delete: `src/components/sections/{ProgramSection,UpcomingTermsSection,CTASection,TrustSection}.tsx`, `src/components/camps/TermsList.tsx`
- Modify: `next.config.js`

**Interfaces:**
- Consumes: nic
- Produces: trvalá přesměrování ze všech zaniklých adres

- [ ] **Step 1: Přidej přesměrování**

V `next.config.js` přidej do exportovaného objektu vedle `headers`:

```js
  async redirects() {
    return [
      // Katalog programů a jednodenní tábory splývají do jedné stránky tábora.
      { source: '/program', destination: '/tabor', permanent: true },
      { source: '/tabor-chytrych-technologii', destination: '/tabor', permanent: true },
      { source: '/tabor-3d-tisk', destination: '/tabor', permanent: true },
      { source: '/tabor-iot', destination: '/tabor', permanent: true },
      { source: '/kveten', destination: '/tabor', permanent: true },
      // Město přestává být větví webu — karlovarské adresy míří na svůj protějšek,
      // ne plošně na úvodku, ať se neztratí zpětné odkazy ani cíle reklam.
      { source: '/karlovy-vary', destination: '/tabor?mesto=karlovy-vary', permanent: true },
      { source: '/karlovy-vary/letni-primestsky', destination: '/tabor?mesto=karlovy-vary', permanent: true },
      { source: '/karlovy-vary/tabor-chytrych-technologii', destination: '/tabor?mesto=karlovy-vary', permanent: true },
      { source: '/karlovy-vary/o-nas', destination: '/o-nas', permanent: true },
      { source: '/karlovy-vary/kontakt', destination: '/kontakt', permanent: true },
      { source: '/karlovy-vary/gdpr', destination: '/gdpr', permanent: true },
      { source: '/karlovy-vary/podminky', destination: '/podminky', permanent: true },
    ]
  },
```

- [ ] **Step 2: Smaž stránky a osiřelé komponenty**

```bash
git rm -r src/app/program src/app/tabor-3d-tisk src/app/tabor-iot src/app/tabor-chytrych-technologii src/app/kveten src/app/karlovy-vary
git rm src/components/ui/CitySwitcher.tsx src/contexts/LocationContext.tsx
git rm src/components/sections/ProgramSection.tsx src/components/sections/UpcomingTermsSection.tsx src/components/sections/CTASection.tsx src/components/sections/TrustSection.tsx
git rm src/components/camps/TermsList.tsx
```

- [ ] **Step 3: Najdi a odstraň osiřelé odkazy**

Run: `grep -rn "LocationContext\|CitySwitcher\|ProgramSection\|UpcomingTermsSection\|CTASection\|TrustSection\|camps/TermsList\|karlovy-vary" src/ --include="*.tsx" --include="*.ts"`

Každý zbylý import nebo odkaz vyřeš:
- import smazané komponenty → odstraň i její použití,
- odkaz na `/karlovy-vary/...` v textu nebo v `href` → přesměruj na nový protějšek podle tabulky výše,
- `useLocation` kdekoliv → nahraď čtením ze `SITE`, `getTurnusy()` nebo `getCity()`.

Soubory `src/lib/locations.ts`, `src/lib/camps.ts`, `src/app/api/capacity/`, `src/app/api/camps/` a `src/app/api/cron/nastupni-list/` **nemaž** — drží je e-maily a hub, padnou ve fázi 3.

- [ ] **Step 4: Ověř, že nic nezůstalo viset**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: `tsc` bez chyb, testy prochází, build projde

Ve výpisu rout z buildu zkontroluj, že zmizely `/program`, `/tabor-3d-tisk`, `/tabor-iot`, `/tabor-chytrych-technologii`, `/kveten` i všechny `/karlovy-vary/*`.

- [ ] **Step 5: Ověř přesměrování za běhu**

`npm run dev`, pak pro každou zaniklou adresu ověř, že vrací 308 nebo 301 a míří na správný cíl:

```bash
for u in /program /tabor-chytrych-technologii /tabor-3d-tisk /tabor-iot /kveten /karlovy-vary /karlovy-vary/letni-primestsky /karlovy-vary/o-nas /karlovy-vary/kontakt /karlovy-vary/gdpr /karlovy-vary/podminky; do
  echo "$u -> $(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "http://localhost:3000$u")"
done
```

Všech jedenáct musí přesměrovávat, žádná nesmí vrátit 404. Výstup vlož do reportu.

- [ ] **Step 6: Commit**

```bash
git add next.config.js src/
git commit -m "feat(struktura): smazat staré stránky a přesměrovat je na protějšky

Z 23 veřejných stránek zbývá 11. Každá zaniklá adresa má vlastní trvalé
přesměrování, ne plošné na úvodku — konsolidace odkazů a zachování cílů
běžících reklam.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Sitemap, strukturovaná data a kanonické adresy

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/seo/StructuredData.tsx`

**Interfaces:**
- Consumes: `getTurnusy` z `@/lib/turnusy`; `getCity`, `getVenue` z `@/lib/cities`; `SITE` z `@/lib/site`
- Produces: sitemap a strukturovaná data odpovídající nové struktuře

- [ ] **Step 1: Přepiš sitemap**

Nahraď obsah `src/app/sitemap.ts` tak, aby vracel:

- `/` s prioritou 1,
- `/tabor` s prioritou 0.95,
- `/tabor/<slug>` pro každý turnus z `getTurnusy()` s prioritou 0.9,
- `/firmy`, `/eshop`, `/o-nas`, `/kontakt` s prioritou 0.7,
- `/gdpr` a `/podminky` s prioritou 0.3.

Celou logiku kolem `isKvPreLaunch` a `PREVIEW_AUTH_USER` odstraň — karlovarské cesty zanikly, není co skrývat. `changeFrequency` nech `weekly` u tábora a turnusů, `monthly` u zbytku.

- [ ] **Step 2: Sraz strukturovaná data s novou strukturou**

V `src/components/seo/StructuredData.tsx`:

- `OrganizationSchema`: `name` = `SITE.name`, `legalName` = `SITE.legalName`, `url` = `SITE.url`, `telephone` = `SITE.phone`, `email` = `SITE.email`. Přidej `identifier` s IČO ve tvaru `{ '@type': 'PropertyValue', propertyID: 'ICO', value: SITE.ico }`. Odstraň všechny zmínky o DDM.
- `LocalBusinessSchema`: adresu ber ze `SITE.address` rozloženou na ulici, město a PSČ.
- `EventSchema`: generuj jednu položku pro každý **prodejný** turnus (`isBookable`) — `name` ve tvaru `Letní IT tábor <město> <datum>`, `startDate`/`endDate` z turnusu, `location` z `getVenue`, `offers.price` z `turnus.priceKc` a `offers.priceCurrency: 'CZK'`, `url` na `/tabor/<slug>`. Když není prodejný ani jeden turnus, nevykresluj `EventSchema` vůbec — prázdné nebo vymyšlené události jsou horší než žádné.

- [ ] **Step 3: Ověř**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: bez chyb

`npm run dev`, pak:

```bash
curl -s http://localhost:3000/sitemap.xml | grep -c "<url>"
curl -s http://localhost:3000/ | grep -o "application/ld+json" | wc -l
curl -s http://localhost:3000/ | grep -ci "ddm" || echo "0 zmínek o DDM na úvodce"
```

Očekávej: sitemap má 11 adres (4 pevné + 2 turnusy + 4 + … podle skutečného počtu, ověř že tam jsou `/tabor` i obě stránky turnusů), strukturovaná data se vykreslují, a na úvodce už není ani jedna zmínka o DDM. Výstupy vlož do reportu.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/components/seo/StructuredData.tsx
git commit -m "feat(struktura): sitemap a strukturovaná data podle nové struktury

Sitemap generuje stránku každého turnusu, strukturovaná data popisují
jako událost jen turnus, který je skutečně v prodeji. Identita provozovatele
přechází na Weeks s.r.o.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Hotovo, když

- `npm test` prochází, `npx tsc --noEmit` je bez chyb, `npm run build` projde
- Ve výpisu rout existují `/tabor` a `/tabor/[turnus]`, a neexistují `/program`, `/tabor-3d-tisk`, `/tabor-iot`, `/tabor-chytrych-technologii`, `/kveten` ani žádná `/karlovy-vary/*`
- Všech jedenáct zaniklých adres trvale přesměrovává na svůj protějšek, žádná nevrací 404
- Na úvodce ani na `/tabor` není zmínka o DDM ani o jednom konkrétním městě mimo popis místa konání
- V hlavičce není přepínač měst; filtr měst je na `/tabor` a jeho stav se propisuje do adresy
- `grep -rn "useLocation" src/` nevrátí nic

## Co tahle fáze schválně nedělá

- **Nemaže `locations.ts` ani `camps.ts`.** Drží je e-maily, nástupní list a `/api/capacity`. Padnou ve fázi 3 spolu s DDM.
- **Neřeší identitu Weeks s.r.o. v právních textech.** Patička a strukturovaná data ano, GDPR a obchodní podmínky až ve fázi 3.
- **Nestaví `/firmy`.** Rozcestí na ni odkazuje, stránka vzniká ve fázi 4.
- **Neřeší analytické události pro turnusy.** Fáze 5.

---

### Task 12: Registrace podle turnusu

> **Pořadí: tenhle úkol se provádí PŘED úkolem 6.** Karty turnusů odkazují na `/registrace?term=<id>`; bez téhle úpravy by formulář turnus nedohledal.

Formulář dnes čte z adresy trojici `location`, `program`, `term` a dohledává si termín i program ve staré konfiguraci lokalit. Po fázi 1 stačí `term` — server si z něj odvodí město, cenu, kapacitu i termín. Formulář musí dělat totéž, jinak nové karty vedou do prázdna. Navíc odkazuje na `/karlovy-vary/podminky` a `/karlovy-vary/gdpr`, což jsou adresy, které úkol 10 maže.

**Files:**
- Modify: `src/components/registration/RegistrationForm.tsx`
- Modify: `src/app/registrace/page.tsx`

**Interfaces:**
- Consumes: `getTurnusById`, `isBookable` z `@/lib/turnusy`; `getCity` z `@/lib/cities`; `turnusLabels` z `@/components/turnusy/TurnusCard`
- Produces: `/registrace?term=<id>` vykreslí formulář pro daný turnus

- [ ] **Step 1: Přepni formulář na turnus**

V `src/components/registration/RegistrationForm.tsx`:

1. Odstraň import `getLocationById` z `@/lib/locations` a přidej `import { getTurnusById, isBookable } from '@/lib/turnusy'` a `import { getCity } from '@/lib/cities'`.
2. Čtení parametrů nahraď tímhle; parametry `location` a `program` z adresy už nečti:

```ts
  const termId = searchParams.get('term') || ''
  const turnus = getTurnusById(termId)
```

3. Všechna místa, kde se dnes používá `location`, `program` nebo `term`, přepiš na turnus:

| Dnes | Nově |
|---|---|
| název města z lokality | `turnus ? getCity(turnus.city).name : ''` |
| cena z programu | `turnus?.priceKc` |
| popisek termínu | `turnusLabels(turnus).datum` |
| `location_id` v těle požadavku | `turnus?.city` |
| `program` v těle požadavku | `turnus?.focus[0] ?? ''` |
| `term_id` | `turnus?.id` |
| `term_start` / `term_end` | `turnus?.start`, `turnus?.end` |

Server si všechny tyhle hodnoty stejně odvodí sám z `term_id` a klientské přebije — posíláme je jen proto, že je vyžaduje schéma požadavku.

4. Odkazy na podmínky a GDPR nahraď pevnými `'/podminky'` a `'/gdpr'`; podmíněné větvení podle `locationId` odstraň.
5. Když turnus neexistuje **nebo není v prodeji** (`!turnus || !isBookable(turnus)`), vykresli místo formuláře chybovou obrazovku: nadpis `Registrace není otevřená`, věta `Tenhle termín se právě nedá objednat. Vyberte si prosím jiný turnus.` a tlačítko `Zpět na termíny` vedoucí na `/tabor#turnusy`.
6. Volání `trackRegistrationStep` nech, jen mu předej `locationId: turnus?.city ?? ''` a `program: turnus?.focus[0] ?? ''`.

- [ ] **Step 2: Zjednoduš stránku registrace**

V `src/app/registrace/page.tsx` odstraň `LocationProvider`, `getLocationById`, `DEFAULT_LOCATION` i čtení parametru `location`. Stránka jen vykreslí `<Header />`, `<main>` s `<RegistrationForm />` a `<Footer />`, pořád zabalené v `<Suspense>` (formulář používá `useSearchParams`).

- [ ] **Step 3: Ověř**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: bez chyb

Pak `npm run dev` a projdi tři adresy:
- `http://localhost:3000/registrace?term=kv-leto-2027` — turnus existuje, ale je „chystáme", takže musí ukázat obrazovku „Registrace není otevřená" s tlačítkem zpět na termíny
- `http://localhost:3000/registrace?term=neexistuje` — totéž
- `http://localhost:3000/registrace` — totéž

Do reportu napiš, co jsi u každé z nich viděl.

- [ ] **Step 4: Commit**

```bash
git add src/components/registration/RegistrationForm.tsx src/app/registrace/page.tsx
git commit -m "feat(struktura): registrace se řídí turnusem, ne trojicí parametrů

Po fázi 1 si server odvodí město, cenu, kapacitu i termín z term_id.
Formulář dělá totéž a přestává dohledávat termín ve staré konfiguraci
lokalit. Odkazy na podmínky a GDPR míří na sjednocené adresy.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Přenést obsah ze zanikajících stránek do modulů zaměření

> **Pořadí: tenhle úkol se provádí PŘED úkolem 10.** Úkol 10 maže stránky, ze kterých se obsah vytahuje.

Specifikace slibuje, že se obsah zanikajících stránek nezahazuje. `src/lib/focus.ts` je zatím jen shrnutí — oproti stránkám `/tabor-3d-tisk` a `/tabor-iot` (přes 500 řádků každá) v něm chybí fotky, otázky rodičů a polovina modelů tiskáren. Po smazání by zbytek zůstal jen v historii gitu.

**Files:**
- Modify: `src/lib/focus.ts`
- Modify: `src/lib/focus.test.ts`

**Interfaces:**
- Consumes: nic
- Produces: `FocusModule` rozšířený o `printers?`, `hardware?`, `gallery?` a `faq?`

- [ ] **Step 1: Přečti zdroje a vypiš, co se přenáší**

Přečti `src/app/tabor-3d-tisk/client.tsx` a `src/app/tabor-iot/client.tsx`. Do reportu vypiš seznam obsahu, který na nich je a ve `focus.ts` chybí: modely tiskáren, názvy hardwaru, cesty k obrázkům a otázky rodičů s odpověďmi. Teprve pak pokračuj.

- [ ] **Step 2: Napiš padající test**

V `src/lib/focus.test.ts` přidej na konec:

```ts
describe('obsah přenesený ze zanikajících stránek', () => {
  it('3D tisk jmenuje konkrétní modely tiskáren, se kterými děti pracují', () => {
    const printers = getFocus('3d-tisk').printers ?? []
    expect(printers.length).toBeGreaterThanOrEqual(4)
    expect(printers.join(' ')).toContain('MK4S')
  })

  it('IoT jmenuje konkrétní hardware', () => {
    const hardware = getFocus('iot').hardware ?? []
    expect(hardware.length).toBeGreaterThanOrEqual(2)
    expect(hardware.join(' ')).toContain('Arduino')
  })

  it('zaměření s vlastními otázkami rodičů mají u každé i odpověď', () => {
    for (const id of FOCUS_IDS) {
      for (const item of getFocus(id).faq ?? []) {
        expect(item.question.length, `${id}: ${item.question}`).toBeGreaterThan(5)
        expect(item.answer.length, `${id}: ${item.question}`).toBeGreaterThan(20)
      }
    }
  })

  it('každý odkaz na obrázek míří do veřejné složky, ne na cizí web', () => {
    for (const id of FOCUS_IDS) {
      for (const src of getFocus(id).gallery ?? []) {
        expect(src, `${id}`).toMatch(/^\/images\//)
      }
    }
  })
})
```

- [ ] **Step 3: Pusť test a ověř, že padá**

Run: `npm test -- src/lib/focus.test.ts`
Expected: FAIL — `printers` a `hardware` na typu `FocusModule` neexistují

- [ ] **Step 4: Rozšiř modul a doplň obsah**

V `src/lib/focus.ts` rozšiř rozhraní:

```ts
export interface FocusModule {
  id: FocusId
  name: string
  /** Jedna věta pro kartu turnusu. */
  short: string
  /** Co si dítě konkrétně vyzkouší — do odrážek na stránce. */
  tryOut: string[]
  /** Konkrétní modely tiskáren, se kterými se pracuje. Jen u 3D tisku. */
  printers?: string[]
  /** Konkrétní hardware — desky, čidla. Jen u IoT. */
  hardware?: string[]
  /** Cesty k fotkám ve veřejné složce. */
  gallery?: string[]
  /** Otázky rodičů, které se týkají právě tohohle zaměření. */
  faq?: Array<{ question: string; answer: string }>
}
```

Pak doplň obsah, který jsi vypsal v kroku 1. **Nic si nevymýšlej** — přenášej jen to, co na zanikajících stránkách skutečně stojí. U každé cesty k obrázku ověř příkazem `ls`, že soubor existuje; odkaz na neexistující soubor nepřenášej.

- [ ] **Step 5: Pusť test a ověř, že prochází**

Run: `npm test -- src/lib/focus.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/focus.ts src/lib/focus.test.ts
git commit -m "feat(struktura): přenést obsah zanikajících stránek do zaměření

Modely tiskáren, hardware, fotky a otázky rodičů ze stránek /tabor-3d-tisk
a /tabor-iot. Bez toho by po jejich smazání zůstal obsah jen v historii.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```
