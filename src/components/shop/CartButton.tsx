'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useShop } from '@/components/shop/ShopProvider'

export function CartButton() {
  const { totalItems } = useShop()

  return (
    <Link
      href="/eshop/kosik"
      className="relative inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-700"
    >
      <ShoppingCart className="h-4 w-4" />
      Košík
      {totalItems > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-cta-500 px-1.5 py-0.5 text-xs font-bold text-gray-900">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
