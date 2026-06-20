import { describe, it, expect } from 'vitest'
import { normalizeEmail, normalizePhone } from './meta-capi'

// The PII normalisation is match-critical: if a phone or email is normalised
// differently than Meta expects, the hash won't match any user and the event
// silently contributes zero attribution. These lock the transforms.

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Jan.Novak@Example.COM ')).toBe('jan.novak@example.com')
  })
  it('returns undefined for empty/whitespace', () => {
    expect(normalizeEmail('   ')).toBeUndefined()
    expect(normalizeEmail(undefined)).toBeUndefined()
  })
})

describe('normalizePhone', () => {
  it('strips spaces, plus and punctuation to digits only', () => {
    expect(normalizePhone('+420 703 046 440')).toBe('420703046440')
  })
  it('prefixes 420 onto a bare 9-digit CZ number', () => {
    expect(normalizePhone('703 046 440')).toBe('420703046440')
  })
  it('leaves an already-prefixed number untouched', () => {
    expect(normalizePhone('00420703046440')).toBe('00420703046440')
  })
  it('returns undefined for empty', () => {
    expect(normalizePhone('')).toBeUndefined()
    expect(normalizePhone(undefined)).toBeUndefined()
  })
})
