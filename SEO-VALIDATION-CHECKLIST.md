# SEO Validační Checklist - Weeks Web

## ✅ PRE-DEPLOYMENT CHECKLIST

### 1. Grafické Assets (NUTNÉ DOPLNIT!)
- [ ] **og-image.jpg** vytvořen (1200x630 px) a umístěn v `public/`
- [ ] **favicon.ico** vytvořen a umístěn v `public/`
- [ ] **favicon-16x16.png** vytvořen a umístěn v `public/`
- [ ] **favicon-32x32.png** vytvořen a umístěn v `public/`
- [ ] **apple-touch-icon.png** vytvořen (180x180 px) a umístěn v `public/`
- [ ] **android-chrome-192x192.png** vytvořen a umístěn v `public/`
- [ ] **android-chrome-512x512.png** vytvořen a umístěn v `public/`
- [ ] **logo.png** vytvořen (600x600 px) a umístěn v `public/`

**Nástroj:** https://realfavicongenerator.net/ (pro favicons)
**Nástroj:** https://www.canva.com/ (pro OG image)

### 2. Aktualizace placeholderů
- [ ] Nahradit `+420 XXX XXX XXX` skutečným telefonním číslem v:
  - `src/components/sections/ContactSection.tsx`
  - `src/components/seo/StructuredData.tsx` (LocalBusinessSchema)

- [ ] Aktualizovat Google verification code v `src/app/layout.tsx`:
  - Zaregistrovat web v Google Search Console
  - Získat verification kód
  - Nahradit `google-site-verification-code-here`

- [ ] Zkontrolovat GPS souřadnice HWLab Praha (50.0636, 14.4217)
  - Ověřit na Google Maps
  - Případně aktualizovat v `StructuredData.tsx`

### 3. Build & Deploy
- [ ] Spustit `npm run build` - zkontrolovat, zda build prošel bez chyb
- [ ] Zkontrolovat warnings v konzoli
- [ ] Deploy na Vercel
- [ ] Ověřit, že web běží na https://weeksweb.vercel.app

---

## ✅ POST-DEPLOYMENT VALIDACE

### A. Základní funkčnost

