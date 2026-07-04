'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useShop } from '@/components/shop/ShopProvider'

export function CartButton() {
  const { totalItems } = useShop()

  return (
    <Link
      href="/eshop/kosik"
      className="relative inline-flex items-center gap-2 rounded-lg border border-white/15 bg-night-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-accent-400 hover:text-accent-300"
    >
      <ShoppingCart className="h-4 w-4" />
      Košík
      {totalItems > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-cta-500 px-1.5 py-0.5 text-xs font-bold text-night">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
