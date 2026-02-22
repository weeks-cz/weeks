// Analytics utility for GA4 + Facebook Pixel event tracking
// GA4 is loaded via @next/third-parties in layout.tsx
// FB Pixel is loaded via MetaPixel component (fbq types declared in fbpixel.ts)

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function gtagEvent(eventName: string, params: Record<string, string | number>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

function fbqEvent(eventName: string, params?: Record<string, string | number>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

// Funnel Step 1: "Zobrazit termíny" click (homepage hero, program page)
export function trackViewTerms(source: string) {
  gtagEvent('view_terms', { source })
  fbqEvent('ViewContent', { content_name: 'camp_terms', content_category: source })
}

// Funnel Step 2: "Mám zájem" click on /program page
export function trackProgramInterest(programId: string, programTitle: string) {
  gtagEvent('program_interest', {
    program_id: programId,
    program_title: programTitle,
  })
  fbqEvent('AddToWishlist', { content_name: programTitle })
}

// Funnel Step 3: Navigation "Přihlásit se" button
export function trackNavCTA(source: 'desktop' | 'mobile') {
  gtagEvent('nav_cta_click', { source })
}

// Funnel Step 4: Final "Přihlásit se" → DDM registration (key conversion)
export function trackRegistrationClick(params: {
  termId: string
  termDates: string
  termLocation: string
  spotsAvailable: number
  outboundUrl: string
}) {
  gtagEvent('registration_click', {
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
