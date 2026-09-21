import { describe, it, expect } from 'vitest'
import { TABORY, validateTabory, getAktivniTabory, zkusiSiTabora } from './tabory'

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
})
