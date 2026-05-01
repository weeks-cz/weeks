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
    <section id="kontakt" className="section-padding bg-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="heading-2 text-gray-900 mb-4 text-center">
            Kontaktujte <span className="text-gradient">nás</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Máte dotaz, který není v FAQ? Rádi vám pomůžeme.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
                  <a
                    href={`mailto:${location.contact.email}`}
                    className="text-primary-600 hover:underline"
                  >
                    {location.contact.email}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Odpovídáme do 24 hodin (pracovní dny)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                  <a
                    href={`tel:${location.contact.phone.replace(/\s+/g, '')}`}
                    className="text-primary-600 hover:underline"
                  >
                    {location.contact.phone}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Po-Pá 9:00-17:00
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Organizátor</h3>
                  <p className="text-gray-600">
                    {location.organizer.name}<br />
                    <span className="text-sm text-gray-500">
                      {location.organizer.fullName}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Venues */}
            <div className="space-y-6">
              {/* Venue cards */}
              <div className={`grid gap-4 ${location.venues.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {location.venues.map((venue) => (
                  <a
                    key={venue.name}
                    href={`https://maps.google.com/?q=${encodeURIComponent(venue.mapQuery || `${venue.fullName},+${venue.address},+${venue.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">{venue.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {venue.fullName}<br />
                      {venue.address}, {venue.city}
                    </p>
                    {venue.transport && (
                      <p className="text-xs text-gray-500 mt-2">
                        {venue.transport}
                      </p>
                    )}
                    <p className="text-xs text-primary-600 mt-2 group-hover:underline">
                      Zobrazit na mapě →
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Email signup */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="max-w-xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-gray-900">Nechte nám email</h3>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Dáme vám vědět o nových termínech a volných místech.
              </p>

              {isSubmitted ? (
                <div className="flex items-center justify-center gap-2 py-4" role="status" aria-live="polite">
                  <div className="w-8 h-8 bg-trust-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-medium">Děkujeme! O novinkách se dozvíte jako první.</p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="váš@email.cz"
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  <div className="flex items-start gap-2 justify-center">
                    <input
                      type="checkbox"
                      id="contact-gdpr"
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      required
                    />
                    <label htmlFor="contact-gdpr" className="text-xs text-gray-500 cursor-pointer text-left">
                      Souhlasím se zpracováním osobních údajů.{' '}
                      <Link href={buildPath(location, 'gdpr')} className="underline hover:text-primary-600">
                        Více informací
                      </Link>
                    </label>
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
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
