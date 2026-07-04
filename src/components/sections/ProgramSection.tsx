'use client'

import { motion } from 'framer-motion'
import { Printer, Cpu, Box, Globe, Gamepad2, Code2, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLocation } from '@/contexts/LocationContext'
import { buildPath } from '@/lib/locations'
import { CountUp } from '@/components/effects/CountUp'

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


export function ProgramSection() {
  const location = useLocation()

  if (!location.isDefault) {
    const kvPrograms = [
      {
        program: location.programs.find(p => p.id === 'letni-primestsky'),
        href: 'letni-primestsky',
        badgeLabel: 'Příměstský · 5 dní',
        description: '3D tisk, vlastní 3D modely a IoT s Arduinem — celý pracovní týden ve FabLabu VARY&TE.',
      },
      {
        program: location.programs.find(p => p.id === 'mix'),
        href: 'tabor-chytrych-technologii',
        badgeLabel: 'Víkend · So + Ne',
        description: '3D tisk, IoT, VR i základy programování za jeden víkend — projekty na sebe navazují přes noc.',
      },
    ].filter(item => item.program)

    return (
      <section id="program" className="section-padding bg-night">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="data-label mb-4">01 / TÁBORY</p>
            <h2 className="heading-2">
              Vyberte si formát
              <br />
              tábora chytrých technologií
            </h2>
            <p className="text-slate-400 mt-6 max-w-2xl">
              Celotýdenní příměstský tábor (Po–Pá) nebo víkendový MIX (So–Ne) —
              všechny termíny ve FabLabu Kreativního centra VARY&TE.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {kvPrograms.map((item, idx) => {
              const program = item.program!
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
                    className="group card-glow p-6 flex flex-col h-full"
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 border-t-primary-400" style={{ height: '2px' }} />

                    {/* Metadata */}
                    <div className="mb-4 pb-4 border-b border-white/10">
                      <p className="data-label text-xs">
                        {item.badgeLabel} · {program.price.toLocaleString('cs-CZ')} Kč
                      </p>
                    </div>

                    {/* Icon and badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-night flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-accent-400" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="heading-3 mb-2">
                      {program.name}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                      {item.description}
                    </p>

                    {/* Terms info */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-slate-500">
                        {location.terms.filter(t => t.program === program.id).length} {' '}
                        {location.terms.filter(t => t.program === program.id).length === 1 ? 'termín' : 'termíny'} v létě 2026
                      </p>
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
    <section id="program" className="section-padding bg-night">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="data-label mb-4">01 / TÁBORY</p>
          <h2 className="heading-2">
            Vyberte si podle toho,
            <br />
            co vaše dítě baví
          </h2>
          <p className="text-slate-400 mt-6 max-w-2xl">
            Nebo zkuste všechno! Každý si odnese vlastní projekt a nové znalosti.
          </p>
        </motion.div>

        {/* Hlavní tábory - všechny 3 rovnocenně */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {mainCamps.map((camp, index) => {
            // Use truthful format from badge field
            const dayFormat = camp.badge.toUpperCase()

            // Determine border color
            const borderColor = camp.id === 'iot' ? 'border-t-trust-400' : 'border-t-primary-400'

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
                  className="group card-glow p-6 flex flex-col h-full"
                >
                  {/* Top border accent */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 ${borderColor}`} style={{ height: '2px' }} />

                  {/* Metadata row */}
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <p className="data-label text-xs">
                      {dayFormat} · {camp.price} · MAX 15
                    </p>
                  </div>

                  {/* Icon and badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-night flex items-center justify-center">
                      <camp.icon className="w-5 h-5 text-accent-400" />
                    </div>
                    {camp.badge && (
                      <div className="font-mono text-xs border border-white/20 rounded px-2 py-0.5 text-slate-300">
                        {camp.badge}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h4 className="heading-3 mb-2">
                    {camp.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                    {camp.description}
                  </p>
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
          className="mb-8"
        >
          <h3 className="heading-3 text-white">
            Další specializace
          </h3>
          <p className="text-slate-400 mt-2 text-sm">
            Pro děti, které už vědí, čemu se chtějí věnovat
          </p>
        </motion.div>

        {/* Specializace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {specializations.map((program, index) => {
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
                  className="group card-glow p-6 flex flex-col h-full"
                >
                  {/* Icon and badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-night flex items-center justify-center">
                      <program.icon className="w-5 h-5 text-accent-400" />
                    </div>
                    {program.badge && (
                      <div className="font-mono text-xs border border-white/20 rounded px-2 py-0.5 text-slate-300">
                        {program.badge}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h4 className="heading-3 mb-2">
                    {program.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {program.description}
                  </p>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
