'use client'

import { useEffect } from 'react'
import { trackShopViewProduct } from '@/lib/analytics'

interface ProductTrackingProps {
  productSlug: string
  productName: string
}

export function ProductTracking({ productSlug, productName }: ProductTrackingProps) {
  useEffect(() => {
    trackShopViewProduct(productSlug, productName)
  }, [productName, productSlug])

  return null
}
