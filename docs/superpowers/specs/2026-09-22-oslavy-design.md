# Oslavy — vlastní stránka pro narozeniny a akce pro děti

**Datum:** 2026-09-22
**Větev:** `feat/web-2027`
**Stav:** návrh k implementaci

## Proč

Rodiče se na oslavu **už ptali sami**, aniž by ji web kdekoli nabízel. To je
nejlevnější druh poptávky, jaký firma může mít — a Weeks na něj dnes nemá kam
odkázat. Nejbližší stránka je `/firmy`, jenže ta mluví na HR oddělení
a o zaměstnaneckých benefitech; rodič, který shání program na desáté narozeniny,
se v ní nepozná.

Oslava přitom sedí na to, co Weeks doopravdy umí: přivézt techniku, posadit
k ní skupinu dětí a nechat každé odejít s něčím v ruce. Oproti táboru odpadá
všechno, co je na táboře těžké — pětidenní program, oběd, docházka, kapacita
turnusu.

**Co tenhle dokument není:** ceník ani příprava prodeje. Žádná oslava zatím
neproběhla. Stránka má posbírat poptávky a dát jim tvar, ne tvrdit, že je za
tím zkušenost.

## Rozsah

Uvnitř:

- nová stránka `/oslavy` + položka v hlavičce, patičce a v Rozcestí na úvodce,
- obsahový modul `src/lib/oslavy.ts`,
- poptávkový formulář `OslavaPoptavka` napojený na stávající `/api/contact`,
- nová hodnota `form_type: 'oslavy'` pro weeks-hub,
- událost `oslava_poptavka_submit` v GA,
- `/oslavy` do sitemapy.

Mimo:

- ceník nebo orientační cena — není co doložit (rozhodnutí zakladatele
  2026-09-22, stejné pravidlo jako u `/firmy`),
- reference a počty odbavených oslav — první oslava teprve bude,
- rezervační kalendář a online platba — poptávka je e-mail, ne objednávka,
- věkové rozmezí na stránce — program se přizpůsobuje, věk se řeší v poptávce.

## Rozhodnutí a proč

### Jedna nabídka s příklady, ne katalog balíčků

