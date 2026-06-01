import { describe, it, expect } from 'vitest'
import { getTrustedPriceKc, getTrustedCapacity } from './payment-pricing'

describe('getTrustedPriceKc', () => {
  it('returns the configured price for a known KV program', () => {
    expect(getTrustedPriceKc('karlovy-vary', 'mix')).toBe(2990)
    expect(getTrustedPriceKc('karlovy-vary', 'letni-primestsky')).toBe(4990)
  })
  it('throws for an unknown program (never trust client-supplied price)', () => {
    expect(() => getTrustedPriceKc('karlovy-vary', 'nonexistent')).toThrow()
  })
})

describe('getTrustedCapacity', () => {
  it('returns the configured capacity for known KV programs', () => {
    expect(getTrustedCapacity('karlovy-vary', 'mix')).toBe(15)
    expect(getTrustedCapacity('karlovy-vary', 'letni-primestsky')).toBe(15)
  })
  it('throws for an unknown program (never silently default capacity)', () => {
    expect(() => getTrustedCapacity('karlovy-vary', 'nonexistent')).toThrow()
  })
})
