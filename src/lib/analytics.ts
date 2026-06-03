// Analytics utility for GA4 + Facebook Pixel event tracking
// GA4: uses sendGAEvent from @next/third-parties (official Next.js method)
// FB Pixel: uses window.fbq loaded via MetaPixel component

import { sendGAEvent } from '@next/third-parties/google'

type FbqParam = string | number | boolean | string[]

function fbqEvent(eventName: string, params?: Record<string, FbqParam>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, params)
  }
}

function getKvCampProduct(program: string) {
  if (program === 'letni-primestsky') {
    return {
      id: 'letni-primestsky',
      name: 'Letní příměstský tábor chytrých technologií',
      category: 'summer_camp',
    }
  }

  if (program === 'mix') {
    return {
      id: 'mix',
      name: 'Víkendový tábor chytrých technologií',
      category: 'weekend_camp',
    }
  }

  return {
    id: program,
    name: program,
    category: 'camp',
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

// Učebna nav link click — tracks how often visitors discover the IoT learning platform
// from weeks.cz nav. Expected to be low (campers + lecturers only); high values would
// suggest the link is mis-styled and pulling casual visitors away from the funnel.
export function trackUcebnaClick(source: 'desktop' | 'mobile') {
  sendGAEvent('event', 'ucebna_click', { source })
}

// ── KV internal registration → payment funnel ───────────────────────────────
// Three steps measure drop-off between submitting the form, starting the payment,
// and the payment actually completing.

// Step 1: registration row created (form submitted successfully)
export function trackRegistrationSubmit(params: {
  locationId: string
  program: string
  termId: string
  value: number
}) {
  const product = getKvCampProduct(params.program)

  sendGAEvent('event', 'registration_submit', {
    location_id: params.locationId,
    program: params.program,
    program_name: product.name,
    term_id: params.termId,
    value: params.value,
    currency: 'CZK',
  })
  fbqEvent('InitiateCheckout', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    value: params.value,
    currency: 'CZK',
  })
}

// Step 2: user pushed through to the Comgate gateway
export function trackPaymentInitiated(registrationId: string) {
  sendGAEvent('event', 'payment_initiated', { registration_id: registrationId })
  fbqEvent('AddPaymentInfo')
}

// Step 3: payment confirmed (fired once when confirmation page sees 'paid')
export function trackPaymentCompleted(params: {
  registrationId: string
  locationId: string
  program: string
  value: number
}) {
  const product = getKvCampProduct(params.program)

  sendGAEvent('event', 'payment_completed', {
    registration_id: params.registrationId,
    location_id: params.locationId,
    program: params.program,
    program_name: product.name,
    value: params.value,
    currency: 'CZK',
  })
  fbqEvent('Purchase', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    num_items: 1,
    value: params.value,
    currency: 'CZK',
  })
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
