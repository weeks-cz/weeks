'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useShop } from '@/components/shop/ShopProvider'

export function CartButton() {
  const { totalItems } = useShop()

  return (
    <Link
      href="/eshop/kosik"
      className="relative inline-flex items-center gap-2 text-ink/70 hover:text-ink transition-colors"
    >
      <ShoppingCart className="h-4 w-4" />
      Košík
      {totalItems > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center border border-ink rounded-sm bg-cta-500 px-1.5 py-0.5 font-mono text-xs font-bold text-ink">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
