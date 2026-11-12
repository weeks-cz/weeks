'use client'

import { useEffect, useState } from 'react'
import { Ikona } from '@/components/w2/Ikona'
import { Mrizka } from '@/components/w2/Mrizka'
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

// Mezi číslem a „Kč“ nezlomitelná mezera – částka se na tlačítku nesmí zalomit.
const kc = (n: number) => `${n.toLocaleString('cs-CZ')} Kč`

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
    <>
      <section className="zahlavi zahlavi-kratke dark mrizka">
        <Mrizka />
        <div className="wrap">
          <div className="zahlavi-uzke">
            <span className="stav-ikona r-cyan" aria-hidden="true">
              <Ikona id="budova" />
            </span>
            <h1>{doplatek ? 'Doplatek za tábor' : 'Platba bankovním převodem'}</h1>
            <p className="zahlavi-perex">Zabezpečená platební brána Comgate</p>
          </div>
        </div>
      </section>

      <section className="sec sec-papir bez-linky">
        <div className="wrap">
          <div className="formular platba">
            {isTest && (
              <p className="test-rezim">
                <Ikona id="stit" />
                TESTOVACÍ REŽIM — žádná reálná platba nebude provedena
              </p>
            )}

            {zaplaceno && (
              <p>Tato registrace je už zaplacená celá. Potvrzení jsme vám poslali e-mailem.</p>
            )}

            {doplatek && (
              <p>
                Záloha je zaplacená a místo je rezervované. Zbývá doplatit{' '}
                <b>{kc(info?.castky.doplatek ?? 0)}</b>
                {info?.doplatekDo && <> do {formatDatumCs(info.doplatekDo)}</>}.
              </p>
            )}

            {volbaZalohy && (
              <fieldset className="volby">
                <legend>Jak chcete zaplatit?</legend>
                <label className="volba-karta">
                  <input
                    type="radio"
                    name="plan"
                    value="zaloha"
                    checked={plan === 'zaloha'}
                    onChange={() => setPlan('zaloha')}
                  />
                  <b>Záloha {kc(info?.castky.zaloha ?? 0)} teď</b>
                  {info?.doplatekDo && (
                    <span>
                      doplatek {kc(info.castky.doplatek ?? 0)} do {formatDatumCs(info.doplatekDo)}
                    </span>
                  )}
                </label>
                <label className="volba-karta">
                  <input
                    type="radio"
                    name="plan"
                    value="plna"
                    checked={plan === 'plna'}
                    onChange={() => setPlan('plna')}
                  />
                  <b>Celá částka {kc(info?.castky.plna ?? 0)}</b>
                </label>
              </fieldset>
            )}

            {!zaplaceno && (
              <p className="hlaska">
                <b>Bez rizika.</b>
                Zrušíte-li více než 30 dní před táborem, vrátíme vám celou částku. Při nemoci
                doložené potvrzením řešíme situaci individuálně.
              </p>
            )}

            {error && (
              <p role="alert" aria-live="assertive" className="hlaska chyba">
                {error}
              </p>
            )}

            {!zaplaceno && (
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing || !loaded}
                className="btn btn-primary btn-lg btn-block"
              >
                {isProcessing ? (
                  <><Tocitko /> Přesměrovávám na bránu…</>
                ) : (
                  <>{loaded && castkaKZaplaceni > 0 ? `Zaplatit ${kc(castkaKZaplaceni)}` : 'Přejít k platbě'} <Ikona id="sipka" /></>
                )}
              </button>
            )}
            <p className="platba-pozn">
              <Ikona id="stit" /> Platbu zpracovává Comgate a.s.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

/** Točící se kolečko při přesměrování (dřív `Loader2` z lucide). */
function Tocitko() {
  return (
    <svg className="tocit" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.2-8.56" strokeLinecap="round" />
    </svg>
  )
}
