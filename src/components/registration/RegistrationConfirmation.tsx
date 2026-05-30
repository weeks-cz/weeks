'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface RegistrationData {
  id: string
  status: string
  payment_status: string
  location_id: string
  program: string
  term_start: string
  term_end: string
  parent_name: string
  parent_email: string
  child_name: string
  payment_amount: number
}

interface RegistrationConfirmationProps {
  registrationId: string
}

export function RegistrationConfirmation({ registrationId }: RegistrationConfirmationProps) {
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let attempts = 0
    async function fetchRegistration() {
      try {
        const response = await fetch(`/api/registration/${registrationId}`)
        if (!response.ok) throw new Error('Registrace nenalezena')
        const data = await response.json()
        if (cancelled) return
        setRegistration(data.registration)
        // The Comgate callback may still be in flight right after the user returns
        // from the gateway. Re-poll a few times so the page flips to "paid" without
        // a manual refresh.
        const paid =
          data.registration?.payment_status === 'completed' || data.registration?.status === 'paid'
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
  }, [registrationId])

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
        <p className="text-gray-600 mb-6">{error || 'Neplatný odkaz na registraci.'}</p>
        <Link href="/" className="btn-primary">Zpět na hlavní stránku</Link>
      </div>
    )
  }

  const isPaid = registration.payment_status === 'completed'
  const isPending = registration.status === 'pending'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      {/* Status */}
      <div className="text-center mb-8">
        {isPaid ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.5 }}>
            <CheckCircle2 className="w-20 h-20 text-trust-500 mx-auto mb-4" />
          </motion.div>
        ) : isPending ? (
          <Clock className="w-20 h-20 text-amber-500 mx-auto mb-4" />
        ) : (
          <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
        )}

        <h1 className="heading-2 mb-2">
          {isPaid ? 'Děkujeme za registraci!' : isPending ? 'Čeká na platbu' : 'Registrace zrušena'}
        </h1>
        <p className="text-gray-600">
          {isPaid
            ? 'Registraci i platbu jsme zaznamenali. Potvrzovací e-maily zatím nerozesíláme — s dotazy se ozvěte na info@weeks.cz.'
            : isPending
            ? 'Vaše registrace čeká na dokončení platby.'
            : 'Tato registrace byla zrušena.'}
        </p>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <span className="text-sm text-gray-500">Stav</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPaid ? 'bg-trust-50 text-trust-700' : isPending ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
          }`}>
            {isPaid ? 'Zaplaceno' : isPending ? 'Čeká na platbu' : 'Zrušeno'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Dítě</p>
            <p className="font-medium text-gray-900">{registration.child_name}</p>
          </div>
          <div>
            <p className="text-gray-500">Program</p>
            <p className="font-medium text-gray-900">{registration.program}</p>
          </div>
          <div>
            <p className="text-gray-500">Termín</p>
            <p className="font-medium text-gray-900">{new Date(registration.term_start).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-gray-500">Částka</p>
            <p className="font-medium text-gray-900">{registration.payment_amount?.toLocaleString('cs-CZ')} Kč</p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 text-sm">
          <p className="text-gray-500">Zákonný zástupce</p>
          <p className="font-medium text-gray-900">{registration.parent_name}</p>
          <p className="text-gray-600">{registration.parent_email}</p>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/" className="btn-outline">
          Zpět na hlavní stránku
        </Link>
      </div>
    </motion.div>
  )
}
