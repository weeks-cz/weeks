# UX tweaks: VARY&TE caps, KV geo-nudge, propracovanější cookie consent

**Date:** 2026-06-08
**Status:** Approved (design)

Three small, independent UX changes on weeks.cz.

## 1. VARY&TE — velká písmena (všude)

Brand/venue name "Vary&Te" → "VARY&TE" ve všech viditelných textech.

- Replace `Vary&Te` → `VARY&TE` and `Vary&amp;Te` → `VARY&amp;TE` (JSX entity form).
- **Do NOT touch:** `https://varyete.cz` URL, `mapQuery` (`Vary%26Te`, not visible).
- Affected: `locations.ts`, KV pages (`tabor-chytrych-technologii`, `letni-primestsky`, `o-nas`, `gdpr`, `podminky`, `kontakt/layout`), `_components/VenueShowcase`, `_components/KVRegistrationSection`, `ProgramSection`, `HeroSection`, and `email.test.ts` (test expectation must match new value).

## 2. KV nudge — kombinace (geo box + trvalý odkaz)

Cíl: zájemce o Karlovy Vary, který přistane na pražském webu, si všimne, že KV tábory existují — bez obtěžování ostatních.

- **`GET /api/geo`** (`force-dynamic`, `no-store`): čte Vercel geo hlavičky (`x-vercel-ip-city`, `x-vercel-ip-country-region`, `x-vercel-ip-country`), vrací `{ country, region, city, isKarlovarsko }`. Neukládá IP. Vrací i raw hodnoty pro ověření přesného kódu kraje po nasazení.
- **Detekce Karlovarska:** primárně shoda názvu města proti seznamu měst kraje (Karlovy Vary, Sokolov, Cheb, Ostrov, Chodov, Mariánské Lázně, Aš, Františkovy Lázně, Nejdek, Kraslice, Horní Slavkov, Nová Role, Stará Role, Sedlec, Toužim, Žlutice, Bochov, Nejdek). Region kód (`KA` / ISO `CZ-KA`) jako záloha.
- **`KVRegionNudge`** (client, mount v `layout.tsx`): aktivní jen na pražských obsahových stránkách (`/`, `/program`, `/tabor-*`); NE na KV, NE na ad/checkout (`/kveten`, `/duben`, `/registrace`, `/platba`, `/studio`, `/eshop`). Když `isKarlovarsko && !dismissed` → jemný dismissible box dole, links to `/karlovy-vary`. Dismissal v `localStorage` (`kv-nudge-dismissed`).
- **Footer:** nenápadný cross-location odkaz „Tábory v {druhé město} →" (na Praze → KV, na KV → Praha).

## 3. Cookies — propracovanější + legální

Právní mez (EDPB Guidelines 03/2022): odmítnutí musí být stejně snadné jako přijetí. NEdělat odmítnutí těžší. "Přijmout vše" smí být vizuálně výraznější (barva), ne dostupností.

- **`src/lib/consent.ts`:** souhlas jako JSON v `localStorage['cookie-consent']`: `{ analytics: boolean, marketing: boolean, ts: number }` (necessary implicitně true). Migrace starých string hodnot (`'all'` → vše true, `'necessary'` → vše false). Helpers `getConsent()`, `hasConsent(cat)`, `setConsent()`. Dispatch `cookie-consent-updated`.
- **`CookieConsent.tsx`:** první vrstva = tři rovnocenné akce: „Přijmout vše" (primární), „Odmítnout vše" (outline, stejně dostupné), „Nastavit" (rozbalí kategorie). Kategorie: Nezbytné (vždy, disabled toggle), Analytické, Marketingové + „Uložit volbu". Lepší copy s hodnotou.
- **Napojení:**
  - `MetaPixel.tsx` → gate na `marketing` (místo `=== 'all'`).
  - **`GoogleAnalyticsGated.tsx`** (nový): obalí `<GoogleAnalytics>`, renderuje se až při `analytics` souhlasu (vzor jako MetaPixel). Nahradí přímý `<GoogleAnalytics>` v `layout.tsx` — zaceluje současnou mezeru (GA se dnes načítá bezpodmínečně).

## Out of scope
- Google Consent Mode v2 signály (gating render je dostatečný pro tento web).
- Změna registračního/platebního flow.
