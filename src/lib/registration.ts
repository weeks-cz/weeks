import { z } from 'zod'

export const parentSchema = z.object({
  parent_name: z.string().min(3, 'Jméno musí mít alespoň 3 znaky'),
  parent_email: z.string().email('Zadejte platný e-mail'),
  parent_phone: z.string().regex(/^\+?[0-9\s]{9,15}$/, 'Zadejte platné telefonní číslo'),
  parent_address: z.string().min(10, 'Zadejte úplnou adresu'),
})

export const childSchema = z.object({
  child_name: z.string().min(3, 'Jméno musí mít alespoň 3 znaky'),
  child_birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Zadejte datum ve formátu RRRR-MM-DD'),
  child_insurance: z.string().min(2, 'Zadejte zdravotní pojišťovnu'),
  child_health_notes: z.string().optional().default(''),
  child_experience: z.string().optional().default(''),
})

export const consentsSchema = z.object({
  vop_consent: z.literal(true, { error: 'Musíte souhlasit s VOP' }),
  gdpr_consent: z.literal(true, { error: 'Musíte souhlasit se zpracováním osobních údajů' }),
  marketing_consent: z.boolean().default(false),
})

export const registrationSchema = parentSchema.merge(childSchema).merge(consentsSchema).extend({
  location_id: z.string(),
  program: z.string(),
  term_id: z.string(),
  term_start: z.string(),
  term_end: z.string(),
  payment_amount: z.number(),
})

export type RegistrationData = z.infer<typeof registrationSchema>
export type ParentData = z.infer<typeof parentSchema>
export type ChildData = z.infer<typeof childSchema>
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
