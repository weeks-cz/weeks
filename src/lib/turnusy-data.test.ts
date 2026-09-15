import { describe, it, expect } from 'vitest'
import { TURNUSY, validateTurnusy } from './turnusy'

describe('ostrá data turnusů', () => {
  it('projdou kontrolou úplnosti', () => {
    expect(validateTurnusy(TURNUSY)).toEqual([])
  })

  it('každý turnus má vyplněný perex — je to jediný text na jeho kartě', () => {
    for (const turnus of TURNUSY) {
      expect(turnus.perex.length, `turnus ${turnus.id}`).toBeGreaterThan(20)
    }
  })

  it('každý turnus má aspoň jedno zaměření', () => {
    for (const turnus of TURNUSY) {
      expect(turnus.focus.length, `turnus ${turnus.id}`).toBeGreaterThan(0)
    }
  })
})
