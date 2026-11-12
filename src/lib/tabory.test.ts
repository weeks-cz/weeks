import { describe, it, expect } from 'vitest'
import {
  getTabor,
  getAktivniTabory,
  getChystaneTabory,
  zkusiSiTabora,
  validateTabory,
  TABORY,
  type Tabor,
} from './tabory'

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
