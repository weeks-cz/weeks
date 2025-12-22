'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const programs = [
  { id: 'mix', label: 'MIX - Ochutnej vše', recommended: true },
  { id: '3d-tisk', label: '3D tisk', recommended: false },
  { id: 'iot', label: 'IoT & Arduino', recommended: false },
  { id: 'blender', label: '3D modelování (Blender)', recommended: false },
  { id: 'web', label: 'Tvorba webu', recommended: false },
  { id: 'hry', label: 'Vývoj her', recommended: false },
  { id: 'csharp', label: 'Programování C#', recommended: false },
  { id: 'nevim', label: 'Ještě nevím', recommended: false },
]

export function CTASection() {
  // TODO: This will be controlled by Sanity CMS - waitlistMode setting
  const isWaitlistMode = true
  const [email, setEmail] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('mix')
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')
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
          program: selectedProgram,
          childName: childName || undefined,
          childAge: childAge || undefined,
          gdprConsent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Něco se pokazilo')
      }

      setIsSubmitted(true)
      setEmail('')
      setSelectedProgram('mix')
      setChildName('')
      setChildAge('')
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
          className="max-w-2xl mx-auto"
        >
          {isWaitlistMode ? (
            <>
              <div className="text-center mb-8">
                <Mail className="w-16 h-16 text-primary-200 mx-auto mb-6" />
                <h2 className="heading-2 text-white mb-4">
                  Budeme brzy! Přidejte se na waitlist
                </h2>
                <p className="text-xl text-white/90">
                  Registrace na první běhy bude spuštěna začátkem roku 2026.
                  Zanechte nám kontakt a dáme Vám vědět jako prvním.
                </p>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-16 h-16 bg-trust-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Děkujeme!</h3>
                  <p className="text-white/80">
                    Jakmile otevřeme registrace, budete mezi prvními, kdo se dozví.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8">
                  {/* Email */}
                  <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="váš@email.cz"
                      className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cta-500"
                      required
                    />
                  </div>

                  {/* Program Selection */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Který program vás zajímá? *
                    </label>
                    <div className="space-y-2">
                      {programs.map((program) => (
                        <label
                          key={program.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedProgram === program.id
                              ? 'bg-white/20'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <input
                            type="radio"
                            name="program"
                            value={program.id}
                            checked={selectedProgram === program.id}
                            onChange={(e) => setSelectedProgram(e.target.value)}
                            className="w-4 h-4 text-cta-500 focus:ring-cta-500 focus:ring-offset-0 border-white/50"
                          />
                          <span className="text-white flex-1">{program.label}</span>
                          {program.recommended && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cta-500 rounded-full text-xs font-semibold text-white">
                              <Sparkles className="w-3 h-3" />
                              Pro začátečníky
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Optional fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div>
                      <label htmlFor="childName" className="block text-sm font-medium text-white/90 mb-2">
                        Jméno dítěte <span className="text-white/50">(nepovinné)</span>
                      </label>
                      <input
                        type="text"
                        id="childName"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="Jan"
                        className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cta-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="childAge" className="block text-sm font-medium text-white/90 mb-2">
                        Věk dítěte <span className="text-white/50">(nepovinné)</span>
                      </label>
                      <select
                        id="childAge"
                        value={childAge}
                        onChange={(e) => setChildAge(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-cta-500"
                      >
                        <option value="">Vyberte...</option>
                        <option value="10">10 let</option>
                        <option value="11">11 let</option>
                        <option value="12">12 let</option>
                        <option value="13">13 let</option>
                        <option value="14">14 let</option>
                        <option value="15">15 let</option>
                      </select>
                    </div>
                  </div>

                  {/* GDPR Checkbox */}
                  <div className="flex items-start gap-3 mb-6">
                    <input
                      type="checkbox"
                      id="gdpr-consent"
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-primary-300 text-cta-500 focus:ring-cta-500 focus:ring-offset-0"
                      required
                    />
                    <label htmlFor="gdpr-consent" className="text-sm text-white/80 cursor-pointer">
                      Souhlasím se zpracováním osobních údajů za účelem zasílání informací o spuštění registrací.
                      Svůj souhlas mohu kdykoli odvolat.{' '}
                      <Link href="/gdpr" className="underline hover:text-white">
                        Více informací
                      </Link>
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-4 bg-red-500/20 border border-red-400 rounded-lg"
                      role="alert"
                      aria-live="assertive"
                    >
                      <p className="text-sm text-white">{error}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !gdprConsent}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Odesílám...' : 'Přidat na waitlist'}
                    {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                  </button>

                  <p className="text-sm text-primary-200 mt-4 text-center">
                    Žádný spam, jen informace o nových termínech.
                  </p>
                </form>
              )}
            </>
          ) : (
            <div className="text-center">
              <Calendar className="w-16 h-16 text-primary-200 mx-auto mb-6" />
              <h2 className="heading-2 text-white mb-4">
                Zaregistrujte své dítě ještě dnes
              </h2>
              <p className="text-xl text-white/90 mb-8">
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
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
