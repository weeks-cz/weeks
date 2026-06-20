'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Landmark, Loader2, Lock, AlertTriangle, ShieldCheck } from 'lucide-react'
import { trackPaymentInitiated } from '@/lib/analytics'

interface PaymentRedirectProps {
  registrationId: string
}

export function PaymentRedirect({ registrationId }: PaymentRedirectProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePay() {
    setIsProcessing(true)
    setError(null)
    try {
      const res = await fetch('/api/payment/comgate/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      })
      const data = await res.json()
      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error || 'Platbu se nepodařilo zahájit')
      }
      trackPaymentInitiated(registrationId)
      window.location.href = data.redirectUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Platbu se nepodařilo zahájit')
      setIsProcessing(false)
    }
  }

  const isTest = process.env.NEXT_PUBLIC_COMGATE_TEST !== 'false'

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      {isTest && (
        <div className="bg-amber-50 border border-amber-200 rounded-t-2xl px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm font-medium text-amber-800">TESTOVACÍ REŽIM — žádná reálná platba nebude provedena</p>
        </div>
      )}
      <div className={`bg-white border border-gray-200 p-8 shadow-lg ${isTest ? 'rounded-b-2xl border-t-0' : 'rounded-2xl'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <Landmark className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Platba bankovním převodem</h2>
            <p className="text-sm text-gray-500">Zabezpečená platební brána Comgate</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Po kliknutí budete přesměrováni na platební bránu Comgate, kde platbu dokončíte
          zrychleným bankovním převodem přes tlačítko své banky.
        </p>
        <div className="flex items-start gap-2.5 p-3 mb-6 bg-trust-50 border border-trust-200 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-trust-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-trust-800">
            <span className="font-semibold">Bez rizika.</span> Zrušíte-li více než 30 dní před
            táborem, vrátíme vám celou částku. Při nemoci doložené potvrzením řešíme situaci
            individuálně.
          </p>
        </div>
        {error && (
          <div role="alert" aria-live="assertive" className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {isProcessing ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Přesměrovávám na bránu…</>
          ) : (
            <><Lock className="w-5 h-5" /> Přejít k platbě</>
          )}
        </button>
        <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> Platbu zpracovává Comgate a.s.
        </p>
      </div>
    </motion.div>
  )
}
