'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Cpu, Printer, ShieldCheck } from 'lucide-react'
import type { Venue } from '@/lib/cities'
import { MrizkaSekce } from '@/components/ui/MrizkaSekce'

// Obecné vlastnosti, které platí pro každé místo konání bez ohledu na to,
// kde zrovna je — konkrétní popis místa (název, text, fotky) dodává `venue`.
const features = [
  { icon: Printer, text: 'Profesionální 3D tiskárny a Arduino soupravy' },
  { icon: Cpu, text: 'Plně vybavený prostor — vše potřebné na místě' },
  { icon: ShieldCheck, text: 'Bezpečné, moderní prostředí pod dohledem lektorů' },
]

export function VenueShowcase({ venue }: { venue: Venue }) {
  const hasPhotos = (venue.photos?.length ?? 0) > 0

  // Poslední slovo plného názvu se v nadpisu zvýrazní barvou — funguje pro
  // libovolné místo, ne jen pro VARY&TE (viz `fullName` v `@/lib/cities`).
  const nadpisSlova = venue.fullName.split(' ')
  const zvyrazneneSlovo = nadpisSlova.pop()
  const zbytekNadpisu = nadpisSlova.join(' ')

  return (
    <MrizkaSekce odstin="tmavy" className="section-padding bg-ink text-paper blueprint-grid-dark border-y border-ink overflow-hidden">
      <div className="section-container">
        <div className={`grid gap-10 lg:gap-14 items-center ${hasPhotos ? 'lg:grid-cols-2' : ''}`}>
          {/* Text */}
          <motion.div
            initial={{ x: -20 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
          >
            <p className="mono-label-dark mb-4">Místo konání</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-paper mb-5 leading-tight">
              {zbytekNadpisu}{' '}
              <span className="text-accent-400">{zvyrazneneSlovo}</span>
            </h2>
            <p className="text-lg text-paper/80 mb-8 leading-relaxed">
              {venue.description}
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
              {venue.street}, {venue.city}
            </p>
          </motion.div>

          {/* Photos — jen když je má místo doopravdy k dispozici */}
          {hasPhotos && (
            <motion.div
              initial={{ x: 20 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {venue.photos!.map((src, i) => (
                <div
                  key={src}
                  className={`relative border border-ink rounded-md overflow-hidden shadow-hard ${
                    i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${venue.name} — fotografie prostoru ${i + 1}`}
                    fill
                    sizes={i === 0 ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
                    className="object-cover"
                  />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </MrizkaSekce>
  )
}
