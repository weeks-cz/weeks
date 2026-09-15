import { describe, it, expect } from 'vitest'
import {
  getTurnusy,
  getTurnus,
  getTurnusById,
  getTurnusyByCity,
  getCitiesWithTurnusy,
  isBookable,
  type Turnus,
} from './turnusy'

const otevreny: Turnus = {
  id: 'test-kv-cervenec',
  slug: 'karlovy-vary-cervenec-2027',
  city: 'karlovy-vary',
  venueId: 'fablab-varyte',
  start: '2027-07-12',
  end: '2027-07-16',
  priceKc: 4990,
  capacity: 15,
  status: 'otevreno',
  focus: ['3d-tisk', 'iot'],
  perex: 'Týdenní příměstský tábor ve FabLabu.',
}

const chystany: Turnus = {
  id: 'test-praha-leto',
  slug: 'praha-leto-2027',
  city: 'praha',
  venueId: null,
  start: null,
  end: null,
  priceKc: null,
  capacity: 15,
  status: 'chystame',
  focus: ['3d-tisk'],
  perex: 'Místo konání i termíny upřesníme.',
}

const uzavreny: Turnus = {
  ...otevreny,
  id: 'test-kv-loni',
  slug: 'karlovy-vary-cervenec-2026',
  start: '2026-07-27',
  end: '2026-07-31',
  status: 'uzavreno',
}

const pozdejsi: Turnus = {
  ...otevreny,
  id: 'test-kv-srpen',
  slug: 'karlovy-vary-srpen-2027',
  start: '2027-08-09',
  end: '2027-08-13',
}

const fixture = [pozdejsi, uzavreny, chystany, otevreny]

describe('getTurnusy', () => {
  it('vynechá uzavřené turnusy', () => {
    expect(getTurnusy(fixture).map((t) => t.id)).not.toContain('test-kv-loni')
  })

  it('řadí podle data a turnusy bez data dává nakonec', () => {
    expect(getTurnusy(fixture).map((t) => t.id)).toEqual([
      'test-kv-cervenec',
      'test-kv-srpen',
      'test-praha-leto',
    ])
  })

  it('u prázdného seznamu vrátí prázdný seznam', () => {
    expect(getTurnusy([])).toEqual([])
  })
})

describe('getTurnus', () => {
  it('najde turnus podle slugu', () => {
    expect(getTurnus('karlovy-vary-cervenec-2027', fixture)?.id).toBe('test-kv-cervenec')
  })

  it('najde i uzavřený turnus — stará adresa musí dál něco ukázat', () => {
    expect(getTurnus('karlovy-vary-cervenec-2026', fixture)?.id).toBe('test-kv-loni')
  })

  it('u neznámého slugu vrátí undefined', () => {
    expect(getTurnus('neexistuje', fixture)).toBeUndefined()
  })
})

describe('getTurnusById', () => {
  it('najde turnus podle id, kterým se odkazuje registrace', () => {
    expect(getTurnusById('test-kv-cervenec', fixture)?.slug).toBe('karlovy-vary-cervenec-2027')
  })

  it('u neznámého id vrátí undefined', () => {
    expect(getTurnusById('neexistuje', fixture)).toBeUndefined()
  })
})

describe('getTurnusyByCity', () => {
  it('vrátí jen turnusy daného města', () => {
    expect(getTurnusyByCity('praha', fixture).map((t) => t.id)).toEqual(['test-praha-leto'])
  })
})

describe('getCitiesWithTurnusy', () => {
  it('vrátí města, která mají co nabídnout — podle nich se rozhoduje, jestli ukázat filtr', () => {
    expect(getCitiesWithTurnusy(fixture).sort()).toEqual(['karlovy-vary', 'praha'])
  })

  it('město jen s uzavřeným turnusem se nepočítá', () => {
    expect(getCitiesWithTurnusy([uzavreny])).toEqual([])
  })
})

describe('isBookable', () => {
  it('otevřený a úplný turnus jde koupit', () => {
    expect(isBookable(otevreny)).toBe(true)
  })

  it('chystaný turnus koupit nejde', () => {
    expect(isBookable(chystany)).toBe(false)
  })

  it('plný turnus koupit nejde', () => {
    expect(isBookable({ ...otevreny, status: 'plno' })).toBe(false)
  })

  it('otevřený turnus bez ceny koupit nejde', () => {
    expect(isBookable({ ...otevreny, priceKc: null })).toBe(false)
  })

  it('otevřený turnus bez termínu koupit nejde', () => {
    expect(isBookable({ ...otevreny, start: null, end: null })).toBe(false)
  })
})
