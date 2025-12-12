# SEO Assets - Instrukce pro doplnění

## Chybějící grafické soubory pro SEO

Pro plnou funkčnost SEO je potřeba vytvořit a umístit následující soubory do složky `public/`:

### 1. Favicon soubory
Vytvořte favicon ve vhodném grafickém editoru (např. Figma, Canva, nebo použijte online nástroj https://realfavicongenerator.net/):

- **favicon.ico** (16x16, 32x32, 48x48 pixels) - hlavní favicon
- **favicon-16x16.png** - PNG verze 16x16
- **favicon-32x32.png** - PNG verze 32x32
- **apple-touch-icon.png** (180x180 pixels) - ikona pro Apple zařízení
- **android-chrome-192x192.png** - Android ikona 192x192
- **android-chrome-512x512.png** - Android ikona 512x512

**Doporučení:** Použijte logo Weeks s modrým pozadím (#3B82F6) nebo průhledným pozadím.

### 2. Open Graph obrázek
- **og-image.jpg** nebo **og-image.png**
  - Rozměry: **1200 x 630 pixels** (poměr 1.91:1)
  - Formát: JPG nebo PNG
  - Maximální velikost: 8 MB (ideálně pod 300 KB)
  - Obsah: Logo Weeks + text "Víkendové IT kempy pro děti 10-15 let" + vizuál (3D tiskárna, VR, atd.)

**Doporučené nástroje:**
- Canva (má šablonu pro Open Graph)
- Figma
- Adobe Photoshop/Illustrator
- Online: https://www.opengraph.xyz/

### 3. Logo
- **logo.png** - pro strukturovaná data (doporučené rozměry: 600x600 pixels)

## Quick Start - Online generátory

### Pro favicon:
1. Navštivte: https://realfavicongenerator.net/
2. Nahrajte logo Weeks (ideálně PNG 512x512)
3. Stáhněte všechny vygenerované soubory
4. Zkopírujte je do složky `public/`

### Pro Open Graph obrázek:
1. Navštivte: https://www.canva.com/
2. Vyhledejte šablonu "Open Graph"
3. Vytvořte design s:
   - Pozadí: gradient modrá (#3B82F6) do fialové (#8B5CF6)
   - Text: "Weeks - Víkendové IT kempy pro děti"
   - Podtext: "3D tisk • VR • Programování • Robotika"
   - Logo Weeks
4. Exportujte jako JPG (1200x630)
5. Uložte jako `og-image.jpg` do `public/`

## Kontrola po přidání souborů

Po přidání všech souborů otestujte:

### 1. Favicon
- Otevřete web v prohlížeči a zkontrolujte, zda se zobrazuje favicon v záložce

### 2. Open Graph
Použijte validátory:
- Facebook: https://developers.facebook.com/tools/debug/
- LinkedIn: https://www.linkedin.com/post-inspector/
- Twitter: https://cards-dev.twitter.com/validator
- Obecný: https://www.opengraph.xyz/url/

Zadejte URL: `https://weeksweb.vercel.app`

### 3. Strukturovaná data
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org/

## Poznámky

- Všechny ikony by měly mít konzistentní design
- Používejte brand barvy Weeks (primární: #3B82F6)
- OG image by měl být výrazný a čitelný i v malém náhledu
- Po přidání souborů nezapomeňte commitnout a pushnout do repozitáře
