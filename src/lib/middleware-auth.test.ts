import { describe, it, expect } from 'vitest'
import { isPublicPath, isProtectedPath } from './middleware-auth'

describe('isPublicPath', () => {
  it('exposes KV legal pages publicly', () => {
    expect(isPublicPath('/karlovy-vary/gdpr')).toBe(true)
    expect(isPublicPath('/karlovy-vary/podminky')).toBe(true)
  })
  it('exposes the Comgate callback publicly', () => {
    expect(isPublicPath('/api/payment/comgate/callback')).toBe(true)
  })
  it('does NOT expose the rest of KV or the create route', () => {
    expect(isPublicPath('/karlovy-vary')).toBe(false)
    expect(isPublicPath('/karlovy-vary/tabor-chytrych-technologii')).toBe(false)
    expect(isPublicPath('/api/payment/comgate/create')).toBe(false)
  })
})

describe('isProtectedPath', () => {
  it('protects the order flow but not its public carve-outs', () => {
    expect(isProtectedPath('/karlovy-vary')).toBe(true)
    expect(isProtectedPath('/registrace/abc')).toBe(true)
    expect(isProtectedPath('/platba/abc')).toBe(true)
    expect(isProtectedPath('/api/payment/comgate/create')).toBe(true)
    expect(isProtectedPath('/karlovy-vary/gdpr')).toBe(false)
    expect(isProtectedPath('/api/payment/comgate/callback')).toBe(false)
  })
  it('leaves Praha public pages alone', () => {
    expect(isProtectedPath('/')).toBe(false)
    expect(isProtectedPath('/program')).toBe(false)
    expect(isProtectedPath('/gdpr')).toBe(false)
  })
})
