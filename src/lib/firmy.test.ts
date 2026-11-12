import { describe, it, expect } from 'vitest'
import { NABIDKY, getNabidky, getNabidka, type B2BNabidka } from './firmy'
import { zdrojBezKomentaru } from './test-zdroj'

/**
 * Všechna próza, kterou pojistky hlídají. Nadpis a `proKoho` v ní musí být —
 * jsou to nejvolnější věty na stránce a bez nich by šlo do `proKoho` napsat
 * cenu i počet odbavených firem, aniž by cokoliv spadlo.
 */
function hlidanyText(n: B2BNabidka): string {
  return [n.nadpis, n.proKoho, n.perex, ...n.jakToProbiha, ...n.zajistimeMy, ...n.zajistiteVy].join(
    ' '
  )
}

const HLIDANE_TEXTY: Array<{ jmeno: string; text: string }> = NABIDKY.map((n) => ({
  jmeno: n.id,
  text: hlidanyText(n),
}))

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

  it('žádný text pro firmy neslibuje cenu — ceník zatím neexistuje', () => {
    for (const { jmeno, text } of HLIDANE_TEXTY) {
      expect(text, jmeno).not.toMatch(/\d+\s*(Kč|,-|CZK)/)
    }
  })

  it('žádný text pro firmy se neodvolává na nedoložitelné', () => {
    const zakazane = ['pojištěn', 'certifik', 'akredit', 'reference', 'garantujeme']
    for (const { jmeno, text } of HLIDANE_TEXTY) {
      const male = text.toLowerCase()
      for (const z of zakazane) {
        expect(male, `${jmeno} obsahuje „${z}"`).not.toContain(z)
      }
    }
  })

  it('ani texty psané přímo ve stránce a formuláři neslibují cenu ani nedoložitelné', () => {
    // „reference“ tu mezi zakázanými není: stránka to slovo má v kódu, který
    // reference vykreslí, až je někdo doplní do dat (a to hlídá test níž).
    const zakazane = ['pojištěn', 'certifik', 'akredit', 'garantujeme']
    for (const cesta of ['app/firmy/page.tsx', 'app/firmy/layout.tsx', 'components/firmy/FirmyPoptavka.tsx']) {
      const text = zdrojBezKomentaru(cesta)
      expect(text, cesta).not.toMatch(/\d+\s*(Kč|,-|CZK)/)
      for (const z of zakazane) {
        expect(text.toLowerCase(), `${cesta} obsahuje „${z}"`).not.toContain(z)
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
