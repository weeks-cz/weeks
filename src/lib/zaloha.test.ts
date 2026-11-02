import { describe, it, expect } from 'vitest'
import {
  zalohaDostupna,
  platnyPlan,
  castkaPrvniPlatby,
  castkaDoplatku,
  castkyPlatby,
  stavZPlateb,
  maOdeslatPurchase,
  zruseniZdarmaDo,
  doplatekKrok,
  addDays,
  isPaymentPlan,
} from './zaloha'
import type { Turnus } from './turnusy'

const sSZ: Pick<Turnus, 'zaloha'> = { zaloha: { castkaKc: 2000, doplatekDo: '2027-05-31' } }
const beze: Pick<Turnus, 'zaloha'> = {}

describe('zalohaDostupna', () => {
  it('je dostupná do dne doplatku včetně', () => {
    expect(zalohaDostupna(sSZ, '2027-05-31')).toBe(true)
    expect(zalohaDostupna(sSZ, '2027-01-01')).toBe(true)
  })

  it('po doplatku už není', () => {
    expect(zalohaDostupna(sSZ, '2027-06-01')).toBe(false)
  })

  it('turnus bez zálohy ji nemá nikdy', () => {
    expect(zalohaDostupna(beze, '2026-11-02')).toBe(false)
  })
})

describe('platnyPlan', () => {
  it('záloha platí jen tam, kde je dostupná', () => {
    expect(platnyPlan('zaloha', true)).toBe('zaloha')
    expect(platnyPlan('zaloha', false)).toBe('plna')
  })

  it('plná platba zůstává plnou', () => {
    expect(platnyPlan('plna', true)).toBe('plna')
    expect(platnyPlan('plna', false)).toBe('plna')
  })
})

describe('castkaPrvniPlatby', () => {
  it('záloha dostupná → částka zálohy', () => {
    expect(castkaPrvniPlatby('zaloha', 5990, sSZ, '2026-11-02')).toBe(2000)
  })

  it('plná platba → celá cena i tam, kde záloha existuje', () => {
    expect(castkaPrvniPlatby('plna', 5990, sSZ, '2026-11-02')).toBe(5990)
  })

  it('po termínu doplatku se záloha nepřijme, účtuje se celá cena', () => {
    expect(castkaPrvniPlatby('zaloha', 5990, sSZ, '2027-06-01')).toBe(5990)
  })

  it('turnus bez zálohy účtuje celou cenu', () => {
    expect(castkaPrvniPlatby('zaloha', 5990, beze, '2026-11-02')).toBe(5990)
  })
})

describe('castkaDoplatku', () => {
  it('je cena minus zaplaceno', () => {
    expect(castkaDoplatku(5990, 2000)).toBe(3990)
  })

  it('nikdy není záporný', () => {
    expect(castkaDoplatku(5990, 7000)).toBe(0)
  })
})

describe('castkyPlatby', () => {
  it('ukáže zálohu i doplatek, když je záloha dostupná', () => {
    expect(castkyPlatby(5990, sSZ, '2026-11-02')).toEqual({ plna: 5990, zaloha: 2000, doplatek: 3990 })
  })

  it('bez zálohy vrací jen plnou částku', () => {
    expect(castkyPlatby(5990, beze, '2026-11-02')).toEqual({ plna: 5990, zaloha: null, doplatek: null })
  })

  it('po termínu už zálohu nenabízí', () => {
    expect(castkyPlatby(5990, sSZ, '2027-06-01')).toEqual({ plna: 5990, zaloha: null, doplatek: null })
  })
})

describe('stavZPlateb', () => {
  it('celá cena zaplacená → completed a paid', () => {
    expect(stavZPlateb(5990, 5990)).toEqual({ payment_status: 'completed', status: 'paid' })
  })

  it('jen záloha → partial a confirmed', () => {
    expect(stavZPlateb(5990, 2000)).toEqual({ payment_status: 'partial', status: 'confirmed' })
  })

  it('nic zaplaceno → zůstává pending', () => {
    expect(stavZPlateb(5990, 0)).toEqual({ payment_status: 'pending', status: 'pending' })
  })

  it('zaplaceno víc než cena → completed', () => {
    expect(stavZPlateb(5990, 6000).payment_status).toBe('completed')
  })

  it('dva řádky dohromady dají completed (záloha + doplatek)', () => {
    expect(stavZPlateb(5990, 2000 + 3990).payment_status).toBe('completed')
  })
})

