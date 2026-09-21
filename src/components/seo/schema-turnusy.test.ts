import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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
  taborIds: ['chytre-technologie'],
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
 * Úvodka smí ve strukturovaných datech vypsat jen turnusy, které jsou na ní
 * vidět. Dřív to hlídala dvě tvrzení nad jednou proměnnou — jenže
 * `turnusyProSchema` je čistý `filter().map()` nad vstupem, takže „schema není
 * delší než vstup" platí pro libovolný vstup a nemohlo spadnout nikdy. Revize
 * to doložila mutací: vrácení chyby zpátky do `page.tsx` nechalo bránu zelenou.
 *
 * Vazba se proto nedrží testem, ale stavbou: schema vykresluje tatáž
 * komponenta, která vykresluje karty, ze stejné proměnné. Test níž hlídá, že
 * to tak zůstane — čte zdroj, protože komponentu v prostředí `node` (bez jsdom)
 * vykreslit nejde.
 */
describe('výřez turnusů pro úvodku', () => {
  const zdroj = (cesta: string) =>
    readFileSync(resolve(process.cwd(), cesta), 'utf8')

  it('výřez opravdu ořezává', () => {
    const petTurnusu: Turnus[] = [1, 2, 3, 4, 5].map((n) => ({
      ...uplny,
      id: `test-${n}`,
      slug: `test-${n}`,
      start: `2027-07-0${n}`,
      end: `2027-07-0${n + 1}`,
    }))
    expect(nejblizsiTurnusy(3, petTurnusu)).toHaveLength(3)
  })

  it('schema úvodky vykresluje komponenta s kartami, ze stejné proměnné', () => {
    const komponenta = zdroj('src/components/sections/NejblizsiTurnusy.tsx')
    expect(komponenta).toContain('const turnusy = nejblizsiTurnusy()')
    expect(komponenta).toContain('<EventSchema turnusy={turnusy} />')
  })

  it('úvodka nevykresluje EventSchema samostatně', () => {
    // Samostatné volání by bralo všechny prodejné turnusy, ne jen ty vidět.
    expect(zdroj('src/app/page.tsx')).not.toContain('EventSchema')
  })
})
