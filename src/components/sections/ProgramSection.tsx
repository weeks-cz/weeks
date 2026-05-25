'use client'

import { motion } from 'framer-motion'
import { Printer, Cpu, Box, Globe, Gamepad2, Code2, Sparkles, ArrowRight, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocation } from '@/contexts/LocationContext'
import { buildPath } from '@/lib/locations'

// Všechny 3 hlavní tábory - rovnocenné
const mainCamps = [
  {
    id: 'mix',
    icon: Sparkles,
    title: 'Tábor chytrých technologií',
    description: 'Za jeden víkend si vaše dítě vyzkouší 3D tisk, IoT programování i virtuální realitu.',
    image: '/images/program-mix.webp',
    color: 'accent',
    badge: 'Víkendový',
    href: '/tabor-chytrych-technologii',
    price: '2 990 Kč',
    nextDates: ['28.–29. března'],
  },
  {
    id: '3d-tisk',
    icon: Printer,
    title: '3D tisk',
    description: 'Od nápadu k hotovému výrobku. Děti navrhnou vlastní model a vytisknou si ho na profesionálních tiskárnách.',
    image: '/images/program-3dtisk.webp',
    color: 'primary',
    badge: '1 den',
    href: '/tabor-3d-tisk',
    price: '1 490 Kč',
    nextDates: ['Ne 19. dubna'],
  },
  {
    id: 'iot',
    icon: Cpu,
    title: 'IoT & elektronika',
    description: 'Postavit si vlastní chytré zařízení? Děti propojí senzory, světýlka a displeje a naprogramují je.',
    image: '/images/program-iot.webp',
    color: 'trust',
    badge: '1 den',
    href: '/tabor-iot',
    price: '1 490 Kč',
    nextDates: ['So 18. dubna'],
  },
]

// Další specializace
const specializations = [
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
    image: '/images/program-csharp.webp',
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
  const location = useLocation()

  if (!location.isDefault) {
    const kvPrograms = [
      {
        program: location.programs.find(p => p.id === 'letni-primestsky'),
        href: 'letni-primestsky',
        badgeLabel: 'Příměstský · 5 dní',
        description: '3D tisk, vlastní 3D modely a IoT s Arduinem — celý pracovní týden ve FabLabu Vary&Te.',
        image: '/images/program-mix.webp',
      },
      {
        program: location.programs.find(p => p.id === 'mix'),
        href: 'tabor-chytrych-technologii',
        badgeLabel: 'Víkend · So + Ne',
        description: '3D tisk, IoT, VR i základy programování za jeden víkend — projekty na sebe navazují přes noc.',
        image: '/images/program-mix.webp',
      },
    ].filter(item => item.program)

    return (
      <section id="program" className="section-padding bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-200 rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-600 shadow-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-trust-500 animate-pulse" />
              Léto 2026 — Karlovy Vary
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            >
              Vyberte si formát
              <br />
              <span className="text-gradient">tábora chytrých technologií</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600"
            >
              Celotýdenní příměstský tábor (Po–Pá) nebo víkendový MIX (So–Ne) —
              všechny termíny ve FabLabu Kreativního centra Vary&Te.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {kvPrograms.map((item, idx) => {
              const program = item.program!
              const colors = colorClasses[program.color as keyof typeof colorClasses]
              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={buildPath(location, item.href)}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 block h-full flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={program.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent" />
                      <div className="absolute top-3 left-3 z-10">
                        <div className={`px-2.5 py-1 rounded-full ${colors.bg} text-xs font-semibold text-white shadow-lg`}>
                          {item.badgeLabel}
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-display text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {program.name}
                        </h3>
                        <span className="text-lg font-semibold text-gray-900 whitespace-nowrap ml-4">
                          {program.price.toLocaleString('cs-CZ')} Kč
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 flex-grow">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500">
                          {location.terms.filter(t => t.program === program.id).length} {' '}
                          {location.terms.filter(t => t.program === program.id).length === 1 ? 'termín' : 'termíny'} v létě 2026
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

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

        {/* NOVĚ: Dvoudenní 3D tisk — zvýrazněný pruh nad kartami */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Link
            href={`${buildPath(location, 'tabor-3d-tisk')}#terminy`}
            className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 p-5 shadow-lg hover:shadow-xl transition-shadow"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cta-400 text-gray-900 text-xs font-bold self-start">
              <Sparkles className="w-3.5 h-3.5" /> NOVĚ
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg font-bold text-white">
                Dvoudenní 3D tisk — 2.–3. července (čtvrtek + pátek)
              </p>
              <p className="text-sm text-white/80">
                Víc času na vlastní projekty. Stačí přijít i jen na jeden den. · 2 990 Kč
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-white font-semibold whitespace-nowrap group-hover:translate-x-1 transition-transform self-start sm:self-auto">
              Více <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </motion.div>

        {/* Hlavní tábory - všechny 3 rovnocenně */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {mainCamps.map((camp, index) => {
            const colors = colorClasses[camp.color as keyof typeof colorClasses]
            return (
              <motion.div
                key={camp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={buildPath(location, camp.href.replace(/^\//, ''))}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 block h-full"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={camp.image}
                      alt={`${camp.title} - tábor pro děti`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className={`px-2.5 py-1 rounded-full ${colors.bg} text-xs font-semibold text-white shadow-lg`}>
                        {camp.badge}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-3 left-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                        <camp.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-display text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {camp.title}
                      </h4>
                      <span className="text-sm font-semibold text-gray-900">{camp.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">
                      {camp.description}
                    </p>

                    {/* Next dates */}
                    <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex flex-wrap gap-2">
                        {camp.nextDates.map((date, i) => (
                          <span key={i} className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
                            {date}
                          </span>
                        ))}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Další specializace Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-700">
            Další specializace
          </h3>
          <p className="text-gray-500 mt-1">
            Pro děti, které už vědí, čemu se chtějí věnovat
          </p>
        </motion.div>

        {/* Specializace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  href={buildPath(location, `program#${program.id}`)}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 block"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={program.image}
                      alt={`${program.title} - ukázka z víkendového tábora`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
            href={buildPath(location, 'program')}
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
