'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Cpu, Printer, ShieldCheck } from 'lucide-react'
import { useLocation } from '@/contexts/LocationContext'

// Ukázka skutečného místa konání — FabLab Kreativního centra VARY&TE.
// Fotky z varyete.cz (partner). Dělá z "místa" hmatatelný, důvěryhodný prostor.
const features = [
  { icon: Printer, text: 'Profesionální 3D tiskárny, VR a Arduino soupravy' },
  { icon: Cpu, text: 'Plně vybavený FabLab — vše potřebné na místě' },
  { icon: ShieldCheck, text: 'Bezpečné, moderní prostředí pod dohledem lektorů' },
]

export function VenueShowcase() {
  const location = useLocation()
  const venue = location.venues[0]

  return (
    <section className="section-padding bg-night overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white/90 rounded-full text-sm font-medium mb-5 border border-white/15">
              <MapPin className="w-4 h-4 text-accent-400" />
              Kde to probíhá
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
              FabLab Kreativního centra{' '}
              <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                VARY&amp;TE
              </span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Tábory probíhají v{' '}{venue.name} — největším kreativním centru
              v{' '}Karlovarském kraji. Děti tvoří v{' '}profesionálně vybaveném
              prostoru, jaký by doma ani ve škole nenašly.
            </p>
            <ul className="space-y-4">
              {features.map((f) => (
                <li key={f.text} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-accent-400" />
                  </div>
                  <span className="text-slate-300 pt-1.5">{f.text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              {venue.address}, {venue.city}
            </p>
          </motion.div>

          {/* Photos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            <div className="relative col-span-2 aspect-[16/9] rounded-lg overflow-hidden border border-white/10 hover:border-accent-400/60 transition-all duration-300 hover:shadow-glow">
              <Image src="/images/varyete/fablab-1.avif" alt="FabLab VARY&TE — práce s 3D tiskem" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-accent-400/60 transition-all duration-300 hover:shadow-glow">
              <Image src="/images/varyete/fablab-5.avif" alt="Pracoviště ve FabLabu VARY&TE" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-accent-400/60 transition-all duration-300 hover:shadow-glow">
              <Image src="/images/varyete/fablab-6.avif" alt="Tvoření ve FabLabu VARY&TE" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
