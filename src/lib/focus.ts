/**
 * Zaměření turnusu jako znovupoužitelný obsahový modul.
 *
 * Turnusy se od sebe liší tím, čemu se na nich děti věnují. Popis toho, co si
 * dítě vyzkouší, proto nepatří stránce programu (ty zanikají), ale zaměření —
 * odtud si ho přitáhne jak přehled na /tabor, tak stránka konkrétního turnusu.
 */

export type FocusId = '3d-tisk' | 'iot' | 'vr' | 'herni-vyvoj'

export interface FocusModule {
  id: FocusId
  name: string
  /** Jedna věta pro kartu turnusu. */
  short: string
  /** Co si dítě konkrétně vyzkouší — do odrážek na stránce. */
  tryOut: string[]
  /**
   * Konkrétní modely tiskáren. Jen u 3D tisku. Dnes se nevykresluje —
   * proč, stojí v komentáři u dat níž.
   */
  printers?: string[]
  /** Konkrétní hardware — desky, čidla. Jen u IoT. */
  hardware?: string[]
  /** Fotky ve veřejné složce. Vykresluje je `ProjectGallery` — na `/tabor` i na stránce turnusu. */
  gallery?: Array<{ src: string; alt: string }>
  /** Otázky rodičů, které se týkají právě tohohle zaměření. */
  faq?: Array<{ question: string; answer: string }>
}

export const FOCUS_IDS: FocusId[] = ['3d-tisk', 'iot', 'vr', 'herni-vyvoj']

