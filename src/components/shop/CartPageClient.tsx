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
        throw new Error(data.error || 'Nepodařilo se odeslat objednávku')
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
      setError(submitError instanceof Error ? submitError.message : 'Nepodařilo se odeslat objednávku')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-md border border-trust-200 bg-trust-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-sm bg-trust-600 text-white">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-ink">Objednávka je odeslaná</h2>
        <p className="mx-auto max-w-2xl text-ink-500">
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
      <div className="rounded-md border border-dashed border-ink/30 bg-paper p-10 text-center">
        <h2 className="mb-3 text-2xl font-bold text-ink">Košík je zatím prázdný</h2>
        <p className="mx-auto mb-6 max-w-2xl text-ink-500">
          Vyberte si Weeks sadu chytré elektroniky s přístupem do Učebny a projekty pro domácí tvoření.
        </p>
        <Link href="/eshop" className="btn-outline">
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
            className="rounded-md border border-ink/15 bg-paper p-6 card-maker"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="mb-1 font-mono text-sm font-medium text-primary-600">{item.product.subtitle}</p>
                <h2 className="text-xl font-bold text-ink">{item.product.name}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-500">
                  {item.product.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="border border-ink/20 rounded-sm px-2.5 py-1 font-mono text-xs font-medium text-ink bg-paper">
                    {item.product.ageRange}
                  </span>
                  <span className="border border-ink/20 rounded-sm px-2.5 py-1 font-mono text-xs font-medium text-ink bg-paper">
                    {item.product.level}
                  </span>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="font-mono text-lg font-bold text-ink">{formatPrice(item.product.price)}</p>
                <p className="font-mono text-sm text-ink-500">za kus</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 border-t border-ink/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 rounded-md border border-ink/15 px-2 py-1">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                  className="rounded-sm p-2 text-ink-500 transition-colors hover:bg-ink/10 hover:text-ink"
                  aria-label={`Snížit množství ${item.product.name}`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center font-mono text-sm font-semibold text-ink">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                  className="rounded-sm p-2 text-ink-500 transition-colors hover:bg-ink/10 hover:text-ink"
                  aria-label={`Zvýšit množství ${item.product.name}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <p className="font-mono text-base font-semibold text-ink">
                  Celkem {formatPrice(item.product.price * item.quantity)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Odebrat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-md border border-ink/15 bg-paper p-6 card-maker">
        <div className="mb-6 border-b border-ink/15 pb-6">
          <p className="mono-label">
            Objednávka
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Dokončíme to spolu</h2>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            Po odeslání vám potvrdíme dostupnost sady, přístup do Učebny a finální postup objednávky.
          </p>
          <div className="mt-4 rounded-md bg-paper-soft border border-ink/15 p-4">
            <div className="flex items-center justify-between text-sm text-ink-500">
              <span>Položky</span>
              <span className="font-mono">{detailedItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-semibold text-ink">
              <span>Orientační cena</span>
              <span className="font-mono">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="shop-name" className="mb-2 block text-sm font-medium text-ink">
              Jméno a příjmení
            </label>
            <input
              id="shop-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-md bg-white border border-ink/20 px-4 py-3 text-ink placeholder:text-ink/40 outline-none transition focus:border-ink focus:ring-1 focus:ring-ink"
              required
            />
          </div>
          <div>
            <label htmlFor="shop-email" className="mb-2 block text-sm font-medium text-ink">
              E-mail
            </label>
            <input
              id="shop-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md bg-white border border-ink/20 px-4 py-3 font-mono text-sm text-ink placeholder:text-ink/40 outline-none transition focus:border-ink focus:ring-1 focus:ring-ink"
              required
            />
          </div>
          <div>
            <label htmlFor="shop-phone" className="mb-2 block text-sm font-medium text-ink">
              Telefon
            </label>
            <input
              id="shop-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-md bg-white border border-ink/20 px-4 py-3 font-mono text-sm text-ink placeholder:text-ink/40 outline-none transition focus:border-ink focus:ring-1 focus:ring-ink"
            />
          </div>
          <div>
            <label htmlFor="shop-note" className="mb-2 block text-sm font-medium text-ink">
              Poznámka
            </label>
            <textarea
              id="shop-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              placeholder="Třeba věk dítěte, zda je to dárek, nebo že chcete doporučit vhodnou variantu."
              className="w-full rounded-md bg-white border border-ink/20 px-4 py-3 text-ink placeholder:text-ink/40 outline-none transition focus:border-ink focus:ring-1 focus:ring-ink"
            />
          </div>
          <label className="flex items-start gap-3 rounded-md bg-paper-soft border border-ink/15 p-4 text-sm text-ink-500">
            <input
              type="checkbox"
              checked={gdprConsent}
              onChange={(event) => setGdprConsent(event.target.checked)}
              className="mt-1 h-4 w-4 rounded-sm border-ink/30 text-primary-600 focus:ring-primary-500"
              required
            />
            <span>
              Souhlasím se zpracováním osobních údajů za účelem vyřízení objednávky. Více najdete v{' '}
              <Link href="/gdpr" className="font-medium text-primary-600 hover:underline">
                zásadách ochrany osobních údajů
              </Link>.
            </span>
          </label>
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !gdprConsent}
            className="btn-primary w-full"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Odesílám objednávku...' : 'Odeslat objednávku'}
          </button>
        </form>
      </div>
    </div>
  )
}
