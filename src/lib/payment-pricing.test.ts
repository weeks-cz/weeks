import { describe, it, expect } from 'vitest'
import { getTrustedPriceKc } from './payment-pricing'

describe('getTrustedPriceKc', () => {
  it('returns the configured price for a known KV program', () => {
    expect(getTrustedPriceKc('karlovy-vary', 'mix')).toBe(2990)
    expect(getTrustedPriceKc('karlovy-vary', 'letni-primestsky')).toBe(4990)
  })
  it('throws for an unknown program (never trust client-supplied price)', () => {
    expect(() => getTrustedPriceKc('karlovy-vary', 'nonexistent')).toThrow()
  })
})
