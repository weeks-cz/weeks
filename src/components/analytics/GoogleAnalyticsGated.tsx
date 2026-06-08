'use client'

import { useEffect, useState } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { hasConsent, CONSENT_EVENT } from '@/lib/consent'

// GA4 se načte teprve po udělení souhlasu s analytickými cookies. Reaguje na změnu
// souhlasu (event) — souhlas udělený → GA se připojí. Odvolání se projeví po reloadu
// (script už nejde z DOM odpojit, ale nové eventy se nesbírají po dalším načtení).
export function GoogleAnalyticsGated({ gaId }: { gaId: string }) {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const update = () => setAllowed(hasConsent('analytics'))
    update()
    window.addEventListener(CONSENT_EVENT, update)
    return () => window.removeEventListener(CONSENT_EVENT, update)
  }, [])

  if (!allowed) return null
  return <GoogleAnalytics gaId={gaId} />
}
