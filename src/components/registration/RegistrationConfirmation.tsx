'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Ikona } from '@/components/w2/Ikona'
import { Mrizka } from '@/components/w2/Mrizka'
import { sazba } from '@/components/w2/text'
import { formatTermLabel } from '@/lib/dates'
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
      <section className="sec sec-papir bez-linky">
        <p className="nacitani" role="status">
          <Tocitko />
          Načítám registraci…
        </p>
      </section>
    )
  }

  if (error || !registration) {
    return (
      <section className="zahlavi zahlavi-kratke dark mrizka">
        <Mrizka />
        <div className="wrap">
          <div className="zahlavi-uzke">
            <span className="stav-ikona r-cervena" aria-hidden="true">
              <Ikona id="minus" />
            </span>
            <h1>Registrace nenalezena</h1>
            {/* Chyba z načtení zní stejně jako nadpis („Registrace nenalezena“) –
                pod nadpisem by se jen opakovala. */}
            <p className="zahlavi-perex">
              {error && error !== 'Registrace nenalezena' ? error : 'Neplatný odkaz na registraci.'}
            </p>
            <div className="zahlavi-akce">
              <Link href="/" className="btn btn-primary btn-lg">Zpět na hlavní stránku</Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const isPaid = registration.payment_status === 'completed'
  const isPartial = registration.payment_status === 'partial'
  const isPending = registration.status === 'pending'

  // Barva nese roli: smaragd = máte jistotu (místo je vaše), jantar = čeká
  // se na vás, červená = zrušeno.
  const ikona = isPaid || isPartial ? 'r-emerald' : isPending ? 'r-amber' : 'r-cervena'
  const stitek = isPaid ? 'r-emerald' : isPartial || isPending ? 'r-amber' : 'r-cervena'

  return (
    <>
      <section className="zahlavi zahlavi-kratke dark mrizka">
        <Mrizka />
        <div className="wrap">
          <div className="zahlavi-uzke">
            <span className={`stav-ikona ${ikona}`} aria-hidden="true">
              <Ikona id={isPaid || isPartial ? 'ok' : isPending ? 'hodiny' : 'minus'} />
            </span>
            <h1>
              {isPaid ? 'Děkujeme za registraci!' : isPartial ? 'Záloha je přijatá' : isPending ? 'Čeká na platbu' : 'Registrace zrušena'}
            </h1>
            <p className="zahlavi-perex">
              {sazba(
                isPaid
                  ? 'Registraci i platbu jsme zaznamenali. Potvrzení jsme vám poslali e-mailem — zkontrolujte prosím i složku se spamem. Fakturu zašleme do 14 dnů od platby. S dotazy se ozvěte na info@weeks.cz.'
                  : isPartial
                  ? 'Místo je rezervované. Doplatek zbývá uhradit do termínu uvedeného v e-mailu a na stránce platby.'
                  : isPending
                  ? 'Vaše registrace čeká na dokončení platby.'
                  : 'Tato registrace byla zrušena.'
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="sec sec-papir bez-linky">
        <div className="wrap">
          <div className="formular stred">
            <div className="detail-hl">
              <h2>Registrace</h2>
              <span className={`stav-stitek ${stitek}`}>
                <span className="sr">Stav: </span>
                {isPaid ? 'Zaplaceno' : isPartial ? 'Záloha zaplacena' : isPending ? 'Čeká na platbu' : 'Zrušeno'}
              </span>
            </div>
            <div className="udaje">
              <div>
                <h3>Dítě</h3>
                <p>{registration.child_name}</p>
              </div>
              <div>
                <h3>Program</h3>
                <p>{registration.program}</p>
              </div>
              <div>
                <h3>Termín</h3>
                <p>{sazba(formatTermLabel(registration.term_start, registration.term_end))}</p>
              </div>
              <div>
                <h3>Částka</h3>
                <p>{registration.payment_amount?.toLocaleString('cs-CZ')}&nbsp;Kč</p>
              </div>
              <div className="cely oddelit">
                <h3>Zákonný zástupce</h3>
                <p>{registration.parent_name}</p>
                <p>{registration.parent_email}</p>
              </div>
            </div>

            <div className="akce-svisle">
              {!isPaid && (
                <Link
                  href={`/platba/${registration.id}?location=${registration.location_id}`}
                  className="btn btn-primary btn-lg"
                >
                  {isPartial ? 'Doplatit zbytek' : isPending ? 'Dokončit platbu' : 'Zkusit platbu znovu'}
                  <Ikona id="sipka" />
                </Link>
              )}
              {/* Dřív vedl odkaz u Karlových Varů na /karlovy-vary – stránku,
                  která už neexistuje a jen přesměrovává na výpis táborů. */}
              <Link href="/" className="btn btn-outline btn-lg">
                Zpět na hlavní stránku
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/** Točící se kolečko při načítání (dřív `Loader2` z lucide). */
function Tocitko() {
  return (
    <svg className="tocit" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.2-8.56" strokeLinecap="round" />
    </svg>
  )
}
