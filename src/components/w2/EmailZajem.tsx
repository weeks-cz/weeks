'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { trackLead } from '@/lib/fbpixel'

/**
 * Sběr e-mailu v jantarovém závěru stránky: jedno pole, souhlas a tlačítko.
 *
 * Posílá na `/api/waitlist` stejně jako dřívější formulář v `ContactSection`
 * (`program: 'nevim'` — zájem není o konkrétní tábor). Souhlas se zpracováním
 * údajů je povinný a server ho kontroluje znovu.
 */
export function EmailZajem({ tlacitko = 'Dejte mi vědět o termínech' }: { tlacitko?: string }) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [souhlas, setSouhlas] = useState(false)
  const [odesilam, setOdesilam] = useState(false)
  const [hotovo, setHotovo] = useState(false)
  const [chyba, setChyba] = useState<string | null>(null)

  const odeslat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!souhlas) {
      setChyba('Bez souhlasu se zpracováním údajů vám napsat nemůžeme.')
      return
    }
    setOdesilam(true)
    setChyba(null)
    try {
      const odpoved = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, program: 'nevim', gdprConsent: souhlas }),
      })
      const data = await odpoved.json()
      if (!odpoved.ok) throw new Error(data.error || 'Něco se pokazilo')
      setHotovo(true)
      setEmail('')
      setSouhlas(false)
      trackLead()
    } catch (err) {
      setChyba(err instanceof Error ? err.message : 'E-mail se nepodařilo odeslat. Zkuste to prosím znovu.')
    } finally {
      setOdesilam(false)
    }
  }

  if (hotovo) {
    return (
      <p role="status" aria-live="polite">
        <b>Děkujeme. O nových termínech se dozvíte mezi prvními.</b>
      </p>
    )
  }

  return (
    <>
      <form className="form rada" onSubmit={odeslat}>
        <div className="pole">
          <label htmlFor={`${id}-email`}>E-mail</label>
          <input
            type="email"
            id={`${id}-email`}
            name="email"
            autoComplete="email"
            placeholder="rodic@email.cz"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-dark" disabled={odesilam}>
          {odesilam ? 'Odesílám…' : tlacitko}
        </button>
        <label className="souhlas">
          <input
            type="checkbox"
            name="souhlas"
            required
            checked={souhlas}
            onChange={(e) => setSouhlas(e.target.checked)}
          />
          <span>
            Souhlasím se zpracováním osobních údajů. <Link href="/gdpr">Více informací</Link>
          </span>
        </label>
        <p className="small" role="status" aria-live="polite">
          {chyba}
        </p>
      </form>
      <p className="small">
        Nezávazné. Údaje použijeme jen k informování o táborech, nikdy je nepředáme třetí straně.
      </p>
    </>
  )
}
