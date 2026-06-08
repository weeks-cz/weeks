'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { FB_PIXEL_ID, pageview } from '@/lib/fbpixel'
import { hasConsent, CONSENT_EVENT } from '@/lib/consent'

export function MetaPixel() {
  const pathname = usePathname()
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    // Marketing souhlas → Pixel se smí načíst (reaguje i na pozdější změnu souhlasu).
    const update = () => setConsentGiven(hasConsent('marketing'))
    update()
    window.addEventListener(CONSENT_EVENT, update)
    return () => window.removeEventListener(CONSENT_EVENT, update)
  }, [])

  // Track pageview on route change
  useEffect(() => {
    if (consentGiven && FB_PIXEL_ID) {
      pageview()
    }
  }, [pathname, consentGiven])

  if (!FB_PIXEL_ID || !consentGiven) {
    return null
  }

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
