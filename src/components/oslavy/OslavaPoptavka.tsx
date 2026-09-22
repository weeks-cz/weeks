'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle, Mail, PartyPopper, Phone } from 'lucide-react'
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
 */
export function OslavaPoptavka() {
  const reduced = useReducedMotion()

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
          // zaškrtávátku a vypnuté tlačítko níž.
          gdprConsent,
        }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok) {
        setSubmitted(true)
        trackOslavaPoptavka()
      } else {
        setError(
          data?.error || `Nepodařilo se odeslat. Zkuste to znovu nebo napište na ${SITE.email}.`
        )
      }
    } catch {
      setError(`Nepodařilo se odeslat. Zkuste to znovu nebo napište na ${SITE.email}.`)
    } finally {
      setLoading(false)
    }
  }

  const poleClass =
    'w-full px-4 py-2.5 rounded-md bg-white border border-ink/20 text-ink placeholder:text-ink/40 text-sm focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink'

  return (
    <motion.div
      initial={reduced ? false : { y: 16 }}
      whileInView={reduced ? undefined : { y: 0 }}
      viewport={{ once: true }}
      className="max-w-2xl mx-auto bg-paper rounded-md border border-ink/15 p-6 sm:p-8"
    >
      <div className="text-center">
        <div className="w-14 h-14 rounded-md bg-ink/5 border border-ink/15 flex items-center justify-center mx-auto mb-5">
          <PartyPopper className="w-7 h-7 text-ink" aria-hidden="true" />
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mb-2">
          Napište nám o oslavě
        </h2>
        <p className="text-ink-500 leading-relaxed">
          Stačí pár vět — kolik dětí přijde, kdy to má být a kde. Ozveme se
          s návrhem programu.
        </p>
      </div>

      {submitted ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-7 bg-trust-50 rounded-md p-6 text-center border border-trust-200"
        >
          <CheckCircle className="w-10 h-10 text-trust-500 mx-auto mb-3" aria-hidden="true" />
          <p className="font-semibold text-trust-800 mb-1">Máme to, děkujeme!</p>
          <p className="text-sm text-trust-700">
            Ozveme se na <span className="font-medium">{email}</span>. Mezitím nás můžete
            kontaktovat i sami na{' '}
            <a href={`mailto:${SITE.email}`} className="font-medium underline">
              {SITE.email}
            </a>{' '}
            nebo{' '}
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="font-medium underline">
              {SITE.phone}
            </a>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="oslava-name" className="block text-sm font-medium text-ink mb-1">
                Jméno a příjmení
              </label>
              <input
                id="oslava-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jan Novák"
                className={poleClass}
              />
            </div>
            <div>
              <label htmlFor="oslava-email" className="block text-sm font-medium text-ink mb-1">
                E-mail
              </label>
              <input
                id="oslava-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jan.novak@email.cz"
                className={poleClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="oslava-telefon" className="block text-sm font-medium text-ink mb-1">
                Telefon <span className="text-ink/40 font-normal">(nepovinné)</span>
              </label>
              <input
                id="oslava-telefon"
                type="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="+420 —"
                className={poleClass}
              />
            </div>
            <div>
              <label htmlFor="oslava-termin" className="block text-sm font-medium text-ink mb-1">
                Kdy to má být <span className="text-ink/40 font-normal">(nepovinné)</span>
              </label>
              <input
                id="oslava-termin"
                type="text"
                value={termin}
                onChange={(e) => setTermin(e.target.value)}
                placeholder="Sobota 14. 6. nebo třeba jen „půlka června“"
                className={poleClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="oslava-message" className="block text-sm font-medium text-ink mb-1">
              Zpráva
            </label>
            <textarea
              id="oslava-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Kolik dětí přijde, jak jsou staré, kde se oslava koná a kolik času na program je."
              className={`${poleClass} resize-none`}
            />
          </div>

          <div className="flex items-start gap-2 justify-center pt-1">
            <input
              type="checkbox"
              id="oslava-gdpr"
              checked={gdprConsent}
              onChange={(e) => setGdprConsent(e.target.checked)}
              required
              className="mt-0.5 w-4 h-4 rounded-sm border-ink/30 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="oslava-gdpr" className="text-xs text-ink-500 cursor-pointer text-left">
              Souhlasím se zpracováním osobních údajů.{' '}
              <Link href="/gdpr" className="underline hover:text-primary-600">
                Více informací
              </Link>
            </label>
          </div>

          {/* `role="alert"` schválně: prvek vzniká až se svou hláškou a samotné
              `aria-live` na nově vloženém uzlu většina odečítačů neoznámí.
              Stejný tvar jako `FirmyPoptavka` a `TurnusInterestForm`. */}
          {error && (
            <p role="alert" aria-live="assertive" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !gdprConsent}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Odesílám…' : 'Odeslat poptávku'}
            <Mail className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-ink/15 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
        <a
          href={`mailto:${SITE.email}`}
          className="inline-flex items-center gap-2 text-ink-500 hover:text-ink transition-colors"
        >
          <Mail className="w-4 h-4 text-ink/40" aria-hidden="true" />
          {SITE.email}
        </a>
        <a
          href={`tel:${SITE.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-2 text-ink-500 hover:text-ink transition-colors"
        >
          <Phone className="w-4 h-4 text-ink/40" aria-hidden="true" />
          {SITE.phone}
        </a>
      </div>
    </motion.div>
  )
}
