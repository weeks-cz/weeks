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
    <section className="section-padding bg-ink text-paper blueprint-grid-dark border-y border-ink overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="mono-label-dark mb-4">Místo konání</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-paper mb-5 leading-tight">
              FabLab Kreativního centra{' '}
              <span className="text-accent-400">
                VARY&amp;TE
              </span>
            </h2>
            <p className="text-lg text-paper/80 mb-8 leading-relaxed">
              Tábory probíhají v{' '}{venue.name} — největším kreativním centru
              v{' '}Karlovarském kraji. Děti tvoří v{' '}profesionálně vybaveném
              prostoru, jaký by doma ani ve škole nenašly.
            </p>
            <ul className="space-y-4">
              {features.map((f) => (
                <li key={f.text} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-sm bg-white/10 border border-paper/20 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-accent-400" />
                  </div>
                  <span className="text-paper/80 pt-1.5">{f.text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-mono text-sm text-paper/60 flex items-center gap-2">
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
            <div className="relative col-span-2 aspect-[16/9] border border-ink rounded-md overflow-hidden shadow-hard">
              <Image src="/images/varyete/fablab-1.avif" alt="FabLab VARY&TE — práce s 3D tiskem" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="relative aspect-square border border-ink rounded-md overflow-hidden shadow-hard">
              <Image src="/images/varyete/fablab-5.avif" alt="Pracoviště ve FabLabu VARY&TE" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
            </div>
            <div className="relative aspect-square border border-ink rounded-md overflow-hidden shadow-hard">
              <Image src="/images/varyete/fablab-6.avif" alt="Tvoření ve FabLabu VARY&TE" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
