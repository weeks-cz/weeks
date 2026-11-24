import { describe, expect, it } from 'vitest'
import { llmsFullTxt, llmsTxt } from './llms'
import { getAktivniTabory } from './tabory'
import { TURNUSY, isBookable } from './turnusy'

/**
 * `/llms.txt` podle návrhu llmstxt.org: H1, citace se shrnutím, sekce H2
 * se seznamy odkazů. Obsah se skládá z dat, takže test hlídá hlavně to, že
 * žádný tábor ani termín v nabídce nevypadne a nic, co se neprodává, se tam
 * neobjeví.
 */
describe('llms.txt', () => {
  const t = llmsTxt()
  const radky = t.split('\n')

  it('má tvar ze specifikace: H1, pak citace se shrnutím', () => {
    expect(radky[0]).toBe('# Weeks')
    expect(radky[1]).toBe('')
    expect(radky[2].startsWith('> ')).toBe(true)
    // Jediný nadpis první úrovně.
    expect(radky.filter((r) => r.startsWith('# '))).toHaveLength(1)
  })

  it('odkazy v sekcích jsou ve tvaru „- [název](absolutní adresa)“', () => {
    const odkazy = radky.filter((r) => r.startsWith('- '))
    expect(odkazy.length).toBeGreaterThan(5)
    for (const r of odkazy) expect(r, r).toMatch(/^- \[[^\]]+\]\(https:\/\/[^)\s]+\)(: .+)?$/)
  })

  it('sekce Optional je poslední, jak chce specifikace', () => {
    const sekce = radky.filter((r) => r.startsWith('## '))
    expect(sekce[sekce.length - 1]).toBe('## Optional')
  })

  it('jmenuje každý aktivní tábor s odkazem na jeho stránku', () => {
    for (const tabor of getAktivniTabory()) {
      expect(t).toContain(`[${tabor.name}](https://weeks.cz/tabory/${tabor.id})`)
    }
  })

  it('má každý prodejný termín a žádný chystaný ani proběhlý', () => {
    for (const turnus of TURNUSY) {
      const odkaz = `(https://weeks.cz/tabory/termin/${turnus.slug})`
      if (isBookable(turnus) || turnus.status === 'plno') expect(t, turnus.id).toContain(odkaz)
      else expect(t, turnus.id).not.toContain(odkaz)
    }
  })

  it('cena drží českou sazbu (nezlomitelné mezery)', () => {
    expect(t).toContain('5 990 Kč')
  })
})

describe('llms-full.txt', () => {
  const t = llmsFullTxt()

  it('začíná stejně jako llms.txt a odkazuje na něj', () => {
    expect(t.startsWith('# Weeks\n\n> ')).toBe(true)
    expect(t).toContain('https://weeks.cz/llms.txt')
  })

  it('má program každého aktivního tábora po dnech', () => {
    for (const tabor of getAktivniTabory()) {
      expect(t).toContain(`## ${tabor.name}`)
      // Výstup převádí dlouhou pomlčku z dat na krátkou („3D tisk — základy“).
      for (const den of tabor.program ?? [])
        expect(t).toContain(`- ${den.den} – ${den.title.replace(/—/g, '–')}:`)
    }
  })
})

describe('oba texty', () => {
  it.each([
    ['llms.txt', llmsTxt()],
    ['llms-full.txt', llmsFullTxt()],
  ])('%s: krátká pomlčka, žádné interní údaje', (_, t) => {
    expect(t).not.toContain('—')
    // „s.r.o.“ na konci věty dalo dřív „s.r.o..“.
    expect(t).not.toMatch(/\.\.(?!\.)/)
    // Spojovač slov (U+2060) z webové sazby do čistého textu nepatří.
    expect(t).not.toContain('⁠')
    expect(t.toLowerCase()).not.toMatch(/marž|nájem|interní/)
  })
})
