'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CalendarDays, Users, CheckCircle, ArrowRight, Sparkles, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useLocation } from '@/contexts/LocationContext'
import { useTermCapacity, SpotsLeftBadge } from './SpotsLeft'

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? 'mrezolbj'

export function KVRegistrationSection() {
  const location = useLocation()
  const capacity = useTermCapacity(location.id)

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
          program: `Tábor v Karlových Varech — info o termínech`,
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

  // Build per-program blocks
  const blocks = location.programs.map(program => {
    const terms = location.terms.filter(t => t.program === program.id)
    return { program, terms }
  }).filter(b => b.terms.length > 0)

  if (blocks.length === 0) return null

  return (
    <section id="prihlasit" className="section-padding bg-night">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <h2 className="heading-2 text-white mb-4">
            Termíny <span className="text-gradient">léto 2026</span>
          </h2>
          <p className="text-lg text-slate-300">
            Vyberte si formát i konkrétní termín. Příměstský tábor (Po–Pá) i víkendový MIX (So–Ne)
            probíhají ve FabLabu VARY&TE v Karlových Varech.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-12">
          {blocks.map(({ program, terms }) => (
            <div key={program.id}>
              {/* Program header */}
              <div className="flex items-end justify-between gap-4 mb-5 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {program.campType === 'week' ? (
                      <CalendarDays className="w-5 h-5 text-accent-400" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-primary-400" />
                    )}
                    <h3 className="text-xl font-bold text-white">{program.name}</h3>
                  </div>
                  <p className="text-sm text-slate-400">
                    {program.campType === 'week' ? 'Po–Pá, 8:00–17:00' : 'So–Ne, 9:00–17:00'}
                    {' · '}
                    Max {program.capacity} dětí
                    {' · '}
                    Děti {program.ageRange} let
                  </p>
                </div>
                <p className="text-2xl font-bold text-white">
                  {program.price.toLocaleString('cs-CZ')} Kč
                </p>
              </div>

              {/* Term cards */}
              <div className={`grid gap-4 ${terms.length === 1 ? '' : 'sm:grid-cols-2'}`}>
                {terms.map((term, i) => {
                  const start = new Date(term.startDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })
                  const end = new Date(term.endDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
                  const url = `/registrace?location=${location.id}&program=${program.id}&term=${term.id}`
                  const isConfirmed = term.status === 'confirmed'
                  return (
                    <motion.div
                      key={term.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="card-glow p-5 flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-accent-400" />
                        <p className="font-semibold text-white">{start} – {end}</p>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{term.day}</p>

                      <div className="flex items-center gap-1.5 text-xs mb-4">
                        <span className={`inline-block w-2 h-2 rounded-full ${isConfirmed ? 'bg-trust-400' : 'bg-cta-400'}`} />
                        <span className={`font-medium ${isConfirmed ? 'text-trust-400' : 'text-cta-400'}`}>
                          {isConfirmed ? 'Registrace otevřena' : 'Připravujeme'}
                        </span>
                      </div>

                      {/* Počítadlo míst jen u příměstského (týdenního) — u víkendového
                          MIXu ho neukazujeme, prázdné termíny by působily jako slabý signál. */}
                      {isConfirmed && program.campType === 'week' && capacity?.[term.id] && (
                        <div className="mb-4">
                          <SpotsLeftBadge {...capacity[term.id]} />
                        </div>
                      )}

                      <Link
                        href={url}
                        className="btn-primary w-full justify-center mt-auto text-sm"
                      >
                        {isConfirmed ? 'Závazná registrace' : 'Nezávazná registrace'}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Interest form — fallback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto mt-16"
        >
          <p className="text-center text-sm text-slate-400 mb-4">
            Nebo zanechte kontakt a budeme vás informovat o nových termínech a novinkách.
          </p>

          {submitted ? (
            <div className="card-glow rounded-2xl p-6 text-center border border-trust-500/40 bg-trust-500/10">
              <CheckCircle className="w-10 h-10 text-trust-400 mx-auto mb-3" />
              <p className="font-semibold text-white mb-1">Přihlášení přijato!</p>
              <p className="text-sm text-trust-300">Dáme vám vědět na <span className="font-medium">{email}</span>.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-glow rounded-2xl p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-name" className="block text-sm font-medium text-white mb-1">Jméno rodiče</label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jan Novák"
                    className="bg-night border border-white/15 text-white placeholder:text-slate-500 rounded-lg focus:border-accent-400 focus:ring-1 focus:ring-accent-400 w-full px-4 py-2.5 text-sm focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-white mb-1">E-mail</label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="rodic@email.cz"
                    className="bg-night border border-white/15 text-white placeholder:text-slate-500 rounded-lg focus:border-accent-400 focus:ring-1 focus:ring-accent-400 w-full px-4 py-2.5 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Odesílám…' : 'Mám zájem — nezávazně'}
                <Mail className="ml-2 w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-center mt-3">
            <Users className="w-3 h-3 inline-block mr-1 text-slate-500" />
            <span className="text-xs text-slate-400">Vaše údaje použijeme jen k informování o táborech, nikdy je nepředáme třetí straně.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
