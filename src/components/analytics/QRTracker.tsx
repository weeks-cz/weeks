'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackQRScan } from '@/lib/analytics'

export function QRTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const medium = searchParams.get('utm_medium')
    if (medium !== 'qr') return

    const source = searchParams.get('utm_source') || 'unknown'
    const campaign = searchParams.get('utm_campaign') || 'unknown'
    const content = searchParams.get('utm_content') || 'unknown'

    // Prevent duplicate fires within the same session
    const key = `qr_tracked_${content}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    trackQRScan({ source, campaign, content })
  }, [searchParams])

  return null
}
