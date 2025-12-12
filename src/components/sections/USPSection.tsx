'use client'

import { motion } from 'framer-motion'
import { Building2, GraduationCap, Shield, Clock, Utensils, MapPin } from 'lucide-react'

const usps = [
  {
    icon: Building2,
    title: 'Exkluzivní zázemí HWLabu',
    description: 'Přístup k profesionálním 3D tiskárnám, VR setům, CNC strojům a dalšímu vybavení.',
  },
  {
    icon: GraduationCap,
    title: 'Odborné vedení',
    description: 'Lektoři, kteří technologiím opravdu rozumí. Nejsou to jen dozor, ale mentoři.',
  },
  {
    icon: Shield,
    title: 'Záštita DDM Praha 6',
    description: 'Zavedená instituce garantuje bezpečnostní standardy, pojištění a prověřené procesy.',
  },
  {
    icon: Clock,
    title: 'Víkendový detox pro rodiče',
    description: 'Dítě se od 9 do 17 vzdělává a tvoří, vy máte volný víkend pro sebe.',
  },
  {
    icon: Utensils,
    title: 'Kompletní péče',
    description: 'O děti je postaráno včetně obědů a svačin. Aktivity i mimo počítač.',
  },
  {
    icon: MapPin,
    title: 'Skvělá dostupnost',
    description: 'HWLab na Vyšehradě, výborná dostupnost MHD. Víkendové termíny bez zásahu do školy.',
  },
]

export function USPSection() {
  return (
    <section id="proc-weeks" className="section-padding bg-gray-50">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-2 text-gray-900 mb-4"
          >
            Proč <span className="text-gradient">Weeks</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Kombinace profesionálního zázemí, odborných lektorů a zábavy.
          </motion.p>
        </div>

        {/* USP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {usps.map((usp, index) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <usp.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {usp.title}
                </h3>
                <p className="text-gray-600">
                  {usp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
