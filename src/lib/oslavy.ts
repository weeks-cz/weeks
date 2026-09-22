/**
 * Obsah stránky `/oslavy`.
 *
 * Záměrně **ploché seznamy, ne číselník** jako ve `firmy.ts`. Oslava se
 * nekupuje ve variantách: rodič napíše, kolik dětí přijde a kolik má času,
 * a program se postaví podle toho. Pevné balíčky by musely říct, čím se od
 * sebe liší — délkou, počtem dětí, cenou — a to jsou přesně údaje, které
 * zatím nikdo nepotvrdil. Vznikla by fikce v tabulce.
 *
 * POZOR — co se sem NEDOPISUJE, dokud to nedodá zakladatel:
 *
 *   - cena ani „od … Kč“ (ceník neexistuje, stav k 2026-09-22),
 *   - počet odbavených oslav ani jméno zákazníka — **žádná oslava zatím
 *     neproběhla**, takže jakákoli reference by byla vymyšlená,
 *   - věkové rozmezí (rozhodnuto 2026-09-22: program se přizpůsobí, věk se
 *     řeší v poptávce),
 *   - konkrétní prostor — Weeks vlastní dílnu nemá a FabLab VARY&TE
 *     spolupráci nepotvrdil.
 *
 * Schválně tu není prázdné pole `reference`. Ve `firmy.ts` takové pole je
 * a vyrostl z něj odstavec `PARTNERSTVI_ZATIM`, který nabídku oslaboval
 * a 2026-09-22 se smazal. Chybějící reference se řeší mlčením, ne připraveným
 * místem, které volá po vyplnění.
 *
 * Hlídá to `oslavy.test.ts`, ať se cena nebo reference nevloudí zpátky.
 */

export interface Priklad {
  /** Stabilní klíč pro React i pro případné měření. */
  id: string
  nadpis: string
  /** Co se na takové oslavě děje. Návrh programu, ne popis proběhlé akce. */
  text: string
}

/**
 * „Takhle to může vypadat.“ Příklady, ne nabídka k objednání — proto jsou
 * psané v budoucím čase a žádný netvrdí, co už se kde stalo.
 *
 * Odvozené z toho, co se na táboře doopravdy dělá (`src/lib/tabory.ts`,
 * `src/lib/focus.ts`): 3D tisk a elektronika s Arduinem a micro:bitem.
 * Nic, co by Weeks musel teprve umět.
 */
export const PRIKLADY: Priklad[] = [
  {
    id: 'vlastni-vytisk',
    nadpis: 'Každý si odnese vlastní výtisk',
    text: 'Dítě si vybere nebo upraví model, pustí tisk a odnese si hotovou věc. Nejkratší cesta k výsledku, který si jde vzít domů.',
  },
  {
    id: 'rozsvitit-a-rozhybat',
    nadpis: 'Rozsvítit a rozhýbat',
    text: 'Micro:bit nebo Arduino — zapojit, poskládat pár bloků kódu a hned vidět, jak to reaguje na dotek, světlo nebo náklon.',
  },
  {
    id: 'na-miru-oslavenci',
    nadpis: 'Něco na míru oslavenci',
    text: 'Jmenovka, přívěsek nebo trofej navržená dopředu a vytištěná přímo na místě, aby u toho děti mohly být.',
  },
]

/** Co přiveze Weeks. */
export const ZAJISTIME: string[] = [
  'Lektora, který program vede a hlídá, aby se dostalo na všechny děti.',
  'Techniku — 3D tiskárnu, elektroniku i notebooky.',
  'Materiál na to, co si děti odnesou.',
  'Program poskládaný podle toho, kolik dětí přijde a kolik je času.',
]

/** Co musí být na místě. Krátký seznam schválně — delší by odrazoval. */
export const POTREBUJEME: string[] = [
  'Stůl, u kterého se děti vystřídají, a pár zásuvek.',
  'Přibližný počet dětí a kolik času na program je.',
]

export interface Misto {
  id: string
  nadpis: string
  text: string
}

export const MISTA: Misto[] = [
  {
    id: 'u-vas',
    nadpis: 'U vás doma',
    text: 'Nebo kdekoli oslava probíhá. Přivezeme všechno s sebou, vejdeme se ke stolu.',
  },
  {
    id: 'pronajaty-prostor',
    nadpis: 'V pronajatém prostoru',
    text: 'Když se sejde větší parta, dílnu nebo sál najdeme a domluvíme za vás.',
  },
  {
    id: 'skola',
    nadpis: 'Ve škole nebo školce',
    text: 'Stejný program funguje i jako akce ke konci roku nebo jako zpestření dne.',
  },
]
