'use client'

import { motion } from 'framer-motion'
import { Users, ShieldCheck, Phone, Heart, MapPin, Clock } from 'lucide-react'
import Image from 'next/image'
import { useLocation } from '@/contexts/LocationContext'

const defaultSafetyFeatures = [
  { icon: ShieldCheck, title: 'Pojištění účastníků', description: 'Komplexní pojištění' },
  { icon: Users, title: 'Malé skupiny', description: '1 lektor na 5 dětí' },
  { icon: Phone, title: 'Okamžitý kontakt', description: 'Rodič vždy informován' },
  { icon: Heart, title: 'Proškolení lektoři', description: 'Certifikace DDM' },
]

const safetyIcons = [ShieldCheck, Users, Phone, Heart]

export function TrustSection() {
  const location = useLocation()

  const safetyItems = location.safetyFeatures
    ? location.safetyFeatures.map((f, i) => ({ ...f, icon: safetyIcons[i] }))
    : defaultSafetyFeatures

  // Non-DDM locations (KV) need a separate organizer card alongside venue cards
  const showOrganizerCard = location.registrationType !== 'ddm'
  const totalCards = location.venues.length + (showOrganizerCard ? 1 : 0)

  return (
    <section id="o-nas" className="section-padding bg-paper-soft border-y border-ink/15">
      <div className="section-container">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mono-label mb-4"
          >
            Proč nám důvěřovat
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-2 text-ink mb-4"
          >
            Kdo za Weeks
            <span className="text-primary-600"> stojí</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-ink-500"
          >
            Weeks je projekt organizovaný {location.organizer.name}, který probíhá {location.venues.length === 1 ? 'v lokalitě' : 've'} {location.venues.map(v => v.name).join(' a ')}.
          </motion.p>
        </div>

        {/* Partners Grid */}
        <div className={`grid gap-6 mb-12 ${totalCards > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Venue Cards */}
          {location.venues.map((venue, index) => (
            <motion.div
              key={venue.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={venue.name.includes('HWLab')
                ? 'group relative border border-ink rounded-md overflow-hidden shadow-hard'
                : 'group relative bg-white border border-ink/15 rounded-md p-8 overflow-hidden'
              }
            >
              {venue.name.includes('HWLab') ? (
                <>
                  <div className="absolute inset-0">
                    <Image
                      src="/images/trust-hwlab.webp"
                      alt={`${venue.fullName}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
                  </div>
                  <div className="relative z-10 p-8 h-full flex flex-col justify-end min-h-[320px]">
                    <p className="mono-label-dark mb-3">Místo konání</p>
                    <h3 className="font-display text-2xl font-bold text-paper mb-3">
                      {venue.name}
                    </h3>
                    <p className="text-paper/80 leading-relaxed mb-4">
                      {venue.description}
                    </p>
                    <div className="flex items-center gap-2 font-mono text-xs text-paper/70">
                      <MapPin className="w-4 h-4" />
                      {venue.address}, {venue.city}
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative z-10">
                  <p className="mono-label mb-4">
                    {location.registrationType === 'ddm' ? 'Organizátor' : 'Místo konání'}
                  </p>
                  <div className="w-16 h-16 bg-primary-600 border border-ink rounded-sm flex items-center justify-center mb-6">
                    <span className="text-xl font-bold font-mono text-white">{venue.name.substring(0, 3).toUpperCase()}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink mb-3">
                    {venue.name}
                  </h3>
                  <p className="text-ink-500 leading-relaxed mb-4">
                    {venue.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary-600 font-medium mb-2">
                    <Clock className="w-4 h-4" />
                    {venue.name.includes('DDM') ? '70+ let zkušeností' : 'Moderní vybavení'}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-ink-500">
                    <MapPin className="w-4 h-4" />
                    {venue.address}, {venue.city}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Organizer Card (non-DDM locations like KV) */}
          {showOrganizerCard && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative bg-white border border-ink/15 rounded-md p-8 overflow-hidden"
            >
              <div className="relative z-10">
                <p className="mono-label mb-4">Organizátor</p>
                <div className="h-16 mb-6 flex items-center">
                  {location.organizer.logoUrl ? (
                    <Image
                      src={location.organizer.logoUrl}
                      alt={location.organizer.name}
                      width={160}
                      height={64}
                      className="object-contain object-left h-full w-auto"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-accent-500 border border-ink rounded-sm flex items-center justify-center">
                      <span className="text-xl font-bold font-mono text-white">{location.organizer.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-display text-2xl font-bold text-ink mb-3">
                  {location.organizer.name}
                </h3>
                <p className="text-ink-500 leading-relaxed mb-4">
                  {location.usps.organizer.description}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Safety Section — technický štítek */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-ink rounded-md bg-white overflow-hidden"
        >
          <div className="p-8 md:p-10 border-b border-ink/15">
            <p className="mono-label mb-3">Bezpečnost</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink mb-3">
              Bezpečnost dětí je naší prioritou
            </h3>
            <p className="text-ink-500 max-w-2xl">
              Všichni instruktoři mají ověřené reference a prošli školením {location.organizer.name}.
              Dodržujeme přísné bezpečnostní protokoly.
            </p>
          </div>

          {/* Joined-cell grid */}
          <div className="grid grid-cols-2 md:grid-cols-4">
            {safetyItems.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-6 border-t border-ink/15 [&:nth-child(even)]:border-l md:[&:not(:first-child)]:border-l"
              >
                <feature.icon className="w-6 h-6 text-trust-600 mb-3" aria-hidden="true" />
                <h4 className="font-display font-semibold text-ink text-sm mb-1">
                  {feature.title}
                </h4>
                <p className="font-mono text-xs text-ink-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
