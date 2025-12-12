'use client'

import { motion } from 'framer-motion'
import { Printer, Glasses, Cpu, Gamepad2 } from 'lucide-react'

const programs = [
  {
    icon: Printer,
    title: '3D Tisk',
    description: 'Naučte se navrhovat a tisknout vlastní 3D modely. Od návrhu v CAD softwaru až po hotový výrobek.',
    color: 'primary',
  },
  {
    icon: Glasses,
    title: 'Virtuální realita',
    description: 'Prozkoumejte virtuální světy a naučte se základy tvorby VR aplikací.',
    color: 'accent',
  },
  {
    icon: Cpu,
    title: 'IoT & Elektronika',
    description: 'Sestavte si vlastní chytrá zařízení s Arduino a Raspberry Pi. Propojte fyzický svět s digitálním.',
    color: 'trust',
  },
  {
    icon: Gamepad2,
    title: 'Programování',
    description: 'Základy programování hravou formou. Vytvořte si vlastní hru nebo aplikaci.',
    color: 'cta',
  },
]

const colorClasses = {
  primary: {
    bg: 'bg-primary-100',
    icon: 'text-primary-600',
    hover: 'hover:border-primary-300',
  },
  accent: {
    bg: 'bg-accent-100',
    icon: 'text-accent-600',
    hover: 'hover:border-accent-300',
  },
  trust: {
    bg: 'bg-trust-100',
    icon: 'text-trust-600',
    hover: 'hover:border-trust-300',
  },
  cta: {
    bg: 'bg-cta-100',
    icon: 'text-cta-600',
    hover: 'hover:border-cta-300',
  },
}

export function ProgramSection() {
  return (
    <section id="program" className="section-padding bg-white">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-2 text-gray-900 mb-4"
          >
            Co se na táboře <span className="text-gradient">naučíte</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Praktické dovednosti s nejmodernějšími technologiemi.
            Každý si odnese vlastní výrobek a nové znalosti.
          </motion.p>
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => {
            const colors = colorClasses[program.color as keyof typeof colorClasses]
            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group p-6 bg-white rounded-2xl border-2 border-gray-100 ${colors.hover} transition-all duration-300 hover:shadow-lg`}
              >
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <program.icon className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {program.title}
                </h3>
                <p className="text-gray-600">
                  {program.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
