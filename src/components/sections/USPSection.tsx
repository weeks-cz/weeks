'use client'

import { motion } from 'framer-motion'
import { Building2, Package, GraduationCap, Shield, Clock, Train } from 'lucide-react'
import { useLocation } from '@/contexts/LocationContext'

const defaultTechnologyUsp = {
  icon: Building2,
  title: 'Exkluzivní technologie HWLab',
  description: 'Vaše dítě pracuje se stejným vybavením jako profesionálové - průmyslové 3D tiskárny, VR headsety, CNC stroje a pokročilá IoT zařízení. Žádné hračky.',
}

const defaultScheduleUsp = {
  icon: Clock,
  title: 'Kompletní servis od 9 do 17',
  description: 'Oběd, svačiny, přestávky na hřišti a střídání aktivit. Rodiče mají celý víkendový den pro sebe, děti mají postaráno o vše.',
}

const genericUsps = [
  {
    icon: Package,
    title: 'Projekty, které si odnesou domů',
    description: 'Učíme tvorbou, ne teorií. Každý tábor znamená dokončený projekt - vytištěný model, funkční elektroniku nebo nahrané aplikace.',
  },
  {
    icon: GraduationCap,
    title: 'Skuteční odborníci, ne hlídání',
    description: 'Naši lektoři jsou aktivní programátoři, inženýři a designéři. Mají praxi z oboru a vědí, jak zaujmout teenagery i začátečníky od 10 let.',
  },
]

export function USPSection() {
  const location = useLocation()

  const techUsp = location.usps.technology
    ? { icon: Building2, ...location.usps.technology }
    : defaultTechnologyUsp

  const scheduleUsp = location.usps.schedule
    ? { icon: Clock, ...location.usps.schedule }
    : defaultScheduleUsp

  // Build the USP list with indices
  const usps = [techUsp, ...genericUsps, scheduleUsp, { icon: Shield, title: location.usps.organizer.title, description: location.usps.organizer.description }, { icon: Train, title: location.usps.location.title, description: location.usps.location.description }]

  return (
    <section id="proc-weeks" className="section-padding bg-night">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="data-label mb-4">02 / PROČ WEEKS</p>
          <h2 className="heading-2">
            Kombinace profesionálního zázemí, odborných lektorů a zábavy.
          </h2>
        </motion.div>

        {/* USP Rows */}
        <div className="space-y-8 max-w-3xl">
          {usps.map((usp, index) => {
            const indexNum = String(index + 1).padStart(2, '0')

            return (
              <motion.div
                key={usp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border-t border-white/10 pt-6 first:border-t-0 first:pt-0"
              >
                <div className="flex gap-6">
                  {/* Index */}
                  <div className="flex-shrink-0 w-12 flex items-start">
                    <p className="font-mono text-sm text-white/30">
                      {indexNum}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-start gap-3 mb-2">
                      <usp.icon className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                      <h3 className="heading-3">
                        {usp.title}
                      </h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {usp.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
