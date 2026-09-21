import { describe, it, expect } from 'vitest'
import { getTrustedPriceKc, getTrustedCapacity, getTrustedCity, getTrustedTerm, getTrustedProgramName } from './payment-pricing'
import { TURNUSY, type Turnus } from './turnusy'

const prodejny: Turnus = {
  id: 'test-prodejny',
  slug: 'test-prodejny',
  city: 'karlovy-vary',
  venueId: 'fablab-varyte',
  start: '2027-07-12',
  end: '2027-07-16',
  priceKc: 4990,
  capacity: 15,
  status: 'otevreno',
  taborIds: ['chytre-technologie'],
  ageRange: '9-15',
  perex: 'Testovací turnus pro ověření důvěryhodné ceny.',
}

describe('getTrustedPriceKc', () => {
  it('vrátí cenu turnusu', () => {
    expect(getTrustedPriceKc('test-prodejny', [prodejny])).toBe(4990)
  })

  it('vyhodí výjimku u neznámého turnusu', () => {
    expect(() => getTrustedPriceKc('neexistuje', [prodejny])).toThrow()
  })

  it('vyhodí výjimku u turnusu, který není v prodeji', () => {
    expect(() =>
      getTrustedPriceKc('test-prodejny', [{ ...prodejny, status: 'chystame' }])
    ).toThrow()
  })

  it('vyhodí výjimku u plného turnusu — nesmí vzniknout nová platba', () => {
    expect(() =>
      getTrustedPriceKc('test-prodejny', [{ ...prodejny, status: 'plno' }])
    ).toThrow()
  })
})

describe('getTrustedCapacity', () => {
  it('vrátí kapacitu turnusu', () => {
    expect(getTrustedCapacity('test-prodejny', [prodejny])).toBe(15)
  })

  it('vyhodí výjimku u neznámého turnusu', () => {
    expect(() => getTrustedCapacity('neexistuje', [prodejny])).toThrow()
  })
})

describe('getTrustedCity', () => {
  it('vrátí město turnusu, ne to, co poslal klient', () => {
    expect(getTrustedCity('test-prodejny', [prodejny])).toBe('karlovy-vary')
  })

  it('vyhodí výjimku u turnusu, který není v prodeji', () => {
    expect(() =>
      getTrustedCity('test-prodejny', [{ ...prodejny, status: 'chystame' }])
    ).toThrow()
  })
})

describe('getTrustedTerm', () => {
  it('vrátí termín turnusu, ne to, co poslal klient', () => {
    expect(getTrustedTerm('test-prodejny', [prodejny])).toEqual({
      start: '2027-07-12',
      end: '2027-07-16',
    })
  })

  it('vyhodí výjimku u turnusu, který není v prodeji', () => {
    expect(() =>
      getTrustedTerm('test-prodejny', [{ ...prodejny, status: 'chystame' }])
    ).toThrow()
  })
})

describe('ostrá data', () => {
  it('žádný turnus v prodeji nesmí mít nulovou nebo zápornou cenu', () => {
    for (const turnus of TURNUSY) {
      if (turnus.status !== 'otevreno') continue
      expect(getTrustedPriceKc(turnus.id), `turnus ${turnus.id}`).toBeGreaterThan(0)
    }
  })
})

describe('getTrustedProgramName', () => {
  it('vrátí čitelný název tábora se zaměřením v závorce', () => {
    const nazev = getTrustedProgramName('test-prodejny', [prodejny])
    expect(nazev).toBe('Letní příměstský tábor (Chytré technologie)')
  })

  it('vrátí název i u turnusu, který je vyprodaný — nástupní list a upomínka běží právě tehdy', () => {
    const plno: Turnus = { ...prodejny, id: 'test-plno', status: 'plno' }
    expect(getTrustedProgramName('test-plno', [plno])).toBe('Letní příměstský tábor (Chytré technologie)')
  })

  it('odmítne neznámý turnus', () => {
    expect(() => getTrustedProgramName('neexistuje', [prodejny])).toThrow()
  })
})
