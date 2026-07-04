'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { trackLead } from '@/lib/fbpixel'
import { useLocation } from '@/contexts/LocationContext'
import { buildPath } from '@/lib/locations'

export function ContactSection() {
  const location = useLocation()
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
    <section id="kontakt" className="section-padding bg-night">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info - Left */}
            <div>
              <p className="data-label mb-4">07 / KONTAKT</p>
              <h2 className="heading-2 mb-8">
                Kontaktujte <span className="text-gradient">nás</span>
              </h2>

              <div className="space-y-8">
                <div>
                  <p className="font-mono text-xs text-slate-300 mb-2">E-MAIL</p>
                  <a
                    href={`mailto:${location.contact.email}`}
                    className="text-accent-400 hover:text-accent-300 transition-colors block"
                  >
                    {location.contact.email}
                  </a>
                  <p className="text-xs text-slate-500 mt-2">
                    Odpovídáme do 24 hodin (pracovní dny)
                  </p>
                </div>

                <div>
                  <p className="font-mono text-xs text-slate-300 mb-2">TEL</p>
                  <a
                    href={`tel:${location.contact.phone.replace(/\s+/g, '')}`}
                    className="text-accent-400 hover:text-accent-300 transition-colors block"
                  >
                    {location.contact.phone}
                  </a>
                  <p className="text-xs text-slate-500 mt-2">
                    Po-Pá 9:00-17:00
                  </p>
                </div>

                <div>
                  <p className="font-mono text-xs text-slate-300 mb-2">ADRESA</p>
                  <p className="text-slate-400 text-sm">
                    {location.organizer.name}<br />
                    <span className="text-xs text-slate-500">
                      {location.organizer.fullName}
                    </span>
                  </p>
                </div>

                {/* Venue cards */}
                <div className={`grid gap-4 pt-4 ${location.venues.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {location.venues.map((venue) => (
                    <a
                      key={venue.name}
                      href={`https://maps.google.com/?q=${encodeURIComponent(venue.mapQuery || `${venue.fullName},+${venue.address},+${venue.city}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 card-glow"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-accent-400 flex-shrink-0" />
                        <h3 className="font-display font-semibold text-white text-sm">{venue.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {venue.fullName}<br />
                        {venue.address}, {venue.city}
                      </p>
                      {venue.transport && (
                        <p className="text-xs text-slate-500 mt-2">
                          {venue.transport}
                        </p>
                      )}
                      <p className="text-xs text-accent-400/70 mt-2 group-hover:text-accent-400">
                        Zobrazit na mapě →
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form - Right */}
            <div>
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-white">Napište nám</h3>
                <p className="text-slate-400 text-sm">
                  Máte dotaz, který není v FAQ? Rádi vám pomůžeme.
                </p>
              </div>

              <div className="mt-8">
                {isSubmitted ? (
                  <div className="flex items-center justify-start gap-3 py-6" role="status" aria-live="polite">
                    <div className="w-8 h-8 bg-trust-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-white font-medium">Děkujeme! O novinkách se dozvíte jako první.</p>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="váš@email.cz"
                        className="w-full bg-night border border-white/15 text-white placeholder:text-slate-500 rounded-lg focus:border-accent-400 focus:ring-1 focus:ring-accent-400 px-4 py-3 text-sm"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !gdprConsent || !email.trim()}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Odesílám...' : 'Odeslat'}
                    </button>
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="contact-gdpr"
                        checked={gdprConsent}
                        onChange={(e) => setGdprConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-white/30 bg-white/10 text-cta-500 focus:ring-cta-500 focus:ring-offset-0"
                        required
                      />
                      <label htmlFor="contact-gdpr" className="text-xs text-slate-400 cursor-pointer">
                        Souhlasím se zpracováním osobních údajů.{' '}
                        <Link href={buildPath(location, 'gdpr')} className="text-accent-400 hover:text-accent-300">
                          Více informací
                        </Link>
                      </label>
                    </div>
                    {error && (
                      <div className="p-3 bg-red-500/20 border border-red-400 rounded-lg" role="alert">
                        <p className="text-sm text-white">{error}</p>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
