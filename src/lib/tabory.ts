import { getFocusModules, type FocusId } from './focus'

/**
 * Tábor — téma, ne termín.
 *
 * Nad turnusem (`turnusy.ts`) stojí tábor: „co se tam dělá". Turnus říká
 * „kdy a kde". Rozdělení vzniklo, když k táboru chytrých technologií přibyla
 * další témata — jedna stránka by je nepobrala a čtyři adresy `/tabor-*` byly
 * přesně to, co přestavba webu rušila.
 *
 * Na tábor ukazuje turnus přes `taborIds`, ne naopak. Import jde jedním směrem
 * `turnusy.ts → tabory.ts → focus.ts`; tenhle soubor proto `turnusy.ts`
 * neimportuje a nesmí o turnusech nic vědět.
 *
 * Tábor nemá `slug` zvlášť od `id`: na rozdíl od turnusu nesedí v databázi ani
 * na faktuře, takže dvě pole by se jen mohla rozejít. `id` je zároveň adresa.
 */

export type TaborId = 'chytre-technologie' | 'game-dev' | 'ai' | 'webovy-tabor'

export type TaborStatus =
  /** Běží, má program i turnusy. */
  | 'aktivni'
  /** Chystá se. Stránka smí říct záměr, ne program, cenu ani vybavení. */
  | 'chystame'

/**
 * Klíč ikony dne. Schválně řetězec, ne komponenta z `lucide-react`: data musí
 * jít načíst v testu (prostředí `node`) bez Reactu. Mapa klíč → ikona žije ve
 * stránce, která dny vykresluje.
 */
export type IkonaDne = 'tisk' | 'model' | 'iot' | 'vr' | 'projekt'

export interface DenProgramu {
  den: string
  ikona: IkonaDne
  title: string
  description: string
  highlights: string[]
}

export interface Tabor {
  id: TaborId
  /** Plný název — do nadpisu stránky a na fakturu. */
  name: string
  /** Krátký název — na karty a do drobečků. */
  shortName: string
  status: TaborStatus
  /** Jedna až dvě věty na kartu. */
  perex: string
  /** Odstavec do hera stránky tématu. */
  popis: string
  focus: FocusId[]
  /**
   * „Co si dítě zkusí". U aktivního tábora se nechává prázdné a body se odvodí
   * ze zaměření (`focus.tryOut`), ať se stejný text nepíše dvakrát.
   * U chystaného tábora je povinné — zaměření pro něj obsah nemá.
   */
  zkusiSi?: string[]
  /** Program Po–Pá. Jen aktivní tábor; chystaný nesmí slibovat, co se bude dít. */
  program?: DenProgramu[]
  /** Otázky, které se týkají právě tohohle tématu. Obecné jsou v `site.ts`. */
  faq?: Array<{ question: string; answer: string }>
}

/**
 * Typický den. Jedna sdílená konstanta, ne kopie na každém táboře — rozvrh je
 * stejný pro všechna témata a čtyřikrát opsaný by se rozešel. Vykresluje se jen
 * na stránce aktivního tábora.
 */
export const DENNI_HARMONOGRAM = [
  { time: '8:00', title: 'Příchod dětí', description: '' },
  { time: '8:30', title: 'Ranní rozcvička', description: 'Krátká hra nebo výzva na rozehřátí před hlavním programem.' },
  { time: '9:00', title: 'Výukový blok I', description: 'Hlavní téma dne — výuka s lektorem, ukázky, diskuze.' },
  { time: '10:30', title: 'Přestávka', description: 'Svačina a pití.' },
  { time: '10:45', title: 'Výukový blok II', description: 'Praktická část — děti pracují samostatně nebo ve dvojicích na svém projektu.' },
  { time: '12:00', title: 'Oběd', description: 'Zajištěný oběd pro všechny účastníky (v ceně tábora).' },
  { time: '13:00', title: 'Venkovní aktivita', description: 'Pohyb, vzduch, hry. V případě špatného počasí organizovaný program uvnitř.' },
  { time: '14:00', title: 'Odpolední blok', description: 'Pokračování práce na projektech, nová témata nebo kreativní výzvy.' },
  { time: '15:00', title: 'Přestávka', description: 'Odpolední pauza a svačina.' },
  { time: '15:15', title: 'Tvůrčí práce', description: 'Samostatná práce na vlastním projektu, individuální přístup lektorů.' },
  { time: '16:00', title: 'Dokončení a úklid', description: 'Dokončení projektů, úklid pracoviště a shrnutí dne.' },
  { time: '17:00', title: 'Postupný odchod', description: 'Prostor pro dotazy rodičů.' },
]

