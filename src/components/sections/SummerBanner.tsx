'use client'

import { motion } from 'framer-motion'
import { Sun, ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'

export function SummerBanner() {
  return (
    <section className="bg-gradient-to-r from-cta-500 via-cta-400 to-cta-500 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>

      <div className="section-container relative z-10 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8"
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="hidden md:flex w-12 h-12 rounded-xl bg-gray-900/10 items-center justify-center flex-shrink-0">
              <Sun className="w-6 h-6 text-gray-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                <Sun className="w-4 h-4 text-gray-900 md:hidden" />
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  Letní IT tábory 2026
                </h3>
                <span className="px-2 py-0.5 bg-gray-900/10 rounded-full text-xs font-semibold text-gray-900">
                  Nově
                </span>
              </div>
              <p className="text-sm text-gray-900/70">
                Spustili jsme nezávazné registrace na letní víkendové tábory.
                <span className="hidden sm:inline"> Vyberte si termíny červenec – srpen a my se vám ozveme.</span>
              </p>
            </div>
          </div>

          <Link
            href="/tabor-chytrych-technologii#leto"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl whitespace-nowrap flex-shrink-0"
          >
            <Calendar className="w-4 h-4" />
            Vybrat termíny
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
