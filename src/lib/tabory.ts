import type { CityId } from './cities'
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
export type IkonaDne = 'tisk' | 'model' | 'iot' | 'vr' | 'projekt' | 'hra' | 'zvuk' | 'kod'

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
  /**
   * Co si dítě z tábora odnese — poslední řádek „V ceně" na stránce termínu
   * (`vCeneTabora` v `site.ts`). Povinné u aktivního tábora: dřív to byl
   * globální slib „výtisky z 3D tiskárny", který herní tábor nesplní.
   */
  odnese?: string
  /**
   * Lektoři, kteří tábor vedou — `id` z `TYM` (`tym.ts`). Stránka tématu je
   * jmenuje u programu.
   */
  lektori?: string[]
  /**
   * Fotka na výšku do hera stránky tématu (3:4). Bez ní se hero kreslí bez
   * fotky — herní tábor nesmí převzít fotku 3D výtisku.
   */
  fotoHera?: { src: string; alt: string; width: number; height: number }
  /**
   * Fotka na kartu tématu ve výpisu `/tabory`, na šířku. Ilustrační — karta
   * ji nepopisuje jako záběr z konkrétního tábora. Chystaný tábor zatím žádnou
   * nemá, proto je nepovinná a karta bez ní fotku vynechá.
   */
  foto?: { src: string; alt: string }
  /**
   * Fotka karty pro sekci konkrétního města na `/tabory` — přebíjí `foto`.
   * Pod Karlovými Vary nemá viset záběr z pražské dílny; město bez vlastní
   * fotky dostane `foto`.
   */
  fotoMesta?: Partial<Record<CityId, { src: string; alt: string }>>
}

/**
 * Typický den. Jedna sdílená konstanta, ne kopie na každém táboře — rozvrh je
 * stejný pro všechna témata a čtyřikrát opsaný by se rozešel. Vykresluje se jen
 * na stránce aktivního tábora.
 */
export const DENNI_HARMONOGRAM = [
  { time: '8:30', title: 'Příchod dětí', description: 'Postupně do 9:00.' },
  { time: '9:00', title: 'Ranní rozcvička', description: 'Krátká hra nebo výzva na rozehřátí před hlavním programem.' },
  { time: '9:15', title: 'Výukový blok I', description: 'Hlavní téma dne — výuka s lektorem, ukázky, diskuze.' },
  { time: '10:30', title: 'Přestávka', description: 'Svačina a pití.' },
  { time: '10:45', title: 'Výukový blok II', description: 'Praktická část — děti pracují samostatně nebo ve dvojicích na svém projektu.' },
  { time: '12:00', title: 'Oběd', description: 'Zajištěný oběd pro všechny účastníky (v ceně tábora).' },
  { time: '13:00', title: 'Venkovní aktivita', description: 'Pohyb, vzduch, hry. V případě špatného počasí organizovaný program uvnitř.' },
  { time: '14:00', title: 'Odpolední blok', description: 'Pokračování práce na projektech, nová témata nebo kreativní výzvy.' },
  { time: '15:00', title: 'Přestávka', description: 'Odpolední pauza a svačina.' },
  { time: '15:15', title: 'Tvůrčí práce', description: 'Samostatná práce na vlastním projektu, individuální přístup lektorů.' },
  { time: '15:45', title: 'Dokončení a úklid', description: 'Dokončení projektů, úklid pracoviště a shrnutí dne.' },
  { time: '16:00', title: 'Postupný odchod', description: 'Vyzvednutí do 16:30, prostor pro dotazy rodičů.' },
]