#### Metadata (použít View Source)
- [ ] Title tag se zobrazuje správně na homepage
- [ ] Meta description je přítomna
- [ ] Canonical URL ukazuje na https://weeksweb.vercel.app
- [ ] Open Graph tagy jsou přítomny
- [ ] Twitter Card tagy jsou přítomny
- [ ] Viewport meta tag je nastaven
- [ ] Theme color je nastavena (#3B82F6)

#### Favicon
- [ ] Favicon se zobrazuje v browser tabu
- [ ] Favicon se zobrazuje v záložkách (bookmarks)
- [ ] Apple touch icon funguje na iOS

#### Soubory
- [ ] https://weeksweb.vercel.app/robots.txt je přístupný
- [ ] https://weeksweb.vercel.app/sitemap.xml je přístupný a validní
- [ ] https://weeksweb.vercel.app/site.webmanifest je přístupný
- [ ] https://weeksweb.vercel.app/og-image.jpg se načítá

---

### B. Schema.org Validace

#### Použijte: https://validator.schema.org/

Zadejte URL: https://weeksweb.vercel.app

**Zkontrolujte přítomnost:**
- [ ] Organization schema - žádné chyby
- [ ] LocalBusiness schema - žádné chyby
- [ ] Event schema - žádné chyby
- [ ] Geo coordinates jsou správné
- [ ] NAP informace jsou konzistentní

**Zkontrolujte podstránky:**
- [ ] /gdpr - BreadcrumbList schema
- [ ] /podminky - BreadcrumbList schema

---

### C. Google Validace

#### 1. Rich Results Test
**URL:** https://search.google.com/test/rich-results

Zadejte: https://weeksweb.vercel.app

- [ ] **Organization** se zobrazuje jako valid rich result
- [ ] **LocalBusiness** se zobrazuje jako valid rich result
- [ ] **Event** se zobrazuje jako valid rich result
- [ ] Žádné chyby nebo varování
- [ ] Preview se zobrazuje správně

#### 2. Mobile-Friendly Test
**URL:** https://search.google.com/test/mobile-friendly

- [ ] Stránka je mobile-friendly
- [ ] Viewport je nastaven správně
- [ ] Text je čitelný bez zoomování
- [ ] Žádné problémy s tapováním

#### 3. PageSpeed Insights
**URL:** https://pagespeed.web.dev/

Testujte: https://weeksweb.vercel.app

**Mobile:**
- [ ] Performance skóre > 90
- [ ] Accessibility skóre > 95
- [ ] Best Practices skóre > 95
- [ ] SEO skóre = 100

**Desktop:**
- [ ] Performance skóre > 95
- [ ] SEO skóre = 100

---

### D. Social Media Preview

#### Facebook Sharing Debugger
**URL:** https://developers.facebook.com/tools/debug/

Zadejte: https://weeksweb.vercel.app

- [ ] og:image se načítá (og-image.jpg)
- [ ] og:title je správný
- [ ] og:description je správný
- [ ] og:url je https://weeksweb.vercel.app
- [ ] Preview vypadá dobře
- [ ] Klikněte "Scrape Again" pro refresh cache

**Opakujte pro:**
- [ ] /gdpr
- [ ] /podminky

#### LinkedIn Post Inspector
**URL:** https://www.linkedin.com/post-inspector/

- [ ] OG image se zobrazuje
- [ ] Title a description jsou správné
- [ ] Preview vypadá profesionálně

#### Twitter Card Validator
**URL:** https://cards-dev.twitter.com/validator

- [ ] Card type: summary_large_image
- [ ] Image se načítá
- [ ] Title a description správné

---

### E. Google Search Console

#### Initial Setup
- [ ] Přidat property pro https://weeksweb.vercel.app
- [ ] Verifikovat vlastnictví (meta tag metoda)
- [ ] Aktualizovat verification code v layout.tsx
- [ ] Submit sitemap: https://weeksweb.vercel.app/sitemap.xml

#### Po týdnu zkontrolujte:
- [ ] Stránky jsou indexované (Index > Pages)
- [ ] Žádné coverage issues
- [ ] Core Web Vitals jsou zelené
- [ ] Mobile usability bez problémů

---

### F. Accessibility & SEO

#### WAVE Web Accessibility
**URL:** https://wave.webaim.org/

- [ ] Žádné kritické chyby
- [ ] Alt texty na obrázcích
- [ ] Správná heading struktura (H1 > H2 > H3)
- [ ] Kontrast textu je dostatečný

#### SEO Metadata Check
Použijte browser extension: "SEO Meta in 1 Click"

- [ ] Title length: 50-60 znaků ✅
- [ ] Description length: 150-160 znaků ✅
- [ ] H1 tag je přítomen a unikátní
- [ ] Canonical URL je nastaven
- [ ] Hreflang tag: cs ✅

---

### G. Performance Monitoring

#### Setup Analytics (optional, ale doporučené)
- [ ] Google Analytics 4 nainstalován
- [ ] Google Tag Manager (pokud používáte)
- [ ] Conversion tracking pro waitlist

---

## ✅ ONGOING MONITORING (po 2 týdnech)

### Google Search Console
- [ ] Impressions rostou
- [ ] Průměrná pozice se zlepšuje
- [ ] CTR > 2%
- [ ] Žádné indexing errors

### Keywords Ranking
Použijte: Google Search Console > Performance

**Sledujte pozice pro:**
- [ ] "víkendové it kempy praha"
- [ ] "programování pro děti praha"
- [ ] "3d tisk pro děti"
- [ ] "vr kempy pro děti"
- [ ] "robotika pro děti praha"

**Cíl:** Top 10 do 2-3 měsíců

### Rich Results
- [ ] Organization snippet se zobrazuje v SERPs
- [ ] Local business info v knowledge panel
- [ ] Event rich results pro kempy

---

## 🔴 KRITICKÉ AKCE PŘED SPUŠTĚNÍM

1. **NAHRADIT PLACEHOLDERS:**
   - Telefon: +420 XXX XXX XXX → skutečné číslo
   - Google verification: google-site-verification-code-here → skutečný kód

2. **VYTVOŘIT GRAPHICS:**
   - og-image.jpg (NUTNÉ pro social sharing)
   - favicon soubory (NUTNÉ pro brand)

3. **BUILD A DEPLOY:**
   - Test lokálně: `npm run build && npm start`
   - Deploy na Vercel
   - Verify na produkční URL

4. **GOOGLE SEARCH CONSOLE:**
   - Registrace a verifikace
   - Submit sitemap

---

## 📊 OČEKÁVANÉ VÝSLEDKY

### Týden 1
- ✅ Web indexován Google
- ✅ Rich results validní
- ✅ Social sharing funguje

### Měsíc 1
- 🎯 Top 20 pro "víkendové it kempy praha"
- 🎯 100+ impressions v GSC
- 🎯 Organický traffic začíná

### Měsíc 3
- 🎯 Top 10 pro hlavní keywords
- 🎯 Local pack inclusion
- 🎯 500+ impressions měsíčně

---

## 💡 POZNÁMKY

- Validaci provádějte v incognito mode (bez cache)
- Rich results se mohou objevit až po 1-2 týdnech
- Social media cache může trvat až 24h (použijte debuggery pro refresh)
- Google indexace obvykle 3-7 dní
- Monitoring dělat pravidelně (týdně první měsíc, pak měsíčně)

---

**Poslední aktualizace:** 12. prosince 2024
**Status:** ✅ SEO implementace hotova, čeká na assets a deployment
