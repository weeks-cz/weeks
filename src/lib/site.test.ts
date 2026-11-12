import { describe, it, expect } from 'vitest'
import {
  SITE,
  TELEFON_HODINY,
  V_CENE,
  V_CENE_DLAZDICE,
  getSiteFaq,
  getVenuesSentence,
  telefonHodinyText,
} from './site'
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

  // Strop kapacity („nejvýše patnáct dětí“) zmizel 2026-09-28: kolik dětí
  // turnus vezme, se rozhodne s místem a lektory, a patří k termínu.
  it('neslibuje obecný strop počtu dětí', () => {
    const texty = getSiteFaq().map((f) => f.answer).join(' ')
    expect(texty).not.toMatch(/nejvýš/i)
    expect(texty).not.toMatch(/\d+\s*dětí/)
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

  it('nic neslibuje, když žádný turnus potvrzené místo nemá', () => {
    expect(getVenuesSentence([{ ...sMistem, venueId: null }])).toContain('upřesníme')
  })

  it('jmenuje jen potvrzená místa, ne chystaný turnus bez místa', () => {
    // Ostrá data od 10. 10. 2026: Karlovy Vary ve FabLabu, Praha bez místa.
    expect(getVenuesSentence()).toContain('FabLab VARY&TE')
  })

  it('nekončí prázdnou větou, ani když má turnus místo nedomluvené', () => {
    expect(getVenuesSentence().length).toBeGreaterThan(20)
  })
})

describe('V_CENE_DLAZDICE', () => {
  it('má stejný počet položek jako V_CENE — dlaždice nesmí slíbit víc ani míň než VOP', () => {
    expect(V_CENE_DLAZDICE).toHaveLength(V_CENE.length)
  })

  it('každá dlaždice začíná stejným slovem jako její řádek ve V_CENE', () => {
    V_CENE_DLAZDICE.forEach((d, i) => {
      expect(d.text.split(' ')[0]).toBe(V_CENE[i].split(' ')[0])
    })
  })
})

// Hodiny telefonu čte hlavička (tečka), karta u dotazů i /kontakt. Text musí
// říkat totéž, co `TELEFON_HODINY`, jinak web slibuje dvoje hodiny.
describe('telefonHodinyText', () => {
  it('bez parametru čte `TELEFON_HODINY`', () => {
    expect(telefonHodinyText()).toBe(telefonHodinyText(TELEFON_HODINY))
  })

  it('pracovní týden zkracuje na „po–pá“ a rozsah píše pomlčkou', () => {
    expect(telefonHodinyText({ dny: [1, 2, 3, 4, 5], od: 9, do: 17 })).toBe('po–pá 9–17')
  })

  it('jeden den nebo dny, které na sebe nenavazují, vyjmenuje', () => {
    expect(telefonHodinyText({ dny: [1], od: 9, do: 17 })).toBe('po 9–17')
    expect(telefonHodinyText({ dny: [1, 3], od: 10, do: 14 })).toBe('po, st 10–14')
  })

  it('víkend přes půlnoc týdne nespojí do rozsahu, který neplatí', () => {
    // Neděle je 0, takže pá–so–ne seřazené dají ne, pá, so. „ne–so“ by slibovalo celý týden.
    expect(telefonHodinyText({ dny: [5, 6, 0], od: 9, do: 12 })).toBe('ne, pá, so 9–12')
  })

  it('bez hodin nebo bez dnů neříká nic', () => {
    expect(telefonHodinyText(null)).toBeNull()
    expect(telefonHodinyText({ dny: [], od: 9, do: 17 })).toBeNull()
  })
})
