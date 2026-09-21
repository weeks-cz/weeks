# Weeks web 2027 — fáze 6: tábory jako kategorie a vizuální směr

**Datum:** 2026-09-21
**Větev:** `feat/web-2027`
**Stav:** implementováno 2026-09-21 na větvi `feat/web-2027`
**Plán:** `docs/superpowers/plans/2026-09-21-web-2027-faze-6-tabory-a-vizual.md`

## Proč

Fáze 1–5 postavily web kolem jednoho produktu — týdenního příměstského tábora
prodávaného po turnusech. Zakladatel si ho prošel a přinesl dvě zjištění, která
spolu nesouvisí, ale obě sahají hlouběji než na jednotlivé stránky.

**1. `/tabor` je detail, který sedí na adrese rozcestníku.** Ze zhruba deseti
bloků té stránky jich osm popisuje jedno konkrétní téma (3D tisk, IoT, VR)
a turnusy jsou až dole. Chystají se ale další tábory — **game dev, AI a webový**
— a každý bude mít vlastní program, vlastní fotky a vlastní publikum. Dnešní
struktura pro ně nemá místo: buď by se natlačily do jedné stránky, nebo by
vznikly čtyři konkurenční `/tabor-*` adresy, tedy přesně to, co fáze 1 zrušila.

**2. Web působí málo brandově.** To se dá spočítat. Napříč komponentami
a stránkami `/`, `/tabor`, `/firmy`, `/o-nas`, `/kontakt`:

| Barva | Výskytů tříd | Podíl |
|---|---:|---:|
| `ink` | 597 | 65 % |
| `paper` | 125 | 14 % |
| `primary` (indigo) | 119 | 13 % |
| `trust` (emerald) | 45 | 5 % |
| `accent` (cyan) | 21 | 2 % |
| `cta` (amber) | 11 | 1 % |

Čtyři pětiny webu jsou dvě neutrály. Amber má **jedenáct výskytů na celém webu**
včetně e-shopu a headeru. Paleta není nevyužitá omylem — chybí jí pravidlo:
`accent` a `trust` se objevují nahodile, takže je čtenář nepřečte jako systém.

K tomu se přidal třetí, menší nález: tři sousední sekce úvodky
(`USPSection`, `KdeASKym`, `Rozcesti`) mají **stejné pozadí a žádný předěl**.
Každá nese `section-padding` (`py-16 md:py-24`), takže mezi nimi vzniká 192 px
prázdné krémové plochy bez záchytného bodu.

## Rozsah

**V rozsahu:**
- Tábor jako samostatná entita nad turnusem, tři úrovně stránek, přesměrování.
- Vizuální systém: role barev, rytmus sekcí, umístění interaktivní mřížky, fotky.
- Úvodka, `/tabory`, `/firmy`, `/o-nas`.
- Rozpuštění `KdeASKym`, odstranění KV nudge, oprava mezery v `btn-outline`.

**Mimo rozsah:**
- Registrační a platební tok (`/registrace`, `/platba`, Comgate, Fakturoid) —
  mění se jen odvození názvu tábora, nic jiného.
- E-shop kromě jedné opravy tlačítka.
- `/gdpr`, `/podminky`, `/kontakt` — obsahově hotové, dostanou jen vizuální
  sjednocení podle systému níže.
- Vypsání letních termínů 2027. Ty přijdou zvlášť, až budou známé.

## Informační architektura

### Dvě entity místo jedné

Dnes je turnus jediná entita a téma je jen `focus: FocusId[]`, tedy seznam
obsahových modulů. Nově stojí nad turnusem **tábor**:

| | **Tábor** (`src/lib/tabory.ts`, nový) | **Turnus** (`turnusy.ts`, existuje) |
|---|---|---|
| Co to je | téma — „co se tam dělá" | termín — „kdy a kde" |
| Vlastní | název, perex, popis, program po dnech, harmonogram, `focus[]`, FAQ | město, místo, datum, cena, kapacita, `status` |
| Stav | `aktivni` \| `chystame` | dnešní `TurnusStatus` |
| Vazba | — | `taborIds: TaborId[]` |

