import { describe, it, expect } from 'vitest'
import { pragueIsoDate, isoDate } from './dates'

describe('pragueIsoDate', () => {
  it('v zimě je Praha UTC+1 — půlnoc v Praze je 23:00 UTC předchozího dne', () => {
    // 31. 12. 2026 23:30 UTC = 1. 1. 2027 00:30 v Praze
    expect(pragueIsoDate(new Date('2026-12-31T23:30:00Z'))).toBe('2027-01-01')
    expect(isoDate(new Date('2026-12-31T23:30:00Z'))).toBe('2026-12-31')
  })

  it('v létě je Praha UTC+2', () => {
    // 31. 5. 2027 22:30 UTC = 1. 6. 2027 00:30 v Praze
    expect(pragueIsoDate(new Date('2027-05-31T22:30:00Z'))).toBe('2027-06-01')
  })

  it('přes den se shoduje s UTC', () => {
    expect(pragueIsoDate(new Date('2027-07-12T10:00:00Z'))).toBe('2027-07-12')
  })
})
