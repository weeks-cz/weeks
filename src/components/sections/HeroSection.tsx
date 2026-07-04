'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { trackViewTerms } from '@/lib/analytics'
import { useLocation } from '@/contexts/LocationContext'
import { fadeUpSpring, staggerContainer } from '@/lib/motion'

export function HeroSection() {
  const location = useLocation()
  const ageLabel = (location.programs[0]?.ageRange ?? '10-15').replace('-', '–')

  return (
    <section className="relative mesh-bg overflow-hidden pt-32 pb-24">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7"
          >
            {/* Eyebrow badge */}
            <motion.p variants={fadeUpSpring} className="eyebrow mb-4">
              {location.hero.badge}
            </motion.p>

            {/* Heading with italic accent */}
            <motion.h1 variants={fadeUpSpring} className="heading-1 mb-6">
              IT tábory,
              <br />
              <span className="font-display italic text-primary-600">kde děti tvoří</span> budoucnost
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeUpSpring} className="text-xl text-slate-600 max-w-xl mb-10 leading-relaxed">
              {location.hero.subtitle} Profesionální vybavení, zkušení instruktoři a projekty, které si Vaše dítě
              odnese domů.
              <span className="text-slate-900 font-medium"> Pro děti {ageLabel} let.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUpSpring} className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="#prihlasit"
                className="btn-primary"
                onClick={() => trackViewTerms('homepage_hero')}
              >
                Vybrat termín
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="#program" className="btn-outline">
                <Play className="mr-2 w-5 h-5" />
                Co děti čeká
              </Link>
            </motion.div>

            {/* Trust chips */}
            <motion.div variants={fadeUpSpring} className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft text-sm font-medium text-slate-700">
                <div className="w-6 h-6 rounded bg-primary-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {location.organizer.logoUrl ? (
                    <Image
                      src={location.organizer.logoUrl}
                      alt={location.organizer.name}
                      width={24}
                      height={24}
                      className="object-contain w-5 h-5"
                    />
                  ) : (
                    <span className="text-xs font-bold text-primary-600">{location.organizer.name.split(' ')[0][0]}</span>
                  )}
                </div>
                <span>{location.organizer.name}</span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft text-sm font-medium text-slate-700">
                <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <span>{location.venues.map(v => v.name).join(' & ')}</span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft text-sm font-medium text-slate-700">
                <span className="font-semibold text-primary-600">{ageLabel}</span> let
              </div>
            </motion.div>
          </motion.div>

          {/* Right photo */}
          <motion.div
            variants={fadeUpSpring}
            className="lg:col-span-5 relative h-[400px] md:h-[500px] lg:h-[600px]"
          >
            {/* Hero photo with kenburns */}
            <div className="relative w-full h-full rounded-[2.5rem] shadow-soft-lg overflow-hidden kenburns">
              <Image
                src={location.isDefault ? '/images/hwlab/hero-print-day.webp' : '/images/program-mix.webp'}
                alt={location.isDefault
                  ? 'HWLab — učebna s počítači a 3D tiskárnami'
                  : `FabLab VARY&TE — IT tábor v ${location.name}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="object-cover"
                priority
                quality={85}
              />
            </div>

            {/* Floating mini-card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 90, damping: 16 }}
              className="glass rounded-2xl p-4 absolute -bottom-6 -left-6 max-w-xs"
            >
              <p className="eyebrow mb-1">HWLab · {location.name}</p>
              <p className="text-sm text-slate-700 leading-snug">
                Vybavená učebna s 3D tiskárnami, Arduino kity a vědeckými pokusy.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
