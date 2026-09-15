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
  /** Konkrétní modely tiskáren, se kterými se pracuje. Jen u 3D tisku. */
  printers?: string[]
  /** Konkrétní hardware — desky, čidla. Jen u IoT. */
  hardware?: string[]
  /** Fotky ve veřejné složce — stejný tvar jako `GalleryImage` v GallerySection. */
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
      'Osahá si několik typů tiskáren — MK3S, MK4S, Mini+ i CORE One',
      'Uvidí, proč tisk selže, a naučí se tomu předejít',
      'Odveze si vlastní výtisk',
    ],
    printers: ['MK3S', 'MK4S', 'Mini+', 'CORE One', 'CORE One L', 'XL', 'SL1S'],
    gallery: [
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
