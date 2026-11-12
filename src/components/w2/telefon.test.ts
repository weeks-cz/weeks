import { describe, expect, it } from 'vitest'
import { jeNaTelefonu } from './telefon'
import { telefonSazba } from './text'

// Stav telefonu je slib návštěvníkovi, takže se počítá v pražském čase bez
// ohledu na to, kde má návštěvník nastavené hodiny. Hodiny se do testu
// předávají — test hlídá výpočet, ne to, jaké hodiny má tým zrovna nastavené.
const TYDEN = { dny: [1, 2, 3, 4, 5], od: 9, do: 17 }

describe('jeNaTelefonu', () => {
  it('ve všední den dopoledne ano (zimní i letní čas)', () => {
    expect(jeNaTelefonu(new Date('2026-11-12T09:30:00Z'), TYDEN)).toBe(true) // čt 10:30 SEČ
    expect(jeNaTelefonu(new Date('2027-07-13T08:30:00Z'), TYDEN)).toBe(true) // út 10:30 SELČ
  })

  it('před začátkem a po konci ne', () => {
    expect(jeNaTelefonu(new Date('2026-11-12T07:59:00Z'), TYDEN)).toBe(false) // čt 8:59
    expect(jeNaTelefonu(new Date('2026-11-12T16:00:00Z'), TYDEN)).toBe(false) // čt 17:00
    expect(jeNaTelefonu(new Date('2027-07-13T06:59:00Z'), TYDEN)).toBe(false) // út 8:59 SELČ
  })

  it('o víkendu ne', () => {
    expect(jeNaTelefonu(new Date('2026-11-14T10:00:00Z'), TYDEN)).toBe(false) // so 11:00
    expect(jeNaTelefonu(new Date('2026-11-15T10:00:00Z'), TYDEN)).toBe(false) // ne 11:00
  })

  it('půl hodiny po půlnoci je hodina 0, ne 24', () => {
    // čt 23:30 UTC = pá 0:30 v Praze. Bez `hourCycle: 'h23'` vrací některá
    // prostředí „24“ a pátek by vypadal jako čtvrtek po zavírací době jen náhodou.
    expect(jeNaTelefonu(new Date('2026-11-12T23:30:00Z'), TYDEN)).toBe(false)
    expect(jeNaTelefonu(new Date('2026-11-12T23:30:00Z'), { dny: [5], od: 0, do: 1 })).toBe(true)
  })

  it('bez nastavených hodin netvrdí nic', () => {
    expect(jeNaTelefonu(new Date('2026-11-12T09:30:00Z'), null)).toBe(false)
  })
})

describe('telefonSazba', () => {
  it('mezery v čísle nahradí nezlomitelnými', () => {
    const cislo = telefonSazba('+420 703 046 440')
    expect(cislo).not.toContain(' ')
    expect(cislo.split(String.fromCharCode(160))).toEqual(['+420', '703', '046', '440'])
  })
})
