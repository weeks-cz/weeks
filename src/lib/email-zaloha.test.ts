import { describe, it, expect } from 'vitest'
import {
  buildRegistrationReceivedEmail,
  buildPaymentReminderEmail,
  buildConfirmationZalohaEmail,
  buildDoplatekPrijatEmail,
  buildDoplatekReminderEmail,
  buildDoplatekOverdueAlert,
} from './email'
import { formatDatumCs } from './dates'

// Node píše tisíce s úzkou mezerou (U+00A0); kontrolujeme text s obyčejnou mezerou.
const norm = (s: string) => s.replace(/ /g, ' ')

const base = {
  childName: 'Tomáš Novák',
  programName: 'Letní příměstský tábor (Chytré technologie)',
  termLabel: '26. 7. 2027 – 30. 7. 2027',
  locationName: 'Karlovy Vary',
}

describe('záloha v e-mailech o registraci a platbě', () => {
  it('přihláška přijata nabídne zálohu vedle ceny, když je dostupná', () => {
    const { html } = buildRegistrationReceivedEmail({
      ...base,
      priceKc: 5990,
      zalohaKc: 2000,
      paymentUrl: 'https://weeks.cz/platba/x',
    })
    expect(norm(html)).toContain('nebo záloha 2 000 Kč')
  })

  it('přihláška přijata bez zálohy ji nezmiňuje', () => {
    const { html } = buildRegistrationReceivedEmail({
      ...base,
      priceKc: 5990,
      zalohaKc: null,
      paymentUrl: 'https://weeks.cz/platba/x',
    })
    expect(norm(html)).not.toContain('nebo záloha')
  })

  it('připomínka platby nabídne zálohu, když je dostupná', () => {
    const { html } = buildPaymentReminderEmail({
      ...base,
      locationName: 'Karlovy Vary',
      priceKc: 5990,
      zalohaKc: 2000,
      paymentUrl: 'https://weeks.cz/platba/x',
    })
    expect(norm(html)).toContain('nebo záloha 2 000 Kč')
  })

  it('potvrzení zálohy ukáže zbývající částku a datum doplatku', () => {
    const { subject, html } = buildConfirmationZalohaEmail({
      ...base,
      zaplaceno: 2000,
      zbyvaKc: 3990,
      doplatekDo: '2027-05-31',
      doplatekUrl: 'https://weeks.cz/platba/x',
    })
    expect(subject).toContain('Záloha přijata')
    expect(norm(html)).toContain('3 990 Kč do 31. 5. 2027')
    expect(norm(html)).toContain('2 000 Kč')
  })

  it('doplatek přijat má vlastní předmět a potvrzuje uhrazení celého místa', () => {
    const { subject, html } = buildDoplatekPrijatEmail({ ...base, doplatekKc: 3990 })
    expect(subject).toContain('Doplatek přijat')
    expect(norm(html)).toContain('3 990 Kč')
    expect(norm(html)).toContain('uhrazené celé')
  })

  it('připomínka doplatku nese částku a datum splatnosti', () => {
    const { subject, html } = buildDoplatekReminderEmail({
      ...base,
      zbyvaKc: 3990,
      doplatekDo: '2027-05-31',
      paymentUrl: 'https://weeks.cz/platba/x',
    })
    expect(subject).toContain('31. 5. 2027')
    expect(norm(html)).toContain('3 990 Kč')
    expect(norm(html)).toContain('čl. 21.4 VOP')
  })

  it('upozornění týmu vypíše přihlášky a escapuje jméno', () => {
    const { subject, html } = buildDoplatekOverdueAlert([
      {
        registrationId: 'abc',
        childName: '<b>Test</b>',
        parentEmail: 'a@b.cz',
        zbyvaKc: 3990,
        doplatekDo: '2027-05-31',
      },
    ])
    expect(subject).toContain('1')
    expect(norm(html)).toContain('&lt;b&gt;Test&lt;/b&gt;')
    expect(norm(html)).not.toContain('<b>Test</b>')
  })
})

describe('formatDatumCs', () => {
  it('píše datum bez nul, jak se píše česky', () => {
    expect(formatDatumCs('2027-05-31')).toBe('31. 5. 2027')
    expect(formatDatumCs('2027-06-03')).toBe('3. 6. 2027')
  })
})
