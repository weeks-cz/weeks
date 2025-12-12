# Weeks Web - Roadmapa projektu

> Verze: 1.0 | Datum: Prosinec 2024

## Executive Summary

Tento dokument obsahuje kompletní roadmapu pro vývoj webu Weeks - víkendových IT táborů pro děti 10-15 let v HWLabu Praha pod záštitou DDM Praha 6.

---

## Tech Stack

| Technologie | Účel |
|-------------|------|
| Next.js 14+ | Frontend framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animace |
| Sanity CMS | Headless CMS pro tým |
| Vercel | Hosting (free tier) |
| Resend/Formspree | Sběr emailů |

---

## Fáze projektu

### Fáze 0: Setup (Týden 1)

#### 0.1 Inicializace projektu
- [ ] Vytvořit Next.js 14+ projekt s App Router
- [ ] Nastavit TypeScript konfiguraci
- [ ] Nakonfigurovat Tailwind CSS s custom design tokeny
- [ ] Inicializovat Git repozitář
- [ ] Připojit k Vercel pro CI/CD
- [ ] Vytvořit Sanity Studio projekt

#### 0.2 Environment proměnné
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_FB_PIXEL_ID=
```

#### 0.3 Doména a hosting
- Registrovat doménu (`weeks.cz` nebo `weeks-tabory.cz`)
- Nasměrovat DNS na Vercel
- SSL automaticky přes Vercel

---

### Fáze 1: Informační architektura (Týden 1-2)

#### 1.1 Struktura webu (Sitemap)
```
/                   # Homepage (landing page)
/program            # Detaily programu (3D tisk, VR, IoT)
/o-nas              # O nás - DDM, HWLab, tým
/terminy            # Termíny / waiting list
/kontakt            # Kontakt + mapa HWLabu
/gdpr               # Zásady ochrany osobních údajů
/podminky           # Obchodní podmínky

Budoucí (Nice-to-have):
/blog               # Články pro SEO
/galerie            # Fotogalerie
/reference          # Reference (po prvních táborech)
```

#### 1.2 Sekce homepage (scroll-based landing page)
1. **Hero** - Value proposition + hlavní CTA
2. **Co je Weeks** - Krátké vysvětlení
3. **Program** - 3D tisk, VR, IoT karty
4. **Proč Weeks** - USP grid (6 prodejních argumentů)
5. **Důvěra** - Loga DDM/HWLab + info o bezpečnosti
6. **Termíny/CTA** - Registrace nebo waiting list
7. **FAQ** - Časté dotazy rodičů
8. **Kontakt** - Rychlé kontaktní info

#### 1.3 Obsah k vytvoření

| Sekce | Tón | Cílová skupina | Priorita |
|-------|-----|----------------|----------|
| Hero headline | Energický, jasný | Obě | Kritická |
| Popisy programu | Technický ale přístupný | Rodiče | Kritická |
| Bezpečnost/BOZP | Profesionální, uklidňující | Rodiče | Kritická |
| "Cool factor" sekce | Moderní, engaging | Teenageři | Vysoká |
| Tým/O nás | Profesionální | Partneři | Střední |
| FAQ | Nápomocný, důkladný | Rodiče | Vysoká |

---

### Fáze 2: Design systém (Týden 2-3)

#### 2.1 Barevná paleta
```css
:root {
  /* Primary - Tech/Energy */
  --color-primary-500: #6366F1;  /* Indigo */
  --color-primary-600: #4F46E5;

  /* Accent - Engagement */
  --color-accent-500: #06B6D4;   /* Cyan */

  /* Trust - Professional */
  --color-trust-500: #10B981;    /* Emerald */

  /* Neutral */
  --color-gray-900: #111827;
  --color-gray-50: #F9FAFB;

  /* CTA */
  --color-cta: #F59E0B;          /* Amber */
}
```

#### 2.2 Typografie
```css
/* Headlines - Modern, techy feel */
font-family: 'Inter', 'SF Pro Display', sans-serif;

/* Body - Readable for parents */
font-family: 'Inter', system-ui, sans-serif;
```

#### 2.3 Komponenty k vytvoření

| Komponenta | Účel | Animace |
|------------|------|---------|
| `HeroSection` | Landing hero s CTA | Subtle parallax |
| `ProgramCard` | 3D/VR/IoT showcase | Hover lift + glow |
| `USPGrid` | Prodejní argumenty | Stagger reveal |
| `TrustBar` | Loga partnerů | Logo carousel |
| `CTAButton` | Hlavní akce | Pulse/glow effect |
| `WaitlistForm` | Sběr emailů | Success animation |
| `ContactMap` | Lokace HWLabu | Interaktivní mapa |
| `TeamCard` | Profily instruktorů | Hover reveal |
| `FAQAccordion` | Dotazy rodičů | Smooth expand |
| `Footer` | Odkazy + legal | - |

---

### Fáze 3: Technická implementace (Týden 3-5)

#### 3.1 Struktura projektu
```
/app
  /layout.tsx              # Root layout s providery
  /page.tsx                # Homepage
  /program/page.tsx        # Detaily programu
  /o-nas/page.tsx          # O nás
  /terminy/page.tsx        # Termíny
  /kontakt/page.tsx        # Kontakt
  /gdpr/page.tsx           # GDPR
  /api
    /waitlist/route.ts     # Email collection endpoint
    /revalidate/route.ts   # Sanity webhook handler