`focus[]` se **stěhuje z turnusu na tábor** — moduly 3D tisk / IoT / VR popisují
téma, ne termín. Turnus si je čte přes svůj tábor.

`taborIds` je **pole, ne jediná hodnota**, ačkoli dnes v něm bude vždy jeden
prvek. Důvod je levná pojistka: až někdy poběží v jednom týdnu dvě paralelní
skupiny s různými tématy, nevynutí si to migraci `term_id` ani přesměrování
adres, které už jsou na fakturách.

### Tábory při nasazení

| Tábor | Slug | Stav | Obsah |
|---|---|---|---|
| Chytré technologie | `chytre-technologie` | `aktivni` | celý dnešní obsah `/tabor` |
| Game dev | `game-dev` | `chystame` | perex + „co si dítě zkusí" + sběr zájmu |
| AI tábor | `ai` | `chystame` | totéž |
| Webový tábor | `webovy-tabor` | `chystame` | totéž |

### URL

```
/tabory                              výpis — město → téma → termín
/tabory/chytre-technologie           popis tábora
/tabory/game-dev                     popis, stav CHYSTÁME
/tabory/ai
/tabory/webovy-tabor
/tabory/termin/praha-leto-2027       konkrétní termín + registrace
/tabory/termin/karlovy-vary-leto-2027
```

Turnus **nesedí vnořený pod tématem** (`/tabory/chytre-technologie/praha-leto-2027`).
Vnoření by dávalo hezčí drobečky, ale pere se s polem `taborIds`: turnus se dvěma
tématy by neměl kam patřit a změna tématu by si vynutila 301 na adresu, která je
na faktuře. Statický segment `termin` drží adresu turnusu nezávislou na tématech.
Drobečky si téma dopočítají z dat.

### Přesměrování

`/tabor` **není a nikdy nebyl v indexu** — žije jen na větvi `feat/web-2027`,
`main` má pořád starou strukturu. Volba adres je tedy zadarmo a nevzniká řetězec
301 → 301. V `next.config.js`:

```
/tabor              → /tabory                       (301)
/tabor/[slug]       → /tabory/termin/[slug]         (301)
```

Stávajícím pravidlům (`/program`, `/tabor-3d-tisk`, `/tabor-iot`,
`/tabor-chytrych-technologii`, `/kveten`, `/karlovy-vary*`) se **jen přepíše cíl**
z `/tabor` na `/tabory`, ať nemíří na adresu, která se sama přesměrovává.

### Trychtýř: město → téma → termín

Rodič vybírá v tomhle pořadí, ne obráceně. Výpis je proto **seskupený podle
města**, uvnitř města je řádek na téma a u tématu jeho turnusy nebo — u tématu
ve stavu `chystame` — formulář zájmu.

## Obsah tří úrovní

### `/tabory` — výpis

Hero se společnými fakty (Po–Pá, 8:00–17:00, 9–15 let, max 15 dětí, oběd
v ceně), volba města, pak sekce na město. Karta nese **téma, technologie, místo,
termín, cenu a stav**. Jakmile se termín vypíše, ukáže datum a cenu a CTA se
překlopí na „Přihlásit dítě" — `isBookable()` to už umí, jen se přesune o úroveň
výš.

Sem se stěhují **karty míst konání** z rozpuštěné `KdeASKym`, protože „kde to je"
dává smysl vedle města, ke kterému patří.

### `/tabory/[tema]` — popis tábora

Pro `aktivni` tábor sem jde osm z deseti dnešních bloků `/tabor` (hero, focus
moduly, týdenní přehled, typický den, praktické informace, galerie, FAQ, CTA),
jen se seznam turnusů zúží na turnusy tohoto tématu.

Pro `chystame` tábor vypadá stránka **schválně chudší**:

