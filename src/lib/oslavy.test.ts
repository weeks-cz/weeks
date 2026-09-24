import { describe, it, expect } from 'vitest'
import { MISTA, POTREBUJEME, PRIKLADY, PRUBEHY, ZAJISTIME } from './oslavy'

/**
 * Stejné pojistky jako u `firmy.test.ts`, protože platí stejné pravidlo:
 * do veřejného repozitáře se nepíše číslo ani reference, kterou nikdo
 * nepotvrdil. U oslav je to ostřejší — žádná zatím neproběhla, takže
 * jakákoli zmínka o zkušenosti by byla vymyšlená.
 */
const HLIDANE_TEXTY: Array<{ jmeno: string; text: string }> = [
  ...PRIKLADY.map((p) => ({ jmeno: `příklad ${p.id}`, text: `${p.nadpis} ${p.text}` })),
  ...MISTA.map((m) => ({ jmeno: `místo ${m.id}`, text: `${m.nadpis} ${m.text}` })),
  ...PRUBEHY.map((p) => ({
    jmeno: `průběh ${p.id}`,
    text: [p.nadpis, p.delka, ...p.kroky.map((k) => `${k.nadpis} ${k.text}`)].join(' '),
  })),
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

  it('modelové průběhy mají aspoň tři kroky a časy jdou po sobě', () => {
    expect(PRUBEHY.length).toBeGreaterThanOrEqual(1)
    const minuty = (cas: string) => {
      const [h, m] = cas.split(':').map(Number)
      return h * 60 + m
    }
    for (const p of PRUBEHY) {
      expect(p.kroky.length, p.id).toBeGreaterThanOrEqual(3)
      expect(p.kroky[0].cas, `${p.id} začíná od nuly`).toBe('0:00')
      for (let i = 1; i < p.kroky.length; i++) {
        expect(minuty(p.kroky[i].cas), `${p.id}: ${p.kroky[i].nadpis}`).toBeGreaterThan(
          minuty(p.kroky[i - 1].cas)
        )
      }
    }
  })

  it('nechce po rodiči stůl — techniku i místo si zařídíme', () => {
    const texty = [...POTREBUJEME, ...MISTA.map((m) => m.text)].join(' ').toLowerCase()
    expect(texty).not.toMatch(/stol|stůl/)
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
