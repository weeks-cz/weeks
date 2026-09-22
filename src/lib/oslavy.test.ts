import { describe, it, expect } from 'vitest'
import { MISTA, POTREBUJEME, PRIKLADY, ZAJISTIME } from './oslavy'

/**
 * Stejné pojistky jako u `firmy.test.ts`, protože platí stejné pravidlo:
 * do veřejného repozitáře se nepíše číslo ani reference, kterou nikdo
 * nepotvrdil. U oslav je to ostřejší — žádná zatím neproběhla, takže
 * jakákoli zmínka o zkušenosti by byla vymyšlená.
 */
const HLIDANE_TEXTY: Array<{ jmeno: string; text: string }> = [
  ...PRIKLADY.map((p) => ({ jmeno: `příklad ${p.id}`, text: `${p.nadpis} ${p.text}` })),
  ...MISTA.map((m) => ({ jmeno: `místo ${m.id}`, text: `${m.nadpis} ${m.text}` })),
  { jmeno: 'zajistíme', text: ZAJISTIME.join(' ') },
  { jmeno: 'potřebujeme', text: POTREBUJEME.join(' ') },
]

describe('obsah stránky oslav', () => {
  it('má příklady i místa a nic z toho není prázdné', () => {
    expect(PRIKLADY.length).toBeGreaterThanOrEqual(2)
    expect(MISTA.length).toBeGreaterThanOrEqual(2)
    expect(ZAJISTIME.length).toBeGreaterThanOrEqual(3)
    expect(POTREBUJEME.length).toBeGreaterThanOrEqual(1)

    for (const p of PRIKLADY) {
      expect(p.nadpis.length, `${p.id}: nadpis`).toBeGreaterThan(5)
      expect(p.text.length, `${p.id}: text`).toBeGreaterThan(30)
    }
  })

  it('id příkladů i míst jsou jedinečná', () => {
    const idPrikladu = PRIKLADY.map((p) => p.id)
    const idMist = MISTA.map((m) => m.id)
    expect(new Set(idPrikladu).size).toBe(idPrikladu.length)
    expect(new Set(idMist).size).toBe(idMist.length)
  })

  it('nikde neslibuje cenu — ceník oslav neexistuje', () => {
    for (const { jmeno, text } of HLIDANE_TEXTY) {
      expect(text, jmeno).not.toMatch(/\d+\s*(Kč|,-|CZK)/)
    }
  })

  it('netvrdí zkušenost, kterou Weeks zatím nemá', () => {
    // „už jsme“, „pravidelně“, „oblíben“ i „reference“ všechno tvrdí, že se
    // oslava někdy konala. K 2026-09-22 neproběhla ani jedna.
    const zakazane = ['reference', 'už jsme', 'pravidelně', 'oblíben', 'garantujeme', 'certifik']
    for (const { jmeno, text } of HLIDANE_TEXTY) {
      const male = text.toLowerCase()
      for (const z of zakazane) {
        expect(male, `${jmeno} obsahuje „${z}"`).not.toContain(z)
      }
    }
  })

  it('neuvádí věkové rozmezí — program se přizpůsobí, věk se řeší v poptávce', () => {
    for (const { jmeno, text } of HLIDANE_TEXTY) {
      expect(text, jmeno).not.toMatch(/\d+\s*[–-]\s*\d+\s*let/)
    }
  })

  it('neslibuje konkrétní prostor, který Weeks nemá', () => {
    for (const { jmeno, text } of HLIDANE_TEXTY) {
      const male = text.toLowerCase()
      expect(male, `${jmeno} jmenuje FabLab`).not.toContain('fablab')
      expect(male, `${jmeno} mluví o „naší dílně"`).not.toMatch(/naš[ieí]\s+(dílně|dílna|prostoru)/)
    }
  })
})
