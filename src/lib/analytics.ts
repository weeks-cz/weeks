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
  campType?: 'weekend' | 'oneday'
}) {
  sendGAEvent('event', 'registration_click', {
    term_id: params.termId,
    term_dates: params.termDates,
    term_location: params.termLocation,
    spots_available: params.spotsAvailable,
    outbound_url: params.outboundUrl,
    camp_type: params.campType || 'weekend',
  })
  fbqEvent('InitiateCheckout', {
    content_name: `${params.termDates} - ${params.termLocation}`,
    value: params.campType === 'oneday' ? 1490 : 2990,
    currency: 'CZK',
  })
}

// One-day camp: "Mám zájem" inline form submit
export function trackInterestSubmit(params: {
  programId: string
  programTitle: string
  termin: string
  campType: 'oneday' | 'weekend'
}) {
  sendGAEvent('event', 'interest_submit', {
    program_id: params.programId,
    program_title: params.programTitle,
    termin: params.termin,
    camp_type: params.campType,
  })
  fbqEvent('Lead', {
    content_name: `${params.programTitle} - ${params.termin}`,
    value: 1490,
    currency: 'CZK',
  })
}

// One-day camp page view tracking
export function trackViewOneDayCamp(programId: string, source: string) {
  sendGAEvent('event', 'view_oneday_camp', {
    program_id: programId,
    source,
  })
  fbqEvent('ViewContent', {
    content_name: `oneday_${programId}`,
    content_category: source,
  })
}

// QR code scan: fires when visitor arrives via /go/[slug] redirect (utm_medium=qr)
export function trackQRScan(params: {
  source: string   // utm_source (e.g. 'plakat')
  campaign: string // utm_campaign (e.g. 'jaro2026')
  content: string  // utm_content (e.g. 'skola1', 'ddm')
}) {
  sendGAEvent('event', 'qr_scan', {
    qr_source: params.source,
    qr_campaign: params.campaign,
    qr_content: params.content,
  })
  fbqEvent('ViewContent', {
    content_name: `qr_${params.content}`,
    content_category: 'qr_scan',
  })
}

// Registration form opened (clicked button, but hasn't submitted yet)
// Compare with interest_submit to measure drop-off
export function trackRegistrationFormOpen(params: {
  programId: string
  programTitle: string
  termin: string
  campType: 'oneday' | 'weekend'
}) {
  sendGAEvent('event', 'registration_form_open', {
    program_id: params.programId,
    program_title: params.programTitle,
    termin: params.termin,
    camp_type: params.campType,
  })
}

export function trackInternalRegistrationSubmit(params: {
  locationId: string
  programId: string
  programTitle: string
  termId: string
  termStart: string
  termEnd: string
  value: number
}) {
  sendGAEvent('event', 'internal_registration_submit', {
    location_id: params.locationId,
    program_id: params.programId,
    program_title: params.programTitle,
    term_id: params.termId,
    term_start: params.termStart,
    term_end: params.termEnd,
    value: params.value,
    currency: 'CZK',
  })
  fbqEvent('CompleteRegistration', {
    content_name: params.programTitle,
    content_category: params.locationId,
    content_ids: params.programId,
    value: params.value,
    currency: 'CZK',
  })
}

// Učebna nav link click — tracks how often visitors discover the IoT learning platform
// from weeks.cz nav. Expected to be low (campers + lecturers only); high values would
// suggest the link is mis-styled and pulling casual visitors away from the funnel.
export function trackUcebnaClick(source: 'desktop' | 'mobile') {
  sendGAEvent('event', 'ucebna_click', { source })
}

export function trackShopViewProduct(productSlug: string, productName: string) {
  sendGAEvent('event', 'shop_view_product', {
    product_slug: productSlug,
    product_name: productName,
  })
  fbqEvent('ViewContent', {
    content_name: productName,
    content_category: 'iot_kit',
  })
}

export function trackShopAddToCart(productSlug: string, productName: string) {
  sendGAEvent('event', 'shop_add_to_cart', {
    product_slug: productSlug,
    product_name: productName,
  })
  fbqEvent('AddToCart', {
    content_name: productName,
    content_category: 'iot_kit',
  })
}

export function trackShopInquirySubmit(productCount: number, estimatedValue: number) {
  sendGAEvent('event', 'shop_inquiry_submit', {
    product_count: productCount,
    estimated_value: estimatedValue,
  })
  fbqEvent('Lead', {
    content_name: 'shop_inquiry',
    value: estimatedValue,
    currency: 'CZK',
  })
}
