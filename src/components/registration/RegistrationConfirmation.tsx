'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, XCircle, Loader2, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { trackPaymentCompleted } from '@/lib/analytics'
import { sklikConversionHit } from '@/lib/sklik'
import { maOdeslatPurchase, type PaymentPlan } from '@/lib/zaloha'

interface RegistrationData {
  id: string
  status: string
  payment_status: string
  payment_plan?: PaymentPlan
  location_id: string
  program: string
  termId: string
  term_start: string
  term_end: string
  parent_name: string
  parent_email: string
  child_name: string
  payment_amount: number
}

interface RegistrationConfirmationProps {
  registrationId: string
  token?: string
}

export function RegistrationConfirmation({ registrationId, token }: RegistrationConfirmationProps) {
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const paidTracked = useRef(false)

  useEffect(() => {
    let cancelled = false
    let attempts = 0
    async function fetchRegistration() {
      try {
        const response = await fetch(`/api/registration/${registrationId}?t=${encodeURIComponent(token ?? '')}`)
        if (!response.ok) throw new Error('Registrace nenalezena')
        const data = await response.json()
        if (cancelled) return
        setRegistration(data.registration)
        // The Comgate callback may still be in flight right after the user returns
        // from the gateway. Re-poll a few times so the page flips to "paid" without
        // a manual refresh.
        // Záloha (partial) je úspěch: místo je rezervované. Polling končí i u ní.
        const paid =
          data.registration?.payment_status === 'completed' ||
          data.registration?.payment_status === 'partial' ||
          data.registration?.status === 'paid'
        // Konverze jen u platby, která přinesla místo (plná nebo záloha). Doplatek
        // ji znovu nezapočítá. Stejné pravidlo jako na serveru (`maOdeslatPurchase`).
        const konverze = maOdeslatPurchase(
          data.registration?.payment_plan ?? 'plna',
          data.registration?.payment_status ?? ''
        )
        if (paid && konverze && !paidTracked.current) {
          paidTracked.current = true
          trackPaymentCompleted({
            registrationId,
            termId: data.registration?.termId ?? '',
            value: data.registration?.payment_amount ?? 0,
          })
          // Sklik konverze (no-op bez NEXT_PUBLIC_SKLIK_CONVERSION_ID / marketing souhlasu)
          sklikConversionHit(data.registration?.payment_amount ?? undefined)
        }
        if (!paid && attempts < 4) {
          attempts += 1
          setTimeout(fetchRegistration, 4000)
        }
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Nepodařilo se načíst registraci')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchRegistration()
    return () => {
      cancelled = true
    }
  }, [registrationId, token])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (error || !registration) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="heading-2 mb-2">Registrace nenalezena</h1>
        <p className="text-ink-500 mb-6">{error || 'Neplatný odkaz na registraci.'}</p>
        <Link href="/" className="btn-primary">Zpět na hlavní stránku</Link>
      </div>
    )
  }

  const isPaid = registration.payment_status === 'completed'
  const isPartial = registration.payment_status === 'partial'
  const isPending = registration.status === 'pending'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      {/* Status */}
      <div className="text-center mb-8">
        {isPaid || isPartial ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.5 }}>
            <CheckCircle2 className="w-20 h-20 text-trust-500 mx-auto mb-4" />
          </motion.div>
        ) : isPending ? (
          <Clock className="w-20 h-20 text-amber-500 mx-auto mb-4" />
        ) : (
          <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
        )}

        <h1 className="heading-2 mb-2">
          {isPaid ? 'Děkujeme za registraci!' : isPartial ? 'Záloha je přijatá' : isPending ? 'Čeká na platbu' : 'Registrace zrušena'}
        </h1>
        <p className="text-ink-500">
          {isPaid
            ? 'Registraci i platbu jsme zaznamenali. Potvrzení jsme vám poslali e-mailem — zkontrolujte prosím i složku se spamem. Fakturu zašleme do 14 dnů od platby. S dotazy se ozvěte na info@weeks.cz.'
            : isPartial
            ? 'Místo je rezervované. Doplatek zbývá uhradit do termínu uvedeného v e-mailu a na stránce platby.'
            : isPending
            ? 'Vaše registrace čeká na dokončení platby.'
            : 'Tato registrace byla zrušena.'}
        </p>
      </div>

      {/* Details */}
      <div className="bg-paper rounded-md border border-ink p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-ink/15">
          <span className="text-sm text-ink-500">Stav</span>
          <span className={`px-3 py-1 rounded-sm text-sm font-medium border ${
            isPaid ? 'border-trust-300 bg-trust-50 text-trust-600' : isPartial || isPending ? 'border-amber-300 bg-amber-50 text-amber-600' : 'border-red-300 bg-red-50 text-red-600'
          }`}>
            {isPaid ? 'Zaplaceno' : isPartial ? 'Záloha zaplacena' : isPending ? 'Čeká na platbu' : 'Zrušeno'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-ink-500">Dítě</p>
            <p className="font-medium text-ink">{registration.child_name}</p>
          </div>
          <div>
            <p className="text-ink-500">Program</p>
            <p className="font-medium text-ink">{registration.program}</p>
          </div>
          <div>
            <p className="text-ink-500">Termín</p>
            <p className="font-medium text-ink">{new Date(registration.term_start).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-ink-500">Částka</p>
            <p className="font-medium text-ink font-mono">{registration.payment_amount?.toLocaleString('cs-CZ')} Kč</p>
          </div>
        </div>
        <div className="pt-4 border-t border-ink/15 text-sm">
          <p className="text-ink-500">Zákonný zástupce</p>
          <p className="font-medium text-ink">{registration.parent_name}</p>
          <p className="text-ink-500">{registration.parent_email}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 mt-8">
        {!isPaid && (
          <Link
            href={`/platba/${registration.id}?location=${registration.location_id}`}
            className="btn-primary w-full sm:w-auto justify-center"
          >
            <CreditCard className="w-4 h-4" />
            {isPartial ? 'Doplatit zbytek' : isPending ? 'Dokončit platbu' : 'Zkusit platbu znovu'}
          </Link>
        )}
        <Link
          href={registration.location_id && registration.location_id !== 'praha' ? `/${registration.location_id}` : '/'}
          className="btn-outline"
        >
          Zpět na hlavní stránku
        </Link>
      </div>
    </motion.div>
  )
}
