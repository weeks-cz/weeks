import { describe, it, expect } from 'vitest'
import { NABIDKY, getNabidky, getNabidka } from './firmy'

describe('nabídky pro firmy', () => {
  it('má tři nabídky se stabilními id', () => {
    expect(getNabidky().map((n) => n.id)).toEqual([
      'deti-zamestnancu',
      'workshopy',
      'partnerstvi',
    ])
  })

  it('každá nabídka říká, co zajistíme my a co firma', () => {
    for (const n of NABIDKY) {
      expect(n.zajistimeMy.length, `${n.id}: zajistíme my`).toBeGreaterThanOrEqual(3)
      expect(n.zajistiteVy.length, `${n.id}: zajistíte vy`).toBeGreaterThanOrEqual(2)
    }
  })

  it('žádná nabídka neslibuje cenu — ceník zatím neexistuje', () => {
    for (const n of NABIDKY) {
      const text = [n.perex, ...n.jakToProbiha, ...n.zajistimeMy, ...n.zajistiteVy].join(' ')
      expect(text, `${n.id}`).not.toMatch(/\d+\s*(Kč|,-|CZK)/)
    }
  })

  it('žádná nabídka se neodvolává na nedoložitelné', () => {
    const zakazane = ['pojištěn', 'certifik', 'akredit', 'reference', 'garantujeme']
    for (const n of NABIDKY) {
      const text = [n.perex, ...n.jakToProbiha, ...n.zajistimeMy, ...n.zajistiteVy]
        .join(' ')
        .toLowerCase()
      for (const z of zakazane) {
        expect(text, `${n.id} obsahuje „${z}"`).not.toContain(z)
      }
    }
  })

  it('mezery k doplnění jsou zatím prázdné a nikdo je nevymyslel', () => {
    for (const n of NABIDKY) {
      expect(n.reference ?? [], `${n.id}: reference`).toHaveLength(0)
    }
  })

  it('getNabidka vyhodí výjimku u neznámého id', () => {
    // @ts-expect-error — schválně neplatné id
    expect(() => getNabidka('neexistuje')).toThrow()
  })
})
