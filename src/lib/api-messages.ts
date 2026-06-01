// Friendly, user-facing Czech error messages for the registration & payment APIs.
// Routes return these in the `error` field; the client renders `data.error`
// directly, so raw English/internal strings must never reach the user.

export const API_ERRORS = {
  validation:
    'Některé údaje nejsou správně vyplněné. Zkontrolujte prosím formulář a zkuste to znovu.',
  invalidRequest: 'Požadavek se nepodařilo zpracovat. Zkuste to prosím znovu.',
  capacityFull:
    'Tento termín je už bohužel plně obsazený. Vyberte prosím jiný termín, nebo nás kontaktujte na info@weeks.cz.',
  registrationFailed:
    'Registraci se nepodařilo uložit. Zkuste to prosím za chvíli znovu. Pokud potíže přetrvávají, ozvěte se nám na info@weeks.cz.',
  notFound: 'Registrace nebyla nalezena. Zkontrolujte prosím odkaz.',
  paymentInitFailed:
    'Platbu se nepodařilo zahájit. Zkuste to prosím za chvíli znovu. Pokud potíže přetrvávají, ozvěte se nám na info@weeks.cz.',
  gatewayUnavailable:
    'Platební brána je momentálně nedostupná. Zkuste to prosím za chvíli znovu.',
  rateLimited:
    'Příliš mnoho pokusů. Počkejte prosím chvíli a zkuste to znovu.',
  serverConfig:
    'Registrace je dočasně nedostupná. Omlouváme se — zkuste to prosím později.',
} as const

export type ApiErrorKey = keyof typeof API_ERRORS
