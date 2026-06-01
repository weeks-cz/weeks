import { describe, it, expect } from 'vitest'
import { buildConfirmationEmail, buildNastupniListEmail } from './email'

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
    venueName: 'FabLab Vary&Te',
    venueAddress: 'Dykova, 360 17 Stará Role',
    contactPhone: '+420 703 046 440',
    contactEmail: 'info@weeks.cz',
  })
  it('has subject with program and term', () => {
    expect(r.subject).toBe('Nástupní list – Víkendový tábor chytrých technologií (1. 8. 2026 – 2. 8. 2026)')
  })
  it('includes venue, time window and contact', () => {
    expect(r.html).toContain('FabLab Vary&Te')
    expect(r.html).toContain('Dykova, 360 17 Stará Role')
    expect(r.html).toContain('8:00 – 16:00')
    expect(r.html).toContain('+420 703 046 440')
  })
})
