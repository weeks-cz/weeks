import { describe, it, expect } from 'vitest'
import { GOOGLE_PROFIL, RECENZE, recenzeProTabor } from './recenze'

describe('Google recenze', () => {
  it('bez odkazu na Google profil se recenze na web nedávají', () => {
    // Web cituje cizí slova — musí jít dohledat, kde stojí.
    if (RECENZE.length > 0) {
      expect(GOOGLE_PROFIL.url).toMatch(/^https:\/\/(www\.google\.|g\.page|maps\.app\.goo\.gl|maps\.google\.)/)
    }
  })

  it('každá recenze má autora a celé hvězdičky 1–5, text je nepovinný', () => {
    for (const r of RECENZE) {
      expect(r.autor.trim(), r.id).not.toBe('')
      if (r.text !== undefined) expect(r.text.trim().length, r.id).toBeGreaterThan(3)
      expect([1, 2, 3, 4, 5], r.id).toContain(r.hvezdicky)
    }
  })

  it('souhrn na webu neukazuje méně hodnocení, než kolik jich cituje', () => {
    expect(GOOGLE_PROFIL.pocet).toBeGreaterThanOrEqual(RECENZE.length)
  })

  it('id jsou jedinečná', () => {
    const id = RECENZE.map((r) => r.id)
    expect(new Set(id).size).toBe(id.length)
  })
})

describe('recenzeProTabor', () => {
  it('na herním táboře se neukazuje recenze o Karlových Varech a 3D tisku', () => {
    const texty = recenzeProTabor('game-dev').map((r) => r.text ?? '').join(' ')
    expect(texty).not.toMatch(/Karlových Varech|3D tisk/)
    expect(recenzeProTabor('game-dev').length).toBeGreaterThan(0)
  })

  it('úvodka (bez tábora) a tábor chytrých technologií ukazují všechny', () => {
    expect(recenzeProTabor()).toHaveLength(RECENZE.length)
    expect(recenzeProTabor('chytre-technologie')).toHaveLength(RECENZE.length)
  })
})