describe('maOdeslatPurchase', () => {
  it('plná platba zaplacená celá konvertuje', () => {
    expect(maOdeslatPurchase('plna', 'completed')).toBe(true)
  })

  it('záloha zaplacená (partial) konvertuje', () => {
    expect(maOdeslatPurchase('zaloha', 'partial')).toBe(true)
  })

  it('doplatek (zaloha → completed) už ne', () => {
    expect(maOdeslatPurchase('zaloha', 'completed')).toBe(false)
  })

  it('nezaplacená přihláška ne', () => {
    expect(maOdeslatPurchase('plna', 'pending')).toBe(false)
    expect(maOdeslatPurchase('zaloha', 'pending')).toBe(false)
  })
})

describe('zruseniZdarmaDo', () => {
  it('je 30 dní před začátkem (KV červenec 26. 7. → 26. 6.)', () => {
    expect(zruseniZdarmaDo('2027-07-26')).toBe('2027-06-26')
  })

  it('srpen 2. 8. → 3. 7.', () => {
    expect(zruseniZdarmaDo('2027-08-02')).toBe('2027-07-03')
  })
})

describe('addDays', () => {
  it('přechází přes konec měsíce', () => {
    expect(addDays('2027-02-27', 2)).toBe('2027-03-01')
  })
})

describe('doplatekKrok', () => {
  const zadne = { r14: false, r3: false, upozorneni: false }
  const DO = '2027-05-31'

  it('14 dní předem pošle první připomínku', () => {
    expect(doplatekKrok('2027-05-17', DO, zadne)).toBe('pripominka-14')
  })

  it('o den dřív ještě nic (mimo okno)', () => {
    expect(doplatekKrok('2027-05-16', DO, zadne)).toBe(null)
  })

  it('mezi 14. a 4. dnem předem je pořád první okno', () => {
    expect(doplatekKrok('2027-05-27', DO, zadne)).toBe('pripominka-14')
  })

  it('3 dny předem pošle druhou připomínku', () => {
    expect(doplatekKrok('2027-05-28', DO, { ...zadne, r14: true })).toBe('pripominka-3')
  })

  it('v den doplatku je pořád platný termín', () => {
    expect(doplatekKrok('2027-05-31', DO, { ...zadne, r14: true })).toBe('pripominka-3')
  })

  it('kdo zaplatil zálohu 2 dny před termínem, dostane jen druhou připomínku', () => {
    expect(doplatekKrok('2027-05-29', DO, zadne)).toBe('pripominka-3')
  })

  it('už poslaná připomínka se neopakuje', () => {
    expect(doplatekKrok('2027-05-29', DO, { ...zadne, r3: true })).toBe(null)
    expect(doplatekKrok('2027-05-17', DO, { ...zadne, r14: true })).toBe(null)
  })

  it('po termínu jde upozornění týmu jednou', () => {
    expect(doplatekKrok('2027-06-01', DO, zadne)).toBe('upozorneni-tymu')
    expect(doplatekKrok('2027-06-01', DO, { ...zadne, upozorneni: true })).toBe(null)
  })

  it('po termínu se už nepřipomíná', () => {
    expect(doplatekKrok('2027-06-02', DO, { ...zadne, r14: true, r3: true })).toBe('upozorneni-tymu')
  })

  it('přechod roku nerozbije počítání dnů', () => {
    expect(doplatekKrok('2026-12-20', '2027-01-03', zadne)).toBe('pripominka-14')
  })
})

describe('isPaymentPlan', () => {
  it('přijme jen známé plány', () => {
    expect(isPaymentPlan('plna')).toBe(true)
    expect(isPaymentPlan('zaloha')).toBe(true)
    expect(isPaymentPlan('splatky')).toBe(false)
    expect(isPaymentPlan(undefined)).toBe(false)
  })
})
