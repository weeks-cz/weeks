import { describe, it, expect } from 'vitest'
import {
  esc,
  buildConfirmationEmail,
  buildRegistrationReceivedEmail,
  buildNastupniListEmail,
  buildPaymentReminderEmail,
  buildConfirmationZalohaEmail,
  buildDoplatekPrijatEmail,
  buildDoplatekReminderEmail,
  buildDoplatekOverdueAlert,
} from './email'

// Útok, který musí dojít do HTML jako text, ne jako značka.
const EVIL = '<img src=x onerror=alert(1)>'
const EVIL_URL = 'https://weeks.cz/platba/x" onmouseover="alert(1)'
const RAW = '<img src=x'

describe('esc', () => {
  it('escapuje značky i uvozovky', () => {
    expect(esc(EVIL)).toBe('&lt;img src=x onerror=alert(1)&gt;')
    expect(esc('a"b\'c&d')).toBe('a&quot;b&#39;c&amp;d')
  })
})

describe('šablony e-mailů escapují vstupy', () => {
  const common = { childName: EVIL, programName: EVIL, termLabel: EVIL, locationName: EVIL }

  it('každý builder vypíše útok jen jako text', () => {
    const outputs = [
      buildConfirmationEmail({ ...common, priceKc: 5990 }).html,
      buildRegistrationReceivedEmail({ ...common, priceKc: 5990, zalohaKc: 2000, paymentUrl: EVIL_URL }).html,
      buildNastupniListEmail({
        ...common,
        venueName: EVIL,
        venueAddress: EVIL,
        contactPhone: EVIL,
        contactEmail: EVIL,
      }).html,
      buildPaymentReminderEmail({ ...common, priceKc: 5990, paymentUrl: EVIL_URL }).html,
      buildConfirmationZalohaEmail({
        ...common,
        zaplaceno: 2000,
        zbyvaKc: 3990,
        doplatekDo: '2027-05-31',
        doplatekUrl: EVIL_URL,
      }).html,
      buildDoplatekPrijatEmail({ ...common, doplatekKc: 3990 }).html,
      buildDoplatekReminderEmail({
        ...common,
        zbyvaKc: 3990,
        doplatekDo: '2027-05-31',
        paymentUrl: EVIL_URL,
      }).html,
      buildDoplatekOverdueAlert([
        { registrationId: 'r1', childName: EVIL, parentEmail: 'a@b.cz', zbyvaKc: 3990, doplatekDo: '2027-05-31' },
      ]).html,
    ]
    for (const html of outputs) {
      expect(html).not.toContain(RAW)
      expect(html).not.toContain('onerror=alert(1)>')
      expect(html).toContain('&lt;img src=x')
    }
  })

  it('URL v href nepustí uvozovku, která by ukončila atribut', () => {
    const { html } = buildPaymentReminderEmail({
      ...common,
      priceKc: 5990,
      paymentUrl: EVIL_URL,
    })
    expect(html).not.toContain('x" onmouseover')
    expect(html).toContain('x&quot; onmouseover')
  })
})
