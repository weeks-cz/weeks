'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'

export function SummerBanner() {
  return (
    <section className="bg-cta-500 border-b border-ink relative overflow-hidden">
      <div className="section-container relative z-10 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8"
        >
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/70">
                Léto 2026
              </span>
              <span className="px-2 py-0.5 border border-ink rounded-sm font-mono text-xs font-medium text-ink">
                Nově
              </span>
            </div>
            <h3 className="font-display text-lg md:text-xl font-bold text-ink">
              Letní IT tábory 2026
            </h3>
            <p className="text-sm text-ink/70">
              Spustili jsme nezávazné registrace na letní víkendové tábory.
              <span className="hidden sm:inline"> Vyberte si termíny červenec – srpen a my se vám ozveme.</span>
            </p>
          </div>

          <Link
            href="/tabor-chytrych-technologii#leto"
            className="btn-secondary group whitespace-nowrap flex-shrink-0"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Vybrat termíny
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
