import { describe, it, expect } from 'vitest'
import { SITE, getSiteFaq, getVenuesSentence } from './site'
import type { Turnus } from './turnusy'

/** Turnus s potvrzeným místem — v ostrých datech dnes žádný takový není. */
const sMistem: Turnus = {
  id: 'test-s-mistem',
  slug: 'test-s-mistem',
  city: 'karlovy-vary',
  venueId: 'fablab-varyte',
  start: '2027-07-26',
  end: '2027-07-30',
  priceKc: 4990,
  capacity: 15,
  status: 'otevreno',
  taborIds: ['chytre-technologie'],
  ageRange: '9-15',
  perex: 'Testovací turnus.',
}

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
    expect(getVenuesSentence([sMistem])).toContain('FabLab VARY&TE')
  })

  it('nesklouzne ke skloňování cizích názvů v šabloně ("probíhají v FabLab VARY&TE" je gramaticky špatně)', () => {
    expect(getVenuesSentence([sMistem])).not.toContain('probíhají v')
    expect(getVenuesSentence([sMistem])).toContain('Místa konání:')
  })

  it('nic neslibuje, když žádný turnus potvrzené místo nemá — dnešní stav', () => {
    expect(getVenuesSentence([{ ...sMistem, venueId: null }])).toContain('upřesníme')
    expect(getVenuesSentence()).toContain('upřesníme')
  })

  it('nekončí prázdnou větou, ani když má turnus místo nedomluvené', () => {
    expect(getVenuesSentence().length).toBeGreaterThan(20)
  })
})
