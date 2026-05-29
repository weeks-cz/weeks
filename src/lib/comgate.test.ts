import { describe, it, expect } from 'vitest'
import { korunyToHalere, mapComgateStatus, buildCreateParams, parseCreateResponse, verifyCallbackIdentity, type ComgateConfig } from './comgate'

describe('korunyToHalere', () => {
  it('converts koruny to integer haléře', () => {
    expect(korunyToHalere(2990)).toBe(299000)
    expect(korunyToHalere(1490)).toBe(149000)
    expect(korunyToHalere(4990)).toBe(499000)
  })
  it('rounds to whole haléře', () => {
    expect(korunyToHalere(10.005)).toBe(1001)
  })
})

describe('mapComgateStatus', () => {
  it('maps PAID to paid', () => {
    expect(mapComgateStatus('PAID')).toBe('paid')
  })
  it('maps CANCELLED to cancelled', () => {
    expect(mapComgateStatus('CANCELLED')).toBe('cancelled')
  })
  it('maps PENDING and AUTHORIZED and unknown to pending', () => {
    expect(mapComgateStatus('PENDING')).toBe('pending')
    expect(mapComgateStatus('AUTHORIZED')).toBe('pending')
    expect(mapComgateStatus('WHATEVER')).toBe('pending')
  })
})

const cfg: ComgateConfig = { merchant: 'M123', secret: 'S456', test: true, method: 'ALL' }

describe('buildCreateParams', () => {
  it('builds form params with price in haléře and prepareOnly', () => {
    const p = buildCreateParams(
      { registrationId: 'reg-1', priceKc: 2990, label: 'Tábor', email: 'a@b.cz', returnBaseUrl: 'https://weeks.cz' },
      cfg
    )
    expect(p.get('merchant')).toBe('M123')
    expect(p.get('secret')).toBe('S456')
    expect(p.get('price')).toBe('299000')
    expect(p.get('curr')).toBe('CZK')
    expect(p.get('test')).toBe('true')
    expect(p.get('prepareOnly')).toBe('true')
    expect(p.get('method')).toBe('ALL')
    expect(p.get('refId')).toBe('reg-1')
    expect(p.get('email')).toBe('a@b.cz')
    expect(p.get('lang')).toBe('cs')
    expect(p.get('country')).toBe('CZ')
  })
  it('points return URLs back at the registration and payment pages', () => {
    const p = buildCreateParams(
      { registrationId: 'reg-1', priceKc: 2990, label: 'Tábor', email: 'a@b.cz', returnBaseUrl: 'https://weeks.cz' },
      cfg
    )
    expect(p.get('url_paid')).toBe('https://weeks.cz/registrace/reg-1')
    expect(p.get('url_pending')).toBe('https://weeks.cz/registrace/reg-1')
    expect(p.get('url_cancelled')).toBe('https://weeks.cz/platba/reg-1')
  })
})

describe('parseCreateResponse', () => {
  it('extracts transId and redirect from a code=0 response', () => {
    const body = 'code=0&message=OK&transId=ABCD-1234&redirect=' +
      encodeURIComponent('https://payments.comgate.cz/client/instructions/index?id=ABCD-1234')
    const r = parseCreateResponse(body)
    expect(r.transId).toBe('ABCD-1234')
    expect(r.redirect).toBe('https://payments.comgate.cz/client/instructions/index?id=ABCD-1234')
  })
  it('throws on a non-zero code', () => {
    expect(() => parseCreateResponse('code=1409&message=invalid+price')).toThrow(/1409/)
  })
})

describe('verifyCallbackIdentity', () => {
  it('accepts when secret and merchant match config', () => {
    const params = new URLSearchParams({ secret: 'S456', merchant: 'M123', transId: 'X', status: 'PAID' })
    expect(verifyCallbackIdentity(params, cfg)).toBe(true)
  })
  it('rejects when secret is wrong', () => {
    const params = new URLSearchParams({ secret: 'WRONG', merchant: 'M123' })
    expect(verifyCallbackIdentity(params, cfg)).toBe(false)
  })
})