Zvažovaly se dvě varianty: dvě pevné nabídky („stánek na oslavě" vs. „celý
program") po vzoru `/firmy`, nebo jedna volná nabídka.

**Vyhrála jedna volná nabídka s příklady.** Dvě pevné nabídky by musely říct,
čím se od sebe liší — délkou, počtem dětí, cenou — a to jsou přesně údaje,
které zatím nikdo nepotvrdil. Vznikla by fikce v tabulce. Příklad naopak nic
neslibuje: říká „takhle to může vypadat" a rodič si k němu domyslí svoje.

Praktický důsledek pro kód: `src/lib/oslavy.ts` nevystavuje `Record<Id, …>`
s číselníkem jako `firmy.ts`, ale ploché seznamy. Není co vybírat, takže ani
formulář nemá přepínač.

### `reference: []` se sem nedostane

`firmy.ts` nese u každé nabídky prázdné pole `reference` s komentářem „doplní
tým". Z té prázdné pojistky vyrostl odstavec `PARTNERSTVI_ZATIM`, který
stránka vykreslovala jako přiznání — a který zakladatel 2026-09-22 nechal
smazat, protože nabídku oslabuje víc, než pomáhá.

**Poučení: chybějící reference se neřeší prázdným polem ani omluvou, ale
mlčením.** Stránka o počtu odbavených oslav nenapíše nic. Až první oslava
proběhne, přidá se jako obsah, ne jako vyplnění připraveného místa.

### Nová hodnota `form_type`, ne recyklace `firmy`

`/api/contact` dnes rozlišuje dva typy (`contact-payload.ts`): bez `typ` jde
o rodičovský dotaz (`formType: 'contact'`), s platným `typ` z číselníku
`NabidkaId` o firemní poptávku (`formType: 'firmy'`). Route pak posílá hodnotu
do weeks-hubu jako `form_type`.

Oslavu objednává **rodič, ne HR**. Kdyby spadla pod `firmy`, míchala by se
v hubu s firemními poptávkami a nešlo by se na ni podívat zvlášť; kdyby spadla
pod `contact`, utopí se mezi běžnými dotazy. Dostane proto vlastní hodnotu
`'oslavy'`.

**To je závislost mimo tenhle repozitář.** Weeks-hub musí hodnotu znát, jinak
poptávku tiše zahodí — stejná past, na kterou upozorňuje poznámka o `/firmy`
v CLAUDE.md. Viz „Předdeployový krok" níž.

### Adresa a název zůstávají u slova „oslavy"

Místo konání zahrnuje i **školu nebo školku**, takže stránka fakticky pokrývá
víc než narozeniny. Titulek „Oslavy a akce pro děti" by ale rozmělnil první
dojem: rodič, který hledá narozeniny, by si nebyl jistý, že je na správném
místě. Adresa, položka v navigaci i H1 proto mluví o oslavě a školní akce se
zmíní jednou větou mezi místy konání.

## Obsah stránky

### Data (`src/lib/oslavy.ts`)

```ts
export interface Priklad {
  /** Stabilní klíč pro React i pro případné měření. */
  id: string
  nadpis: string
  /** Co se na takové oslavě děje. Návrh, ne popis proběhlé akce. */
  text: string
}

export const PRIKLADY: Priklad[]
export const ZAJISTIME: string[]
export const POTREBUJEME: string[]
export const MISTA: Array<{ id: string; nadpis: string; text: string }>
```

**Příklady** (návrh k opravě zakladatelem — formulované v podmiňovacím nebo
budoucím čase, nikde „u nás děti vždycky…"):

1. **Každý si odnese vlastní výtisk** — dítě si vybere nebo upraví model,
   pustí tisk a odnese si hotovou věc. Nejkratší cesta k výsledku v ruce.
2. **Rozsvítit a rozhýbat** — micro:bit nebo Arduino: zapojit, naprogramovat
   pár bloků a vidět, jak to reaguje.
3. **Oslavenec dostane něco na míru** — jmenovka, přívěsek nebo trofej
   navržená dopředu a vytištěná na místě.

**Co zajistíme:** lektory, techniku, materiál i program podle toho, kolik dětí
přijde a kolik je času.

**Co potřebujeme od vás:** stůl, zásuvky a přibližný počet dětí. (Žádná další
technika — všechno vozíme.)

**Místa:** u vás doma nebo kde oslava probíhá · v pronajatém prostoru ·
ve škole nebo školce.

### Sekce a rytmus

Podle pravidel v CLAUDE.md (role barev, předěl mezi sousedními sekcemi,
alespoň jedna tmavá kotva na stránku):

| # | Sekce | Pozadí | Poznámka |
|---|---|---|---|
| 1 | Hero — H1, perex, CTA na poptávku | `bg-paper` + `blueprint-grid` | drobečky jako na `/firmy` |
| 2 | Jak to může vypadat — příklady | `bg-paper-soft` + `border-y` | cyan = technologie |
| 3 | Co zajistíme / co potřebujeme | `bg-paper` | dva sloupce |
| 4 | Kde to proběhne — tři dlaždice | `bg-ink` + `blueprint-grid-dark` | tmavá kotva |
| 5 | Poptávka (`#poptavka`) | `bg-paper-soft` + `border-t` | `scroll-mt-24` |

Nosný text (H1, perex, CTA) animuje jen `y`, nikdy `opacity` — a nová stránka
spadá pod `scroll-animace.test.ts`, takže by porušení pravidla rovnou shodilo
testy.

### Formulář

Nová komponenta `src/components/oslavy/OslavaPoptavka.tsx`. Nerecykluje
`FirmyPoptavka`: ta stojí na přepínači tří B2B nabídek (`?typ=`), který tady
nemá co přepínat, a nese pole „firma".

| Pole | Povinné | Proč |
|---|---|---|
| Jméno | ano | |
| E-mail | ano | |
| Telefon | ne | u termínované akce se hodí zavolat |
| Orientační termín | ne, volný text | první otázka, kterou stejně položíte |
| Zpráva | ano | počet dětí, věk, místo — sem patří vše, co stránka neřeší |
| Souhlas GDPR | ano | stejný vzor jako ostatní formuláře |

Termín je **volný text, ne `<input type="date">`**: rodič často ví „někdy
v půlce června", ne přesné datum, a datepicker by ho nutil lhát.

Odesílá se na `/api/contact` s `typ: 'oslava'`. Pole `firma` se neposílá.

## Zásahy do stávajícího kódu

### `src/app/api/contact/contact-payload.ts`

Dnes: `typ` musí projít `isNabidkaId`, jinak 400; `formType` je `'firmy'`,
když `typ` dorazil, jinak `'contact'`.

Nově: whitelist se rozšíří o `'oslava'`, `formType` získá třetí hodnotu
`'oslavy'`. Whitelist zůstává whitelistem — neznámá hodnota dál končí chybou,
protože `typ` putuje do předmětu e-mailu.

```ts
export type PoptavkaTyp = NabidkaId | 'oslava'
export type FormType = 'contact' | 'firmy' | 'oslavy'
```

Předmět e-mailu u oslavy: `Poptávka oslavy — <jméno>` (u firmy je dnes
`Poptávka od firmy — <nadpis nabídky> (<jméno>)`).

### `src/lib/analytics.ts`

Přibude `trackOslavaPoptavka()` → událost `oslava_poptavka_submit`,
`event_category: 'oslavy'`. **Bez konverzní hodnoty** — cena neexistuje, takže
není co poslat; stejné rozhodnutí jako u `trackFirmyPoptavka` ve fázi 5.

### Navigace

`Header.tsx` a `Footer.tsx`: `Tábory · Oslavy · Pro firmy · O nás · Kontakt`.
Oslavy stojí hned za tábory — je to druhá věc, kterou si u Weeks rodič může
objednat.

`Rozcesti.tsx`: dlaždice „Oslavy" nastoupí na místo zakomentovaného e-shopu,
takže karty budou zase čtyři a mřížka se vrátí ke čtyřem sloupcům sama
(počet sloupců se řídí `KARTY.length`).

### `src/app/sitemap.ts`

Přidat `/oslavy`.

### `CLAUDE.md`

Doplnit `/oslavy` do stromu projektu a k poznámce o `form_type` u `/firmy`
přidat, že totéž platí pro `oslavy`.

## Testy

| Soubor | Co hlídá |
|---|---|
| `src/lib/oslavy.test.ts` | Texty neobsahují cenu (`Kč`, „od …"), počet odbavených oslav ani slovo „reference". Každý příklad má id, nadpis i text; id jsou jedinečná. Vzor: `firmy.test.ts`. |
| `src/app/api/contact/contact-payload.test.ts` | `typ: 'oslava'` → `formType: 'oslavy'`; `typ: 'workshopy'` → `'firmy'`; bez `typ` → `'contact'`; neznámý `typ` → chyba. |
| `src/components/scroll-animace.test.ts` | Platí automaticky — čte všechny `.tsx` pod `src/`. |

`contact-payload.test.ts` už existuje — tahle změna ho rozšiřuje, nezakládá.

## Předdeployový krok (mimo repozitář)

**Weeks-hub musí přijmout `form_type: 'oslavy'`.**

Poptávka se neztratí ani tak: `/api/contact` ji posílá **nejdřív do Formspree**
(dorazí na admin@weeks.cz) a teprve potom synchronizuje do hubu. Když hub
hodnotu nezná, odmítne ji čtyřstovkou, route ji zaloguje (`Weeks Hub sync
failed:`) a poptávka pojede dál jen e-mailem.

Není to tedy ztráta dat, ale **tichý výpadek evidence**: oslavy by se
nedostaly do hubu a nikdo by si toho nevšiml, protože rodič dostane potvrzení
a e-mail přijde. Route na non-OK odpověď schválně nepadá — za výpadek hubu
návštěvník nemůže — takže se to neprojeví jako chyba, jen jako řádek v logu.
Proto je ověření na deployi, ne v testech.

Kontrolní seznam před nasazením:
1. weeks-hub zná `oslavy` a ukládá je,
2. odeslat testovací poptávku z preview a najít ji v hubu,
3. teprve potom pustit stránku do navigace na produkci.

## Na co si dát pozor

- **Nedoplňovat cenu, počet oslav ani jméno zákazníka**, dokud je zakladatel
  nedodá. Platí i pro „už jsme jich udělali pár" — 2026-09-22 potvrzeno, že
  žádná neproběhla.
- **Příklady nejsou sliby.** Formulace „dítě si odnese" popisuje záměr
  programu; „vždycky si odnese" nebo „děti si oblíbily" už tvrdí zkušenost,
  kterou nemáme.
- **Nepřidávat věkové rozmezí.** Rozhodnuto 2026-09-22: program se přizpůsobí,
  věk se řeší v poptávce. Číslo na stránce by zbytečně odrazovalo.
- **Neslibovat konkrétní prostor.** Weeks vlastní dílnu nemá a FabLab VARY&TE
  spolupráci nepotvrdil — „v pronajatém prostoru" je horní hranice toho, co
  se dá tvrdit.

## Otevřené vstupy od zakladatele

Nic z toho neblokuje implementaci — stránka půjde postavit a tyhle věci se
doplní nebo opraví v textu:

1. **Znění příkladů.** Tři výše jsou návrh odvozený z toho, co Weeks
   prokazatelně dělá na táboře. Zakladatel je má přepsat do svého jazyka.
2. **Dojezdová vzdálenost.** Jezdí se i mimo Prahu a Karlovy Vary? Dnes
   stránka mlčí, což znamená „zeptejte se".
3. **Nejmenší rozumný počet dětí.** Neuvádí se, ale hodí se to vědět dřív, než
   přijde poptávka na tři děti.
