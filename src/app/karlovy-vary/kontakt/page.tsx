'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLocation } from '@/contexts/LocationContext'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function KVKontakt() {
  const location = useLocation()
  const venue = location.venues[0]

  return (
    <>
      <Header />
      <main className="pt-20 bg-night">
        <section className="section-padding bg-night">
          <div className="section-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h1 className="heading-1 text-white mb-4">Kontakt — {location.name}</h1>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Máte dotazy ohledně IT táborů v {location.name === 'Karlovy Vary' ? 'Karlových Varech' : location.name}? Rádi vám pomůžeme.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Contact info */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <div className="card-glow rounded-2xl p-8 space-y-6">
                  <h2 className="text-xl font-semibold text-white">Spojte se s námi</h2>
                  <div className="space-y-4">
                    <a href={`mailto:${location.contact.email}`} className="flex items-center gap-3 text-slate-300 hover:text-accent-400 transition-colors">
                      <Mail className="w-5 h-5 text-accent-400" />
                      <span className="font-mono text-sm uppercase tracking-wide">{location.contact.email}</span>
                    </a>
                    <a href={`tel:${location.contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-slate-300 hover:text-accent-400 transition-colors">
                      <Phone className="w-5 h-5 text-accent-400" />
                      <span className="font-mono text-sm uppercase tracking-wide">{location.contact.phone}</span>
                    </a>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="font-medium text-white mb-2 data-label">ORGANIZÁTOR</h3>
                    <p className="text-slate-300">{location.organizer.fullName}</p>
                  </div>
                </div>
              </motion.div>

              {/* Venue card */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="card-glow rounded-2xl p-8 space-y-4">
                  <h2 className="text-xl font-semibold text-white">Místo konání</h2>
                  <div>
                    <h3 className="font-medium text-white">{venue.name}</h3>
                    <p className="text-sm text-slate-400">{venue.fullName}</p>
                  </div>
                  <div className="flex items-start gap-3 text-slate-300">
                    <MapPin className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wide mb-2">ADRESA</p>
                      <p>{venue.address}</p>
                      <p>{venue.city}, {venue.postalCode}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">{venue.description}</p>
                  {venue.url && (
                    <a href={venue.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 text-sm font-medium">
                      <ExternalLink className="w-4 h-4" />
                      {venue.url.replace('https://', '')}
                    </a>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-4xl mx-auto mt-8"
            >
              <div className="rounded-lg overflow-hidden border border-white/10 shadow-glow">
                <iframe
                  title={`Mapa – ${venue.name}`}
                  src={`https://maps.google.com/maps?q=${venue.mapQuery ?? encodeURIComponent(`${venue.address}, ${venue.city}`)}&output=embed&z=16`}
                  width="100%"
                  height="380"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block"
                />
              </div>
              <p className="text-center text-sm text-slate-400 mt-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${venue.mapQuery ?? encodeURIComponent(`${venue.address}, ${venue.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-400 hover:underline"
                >
                  Otevřít v Google Maps
                </a>
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
