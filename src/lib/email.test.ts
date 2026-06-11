import { describe, it, expect } from 'vitest'
import { buildConfirmationEmail, buildNastupniListEmail, buildPaymentReminderEmail } from './email'

describe('buildConfirmationEmail', () => {
  const r = buildConfirmationEmail({
    childName: 'Tomáš Novák',
    programName: 'Víkendový tábor chytrých technologií',
    termLabel: '1. 8. 2026 – 2. 8. 2026',
    locationName: 'Karlovy Vary',
    priceKc: 2990,
  })
  it('has a Czech subject with the program name', () => {
    expect(r.subject).toBe('Potvrzení registrace – Víkendový tábor chytrých technologií')
  })
  it('includes child name, term and formatted price', () => {
    expect(r.html).toContain('Tomáš Novák')
    expect(r.html).toContain('1. 8. 2026 – 2. 8. 2026')
    // cs-CZ groups with a non-breaking space — compare via the same formatter.
    expect(r.html).toContain(`${(2990).toLocaleString('cs-CZ')} Kč`)
  })
  it('mentions the daňový doklad and the upcoming nástupní list', () => {
    expect(r.html).toContain('Daňový doklad')
    expect(r.html).toContain('nástupní list')
  })
})

describe('buildNastupniListEmail', () => {
  const r = buildNastupniListEmail({
    childName: 'Tomáš Novák',
    programName: 'Víkendový tábor chytrých technologií',
    termLabel: '1. 8. 2026 – 2. 8. 2026',
    venueName: 'FabLab VARY&TE',
    venueAddress: 'Dykova, 360 17 Stará Role',
    contactPhone: '+420 703 046 440',
    contactEmail: 'info@weeks.cz',
  })
  it('has subject with program and term', () => {
    expect(r.subject).toBe('Nástupní list – Víkendový tábor chytrých technologií (1. 8. 2026 – 2. 8. 2026)')
  })
  it('includes venue, time window and contact', () => {
    expect(r.html).toContain('FabLab VARY&TE')
    expect(r.html).toContain('Dykova, 360 17 Stará Role')
    expect(r.html).toContain('8:00 – 16:00')
    expect(r.html).toContain('+420 703 046 440')
  })
})

describe('buildPaymentReminderEmail', () => {
  const r = buildPaymentReminderEmail({
    childName: 'Tomáš Novák',
    programName: 'Letní příměstský tábor chytrých technologií',
    locationName: 'Karlovy Vary',
    termLabel: '3. 8. 2026 – 7. 8. 2026',
    priceKc: 4990,
    paymentUrl: 'https://weeks.cz/platba/abc-123?location=karlovy-vary',
  })
  it('has a Czech subject with the program name', () => {
    expect(r.subject).toBe('Dokončení registrace – Letní příměstský tábor chytrých technologií')
  })
  it('includes the payment link, child name, term and price', () => {
    expect(r.html).toContain('https://weeks.cz/platba/abc-123?location=karlovy-vary')
    expect(r.html).toContain('Tomáš Novák')
    expect(r.html).toContain('3. 8. 2026 – 7. 8. 2026')
    // cs-CZ groups with a non-breaking space — compare via the same formatter.
    expect(r.html).toContain(`${(4990).toLocaleString('cs-CZ')} Kč`)
  })
  it('frames the spot as reserved only after payment, with a no-pressure opt-out', () => {
    expect(r.html).toContain('místo se rezervuje až po zaplacení')
    expect(r.html).toContain('ignorovat')
  })
})
