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
        className={`inline-flex items-center justify-center gap-2 rounded-lg btn-secondary font-semibold transition-colors ${
          compact ? 'w-full whitespace-nowrap px-3 py-2.5 text-sm' : 'px-5 py-3'
        }`}
      >
        <Heart className="h-4 w-4 shrink-0" />
        <span>{buttonLabel}</span>
      </button>

      {isOpen && isMounted && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-night-800 border border-white/10 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="data-label">Připravujeme</p>
                <h2 className="mt-1 text-2xl font-bold text-white">{productName}</h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-night-700 hover:text-white"
                aria-label="Zavřít formulář"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="mt-6 rounded-2xl border border-trust-500/30 bg-trust-950/40 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-trust-400" />
                  <div>
                    <h3 className="font-semibold text-white">Děkujeme za zájem.</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      Až budeme produkt skládat do finální podoby, ozveme se vám s novinkami a dostupností.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-5 inline-flex items-center justify-center rounded-lg btn-primary w-full"
                >
                  Zavřít
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <p className="text-sm leading-6 text-slate-300">
                  Necháte nám kontakt a my vám dáme vědět, jakmile bude produkt dostupný nebo budeme ladit jeho finální podobu.
                </p>

                <div>
                  <label htmlFor={`interest-email-${productSlug}`} className="mb-2 block text-sm font-medium text-slate-300">
                    E-mail
                  </label>
                  <input
                    id={`interest-email-${productSlug}`}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl bg-night border border-white/15 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-accent-400 focus:ring-1 focus:ring-accent-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`interest-name-${productSlug}`} className="mb-2 block text-sm font-medium text-slate-300">
                    Jméno
                  </label>
                  <input
                    id={`interest-name-${productSlug}`}
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl bg-night border border-white/15 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-accent-400 focus:ring-1 focus:ring-accent-400"
                    placeholder="Volitelné"
                  />
                </div>

                <div>
                  <label htmlFor={`interest-note-${productSlug}`} className="mb-2 block text-sm font-medium text-slate-300">
                    Poznámka
                  </label>
                  <textarea
                    id={`interest-note-${productSlug}`}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={3}
                    className="w-full rounded-xl bg-night border border-white/15 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-accent-400 focus:ring-1 focus:ring-accent-400"
                    placeholder="Třeba věk dítěte nebo jestli už máte Starter sadu."
                  />
                </div>

                <label className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                  <input
                    type="checkbox"
                    checked={gdprConsent}
                    onChange={(event) => setGdprConsent(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-night text-accent-500 focus:ring-accent-400"
                    required
                  />
                  <span>Souhlasím se zpracováním osobních údajů za účelem kontaktování ohledně připravovaných Weeks produktů.</span>
                </label>

                {error && (
                  <p className="rounded-xl bg-red-950/40 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim() || !gdprConsent}
                  className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
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
