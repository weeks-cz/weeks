'use client'

import { motion } from 'framer-motion'

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
            Důvěřují nám
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Weeks funguje pod záštitou zavedených institucí.
          </motion.p>
        </div>

        {/* Partner logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-12"
        >
          {/* DDM Praha 6 */}
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50">
            {/* TODO: Replace with actual logo */}
            <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 font-medium">
              Logo
            </div>
            <span className="font-semibold text-gray-700">DDM Praha 6</span>
            <span className="text-sm text-gray-500">Záštita a organizace</span>
          </div>

          {/* HWLab */}
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50">
            {/* TODO: Replace with actual logo */}
            <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 font-medium">
              Logo
            </div>
            <span className="font-semibold text-gray-700">HWLab Praha</span>
            <span className="text-sm text-gray-500">Místo konání</span>
          </div>
        </motion.div>

        {/* Safety info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-trust-50 rounded-2xl p-8 max-w-3xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-trust-800 mb-4 text-center">
            Bezpečnost na prvním místě
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-trust-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-trust-500 rounded-full" />
              Pojištění účastníků
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-trust-500 rounded-full" />
              Proškolení lektoři
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-trust-500 rounded-full" />
              Dodržování BOZP
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-trust-500 rounded-full" />
              Zdravotník na místě
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
