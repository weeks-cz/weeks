'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { trackViewTerms } from '@/lib/analytics'
import { useLocation } from '@/contexts/LocationContext'

export function HeroSection() {
  const location = useLocation()
  // Věk bereme z configu lokace (Praha 10–15, KV 9–15), ne natvrdo.
  const ageLabel = (location.programs[0]?.ageRange ?? '10-15').replace('-', '–')
  const venue = location.venues[0]

  return (
    <section className="relative bg-paper blueprint-grid border-b border-ink/15 overflow-hidden">
      <div className="section-container grid lg:grid-cols-12 gap-12 lg:gap-10 items-center pt-32 pb-16 md:pt-40 md:pb-24">
        {/* Text column */}
        <div className="lg:col-span-7">
          {/* Mono kóta */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mono-label mb-6"
          >
            {location.hero.badge} · Registrace otevřena
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-1 text-ink mb-6"
          >
            IT tábory,
            <br />
            <span className="text-primary-600">kde děti tvoří budoucnost</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-ink-500 mb-10 max-w-xl leading-relaxed"
          >
            {location.hero.subtitle} Profesionální vybavení,
            zkušení instruktoři a projekty, které si Vaše dítě odnese domů.
            <span className="text-ink font-medium"> Pro děti {ageLabel} let.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="#prihlasit"
              className="btn-primary group px-8 py-4"
              onClick={() => trackViewTerms('homepage_hero')}
            >
              Vybrat termín
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#program"
              className="btn-outline group px-8 py-4"
            >
              <Play className="mr-2 w-5 h-5" />
              Co děti čeká
            </Link>
          </motion.div>

          {/* Trust row — mono spec line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-14 pt-6 border-t border-ink/15"
          >
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="mono-label mb-1">Organizátor</dt>
                <dd className="text-sm font-medium text-ink flex items-center gap-2">
                  {location.organizer.logoUrl && (
                    <Image
                      src={location.organizer.logoUrl}
                      alt=""
                      width={20}
                      height={20}
                      className="object-contain w-5 h-5"
                      aria-hidden="true"
                    />
                  )}
                  {location.organizer.name}
                </dd>
              </div>
              <div>
                <dt className="mono-label mb-1">Místa konání</dt>
                <dd className="text-sm font-medium text-ink">
                  {location.venues.map(v => v.name).join(' & ')}
                </dd>
              </div>
              <div>
                <dt className="mono-label mb-1">Věková skupina</dt>
                <dd className="text-sm font-medium text-ink font-mono">{ageLabel} let</dd>
              </div>
            </dl>
          </motion.div>
        </div>

        {/* Photo column — framed, with mono tag */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative border border-ink rounded-md overflow-hidden shadow-hard bg-white">
            <Image
              src={location.isDefault ? '/images/hwlab/hwlab-7976.webp' : '/images/program-mix.webp'}
              alt={location.isDefault
                ? 'HWLab — učebna s počítači a 3D tiskárnami'
                : `FabLab VARY&TE — IT tábor v ${location.name}`}
              width={880}
              height={660}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover w-full aspect-[4/3]"
              priority
              quality={75}
            />
          </div>
          <p className="mono-label mt-4 text-right" aria-hidden="true">
            {venue.name} — {venue.city}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
