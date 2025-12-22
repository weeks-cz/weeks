'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hwlab/hwlab-7962.webp"
          alt="HWLab - profesionální dílna"
          fill
          sizes="100vw"
          className="object-cover"
          priority
          quality={90}
        />
        {/* Stronger gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-gray-900/30" />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium mb-8 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-cta-400" />
            <span>Nově v Praze!</span>
            <span className="w-px h-4 bg-white/30" />
            <span className="text-cta-400">Registrace otevřena</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
          >
            Víkendové IT kempy,
            <br />
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
              kde děti tvoří budoucnost
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed"
          >
            Každou sobotu a neděli v Kongresovém centru Praha. Profesionální vybavení,
            zkušení instruktoři a projekty, které si Vaše dítě odnese domů.
            <span className="text-white font-medium"> Pro děti 10–15 let.</span>
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
              className="group inline-flex items-center justify-center px-8 py-4 bg-cta-500 hover:bg-cta-400 text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-cta-500/30 hover:-translate-y-0.5"
            >
              Přejít na registraci
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#program"
              className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 transition-all duration-300"
            >
              <Play className="mr-2 w-5 h-5" />
              Co děti čeká
            </Link>
          </motion.div>

          {/* Trust badges - simplified */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 pt-8 pb-4 border-t border-white/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">DDM</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Pod záštitou</p>
                  <p className="text-sm font-medium text-white truncate">DDM Praha 6</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">KCP</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Místo konání</p>
                  <p className="text-sm font-medium text-white truncate">Kongresové centrum</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-500/20 backdrop-blur-sm border border-primary-400/30">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-primary-500/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">10–15</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Věková skupina</p>
                  <p className="text-sm font-medium text-white">let</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}
