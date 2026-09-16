import { getNabidka, isNabidkaId, type NabidkaId } from '@/lib/firmy'

/**
 * Ověření a sestavení dat kontaktního formuláře jako čistá funkce.
 *
 * Žije mimo `route.ts` schválně — testy běží v prostředí `node`, bez Next
 * runtime, a route handler (import z `next/server`) se v nich špatně volá.
 * Čistá funkce jde otestovat přímo; handler ji jen zavolá. Stejný vzor jako
 * `turnus-labels.ts` v `src/components/turnusy/`.
 *
 * Jeden formulář, dva režimy: bez `typ` jde o běžný rodičovský dotaz
 * (`formType: 'contact'`), s platným `typ` o firemní poptávku
 * (`formType: 'firmy'`). `typ` se ověřuje přes `isNabidkaId` ze `src/lib/firmy.ts`,
 * tedy proti témuž číselníku, ze kterého žije stránka `/firmy` — takže nevzniká
 * druhý zdroj pravdy a neplatná hodnota od klienta route nespadne, jen se odmítne.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MAX_DELKY = {
  name: 200,
  email: 200,
  firma: 200,
  telefon: 50,
  message: 5000,
} as const

export interface ParsedContact {
  name: string
  email: string
  message: string
  firma?: string
  telefon?: string
  typ?: NabidkaId
  /**
   * Zaškrtnutý souhlas se zpracováním údajů. Ukládá se jen jako doklad, že ho
   * odesílatel udělil — nic se podle něj nerozhoduje. Povinnost zaškrtnout
   * hlídá formulář; kdyby ho server vyžadoval, začal by odmítat požadavky,
   * které dosud přijímal, a rozbil by starší kontaktní formulář.
   */
  gdprConsent: boolean
  formType: 'contact' | 'firmy'
  subject: string
}

export type ParseContactResult = { ok: true; data: ParsedContact } | { ok: false; error: string }

/** Ořízne na maximální délku a odstraní okrajové bílé znaky. Přepálený vstup se zkrátí, ne odmítne. */
function orizni(value: string, maxDelka: number): string {
  return value.trim().slice(0, maxDelka)
}

export function parseContactBody(body: unknown): ParseContactResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Všechna pole jsou povinná' }
  }

  const { name, email, message, firma, telefon, typ, gdprConsent } = body as Record<string, unknown>

  if (typeof name !== 'string' || !name.trim()) {
    return { ok: false, error: 'Všechna pole jsou povinná' }
  }
  if (typeof email !== 'string' || !email.trim()) {
    return { ok: false, error: 'Všechna pole jsou povinná' }
  }
  if (typeof message !== 'string' || !message.trim()) {
    return { ok: false, error: 'Všechna pole jsou povinná' }
  }

  const orizlyEmail = orizni(email, MAX_DELKY.email)
  if (!EMAIL_REGEX.test(orizlyEmail)) {
    return { ok: false, error: 'Neplatný formát emailu' }
  }

  // typ je nepovinný, ale pokud přijde, musí být z whitelistu — nevěříme
  // klientovi, že jde o platné id nabídky (viz "Proč zvlášť soubor" v briefu).
  let overenyTyp: NabidkaId | undefined
  if (typ !== undefined) {
    if (!isNabidkaId(typ)) {
      return { ok: false, error: 'Neznámý typ poptávky' }
    }
    overenyTyp = typ
  }

  const orizlyName = orizni(name, MAX_DELKY.name)
  const orizlaMessage = orizni(message, MAX_DELKY.message)

  const orizlaFirma =
    typeof firma === 'string' && firma.trim() ? orizni(firma, MAX_DELKY.firma) : undefined
  const orizlyTelefon =
    typeof telefon === 'string' && telefon.trim() ? orizni(telefon, MAX_DELKY.telefon) : undefined

  const formType: 'contact' | 'firmy' = overenyTyp ? 'firmy' : 'contact'
  const subject = overenyTyp
    ? `Poptávka od firmy — ${getNabidka(overenyTyp).nadpis} (${orizlyName})`
    : `Kontaktní formulář Weeks - zpráva od ${orizlyName}`

  return {
    ok: true,
    data: {
      name: orizlyName,
      email: orizlyEmail,
      message: orizlaMessage,
      ...(orizlaFirma ? { firma: orizlaFirma } : {}),
      ...(orizlyTelefon ? { telefon: orizlyTelefon } : {}),
      ...(overenyTyp ? { typ: overenyTyp } : {}),
      gdprConsent: gdprConsent === true,
      formType,
      subject,
    },
  }
}
