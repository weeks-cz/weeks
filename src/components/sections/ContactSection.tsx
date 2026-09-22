'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Building2 } from 'lucide-react'
import Link from 'next/link'
import { trackLead } from '@/lib/fbpixel'
import { SITE } from '@/lib/site'

export function ContactSection() {
  const [email, setEmail] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, program: 'nevim', gdprConsent }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Něco se pokazilo')
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
    // Amber závěr stránky v roli „akce a stav". Sekce se neruší ani nekrátí:
    // její e-mailový formulář se souhlasem GDPR je jediný sběr kontaktů na
    // úvodce, takže se sem jen přestěhoval pod výraznější blok.
    <section
      id="kontakt"
      className="section-padding relative overflow-hidden border-y border-ink bg-cta-400"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-10 select-none font-display text-[22rem] font-bold leading-none text-ink/[0.06]"
      >
        W
      </div>
      <div className="section-container relative z-10">
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <p className="mono-label mb-4 text-ink/60">Kontakt</p>
          <h2 className="heading-2 text-ink mb-4">Chcete být u toho, až turnusy otevřeme?</h2>
          <p className="text-xl text-ink/80 mb-12">
            Na jeden turnus bereme jen hrstku dětí. Nechte nám kontakt a ozveme
            se vám dřív, než se termíny objeví na webu.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white border border-ink rounded-sm flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-ink" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="mono-label mb-1 text-ink/60">E-mail</h3>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="font-mono text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                  >
                    {SITE.email}
                  </a>
                  <p className="text-sm text-ink/70 mt-1">
                    Ozveme se co nejdříve
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white border border-ink rounded-sm flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-ink" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="mono-label mb-1 text-ink/60">Telefon</h3>
                  <a
                    href={`tel:${SITE.phone.replace(/\s+/g, '')}`}
                    className="font-mono text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                  >
                    {SITE.phone}
                  </a>
                  <p className="text-sm text-ink/70 mt-1">
                    Ozveme se co nejdříve
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white border border-ink rounded-sm flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-ink" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="mono-label mb-1 text-ink/60">Provozovatel</h3>
                  <p className="text-ink">
                    {SITE.legalName}<br />
                    <span className="text-sm text-ink/70">
                      IČO {SITE.ico} · {SITE.address}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Kde tábory probíhají — místo se liší podle turnusu, adresa proto
                patří na /tabory, ne sem jako pevný text. */}
            <div className="space-y-6">
              <Link href="/tabory" className="group block rounded-md border border-ink bg-white p-5 transition-shadow hover:shadow-hard">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-ink border border-ink rounded-sm flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-semibold text-ink text-sm">Kde tábory probíhají</h3>
                </div>
                <p className="text-sm text-ink-500 leading-relaxed">
                  Místo konání se liší podle turnusu a města. Přesnou adresu najdete u vybraného turnusu.
                </p>
                <p className="text-xs text-ink mt-2 underline decoration-ink/30 underline-offset-4 group-hover:decoration-ink">
                  Zobrazit turnusy →
                </p>
              </Link>
            </div>
          </div>

          {/* Email signup */}
          <div className="mt-12 pt-8 border-t border-ink/20">
            <div className="max-w-xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-ink" aria-hidden="true" />
                <h3 className="font-display font-semibold text-ink">Nechte nám email</h3>
              </div>
              <p className="text-ink/70 text-sm mb-6">
                Dáme vám vědět o nových termínech a volných místech.
              </p>

              {isSubmitted ? (
                <div className="flex items-center justify-center gap-2 py-4" role="status" aria-live="polite">
                  <div className="w-8 h-8 bg-trust-500 rounded-sm flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-ink font-medium">Děkujeme! O termínech se dozvíte jako první.</p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label htmlFor="contact-email" className="sr-only">
                      E-mail
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="váš@email.cz"
                      className="flex-1 px-4 py-3 rounded-md bg-white border border-ink text-ink placeholder:text-ink/40 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ink"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !gdprConsent || !email.trim()}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isSubmitting ? 'Odesílám...' : 'Dát mi vědět'}
                    </button>
                  </div>
                  <div className="flex items-start gap-2 justify-center">
                    <input
                      type="checkbox"
                      id="contact-gdpr"
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded-sm border-ink text-ink focus:ring-ink"
                      required
                    />
                    <label htmlFor="contact-gdpr" className="text-xs text-ink/70 cursor-pointer text-left">
                      Souhlasím se zpracováním osobních údajů.{' '}
                      <Link href="/gdpr" className="underline hover:text-ink">
                        Více informací
                      </Link>
                    </label>
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-300 rounded-md" role="alert">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
