'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'weeks-shop-cart-v1'

export interface CartItem {
  slug: string
  quantity: number
}

interface ShopContextValue {
  items: CartItem[]
  totalItems: number
  addItem: (slug: string, quantity?: number) => void
  removeItem: (slug: string) => void
  updateQuantity: (slug: string, quantity: number) => void
  clearCart: () => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[]
        setItems(parsed.filter((item) => item.quantity > 0))
      }
    } catch (error) {
      console.error('Nepodarilo se nacist kosik', error)
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Nepodarilo se ulozit kosik', error)
    }
  }, [items])

  const value = useMemo<ShopContextValue>(() => ({
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    addItem: (slug, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((item) => item.slug === slug)
        if (existing) {
          return current.map((item) =>
            item.slug === slug
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        return [...current, { slug, quantity }]
      })
    },
    removeItem: (slug) => {
      setItems((current) => current.filter((item) => item.slug !== slug))
    },
    updateQuantity: (slug, quantity) => {
      setItems((current) => {
        if (quantity <= 0) {
          return current.filter((item) => item.slug !== slug)
        }
        return current.map((item) =>
          item.slug === slug ? { ...item, quantity } : item
        )
      })
    },
    clearCart: () => setItems([]),
  }), [items])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop musi byt pouzit uvnitr ShopProvider')
  }
  return context
}
