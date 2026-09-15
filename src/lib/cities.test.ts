import { describe, it, expect } from 'vitest'
import { getCity, getAllCities, getVenue } from './cities'

describe('getCity', () => {
  it('vrátí město podle id', () => {
    expect(getCity('karlovy-vary').name).toBe('Karlovy Vary')
    expect(getCity('praha').name).toBe('Praha')
  })

  it('u každého města zná kraj a souřadnice pro strukturovaná data', () => {
    for (const city of getAllCities()) {
      expect(city.region.length).toBeGreaterThan(0)
      expect(city.geo.lat).toBeGreaterThan(48)
      expect(city.geo.lat).toBeLessThan(52)
      expect(city.geo.lng).toBeGreaterThan(12)
      expect(city.geo.lng).toBeLessThan(19)
    }
  })
})

describe('getAllCities', () => {
  it('vrátí obě města', () => {
    expect(getAllCities().map((c) => c.id).sort()).toEqual(['karlovy-vary', 'praha'])
  })
})

describe('getVenue', () => {
  it('vrátí místo konání i s městem, do kterého patří', () => {
    const venue = getVenue('fablab-varyte')
    expect(venue.cityId).toBe('karlovy-vary')
    expect(venue.name).toBe('FabLab VARY&TE')
  })

  it('každé místo konání ukazuje do existujícího města', () => {
    const cityIds = getAllCities().map((c) => c.id)
    expect(cityIds).toContain(getVenue('fablab-varyte').cityId)
  })
})
