'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, Lock, Loader2, AlertTriangle } from 'lucide-react'

interface PaymentMockProps {
  registrationId: string
}

export function PaymentMock({ registrationId }: PaymentMockProps) {
  const router = useRouter()
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const response = await fetch('/api/payment/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Platba se nezdařila')
      }

      router.push(data.redirectUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Platba se nezdařila')
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      {/* Test mode banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-t-2xl px-4 py-3 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm font-medium text-amber-800">TESTOVACÍ REŽIM — žádná reálná platba nebude provedena</p>
      </div>

      {/* Payment form */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-gray-200 p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Platba kartou</h2>
            <p className="text-sm text-gray-500">Testovací platební brána</p>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-5">
          <div>
            <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">Číslo karty</label>
            <input
              id="card"
              type="text"
              value={cardNumber}
              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="4242 4242 4242 4242"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-lg tracking-wider"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Platnost</label>
              <input
                id="expiry"
                type="text"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                placeholder="12/28"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                required
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                id="cvv"
                type="text"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Zpracovávám platbu...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Zaplatit
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Testovací prostředí — žádné údaje nejsou zpracovávány
        </p>
      </div>
    </motion.div>
  )
}
