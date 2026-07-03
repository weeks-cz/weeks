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
    bg: 'bg-primary-600',
    text: 'text-primary-600',
  },
  accent: {
    bg: 'bg-accent-500',
    text: 'text-accent-600',
  },
  trust: {
    bg: 'bg-trust-600',
    text: 'text-trust-600',
  },
  cta: {
    bg: 'bg-cta-500',
    text: 'text-cta-600',
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
        description: '3D tisk, vlastní 3D modely a IoT s Arduinem — celý pracovní týden ve FabLabu VARY&TE.',
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
      <section id="program" className="section-padding bg-paper-soft border-b border-ink/15">
        <div className="section-container">
          <div className="max-w-3xl mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mono-label mb-4"
            >
              Léto 2026 — Karlovy Vary
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="heading-2 text-ink mb-4"
            >
              Vyberte si formát
              <br />
              <span className="text-primary-600">tábora chytrých technologií</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-ink-500"
            >
              Celotýdenní příměstský tábor (Po–Pá) nebo víkendový MIX (So–Ne) —
              všechny termíny ve FabLabu Kreativního centra VARY&TE.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
            {kvPrograms.map((item, idx) => {
              const program = item.program!
              const colors = colorClasses[program.color as keyof typeof colorClasses] ?? colorClasses.primary
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
                    className="card-maker group overflow-hidden block h-full flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden border-b border-ink/15">
                      <Image
                        src={item.image}
                        alt={program.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 bg-paper border border-ink rounded-sm font-mono text-xs font-medium text-ink">
                          {item.badgeLabel}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="mono-label mb-3">
                        {program.price.toLocaleString('cs-CZ')} Kč
                      </div>
                      <h3 className="font-display text-xl font-bold text-ink group-hover:text-primary-600 transition-colors mb-3">
                        {program.name}
                      </h3>
                      <p className="text-ink-500 mb-4 flex-grow">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 pt-3 border-t border-ink/15">
                        <Calendar className={`w-4 h-4 flex-shrink-0 ${colors.text}`} />
                        <span className="font-mono text-xs text-ink-500">
                          {location.terms.filter(t => t.program === program.id).length} {' '}
                          {location.terms.filter(t => t.program === program.id).length === 1 ? 'termín' : 'termíny'} v létě 2026
                        </span>
                        <ArrowRight className="w-4 h-4 text-ink/40 ml-auto group-hover:translate-x-1 transition-transform flex-shrink-0" />
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
    <section id="program" className="section-padding bg-paper-soft border-b border-ink/15">
      <div className="section-container">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mono-label mb-4"
          >
            7 programů na výběr
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-2 text-ink mb-4"
          >
            Vyberte si podle toho,
            <br />
            <span className="text-primary-600">co vaše dítě baví</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-ink-500"
          >
            Nebo zkuste všechno! Každý si odnese vlastní projekt a nové znalosti.
          </motion.p>
        </div>

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
                className="h-full"
              >
                <Link
                  href={buildPath(location, camp.href.replace(/^\//, ''))}
                  className="card-maker group overflow-hidden block h-full flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden border-b border-ink/15">
                    <Image
                      src={camp.image}
                      alt={`${camp.title} - tábor pro děti`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 bg-paper border border-ink rounded-sm font-mono text-xs font-medium text-ink">
                        {camp.badge}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-3 left-3">
                      <div className={`w-10 h-10 rounded-sm border border-ink ${colors.bg} flex items-center justify-center`}>
                        <camp.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mono-label mb-2">{camp.price}</div>
                    <h4 className="font-display text-lg font-bold text-ink group-hover:text-primary-600 transition-colors mb-2">
                      {camp.title}
                    </h4>
                    <p className="text-sm text-ink-500 leading-relaxed mb-4 flex-1">
                      {camp.description}
                    </p>

                    {/* Next dates */}
                    <div className="flex items-center gap-3 pt-3 border-t border-ink/15">
                      <Calendar className={`w-4 h-4 flex-shrink-0 ${colors.text}`} />
                      <div className="flex flex-wrap gap-2">
                        {camp.nextDates.map((date, i) => (
                          <span key={i} className="font-mono text-xs text-ink border border-ink/20 px-2 py-0.5 rounded-sm">
                            {date}
                          </span>
                        ))}
                      </div>
                      <ArrowRight className="w-4 h-4 text-ink/40 ml-auto group-hover:translate-x-1 transition-transform flex-shrink-0" />
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
          className="mb-8 pt-4 border-t border-ink/15"
        >
          <h3 className="font-display text-xl font-semibold text-ink">
            Další specializace
          </h3>
          <p className="text-ink-500 mt-1">
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
                  className="card-maker group overflow-hidden block h-full"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden border-b border-ink/15">
                    <Image
                      src={program.image}
                      alt={`${program.title} - ukázka z víkendového tábora`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 bg-paper border border-ink/20 rounded-sm font-mono text-xs font-medium ${colors.text}`}>
                        {program.badge}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-3 left-3">
                      <div className={`w-10 h-10 rounded-sm border border-ink ${colors.bg} flex items-center justify-center`}>
                        <program.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h4 className="font-display text-lg font-bold text-ink mb-2 group-hover:text-primary-600 transition-colors">
                      {program.title}
                    </h4>
                    <p className="text-sm text-ink-500 leading-relaxed">
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
