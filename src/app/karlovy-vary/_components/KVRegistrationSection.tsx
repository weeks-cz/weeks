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
    <section id="prihlasit" className="section-padding bg-ink text-paper blueprint-grid-dark border-y border-ink">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="mono-label-dark mb-4">Termíny</p>
          <h2 className="heading-2 text-paper mb-4">
            Léto <span className="text-accent-400">2026</span>
          </h2>
          <p className="text-lg text-paper/80">
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
                    <h3 className="text-xl font-display font-bold text-paper">{program.name}</h3>
                  </div>
                  <p className="font-mono text-sm text-paper/70">
                    {program.campType === 'week' ? 'Po–Pá, 8:00–17:00' : 'So–Ne, 9:00–17:00'}
                    {' · '}
                    Max {program.capacity} dětí
                    {' · '}
                    Děti {program.ageRange} let
                  </p>
                </div>
                <p className="font-mono text-2xl font-bold text-paper">
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
                      className="bg-ink-700/50 border border-paper/20 rounded-md p-5 flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-paper/60" />
                        <p className="font-mono font-semibold text-paper">{start} – {end}</p>
                      </div>
                      <p className="font-mono text-xs text-paper/50 mb-3">{term.day}</p>

                      <div className="flex items-center gap-1.5 text-xs mb-4">
                        <span className={`inline-block w-2 h-2 rounded-full ${isConfirmed ? 'bg-trust-400' : 'bg-cta-400'}`} />
                        <span className={`font-mono font-medium ${isConfirmed ? 'text-trust-300' : 'text-cta-300'}`}>
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
          <p className="text-center text-sm text-paper/60 mb-4">
            Nebo zanechte kontakt a budeme vás informovat o nových termínech a novinkách.
          </p>

          {submitted ? (
            <div className="bg-trust-500/20 border border-trust-400 rounded-md p-6 text-center">
              <CheckCircle className="w-10 h-10 text-trust-400 mx-auto mb-3" />
              <p className="font-display font-semibold text-paper mb-1">Přihlášení přijato!</p>
              <p className="text-sm text-paper/80">Dáme vám vědět na <span className="font-mono">{email}</span>.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-ink-700/30 border border-paper/20 rounded-md p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-name" className="block text-sm font-medium text-paper mb-1">Jméno rodiče</label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jan Novák"
                    className="w-full px-4 py-2.5 bg-transparent border border-paper/30 rounded-md text-sm text-paper placeholder:text-paper/40 focus:outline-none focus:border-paper focus:ring-1 focus:ring-paper"
                  />
                </div>
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-paper mb-1">E-mail</label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="rodic@email.cz"
                    className="w-full px-4 py-2.5 bg-transparent border border-paper/30 rounded-md font-mono text-sm text-paper placeholder:text-paper/40 focus:outline-none focus:border-paper focus:ring-1 focus:ring-paper"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-300">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Odesílám…' : 'Mám zájem — nezávazně'}
                <Mail className="ml-2 w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-center mt-3">
            <Users className="w-3 h-3 inline-block mr-1 text-paper/40" />
            <span className="text-xs text-paper/60">Vaše údaje použijeme jen k informování o táborech, nikdy je nepředáme třetí straně.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
