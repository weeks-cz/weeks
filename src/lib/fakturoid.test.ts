import { describe, it, expect } from 'vitest'
import { buildSubjectPayload, buildInvoicePayload, todayIso, type InvoiceParams } from './fakturoid'

const params: InvoiceParams = {
  parentName: 'Jan Novák',
  parentEmail: 'jan@example.cz',
  parentAddress: 'Ulice 12, 360 01 Karlovy Vary',
  registrationId: 'reg-abc-123',
  programName: 'Víkendový tábor chytrých technologií',
  termLabel: '1. 8. 2026 – 2. 8. 2026',
  priceKc: 2990,
  sendEmail: false,
}

describe('buildSubjectPayload', () => {
  it('maps parent data and sets custom_id to the registration id', () => {
    const s = buildSubjectPayload(params)
    expect(s.name).toBe('Jan Novák')
    expect(s.email).toBe('jan@example.cz')
    expect(s.street).toBe('Ulice 12, 360 01 Karlovy Vary')
    expect(s.country).toBe('CZ')
    expect(s.custom_id).toBe('reg-abc-123')
  })
})

describe('buildInvoicePayload', () => {
  it('builds a single zero-VAT line (neplátce DPH) with the program + term name', () => {
    const inv = buildInvoicePayload(42, params)
    expect(inv.subject_id).toBe(42)
    expect(inv.lines).toHaveLength(1)
    const line = inv.lines[0]
    expect(line.name).toBe('Víkendový tábor chytrých technologií — 1. 8. 2026 – 2. 8. 2026')
    expect(line.quantity).toBe('1')
    expect(line.unit_price).toBe('2990')
    expect(line.vat_rate).toBe(0)
  })
})

describe('todayIso', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(todayIso(new Date('2026-08-01T10:30:00Z'))).toBe('2026-08-01')
  })
})
