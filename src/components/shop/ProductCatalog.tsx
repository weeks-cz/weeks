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
      <aside className="h-fit card-glow md:sticky md:top-24">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-accent-400" />
            <h3 className="font-bold text-white">Filtr</h3>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors hover:text-accent-400"
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
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="shop-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Hledat"
            className="w-full rounded-xl bg-night border border-white/15 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-accent-400 focus:ring-1 focus:ring-accent-400"
          />
        </div>

        <div className="mt-5 border-t border-white/10 pt-5">
          <label htmlFor="shop-sort" className="mb-3 block data-label">
            Řazení
          </label>
          <select
            id="shop-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="w-full rounded-xl bg-night border border-white/15 px-3 py-2.5 text-sm font-medium text-white outline-none transition focus:border-accent-400 focus:ring-1 focus:ring-accent-400"
          >
            <option value="default">Doporučené pořadí</option>
            <option value="price-asc">Cena od nejnižší</option>
            <option value="price-desc">Cena od nejvyšší</option>
          </select>
        </div>

        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="mb-3 data-label">Typ</p>
          <div className="space-y-2">
            {productTypes.map((type) => (
              <label key={type} className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-night-700/50">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-night text-accent-500 focus:ring-accent-400"
                />
                <span>
                  <span className="block text-sm font-semibold text-white">{productTypeLabels[type]}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-400">{productTypeDescriptions[type]}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="mb-3 data-label">Úroveň</p>
          <div className="space-y-2">
            {levels.map((level) => (
              <label key={level} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-night-700/50">
                <input
                  type="checkbox"
                  checked={selectedLevels.includes(level)}
                  onChange={() => toggleLevel(level)}
                  className="h-4 w-4 rounded border-white/20 bg-night text-accent-500 focus:ring-accent-400"
                />
                <span className="text-sm font-medium text-slate-300">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-400">
            Zobrazeno {filteredProducts.length} z {products.length} produktů
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <article
              key={product.slug}
              className="card-glow group overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
            >
              <Link href={`/eshop/${product.slug}`} className="block">
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-night/90 px-2.5 py-1 text-[11px] font-semibold text-accent-400 shadow-sm border border-accent-500/30">
                    {product.categoryLabel}
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate data-label">{product.subtitle}</p>
                    <Link href={`/eshop/${product.slug}`} className="mt-0.5 block text-lg font-bold leading-6 text-white transition-colors hover:text-accent-300">
                      {product.name}
                    </Link>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-base font-mono text-accent-400">{formatPrice(product.price)}</p>
                    <p className="text-[11px] text-slate-400">orientačně</p>
                  </div>
                </div>

                <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-300">{product.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/10">
                    {product.ageRange}
                  </span>
                  <span className="rounded-full bg-accent-950/40 px-2.5 py-1 text-[11px] font-medium text-accent-300 border border-accent-500/30">
                    {product.level}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 rounded-xl bg-primary-950/40 border border-primary-500/30 px-3 py-2 text-xs font-medium leading-5 text-primary-300">
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
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-night-700 px-3 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-accent-400 hover:text-accent-300"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="card-glow p-8 text-center border-dashed">
            <h3 className="text-xl font-bold text-white">Nic jsme nenašli</h3>
            <p className="mt-2 text-sm text-slate-300">Zkuste upravit filtr nebo vyhledávání.</p>
            <button type="button" onClick={clearFilters} className="mt-5 btn-secondary">
              Zrušit filtry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
