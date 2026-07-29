'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, CheckCircle, Mail, Phone } from 'lucide-react'
import { useLocation } from '@/contexts/LocationContext'
import { trackSeasonInterest } from '@/lib/analytics'

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? 'mrezolbj'

/**
 * Off-season panel — zobrazuje se místo termínů a registračních tlačítek,
 * když `location.season.status === 'ended'`. Registraci nahrazuje sběrem
 * kontaktů na příští sezónu, ať návštěva mimo sezónu není ztracená.
 *
 * `source` rozlišuje v GA, ze které stránky kontakt přišel.
 */
export function SeasonClosedPanel({ source }: { source: string }) {
  const location = useLocation()
  const season = location.season

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!season || season.status !== 'ended') return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!season) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          program: `${location.name} — zájem o ${season.nextSeasonLabel}`,
          zdroj: source,
          _subject: `Zájem o ${season.nextSeasonLabel} – ${location.name}`,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        trackSeasonInterest({
          locationId: location.id,
          season: season.nextSeasonLabel,
          source,
        })
      } else {
        setError(`Nepodařilo se odeslat. Zkuste to znovu nebo napište na ${location.contact.email}.`)
      }
    } catch {
      setError(`Nepodařilo se odeslat. Zkuste to znovu nebo napište na ${location.contact.email}.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8"
    >
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
          <CalendarCheck className="w-7 h-7 text-primary-600" aria-hidden="true" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{season.heading}</h3>
        <p className="text-gray-600 leading-relaxed">{season.message}</p>
      </div>

      {submitted ? (
        <div className="mt-7 bg-trust-50 rounded-xl p-6 text-center border border-trust-200">
          <CheckCircle className="w-10 h-10 text-trust-500 mx-auto mb-3" aria-hidden="true" />
          <p className="font-semibold text-trust-800 mb-1">Máme to, děkujeme!</p>
          <p className="text-sm text-trust-700">
            Jakmile termíny na {season.nextSeasonLabel} vypíšeme, ozveme se na{' '}
            <span className="font-medium">{email}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="season-name" className="block text-sm font-medium text-gray-700 mb-1">
                Jméno rodiče
              </label>
              <input
                id="season-name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jan Novák"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="season-email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                id="season-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rodic@email.cz"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Odesílám…' : 'Dejte mi vědět o termínech'}
            <Mail className="ml-2 w-4 h-4" aria-hidden="true" />
          </button>

          <p className="text-xs text-gray-500 text-center">
            Nezávazné. Údaje použijeme jen k informování o táborech, nikdy je nepředáme třetí straně.
          </p>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
        <a
          href={`mailto:${location.contact.email}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <Mail className="w-4 h-4 text-gray-400" aria-hidden="true" />
          {location.contact.email}
        </a>
        <a
          href={`tel:${location.contact.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <Phone className="w-4 h-4 text-gray-400" aria-hidden="true" />
          {location.contact.phone}
        </a>
      </div>
    </motion.div>
  )
}
