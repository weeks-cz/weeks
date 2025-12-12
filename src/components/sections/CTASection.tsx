'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function CTASection() {
  // TODO: This will be controlled by Sanity CMS - waitlistMode setting
  const isWaitlistMode = true
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {isWaitlistMode ? (
            <>
              <Mail className="w-16 h-16 text-primary-200 mx-auto mb-6" />
              <h2 className="heading-2 text-white mb-4">
                Budeme brzy! Přidejte se na waitlist
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Registrace na první běhy bude spuštěna začátkem ledna 2026.
                Zanechte nám email a dáme Vám vědět jako prvním včetně speciální nabídky pro early birds.
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur rounded-2xl p-8"
                >
                  <div className="w-16 h-16 bg-trust-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Děkujeme!</h3>
                  <p className="text-primary-100">
                    Jakmile otevřeme registrace, budete mezi prvními, kdo se dozví.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="váš@email.cz"
                      className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cta-500"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !gdprConsent}
                      className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Odesílám...' : 'Chci být informován/a'}
                      {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                    </button>
                  </div>

                  {/* GDPR Checkbox */}
                  <div className="flex items-start gap-3 text-left">
                    <input
                      type="checkbox"
                      id="gdpr-consent"
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-primary-300 text-cta-500 focus:ring-cta-500 focus:ring-offset-0"
                      required
                    />
                    <label htmlFor="gdpr-consent" className="text-sm text-primary-100 cursor-pointer">
                      Souhlasím se zpracováním osobních údajů za účelem zasílání informací o spuštění registrací.
                      Svůj souhlas mohu kdykoli odvolat.
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-500/20 border border-red-400 rounded-lg"
                    >
                      <p className="text-sm text-white">{error}</p>
                    </motion.div>
                  )}
                </form>
              )}

              <p className="text-sm text-primary-200 mt-4">
                Žádný spam, jen informace o nových termínech a speciální nabídky.
              </p>
            </>
          ) : (
            <>
              <Calendar className="w-16 h-16 text-primary-200 mx-auto mb-6" />
              <h2 className="heading-2 text-white mb-4">
                Zaregistrujte své dítě ještě dnes
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Místa jsou omezená - přihlašujeme max. 24 dětí na víkend.
                Vyberte termín, vyplňte údaje a my se ozveme s potvrzením do 24 hodin.
                Platba až po potvrzení.
              </p>
              <Link
                href="https://ddmpraha6.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg inline-flex items-center"
              >
                Přejít na registraci
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
