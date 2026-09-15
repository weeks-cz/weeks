import { describe, it, expect } from 'vitest'
import { turnusLabels } from './TurnusCard'
import type { Turnus } from '@/lib/turnusy'

const otevreny: Turnus = {
  id: 'test-otevreny',
  slug: 'karlovy-vary-cervenec-2027',
  city: 'karlovy-vary',
  venueId: 'fablab-varyte',
  start: '2027-07-12',
  end: '2027-07-16',
  priceKc: 4990,
  capacity: 15,
  status: 'otevreno',
  focus: ['3d-tisk', 'iot'],
  ageRange: '9-15',
  perex: 'Týdenní příměstský tábor ve FabLabu.',
}

const chystany: Turnus = {
  id: 'test-chystany',
  slug: 'praha-leto-2027',
  city: 'praha',
  venueId: null,
  start: null,
  end: null,
  priceKc: null,
  capacity: 15,
  status: 'chystame',
  focus: ['3d-tisk'],
  ageRange: '9-15',
  perex: 'Místo konání i termíny upřesníme.',
}

describe('turnusLabels — otevřený turnus', () => {
  const l = turnusLabels(otevreny)

  it('vysází termín česky a v jednom rozsahu', () => {
    expect(l.datum).toBe('12. – 16. července 2027')
  })

  it('pojmenuje město a místo konání', () => {
    expect(l.mesto).toBe('Karlovy Vary')
    expect(l.misto).toBe('FabLab VARY&TE')
  })

  it('uvede cenu s mezerou mezi tisíci a bez zmínky o DPH', () => {
    expect(l.cena).toBe('4 990 Kč')
    expect(l.cena).not.toMatch(/DPH/i)
  })

  it('vede na registraci konkrétního turnusu', () => {
    expect(l.ctaHref).toBe('/registrace?term=test-otevreny')
    expect(l.ctaText).toBe('Přihlásit dítě')
  })
})

describe('turnusLabels — chystaný turnus', () => {
  const l = turnusLabels(chystany)

  it('místo termínu řekne, že se chystá', () => {
    expect(l.datum).toBe('Termín upřesníme')
    expect(l.stav).toBe('Chystáme')
  })

  it('neslibuje místo, které není domluvené', () => {
    expect(l.misto).toBe('Místo upřesníme')
  })

  it('neuvádí cenu, dokud není jistá', () => {
    expect(l.cena).toBe('')
  })

  it('nevede na registraci, ale na sběr kontaktu', () => {
    expect(l.ctaHref).toBeNull()
    expect(l.ctaText).toBe('Chci vědět, až otevřeme')
  })
})

describe('turnusLabels — plný turnus', () => {
  it('nevede na registraci a řekne, že je plno', () => {
    const l = turnusLabels({ ...otevreny, status: 'plno' })
    expect(l.stav).toBe('Obsazeno')
    expect(l.ctaHref).toBeNull()
  })
})

describe('turnusLabels — termín přes dva měsíce', () => {
  it('vysází oba měsíce', () => {
    const l = turnusLabels({ ...otevreny, start: '2027-07-29', end: '2027-08-02' })
    expect(l.datum).toBe('29. července – 2. srpna 2027')
  })
})
