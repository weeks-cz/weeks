'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductInterestButton } from '@/components/shop/ProductInterestButton'
import {
  formatPrice,
  productTypeDescriptions,
  productTypeLabels,
  shopProducts,
  type ShopProductType,
} from '@/lib/shop'

const productTypes: ShopProductType[] = ['set', 'upgrade-kit', 'project']

export function ProductCatalog() {
  const [selectedTypes, setSelectedTypes] = useState<ShopProductType[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [query, setQuery] = useState('')

  const levels = useMemo(
    () => Array.from(new Set(shopProducts.map((product) => product.level))),
    []
  )

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('cs-CZ')

    return shopProducts.filter((product) => {
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.type)
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(product.level)
      const matchesQuery =
        !normalizedQuery ||
        [product.name, product.subtitle, product.description, product.projects.join(' ')]
          .join(' ')
          .toLocaleLowerCase('cs-CZ')
          .includes(normalizedQuery)

      return matchesType && matchesLevel && matchesQuery
    })
  }, [query, selectedLevels, selectedTypes])

  const toggleType = (type: ShopProductType) => {
    setSelectedTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type]
    )
  }

  const toggleLevel = (level: string) => {
    setSelectedLevels((current) =>
      current.includes(level)
        ? current.filter((item) => item !== level)
        : [...current, level]
    )
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedLevels([])
    setQuery('')
  }

  const hasActiveFilters = selectedTypes.length > 0 || selectedLevels.length > 0 || query.trim().length > 0

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary-600" />
            <h3 className="font-bold text-gray-900">Filtr</h3>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 transition-colors hover:text-primary-700"
            >
              <X className="h-3.5 w-3.5" />
              Zrušit
            </button>
          )}
        </div>

        <label htmlFor="shop-search" className="sr-only">
          Hledat produkt
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="shop-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Hledat"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="mt-5 border-t border-gray-100 pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Typ</p>
          <div className="space-y-2">
            {productTypes.map((type) => (
              <label key={type} className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-800">{productTypeLabels[type]}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-gray-500">{productTypeDescriptions[type]}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-gray-100 pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Úroveň</p>
          <div className="space-y-2">
            {levels.map((level) => (
              <label key={level} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedLevels.includes(level)}
                  onChange={() => toggleLevel(level)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-gray-600">
            Zobrazeno {filteredProducts.length} z {shopProducts.length} produktů
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <article
              key={product.slug}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg"
            >
              <Link href={`/eshop/${product.slug}`} className="block">
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-primary-700 shadow-sm">
                    {product.categoryLabel}
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-primary-600">{product.subtitle}</p>
                    <Link href={`/eshop/${product.slug}`} className="mt-0.5 block text-lg font-bold leading-6 text-gray-900 transition-colors hover:text-primary-700">
                      {product.name}
                    </Link>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-base font-bold text-gray-900">{formatPrice(product.price)}</p>
                    <p className="text-[11px] text-gray-500">orientačně</p>
                  </div>
                </div>

                <p className="line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">{product.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700">
                    {product.ageRange}
                  </span>
                  <span className="rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-medium text-accent-700">
                    {product.level}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 rounded-xl bg-primary-50 px-3 py-2 text-xs font-medium leading-5 text-primary-900">
                  {product.unlocks}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <ProductInterestButton
                    productSlug={product.slug}
                    productName={product.name}
                    productType={product.type}
                    compact
                  />
                  <Link
                    href={`/eshop/${product.slug}`}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900">Nic jsme nenašli</h3>
            <p className="mt-2 text-sm text-gray-600">Zkuste upravit filtr nebo vyhledávání.</p>
            <button type="button" onClick={clearFilters} className="mt-5 btn-secondary">
              Zrušit filtry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