| Blok | `aktivni` | `chystame` |
|---|---|---|
| Hero + perex | ✅ | ✅ |
| Co si dítě zkusí (3–5 bodů) | ✅ | ✅ |
| Týdenní přehled Po–Pá | ✅ | ❌ |
| Typický den | ✅ | ❌ |
| Galerie projektů | ✅ | ❌ |
| Praktické informace | ✅ | ❌ |
| Seznam turnusů | ✅ | ❌ |
| Formulář zájmu | ✅ | ✅ hlavní obsah |
| Odkaz na běžící tábor | — | ✅ |

### `/tabory/termin/[slug]` — turnus

Nejkratší ze tří: město, místo, datum, cena, kapacita, registrace nebo zájem,
`VenueShowcase`, další termíny, a nahoře odkaz „Celý popis tábora →". Popis
tématu se sem **neduplikuje**, jen tři body výtahu.

## Vizuální systém

Směr vychází z varianty B, postavené a odsouhlasené na náhledové routě
`/nahled/b`. Varianta A („víc plochy", editoriální, skoro bez barev) byla
zamítnuta jako chladná.

### Barvy nesou význam

Ne „více barev", ale **role**. Barva se smí použít jen ve své roli:

| Barva | Role | Kde |
|---|---|---|
| `cta` (amber) | akce a stav | primární tlačítka, odznak `CHYSTÁME`, „zbývá X míst", pruh technologií, závěrečné CTA |
| `accent` (cyan) | technologie | témata táborů, pruh na kartě turnusu, ikony v sekci pro děti, buňky mřížky na tmavém |
| `trust` (emerald) | klid rodičů | pás „Co máte jisté" — poměr lektorů, první pomoc, servis 8–17 |
| `primary` (indigo) | základ značky | mřížka, odkazy, buňky mřížky na světlém |
| `ink` / `paper` | plocha a text | všude jinde |

Když barva nesedí do role, nepoužije se. Tím se počet barev na stránce nezvýší
chaoticky — jen se konečně dá přečíst jako systém.

### Rytmus sekcí

Mezi sousedními sekcemi musí být předěl: **buď změna pozadí, nebo `border-y`.**
Dvě sekce se stejným pozadím a bez linky nesmí jít po sobě — z toho vzniká ta
dvojitá prázdná plocha.

Úvodka po přestavbě:

| Sekce | Pozadí | Dnešní komponenta |
|---|---|---|
| Hero | `ink` + `blueprint-grid-dark` | `HeroSection` (přebarvit na tmavou) |
| Pruh technologií | `cta-400` + `border-y ink` | `TickerStrip` (přebarvit) |
| Nejbližší turnusy | `paper` | `NejblizsiTurnusy` |
| Co máte jisté (rodiče) | `trust-50` + `border-y` | z `USPSection` + `KdeASKym` |
| Fotka přes celou šířku | fotka | nová |
| Co si postaví (děti) | `ink` + mřížka **interaktivní** | z `USPSection` |
| Rozcestí | `paper-soft` | `Rozcesti` |
| FAQ | `paper` | `FAQSection` |
| Závěrečné CTA + sběr e-mailů | `cta-400` + `border-y ink` | `ContactSection` |

`TickerStrip` zůstává, jen se z tmavého pruhu stane amber — v roli „akce a stav"
drží pozornost hned pod herem. `ContactSection` se **neruší**: její e-mailový
formulář se souhlasem s GDPR se přesune do závěrečného amber bloku, aby se
nezrušil jediný sběr kontaktů na úvodce. Dnešní `USPSection` se šesti dlaždicemi
bez adresáta se **rozdělí na dvě sekce** — tři body pro rodiče (emerald) a tři
pro děti (tmavý cyan blok).

Každá stránka webu dostane **alespoň jeden tmavý blok** jako kotvu. Dnes ho mají
jen úvodka a `/tabor`; `/firmy`, `/o-nas` a `/kontakt` se bez něj čtou jako
dlouhý krémový svitek.

### Interaktivní mřížka

Efekt rozsvěcujících se buněk za kurzorem (`cell-fade` + záře) dnes žije natvrdo
v `HeroSection`. Vytáhne se do samostatné komponenty (prototyp:
`src/components/nahled/MrizkaSekce.tsx`), aby se dal pověsit na libovolnou sekci.

Na úvodce sedí na sekci **„Co si postaví"**, ne na heru:
- je to jediná sekce psaná dětem, hravost tam patří;
- je v druhé polovině stránky, takže odměňuje toho, kdo si se stránkou hraje,
  místo aby rozptylovala u hlavního sdělení.

Aktivní jen na `pointer: fine` a bez `prefers-reduced-motion`; jinak obyčejná
statická sekce. Komponenta musí **uklízet své časovače** při odpojení — původní
verze v heru to nedělá.

### Fotky

V repu jsou reálné fotky z táborů a ty mají přednost před ilustracemi:

| Soubor | Co na ní je | Kde |
|---|---|---|
| `/images/hwlab/hero-print-day.webp` | dílna, děti i lektoři, promítnuté W | hero úvodky |
| `/images/tabor/venku-sablona.webp` | venkovní blok na trávě | pás „Celý den u počítače? Ne." |
| `/images/tabor/iot-led-palec.webp` | dítě u rozsvíceného obvodu | `/tabory/chytre-technologie`, modul IoT |
| `/images/tabor/skupina-terasa.webp` | skupina s lektorem na terase | `/o-nas` |

Do hera úvodky patří **záběr na skupinu, ne portrét jednoho dítěte** — portrét
z něj dělá maskota, skupina s dospělými říká „tohle je tábor" a rodič v ní vidí
i lidi, kterým dítě svěřuje.

Souhlasy rodičů se zveřejněním podobizny jsou podle zakladatele v pořádku
u všech čtyř. U skupinové fotky bylo jedno dítě bez souhlasu odstraněno
generativní úpravou; jde tedy o reálnou fotografii, ne o vygenerovanou scénu.

## Stránky

### Úvodka

Pořadí a pozadí viz „Rytmus sekcí". Obsahově:
- hero se skupinovou fotkou v posunutém amber rámu,
- `KdeASKym` **zrušena** a rozpuštěna (viz Úklid),
- „Proč Weeks" se rozdělí na **pro rodiče** (emerald pás) a **pro děti**
  (tmavý cyan blok) — dnes je to jeden seznam šesti dlaždic bez adresáta,
- pás s fotkou nese doložitelné tvrzení („po obědě se jde ven"), ne slogan.

### `/firmy`

- **`KdeASKym` pryč.** U B2B se místo domlouvá individuálně; sekce dnes tvrdí
  opak. Nahradí ji krátký blok „Kde to proběhne": u vás ve firmě, v našem
  prostoru, nebo v partnerském — třeba ve FabLabu VARY&TE, kde tábory běží.
  FabLab jako **možnost**, ne jako dané místo konání.
- Tmavý blok s ghost W mezi nabídkami a poptávkou.
- Číslování nabídek (01/02/03) a ikony odlišené podle role, ne třikrát stejné
  indigo.
- Pole `reference` zůstává prázdné a `PARTNERSTVI_ZATIM` zůstává. **Žádná
  reference, cena ani počet odbavených firem se nedoplňuje**, dokud je nedodá
  zakladatel.

### `/o-nas`

- Zapojit reálné fotky z táborů. Dnes stránka ukazuje jen tři fotky FabLabu
  z `cities.ts`, zatímco čtrnáct reálných fotek v `public/images/hwlab/` používá
  jediné místo — hero úvodky.
- Tmavý blok jako na ostatních stránkách.
- Název složky `hwlab` je historický zbytek. Fotky jsou z táborů Weeks, ale
  **nikde nesmí vzniknout tvrzení, že HWLab je pořadatel nebo místo konání** —
  to už neplatí.

### Drobnosti

- `btn-outline` dostane `gap-2`. Dnes se ikona lepí na text (nejvíc vidět
  u „Mám zájem" se srdíčkem v e-shopu). Opraví to všechna tlačítka s ikonou.

## Úklid

### KV nudge

`KVRegionNudge` se smaže i s mountem v `layout.tsx`. Vznikl, když byly Karlovy
Vary samostatnou větví webu (`/karlovy-vary/*`); dnes je město jen filtr, oba
turnusy jsou stejně `chystame` a widget nabízí proklik na něco, co není o nic
dál než pražská varianta.

`/api/geo` **nevolá nic jiného** (ověřeno) — smaže se s ním, ať nezůstane
endpoint bez konzumenta.

### `KdeASKym`

Obsah se rozpustí, nic nemizí:

```
Místa konání (FabLab)   →  /tabory, ke svému městu
Tým (3 jména)           →  /o-nas (tady to byl duplikát)
1:5 · první pomoc · 15  →  emerald pás „Co máte jisté"
Telefon + e-mail        →  smazat (už jsou v ContactSection i ve Footeru)
```

### Náhledové routy

`src/app/nahled/*` a `src/components/nahled/*` jsou dočasné, mají `noindex`
a po převzetí vizuálního směru do ostrých komponent se **smažou**. Komponenta
`MrizkaSekce` se z `nahled/` přestěhuje mezi běžné komponenty.

## Na co si dát pozor

**`id` turnusu se nemění.** `term_id` je v `registrations` a na fakturách. Mění
se adresa a zdroj názvu: `getTrustedProgramName` (`payment-pricing.ts`) bude
jméno brát z entity tábor místo z `focus[0]`. Záloha pro staré registrace,
jejichž turnus už v datech není, zůstává.

**Duplicitní obsah.** Při čtyřech tématech, dvou městech a několika termínech
vznikne řada stránek turnusů. Kdyby každá zopakovala popis tábora, má web sadu
skoro shodných stránek a vyhledávač si z nich vybere jednu sám. Popis proto žije
**právě na jednom místě** — na tématu.

**Chystané tábory nesmí nic tvrdit.** Game dev, AI a webový tábor dostanou perex
a body „co si dítě zkusí" v rovině záměru. Žádný harmonogram, galerie, cena ani
reference, dokud je nedodá zakladatel. Platí stejné pravidlo jako u `/firmy`.

**`EventSchema` se nerozsype.** `turnusyProSchema()` dál pouští do JSON-LD jen
turnus s datem, cenou i místem. Tábor ve stavu `chystame` nemá co emitovat, takže
čtyři nové stránky nepřidají do strukturovaných dat jediné tvrzení navíc.
Testy (`turnusy.test.ts`, `schema-turnusy.test.ts`) se rozšíří tak, aby
`taborIds` nemohlo ukázat na neexistující téma.

**Obsah schovaný pod animací.** Bloky s `initial: { opacity: 0 }`, které zviditelní
až `whileInView`, jsou prázdné pokaždé, když se animace nespustí — zamrzlá
záložka na pozadí, chyba JS, pomalá hydratace. Hero úvodky to tak má dnes.
U nosného textu (H1, perex, CTA) se má animovat **posun, ne viditelnost**.

## Postup

| Fáze | Co |
|---|---|
| 6a | `src/lib/tabory.ts`, přesun `focus[]` na tábor, `taborIds` na turnusu, testy |
| 6b | Routy `/tabory`, `/tabory/[tema]`, `/tabory/termin/[slug]`; přesměrování; sitemapa; drobečky |
| 6c | Vizuální systém do ostrých komponent — úvodka, rytmus sekcí, `MrizkaSekce`, fotky |
| 6d | Rozpuštění `KdeASKym`, odstranění KV nudge a `/api/geo`, `gap-2` |
| 6e | `/firmy` a `/o-nas` |
| 6f | Úklid náhledových rout, kontrola strukturovaných dat, `CLAUDE.md` |

## Otevřené vstupy od týmu

- **Texty tří chystaných táborů.** Návrh napíše Claude, zakladatel opraví
  před nasazením.
- **Fotky z reálného tábora navíc** — zakladatel zmínil, že další dodá.

## Poznámky

- Spec navazuje na `2026-09-15-web-2027-design.md` (fáze 1–3) a na fáze 4 a 5
  popsané v `CLAUDE.md`.
- Barevné četnosti v sekci „Proč" jsou měřené na stavu větve k 2026-09-21.
- `main` má v době psaní pořád starou strukturu; celá větev `feat/web-2027` je
  119 commitů před ním a nenasazená.
