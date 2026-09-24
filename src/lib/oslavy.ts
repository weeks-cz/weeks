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

export interface KrokPrubehu {
  /** Čas od začátku oslavy, ne hodina na hodinách — oslava začíná, kdy chcete. */
  cas: string
  nadpis: string
  text: string
}

export interface Prubeh {
  id: string
  nadpis: string
  /** Přibližná délka slovy. Model, ne závazek — proto „zhruba“. */
  delka: string
  kroky: KrokPrubehu[]
}

/**
 * Modelové průběhy — „takhle to může vypadat od začátku do konce“.
 *
 * Přidané na přání zakladatele (2026-09-24): rodič si oslavu snáz představí,
 * když vidí celé odpoledne, ne jen jednotlivé nápady. Pořád jsou to **modely,
 * ne balíčky** — nemají cenu ani počet dětí a stránka pod nimi říká, že se
 * dají poskládat úplně jinak. Časy jsou relativní (0:15 = čtvrt hodiny od
 * začátku), aby nesváděly k domněnce, že oslava začíná v pevnou hodinu.
 */
export const PRUBEHY: Prubeh[] = [
  {
    id: 'kratsi-doma',
    nadpis: 'Kratší oslava doma',
    delka: 'zhruba dvě hodiny',
    kroky: [
      {
        cas: '0:00',
        nadpis: 'Přivítání',
        text: 'Lektor ukáže tiskárnu i elektroniku a řekne, co dnes děti postaví.',
      },
      {
        cas: '0:15',
        nadpis: 'Návrh výtisku',
        text: 'Každý si vybere nebo upraví model — jmenovku, přívěsek, figurku — a pošle ho do tiskárny.',
      },
      {
        cas: '0:45',
        nadpis: 'Elektronika',
        text: 'Zatímco tiskárna pracuje, děti zapojují micro:bit a rozsvěcí první světla.',
      },
      {
        cas: '1:30',
        nadpis: 'Pauza na dort',
        text: 'Prostor pro oslavence. Program počká.',
      },
      {
        cas: '1:45',
        nadpis: 'Rozdání výtisků',
        text: 'Každý si vezme, co navrhl, a oslava pokračuje po svém.',
      },
    ],
  },
  {
    id: 'delsi-stanoviste',
    nadpis: 'Delší odpoledne se stanovišti',
    delka: 'zhruba tři hodiny',
    kroky: [
      {
        cas: '0:00',
        nadpis: 'Přivítání a skupinky',
        text: 'Děti se rozdělí do menších skupinek, které se budou střídat na stanovištích.',
      },
      {
        cas: '0:15',
        nadpis: 'Stanoviště: 3D modelování',
        text: 'U notebooků si skupinka navrhne vlastní model, který se pak vytiskne.',
      },
      {
        cas: '1:00',
        nadpis: 'Stanoviště: elektronika',
        text: 'Arduino nebo micro:bit — obvod, který reaguje na dotek, světlo nebo náklon.',
      },
      {
        cas: '1:45',
        nadpis: 'Pauza na dort',
        text: 'Přestávka, dárky a oslavenec v hlavní roli.',
      },
      {
        cas: '2:15',
        nadpis: 'Společná výzva',
        text: 'Skupinky si změří síly v úkolu, ve kterém použijí, co se odpoledne naučily.',
      },
      {
        cas: '2:45',
        nadpis: 'Rozdání výtisků',
        text: 'Každý si odnese svůj model a rozloučíme se.',
      },
    ],
  },
]

/** Co přiveze Weeks. */
export const ZAJISTIME: string[] = [
  'Lektora, který program vede a hlídá, aby se dostalo na všechny děti.',
  'Techniku — 3D tiskárnu, elektroniku i notebooky.',
  'Materiál na to, co si děti odnesou.',
  'Program poskládaný podle toho, kolik dětí přijde a kolik je času.',
]

/**
 * Co musí být na místě. Krátký seznam schválně — delší by odrazoval.
 *
 * Stůl odtud zmizel na přání zakladatele (2026-09-24): rodič neměl mít pocit,
 * že musí kvůli programu shánět nábytek. Zásuvky zůstávají — bez nich tiskárna
 * ani notebooky nepojedou.
 */
export const POTREBUJEME: string[] = [
  'Pár zásuvek poblíž místa, kde program poběží.',
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
    text: 'Nebo kdekoli oslava probíhá. Přivezeme všechno s sebou.',
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
