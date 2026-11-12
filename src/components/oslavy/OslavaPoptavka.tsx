'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Ikona } from '@/components/w2/Ikona'
import { telefonSazba } from '@/components/w2/text'
import { SITE } from '@/lib/site'
import { trackOslavaPoptavka } from '@/lib/analytics'

/**
 * Poptávka oslavy.
 *
 * Nerecykluje `FirmyPoptavka`: ta stojí na přepínači tří B2B nabídek řízeném
 * přes `?typ=` v adrese (a kvůli němu potřebuje `Suspense` a `useSearchParams`)
 * a nese povinné pole „Firma". Oslava nemá co přepínat ani žádnou firmu, takže
 * by z toho zbyl formulář s vypnutou polovinou kódu.
 *
 * Termín je **volný text, ne `<input type="date">`**: rodič často ví „někdy
 * v půlce června", ne přesné datum, a kalendář by ho nutil vybrat den, který
 * ještě neplatí. Nepřesná odpověď je tady užitečnější než přesná lež.
 *
 * Vzhled: karta `formular` z `redesign.css` (nový vzhled, vlna 2).
 */
export function OslavaPoptavka() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [telefon, setTelefon] = useState('')
  const [termin, setTermin] = useState('')
  const [message, setMessage] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Termín je součástí zprávy, ne samostatné pole: `/api/contact` posílá do
      // hubu pevnou sadu polí a přidávat kvůli jednomu řádku další by znamenalo
      // zásah i na druhé straně. Ve zprávě je stejně čitelný.
      const telo = termin.trim() ? `Orientační termín: ${termin.trim()}\n\n${message}` : message

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message: telo,
          ...(telefon ? { telefon } : {}),
          typ: 'oslava',
          // Souhlas posíláme jen jako doklad, že ho odesílatel udělil — server
          // se podle něj nerozhoduje. Že je zaškrtnutý, hlídá `required` na
          // zaškrtávátku níž.
          gdprConsent,
        }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok) {
        setSubmitted(true)
        trackOslavaPoptavka()
      } else {
        setError(data?.error || `Nepodařilo se odeslat. Zkuste to znovu nebo napište na ${SITE.email}.`)
      }
    } catch {
      setError(`Nepodařilo se odeslat. Zkuste to znovu nebo napište na ${SITE.email}.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="formular">
      <h3>Napište nám o oslavě</h3>
      <p>Stačí pár vět. Ozveme se s návrhem programu a cenou.</p>

      {submitted ? (
        <div className="hlaska" role="status" aria-live="polite">
          <b>Máme to, děkujeme!</b>
          Ozveme se na {email}. Kdyby cokoli, napište na{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> nebo zavolejte na{' '}
          <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{telefonSazba(SITE.phone)}</a>.
        </div>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <div className="pole-rada">
            <div className="pole">
              <label htmlFor="oslava-name">Jméno a příjmení</label>
              <input
                id="oslava-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jan Novák"
              />
            </div>
            <div className="pole">
              <label htmlFor="oslava-email">E-mail</label>
              <input
                id="oslava-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jan.novak@email.cz"
              />
            </div>
          </div>
          <div className="pole-rada">
            <div className="pole">
              <label htmlFor="oslava-telefon">
                Telefon <i>(nepovinné)</i>
              </label>
              <input
                id="oslava-telefon"
                type="tel"
                autoComplete="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="+420"
              />
            </div>
            <div className="pole">
              <label htmlFor="oslava-termin">
                Kdy to má být <i>(nepovinné)</i>
              </label>
              <input
                id="oslava-termin"
                type="text"
                maxLength={120}
                value={termin}
                onChange={(e) => setTermin(e.target.value)}
                placeholder="Třeba jen „půlka června“"
              />
            </div>
          </div>
          <div className="pole">
            <label htmlFor="oslava-message">Zpráva</label>
            <textarea
              id="oslava-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Kolik dětí přijde, jak jsou staré, kde se oslava koná a kolik času na program je."
            />
          </div>
          <label className="souhlas">
            <input
              type="checkbox"
              checked={gdprConsent}
              onChange={(e) => setGdprConsent(e.target.checked)}
              required
            />
            <span>
              Souhlasím se zpracováním osobních údajů. <Link href="/gdpr">Více informací</Link>
            </span>
          </label>
          {/* `role="alert"` schválně: prvek vzniká až se svou hláškou a samotné
              `aria-live` na nově vloženém uzlu většina odečítačů neoznámí.
              Stejný tvar jako `FirmyPoptavka` a `TurnusInterestForm`. */}
          {error && (
            <p className="hlaska chyba" role="alert" aria-live="assertive">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? 'Odesílám…' : 'Odeslat poptávku'}
            <Ikona id="odeslat" />
          </button>
        </form>
      )}
    </div>
  )
}
