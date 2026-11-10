import { describe, it, expect } from 'vitest'
import { TABORY, validateTabory, getAktivniTabory, zkusiSiTabora } from './tabory'
import { TYM } from './tym'
import { vCeneTabora } from './site'

describe('ostrá data táborů', () => {
  it('seznam není prázdný — jinak by kontroly níž proběhly naprázdno', () => {
    expect(TABORY.length).toBeGreaterThan(0)
  })

  it('projdou kontrolou úplnosti', () => {
    expect(validateTabory(TABORY)).toEqual([])
  })

  it('aspoň jeden tábor je aktivní — jinak nemá web co nabízet', () => {
    expect(getAktivniTabory(TABORY).length).toBeGreaterThan(0)
  })

  it('každý tábor má perex i popis — jsou to jediné texty na kartě a v heru', () => {
    for (const tabor of TABORY) {
      expect(tabor.perex.length, `tábor ${tabor.id} — perex`).toBeGreaterThan(20)
      expect(tabor.popis.length, `tábor ${tabor.id} — popis`).toBeGreaterThan(20)
    }
  })

  it('každý tábor má aspoň tři body „co si dítě zkusí"', () => {
    for (const tabor of TABORY) {
      expect(zkusiSiTabora(tabor).length, `tábor ${tabor.id}`).toBeGreaterThanOrEqual(3)
    }
  })

  it('aktivní tábor má program na celý pracovní týden', () => {
    for (const tabor of getAktivniTabory(TABORY)) {
      expect(tabor.program, `tábor ${tabor.id}`).toHaveLength(5)
    }
  })

  it('každý lektor tábora je v týmu na /o-nas — jinak by jméno vedlo nikam', () => {
    for (const tabor of TABORY) {
      for (const id of tabor.lektori ?? []) {
        expect(TYM.map((c) => c.id), `tábor ${tabor.id}`).toContain(id)
      }
    }
  })

  it('herní tábor neslibuje 3D výtisky — „V ceně" se liší podle tábora', () => {
    const herni = TABORY.find((t) => t.id === 'game-dev')!
    const chytre = TABORY.find((t) => t.id === 'chytre-technologie')!
    expect(vCeneTabora(herni).join(' ')).not.toMatch(/3D/)
    expect(vCeneTabora(chytre).join(' ')).toMatch(/3D tiskárny/)
    expect(vCeneTabora(herni)).toContain('Oběd každý den')
  })
})
