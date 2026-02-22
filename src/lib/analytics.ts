// Analytics utility for GA4 + Facebook Pixel event tracking
// GA4: uses sendGAEvent from @next/third-parties (official Next.js method)
// FB Pixel: uses window.fbq loaded via MetaPixel component

import { sendGAEvent } from '@next/third-parties/google'

function fbqEvent(eventName: string, params?: Record<string, string | number>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, params)
  }
}

// Funnel Step 1: "Zobrazit termíny" click (homepage hero, program page)
export function trackViewTerms(source: string) {
  sendGAEvent('event', 'view_terms', { source })
  fbqEvent('ViewContent', { content_name: 'camp_terms', content_category: source })
}

// Funnel Step 2: "Mám zájem" click on /program page
export function trackProgramInterest(programId: string, programTitle: string) {
  sendGAEvent('event', 'program_interest', {
    program_id: programId,
    program_title: programTitle,
  })
  fbqEvent('AddToWishlist', { content_name: programTitle })
}

// Funnel Step 3: Navigation "Přihlásit se" button
export function trackNavCTA(source: 'desktop' | 'mobile') {
  sendGAEvent('event', 'nav_cta_click', { source })
}

// Funnel Step 4: Final "Přihlásit se" → DDM registration (key conversion)
export function trackRegistrationClick(params: {
  termId: string
  termDates: string
  termLocation: string
  spotsAvailable: number
  outboundUrl: string
}) {
  sendGAEvent('event', 'registration_click', {
    term_id: params.termId,
    term_dates: params.termDates,
    term_location: params.termLocation,
    spots_available: params.spotsAvailable,
    outbound_url: params.outboundUrl,
  })
  fbqEvent('InitiateCheckout', {
    content_name: `${params.termDates} - ${params.termLocation}`,
    value: 2990,
    currency: 'CZK',
  })
}
