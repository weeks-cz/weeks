'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Mail, Sparkles, Printer, Cpu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { trackLead } from '@/lib/fbpixel'
import { AuroraGlow } from '@/components/effects/AuroraGlow'
import { MagneticButton } from '@/components/effects/MagneticButton'
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

export function CTASection({ nextTerms }: CTASectionProps) {
  const techNext = shortLabel(nextTerms['tech'])
  const tisk3dNext = shortLabel(nextTerms['3d-tisk'])
  const iotNext = shortLabel(nextTerms['iot'])
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
    <section id="prihlasit" className="section-padding relative bg-night-800 noise overflow-hidden border-y border-white/10">
      <AuroraGlow className="opacity-60" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="data-label mb-4">05 / VYBER SI TÁBOR</p>
          <h2 className="heading-2">Tři formáty <span className="text-gradient">jednoho cíle</span></h2>
        </motion.div>

        {/* Camp cards - all 3 options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {/* MIX - weekend camp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="card-glow bg-night h-full flex flex-col border-t-2 border-t-primary-400">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="px-2.5 py-1 bg-primary-500/20 rounded-full text-xs font-semibold text-primary-300">
                  Víkendový
                </span>
              </div>

              <h3 className="font-display font-bold text-white mb-2">
                Tábor chytrých technologií
              </h3>

              <p className="text-slate-400 text-sm mb-4 flex-1">
                3D tisk, IoT a virtuální realita v jednom víkendu. So + Ne, 2 990 Kč.
              </p>

              <div className="font-mono text-xs text-slate-400 mb-6 min-h-[20px]">
                {techNext && (
                  <span>Nejbližší: {techNext}</span>
                )}
              </div>

              <MagneticButton>
                <Link
                  href="/tabor-chytrych-technologii"
                  className="btn-primary text-sm"
                >
                  Zobrazit termíny
                </Link>
              </MagneticButton>
            </div>
          </motion.div>

          {/* 3D tisk - one-day */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="card-glow bg-night h-full flex flex-col border-t-2 border-t-primary-400">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                  <Printer className="w-5 h-5 text-white" />
                </div>
                <span className="px-2.5 py-1 bg-primary-500/20 rounded-full text-xs font-semibold text-primary-300">
                  1 den
                </span>
              </div>

              <h3 className="font-display font-bold text-white mb-2">
                3D tisk
              </h3>

              <p className="text-slate-400 text-sm mb-4 flex-1">
                Od návrhu po hotový výtisk na profesionální tiskárně za jeden den. 1 490 Kč.
              </p>

              <div className="font-mono text-xs text-slate-400 mb-6 min-h-[20px]">
                {tisk3dNext && (
                  <span>Nejbližší: {tisk3dNext}</span>
                )}
              </div>

              <MagneticButton>
                <Link
                  href="/tabor-3d-tisk"
                  className="btn-primary text-sm"
                >
                  Zobrazit termíny
                </Link>
              </MagneticButton>
            </div>
          </motion.div>

          {/* IoT - one-day */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-glow bg-night h-full flex flex-col border-t-2 border-t-trust-400">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-trust-500 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <span className="px-2.5 py-1 bg-trust-500/20 rounded-full text-xs font-semibold text-trust-300">
                  1 den
                </span>
              </div>

              <h3 className="font-display font-bold text-white mb-2">
                IoT & elektronika
              </h3>

              <p className="text-slate-400 text-sm mb-4 flex-1">
                Micro:bit/Arduino, senzory a vlastní chytré zařízení za jeden den. 1 490 Kč.
              </p>

              <div className="font-mono text-xs text-slate-400 mb-6 min-h-[20px]">
                {iotNext && (
                  <span>Nejbližší: {iotNext}</span>
                )}
              </div>

              <MagneticButton>
                <Link
                  href="/tabor-iot"
                  className="btn-primary text-sm"
                >
                  Zobrazit termíny
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </div>

        {/* Email signup row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-night-800 border border-white/10 rounded-lg p-6">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-2"
                role="status"
                aria-live="polite"
              >
                <div className="w-12 h-12 bg-trust-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-semibold">Děkujeme! O novinkách se dozvíte jako první.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-accent-400" />
                  <p className="text-white font-medium text-sm">Nechte nám email — dáme vám vědět o nových termínech</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    id="cta-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="váš@email.cz"
                    className="flex-1 bg-night border border-white/15 text-white placeholder:text-slate-500 rounded-lg focus:border-accent-400 focus:ring-1 focus:ring-accent-400 px-4 py-3"
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
                    className="mt-0.5 w-4 h-4 rounded border-white/30 bg-white/10 text-cta-500 focus:ring-cta-500 focus:ring-offset-0"
                    required
                  />
                  <label htmlFor="cta-gdpr-consent" className="text-xs text-slate-400 cursor-pointer">
                    Souhlasím se zpracováním osobních údajů.{' '}
                    <Link href="/gdpr" className="underline hover:text-white">
                      Více informací
                    </Link>
                  </label>
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-3 bg-red-500/20 border border-red-400 rounded-lg"
                    role="alert"
                  >
                    <p className="text-sm text-white">{error}</p>
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
