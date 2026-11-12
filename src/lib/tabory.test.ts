import { describe, it, expect } from 'vitest'
import {
  getTabor,
  getAktivniTabory,
  getChystaneTabory,
  zkusiSiTabora,
  validateTabory,
  TABORY,
  DENNI_HARMONOGRAM,
  DEN_V_KOSTCE,
  type Tabor,
} from './tabory'
import { PROVOZNI_DOBA } from './site'

const aktivni: Tabor = {
  id: 'chytre-technologie',
  name: 'Tábor chytrých technologií',
  shortName: 'Chytré technologie',
  status: 'aktivni',
  perex: 'Celý týden 3D tisk, modelování a IoT s Arduinem.',
  popis: 'Týden rozdělený na dva bloky — tři dny 3D tisk, dva dny elektronika.',
  focus: ['3d-tisk', 'iot'],
  odnese: 'Vlastní výtisky z 3D tiskárny domů',
  program: [
    {
      den: 'Pondělí',
      ikona: 'tisk',
      title: 'Start',
      kratce: 'Start',
      shrnuti: 'Krátce o dni.',
      description: 'Popis dne.',
      highlights: ['a'],
    },
  ],
}

const chystany: Tabor = {
  id: 'game-dev',
  name: 'Tábor herního vývoje',
  shortName: 'Herní vývoj',
  status: 'chystame',
  perex: 'Vlastní hra od nápadu po hratelnou verzi.',
  popis: 'Tábor teprve chystáme.',
  focus: ['herni-vyvoj'],
  zkusiSi: ['Postaví si vlastní úroveň', 'Rozpohybuje postavu', 'Dá hru zahrát ostatním'],
}

describe('getTabor', () => {
  it('najde tábor podle adresy', () => {
    expect(getTabor('game-dev', [aktivni, chystany])?.name).toBe('Tábor herního vývoje')
  })

  it('u neznámé adresy vrátí undefined — stránka z toho udělá 404', () => {
    expect(getTabor('neexistuje', [aktivni, chystany])).toBeUndefined()
  })
})

describe('rozdělení podle stavu', () => {
  it('aktivní a chystané se nemíchají', () => {
    expect(getAktivniTabory([aktivni, chystany]).map((t) => t.id)).toEqual(['chytre-technologie'])
    expect(getChystaneTabory([aktivni, chystany]).map((t) => t.id)).toEqual(['game-dev'])
  })

  it('aktivní tábor jde ve výpisu první, i když je v datech až za chystaným', () => {
    const poradi = getAktivniTabory([chystany, aktivni]).map((t) => t.id)
    expect(poradi).toEqual(['chytre-technologie'])
  })
})

describe('zkusiSiTabora', () => {
  it('u chystaného tábora vrátí jeho vlastní body — žádné zaměření zatím nemá obsah', () => {
    expect(zkusiSiTabora(chystany)).toHaveLength(3)
  })

  it('u aktivního tábora body odvodí ze zaměření, ať se text nepíše dvakrát', () => {
    const body = zkusiSiTabora(aktivni)
    expect(body.length).toBeGreaterThan(3)
    expect(body.some((b) => b.includes('model'))).toBe(true)
  })

  it('vlastní body mají přednost i u aktivního tábora', () => {
    expect(zkusiSiTabora({ ...aktivni, zkusiSi: ['jen tohle'] })).toEqual(['jen tohle'])
  })
})

describe('validateTabory', () => {
  it('čistá data nehlásí nic', () => {
    expect(validateTabory([aktivni, chystany])).toEqual([])
  })

  it('odhalí duplicitní id — dva tábory by měly stejnou adresu', () => {
    expect(validateTabory([aktivni, { ...chystany, id: 'chytre-technologie' }])).toHaveLength(1)
  })

  it('aktivní tábor bez programu je chyba — stránka by byla prázdná', () => {
    const problemy = validateTabory([{ ...aktivni, program: undefined }])
    expect(problemy.join(' ')).toContain('chytre-technologie')
  })

  it('chystaný tábor nesmí mít program — nesmí tvrdit, co se na něm bude dít', () => {
    const problemy = validateTabory([{ ...chystany, program: aktivni.program }])
    expect(problemy.join(' ')).toContain('game-dev')
  })

  it('chystaný tábor bez vlastních bodů je chyba — ze zaměření je nemá odkud vzít', () => {
    const problemy = validateTabory([{ ...chystany, zkusiSi: undefined }])
    expect(problemy.join(' ')).toContain('game-dev')
  })

  it('aktivní tábor, který neříká, co si dítě odnese, je chyba — chyběl by řádek „V ceně"', () => {
    const problemy = validateTabory([{ ...aktivni, odnese: undefined }])
    expect(problemy.join(' ')).toContain('odnese')
  })
})

describe('krátké znění dnů v ostrých datech', () => {
  const dny = TABORY.flatMap((t) => (t.program ?? []).map((d) => ({ tabor: t.id, ...d })))

  it('název dne na kartu týdne se vejde na jeden řádek', () => {
    // Pět karet stojí vedle sebe; delší název se zalomí jen u některých a
    // karty pak mají různý počet řádků.
    const dlouhe = dny.filter((d) => d.kratce.length === 0 || d.kratce.length > 16)
    expect(dlouhe.map((d) => `${d.tabor}: ${d.kratce}`)).toEqual([])
  })

  it('shrnutí dne mají v jednom táboře podobnou délku', () => {
    // Stejný důvod: o řádek delší popis rozhodí výšku jedné karty z pěti.
    for (const tabor of TABORY) {
      const delky = (tabor.program ?? []).map((d) => d.shrnuti.length)
      if (delky.length === 0) continue
      expect(Math.min(...delky), tabor.id).toBeGreaterThanOrEqual(45)
      expect(Math.max(...delky), tabor.id).toBeLessThanOrEqual(70)
    }
  })
})

describe('rozvrh dne', () => {
  const minuty = (cas: string) => {
    const [h, m] = cas.split(':').map(Number)
    return h * 60 + m
  }

  it('přehled v pruzích začíná jen v časech, které zná podrobný rozvrh', () => {
    const casy = DENNI_HARMONOGRAM.map((b) => b.time)
    expect(DEN_V_KOSTCE.filter((b) => !casy.includes(b.time)).map((b) => b.time)).toEqual([])
  })

  it('pruhy na sebe navazují a dohromady dají celou provozní dobu', () => {
    DEN_V_KOSTCE.slice(0, -1).forEach((b, i) => {
      expect(minuty(b.time) + b.minut, b.nazev).toBe(minuty(DEN_V_KOSTCE[i + 1].time))
    })
    const posledni = DEN_V_KOSTCE[DEN_V_KOSTCE.length - 1]
    expect(DEN_V_KOSTCE[0].time).toBe(PROVOZNI_DOBA.od)
    expect(minuty(posledni.time) + posledni.minut).toBe(minuty(PROVOZNI_DOBA.do))
  })

  it('podrobný rozvrh má právě jeden blok venku — čte ho pás s fotkou', () => {
    expect(DENNI_HARMONOGRAM.filter((b) => b.druh === 'venku')).toHaveLength(1)
  })

  it('dlaždice podrobného rozvrhu mají krátký název i popisek', () => {
    const dlouhe = DENNI_HARMONOGRAM.filter((b) => b.nazev.length > 14 || b.kratce.length > 20)
    expect(dlouhe.map((b) => `${b.time} ${b.nazev}`)).toEqual([])
  })
})
