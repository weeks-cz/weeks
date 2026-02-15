'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Printer, Cpu, Glasses, Clock, MapPin, Calendar, Users, Utensils, Laptop, ChevronDown, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

const terminy = [
  {
    id: 1,
    ddmId: '734',
    dates: '7. – 8. března 2026',
    day1: 'Sobota 7. 3.',
    day2: 'Neděle 8. 3.',
    location: 'HWLab Praha',
    locationDetail: 'Kongresové centrum Praha, 5. května 11, Praha 4',
    defaultSpots: 15,
    registrationUrl: 'https://www.ddmp6.cz/tabory/?id=734',
  },
  {
    id: 2,
    ddmId: '735',
    dates: '14. – 15. března 2026',
    day1: 'Sobota 14. 3.',
    day2: 'Neděle 15. 3.',
    location: 'HWLab Praha',
    locationDetail: 'Kongresové centrum Praha, 5. května 11, Praha 4',
    defaultSpots: 15,
    registrationUrl: 'https://www.ddmp6.cz/tabory/?id=735',
  },
  {
    id: 3,
    ddmId: '736',
    dates: '28. – 29. března 2026',
    day1: 'Sobota 28. 3.',
    day2: 'Neděle 29. 3.',
    location: 'DDM Praha 6 – Bílá hora',
    locationDetail: 'U Boroviček 5, Praha 6',
    defaultSpots: 12,
    registrationUrl: 'https://www.ddmp6.cz/tabory/?id=736',
  },
]

const sobotaProgram = [
  { time: '9:00', title: 'Příchod a seznámení', description: 'Představení lektorů, pravidla bezpečnosti, co nás čeká.' },
  { time: '9:30', title: 'Úvod do 3D tisku', description: 'Jak funguje 3D tiskárna? Ukázka tisku, materiály, principy.' },
  { time: '10:30', title: 'Přestávka', description: 'Svačina a pití (vlastní nebo z automatu).' },
  { time: '10:45', title: 'Návrh vlastního modelu', description: 'Každý si navrhne vlastní 3D model v jednoduchém programu.' },
  { time: '12:00', title: 'Oběd', description: 'Zajištěný oběd pro všechny účastníky.' },
  { time: '12:45', title: 'Spuštění tisku', description: 'Příprava modelu pro tisk, nastavení tiskárny, start tisku.' },
  { time: '14:00', title: 'Přestávka', description: 'Svačina, odpočinek, volná zábava.' },
  { time: '14:15', title: 'Údržba a samostatná práce', description: 'Základy údržby tiskárny, práce na dalších modelech.' },
  { time: '16:30', title: 'Závěr prvního dne', description: 'Shrnutí, co jsme zvládli. Tisky pokračují přes noc!' },
  { time: '17:00', title: 'Odchod', description: '' },
]

const nedeleProgram = [
  { time: '9:00', title: 'Příchod a kontrola tisků', description: 'Co se vytisklo přes noc? Prohlídka hotových modelů.' },
  { time: '9:30', title: 'IoT - Internet věcí', description: 'Úvod do Micro:bitu, propojení senzorů a programování.' },
  { time: '10:30', title: 'Přestávka', description: 'Svačina a pití.' },
  { time: '10:45', title: 'IoT projekt', description: 'Vlastní projekt – naprogramování chytrého zařízení.' },
  { time: '12:00', title: 'Oběd', description: 'Zajištěný oběd pro všechny účastníky.' },
  { time: '12:45', title: 'Virtuální realita', description: 'VR headsety, interaktivní výzvy a zážitky.' },
  { time: '14:00', title: 'Přestávka', description: 'Svačina, odpočinek.' },
  { time: '14:15', title: 'Dokončení projektů', description: 'Finalizace IoT projektů, post-processing 3D výtisků.' },
  { time: '16:00', title: 'Prezentace a závěr', description: 'Každý představí svůj projekt. Doporučení, co dál.' },
  { time: '17:00', title: 'Odchod', description: 'Děti si odnáší všechny své výtvory domů.' },
]

