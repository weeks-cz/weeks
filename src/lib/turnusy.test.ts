import { describe, it, expect } from 'vitest'
import {
  getTurnusy,
  getTurnus,
  getTurnusById,
  getTurnusyByCity,
  getCitiesWithTurnusy,
  isBookable,
  validateTurnusy,
  getTaboryTurnusu,
  getFocusTurnusu,
  getTurnusyByTabor,
  oznameniPrihlasovani,
  TURNUSY,
  type Turnus,
} from './turnusy'
import type { TaborId } from './tabory'

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
  taborIds: ['chytre-technologie'],
  ageRange: '9-15',
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
  taborIds: ['chytre-technologie'],
  ageRange: '9-15',
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

  it('nemění vstupní pole — řadí nad kopií', () => {
    const vstup = [pozdejsi, uzavreny, chystany, otevreny]
    const poradiPred = vstup.map((t) => t.id)
    getTurnusy(vstup)
    expect(vstup.map((t) => t.id)).toEqual(poradiPred)
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

  it('otevřený turnus bez domluveného místa koupit nejde', () => {
    expect(isBookable({ ...otevreny, venueId: null })).toBe(false)
  })
})

describe('validateTurnusy', () => {
  it('u zdravého seznamu nenajde nic', () => {
    expect(validateTurnusy([otevreny, chystany])).toEqual([])
  })

  it('odhalí dvě turnusy se stejným id — v databázi by splynuly', () => {
    const problems = validateTurnusy([otevreny, { ...chystany, id: otevreny.id }])
    expect(problems.join(' ')).toContain('id')
  })

  it('odhalí dvě turnusy se stejnou adresou', () => {
    const problems = validateTurnusy([otevreny, { ...chystany, slug: otevreny.slug }])
    expect(problems.join(' ')).toContain('slug')
  })

  it('odhalí otevřený turnus bez ceny', () => {
    const problems = validateTurnusy([{ ...otevreny, priceKc: null }])
    expect(problems.join(' ')).toContain('otevreno')
  })

  it('odhalí turnus, jehož místo konání leží v jiném městě', () => {
    const problems = validateTurnusy([{ ...otevreny, city: 'praha' }])
    expect(problems.join(' ')).toContain('jiném městě')
  })

  it('odhalí turnus, který končí dřív, než začíná', () => {
    const problems = validateTurnusy([{ ...otevreny, end: '2027-07-01' }])
    expect(problems.join(' ')).toContain('konec')
  })

  it('odhalí nekladnou kapacitu', () => {
    const problems = validateTurnusy([{ ...otevreny, capacity: 0 }])
    expect(problems.join(' ')).toContain('kapacita')
  })

  it('odhalí věkové rozmezí v nesprávném tvaru', () => {
    const problems = validateTurnusy([{ ...otevreny, ageRange: '9 až 15 let' }])
    expect(problems.join(' ')).toContain('věkové rozmezí musí být')
  })
})

// Záměrná brzda „žádný ostrý turnus není ve stavu otevreno“ byla 10. 10. 2026
// vědomě smazaná: Karlovy Vary 2027 šly do prodeje. Otevřené otázky, které
// hlídala, jsou vyřešené — cena (5 990 Kč), adresa místa (FabLab VARY&TE
// potvrdil léto 2027) a výslovný souhlas se zdravotními údaji podle čl. 9 GDPR
// (`health_consent`, viz `healthConsentChybi` v src/lib/registration.ts).

describe('TURNUSY — ostrá data v prodeji', () => {
  it('každý otevřený turnus jde opravdu koupit', () => {
    for (const t of TURNUSY.filter((t) => t.status === 'otevreno')) {
      expect(isBookable(t), t.id).toBe(true)
    }
  })

  it('každý otevřený turnus říká, při kolika dětech se koná', () => {
    // Minimum a den rozhodnutí slibuje VOP čl. 22 „u turnusu“ — otevřený
    // turnus bez nich by odkazoval do prázdna.
    for (const t of TURNUSY.filter((t) => t.status === 'otevreno')) {
      expect(t.minimum, t.id).toBeDefined()
    }
  })
})

describe('validateTurnusy — minimum dětí', () => {
  it('odhalí minimum vyšší než kapacita', () => {
    const problems = validateTurnusy([
      { ...otevreny, minimum: { deti: 16, rozhodnemeDo: '2027-06-30' } },
    ])
    expect(problems.join(' ')).toContain('minimum dětí')
  })

  it('odhalí rozhodnutí o konání až po začátku turnusu', () => {
    const problems = validateTurnusy([
      { ...otevreny, minimum: { deti: 10, rozhodnemeDo: otevreny.start! } },
    ])
    expect(problems.join(' ')).toContain('rozhodnout před začátkem')
  })

  it('platné minimum projde', () => {
    const problems = validateTurnusy([
      { ...otevreny, minimum: { deti: 10, rozhodnemeDo: '2027-06-30' } },
    ])
    expect(problems).toEqual([])
  })
})

describe('vazba turnusu na tábor', () => {
  it('getTaboryTurnusu vrátí tábory, na které turnus ukazuje', () => {
    expect(getTaboryTurnusu(otevreny).map((t) => t.id)).toEqual(['chytre-technologie'])
  })

  it('getFocusTurnusu poskládá zaměření z táborů, bez duplicit', () => {
    const focus = getFocusTurnusu(otevreny)
    expect(focus).toContain('3d-tisk')
    expect(new Set(focus).size).toBe(focus.length)
  })

  it('getTurnusyByTabor vybere jen turnusy daného tématu', () => {
    const jiny: Turnus = { ...otevreny, id: 'test-jiny', slug: 'jiny', taborIds: ['game-dev'] }
    expect(getTurnusyByTabor('chytre-technologie', [otevreny, jiny]).map((t) => t.id)).toEqual([
      'test-kv-cervenec',
    ])
  })

  it('validateTurnusy odhalí turnus bez tábora — karta by neměla co ukázat', () => {
    const problems = validateTurnusy([{ ...otevreny, taborIds: [] }])
    expect(problems.join(' ')).toContain('test-kv-cervenec')
  })

  it('validateTurnusy odhalí odkaz na neexistující tábor', () => {
    const problems = validateTurnusy([{ ...otevreny, taborIds: ['neexistuje' as TaborId] }])
    expect(problems.join(' ')).toContain('neexistuje')
  })
})

describe('oznameniPrihlasovani', () => {
  it('bez prodejného turnusu nic neohlašuje', () => {
    expect(oznameniPrihlasovani([chystany])).toBeNull()
  })

  it('jedno město vede rovnou na jeho výpis', () => {
    expect(oznameniPrihlasovani([otevreny, pozdejsi, chystany])).toEqual({
      rok: 2027,
      mesta: ['karlovy-vary'],
      href: '/tabory?mesto=karlovy-vary',
    })
  })

  it('víc měst vede na celý výpis', () => {
    // Místo tu jen splní `isBookable` — soulad místa s městem hlídá
    // `validateTurnusy`, ne tahle funkce.
    const praha: Turnus = { ...otevreny, id: 'test-praha', slug: 'praha-x', city: 'praha' }
    const o = oznameniPrihlasovani([otevreny, praha])
    expect(o?.href).toBe('/tabory')
    expect(o?.mesta).toHaveLength(2)
  })
})
