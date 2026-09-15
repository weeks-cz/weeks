'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Mail, Sparkles, Printer, Cpu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { trackLead } from '@/lib/fbpixel'
import type { TermDisplay } from '@/lib/camps'

interface CTASectionProps {
  // Soonest upcoming term per program, or null if none scheduled
  nextTerms: Record<string, TermDisplay | null>
}

function shortLabel(t: TermDisplay | null | undefined): string | null {
  if (!t) return null
  if (t.campType === 'weekend') return t.weekendDateLabel
  const dayShort = t.dayLabel === 'sobota' ? 'So' : t.dayLabel === 'neděle' ? 'Ne' : ''
  return dayShort ? `${dayShort} ${t.dateShortLabel}` : t.dateShortLabel
}

const camps = [
  {
    id: 'tech',
    icon: Sparkles,
    accentStrip: 'bg-accent-400',
    iconBg: 'bg-accent-500',
    dot: 'bg-accent-400',
    badge: 'Víkendový',
    title: 'Tábor chytrých technologií',
    description: '3D tisk, IoT a virtuální realita v jednom víkendu. So + Ne, 2 990 Kč.',
    href: '/tabor-chytrych-technologii',
  },
  {
    id: '3d-tisk',
    icon: Printer,
    accentStrip: 'bg-primary-400',
    iconBg: 'bg-primary-500',
    dot: 'bg-primary-400',
    badge: '1 den',
    title: '3D tisk',
    description: 'Od návrhu po hotový výtisk na profesionální tiskárně za jeden den. 1 490 Kč.',
    href: '/tabor-3d-tisk',
  },
  {
    id: 'iot',
    icon: Cpu,
    accentStrip: 'bg-trust-400',
    iconBg: 'bg-trust-500',
    dot: 'bg-trust-400',
    badge: '1 den',
    title: 'IoT & elektronika',
    description: 'Micro:bit/Arduino, senzory a vlastní chytré zařízení za jeden den. 1 490 Kč.',
    href: '/tabor-iot',
  },
]

export function CTASection({ nextTerms }: CTASectionProps) {
  const [email, setEmail] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          program: 'nevim',
          gdprConsent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Něco se pokazilo')
      }

      setIsSubmitted(true)
      setEmail('')
      setGdprConsent(false)
      trackLead()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se odeslat email. Zkuste to prosím znovu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="prihlasit" className="section-padding bg-ink text-paper blueprint-grid-dark border-y border-ink">
      <div className="section-container">
        {/* Camp cards - all 3 options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {camps.map((camp, index) => {
            const next = shortLabel(nextTerms[camp.id])
            return (
              <motion.div
                key={camp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <div className="h-full bg-ink-700/50 border border-paper/20 hover:border-paper/60 rounded-md overflow-hidden flex flex-col transition-colors duration-200">
                  {/* Barevný akcent tábora — horní proužek */}
                  <div className={`h-1 ${camp.accentStrip}`} aria-hidden="true" />

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-sm ${camp.iconBg} flex items-center justify-center`}>
                        <camp.icon className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                      <span className="px-2.5 py-1 border border-paper/30 rounded-sm font-mono text-xs text-paper/80">
                        {camp.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-bold text-paper mb-2">
                      {camp.title}
                    </h3>

                    <p className="text-paper/70 text-sm mb-4 flex-1">
                      {camp.description}
                    </p>

                    <div className="space-y-2 mb-6 min-h-[24px]">
                      {next && (
                        <div className="flex items-center gap-2 font-mono text-xs text-paper/80">
                          <div className={`w-1.5 h-1.5 ${camp.dot} flex-shrink-0`} />
                          Nejbližší: {next}
                        </div>
                      )}
                    </div>

                    <Link
                      href={camp.href}
                      className="btn-primary group text-sm"
                    >
                      Zobrazit termíny
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Email signup row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mt-10"
        >
          <div className="border border-paper/20 rounded-md p-6 bg-ink-700/30">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-2"
                role="status"
                aria-live="polite"
              >
                <div className="w-12 h-12 bg-trust-500 rounded-sm flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-paper font-semibold">Děkujeme! O novinkách se dozvíte jako první.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-accent-400" aria-hidden="true" />
                  <p className="text-paper font-medium text-sm">Nechte nám email — dáme vám vědět o nových termínech</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    id="cta-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="váš@email.cz"
                    className="flex-1 px-4 py-3 rounded-md bg-transparent border border-paper/30 font-mono text-sm text-paper placeholder:text-paper/40 focus:outline-none focus:border-paper focus:ring-1 focus:ring-paper"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !gdprConsent || !email.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isSubmitting ? 'Odesílám...' : 'Dát mi vědět'}
                  </button>
                </div>
                <div className="flex items-start gap-2 mt-3">
                  <input
                    type="checkbox"
                    id="cta-gdpr-consent"
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded-sm border-paper/30 bg-transparent text-cta-500 focus:ring-cta-500 focus:ring-offset-0"
                    required
                  />
                  <label htmlFor="cta-gdpr-consent" className="text-xs text-paper/60 cursor-pointer">
                    Souhlasím se zpracováním osobních údajů.{' '}
                    <Link href="/gdpr" className="underline hover:text-paper">
                      Více informací
                    </Link>
                  </label>
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-3 bg-red-500/20 border border-red-400 rounded-md"
                    role="alert"
                  >
                    <p className="text-sm text-paper">{error}</p>
                  </motion.div>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
