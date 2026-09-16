/**
 * Obsah tří nabídek pro firmy jako znovupoužitelný modul.
 *
 * Tým ho upravuje na jednom místě, testy nad ním hlídají zákaz vymyšlených
 * čísel a nedoložitelných tvrzení (ceny, reference, certifikace) a stránka
 * zůstane čitelná — stejný princip jako u `src/lib/focus.ts`.
 */

export type NabidkaId = 'deti-zamestnancu' | 'workshopy' | 'partnerstvi'

/** Číselník pro ověření vstupu z formuláře. Jediný zdroj pravdy pro typ poptávky. */
export const NABIDKA_IDS: NabidkaId[] = ['deti-zamestnancu', 'workshopy', 'partnerstvi']

/**
 * Ověří, že hodnota je platné id nabídky. Bere `unknown`, aby posloužila obojímu
 * volajícímu: parseru `/api/contact` (hodnota z těla požadavku, tedy `unknown`)
 * i formuláři na `/firmy` (`?typ=` z adresy, tedy `string | null`). Stráž patří
 * vedle číselníku, o který se opírá — jinak vznikne pokaždé znovu.
 */
export function isNabidkaId(value: unknown): value is NabidkaId {
  return typeof value === 'string' && (NABIDKA_IDS as string[]).includes(value)
}

export interface B2BNabidka {
  id: NabidkaId
  /** Nadpis sekce na stránce. */
  nadpis: string
  /** Komu je nabídka určená — jedna věta, aby čtenář poznal, jestli je to pro něj. */
  proKoho: string
  /** Dvě až tři věty, co to je. */
  perex: string
  /** Jak to probíhá — krátké odrážky, ne odstavce. */
  jakToProbiha: string[]
  /** Co zajistí Weeks. */
  zajistimeMy: string[]
  /** Co musí zajistit firma. */
  zajistiteVy: string[]
  /**
   * MEZERA K DOPLNĚNÍ — reference od firem, které nabídku využily.
   * Weeks zatím neodbavil žádnou firemní zakázku, takže je pole prázdné a
   * komponenta ho nevykresluje. Doplní tým, až budou reálné reference
   * i souhlas firmy s uvedením jména.
   */
  reference?: string[]
}

const NABIDKY_MAP: Record<NabidkaId, B2BNabidka> = {
  'deti-zamestnancu': {
    id: 'deti-zamestnancu',
    nadpis: 'Dny pro děti zaměstnanců',
    proKoho: 'Pro HR a personální oddělení, které hledá benefit s viditelným výsledkem.',
    perex:
      'O prázdninách a ve dnech ředitelského volna řeší rodiče ve vaší firmě stejnou otázku: kam s dítětem. Postavíme program, který dítě baví a rodičům uvolní ruce — a vy ho můžete nabídnout jako benefit, který se dá obhájit.',
    jakToProbiha: [
      'Celý den od 8:00 do 17:00, stejný režim jako na našem letním táboře.',
      'Děti od 9 do 15 let, ve skupině nejvýše patnáct.',
      'Jeden lektor na pět dětí.',
      'Každé dítě si odnese vlastní výsledek — vytištěný model, zapojený obvod nebo hotovou hru.',
    ],
    zajistimeMy: [
      'Program, lektory a veškerý materiál.',
      'Techniku — 3D tiskárny, elektroniku, headsety.',
      'Dozor po celou dobu programu.',
      'Informace pro rodiče v podobě, kterou můžete rozeslat beze změny.',
    ],
    zajistiteVy: [
      'Prostor, nebo se domluvíme na pronájmu dílny.',
      'Seznam přihlášených dětí a kontakt na rodiče.',
      'Jednu kontaktní osobu, se kterou to doladíme.',
    ],
    reference: [],
  },
  workshopy: {
    id: 'workshopy',
    nadpis: 'Workshopy a teambuilding',
    proKoho: 'Pro office managery a vedoucí týmů, kteří chtějí zážitek s hmatatelným výstupem.',
    perex:
      'Teambuilding, ze kterého si každý něco odnese v ruce. Žádné motivační hry, žádné padání do náruče — tým si sedne k technologii, kterou učíme děti, a do konce dne z ní něco postaví.',
    jakToProbiha: [
      'Na výběr 3D tisk, elektronika s Arduinem nebo virtuální realita.',
      'Půldenní nebo celodenní formát podle toho, kolik času tým má.',
      'Skupina od osmi do dvaceti lidí; u větších týmů se dělíme na skupiny.',
      'Bez potřeby předchozích znalostí — začínáme od nuly.',
    ],
    zajistimeMy: [
      'Lektory, techniku i materiál.',
      'Program přizpůsobený tomu, co má tým z workshopu odnést.',
      'Výstup, který si účastníci nechají.',
    ],
    zajistiteVy: ['Místnost s dostatkem stolů a zásuvek.', 'Počet účastníků a termín.'],
    reference: [],
  },
  partnerstvi: {
    id: 'partnerstvi',
    nadpis: 'Partnerství a sponzoring',
    proKoho: 'Pro marketing a vedení firem, které chtějí podpořit technické vzdělávání dětí.',
    perex:
      'Tábor stojí na vybavení, které se opotřebovává, a na materiálu, který se spotřebuje. Partnerství může mít podobu peněz, techniky i času vašich lidí — a rádi ho postavíme podle toho, co dává smysl vám.',
    jakToProbiha: [
      'Ozvete se a řekneme si, co která strana čeká.',
      'Domluvíme konkrétní podobu — od jednorázové podpory turnusu po dlouhodobou spolupráci.',
      'Co si na sebe vzájemně slíbíme, dáme písemně.',
    ],
    zajistimeMy: [
      'Uvedení vaší firmy na webu a v materiálech turnusu, který podpoříte.',
      'Zpětnou vazbu, co se za vaši podporu pořídilo.',
      'Možnost zapojit vaše lidi jako hosty v programu.',
    ],
    zajistiteVy: ['Představu, co od spolupráce čekáte.', 'Kontakt na člověka, který o ní rozhoduje.'],
    reference: [],
  },
}

export const NABIDKY: B2BNabidka[] = NABIDKA_IDS.map((id) => NABIDKY_MAP[id])

/**
 * Poctivé přiznání místo vymyšlené case study. Až vznikne první spolupráce,
 * tahle věta se nahradí jejím popisem — do té doby je lepším argumentem
 * než mlčení, protože firma stejně zjistí, že reference nikde nejsou.
 */
export const PARTNERSTVI_ZATIM =
  'Zatím jsme žádné partnerství neuzavřeli. Nechceme předstírat opak — první spolupráci postavíme s vámi od začátku a podle toho, co vám dává smysl.'

export function getNabidky(): B2BNabidka[] {
  return NABIDKY
}

export function getNabidka(id: NabidkaId): B2BNabidka {
  const nabidka = NABIDKY_MAP[id]
  if (!nabidka) {
    throw new Error(`Neznámé id nabídky: ${id}`)
  }
  return nabidka
}
