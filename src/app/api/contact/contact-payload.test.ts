import { describe, it, expect } from 'vitest'
import { parseContactBody } from './contact-payload'

const zaklad = { name: 'Jana Nováková', email: 'jana@firma.cz', message: 'Dobrý den, ...' }

describe('parseContactBody', () => {
  it('bez typu jde o běžný kontaktní dotaz', () => {
    const r = parseContactBody(zaklad)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data.formType).toBe('contact')
  })

  it('firemní poptávka nese svůj typ', () => {
    const r = parseContactBody({ ...zaklad, typ: 'workshopy', firma: 'Firma s.r.o.' })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.data.formType).toBe('firmy')
      expect(r.data.typ).toBe('workshopy')
      expect(r.data.firma).toBe('Firma s.r.o.')
    }
  })

  it('poptávka oslavy má vlastní form_type, ať nesplyne s firmami ani s dotazy', () => {
    const r = parseContactBody({ ...zaklad, typ: 'oslava' })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.data.formType).toBe('oslavy')
      expect(r.data.typ).toBe('oslava')
    }
  })

  it('předmět e-mailu pozná oslavu na první pohled', () => {
    const r = parseContactBody({ ...zaklad, typ: 'oslava' })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data.subject).toContain('Poptávka oslavy')
  })

  it('odmítne neznámý typ poptávky', () => {
    const r = parseContactBody({ ...zaklad, typ: 'cokoliv' })
    expect(r.ok).toBe(false)
  })

  it('odmítne chybějící povinné pole', () => {
    expect(parseContactBody({ ...zaklad, name: '' }).ok).toBe(false)
    expect(parseContactBody({ ...zaklad, email: '' }).ok).toBe(false)
    expect(parseContactBody({ ...zaklad, message: '' }).ok).toBe(false)
  })

  it('odmítne neplatný e-mail', () => {
    expect(parseContactBody({ ...zaklad, email: 'neni-email' }).ok).toBe(false)
  })

  it('předmět e-mailu rozliší firemní poptávku od rodičovské', () => {
    const bezny = parseContactBody(zaklad)
    const firemni = parseContactBody({ ...zaklad, typ: 'partnerstvi' })
    if (bezny.ok && firemni.ok) {
      expect(firemni.data.subject).not.toBe(bezny.data.subject)
      expect(firemni.data.subject.toLowerCase()).toContain('firm')
    }
  })

  it('ořízne přepálené vstupy, ať se do e-mailu nedá nacpat cokoliv', () => {
    const r = parseContactBody({ ...zaklad, message: 'x'.repeat(10000) })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data.message.length).toBeLessThanOrEqual(5000)
  })
})
