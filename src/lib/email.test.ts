import { describe, it, expect } from 'vitest'
import { buildConfirmationEmail, buildNastupniListEmail, buildPaymentReminderEmail } from './email'
import { PROVOZNI_DOBA } from './site'

describe('buildConfirmationEmail', () => {
  const r = buildConfirmationEmail({
    childName: 'Tomáš Novák',
    programName: 'Letní příměstský tábor (3D tisk, IoT a elektronika, Virtuální realita)',
    termLabel: '26. 7. 2027 – 30. 7. 2027',
    locationName: 'Karlovy Vary',
    priceKc: 2990,
  })
  it('has a Czech subject with the program name', () => {
    expect(r.subject).toBe('Potvrzení registrace – Letní příměstský tábor (3D tisk, IoT a elektronika, Virtuální realita)')
  })
  it('includes child name, term and formatted price', () => {
    expect(r.html).toContain('Tomáš Novák')
    expect(r.html).toContain('26. 7. 2027 – 30. 7. 2027')
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
    programName: 'Letní příměstský tábor (3D tisk, IoT a elektronika, Virtuální realita)',
    termLabel: '26. 7. 2027 – 30. 7. 2027',
    venueName: 'FabLab VARY&TE',
    venueAddress: 'Dykova, 360 17 Stará Role',
    contactPhone: '+420 703 046 440',
    contactEmail: 'info@weeks.cz',
  })
  it('has subject with program and term', () => {
    expect(r.subject).toBe('Nástupní list – Letní příměstský tábor (3D tisk, IoT a elektronika, Virtuální realita) (26. 7. 2027 – 30. 7. 2027)')
  })
  it('includes venue, time window and contact', () => {
    expect(r.html).toContain('FabLab VARY&TE')
    expect(r.html).toContain('Dykova, 360 17 Stará Role')
    expect(r.html).toContain(`${PROVOZNI_DOBA.od} – ${PROVOZNI_DOBA.do}`)
    expect(r.html).toContain('+420 703 046 440')
  })
  // §27 VOP (/podminky) slibuje rodiči právě v nástupním listu, které dokumenty
  // má přinést, a dodává, že bez nich dítě nemůže nastoupit. Když to šablona
  // zamlčí, rodič se to dozví až u dveří.
  it('lists the mandatory documents §27 VOP promises in this e-mail', () => {
    expect(r.html).toContain('Prohlášení o bezinfekčnosti')
    expect(r.html).toContain('ne starší než 1 den')
    expect(r.html).toContain('kopii průkazu zdravotní pojišťovny')
    expect(r.html).toContain('nemůže být dítěti umožněna účast')
  })
})

describe('buildPaymentReminderEmail', () => {
  const r = buildPaymentReminderEmail({
    childName: 'Tomáš Novák',
    programName: 'Letní příměstský tábor (3D tisk, IoT a elektronika)',
    locationName: 'Karlovy Vary',
    termLabel: '3. 8. 2026 – 7. 8. 2026',
    priceKc: 4990,
    paymentUrl: 'https://weeks.cz/platba/abc-123?location=karlovy-vary',
  })
  it('has a Czech subject with the program name', () => {
    expect(r.subject).toBe('Dokončení registrace – Letní příměstský tábor (3D tisk, IoT a elektronika)')
  })
  it('includes the payment link, child name, term and price', () => {
    expect(r.html).toContain('https://weeks.cz/platba/abc-123?location=karlovy-vary')
    expect(r.html).toContain('Tomáš Novák')
    expect(r.html).toContain('3. 8. 2026 – 7. 8. 2026')
    // cs-CZ groups with a non-breaking space — compare via the same formatter.
    expect(r.html).toContain(`${(4990).toLocaleString('cs-CZ')} Kč`)
  })
  // Šablona dřív psala „v ${locationName}", což z nominativu v LOCATIONS udělalo
  // „v Praha". Město proto stojí samostatně v tabulce a žádný pád nepotřebuje.
  it('names the city without inflecting it', () => {
    const praha = buildPaymentReminderEmail({
      childName: 'Tomáš Novák',
      programName: 'Letní příměstský tábor (3D tisk)',
      locationName: 'Praha',
      termLabel: '26. 7. 2027 – 30. 7. 2027',
      priceKc: 4990,
      paymentUrl: 'https://weeks.cz/platba/abc-123',
    })
    expect(praha.html).toContain('Praha')
    expect(praha.html).not.toContain('v Praha')
  })

  it('frames the spot as reserved only after payment, with a no-pressure opt-out', () => {
    expect(r.html).toContain('Místo se rezervuje až po zaplacení')
    expect(r.html).toContain('ignorovat')
  })
})
