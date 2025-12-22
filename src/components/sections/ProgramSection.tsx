'use client'

import { motion } from 'framer-motion'
import { Printer, Glasses, Cpu, Code2, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const programs = [
  {
    icon: Printer,
    title: '3D tisk & modelování',
    description: 'Od návrhu po reálný výtisk. Děti navrhnou v 3D a vytisknou si vlastní projekt na profesionálních tiskárnách Prusa.',
    image: '/images/hwlab/hwlab-7990.webp',
    color: 'primary',
    stats: '8+ tiskáren',
  },
  {
    icon: Glasses,
    title: 'Virtuální realita',
    description: 'Tvorba VR světů a zážitků. Naučí se pracovat s nejmodernější technologií a vytvořit vlastní virtuální prostředí.',
    image: '/images/hwlab/hwlab-7975.webp',
    color: 'accent',
    stats: 'Meta Quest',
  },
  {
    icon: Cpu,
    title: 'IoT & elektronika',
    description: 'Chytré zařízení od A do Z. Programování senzorů, LED pásků a vytvoření funkčního IoT projektu.',
    image: '/images/hwlab/hwlab-7962.webp',
    color: 'trust',
    stats: 'Arduino & RPi',
  },
  {
    icon: Code2,
    title: 'Programování & vývoj',
    description: 'Kód, který funguje. Od základů po pokročilé projekty - aplikace, hry nebo weby podle zájmu a úrovně dítěte.',
    image: '/images/hwlab/hwlab-7965.webp',
    color: 'cta',
    stats: 'Python & JS',
  },
]

const colorClasses = {
  primary: {
    bg: 'bg-primary-500',
    bgLight: 'bg-primary-50',
    text: 'text-primary-600',
    border: 'border-primary-200',
    gradient: 'from-primary-500 to-primary-600',
  },
  accent: {
    bg: 'bg-accent-500',
    bgLight: 'bg-accent-50',
    text: 'text-accent-600',
    border: 'border-accent-200',
    gradient: 'from-accent-500 to-accent-600',
  },
  trust: {
    bg: 'bg-trust-500',
    bgLight: 'bg-trust-50',
    text: 'text-trust-600',
    border: 'border-trust-200',
    gradient: 'from-trust-500 to-trust-600',
  },
  cta: {
    bg: 'bg-cta-500',
    bgLight: 'bg-cta-50',
    text: 'text-cta-600',
    border: 'border-cta-200',
    gradient: 'from-cta-500 to-cta-600',
  },
}

export function ProgramSection() {
  return (
    <section id="program" className="section-padding bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-200 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-600 shadow-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-trust-500 animate-pulse" />
            Co se naučí
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Praktické dovednosti
            <br />
            <span className="text-gradient">s nejmodernějšími technologiemi</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Každý si odnese vlastní projekt a nové znalosti. Vše v reálném HWLab prostředí.
          </motion.p>
        </div>

        {/* Program Grid - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {programs.map((program, index) => {
            const colors = colorClasses[program.color as keyof typeof colorClasses]
            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent" />

                  {/* Stats Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold ${colors.text}`}>
                      {program.stats}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="absolute bottom-4 left-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                      <program.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/program"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group"
          >
            Zobrazit kompletní program
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
