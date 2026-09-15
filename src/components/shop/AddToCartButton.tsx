'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useShop } from '@/components/shop/ShopProvider'
import { trackShopAddToCart } from '@/lib/analytics'

interface AddToCartButtonProps {
  productSlug: string
  productName: string
}

export function AddToCartButton({ productSlug, productName }: AddToCartButtonProps) {
  const { addItem } = useShop()
  const [added, setAdded] = useState(false)

  const handleClick = () => {
    addItem(productSlug, 1)
    trackShopAddToCart(productSlug, productName)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-semibold transition-all duration-200 border border-ink ${
        added
          ? 'bg-trust-600 text-paper shadow-hard-sm hover:shadow-hard'
          : 'bg-cta-500 text-ink shadow-hard-sm hover:shadow-hard'
      }`}
    >
      {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      {added ? 'Přidáno do košíku' : 'Přidat do košíku'}
    </button>
  )
}