const campFaqs = [
  {
    question: 'Co má dítě mít s sebou?',
    answer: 'Jen dobrou náladu a svačinu na dopoledne a odpoledne. Oběd zajišťujeme my. Všechno technické vybavení, nástroje i materiály jsou na místě.',
  },
  {
    question: 'Musí dítě přijít oba dny?',
    answer: 'Ano, víkendový tábor je koncipován jako celek sobota + neděle, protože projekty na sebe navazují (např. 3D tisky se tisknou přes noc). Jednotlivé dny neprodáváme.',
  },
  {
    question: 'Je zajištěn oběd pro děti s alergiemi?',
    answer: 'Ano, při registraci se ptáme na stravovací omezení a alergie. Spolupracujeme s dodavatelem, který dokáže připravit bezlepkové, vegetariánské i jiné speciální varianty.',
  },
  {
    question: 'Je potřeba nějaká předchozí zkušenost?',
    answer: 'Ne, žádné předchozí zkušenosti nejsou potřeba. Program přizpůsobujeme úrovni každého dítěte. Začátečníci začínají s asistovanými projekty, pokročilí dostanou složitější výzvy.',
  },
  {
    question: 'Můžu jako rodič zůstat s dítětem?',
    answer: 'První den můžete dítě doprovodit dovnitř a podívat se na prostory. Během programu ale prosíme rodiče, aby odešli – děti se lépe soustředí a více se otevřou vrstevníkům.',
  },
]

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function TaborChytrychTechnologiiPage() {
  const [liveCapacity, setLiveCapacity] = useState<Record<string, { spotsLeft: number; maxCapacity: number }>>({})

  useEffect(() => {
    async function fetchCapacity() {
      try {
        const res = await fetch('/api/capacity')
        if (!res.ok) return
        const json = await res.json()
        if (json.data) {
          setLiveCapacity(json.data)
        }
      } catch {
        // Silently fall back to default values
      }
    }
    fetchCapacity()
    // Refresh every 5 minutes
    const interval = setInterval(fetchCapacity, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  function getSpotsLeft(termin: typeof terminy[number]): number {
    const live = liveCapacity[termin.ddmId]
    return live ? live.spotsLeft : termin.defaultSpots
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/hwlab/hwlab-7972.webp"
              alt="Tábor chytrých technologií - děti pracují s 3D tiskárnami a VR"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-gray-900/30" />
          </div>

          <div className="section-container relative z-10">
            <div className="max-w-3xl">
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Link href="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Domů
                </Link>
                <span className="text-gray-500 mx-2">/</span>
                <Link href="/program" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Programy
                </Link>
                <span className="text-gray-500 mx-2">/</span>
                <span className="text-white font-medium">Tábor chytrých technologií</span>
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium mb-6 border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-cta-400" />
                <span>Sobota + Neděle</span>
                <span className="w-px h-4 bg-white/30" />
                <span className="text-cta-400">9:00 – 17:00</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
              >
                Tábor chytrých{' '}
                <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
                  technologií
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
              >
                Za jeden víkend si vaše dítě vyzkouší 3D tisk, naprogramuje IoT projekt
                na Micro:bitu a prozkoumá virtuální realitu.
                <span className="text-white font-medium"> Pro děti 10–15 let.</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a
                  href="#terminy"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-cta-500 hover:bg-cta-400 text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-cta-500/30 hover:-translate-y-0.5"
                >
                  Vybrat termín a přihlásit se
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#program"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 transition-all duration-300"
                >
                  Co děti čeká
                </a>
              </motion.div>

              {/* Quick facts */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {[
                  { icon: Calendar, label: '2 dny', sublabel: 'So + Ne' },
                  { icon: Clock, label: '16 hodin', sublabel: 'programu' },
                  { icon: Users, label: 'Max 15', sublabel: 'dětí' },
                  { icon: Utensils, label: 'Obědy', sublabel: 'v ceně' },
                ].map((fact, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <fact.icon className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">{fact.label}</p>
                      <p className="text-xs text-gray-400">{fact.sublabel}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* O programu */}
        <section id="program" className="section-padding bg-white scroll-mt-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="heading-2 text-gray-900 mb-4">
                3 technologie, <span className="text-gradient">jeden víkend</span>
              </h2>
              <p className="text-lg text-gray-600">
                Program je navržený tak, aby si děti vyzkoušely tři odlišné oblasti
                a zjistily, co je baví nejvíc.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Printer,
                  title: '3D tisk',
                  day: 'Sobota',
                  color: 'primary',
                  description: 'Děti si navrhnou vlastní 3D model a vytisknou ho na profesionální tiskárně Prusa. Model se tiskne přes noc a v neděli si ho odnesou domů.',
                  highlights: ['Návrh vlastního modelu', 'Práce s tiskárnou Prusa', 'Hotový výtisk domů'],
                },
                {
                  icon: Cpu,
                  title: 'IoT & Micro:bit',
                  day: 'Neděle',
                  color: 'trust',
                  description: 'Programování mikropočítače Micro:bit – propojení senzorů, LED displejů a vytvoření vlastního chytrého zařízení.',
                  highlights: ['Programování Micro:bitu', 'Práce se senzory', 'Vlastní IoT projekt'],
                },
                {
                  icon: Glasses,
                  title: 'Virtuální realita',
                  day: 'Neděle',
                  color: 'accent',
                  description: 'Zážitek ve VR brýlích – interaktivní výzvy, prozkoumávání virtuálních světů a pochopení, jak VR technologie funguje.',
                  highlights: ['VR headsety', 'Interaktivní výzvy', 'Zážitek z virtuálních světů'],
                },
              ].map((tech, index) => {
                const colorMap = {
                  primary: { bg: 'bg-primary-50', icon: 'text-primary-600', badge: 'bg-primary-100 text-primary-700' },
                  trust: { bg: 'bg-trust-50', icon: 'text-trust-600', badge: 'bg-trust-100 text-trust-700' },
                  accent: { bg: 'bg-accent-50', icon: 'text-accent-600', badge: 'bg-accent-100 text-accent-700' },
                }
                const colors = colorMap[tech.color as keyof typeof colorMap]

                return (
                  <motion.div
                    key={tech.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                        <tech.icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      <div className={`px-3 py-1 rounded-full ${colors.badge} text-xs font-semibold`}>
                        {tech.day}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{tech.title}</h3>
                    <p className="text-gray-600 mb-4">{tech.description}</p>

                    <ul className="space-y-2">
                      {tech.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className={`w-4 h-4 ${colors.icon} flex-shrink-0`} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Harmonogram */}
        <section id="harmonogram" className="section-padding bg-gray-50 scroll-mt-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="heading-2 text-gray-900 mb-4">
                Harmonogram <span className="text-gradient">víkendu</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Dva dny plné tvoření, od 9:00 do 17:00. Program střídáme, aby děti neseděly celý den u počítače.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Sobota */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-5">
                    <div className="flex items-center gap-3">
                      <Printer className="w-6 h-6 text-white" />
                      <div>
                        <h3 className="text-lg font-bold text-white">Sobota – 3D tisk</h3>
                        <p className="text-sm text-white/80">První kroky a vlastní 3D model</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="space-y-0">
                      {sobotaProgram.map((item, i) => (
                        <div key={i} className={`flex gap-4 py-3 ${i < sobotaProgram.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          <span className="text-sm font-mono font-semibold text-primary-600 w-12 flex-shrink-0">{item.time}</span>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                            {item.description && (
                              <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Nedele */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="bg-gradient-to-r from-accent-600 to-trust-500 p-5">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-6 h-6 text-white" />
                      <div>
                        <h3 className="text-lg font-bold text-white">Neděle – IoT & VR</h3>
                        <p className="text-sm text-white/80">Programování a virtuální světy</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="space-y-0">
                      {nedeleProgram.map((item, i) => (
                        <div key={i} className={`flex gap-4 py-3 ${i < nedeleProgram.length - 1 ? 'border-b border-gray-100' : ''}`}>
                          <span className="text-sm font-mono font-semibold text-accent-600 w-12 flex-shrink-0">{item.time}</span>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                            {item.description && (
                              <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Praktické informace */}
        <section className="section-padding bg-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="heading-2 text-gray-900 mb-8 text-center">
                Praktické <span className="text-gradient">informace</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: Utensils,
                    title: 'Stravování',
                    text: 'Oběd je zajištěný a v ceně. Na dopoledne a odpoledne si děti přinesou vlastní svačinu. Pití je k dispozici po celý den.',
                  },
                  {
                    icon: Laptop,
                    title: 'Vybavení',
                    text: 'Veškeré technické vybavení, počítače, 3D tiskárny, Micro:bity i VR headsety jsou na místě. Děti nemusí nic nosit.',
                  },
                  {
                    icon: Users,
                    title: 'Kapacita',
                    text: 'Maximálně 12–15 dětí na termín dle místa konání. Menší skupinky zajišťují individuální přístup lektorů ke každému dítěti.',
                  },
                  {
                    icon: Clock,
                    title: 'Čas',
                    text: 'Sobota i neděle od 9:00 do 17:00. Příchod od 8:45, vyzvednutí do 17:15. Celkem 16 hodin programu.',
                  },
                ].map((info, i) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                      <p className="text-sm text-gray-600">{info.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Termíny a registrace */}
        <section id="terminy" className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 scroll-mt-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="heading-2 text-white mb-4">
                Vyberte si termín
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Tři březnové víkendy, stejný program. Vyberte si ten, který vám vyhovuje.
              </p>
              <p className="text-lg text-white/70 mt-2">
                Cena: <span className="font-bold text-white">2 990 Kč</span> za víkend (vč. obědů a materiálů)
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {terminy.map((termin, index) => (
                <motion.div
                  key={termin.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-5 h-5 text-primary-600" />
                      <h3 className="text-lg font-bold text-gray-900">{termin.dates}</h3>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">{termin.location}</span>
                      </div>
                      <p className="text-xs text-gray-500 ml-6">{termin.locationDetail}</p>
                    </div>

                    {(() => {
                      const spots = getSpotsLeft(termin)
                      const isFull = spots <= 0
                      const isLow = spots > 0 && spots <= 3
                      return (
                        <>
                          <div className="flex items-center gap-2 mb-6 text-sm">
                            <div className={`w-2 h-2 rounded-full ${isFull ? 'bg-red-500' : isLow ? 'bg-cta-500' : 'bg-trust-500'}`} />
                            <span className={`font-medium ${isFull ? 'text-red-600' : isLow ? 'text-cta-700' : 'text-trust-700'}`}>
                              {isFull ? 'Obsazeno' : `${spots} volných míst`}
                            </span>
                          </div>

                          {isFull ? (
                            <span className="w-full btn-primary text-center justify-center opacity-50 cursor-not-allowed">
                              Obsazeno
                            </span>
                          ) : (
                            <a
                              href={termin.registrationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full btn-primary text-center justify-center"
                            >
                              Přihlásit se
                              <ArrowRight className="ml-2 w-5 h-5" />
                            </a>
                          )}
                        </>
                      )
                    })()}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-white/60 mt-8 text-sm"
            >
              Registrace probíhá přes systém DDM Praha 6. Po přihlášení vám přijde potvrzení emailem.
            </motion.p>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding bg-gray-50">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="heading-2 text-gray-900 mb-4 text-center">
                Časté dotazy <span className="text-gradient">k táboru</span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 text-center">
                Nenašli jste odpověď?{' '}
                <Link href="/kontakt" className="text-primary-600 hover:underline font-medium">
                  Kontaktujte nás
                </Link>
              </p>

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                {campFaqs.map((faq, index) => (
                  <FAQItem key={faq.question} {...faq} index={index} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section-padding bg-gradient-to-br from-primary-600 via-accent-600 to-trust-600">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-2 text-white mb-6">
                Připravte své dítě na budoucnost
              </h2>
              <p className="text-xl text-white/90 mb-8">
                3D tisk, programování a virtuální realita – technologie, které budou formovat svět.
                Ať je vaše dítě součástí.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#terminy"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-100 text-primary-600 font-semibold rounded-xl transition-all duration-300"
                >
                  Vybrat termín
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300"
                >
                  Máte dotazy?
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
