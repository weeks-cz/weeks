# Weeks Web - Roadmapa projektu

> Verze: 3.0 | Datum: 22. prosince 2024
>
> **LIVE URL:** https://weeksweb.vercel.app
> **GitHub:** https://github.com/lxkask/weeks
> **Sanity Studio:** https://weeksweb.vercel.app/studio

---

## Executive Summary

Web Weeks je plně funkční a live. MVP je dokončeno na 95%. Zbývající položky (analytics, telefonní číslo) jsou blokovány externími faktory.

---

## Stav projektu

| Fáze | Stav | Poznámka |
|------|------|----------|
| Setup & Infrastruktura | ✅ HOTOVO | Next.js 16, Vercel, GitHub |
| Design systém | ✅ HOTOVO | Tailwind + custom tokens |
| Všechny stránky | ✅ HOTOVO | Homepage, program, kontakt, GDPR... |
| Formuláře | ✅ HOTOVO | Waitlist + kontakt (Formspree) |
| SEO | ✅ HOTOVO | OG image, favicons, sitemap, Schema.org |
| Accessibility | ✅ HOTOVO | ARIA, skip-link, reduced-motion |
| GDPR | ✅ HOTOVO | Cookie consent, právní stránky |
| Analytics | ⏳ BLOKOVÁNO | Čeká na centrální email |
| Kontaktní údaje | ⏳ BLOKOVÁNO | Telefonní číslo placeholder |

---

## Implementované stránky

| Stránka | URL | Stav |
|---------|-----|------|
| Homepage | `/` | ✅ |
| Program | `/program` | ✅ |
| O nás | `/o-nas` | ✅ |
| Kontakt | `/kontakt` | ✅ |
| GDPR | `/gdpr` | ✅ |
| Podmínky | `/podminky` | ✅ |
| Sanity Studio | `/studio` | ✅ |
| Sitemap | `/sitemap.xml` | ✅ |
| 404 | custom | ✅ |

---

## Implementované funkce

### Formuláře
- [x] Waitlist formulář s GDPR checkboxem
- [x] Kontaktní formulář s GDPR checkboxem
- [x] API endpointy (`/api/waitlist`, `/api/contact`)
- [x] Napojení na Formspree (ID: mrbnrqld)
- [x] Email validace (frontend + backend)
- [x] Success/error handling v češtině

### SEO
- [x] Meta tagy na všech stránkách
- [x] Open Graph image (1200x630)
- [x] Favicon set (ico, 16x16, 32x32, apple-touch)
- [x] Schema.org markup (Organization, LocalBusiness, Event)
- [x] Dynamický sitemap.xml
- [x] robots.txt
- [x] Canonical URLs
- [x] PWA manifest

### Accessibility (WCAG)
- [x] Skip-to-content link
- [x] ARIA labels na interaktivních prvcích
- [x] aria-live regiony pro formuláře
- [x] Focus states
- [x] prefers-reduced-motion podpora
- [x] Dostatečný barevný kontrast
- [x] Image alt texty

### GDPR
- [x] Cookie consent banner
- [x] GDPR stránka s politikou
- [x] Podmínky použití stránka
- [x] Checkbox souhlasu ve formulářích

### Design & UX
- [x] Responzivní design (mobile-first)
- [x] Framer Motion animace
- [x] Konzistentní design systém
- [x] HWLab fotografie integrovány

---

## Tech Stack

| Technologie | Účel | Stav |
|-------------|------|------|
| Next.js 16 | Frontend framework | ✅ |
| TypeScript | Type safety | ✅ |
| Tailwind CSS | Styling | ✅ |
| Framer Motion | Animace | ✅ |
| Sanity CMS | Headless CMS | ✅ Připraveno |
| Vercel | Hosting | ✅ |
| Formspree | Sběr emailů/kontaktů | ✅ |

---

## Blokované úkoly

### Analytics (čeká na centrální email)
Po vytvoření centrálního emailu:
1. Vytvořit Google Analytics 4 property
2. Vytvořit Facebook Pixel
3. Přidat environment variables do Vercel:
   - `NEXT_PUBLIC_GA_ID`
   - `NEXT_PUBLIC_FB_PIXEL_ID`
4. Implementovat tracking komponenty

### Kontaktní údaje
- Telefonní číslo: aktuálně placeholder `+420 XXX XXX XXX`
- Po získání reálného čísla aktualizovat v:
  - `src/app/kontakt/page.tsx`
  - `src/components/sections/ContactSection.tsx`
  - `src/components/seo/StructuredData.tsx`

---

## Budoucí vylepšení (nice-to-have)

| Priorita | Úkol | Poznámka |
|----------|------|----------|
| Střední | Vlastní doména | weeks.cz nebo podobná |
| Nízká | Blog sekce | Pro SEO content marketing |
| Nízká | Galerie | Fotky z akcí po prvních kempech |
| Nízká | Testimonials | Po prvních kempech |
| Nízká | Google Search Console | Registrace a verifikace |

---

## Environment proměnné

### Vercel (nakonfigurováno)
```env
NEXT_PUBLIC_FORMSPREE_ID=mrbnrqld
NEXT_PUBLIC_SANITY_PROJECT_ID=cuy78njh
NEXT_PUBLIC_SANITY_DATASET=production
```

### Čeká na přidání
```env
NEXT_PUBLIC_GA_ID=              # Google Analytics 4
NEXT_PUBLIC_FB_PIXEL_ID=        # Facebook Pixel
```

---

## Dokumentace

| Soubor | Účel |
|--------|------|
| `CLAUDE.md` | Kontext pro Claude Code |
| `docs/ROADMAP.md` | Tento soubor - roadmapa |
| `docs/UI_UX_SPEC.md` | UI/UX specifikace |
| `docs/CONTENT_CS.md` | Český obsah webu |

---

## Kontakty

- **Provozovatel:** DDM Praha 6
- **Místo:** HWLab Praha, Vnislavova 2, 128 00 Praha 2

---

**Poslední aktualizace:** 22. prosince 2024
**Verze dokumentu:** 3.0
