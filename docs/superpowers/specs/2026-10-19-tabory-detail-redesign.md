# Redesign stránky tématu a termínu (2026-10-19)

Nasazeno 2026-10-19 (větev `design/tabory-detail`). Obsah stránek vykreslují
`TerminDetail` (`/tabory/termin/[slug]`) a `TemaDetail` (`/tabory/[tema]`), karty
na `/tabory` `TaborCard`. Dočasné náhledy `/nahled/*` jsou smazané.

## Proč

Stránky tématu a termínu byly světlé, bez fotky v heru a mimo vizuální jazyk
úvodky a `/o-nas`. Stránka termínu, kde se prodává, měla v auditu podle pravidel
detailu produktu (DP-001 až DP-019, skill `shoptet-ux`) **3 z 8** bodů nad ohybem.

## Audit současné stránky termínu (`karlovy-vary-2027-cervenec`)

Mobil 390 × 844 a desktop 1536 × 730:

| Bod nad ohybem | Před | Po (náhled) |
|---|---|---|
| Název + město | ano | ano |
| Datum | ano (v H1) | ano |
| Cena | ano, ale jako jedna ze čtyř stejných dlaždic | ano, dominantní + přepočet na den |
| Stav míst | ne (pod 10 volnými se štítek schovává) | ano („Přijímáme přihlášky“ / „Zbývá X míst“) |
| Hodnocení | ne | ano (★ 5,0 · 7) |
| Přepínač termínů | ne (srpen až na 3 308 px) | ano, přímo nad tlačítkem |
| Tlačítko | na hraně (mobil 791 px, desktop useknuté) | mobil 665–723 px, desktop 583–641 px |
| Fotka | ne (první na 2 660 px) | ano, galerie |

Další nálezy: dvě oranžová tlačítka naráz (lišta + stránka), minimum počtu dětí
psané jako riziko, „co je v ceně“ až na 2.–3. obrazovce, žádný kontakt na člověka.

## Rozhodnutí

- **Termín = detail produktu.** Nákupní box (`NakupniBox`): cena + cena za den,
  stav míst, přepínač termínů téhož tématu ve stejném městě, tlačítko, minimum jako
  záruka („nabídneme přesun, nebo vrátíme celou částku“, podrobnosti v `#zaruka`),
  „v ceně“ jedním řádkem. Pod ním box „Nejste si jistí?“ se společným telefonem
  a info@weeks.cz (bez jména konkrétního člověka)
  a jedna doslovná recenze.
- **Lepicí lišta** (`NakupniLista`) na mobilu i počítači, skrytá, dokud je vidět
  hlavní tlačítko, formulář zájmu nebo závěrečná výzva.
- **Lišta na stránce termínu bez oranžového tlačítka** (`<Header bezCta />`).
- **Stránka termínu smí mít strukturovaný výtah tématu** (body ze zaměření,
  týden v kostce), ne kopii popisu.
- **Stránka tématu v deseti sekcích**: tmavý hero s termíny → pás faktů → „Co si
  postavíš“ (pro děti, tykání) → týden jako časová osa s rozbalovacím dnem → fotka
  přes celou šířku → co si odnese → místo → recenze → termíny → časté dotazy →
  závěrečná výzva. Praktické informace jsou v častých dotazech.
- **Oranžová nad ohybem stránky termínu jen na tlačítku a štítku „Zbývá X míst“.**
- **Měření:** `termin_cta_click` (GA4) s `source` `uvod` / `lista` / `zaver`.
- **Beze změny:** `/registrace`, platba, strukturovaná data, URL.

## Odchylky od zadání (schválené s týmem 2026-10-19)

1. Nákupní box na počítači není lepicí pravý sloupec, ale box v heru + lepicí
   lišta dole (vzor detailu Muud/Pashmii). Sekce pod herem jsou přes celou šířku
   se střídáním pozadí a pravý lepicí sloupec by je rozbil.
2. Na stránce tématu jsou recenze **před** termíny: dva tmavé bloky (místo
   a termíny) by jinak stály vedle sebe a cizí zkušenost těsně před výběrem
   termínu pomáhá.
3. Fotka v heru stránky tématu je jen na počítači; na mobilu by odsunula termíny.
4. Nové prvky nepoužívají mono písmo velkými písmeny pro štítky (zpětná vazba
   zakladatele ke grafice: působí jako „AI“).