/**
 * Ostrá data.
 *
 * POZOR — tři tábory ve stavu `chystame` jsou zatím jen záměr. Nemají potvrzený
 * program, termín, cenu ani vybavení a jejich texty jsou návrh k opravě
 * zakladatelem. Dokud nedodá potvrzené znění, nedoplňuje se sem harmonogram,
 * galerie, cena ani konkrétní technika — stejné pravidlo jako u prázdných
 * `reference` ve `firmy.ts`.
 */
export const TABORY: Tabor[] = [
  {
    id: 'chytre-technologie',
    name: 'Tábor chytrých technologií',
    shortName: 'Chytré technologie',
    status: 'aktivni',
    perex:
      'Celý týden 3D tisk, 3D modelování a IoT s Arduinem. Hotový výrobek, který si dítě odveze domů.',
    popis:
      'Týden je rozdělený na dva tematické bloky — první tři dny věnujeme 3D tisku a modelování, ve čtvrtek a v pátek se vrhneme na IoT s Arduinem.',
    focus: ['3d-tisk', 'iot', 'vr'],
    program: [
      {
        den: 'Pondělí',
        ikona: 'tisk',
        title: '3D tisk — základy',
        description:
          'Úvod do světa 3D tisku. Jak tiskárna funguje, jak najít a připravit model a jak ho poslat na tisk. Každý si spustí svůj první výtisk.',
        highlights: ['Princip FDM tisku', 'Práce s modelem online', 'Spuštění prvního tisku'],
      },
      {
        den: 'Úterý',
        ikona: 'model',
        title: '3D modelování',
        description:
          'Z hotových modelů k vlastním kreacím. Děti se naučí základy 3D modelování a navrhnou vlastní objekt, který si druhý den vytisknou.',
        highlights: ['Základy 3D softwaru', 'Vlastní návrh modelu', 'Příprava pro tisk'],
      },
      {
        den: 'Středa',
        ikona: 'tisk',
        title: '3D tisk vlastních modelů',
        description:
          'Tisk vlastních návrhů z úterý, dokončování, broušení a finální úpravy. Vše si děti odnesou domů.',
        highlights: ['Tisk vlastních modelů', 'Post-processing', 'Hotové výtisky domů'],
      },
      {
        den: 'Čtvrtek',
        ikona: 'iot',
        title: 'IoT & Arduino — úvod',
        description:
          'Co je to IoT a k čemu slouží. Seznámení s Arduinem a Micro:bitem, práce se senzory a LED diodami, první programy.',
        highlights: ['Arduino & Micro:bit', 'Senzory a LED', 'První IoT obvod'],
      },
      {
        den: 'Pátek',
        ikona: 'projekt',
        // Bez slibu, že si dítě elektroniku odveze domů: modul `iot` ve
        // `focus.ts` říká, že Micro:bity a Arduina zůstávají v laboratoři,
        // a web nesmí tvrdit obojí.
        title: 'IoT projekt + výstava',
        description:
          'Dokončení vlastního IoT zařízení a malá výstava pro rodiče. Děti prezentují, co za týden vytvořily.',
        highlights: ['Vlastní IoT zařízení', 'Prezentace pro rodiče', 'Dokončený projekt'],
      },
    ],
  },
  {
    id: 'game-dev',
    name: 'Tábor herního vývoje',
    shortName: 'Herní vývoj',
    status: 'chystame',
    perex: 'Vlastní hra od nápadu po hratelnou verzi — úrovně, ovládání i zvuk.',
    popis:
      'Tábor teprve chystáme. Chceme na něm dojít od nápadu k hratelné hře, kterou si děti na konci týdne navzájem zahrají.',
    focus: ['herni-vyvoj'],
    zkusiSi: [
      'Postaví si vlastní úroveň a rozpohybuje v ní postavu',
      'Napíše pravidla hry — co se stane, když hráč vyhraje nebo prohraje',
      'Zkusí si, jak se do hry dostane zvuk a hudba',
      'Dá hru zahrát ostatním a uvidí, co jim v ní nefunguje',
    ],
  },
  {
    id: 'ai',
    name: 'Tábor umělé inteligence',
    shortName: 'Umělá inteligence',
    status: 'chystame',
    perex: 'Jak modely uvnitř fungují a jak se s nimi dá postavit něco vlastního.',
    popis:
      'Tábor teprve chystáme. Chceme na něm ukázat, co model doopravdy dělá, když odpovídá — a nechat děti postavit si vlastního pomocníka.',
    focus: [],
    zkusiSi: [
      'Zkusí si, co se v modelu děje, než odpoví',
      'Postaví si vlastního pomocníka na konkrétní úlohu',
      'Uvidí, kde se model splete a proč se mu nedá věřit slepě',
      'Vyzkouší generování obrázků a jeho hranice',
    ],
  },
  {
    id: 'webovy-tabor',
    name: 'Webový tábor',
    shortName: 'Weby',
    status: 'chystame',
    perex: 'Vlastní stránka, která žije na internetu — od návrhu po spuštění.',
    popis:
      'Tábor teprve chystáme. Chceme, aby si každé dítě odneslo adresu vlastní stránky, kterou může poslat kamarádům.',
    focus: [],
    zkusiSi: [
      'Napíše vlastní stránku v HTML a CSS',
      'Rozpohybuje ji kouskem JavaScriptu',
      'Vyzkouší si, jak vypadá na mobilu',
      'Vystaví ji na adresu, kterou si může otevřít kdokoli',
    ],
  },
]

