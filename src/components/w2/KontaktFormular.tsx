'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Ikona } from './Ikona'
import { trackLead } from '@/lib/fbpixel'
import { SITE } from '@/lib/site'

/**
 * Obecný dotaz na `/kontakt`: jméno, e-mail, zpráva, souhlas.
 *
 * Posílá na `/api/contact` bez pole `typ` — tím se liší od poptávek z `/firmy`
 * a `/oslavy`, které tudy jdou taky. Dřív byl formulář napsaný přímo ve
 * stránce, která kvůli němu musela být celá klientská; teď je klientský jen
 * tenhle ostrov a stránka se generuje staticky.
 */
export function KontaktFormular() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', gdprConsent: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '', gdprConsent: false })
        trackLead()
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="formular" id="formular">
      <h2>Napište nám</h2>
      <p>Odpovíme co nejdříve na e-mail, který uvedete.</p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="pole-rada">
          <div className="pole">
            <label htmlFor="kontakt-name">Vaše jméno</label>
            <input
              type="text"
              id="kontakt-name"
              autoComplete="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Jan Novák"
            />
          </div>
          <div className="pole">
            <label htmlFor="kontakt-email">E-mail</label>
            <input
              type="email"
              id="kontakt-email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jan.novak@email.cz"
            />
          </div>
        </div>

        <div className="pole">
          <label htmlFor="kontakt-message">Zpráva</label>
          <textarea
            id="kontakt-message"
            required
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="S čím vám můžeme poradit?"
          />
        </div>

        <label className="souhlas">
          <input
            type="checkbox"
            required
            checked={formData.gdprConsent}
            onChange={(e) => setFormData({ ...formData, gdprConsent: e.target.checked })}
          />
          <span>
            Souhlasím se zpracováním osobních údajů za účelem vyřízení dotazu.{' '}
            <Link href="/gdpr">Více informací</Link>
          </span>
        </label>

        {submitStatus === 'success' && (
          <p className="hlaska" role="alert">
            <b>Děkujeme za zprávu.</b>
            Odpovíme vám co nejdříve.
          </p>
        )}
        {submitStatus === 'error' && (
          <p className="hlaska chyba" role="alert">
            Něco se pokazilo. Zkuste to prosím znovu, nebo nám napište na {SITE.email}.
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={isSubmitting}>
          {isSubmitting ? 'Odesílám…' : 'Odeslat zprávu'}
          <Ikona id="odeslat" />
        </button>
      </form>
    </div>
  )
}
