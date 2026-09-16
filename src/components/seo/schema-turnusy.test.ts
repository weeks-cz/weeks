import { describe, it, expect } from 'vitest'
import { turnusyProSchema } from './schema-turnusy'
import { nejblizsiTurnusy, type Turnus } from '@/lib/turnusy'

const uplny: Turnus = {
  id: 'test-uplny',
  slug: 'test-uplny',
  // `VenueId` je dnes jediné: 'fablab-varyte', a je v Karlových Varech.
  // Město turnusu s městem místa musí souhlasit (viz kontrola v `turnusy.ts`).
  city: 'karlovy-vary',
  start: '2027-07-05',
  end: '2027-07-09',
  priceKc: 7900,
  venueId: 'fablab-varyte',
  capacity: 15,
  status: 'otevreno',
  focus: ['3d-tisk'],
  ageRange: '9-15',
  perex: 'Testovací turnus.',
}

describe('turnusyProSchema', () => {
  it('turnus v prodeji je k dispozici', () => {
    const r = turnusyProSchema([uplny])
    expect(r).toHaveLength(1)
    expect(r[0].dostupnost).toBe('https://schema.org/InStock')
  })

  it('vyprodaný turnus se ukáže jako vyprodaný, ne že zmizí', () => {
    const r = turnusyProSchema([{ ...uplny, status: 'plno' }])
    expect(r).toHaveLength(1)
    expect(r[0].dostupnost).toBe('https://schema.org/SoldOut')
  })

  it('uzavřený turnus se neukazuje vůbec', () => {
    expect(turnusyProSchema([{ ...uplny, status: 'uzavreno' }])).toHaveLength(0)
  })

  it('chystaný turnus se neukazuje — nemá co slíbit', () => {
    expect(
      turnusyProSchema([
        { ...uplny, status: 'chystame', start: null, end: null, priceKc: null, venueId: null },
      ])
    ).toHaveLength(0)
  })

  it('turnus bez ceny se neukazuje, i kdyby byl otevřený', () => {
    expect(turnusyProSchema([{ ...uplny, priceKc: null }])).toHaveLength(0)
  })

  it('turnus bez místa se neukazuje — schema by nemělo co napsat do adresy', () => {
    expect(turnusyProSchema([{ ...uplny, venueId: null }])).toHaveLength(0)
  })

  it('bez argumentu bere skutečná data a nespadne', () => {
    expect(Array.isArray(turnusyProSchema())).toBe(true)
  })
})

/**
 * Vazba mezi tím, co úvodka ukazuje, a tím, co o sobě tvrdí vyhledávači.
 *
 * Úvodka vykresluje jen `nejblizsiTurnusy()` a ze stejného výřezu musí čerpat
 * i `EventSchema`. Dokud jsou turnusy dva, rozdíl není vidět — zlomí se to, až
 * jich bude víc než výřez, proto test pracuje s pěti vymyšlenými turnusy.
 */
describe('výřez turnusů pro úvodku', () => {
  const petTurnusu: Turnus[] = [1, 2, 3, 4, 5].map((n) => ({
    ...uplny,
    id: `test-${n}`,
    slug: `test-${n}`,
    start: `2027-07-0${n}`,
    end: `2027-07-0${n + 1}`,
  }))

  it('schema nevypíše víc turnusů, než kolik jich je na úvodce vidět', () => {
    const videt = nejblizsiTurnusy(3, petTurnusu)
    expect(videt).toHaveLength(3)
    expect(turnusyProSchema(videt).length).toBeLessThanOrEqual(videt.length)
  })

  it('každý turnus ve schematu úvodky je na ní i vidět', () => {
    const videt = nejblizsiTurnusy(3, petTurnusu)
    const veSchematu = turnusyProSchema(videt)
    // Pojistka, aby smyčka níž neprošla jen proto, že schema nic nevrátilo.
    expect(veSchematu.length).toBeGreaterThan(0)
    for (const { turnus } of veSchematu) {
      expect(videt).toContain(turnus)
    }
  })
})
