import { describe, expect, it } from 'vitest'
import { jeNaTelefonu } from './telefon'
import { TELEFON_HODINY } from '@/lib/site'

// Stav telefonu je slib návštěvníkovi, takže se počítá v pražském čase bez
// ohledu na to, kde má návštěvník nastavené hodiny.
describe('jeNaTelefonu', () => {
  it('má nastavené hodiny, jinak by hlavička neměla co ukazovat', () => {
    expect(TELEFON_HODINY).not.toBeNull()
  })

  it('ve všední den dopoledne ano (zimní i letní čas)', () => {
    expect(jeNaTelefonu(new Date('2026-11-12T09:30:00Z'))).toBe(true) // čt 10:30 SEČ
    expect(jeNaTelefonu(new Date('2027-07-13T08:30:00Z'))).toBe(true) // út 10:30 SELČ
  })

  it('před začátkem a po konci ne', () => {
    expect(jeNaTelefonu(new Date('2026-11-12T07:59:00Z'))).toBe(false) // čt 8:59
    expect(jeNaTelefonu(new Date('2026-11-12T16:00:00Z'))).toBe(false) // čt 17:00
    expect(jeNaTelefonu(new Date('2027-07-13T06:59:00Z'))).toBe(false) // út 8:59 SELČ
  })

  it('o víkendu ne', () => {
    expect(jeNaTelefonu(new Date('2026-11-14T10:00:00Z'))).toBe(false) // so 11:00
    expect(jeNaTelefonu(new Date('2026-11-15T10:00:00Z'))).toBe(false) // ne 11:00
  })
})
