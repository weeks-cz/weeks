'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { SKLIK_RTG_ID, sklikRetargetingHit } from '@/lib/sklik'
import { hasConsent, CONSENT_EVENT } from '@/lib/consent'

/**
 * Načte Sklik měřicí skript (rc.js) a posílá retargetingové zásahy.
 * Zrcadlí MetaPixel: skript se objeví jen s marketingovým souhlasem a reaguje
 * i na jeho pozdější změnu. Konverze se měří zvlášť přímo na potvrzovací stránce
 * (sklikConversionHit), tato komponenta řeší jen načtení skriptu + retargeting.
 */
export function SklikTracking() {
  const pathname = usePathname()
  const [consentGiven, setConsentGiven] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const update = () => setConsentGiven(hasConsent('marketing'))
    update()
    window.addEventListener(CONSENT_EVENT, update)
    return () => window.removeEventListener(CONSENT_EVENT, update)
  }, [])

  // Retargetingový zásah na každé změně cesty (i SPA navigace), jakmile je rc.js načten.
  useEffect(() => {
    if (consentGiven && loaded) sklikRetargetingHit()
  }, [pathname, consentGiven, loaded])

  if (!SKLIK_RTG_ID || !consentGiven) return null

  return (
    <Script
      id="sklik-rc"
      src="https://c.seznam.cz/js/rc.js"
      strategy="afterInteractive"
      onLoad={() => setLoaded(true)}
    />
  )
}
