# 🚀 Další kroky - SEO implementace Weeks Web

## ✅ CO JE HOTOVO

Kompletní SEO audit a implementace:
- ✅ robots.txt
- ✅ sitemap.xml (dynamický)
- ✅ Kompletní metadata (Open Graph, Twitter Cards)
- ✅ JSON-LD structured data (Organization, LocalBusiness, Event, Breadcrumbs)
- ✅ Canonical URLs
- ✅ PWA manifest
- ✅ Optimalizace pro lokální SEO (Praha)

---

## 🔴 CO ZBÝVÁ UDĚLAT (KRITICKÉ)

### 1. Vytvořit grafické assets

**Proč je to důležité:** Bez těchto souborů nebude fungovat social sharing a favicon.

#### Priorita VYSOKÁ - og-image.jpg
**Velikost:** 1200 x 630 pixels
**Formát:** JPG nebo PNG
**Obsah:**
- Logo Weeks
- Text: "Víkendové IT kempy pro děti 10-15 let"
- Vizuál: 3D tiskárna, VR brýle, nebo programování
- Barvy: Modrá (#3B82F6), případně gradient

**Jak vytvořit:**
1. Jdi na https://www.canva.com/
2. Vytvoř nový design "Open Graph Image" (1200x630)
3. Přidej logo, text a vizuály
4. Stáhni jako JPG
5. Ulož jako `public/og-image.jpg`

**Nebo rychleji:**
- Použij https://www.opengraph.xyz/ s templates

#### Priorita VYSOKÁ - Favicon soubory
**Nejrychlejší způsob:**
1. Připrav logo Weeks jako PNG (ideálně 512x512 px)
2. Jdi na https://realfavicongenerator.net/
3. Nahraj logo
4. Stáhni balíček všech ikon
5. Zkopíruj všechny soubory do `public/`

**Potřebné soubory:**
- favicon.ico
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png (180x180)
- android-chrome-192x192.png
- android-chrome-512x512.png

### 2. Aktualizovat placeholders

#### Telefon (3 místa)
Najdi a nahraď `+420 XXX XXX XXX` skutečným telefonem:

**Soubor 1:** `src/components/sections/ContactSection.tsx`
```typescript
// Řádek cca 51-54
href="tel:+420XXXXXXXXX"  // <- změň
+420 XXX XXX XXX          // <- změň
```

**Soubor 2:** `src/components/seo/StructuredData.tsx`
```typescript
// LocalBusinessSchema, řádek cca 36
telephone: '+420XXXXXXXXX',  // <- změň
```

#### Google Search Console verification
Po registraci v GSC:

**Soubor:** `src/app/layout.tsx`
```typescript
// Řádek cca 76-78
verification: {
  google: 'tvuj-verification-kod-zde',  // <- změň
},
```

### 3. Build a test lokálně

```bash
# Zkontroluj závislosti
npm install

# Build
npm run build

# Test production build
npm start

# Otevři http://localhost:3000 a zkontroluj:
# - Favicon se zobrazuje
# - V view source jsou všechny meta tagy
# - Žádné console errors
```

### 4. Deploy na Vercel

```bash
# Pokud máš Vercel CLI:
vercel --prod

# Nebo pushni do main branch (auto-deploy)
git add .
git commit -m "SEO optimization - add metadata, schema, sitemap"
git push origin main
```

### 5. Google Search Console setup

1. Jdi na https://search.google.com/search-console/
2. Přidej property: `https://weeksweb.vercel.app`
3. Vyber metodu verifikace: **HTML tag**
4. Zkopíruj verification kód
5. Vlož do `src/app/layout.tsx` (viz bod 2 výše)
6. Redeploy
7. Klikni "Verify" v GSC
8. Přidej sitemap: https://weeksweb.vercel.app/sitemap.xml

---

## 🟡 DOPORUČENÉ (během týdne)

### 6. Validace po deployu

Použij checklist: `SEO-VALIDATION-CHECKLIST.md`

Hlavní testy:
- [ ] https://search.google.com/test/rich-results
- [ ] https://developers.facebook.com/tools/debug/
- [ ] https://validator.schema.org/
- [ ] https://pagespeed.web.dev/

### 7. Google Analytics 4 (optional)

Pokud chceš trackovat návštěvnost:
1. Vytvoř GA4 property
2. Získej Measurement ID (G-XXXXXXXXXX)
3. Přidej Google Analytics komponenta nebo použij Vercel Analytics

### 8. Monitoring

Po 1 týdnu zkontroluj v Google Search Console:
- Kolik stránek je indexovaných (měly by být 3: home, gdpr, podmínky)
- Žádné coverage errors
- Core Web Vitals

---

## 🟢 NICE TO HAVE (během měsíce)

### 9. Google Business Profile

Pokud máte fyzickou pobočku/kancelář:
1. Vytvoř Google Business Profile pro HWLab Praha
2. Přidej fotky, hodiny, služby
3. Optimalizuj pro "IT kempy Praha"

### 10. Lokální citace

Přidej Weeks na:
- firmy.cz
- mapy.cz
- zoznam.cz (SK, ale pomáhá)
- seznam.cz Firmy

**DŮLEŽITÉ:** Použij konzistentní NAP:
```
Název: Weeks - Víkendové IT kempy pro děti
Adresa: Vnislavova 2, 128 00 Praha 2 - Vyšehrad
Email: info@weeks.cz
Tel: +420XXXXXXXXX (tvoje číslo)
Web: https://weeksweb.vercel.app
```

### 11. Content enhancement

Pro lepší SEO:
- Přidej blog sekci (články o programování pro děti)
- Rozšiř FAQ o další otázky
- Přidej testimonials (recenze rodičů)
- Vytvoř stránku "O nás"

---

## 📊 ČASOVÝ PLÁN

### Den 1 (DNES)
- ⏰ Vytvořit og-image.jpg (30 min)
- ⏰ Vytvořit favicon (20 min)
- ⏰ Aktualizovat telefon (5 min)
- ⏰ Build + deploy (10 min)

### Den 2
- ⏰ Google Search Console setup (15 min)
- ⏰ Submit sitemap (2 min)
- ⏰ Validace (30 min dle checklistu)

### Týden 1
- ⏰ Facebook/LinkedIn debugger (10 min)
- ⏰ Monitoring GSC (5 min denně)

### Měsíc 1
- ⏰ Google Business Profile (1 hod)
- ⏰ Lokální citace (2 hod)
- ⏰ Content plánování (varies)

---

## 📁 DŮLEŽITÉ SOUBORY

### Dokumentace
- `SEO-AUDIT-REPORT.md` - kompletní audit report
- `SEO-VALIDATION-CHECKLIST.md` - validační checklist
- `public/SEO-ASSETS-README.md` - instrukce pro assets

### SEO soubory (implementované)
- `public/robots.txt`
- `src/app/sitemap.ts`
- `src/components/seo/StructuredData.tsx`
- `public/site.webmanifest`

### K editaci
- `src/app/layout.tsx` - hlavní metadata
- `src/components/sections/ContactSection.tsx` - kontakty

---

## ❓ HELP & RESOURCES

### Když nevíš, jak na graphics:
- Canva tutorial: https://www.youtube.com/watch?v=og-image-tutorial
- Favicon generator: https://realfavicongenerator.net/
- OG Image templates: https://www.opengraph.xyz/

### Když máš problémy s buildem:
```bash
# Smaž cache
rm -rf .next node_modules
npm install
npm run build
```

### Když meta tagy nefungují:
- Hard refresh: Ctrl+Shift+R (nebo Cmd+Shift+R na Mac)
- Clear cache v browseru
- Test v incognito mode
- Použij Facebook Debugger k re-scrape

### Když schema.org validátor hlásí chyby:
- Zkontroluj, že quotes jsou správně escapované
- Použij schema.org validator: https://validator.schema.org/
- Zkontroluj JSON syntax

---

## 💬 KONTAKT & PODPORA

Pokud budeš potřebovat pomoc:
- Google Search Central Community
- Vercel Discord
- Stack Overflow (#nextjs #seo)

---

## ✨ OČEKÁVANÉ VÝSLEDKY

Po implementaci všech kroků:

**Týden 1:**
- ✅ Web indexován Google
- ✅ Rich results validní
- ✅ Social sharing s pěkným preview

**Měsíc 1:**
- 🎯 Top 20 pro "víkendové it kempy praha"
- 🎯 100+ impressions v Google
- 🎯 První organický traffic

**Měsíc 3:**
- 🎯 Top 10 pro hlavní keywords
- 🎯 Local pack presence
- 🎯 500+ impressions, 50+ kliků měsíčně

---

**Good luck! 🚀**

Máš-li dotazy k implementaci, zkontroluj `SEO-AUDIT-REPORT.md` nebo `SEO-VALIDATION-CHECKLIST.md`.
