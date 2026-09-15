import { describe, it, expect } from 'vitest'
import { SITE, getSiteFaq, getVenuesSentence } from './site'

describe('SITE', () => {
  it('nese údaje Weeks s.r.o. potřebné do patičky a právních textů', () => {
    expect(SITE.legalName).toBe('Weeks s.r.o.')
    expect(SITE.ico).toBe('29984360')
    expect(SITE.court).toContain('Městský soud v Praze')
    expect(SITE.address).toContain('Arbesovo náměstí')
  })

  it('má jeden telefon a jeden e-mail pro celý web', () => {
    expect(SITE.phone).toBe('+420 703 046 440')
    expect(SITE.email).toBe('info@weeks.cz')
  })

  it('nikde nevyčísluje DPH — Weeks s.r.o. je neplátce', () => {
    const vsechnyTexty = JSON.stringify(SITE) + JSON.stringify(getSiteFaq())
    expect(vsechnyTexty).not.toMatch(/DPH/i)
  })
})

describe('getSiteFaq', () => {
  it('vrátí neprázdný seznam otázek, každou s odpovědí', () => {
    const faq = getSiteFaq()
    expect(faq.length).toBeGreaterThan(3)
    for (const item of faq) {
      expect(item.question.length, item.question).toBeGreaterThan(5)
      expect(item.answer.length, item.question).toBeGreaterThan(20)
    }
  })

  it('žádná otázka se neopakuje', () => {
    const otazky = getSiteFaq().map((f) => f.question)
    expect(new Set(otazky).size).toBe(otazky.length)
  })
})

describe('getVenuesSentence', () => {
  it('jmenuje místa konání, která turnusy skutečně mají', () => {
    expect(getVenuesSentence()).toContain('FabLab VARY&TE')
  })

  it('nekončí prázdnou větou, ani když má turnus místo nedomluvené', () => {
    expect(getVenuesSentence().length).toBeGreaterThan(20)
  })
})
