'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function CTASection() {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se odeslat email. Zkuste to prosím znovu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="prihlasit" className="section-padding bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left: Camp CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="h-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 backdrop-blur rounded-2xl p-8 border border-white/10 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cta-500 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gray-900" />
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-cta-500/20 rounded-full text-xs font-semibold text-cta-300">
                  <Sparkles className="w-3 h-3" />
                  Březnové termíny
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                Tábor chytrých technologií
              </h2>

              <p className="text-white/80 mb-6 flex-1">
                3D tisk, IoT programování a virtuální realita v jednom víkendu.
                Pro děti 10–15 let. Tři březnové termíny k výběru.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  '7. – 8. března (HWLab Praha)',
                  '14. – 15. března (HWLab Praha)',
                  '28. – 29. března (DDM Praha 6 – Bílá hora)',
                ].map((date, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/90">
                    <div className="w-2 h-2 rounded-full bg-cta-400 flex-shrink-0" />
                    {date}
                  </div>
                ))}
              </div>

              <Link
                href="/tabor-chytrych-technologii"
                className="group inline-flex items-center justify-center px-8 py-4 bg-cta-500 hover:bg-cta-400 text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-cta-500/30"
              >
                Zobrazit program a termíny
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right: Email form for future terms */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="h-full bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/10 flex flex-col">
              <Mail className="w-10 h-10 text-primary-200 mb-4" />

              <h3 className="text-xl font-display font-bold text-white mb-2">
                Zajímají vás další termíny?
              </h3>

              <p className="text-white/70 mb-6 text-sm">
                Zanechte nám email a dáme vám vědět o nových termínech a programech jako prvním.
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-14 h-14 bg-trust-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-1">Děkujeme!</h4>
                  <p className="text-white/70 text-sm">
                    O nových termínech se dozvíte jako první.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <label htmlFor="cta-email" className="block text-sm font-medium text-white/90 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="cta-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="váš@email.cz"
                      className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cta-500"
                      required
                    />
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="cta-gdpr-consent"
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-primary-300 text-cta-500 focus:ring-cta-500 focus:ring-offset-0"
                      required
                    />
                    <label htmlFor="cta-gdpr-consent" className="text-xs text-white/70 cursor-pointer">
                      Souhlasím se zpracováním osobních údajů správcem DDM Praha 6 za účelem zasílání informací o nových termínech.{' '}
                      <Link href="/gdpr" className="underline hover:text-white">
                        Více informací
                      </Link>
                    </label>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-red-500/20 border border-red-400 rounded-lg"
                      role="alert"
                      aria-live="assertive"
                    >
                      <p className="text-sm text-white">{error}</p>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !gdprConsent || !email.trim()}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                  >
                    {isSubmitting ? 'Odesílám...' : 'Dát mi vědět'}
                    {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                  </button>

                  <p className="text-xs text-primary-200 mt-3 text-center">
                    Žádný spam, jen info o nových termínech.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
