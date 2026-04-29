'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, Send, CheckCircle2 } from 'lucide-react'
import { useShop } from '@/components/shop/ShopProvider'
import { formatPrice, shopProducts } from '@/lib/shop'
import { trackShopInquirySubmit } from '@/lib/analytics'

export function CartPageClient() {
  const { items, updateQuantity, removeItem, clearCart } = useShop()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const detailedItems = useMemo(() => items.map((item) => {
    const product = shopProducts.find((entry) => entry.slug === item.slug)
    return product ? { ...item, product } : null
  }).filter(Boolean), [items]) as Array<{ slug: string; quantity: number; product: (typeof shopProducts)[number] }>

  const totalPrice = detailedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/shop-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          note,
          gdprConsent,
          items: detailedItems.map((item) => ({
            slug: item.slug,
            name: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Nepodarilo se odeslat poptavku')
      }

      trackShopInquirySubmit(detailedItems.length, totalPrice)
      setIsSubmitted(true)
      clearCart()
      setName('')
      setEmail('')
      setPhone('')
      setNote('')
      setGdprConsent(false)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nepodarilo se odeslat poptavku')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-3xl border border-trust-100 bg-trust-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-trust-600 text-white">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900">Poptávka je odeslaná</h2>
        <p className="mx-auto max-w-2xl text-gray-600">
          Ozveme se vám s potvrzením dostupnosti, doporučením vhodné sady a dalším postupem.
        </p>
        <div className="mt-6">
          <Link href="/eshop" className="btn-primary">
            Zpět do e-shopu
          </Link>
        </div>
      </div>
    )
  }

  if (detailedItems.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h2 className="mb-3 text-2xl font-bold text-gray-900">Košík je zatím prázdný</h2>
        <p className="mx-auto mb-6 max-w-2xl text-gray-600">
          Vyberte si sadu, která dává smysl jako domácí pokračování po kroužku nebo jako první vstup do světa Arduino projektů.
        </p>
        <Link href="/eshop" className="btn-secondary">
          Projít nabídku sad
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        {detailedItems.map((item) => (
          <div
            key={item.slug}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-primary-600">{item.product.subtitle}</p>
                <h2 className="text-xl font-bold text-gray-900">{item.product.name}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                  {item.product.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {item.product.ageRange}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {item.product.level}
                  </span>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-lg font-bold text-gray-900">{formatPrice(item.product.price)}</p>
                <p className="text-sm text-gray-500">za kus</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                  className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  aria-label={`Snížit množství ${item.product.name}`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center text-sm font-semibold text-gray-900">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                  className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  aria-label={`Zvýšit množství ${item.product.name}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <p className="text-base font-semibold text-gray-900">
                  Celkem {formatPrice(item.product.price * item.quantity)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Odebrat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 border-b border-gray-100 pb-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-600">
            Poptávka
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Domluvíme další krok</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Tohle je zatím poptávkový košík. Po odeslání se vám ozveme s potvrzením dostupnosti a finální domluvou.
          </p>
          <div className="mt-4 rounded-2xl bg-gray-50 p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Položky</span>
              <span>{detailedItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-semibold text-gray-900">
              <span>Orientační cena</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="shop-name" className="mb-2 block text-sm font-medium text-gray-700">
              Jméno a příjmení
            </label>
            <input
              id="shop-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>
          <div>
            <label htmlFor="shop-email" className="mb-2 block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="shop-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>
          <div>
            <label htmlFor="shop-phone" className="mb-2 block text-sm font-medium text-gray-700">
              Telefon
            </label>
            <input
              id="shop-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label htmlFor="shop-note" className="mb-2 block text-sm font-medium text-gray-700">
              Poznámka
            </label>
            <textarea
              id="shop-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              placeholder="Třeba věk dítěte, zda je to dárek, nebo že chcete doporučit vhodnou variantu."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <label className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={gdprConsent}
              onChange={(event) => setGdprConsent(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              required
            />
            <span>
              Souhlasím se zpracováním osobních údajů za účelem vyřízení poptávky. Více najdete v{' '}
              <Link href="/gdpr" className="font-medium text-primary-600 hover:underline">
                zásadách ochrany osobních údajů
              </Link>.
            </span>
          </label>
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !gdprConsent}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3.5 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Odesílám poptávku...' : 'Odeslat poptávku'}
          </button>
        </form>
      </div>
    </div>
  )
}
