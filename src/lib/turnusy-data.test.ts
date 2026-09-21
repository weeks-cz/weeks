import { describe, it, expect } from 'vitest'
import { TURNUSY, validateTurnusy } from './turnusy'

describe('ostrá data turnusů', () => {
  it('seznam turnusů není prázdný — jinak by testy níže proběhly naprázdno, bez jediné kontroly', () => {
    expect(TURNUSY.length).toBeGreaterThan(0)
  })

  it('projdou kontrolou úplnosti', () => {
    expect(validateTurnusy(TURNUSY)).toEqual([])
  })

  it('každý turnus má vyplněný perex — je to jediný text na jeho kartě', () => {
    for (const turnus of TURNUSY) {
      expect(turnus.perex.length, `turnus ${turnus.id}`).toBeGreaterThan(20)
    }
  })

  it('každý turnus ukazuje aspoň na jeden tábor', () => {
    for (const turnus of TURNUSY) {
      expect(turnus.taborIds.length, `turnus ${turnus.id}`).toBeGreaterThan(0)
    }
  })
})
