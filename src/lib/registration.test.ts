import { describe, it, expect } from 'vitest'
import { registrationSchema } from './registration'

// Minimal valid registration payload. child_birthdate is kept comfortably inside
// the 5–18 age window so the schema's age refinement passes regardless of run date.
function basePayload(overrides: Record<string, unknown> = {}) {
  const year = new Date().getFullYear() - 12
  return {
    parent_name: 'Jan Novák',
    parent_email: 'jan@email.cz',
    parent_phone: '+420 703 046 440',
    parent_address: 'Ulice 123, 360 01 Karlovy Vary',
    child_name: 'Tomáš Novák',
    child_birthdate: `${year}-06-01`,
    child_insurance: 'VZP (111)',
    pickup_method: 'solo',
    vop_consent: true,
    gdpr_consent: true,
    location_id: 'karlovy-vary',
    program: 'mix',
    term_id: 't1',
    term_start: '2026-07-04',
    term_end: '2026-07-05',
    payment_amount: 2990,
    ...overrides,
  }
}

describe('registrationSchema customer_note', () => {
  it('defaults to an empty string when omitted', () => {
    const result = registrationSchema.safeParse(basePayload())
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.customer_note).toBe('')
  })

  it('keeps a provided note (e.g. a referral)', () => {
    const result = registrationSchema.safeParse(basePayload({ customer_note: 'Doporučila nás paní Nováková' }))
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.customer_note).toBe('Doporučila nás paní Nováková')
  })

  it('rejects a note longer than 1000 characters', () => {
    const result = registrationSchema.safeParse(basePayload({ customer_note: 'x'.repeat(1001) }))
    expect(result.success).toBe(false)
  })
})
