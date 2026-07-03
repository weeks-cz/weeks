'use client'

import { FormEvent, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Heart, Send, X } from 'lucide-react'
import type { ShopProductType } from '@/lib/shop'

interface ProductInterestButtonProps {
  productSlug: string
  productName: string
  productType: ShopProductType
  buttonLabel?: string
  compact?: boolean
}

export function ProductInterestButton({
  productSlug,
  productName,
  productType,
  buttonLabel = 'Mám zájem',
  compact = false,
}: ProductInterestButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  const closeModal = () => {
    setIsOpen(false)
    setError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/product-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          note,
          gdprConsent,
          productSlug,
          productName,
          productType,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Nepodařilo se odeslat zájem.')
      }

      setIsSubmitted(true)
      setEmail('')
      setName('')
      setNote('')
      setGdprConsent(false)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nepodařilo se odeslat zájem.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`btn-outline ${
          compact ? 'w-full whitespace-nowrap px-3 py-2.5 text-sm' : 'px-5 py-3'
        }`}
      >
        <Heart className="h-4 w-4 shrink-0" />
        <span>{buttonLabel}</span>
      </button>

      {isOpen && isMounted && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/70 px-4 py-8"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-md border border-ink/15 bg-paper p-6 card-maker shadow-hard"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mono-label">Připravujeme</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">{productName}</h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-sm p-2 text-ink/50 transition-colors hover:bg-ink/10 hover:text-ink"
                aria-label="Zavřít formulář"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="mt-6 rounded-md border border-trust-200 bg-trust-50 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-trust-600" />
                  <div>
                    <h3 className="font-semibold text-ink">Děkujeme za zájem.</h3>
                    <p className="mt-1 text-sm leading-6 text-ink-500">
                      Až budeme produkt skládat do finální podoby, ozveme se vám s novinkami a dostupností.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-primary mt-5 w-full"
                >
                  Zavřít
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <p className="text-sm leading-6 text-ink-500">
                  Necháte nám kontakt a my vám dáme vědět, jakmile bude produkt dostupný nebo budeme ladit jeho finální podobu.
                </p>

                <div>
                  <label htmlFor={`interest-email-${productSlug}`} className="mb-2 block text-sm font-medium text-ink">
                    E-mail
                  </label>
                  <input
                    id={`interest-email-${productSlug}`}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-md bg-white border border-ink/20 px-4 py-3 font-mono text-sm text-ink placeholder:text-ink/40 outline-none transition focus:border-ink focus:ring-1 focus:ring-ink"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`interest-name-${productSlug}`} className="mb-2 block text-sm font-medium text-ink">
                    Jméno
                  </label>
                  <input
                    id={`interest-name-${productSlug}`}
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-md bg-white border border-ink/20 px-4 py-3 text-ink placeholder:text-ink/40 outline-none transition focus:border-ink focus:ring-1 focus:ring-ink"
                    placeholder="Volitelné"
                  />
                </div>

                <div>
                  <label htmlFor={`interest-note-${productSlug}`} className="mb-2 block text-sm font-medium text-ink">
                    Poznámka
                  </label>
                  <textarea
                    id={`interest-note-${productSlug}`}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={3}
                    className="w-full rounded-md bg-white border border-ink/20 px-4 py-3 text-ink placeholder:text-ink/40 outline-none transition focus:border-ink focus:ring-1 focus:ring-ink"
                    placeholder="Třeba věk dítěte nebo jestli už máte Starter sadu."
                  />
                </div>

                <label className="flex items-start gap-3 text-sm leading-6 text-ink-500">
                  <input
                    type="checkbox"
                    checked={gdprConsent}
                    onChange={(event) => setGdprConsent(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded-sm border-ink/30 text-primary-600 focus:ring-primary-500"
                    required
                  />
                  <span>Souhlasím se zpracováním osobních údajů za účelem kontaktování ohledně připravovaných Weeks produktů.</span>
                </label>

                {error && (
                  <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim() || !gdprConsent}
                  className="btn-primary w-full"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Odesílám...' : 'Odeslat zájem'}
                </button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
