# Weeks Web - Roadmapa projektu

> Verze: 2.0 | Datum: 12. prosince 2024
>
> **LIVE URL:** https://weeksweb.vercel.app
> **GitHub:** https://github.com/lxkask/weeks
> **Sanity Studio:** https://weeksweb.vercel.app/studio
> **Formspree ID:** mrbnrqld

## Executive Summary

Web Weeks je funkční a live. Všechny základní funkce jsou implementovány. Web je připraven pro soft-launch a sběr waitlist přihlášek.

---

## Aktuální stav projektu

| Fáze | Stav | Poznámka |
|------|------|----------|
| Fáze 0: Setup | ✅ HOTOVO | Vše nastaveno, web live |
| Fáze 1: Architektura | ✅ HOTOVO | UI/UX spec + obsah vytvořen |
| Fáze 2: Design systém | ✅ HOTOVO | Komponenty implementovány |
| Fáze 3: Implementace | ✅ HOTOVO | Všechny stránky + API hotové |
| Fáze 4: Analytics | ⏳ ODLOŽENO | Google Analytics + FB Pixel |
| Fáze 5: Legal | ✅ HOTOVO | GDPR + Podmínky stránky |
| Fáze 6: Testování | 🔄 PRŮBĚŽNĚ | Manuální testování |
| Fáze 7: Launch | ✅ SOFT-LAUNCH | Web je live, sbírá waitlist |

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

---

## Implementované funkce

### Waitlist & Lead Collection
- [x] Waitlist formulář s GDPR checkboxem
- [x] API endpoint `/api/waitlist`
- [x] Napojení na Formspree (ID: mrbnrqld)
- [x] Email validace (frontend + backend)
- [x] Success/error handling v češtině

### SEO
- [x] Meta tagy na všech stránkách
- [x] Open Graph + Twitter Cards
- [x] Schema.org markup (Organization, LocalBusiness, Event)
- [x] Dynamický sitemap.xml
- [x] robots.txt
- [x] Canonical URLs
- [x] PWA manifest

### Design & UX
- [x] Responzivní design (mobile-first)
- [x] Framer Motion animace
- [x] Konzistentní design systém
- [x] Breadcrumb navigace na podstránkách

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
| Formspree | Sběr emailů | ✅ |

---

## Co zbývá (volitelné/budoucí)

### Vysoká priorita (před plným launch)
- [ ] **Grafické assets** - og-image.jpg, favicon
- [ ] **Google Search Console** - registrace, verifikace, sitemap
- [ ] **Reálné fotky** - HWLab, vybavení, tým
- [ ] **Aktualizovat telefon** - nahradit placeholder +420 XXX XXX XXX

### Střední priorita
- [ ] **Google Analytics 4** - tracking konverzí
- [ ] **Cookie consent banner** - GDPR compliance
- [ ] **Kontaktní formulář** - napojit na Formspree
- [ ] **Vlastní doména** - weeks.cz nebo podobná

### Nízká priorita (nice-to-have)
- [ ] **Blog sekce** - pro SEO content marketing
- [ ] **Galerie** - fotky z akcí
- [ ] **Testimonials** - po prvních kempech
- [ ] **Facebook Pixel** - remarketing

---

## Použití AI agentů - souhrn

| Agent | Použito pro |
|-------|-------------|
| `ui-ux-designer` | UI/UX specifikace, persony, wireframes |
| `content-marketer` | Český obsah, GDPR + Podmínky stránky |
| `frontend-developer` | Homepage sekce, podstránky |
| `backend-architect` | Waitlist API, Formspree integrace |
| `seo-analyzer` | SEO audit, Schema markup, sitemap |

---

## Environment proměnné

### Lokální (.env.local)
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=cuy78njh
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_FORMSPREE_ID=mrbnrqld
```

### Vercel (nastaveno)
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=cuy78njh
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_FORMSPREE_ID=mrbnrqld
```

---

## Dokumentace projektu

| Soubor | Účel |
|--------|------|
| `docs/ROADMAP.md` | Tento soubor - roadmapa |
| `docs/UI_UX_SPEC.md` | UI/UX specifikace |
| `docs/CONTENT_CS.md` | Český obsah webu |
| `CLAUDE.md` | Kontext pro Claude Code |
| `SEO-AUDIT-REPORT.md` | SEO audit report |
| `NEXT-STEPS.md` | Rychlý návod dalších kroků |

---

## Metriky úspěchu

### Aktuální stav (Soft-launch)
- [x] Web je live a funkční
- [x] Waitlist sbírá emaily
- [x] Všechny stránky responzivní
- [x] SEO základy implementovány

### Cíle pro měsíc 1
- [ ] 50+ waitlist přihlášení
- [ ] Google indexace
- [ ] 0 kritických bugů

### Cíle pro sezonu (jaro 2026)
- [ ] Tábory naplněny přes web
- [ ] Pozitivní feedback rodičů
- [ ] Testimonials k zobrazení

---

## Kontakty

- **Email:** info@weeks.cz
- **Provozovatel:** DDM Praha 6
- **Místo:** HWLab Praha, Vnislavova 2, 128 00 Praha 2

---

**Poslední aktualizace:** 12. prosince 2024
**Verze dokumentu:** 2.0
