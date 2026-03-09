# Weeks Web - Roadmapa projektu

> Verze: 5.0 | Datum: 8. března 2026
>
> **LIVE URL:** https://weeks.cz
> **GitHub:** https://github.com/lxkask/weeks
> **Sanity Studio:** https://weeks.cz/studio

---

## Executive Summary

Web Weeks je plně funkční a live na produkční doméně weeks.cz. MVP je dokončeno na 100%. Kromě víkendového Táboru chytrých technologií (3 březnové termíny) nyní nabízíme i jednodenní tábory 3D tisku a IoT (termíny v přípravě). Sociální sítě (Facebook, Instagram) jsou založeny.

---

## Stav projektu

| Fáze | Stav | Poznámka |
|------|------|----------|
| Setup & Infrastruktura | ✅ HOTOVO | Next.js 16, Vercel, GitHub |
| Design systém | ✅ HOTOVO | Tailwind + custom tokens |
| Všechny stránky | ✅ HOTOVO | Homepage, program, kontakt, GDPR... |
| Formuláře | ✅ HOTOVO | Waitlist + kontakt (Formspree) |
| SEO | ✅ HOTOVO | OG image, favicons, sitemap, Schema.org |
| Accessibility | ✅ HOTOVO | ARIA, reduced-motion |
| GDPR | ✅ HOTOVO | Cookie consent, právní stránky |
| Google Analytics | ✅ HOTOVO | G-9955Q5FRRX |
| Google Search Console | ✅ HOTOVO | Ověřeno, sitemap odeslaný |
| Produkční doména | ✅ HOTOVO | weeks.cz |
| Team review feedback | ✅ HOTOVO | Všechny úpravy implementovány |
| Instagram | ✅ HOTOVO | @weeks.cz s bio |
| Facebook | ✅ HOTOVO | Stránka vytvořena |
| Facebook Pixel | ⏳ POZDĚJI | Až budeme dělat reklamy |
| Kontaktní údaje | ⏳ BLOKOVÁNO | Telefonní číslo placeholder |
| DDM potvrzení | ⏳ ČEKÁ | Před spuštěním marketingu |

---

## Implementované stránky

| Stránka | URL | Stav |
|---------|-----|------|
| Homepage | `/` | ✅ |
| Tábor chytrých technologií | `/tabor-chytrych-technologii` | ✅ Potvrzené termíny |
| Jednodenní 3D tisk | `/tabor-3d-tisk` | ✅ Termíny připravujeme |
| Jednodenní IoT | `/tabor-iot` | ✅ Termíny připravujeme |
| Program | `/program` | ✅ |
| O nás | `/o-nas` | ✅ |
| Kontakt | `/kontakt` | ✅ |
| GDPR | `/gdpr` | ✅ |
| Podmínky | `/podminky` | ✅ |
| Sanity Studio | `/studio` | ✅ |
| Sitemap | `/sitemap.xml` | ✅ |
| 404 | custom | ✅ |

---

## Team Review Feedback (Prosinec 2024) - DOKONČENO

### Implementované změny:
- [x] "Registrace otevřena" → "Přijímáme zájemce"
- [x] Waitlist button - aktivní pouze po vyplnění emailu + consent
- [x] FAQ: "Ano!" → "Ano."
- [x] FAQ: Cena 2 490 → 2 990 Kč
- [x] FAQ: Odstraněna zmínka o svačinách, sourozencích, 98% spokojených
- [x] FAQ: Profesionálnější formulace
- [x] USP: 1:8 → 1:5 (lektor:děti)
- [x] O nás: 8 dětí → 5 dětí
- [x] "Budeme brzy" → "Připravujeme pro vás první tábory"
- [x] Program popisy - realistické sliby (Arduino, Web)
- [x] Footer: Odstraněn © symbol
- [x] GDPR/Podmínky: Správce = "Projekt Weeks", doména weeks.cz
- [x] Kontakt: Hodiny 9-16 → 9-17
- [x] Program scroll offset zvýšen (scroll-mt-32)
- [x] Cover foto: hwlab-7976
- [x] Tým: Reálná jména + specializované ikony
- [x] Structured data: Přidána cena, opraveny URL na weeks.cz
- [x] Sitemap: Opraveny URL na weeks.cz

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
| Google Analytics 4 | Analytics | ✅ |

---

## Sociální sítě

| Platforma | Účet | Stav |
|-----------|------|------|
| Instagram | @weeks.cz | ✅ Bio vyplněno |
| Facebook | Weeks - It kempy pro děti | ✅ Stránka vytvořena |
| Meta Business Suite | Propojeno | ✅ |
| Facebook Pixel | - | ⏳ Až budeme dělat reklamy |

---

## Jednodenní tábory (Březen 2026)

### Co je hotovo:
- [x] Stránka `/tabor-3d-tisk` — hero, program (3 bloky), harmonogram, praktické info, FAQ, crosslink
- [x] Stránka `/tabor-iot` — stejná struktura, trust/emerald barvy, Micro:bit/senzory obsah
- [x] "Připravujeme" termíny s inline interest formulářem → POST `/api/waitlist`
- [x] Waitlist API rozšířen o volitelné pole `termin`
- [x] Analytics: `trackInterestSubmit`, `trackViewOneDayCamp`, `trackRegistrationClick` s `campType`
- [x] ProgramSection: "Nově otevřeno" badge na 3D tisk a IoT kartách, linky na vlastní stránky
- [x] Program page: CTA "Zobrazit termíny" pro 3D tisk/IoT, footer "Jednodenní tábor"
- [x] CTASection: 3 rovnocenné karty (MIX, 3D tisk, IoT) + email signup
- [x] FAQSection: Aktualizované odpovědi (obě ceny, jednodenní alternativa)
- [x] Hero + Header CTA: Neutrální ("Vybrat tábor" → `/program`)
- [x] Sitemap: `/tabor-3d-tisk` a `/tabor-iot` (priority 0.85)

### Co zbývá (až budou termíny potvrzeny):
- [ ] Přidat potvrzené termíny s DDM registračními linky (zelený dot, kapacita, btn-primary)
- [ ] Live capacity API pro jednodenní tábory (jako u MIX)
- [ ] Aktualizovat "Připravujeme" → skutečné datumy

---

## Budoucí úkoly

| Priorita | Úkol | Blokováno |
|----------|------|-----------|
| Vysoká | Potvrzení termínů jednodenních táborů | DDM |
| Vysoká | Telefonní číslo | Rozhodnutí týmu |
| Střední | Facebook Pixel | Až budeme dělat reklamy |
| Střední | Propojení FB + IG v Meta BS | Čas |
| Nízká | Blog sekce | Po prvních kempech |
| Nízká | Galerie | Po prvních kempech |
| Nízká | Testimonials | Po prvních kempech |

---

## Environment proměnné

### Vercel (nakonfigurováno)
```env
NEXT_PUBLIC_FORMSPREE_ID=mrezolbj
NEXT_PUBLIC_SANITY_PROJECT_ID=cuy78njh
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_GA_ID=G-9955Q5FRRX
```

### Čeká na přidání
```env
NEXT_PUBLIC_FB_PIXEL_ID=              # Facebook Pixel
```

---

## DNS Konfigurace

Doména: weeks.cz (registrována u subreg.cz)

```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
TXT   @     google-site-verification=5epLUIbGFT0mcISr7rJZPFLcNlcAIFkQXe5cBY9nSdY
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

**Poslední aktualizace:** 8. března 2026
**Verze dokumentu:** 5.0
