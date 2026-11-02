'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Landmark, Loader2, Lock, AlertTriangle, ShieldCheck } from 'lucide-react'
import { trackPaymentInitiated } from '@/lib/analytics'
import { formatDatumCs } from '@/lib/dates'
import type { PaymentPlan } from '@/lib/zaloha'

interface PaymentRedirectProps {
  registrationId: string
}

/** Co vrací GET /api/payment/comgate/create — jen čísla a stav, žádná osobní data. */
interface PlatbaInfo {
  stav: 'pending' | 'partial' | 'completed'
  plan: PaymentPlan
  castky: { plna: number; zaloha: number | null; doplatek: number | null }
  doplatekDo: string | null
}

const kc = (n: number) => `${n.toLocaleString('cs-CZ')} Kč`

export function PaymentRedirect({ registrationId }: PaymentRedirectProps) {
  const [info, setInfo] = useState<PlatbaInfo | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [plan, setPlan] = useState<PaymentPlan>('plna')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Stav platby a částky. Když se nenačtou, stránka nabídne plnou platbu jako dřív.
  useEffect(() => {
    let cancelled = false
    fetch(`/api/payment/comgate/create?registrationId=${encodeURIComponent(registrationId)}`)
      .then((r) => (r.ok ? (r.json() as Promise<PlatbaInfo>) : Promise.reject(new Error('stav'))))
      .then((data) => {
        if (cancelled) return
        setInfo(data)
        setPlan(data.plan)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [registrationId])

  const zaplaceno = info?.stav === 'completed'
  const doplatek = info?.stav === 'partial'
  const volbaZalohy = info?.stav === 'pending' && info.castky.zaloha !== null

  async function handlePay() {
    setIsProcessing(true)
    setError(null)
    try {
      const res = await fetch('/api/payment/comgate/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volbaZalohy ? { registrationId, plan } : { registrationId }),
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
  const castkaKZaplaceni = doplatek
    ? info?.castky.doplatek ?? 0
    : volbaZalohy && plan === 'zaloha'
      ? info?.castky.zaloha ?? 0
      : info?.castky.plna ?? 0

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      {isTest && (
        <div className="bg-amber-50 border border-amber-200 rounded-t-md px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm font-medium text-amber-800">TESTOVACÍ REŽIM — žádná reálná platba nebude provedena</p>
        </div>
      )}
      <div className={`bg-paper border border-ink/15 p-8 ${isTest ? 'rounded-b-md border-t-0' : 'rounded-md'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white border border-ink/15 rounded-sm flex items-center justify-center">
            <Landmark className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">
              {doplatek ? 'Doplatek za tábor' : 'Platba bankovním převodem'}
            </h2>
            <p className="text-sm text-ink-500">Zabezpečená platební brána Comgate</p>
          </div>
        </div>

        {zaplaceno && (
          <p className="text-ink-500 text-sm mb-6">
            Tato registrace je už zaplacená celá. Potvrzení jsme vám poslali e-mailem.
          </p>
        )}

        {doplatek && (
          <p className="text-ink-500 text-sm mb-6">
            Záloha je zaplacená a místo je rezervované. Zbývá doplatit{' '}
            <span className="font-semibold text-ink">{kc(info?.castky.doplatek ?? 0)}</span>
            {info?.doplatekDo && <> do {formatDatumCs(info.doplatekDo)}</>}.
          </p>
        )}

        {volbaZalohy && (
          <fieldset className="mb-6">
            <legend className="text-sm font-medium text-ink mb-3">Jak chcete zaplatit?</legend>
            <div className="space-y-2">
              <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-ink/20 bg-white p-3">
                <input
                  type="radio"
                  name="plan"
                  value="zaloha"
                  checked={plan === 'zaloha'}
                  onChange={() => setPlan('zaloha')}
                  className="mt-1"
                />
                <span className="text-sm text-ink">
                  <span className="font-semibold">Záloha {kc(info?.castky.zaloha ?? 0)} teď</span>
                  {info?.doplatekDo && (
                    <span className="block text-ink-500">
                      doplatek {kc(info.castky.doplatek ?? 0)} do {formatDatumCs(info.doplatekDo)}
                    </span>
                  )}
                </span>
              </label>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-ink/20 bg-white p-3">
                <input
                  type="radio"
                  name="plan"
                  value="plna"
                  checked={plan === 'plna'}
                  onChange={() => setPlan('plna')}
                  className="mt-1"
                />
                <span className="text-sm font-semibold text-ink">Celá částka {kc(info?.castky.plna ?? 0)}</span>
              </label>
            </div>
          </fieldset>
        )}

        {!zaplaceno && (
          <div className="flex items-start gap-2.5 p-3 mb-6 bg-trust-50 border border-trust-200 rounded-md">
            <ShieldCheck className="w-5 h-5 text-trust-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-trust-800">
              <span className="font-semibold">Bez rizika.</span> Zrušíte-li více než 30 dní před
              táborem, vrátíme vám celou částku. Při nemoci doložené potvrzením řešíme situaci
              individuálně.
            </p>
          </div>
        )}

        {error && (
          <div role="alert" aria-live="assertive" className="p-3 bg-red-50 border border-red-300 rounded-md mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!zaplaceno && (
          <button
            onClick={handlePay}
            disabled={isProcessing || !loaded}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Přesměrovávám na bránu…</>
            ) : (
              <><Lock className="w-5 h-5" /> {loaded && castkaKZaplaceni > 0 ? `Zaplatit ${kc(castkaKZaplaceni)}` : 'Přejít k platbě'}</>
            )}
          </button>
        )}
        <p className="text-xs text-ink/50 text-center mt-4 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> Platbu zpracovává Comgate a.s.
        </p>
      </div>
    </motion.div>
  )
}
