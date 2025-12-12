'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  // TODO: This will be controlled by Sanity CMS - waitlistMode setting
  const isWaitlistMode = true

  return (
    <section id="prihlasit" className="section-padding bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <Calendar className="w-16 h-16 text-primary-200 mx-auto mb-6" />

          {isWaitlistMode ? (
            <>
              <h2 className="heading-2 text-white mb-4">
                Termíny již brzy
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Připravujeme nové termíny táborů. Přidejte se na čekací listinu
                a budeme Vás informovat jako první.
              </p>
              {/* Waitlist Form */}
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Váš e-mail"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cta-500"
                  required
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Přidat se
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </form>
              <p className="text-sm text-primary-200 mt-4">
                Žádný spam, jen informace o nových termínech.
              </p>
            </>
          ) : (
            <>
              <h2 className="heading-2 text-white mb-4">
                Přihlaste své dítě
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Vyberte si termín a přihlaste se přes systém DDM Praha 6.
              </p>
              {/* TODO: Add date cards from Sanity */}
              <Link
                href="https://ddm-praha6.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg"
              >
                Zobrazit termíny a přihlásit se
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
