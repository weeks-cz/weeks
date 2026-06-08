// Strukturovaný cookie souhlas. Nezbytné cookies jsou vždy povolené (implicitně),
// volitelné kategorie (analytics, marketing) vyžadují aktivní souhlas.
//
// Právní rámec: GDPR + ePrivacy, EDPB Guidelines 03/2022 — odmítnutí musí být stejně
// snadné jako přijetí, žádné předzaškrtnuté souhlasy.

export type ConsentCategory = 'analytics' | 'marketing'

export interface ConsentState {
  analytics: boolean
  marketing: boolean
  ts: number
}

const STORAGE_KEY = 'cookie-consent'
export const CONSENT_EVENT = 'cookie-consent-updated'

// Migrace starých string hodnot ('all' / 'necessary') na strukturovaný souhlas.
function parse(raw: string | null): ConsentState | null {
  if (!raw) return null
  if (raw === 'all') return { analytics: true, marketing: true, ts: 0 }
  if (raw === 'necessary') return { analytics: false, marketing: false, ts: 0 }
  try {
    const obj = JSON.parse(raw)
    if (obj && typeof obj === 'object') {
      return {
        analytics: !!obj.analytics,
        marketing: !!obj.marketing,
        ts: typeof obj.ts === 'number' ? obj.ts : 0,
      }
    }
  } catch {
    // poškozená hodnota → bereme jako nerozhodnuto
  }
  return null
}

export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  return parse(localStorage.getItem(STORAGE_KEY))
}

export function hasConsent(category: ConsentCategory): boolean {
  const c = getConsent()
  return c ? c[category] : false
}

export function isConsentDecided(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) !== null
}

export function setConsent(consent: { analytics: boolean; marketing: boolean }): void {
  if (typeof window === 'undefined') return
  const value: ConsentState = { ...consent, ts: Date.now() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  window.dispatchEvent(new Event(CONSENT_EVENT))
}
