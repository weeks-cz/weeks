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
    <section id="o-nas" className="section-padding bg-white relative overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-trust-50 rounded-full text-sm font-medium text-trust-700 mb-6"
          >
            <ShieldCheck className="w-4 h-4" />
            Proč nám důvěřovat
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Kdo za Weeks
            <span className="text-gradient"> stojí</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Weeks je projekt organizovaný {location.organizer.name}, který probíhá {location.venues.length === 1 ? 'v lokalitě' : 've'} {location.venues.map(v => v.name).join(' a ')}.
          </motion.p>
        </div>

        {/* Partners Grid */}
        <div className={`grid gap-8 mb-16 ${totalCards > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Venue Cards */}
          {location.venues.map((venue, index) => (
            <motion.div
              key={venue.name}
              initial={{ opacity: 0, x: index === 0 && totalCards > 1 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={venue.name.includes('HWLab') ?
                'group relative rounded-2xl overflow-hidden' :
                'group relative bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 border border-primary-100 overflow-hidden'
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
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/40" />
                  </div>
                  <div className="relative z-10 p-8 h-full flex flex-col justify-end min-h-[320px]">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                      <span className="text-2xl font-bold text-white">HW</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white mb-3">
                      {venue.name}
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {venue.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
                      <MapPin className="w-4 h-4" />
                      {venue.address}, {venue.city}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 rounded-full text-xs font-semibold text-primary-700 mb-4">
                      {location.registrationType === 'ddm' ? 'Organizátor' : 'Místo konání'}
                    </div>
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <span className="text-2xl font-bold text-primary-600">{venue.name.substring(0, 3).toUpperCase()}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">
                      {venue.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {venue.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary-600 font-medium mb-2">
                      <Clock className="w-4 h-4" />
                      {venue.name.includes('DDM') ? '70+ let zkušeností' : 'Moderní vybavení'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary-600 font-medium">
                      <MapPin className="w-4 h-4" />
                      {venue.address}, {venue.city}
                    </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-100 rounded-full opacity-50" />
                </>
              )}
            </motion.div>
          ))}

          {/* Organizer Card (non-DDM locations like KV) */}
          {showOrganizerCard && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-accent-50 to-white rounded-2xl p-8 border border-accent-100 overflow-hidden"
            >
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-100 rounded-full text-xs font-semibold text-accent-700 mb-4">
                  Organizátor
                </div>
                <div className="h-16 mb-6 flex items-center group-hover:scale-105 transition-transform origin-left">
                  {location.organizer.logoUrl ? (
                    <Image
                      src={location.organizer.logoUrl}
                      alt={location.organizer.name}
                      width={160}
                      height={64}
                      className="object-contain object-left h-full w-auto"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent-600">{location.organizer.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">
                  {location.organizer.name}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {location.usps.organizer.description}
                </p>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-accent-100 rounded-full opacity-50" />
            </motion.div>
          )}
        </div>

        {/* Safety Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0">
            <Image
              src="/images/trust-safety.webp"
              alt="Celkový přehled učebny s vybavením"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-trust-900/90 backdrop-blur-sm" />
          </div>

          <div className="relative z-10 p-8 md:p-12">
            <div className="text-center mb-10">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                Bezpečnost dětí je naší prioritou
              </h3>
              <p className="text-trust-100 max-w-2xl mx-auto">
                Všichni instruktoři mají ověřené reference a prošli školením {location.organizer.name}.
                Dodržujeme přísné bezpečnostní protokoly.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {safetyItems.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-trust-500/20 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-trust-300" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-trust-200">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
