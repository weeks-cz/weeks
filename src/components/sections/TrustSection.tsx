'use client'

import { motion } from 'framer-motion'
import { Users, ShieldCheck, Phone, Heart } from 'lucide-react'

export function TrustSection() {
  return (
    <section id="o-nas" className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-2 text-gray-900 mb-4"
          >
            Důvěřujte <span className="text-gradient">odborníkům</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Weeks funguje pod záštitou zavedených institucí s dlouholetou tradicí.
          </motion.p>
        </div>

        {/* Partner logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16"
        >
          {/* DDM Praha 6 */}
          <div className="p-8 rounded-2xl bg-gray-50 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">DDM</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">DDM Praha 6</h3>
            <p className="text-gray-600 text-sm">
              Dům dětí a mládeže Praha 6 poskytuje osvětovou činnost již od roku 1953.
              Je zkušeným organizátorem kroužků, táborů a akcí pro tisíce dětí ročně.
              Garancí kvality, bezpečnosti a profesionálního přístupu.
            </p>
          </div>

          {/* HWLab */}
          <div className="p-8 rounded-2xl bg-gray-50 text-center">
            <div className="w-20 h-20 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent-600">HW</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">HWLab Praha</h3>
            <p className="text-gray-600 text-sm">
              Moderní technologické centrum na Vyšehradě vybavené nejnovějšími nástroji
              pro digitální výrobu a vývoj. Profesionální prostory s klimatizací,
              kuchyňkou a zázemím navržené pro komfortní a bezpečnou práci i učení.
            </p>
          </div>
        </motion.div>

        {/* Safety info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-trust-50 rounded-2xl p-8 max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-trust-800 mb-6 text-center">
            Bezpečnost dětí je naší prioritou
          </h3>
          <p className="text-trust-700 text-center mb-6 max-w-2xl mx-auto">
            Všichni instruktoři mají ověřené reference a prošli školením DDM Praha 6.
            Dodržujeme přísné bezpečnostní protokoly. Rodič má vždy k dispozici kontakt
            a v případě potřeby jej okamžitě informujeme.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center p-4">
              <ShieldCheck className="w-8 h-8 text-trust-600 mb-2" />
              <span className="text-sm font-medium text-trust-800">Pojištění účastníků</span>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Users className="w-8 h-8 text-trust-600 mb-2" />
              <span className="text-sm font-medium text-trust-800">1 lektor na 8 dětí</span>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Phone className="w-8 h-8 text-trust-600 mb-2" />
              <span className="text-sm font-medium text-trust-800">Okamžitý kontakt</span>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Heart className="w-8 h-8 text-trust-600 mb-2" />
              <span className="text-sm font-medium text-trust-800">Proškolení lektoři</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