/**
 * Ostrá data.
 *
 * POZOR — tábory ve stavu `chystame` jsou zatím jen záměr. Nemají potvrzený
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
    // VR je ze zaměření pryč: vybavení na něj není jisté a v Karlových Varech
    // se loni nekonalo, takže by ho web sliboval na základě ničeho. Týdenní
    // program to jen potvrzuje — žádný den VR neobsahuje. Modul `vr` zůstává
    // ve `focus.ts` i s obsahem; vrátí se dopsáním do tohohle pole.
    focus: ['3d-tisk', 'iot'],
    odnese: 'Vlastní výtisky z 3D tiskárny domů',
    fotoHera: {
      src: '/images/tabor/vytisk-v-ruce.webp',
      alt: 'Vlastní návrh, vytištěný na táboře',
      width: 896,
      height: 1195,
    },
    faq: [
      {
        question: 'Co si dítě odveze domů?',
        // Obecný slib o „sestaveném zařízení" tu stál proti konkrétní odpovědi
        // modulu `iot` v `focus.ts` („Micro:bity a Arduina zůstávají
        // v laboratoři"). Web nesmí tvrdit obojí — obecný slib proto mizí
        // a odpověď posílá čtenáře k zaměření, kde platí provozní pravda.
        // Do 2026-11-10 stála otázka v obecných FAQ (`site.ts`); s herním
        // táborem patří k tématu.
        answer:
          'Vlastní výtisky z 3D tiskárny a vlastní 3D model, který si navrhlo. U elektroniky záleží na zaměření turnusu — co si děti odvážejí a co zůstává v laboratoři, píšeme u každého zaměření zvlášť.',
      },
    ],
    foto: {
      src: '/images/tabor/dilna-ucebna.webp',
      alt: 'Děti u počítačů a 3D tiskáren v dílně, mezi stoly prochází lektor',
    },
    fotoMesta: {
      'karlovy-vary': {
        src: '/images/tabor/fablab-ucebna.webp',
        alt: 'Děti u počítačů modelují ve 3D, vzadu lektor s klukem u 3D tiskárny a holka si prohlíží vytištěný díl',
      },
    },
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
    status: 'aktivni',
    // Program podle lektora Marka Vykysalého (list „Tábor 1: vývoj her" na
    // týmovém Drivu, stav 2026-11-10). Zbraně a boj z jeho programu říká web
    // rodičům jako střely a nepřátele (rozhodnutí 2026-11-10).
    perex:
      'Vlastní akční 2D hra v enginu Godot: level, postava, střely, zvuky i efekty. Hotovou hru si dítě odnese domů.',
    popis:
      'Týden v herním enginu Godot. Každé dítě postaví vlastní akční 2D hru s levelem, postavou, střelami, nepřáteli, zvuky a efekty a v pátek si ji sestavenou odnese domů. Programovat umět nemusí, první řádky kódu přijdou na řadu až ve čtvrtek.',
    focus: ['herni-vyvoj'],
    odnese: 'Vlastní hra, kterou si dítě odnese domů',
    lektori: ['marek-vykysaly'],
    // Skutečná fotka z tábora Weeks (ne z herního — ten se ještě nekonal),
    // proto alt nepopisuje práci na hře. Pražská karta chytrých technologií
    // má záběr z dílny, tahle z učebny ve FabLabu, ať vedle sebe nestojí
    // dvakrát stejná fotka.
    foto: {
      src: '/images/tabor/fablab-ucebna.webp',
      alt: 'Děti u počítačů na táboře Weeks, každé u své obrazovky',
    },
    program: [
      {
        den: 'Pondělí',
        ikona: 'hra',
        title: 'Godot a první level',
        description:
          'Seznámení s herním enginem Godot. Děti si založí vlastní projekt, vytvoří postavu a z připravených dílků postaví první level.',
        highlights: ['Herní engine Godot', 'Vlastní postava', 'První level z dílků'],
      },
      {
        den: 'Úterý',
        ikona: 'hra',
        title: 'Pohyb, fyzika a akce',
        description:
          'Postava dostane parametry a fyziku, takže se pohybuje a skáče, jak má. Do hry přibudou střely, jejich sbírání a první nepřátelé, na kterých se akce vyzkouší.',
        highlights: ['Pohyb a fyzika', 'Střely a jejich sbírání', 'První nepřátelé'],
      },
      {
        den: 'Středa',
        ikona: 'zvuk',
        title: 'Ladění a zvuky',
        description:
          'Dopoledne hru společně ladíme, aby fungovala a nic se v ní nerozbíjelo. Odpoledne si děti vytvoří vlastní zvuky a dají je do hry.',
        highlights: ['Testování a ladění', 'Tvorba zvuků', 'Zvuky ve hře'],
      },
      {
        den: 'Čtvrtek',
        ikona: 'kod',
        title: 'Efekty a první kód',
        description:
          'Vizuální efekty, třeba různé druhy střel nebo rychlý úskok. Odpoledne první krok do programování: základy jazyka GDScript, ve kterém se v Godotu píše herní logika.',
        highlights: ['Vizuální efekty', 'Základy GDScriptu', 'Herní logika v kódu'],
      },
      {
        den: 'Pátek',
        ikona: 'projekt',
        title: 'Hotová hra',
        description:
          'Děti si samy naprogramují jednoduchou funkci, třeba sbírání mincí, doladí, co je potřeba, a hru sestaví tak, aby šla spustit i doma.',
        highlights: ['Vlastní funkce v kódu', 'Sestavení hry', 'Hra domů'],
      },
    ],
    faq: [
      {
        question: 'V čem budou děti hry dělat?',
        answer:
          'V herním enginu Godot. Je zdarma a otevřený, takže v něm dítě může pokračovat i doma.',
      },
      {
        question: 'Musí dítě umět programovat?',
        answer:
          'Ne. Většinu týdne se hra skládá v editoru, kód přijde na řadu až ve čtvrtek a v pátek, a to od úplných základů.',
      },
      {
        question: 'Potřebuje dítě vlastní počítač?',
        answer: 'Ne. Tábor běží v počítačové učebně a každé dítě má svůj počítač.',
      },
      {
        question: 'Co si dítě odveze domů?',
        answer: 'Vlastní hru. V pátek ji sestavíme tak, aby šla spustit i doma na počítači.',
      },
    ],
  },
  {
    id: 'ai',
    name: 'Tábor umělé inteligence a elektroniky',
    shortName: 'AI a elektronika',
    status: 'chystame',
    // Směr podle pohovoru s lektorem (2026-09-29): AI na malé desce se
    // senzory, ne chatbot. Věk 12–16 je dohodnutý jen pro tenhle tábor, proto
    // stojí v textu — chystaný tábor nemá turnus, odkud by se vzal
    // `ageRange`. Až tábor dostane turnus, patří věk tam (a `registration.ts`
    // dnes pouští jen 9–15). Deska, cena ani to, že si ji dítě odnese, nejsou
    // potvrzené — proto „chceme", ne „dostane".
    perex:
      'Pro děti 12–16 let. Postaví si malé zařízení se senzory a naučí ho samo poznávat, co se kolem něj děje.',
    popis:
      'Tábor teprve chystáme. Umělou inteligenci na něm děti nepotkají v chatu, ale v malé desce se senzory, kterou během týdne naučí rozpoznat třeba gesto, zvuk nebo pohyb. Učí se přitom stejně jako velké modely: z příkladů. Programovat umět nemusí, většina práce se odklikne v jednoduchém prostředí a kdo chce víc, přepne se do kódu. Chceme, aby si hotové zařízení na konci týdne odnesly domů.',
    focus: [],
    zkusiSi: [
      'Nasbírá data ze senzorů a podívá se, jak svět „vidí“ stroj',
      'Natrénuje vlastní model, který se z příkladů naučí poznat, co se děje',
      'Nahraje ho do desky a zjistí, kde se trefí, kde se splete a proč',
      'Vymyslí, k čemu jeho zařízení poslouží, a předvede ho ostatním',
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
      if (!tabor.odnese) {
        problems.push(
          `Tábor "${tabor.id}" je aktivní, ale neříká, co si z něj dítě odnese — chybí řádek „V ceně".`
        )
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
