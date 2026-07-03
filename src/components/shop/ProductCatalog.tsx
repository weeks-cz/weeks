'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductInterestButton } from '@/components/shop/ProductInterestButton'
import {
  formatPrice,
  productTypeDescriptions,
  productTypeLabels,
  type ShopProduct,
  type ShopProductType,
} from '@/lib/shop'

const productTypes: ShopProductType[] = ['set', 'upgrade-kit', 'project']
type SortOption = 'default' | 'price-asc' | 'price-desc'

export function ProductCatalog({ products }: { products: ShopProduct[] }) {
  const [selectedTypes, setSelectedTypes] = useState<ShopProductType[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('default')

  const levels = useMemo(
    () => Array.from(new Set(products.map((product) => product.level).filter(Boolean))),
    [products]
  )

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('cs-CZ')

    const matchingProducts = products.filter((product) => {
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

    if (sortBy === 'price-asc') {
      return [...matchingProducts].sort((a, b) => a.price - b.price)
    }

    if (sortBy === 'price-desc') {
      return [...matchingProducts].sort((a, b) => b.price - a.price)
    }

    return matchingProducts
  }, [products, query, selectedLevels, selectedTypes, sortBy])

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
    setSortBy('default')
  }

  const hasActiveFilters = selectedTypes.length > 0 || selectedLevels.length > 0 || query.trim().length > 0 || sortBy !== 'default'

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-md border border-ink/15 bg-paper p-4 card-maker md:sticky md:top-24">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary-600" />
            <h3 className="font-bold text-ink">Filtr</h3>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 transition-colors hover:text-primary-700"
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
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
          <input
            id="shop-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Hledat"
            className="w-full rounded-md bg-white border border-ink/20 py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 outline-none transition focus:border-ink focus:ring-1 focus:ring-ink"
          />
        </div>

        <div className="mt-5 border-t border-ink/15 pt-5">
          <label htmlFor="shop-sort" className="mb-3 block mono-label">
            Řazení
          </label>
          <select
            id="shop-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="w-full rounded-md bg-white border border-ink/20 px-3 py-2.5 text-sm font-medium text-ink outline-none transition focus:border-ink focus:ring-1 focus:ring-ink"
          >
            <option value="default">Doporučené pořadí</option>
            <option value="price-asc">Cena od nejnižší</option>
            <option value="price-desc">Cena od nejvyšší</option>
          </select>
        </div>

        <div className="mt-5 border-t border-ink/15 pt-5">
          <p className="mb-3 mono-label">Typ</p>
          <div className="space-y-2">
            {productTypes.map((type) => (
              <label key={type} className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 transition-colors hover:bg-paper-soft">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                  className="mt-0.5 h-4 w-4 rounded-sm border-ink/30 text-primary-600 focus:ring-primary-500"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink">{productTypeLabels[type]}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-ink-500">{productTypeDescriptions[type]}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-ink/15 pt-5">
          <p className="mb-3 mono-label">Úroveň</p>
          <div className="space-y-2">
            {levels.map((level) => (
              <label key={level} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-paper-soft">
                <input
                  type="checkbox"
                  checked={selectedLevels.includes(level)}
                  onChange={() => toggleLevel(level)}
                  className="h-4 w-4 rounded-sm border-ink/30 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-ink">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-ink-500">
            Zobrazeno {filteredProducts.length} z {products.length} produktů
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <article
              key={product.slug}
              className="group overflow-hidden rounded-md border border-ink/15 bg-paper card-maker transition-all duration-200"
            >
              <Link href={`/eshop/${product.slug}`} className="block">
                <div className="relative aspect-[16/9] overflow-hidden border-b border-ink/15">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 border border-ink rounded-sm px-2.5 py-1 font-mono text-[11px] font-medium text-ink bg-paper">
                    {product.categoryLabel}
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs font-medium text-primary-600">{product.subtitle}</p>
                    <Link href={`/eshop/${product.slug}`} className="mt-0.5 block text-lg font-bold leading-6 text-ink transition-colors hover:text-primary-700">
                      {product.name}
                    </Link>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-base font-bold text-ink">{formatPrice(product.price)}</p>
                    <p className="font-mono text-[11px] text-ink-500">orientačně</p>
                  </div>
                </div>

                <p className="line-clamp-2 min-h-10 text-sm leading-5 text-ink-500">{product.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="border border-ink/20 rounded-sm px-2.5 py-1 font-mono text-[11px] font-medium text-ink bg-paper">
                    {product.ageRange}
                  </span>
                  <span className="border border-accent-200 rounded-sm px-2.5 py-1 font-mono text-[11px] font-medium text-accent-700 bg-paper">
                    {product.level}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 rounded-md border border-primary-500/20 bg-primary-50 px-3 py-2 text-xs font-medium leading-5 text-primary-900">
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
                    className="inline-flex items-center justify-center rounded-md border border-ink/15 px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:text-primary-700"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-md border border-dashed border-ink/30 bg-paper p-8 text-center">
            <h3 className="text-xl font-bold text-ink">Nic jsme nenašli</h3>
            <p className="mt-2 text-sm text-ink-500">Zkuste upravit filtr nebo vyhledávání.</p>
            <button type="button" onClick={clearFilters} className="mt-5 btn-outline">
              Zrušit filtry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
