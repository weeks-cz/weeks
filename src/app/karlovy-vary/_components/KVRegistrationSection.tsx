'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CalendarDays, Users, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLocation } from '@/contexts/LocationContext'

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? 'mrezolbj'

export function KVRegistrationSection() {
  const location = useLocation()
  const program = location.programs[0]
  const term = location.terms[0]

  const registrationUrl = program && term
    ? `/registrace?location=${location.id}&program=${program.id}&term=${term.id}`
    : null

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          program: `${program?.name ?? 'KV tábor'} — ${location.name}`,
          termin: term ? `${term.startDate} – ${term.endDate}` : '',
          _subject: 'Zájem o tábor – Karlovy Vary',
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Nepodařilo se odeslat. Zkuste znovu nebo napište na info@weeks.cz.')
      }
    } catch {
      setError('Nepodařilo se odeslat. Zkuste znovu nebo napište na info@weeks.cz.')
    } finally {
      setLoading(false)
    }
  }

  if (!program || !term) return null

  const startDate = new Date(term.startDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
  const endDate = new Date(term.endDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })

  return (
    <section id="prihlasit" className="section-padding bg-gray-50">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="heading-2 text-gray-900 mb-4">
              Registrace na <span className="text-gradient">tábor</span>
            </h2>
            <p className="text-lg text-gray-600">
              Jeden termín, jedna kapacita — přihlaste dítě závazně nebo
              zanechte kontakt a dáme vám vědět při otevření registrace.
            </p>
          </motion.div>

          {/* Term card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6"
          >
            <div className="flex flex-wrap gap-4 justify-between items-start mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  {startDate} – {endDate} · {term.day}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-gray-900">{program.price.toLocaleString('cs-CZ')} Kč</p>
                <p className="text-xs text-gray-500">celý týden vč. obědů</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 pb-5 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-accent-500 shrink-0" />
                Max {program.capacity} dětí
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                Připravujeme — registrace brzy otevřena
              </div>
            </div>

            {registrationUrl && (
              <Link
                href={registrationUrl}
                className="btn-primary w-full justify-center"
              >
                Závazná registrace
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            )}
            <p className="text-xs text-gray-500 text-center mt-3">
              5 kroků · platba kartou · faktura automaticky
            </p>
          </motion.div>

          {/* Interest form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-center text-sm text-gray-500 mb-4">
              Nebo zanechte kontakt a budeme vás informovat o dalších termínech a novinkách.
            </p>

            {submitted ? (
              <div className="bg-trust-50 rounded-2xl p-6 text-center border border-trust-200">
                <CheckCircle className="w-10 h-10 text-trust-500 mx-auto mb-3" />
                <p className="font-semibold text-trust-800 mb-1">Přihlášení přijato!</p>
                <p className="text-sm text-trust-700">Dáme vám vědět na <span className="font-medium">{email}</span>.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1">Jméno rodiče</label>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Jan Novák"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="rodic@email.cz"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={loading} className="btn-secondary w-full justify-center">
                  {loading ? 'Odesílám…' : 'Mám zájem — nezávazně'}
                  <Mail className="ml-2 w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
