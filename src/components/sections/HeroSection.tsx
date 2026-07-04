'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { trackViewTerms } from '@/lib/analytics'
import { useLocation } from '@/contexts/LocationContext'
import { AuroraGlow } from '@/components/effects/AuroraGlow'
import { MagneticButton } from '@/components/effects/MagneticButton'

export function HeroSection() {
  const location = useLocation()
  const ageLabel = (location.programs[0]?.ageRange ?? '10-15').replace('-', '–')

  return (
    <section className="relative bg-night noise overflow-hidden min-h-screen flex items-center pt-32 pb-24">
      {/* Aurora Glow Background */}
      <AuroraGlow />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Kicker Label */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="data-label"
            >
              {location.hero.badge}
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-1"
            >
              IT tábory,
              <br />
              <span className="text-gradient">kde děti tvoří budoucnost</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-400 max-w-xl"
            >
              {location.hero.subtitle} Profesionální vybavení,
              zkušení instruktoři a projekty, které si Vaše dítě odnese domů.
              <span className="text-white font-medium"> Pro děti {ageLabel} let.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <MagneticButton>
                <Link
                  href="#prihlasit"
                  className="btn-primary inline-flex items-center justify-center px-8 py-4"
                  onClick={() => trackViewTerms('homepage_hero')}
                >
                  Vybrat termín
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </MagneticButton>
              <Link
                href="#program"
                className="btn-outline inline-flex items-center justify-center px-8 py-4"
              >
                <Play className="mr-2 w-5 h-5" />
                Co děti čeká
              </Link>
            </motion.div>

            {/* Trust Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row gap-6"
            >
              <div className="flex items-center gap-3">
                {location.organizer.logoUrl ? (
                  <Image
                    src={location.organizer.logoUrl}
                    alt={location.organizer.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">{location.organizer.name.split(' ')[0]}</span>
                  </div>
                )}
                <div>
                  <p className="data-label text-slate-500">Organizátor</p>
                  <p className="text-sm text-white">{location.organizer.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white shrink-0" />
                <div>
                  <p className="data-label text-slate-500">Místa konání</p>
                  <p className="text-sm text-white">{location.venues.map(v => v.name).join(' & ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-2 py-1 rounded bg-white/10 text-xs font-bold text-white shrink-0">{ageLabel}</div>
                <div>
                  <p className="data-label text-slate-500">Věková skupina</p>
                  <p className="text-sm text-white">let</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column (5 cols) - Photo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5 hidden lg:flex flex-col items-center"
          >
            <div className="w-full aspect-square rounded-lg border border-white/15 overflow-hidden shadow-glow">
              <Image
                src="/images/hwlab/hero-print-day.webp"
                alt="HWLab — IT tábor"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 0, (max-width: 1280px) 40vw, 35vw"
              />
            </div>
            <p className="font-mono text-sm text-slate-400 mt-4">HWLAB — PRAHA 6</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
