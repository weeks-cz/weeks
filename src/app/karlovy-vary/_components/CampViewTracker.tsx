'use client'

import { useEffect, useRef } from 'react'
import { trackViewCampDetail } from '@/lib/analytics'

/**
 * Fires a single ViewContent (Pixel) + view_camp_detail (GA) event when a camp
 * detail page mounts. Renders nothing. Paid ads land directly on these pages, so
 * this is what gives Meta the "product viewed" signal and lets us measure the
 * landing→detail step the camp pages previously emitted no event for.
 *
 * Both events no-op without consent (fbq isn't loaded; GA is consent-gated).
 * The ref guard prevents a double-fire under React StrictMode / re-renders.
 */
export function CampViewTracker({
  location,
  program,
  value,
}: {
  location: string
  program: string
  value: number
}) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    trackViewCampDetail({ location, program, value })
  }, [location, program, value])
  return null
}