/** Tábory v pořadí, v jakém se mají ukazovat: aktivní napřed. */
export function getTabory(list: Tabor[] = TABORY): Tabor[] {
  return list
    .slice()
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'aktivni' ? -1 : 1))
}

export function getTabor(id: string, list: Tabor[] = TABORY): Tabor | undefined {
  return list.find((t) => t.id === id)
}

export function getAktivniTabory(list: Tabor[] = TABORY): Tabor[] {
  return getTabory(list).filter((t) => t.status === 'aktivni')
}

export function getChystaneTabory(list: Tabor[] = TABORY): Tabor[] {
  return getTabory(list).filter((t) => t.status === 'chystame')
}

/**
 * Body „co si dítě zkusí". Vlastní body tábora mají přednost; jinak se
 * poskládají ze zaměření, aby se stejný text nepsal na dvou místech.
 */
export function zkusiSiTabora(tabor: Tabor): string[] {
  if (tabor.zkusiSi && tabor.zkusiSi.length > 0) return tabor.zkusiSi
  return getFocusModules(tabor.focus).flatMap((m) => m.tryOut)
}

/**
 * Kontrola úplnosti táborů.
 *
 * Hlídá to, co typový systém neuhlídá: jedinečnost adres, úplnost aktivního
 * tábora a to, že chystaný tábor nic neslibuje. Běží v testech nad ostrými
 * daty, takže se chyba pozná při `npm test`, ne až na webu.
 *
 * Vrací seznam popsaných problémů. Prázdný seznam znamená v pořádku.
 */
export function validateTabory(list: Tabor[] = TABORY): string[] {
  const problems: string[] = []
  const seen = new Set<string>()

  for (const tabor of list) {
    if (seen.has(tabor.id)) {
      problems.push(`Duplicitní id "${tabor.id}" — dva tábory by měly stejnou adresu.`)
    }
    seen.add(tabor.id)

    if (tabor.status === 'aktivni') {
      if (!tabor.program || tabor.program.length === 0) {
        problems.push(
          `Tábor "${tabor.id}" je aktivní, ale nemá program — stránka by byla prázdná.`
        )
      }
      if (tabor.focus.length === 0) {
        problems.push(`Tábor "${tabor.id}" je aktivní, ale nemá zaměření.`)
      }
    }

    if (tabor.status === 'chystame') {
      if (tabor.program) {
        problems.push(
          `Tábor "${tabor.id}" se teprve chystá, ale má program — chystaný tábor nesmí tvrdit, co se na něm bude dít.`
        )
      }
      if (!tabor.zkusiSi || tabor.zkusiSi.length === 0) {
        problems.push(
          `Tábor "${tabor.id}" se teprve chystá a nemá vlastní body „co si dítě zkusí" — ze zaměření je nemá odkud vzít.`
        )
      }
    }
  }

  return problems
}
