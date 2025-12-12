'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Nově v Praze! Registrace spuštěna
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-1 text-gray-900 mb-6"
          >
            Víkendové IT kempy,
            <br />
            <span className="text-gradient">kde děti tvoří budoucnost</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Každou sobotu a neděli na Vyšehradě. Profesionální vybavení, expert instruktoři
            a projekty, které si Vaše dítě odnese domů. Pro děti 10-15 let.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="#prihlasit" className="btn-primary text-lg px-8 py-4">
              Přejít na registraci
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="#program" className="btn-outline text-lg px-8 py-4">
              Co děti čeká
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-500"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">Pod záštitou</span>
              <span className="font-semibold text-gray-700">DDM Praha 6</span>
            </div>
            <div className="w-px h-6 bg-gray-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-sm">Místo konání</span>
              <span className="font-semibold text-gray-700">HWLab Vyšehrad</span>
            </div>
            <div className="w-px h-6 bg-gray-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-sm">Věk</span>
              <span className="font-semibold text-gray-700">10-15 let</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
