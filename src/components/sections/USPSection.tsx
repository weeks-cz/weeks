'use client'

import { motion } from 'framer-motion'
import { Building2, Package, GraduationCap, Shield, Clock, Train } from 'lucide-react'
import { useLocation } from '@/contexts/LocationContext'

const staticUsps = [
  {
    icon: Building2,
    title: 'Exkluzivní technologie HWLab',
    description: 'Vaše dítě pracuje se stejným vybavením jako profesionálové - průmyslové 3D tiskárny, VR headsety, CNC stroje a pokročilá IoT zařízení. Žádné hračky.',
  },
  {
    icon: Package,
    title: 'Projekty, které si odnesou domů',
    description: 'Učíme tvorbou, ne teorií. Každý víkend znamená dokončený projekt - vytištěný model, funkční elektroniku nebo nahrané aplikace.',
  },
  {
    icon: GraduationCap,
    title: 'Skuteční odborníci, ne hlídání',
    description: 'Naši lektoři jsou aktivní programátoři, inženýři a designéři. Mají praxi z oboru a vědí, jak zaujmout teenagery i začátečníky od 10 let.',
  },
  {
    icon: Clock,
    title: 'Kompletní servis od 9 do 17',
    description: 'Oběd, svačiny, přestávky na hřišti a střídání aktivit. Rodiče mají celý víkendový den pro sebe, děti mají postaráno o vše.',
  },
]

export function USPSection() {
  const location = useLocation()
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
            Proč zvolit <span className="text-gradient">Weeks</span>?
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
          {[...staticUsps, { icon: Shield, title: location.usps.organizer.title, description: location.usps.organizer.description }, { icon: Train, title: location.usps.location.title, description: location.usps.location.description }].map((usp, index) => (
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