/components
  /ui                      # Base UI komponenty
  /sections                # Sekce stránek
  /forms                   # Formuláře
  /layout                  # Header, Footer, Nav

/lib
  /sanity                  # Sanity client config
  /analytics               # GA/FB helpers
  /utils                   # Utility funkce

/sanity
  /schemas                 # Content schémata
  /lib                     # Sanity utilities
```

#### 3.2 Sanity CMS schémata

**Program:**
- title, slug, description, content, icon, image, order

**Člen týmu:**
- name, role, bio, photo, order

**Termín tábora:**
- title, startDate, endDate, capacity, registrationUrl (DDM), status

**FAQ:**
- question, answer, category, order

**Nastavení webu:**
- heroHeadline, heroSubheadline, waitlistMode, contactEmail, contactPhone, hwlabAddress, socialLinks

#### 3.3 Sběr emailů (Waiting list)

**Možnosti:**
1. **Resend** (doporučeno) - 100 emailů/den zdarma
2. **Formspree** - 50 submissions/měsíc zdarma
3. **Google Sheets API** - přímá integrace

#### 3.4 DDM integrace

Flow registrace:
1. Uživatel klikne "Přihlásit se" u konkrétního termínu
2. Otevře se DDM registrační systém v novém tabu
3. Klik se trackuje jako konverze v GA/FB Pixel

---

### Fáze 4: Analytics & Marketing (Týden 4)

#### 4.1 Google Analytics 4

**Eventy k trackování:**
- `page_view` - Standardní
- `waitlist_signup` - Odeslání emailu
- `registration_click` - Klik na DDM odkaz
- `program_view` - Rozbalení detailu programu
- `contact_interaction` - Klik na mapu/telefon/email

#### 4.2 Facebook Pixel

**Eventy:**
- `PageView` - Všechny stránky
- `Lead` - Waitlist signup
- `InitiateCheckout` - DDM registrace klik
- `ViewContent` - Stránky programu

#### 4.3 Cookie consent (GDPR)
- Cookie consent banner
- Blokovat analytics do udělení souhlasu
- Uložit preference do localStorage
- České UI

---

### Fáze 5: Legal & Bezpečnost (Týden 4-5)

#### 5.1 GDPR compliance

**Požadované stránky/elementy:**
1. Zásady ochrany osobních údajů (`/gdpr`)
2. Cookie policy (součást GDPR stránky)
3. Cookie consent banner
4. Proces žádosti o smazání dat

**Obsah GDPR stránky:**
- Správce dat: DDM Praha 6
- Účel sběru dat
- Právní základ (souhlas)
- Doba uchování
- Práva uživatelů (přístup, smazání, přenositelnost)
- Kontakt pro žádosti o data

#### 5.2 Ochrana dat dětí

**Kritické body:**
- Web NESBÍRÁ data dětí přímo
- Sběr emailů je pouze pro rodiče
- Registrace probíhá přes DDM systém
- Žádné uživatelské účty na webu
- Žádná přímá komunikace s nezletilými přes web

#### 5.3 Legal footer

Povinné odkazy:
- Zásady ochrany osobních údajů
- Podmínky užití
- Cookies
- Provozovatel: DDM Praha 6

---

### Fáze 6: Testování (Týden 5-6)

#### 6.1 Testovací checklist
- [ ] Mobilní responzivita (všechny breakpointy)
- [ ] Cross-browser testování (Chrome, Safari, Firefox, Edge)
- [ ] Validace formulářů a odesílání
- [ ] Analytics eventy fungují
- [ ] Rychlost načítání (<3s na 3G)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] CMS aktualizace obsahu fungují
- [ ] Externí odkazy (DDM) fungují
- [ ] SEO meta tagy přítomny
- [ ] Open Graph obrázky se renderují

#### 6.2 Performance cíle

| Metrika | Cíl | Nástroj |
|---------|-----|---------|
| First Contentful Paint | <1.8s | Lighthouse |
| Largest Contentful Paint | <2.5s | Lighthouse |
| Total Blocking Time | <200ms | Lighthouse |
| Cumulative Layout Shift | <0.1 | Lighthouse |
| Performance Score | >90 | Lighthouse |

---

### Fáze 7: Launch (Týden 6-7)

#### 7.1 Pre-launch checklist
- [ ] Veškerý obsah schválen týmem
- [ ] Loga DDM/HWLab schválena
- [ ] Legal stránky zkontrolovány
- [ ] Analytics ověřeny
- [ ] SSL certifikát aktivní
- [ ] Custom doména připojena
- [ ] 404 stránka vytvořena
- [ ] Robots.txt nakonfigurován
- [ ] Sitemap.xml vygenerován
- [ ] Social media preview obrázky nastaveny

#### 7.2 Launch day
1. Merge do main branch
2. Vercel auto-deploy
3. Ověřit produkční web
4. Otestovat formuláře live
5. Sdílet s týmem pro finální check
6. Oznámit na sociálních sítích

#### 7.3 Post-launch monitoring

**Prvních 48 hodin:**
- Monitorovat error logy (Vercel)
- Kontrolovat tok analytics dat
- Reagovat na feedback týmu
- Opravit kritické bugy

**První týden:**
- Analyzovat chování uživatelů
- Zkontrolovat submissions formulářů
- Zkontrolovat Core Web Vitals v Search Console
- Iterovat na základě feedbacku

---

## AI Agenti - Použití podle fáze

| Fáze | Primární agent | Podporující agenti |
|------|----------------|-------------------|
| 0 - Setup | fullstack-developer | - |
| 1 - Architektura | ui-ux-designer | content-marketer |
| 2 - Design | ui-ux-designer | frontend-developer |
| 3 - Implementace | frontend-developer | backend-architect |
| 4 - Analytics | seo-analyzer | backend-architect |
| 5 - Legal | content-marketer | - |
| 6 - Testování | code-reviewer | seo-analyzer |
| 7 - Launch | fullstack-developer | - |

---

## Rizika a mitigace

| Riziko | Pravděpodobnost | Dopad | Mitigace |
|--------|-----------------|-------|----------|
| DDM zpoždění schválení | Střední | Vysoký | Začít s waiting list módem |
| Design není dost "cool" pro teenagery | Střední | Střední | Získat feedback od teenagerů brzy |
| CMS příliš složité pro tým | Nízká | Střední | Vytvořit dokumentaci k použití |
| Problémy s výkonem | Nízká | Vysoký | Testovat na pomalém připojení |
| Legal non-compliance | Střední | Vysoký | Konzultovat požadavky s DDM |

---

## Rozpočet

| Položka | Cena | Poznámka |
|---------|------|----------|
| Vercel Hosting | Zdarma | Hobby tier stačí |
| Sanity CMS | Zdarma | Free tier: 100k API requests/měsíc |
| Doména (.cz) | ~200 Kč/rok | Libovolný registrátor |
| Resend (email) | Zdarma | 100 emailů/den zdarma |
| **Měsíčně celkem** | **~0 Kč** | |
| **Ročně celkem** | **~200 Kč** | Pouze doména |

---

## Metriky úspěchu

**Launch úspěch (Týden 1 po launch):**
- Web se načte <3s na mobilu
- 0 kritických bugů nahlášeno
- Analytics tracking ověřen

**Krátkodobý úspěch (Měsíc 1):**
- 50+ waitlist přihlášení
- <1% bounce rate na mobilu
- Pozitivní feedback týmu

**Dlouhodobý úspěch (První sezona táborů):**
- Tábory dosáhnou kapacity přes web referraly
- Rodiče zmiňují web jako faktor důvěry
- Teenageři sdílejí web s kamarády

---

## Příklady promptů pro agenty

### ui-ux-designer
```
Design a wireframe for the Weeks homepage that appeals to both
parents (trust, safety) and teenagers (cool factor, tech visuals).
Include sections for: hero, program highlights, USPs, trust signals,
CTA, and FAQ. Focus on mobile-first layout.
```

### frontend-developer
```
Create a ProgramCard component for the Weeks website. It should:
- Display program icon, title, and short description
- Have a hover effect with subtle 3D tilt
- Use Framer Motion for animations
- Be fully responsive (mobile-first)
- Follow the high-tech design aesthetic
```

### content-marketer
```
Write Czech copy for the Weeks homepage hero section. Target audience
is parents of 10-15 year olds. Use "vykani" (formal you). Emphasize:
- Weekend IT camps at HWLab Prague
- 3D printing, VR, IoT activities
- DDM Praha 6 backing for trust
- Educational value + kids create real projects
Keep it energetic but professional.
```

### seo-analyzer
```
Audit the Weeks website for SEO. Focus on:
- Meta tags for Czech search
- Local SEO for Prague
- Keywords: "IT tabory pro deti", "vikendove tabory Praha"
- Schema markup for events
- Core Web Vitals optimization
```
