import { z } from 'zod'

export const parentSchema = z.object({
  parent_name: z.string().min(3, 'Jméno musí mít alespoň 3 znaky'),
  parent_email: z.string().email('Zadejte platný e-mail'),
  parent_phone: z.string().regex(/^\+?[0-9\s]{9,15}$/, 'Zadejte platné telefonní číslo'),
  parent_address: z.string().min(10, 'Zadejte úplnou adresu'),
})

export const childSchema = z.object({
  child_name: z.string().min(3, 'Jméno musí mít alespoň 3 znaky'),
  child_birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Zadejte datum ve formátu RRRR-MM-DD')
    .refine((s) => {
      const d = new Date(`${s}T00:00:00`)
      return !Number.isNaN(d.getTime()) && d <= new Date()
    }, 'Datum narození nemůže být v budoucnosti')
    .refine((s) => {
      const d = new Date(`${s}T00:00:00`)
      const age = (Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      return age >= 5 && age <= 18
    }, 'Tábor je určen dětem přibližně 9–15 let — zkontrolujte prosím datum narození'),
  child_insurance: z.string().min(2, 'Zadejte zdravotní pojišťovnu'),
  child_health_notes: z.string().optional().default(''),
  child_experience: z.string().optional().default(''),
})

export const pickupSchema = z.object({
  pickup_method: z.enum(['solo', 'named_persons']),
  pickup_time: z.string().optional().default(''),
  pickup_persons: z.string().optional().default(''),
})

export const consentsSchema = z.object({
  vop_consent: z.literal(true, { error: 'Musíte souhlasit s VOP' }),
  gdpr_consent: z.literal(true, { error: 'Musíte souhlasit se zpracováním osobních údajů' }),
  photo_consent: z.boolean().default(false),
  marketing_consent: z.boolean().default(false),
  /**
   * Výslovný souhlas se zpracováním zdravotních údajů dítěte (čl. 9 odst. 2
   * písm. a) GDPR) — slibuje ho /gdpr. Samostatný, ne schovaný v obecném
   * souhlasu: výslovný souhlas nesmí být součástí jiného. Povinný jen tehdy,
   * když rodič zdravotní údaje opravdu vyplní — viz `healthConsentChybi`.
   */
  health_consent: z.boolean().default(false),
})

export const HEALTH_CONSENT_CHYBI =
  'Bez souhlasu se zpracováním zdravotních údajů je nemůžeme uložit — souhlas zaškrtněte, nebo pole se zdravotními údaji v kroku Dítě vymažte.'

/** Vyplněné zdravotní údaje bez výslovného souhlasu — registraci nelze přijmout. */
export function healthConsentChybi(healthNotes: string | undefined, healthConsent: boolean): boolean {
  return (healthNotes ?? '').trim() !== '' && !healthConsent
}

export const registrationSchema = parentSchema
  .merge(childSchema)
  .merge(pickupSchema)
  .merge(consentsSchema)
  .extend({
    // Nepovinná poznámka k objednávce, kterou rodič vyplní v posledním kroku
    // (shrnutí) před platbou. Strop délky chrání DB i admin výpis u veřejného
    // free-text pole.
    customer_note: z.string().max(1000, 'Poznámka může mít nejvýše 1000 znaků').optional().default(''),
    location_id: z.string(),
    program: z.string(),
    term_id: z.string(),
    term_start: z.string(),
    term_end: z.string(),
    payment_amount: z.number(),
  })
  // Pojistka na serveru: klient souhlas vynucuje v kroku 4, ale API se dá
  // zavolat i bez formuláře — zdravotní údaje bez souhlasu se neuloží.
  .superRefine((d, ctx) => {
    if (healthConsentChybi(d.child_health_notes, d.health_consent)) {
      ctx.addIssue({ code: 'custom', path: ['health_consent'], message: HEALTH_CONSENT_CHYBI })
    }
  })

export type RegistrationData = z.infer<typeof registrationSchema>
export type ParentData = z.infer<typeof parentSchema>
export type ChildData = z.infer<typeof childSchema>
export type PickupData = z.infer<typeof pickupSchema>
export type ConsentsData = z.infer<typeof consentsSchema>

export const INSURANCE_OPTIONS = [
  'VZP (111)',
  'VoZP (201)',
  'ČPZP (205)',
  'OZP (207)',
  'ZPŠ (209)',
  'ZPMV (211)',
  'RBP (213)',
] as const
