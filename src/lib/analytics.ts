// Měření událostí pro GA4 a Facebook Pixel.
// GA4: přes `sendGAEvent` z @next/third-parties (oficiální cesta v Next.js).
// FB Pixel: přes `window.fbq`, které načítá komponenta MetaPixel.
//
// Názvy funkcí, událostí i parametrů zůstávají anglické schválně — jsou to
// klíče, na kterých závisí sestavy v GA4 a v Meta. Česky jsou komentáře.

import { sendGAEvent } from '@next/third-parties/google'

function fbqEvent(
  eventName: string,
  params?: Record<string, string | number>,
  // Když je vyplněné, pošle fbq `{ eventID }` a Meta si tuhle událost
  // z prohlížeče spáruje s odpovídající serverovou událostí z Conversions API
  // (obě nesou stejné id), takže ji nezapočítá dvakrát.
  eventId?: string
) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (eventId) {
      window.fbq('track', eventName, params, { eventID: eventId })
    } else {
      window.fbq('track', eventName, params)
    }
  }
}

// Klik na hlavní výzvu v heru úvodky. Popisek tlačítka je dynamický
// (`heroCtaText` v `HeroSection.tsx`) podle toho, jestli je co prodávat,
// takže se na něj v analytice nespoléhej — událost rozlišuje `source`.
export function trackViewTerms(source: string) {
  sendGAEvent('event', 'view_terms', { source })
  fbqEvent('ViewContent', { content_name: 'camp_terms', content_category: source })
}

// Klik na výzvu v navigaci (`Header.tsx`). Popisek i cíl jsou dynamické,
// rozlišuje se jen plocha, ze které klik přišel.
export function trackNavCTA(source: 'desktop' | 'mobile') {
  sendGAEvent('event', 'nav_cta_click', { source })
}

// Mimosezónní kontakt: web zatím nic neprodává (žádný turnus není bookable),
// takže tohle je výchozí způsob sběru poptávky, ne výjimka pro jedno město.
// Jen GA — do Meta se to jako Lead neposílá, žádná kampaň na to teď necílí
// a falešná hodnota konverze by zbytečně zašuměla optimalizaci.
export function trackSeasonInterest(params: {
  locationId: string
  season: string
  source: string
}) {
  sendGAEvent('event', 'season_interest_submit', {
    location_id: params.locationId,
    season: params.season,
    source: params.source,
  })
}

// Firemní poptávka odeslaná z /firmy. Rozměr nese id nabídky, ne její nadpis —
// ať analytika nezávisí na textaci, kterou tým může kdykoliv přepsat. Jen GA,
// stejně jako u `trackSeasonInterest` výš — na firemní poptávky necílí žádná
// kampaň a falešná hodnota konverze by zašuměla optimalizaci.
export function trackFirmyPoptavka(params: { typ: string }) {
  sendGAEvent('event', 'firmy_poptavka_submit', {
    event_category: 'firmy',
    typ: params.typ,
  })
}

// Načtení QR kódu: spustí se, když návštěvník přijde přes přesměrování
// /go/[slug] (utm_medium=qr).
export function trackQRScan(params: {
  source: string   // utm_source (např. 'plakat')
  campaign: string // utm_campaign (např. 'jaro2026')
  content: string  // utm_content (např. 'skola1', 'ddm')
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

// Klik na odkaz Učebna v navigaci — měří, jak často se návštěvník dostane
// z weeks.cz na výukovou platformu pro IoT. Čeká se nízké číslo (účastníci
// tábora a lektoři); vysoké by znamenalo, že je odkaz vysázený příliš nápadně
// a odvádí běžné návštěvníky z trychtýře pryč.
export function trackUcebnaClick(source: 'desktop' | 'mobile') {
  sendGAEvent('event', 'ucebna_click', { source })
}

// ── Vlastní registrace → platba ─────────────────────────────────────────────
// Kroky měří odpad mezi odesláním formuláře, zahájením platby a jejím
// dokončením. Trychtýř je dnes jediný pro celý web — registrace přes DDM
// skončila, sem míří všechna města.

// Krok 0: postup vícekrokovým registračním formulářem (1 = otevřen … 5 =
// shrnutí). Porovnání počtů registration_step[1..5] proti registration_submit
// ukáže, ve kterém kroku lidé odpadají, místo aby se to odhadovalo.
export function trackRegistrationStep(params: {
  step: number
  locationId: string
  program: string
  termId: string
}) {
  sendGAEvent('event', 'registration_step', {
    step: params.step,
    location_id: params.locationId,
    program: params.program,
    term_id: params.termId,
  })
}

// Krok 1: v databázi vznikl záznam registrace (formulář úspěšně odeslán)
export function trackRegistrationSubmit(params: {
  locationId: string
  program: string
  termId: string
  value: number
  // Id registrace — podle něj se tahle událost spáruje se serverovou
  // InitiateCheckout (/api/register), aby se nezapočítala dvakrát.
  registrationId?: string
}) {
  sendGAEvent('event', 'registration_submit', {
    location_id: params.locationId,
    program: params.program,
    term_id: params.termId,
    value: params.value,
    currency: 'CZK',
  })
  fbqEvent(
    'InitiateCheckout',
    {
      // Samé `term_id`, stejně jako u Purchase níž a stejně jako serverová
      // strana (/api/register). Předsazené `program` bylo id zaměření
      // (`turnus.focus[0]`) — hodnota, kterou už nic dalšího nepovažuje za
      // důvěryhodnou, a rozcházela se se serverem, který pod stejným
      // `event_id` poslá svou verzi. GA4 výš `program` dostává dál zvlášť.
      content_name: params.termId,
      value: params.value,
      currency: 'CZK',
    },
    params.registrationId
  )
}

// Krok 2: návštěvník se dostal až na platební bránu Comgate
export function trackPaymentInitiated(registrationId: string) {
  sendGAEvent('event', 'payment_initiated', { registration_id: registrationId })
  fbqEvent('AddPaymentInfo')
}

// Krok 3: platba potvrzena (jednou, když potvrzovací stránka uvidí 'paid')
// Rozměr nese stabilní `term_id` turnusu, ne zobrazovaný název — schválně, aby analytika nezávisela na textaci.
export function trackPaymentCompleted(params: {
  registrationId: string
  termId: string
  value: number
}) {
  sendGAEvent('event', 'payment_completed', {
    registration_id: params.registrationId,
    program: params.termId,
    value: params.value,
    currency: 'CZK',
  })
  fbqEvent(
    'Purchase',
    {
      content_name: params.termId,
      value: params.value,
      currency: 'CZK',
    },
    // Páruje se se serverovou událostí Purchase (callback z Comgate), která
    // jako event_id používá stejné id registrace — Meta ji tak nezapočítá
    // dvakrát.
    params.registrationId
  )
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
