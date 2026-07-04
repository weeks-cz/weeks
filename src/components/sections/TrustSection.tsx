'use client'

import { motion } from 'framer-motion'
import { Users, ShieldCheck, Phone, Heart, MapPin } from 'lucide-react'
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
    <section id="o-nas" className="section-padding bg-night">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="paper-island p-8 md:p-12"
        >
          {/* Header */}
          <p className="data-label mb-6">03 / PARTNEŘI A ZÁZEMÍ</p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-2 text-night mb-4"
          >
            Kdo za Weeks stojí
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 mb-12 max-w-2xl"
          >
            Weeks je projekt organizovaný {location.organizer.name}, který probíhá {location.venues.length === 1 ? 'v lokalitě' : 've'} {location.venues.map(v => v.name).join(' a ')}.
          </motion.p>

          {/* Partners Grid */}
          <div className={`grid gap-8 mb-12 ${totalCards > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Venue Cards */}
            {location.venues.map((venue, index) => (
              <motion.div
                key={venue.name}
                initial={{ opacity: 0, x: index === 0 && totalCards > 1 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-xl overflow-hidden bg-gray-50 p-6 border border-gray-200"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/40" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-end min-h-[280px]">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4 border border-white/20">
                        <span className="text-lg font-bold text-white">HW</span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-white mb-2">
                        {venue.name}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        {venue.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/80">
                        <MapPin className="w-3 h-3" />
                        {venue.address}, {venue.city}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-display text-lg font-bold text-night mb-2">
                      {venue.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      {venue.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {venue.address}, {venue.city}
                    </div>
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
                className="relative rounded-xl overflow-hidden bg-gray-50 p-6 border border-gray-200"
              >
                <div className="h-12 mb-4 flex items-center">
                  {location.organizer.logoUrl ? (
                    <Image
                      src={location.organizer.logoUrl}
                      alt={location.organizer.name}
                      width={140}
                      height={48}
                      className="object-contain object-left h-full w-auto"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-base font-bold text-primary-600">{location.organizer.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-display text-lg font-bold text-night mb-2">
                  {location.organizer.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {location.usps.organizer.description}
                </p>
              </motion.div>
            )}
          </div>

          {/* Safety Features */}
          <div className="border-t border-gray-200 pt-12">
            <h3 className="font-display text-lg font-bold text-night mb-8">
              Bezpečnost a expertise
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {safetyItems.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <feature.icon className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <h4 className="font-semibold text-night text-sm">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-slate-600 mt-6">
              Všichni instruktoři mají ověřené reference a prošli školením {location.organizer.name}.
              Dodržujeme přísné bezpečnostní protokoly.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
