'use client'

import { motion } from 'framer-motion'
import { Printer, Cpu, Box, Globe, Gamepad2, Code2, Sparkles, ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Tábor chytrých technologií - hero card
const mixProgram = {
  id: 'mix',
  icon: Sparkles,
  title: 'Tábor chytrých technologií',
  subtitle: 'Víkendový tábor pro děti 10–15 let',
  description: 'Za jeden víkend si vaše dítě vyzkouší 3D tisk, IoT programování i virtuální realitu. Odnese si vlastní výtisky, naprogramované projekty a zážitky z VR.',
  highlights: [
    '3D tisk, IoT a virtuální realita v jednom víkendu',
    'Vlastní výtisky a projekty si odnese domů',
    'Vhodné pro začátečníky i pokročilé',
  ],
  image: '/images/program-mix.webp',
}

// Specializované programy
const specializations = [
  {
    id: '3d-tisk',
    icon: Printer,
    title: '3D tisk',
    description: 'Od nápadu k hotovému výrobku. Děti navrhnou vlastní model a vytisknou si ho na profesionálních tiskárnách.',
    image: '/images/program-3dtisk.webp',
    color: 'primary',
    badge: 'Tiskárny Prusa',
  },
  {
    id: 'iot',
    icon: Cpu,
    title: 'IoT & elektronika',
    description: 'Postavit si vlastní chytré zařízení? Děti propojí senzory, světýlka a displeje a naprogramují je.',
    image: '/images/program-iot.webp',
    color: 'trust',
    badge: 'Arduino',
  },
  {
    id: 'blender',
    icon: Box,
    title: '3D modelování',
    description: 'Tvorba 3D modelů jako v animovaných filmech. Vlastní postavička, scéna nebo předmět pro 3D tisk.',
    image: '/images/program-blender.webp',
    color: 'accent',
    badge: 'Blender',
  },
  {
    id: 'web',
    icon: Globe,
    title: 'Tvorba webu',
    description: 'Vlastní webová stránka, kterou můžou ukázat kamarádům. Portfolio, blog nebo fan stránka.',
    image: '/images/program-web.webp',
    color: 'cta',
    badge: 'HTML & CSS',
  },
  {
    id: 'hry',
    icon: Gamepad2,
    title: 'Vývoj her',
    description: 'Z hráče tvůrcem. Děti vytvoří vlastní hru, kterou si můžou zahrát i doma.',
    image: '/images/program-hry.webp',
    color: 'primary',
    badge: 'Unity',
  },
  {
    id: 'csharp',
    icon: Code2,
    title: 'Programování',
    description: 'První kroky v programování. Od jednoduchých příkazů po vlastní fungující program.',
    image: '/images/program-csharp.webp?v=2',
    color: 'trust',
    badge: 'C#',
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
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-600 shadow-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-trust-500 animate-pulse" />
            7 programů na výběr
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Vyberte si podle toho,
            <br />
            <span className="text-gradient">co vaše dítě baví</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Nebo zkuste všechno! Každý si odnese vlastní projekt a nové znalosti.
          </motion.p>
        </div>

        {/* MIX Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 via-accent-600 to-trust-600 p-1">
            <div className="relative rounded-[22px] overflow-hidden bg-gradient-to-br from-primary-600 via-accent-600 to-trust-600">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white w-fit mb-4">
                    <Sparkles className="w-4 h-4" />
                    {mixProgram.subtitle}
                  </div>

                  <h3 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
                    {mixProgram.title}
                  </h3>

                  <p className="text-lg text-white/90 mb-6">
                    {mixProgram.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {mixProgram.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-white/90">{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/tabor-chytrych-technologii"
                      className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center justify-center"
                    >
                      Zobrazit termíny
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <Link
                      href="/tabor-chytrych-technologii#program"
                      className="btn-outline border-white/50 text-white hover:bg-white/10 inline-flex items-center justify-center"
                    >
                      Více o programu
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-64 lg:h-auto min-h-[300px]">
                  <Image
                    src={mixProgram.image}
                    alt="Lab s webem Weeks na projektoru - ukázka z tábora"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600/50 via-transparent to-transparent lg:bg-gradient-to-l" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Specializace Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-700">
            Nebo si vyberte specializaci
          </h3>
          <p className="text-gray-500 mt-1">
            Pro děti, které už vědí, čemu se chtějí věnovat
          </p>
        </motion.div>

        {/* Specializace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specializations.map((program, index) => {
            const colors = colorClasses[program.color as keyof typeof colorClasses]
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/program#${program.id}`}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 block"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={program.image}
                      alt={`${program.title} - ukázka z víkendového tábora`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold ${colors.text}`}>
                        {program.badge}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-3 left-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                        <program.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h4 className="font-display text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {program.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/program"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group"
          >
            Zobrazit detaily všech programů
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
