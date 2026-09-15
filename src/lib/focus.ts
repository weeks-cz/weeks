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