const FOCUS: Record<FocusId, FocusModule> = {
  '3d-tisk': {
    id: '3d-tisk',
    name: '3D tisk',
    short:
      'Od vlastního modelu k hotovému výtisku, který si dítě odveze domů.',
    tryOut: [
      'Navrhne si vlastní model a připraví ho k tisku',
      // Bez jmenného seznamu modelů — ze stejného důvodu, z jakého se
      // nevykresluje pole `printers` níž.
      'Osahá si několik různých typů tiskáren',
      'Uvidí, proč tisk selže, a naučí se tomu předejít',
      'Odveze si vlastní výtisk',
    ],
    // POZOR — tenhle seznam se schválně nikde nevykresluje. Je to inventář
    // konkrétního prostoru (HWLab), který pro rok 2027 není domluvený, a
    // jediné potvrzené místo (FabLab VARY&TE) svoje modely v datech nemá.
    // Vypsat ho u turnusu, který o dvě obrazovky výš přiznává „Místo
    // upřesníme", by slibovalo vybavení, o kterém nikdo neví, jestli tam
    // bude. Vykreslit se smí, až bude jasné, na čem se na konkrétním místě
    // opravdu pracuje — a pak podle toho místa, ne podle tohohle pole.
    printers: ['MK3S', 'MK4S', 'Mini+', 'CORE One', 'CORE One L', 'XL', 'SL1S'],
    gallery: [
      // Dítě s vlastním výtiskem v ruce jde záměrně první: galerie má ukázat,
      // co si dítě odveze, ne jen co tiskárna umí.
      {
        src: '/images/tabor/vytisk-v-ruce.webp',
        alt: 'Chlapec drží vytištěný díl, který si sám navrhl',
      },
      { src: '/images/gallery/3d-prints-collection.jpg', alt: 'Kolekce výtisků z tábora' },
      { src: '/images/gallery/3d-uv-curing.jpg', alt: 'UV vytvrzování resinových výtisků' },
      { src: '/images/gallery/3d-dragon-hands.jpg', alt: 'Liška z 3D tiskárny' },
      { src: '/images/gallery/3d-cat-lowpoly.jpg', alt: 'Low-poly kočka' },
      { src: '/images/gallery/3d-dragon-desk.jpg', alt: 'Oranžová liška na stole' },
      { src: '/images/gallery/3d-resin-figurines.jpg', alt: 'Resinové figurky' },
      { src: '/images/gallery/3d-printer-slicer.jpg', alt: 'Práce s 3D tiskárnou a slicerem' },
      { src: '/images/gallery/3d-printers-row.jpg', alt: 'Řada Prusa tiskáren' },
    ],
    faq: [
      {
        question: 'Je potřeba nějaká předchozí zkušenost s 3D tiskem?',
        answer:
          'Ne, žádné předchozí zkušenosti nejsou potřeba. Program je navržený tak, aby zvládli i úplní začátečníci. Pokročilí dostanou složitější výzvy.',
      },
      {
        question: 'Co si děti odnesou domů?',
        answer:
          'Každé dítě si odnese vlastní navržený a vytištěný 3D model – klíčenku, stojánek, hračku nebo jiný předmět podle vlastního návrhu.',
      },
    ],
  },
  'iot': {
    id: 'iot',
    name: 'IoT a elektronika',
    short:
      'Zapojování a programování zařízení, která reagují na okolní svět.',
    tryOut: [
      'Zapojí obvod na nepájivém poli a rozsvítí ho',
      'Naprogramuje Micro:bit i Arduino',
      'Připojí čidlo a nechá zařízení reagovat na teplotu nebo pohyb',
      'Sestaví vlastní malý projekt a předvede ho ostatním',
    ],
    hardware: [
      'Micro:bit',
      'Arduino',
      'LED displej',
      'tlačítka',
      'teplotní senzor',
      'senzor světla',
      'akcelerometr',
      'kompas',
    ],
    gallery: [
      { src: '/images/gallery/iot-arduino-breadboard.jpg', alt: 'Práce s Arduino breadboardem' },
      { src: '/images/gallery/iot-plant-sensor.jpg', alt: 'IoT senzor na květině' },
      { src: '/images/gallery/iot-arduino-programming.jpg', alt: 'Programování Arduina' },
      { src: '/images/gallery/iot-breadboard-detail.jpg', alt: 'Detail breadboardu s LEDkami' },
      { src: '/images/gallery/iot-plant-sensor-2.jpg', alt: 'Chytré zavlažování květin' },
      { src: '/images/gallery/iot-circuit-design.jpg', alt: 'Návrh IoT obvodu' },
    ],
    faq: [
      {
        question: 'Je potřeba nějaká předchozí zkušenost s elektronikou?',
        answer:
          'Ne, žádné předchozí zkušenosti nejsou potřeba. Program je navržený tak, aby zvládli i úplní začátečníci. Pokročilí dostanou složitější výzvy.',
      },
      {
        question: 'Co si děti odnesou domů?',
        answer:
          'Děti si odnesou zkušenosti s programováním a elektronikou. Micro:bity a Arduina zůstávají v laboratoři, ale děti získají přístup k online prostředí, kde mohou pokračovat v programování doma.',
      },
    ],
  },
  'vr': {
    id: 'vr',
    name: 'Virtuální realita',
    short:
      'Vyzkoušení VR nejen jako hry, ale jako nástroje, se kterým se pracuje.',
    tryOut: [
      'Vyzkouší si VR headset pod dohledem lektora',
      'Projde si prostředí, ve kterém se dá tvořit, ne jen hrát',
      'Pochopí, jak se obraz do headsetu vlastně dostane',
    ],
  },
  'herni-vyvoj': {
    id: 'herni-vyvoj',
    name: 'Herní vývoj',
    short:
      'První vlastní hra — od nápadu po něco, co jde opravdu hrát.',
    tryOut: [
      'Poskládá si jednoduchou scénu a rozpohybuje postavu',
      'Napíše první kus herní logiky',
      'Vyzkouší si, jak se hra ladí, když nedělá to, co má',
    ],
  },
}

export function getFocus(id: FocusId): FocusModule {
  return FOCUS[id]
}

export function getFocusModules(ids: FocusId[]): FocusModule[] {
  return ids.map(getFocus)
}
