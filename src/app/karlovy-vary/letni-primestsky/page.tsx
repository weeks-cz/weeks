'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Printer, Cpu, Clock, MapPin,
  Calendar, Users, Utensils, ChevronDown, Check, Sparkles, Box,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLocation } from '@/contexts/LocationContext'
import { buildPath } from '@/lib/locations'

const weeklyDays = [
  {
    day: 'Pondělí',
    icon: Printer,
    color: 'primary',
    title: '3D tisk — základy',
    description: 'Úvod do světa 3D tisku. Jak tiskárna funguje, jak najít a připravit model a jak ho poslat na tisk. Každý si spustí svůj první výtisk.',
    highlights: ['Princip FDM tisku', 'Práce s modelem online', 'Spuštění prvního tisku'],
  },
  {
    day: 'Úterý',
    icon: Box,
    color: 'accent',
    title: '3D modelování',
    description: 'Z hotových modelů k vlastním kreacím. Děti se naučí základy 3D modelování a navrhnou vlastní objekt, který si druhý den vytisknou.',
    highlights: ['Základy 3D softwaru', 'Vlastní návrh modelu', 'Příprava pro tisk'],
  },
  {
    day: 'Středa',
    icon: Printer,
    color: 'primary',
    title: '3D tisk vlastních modelů',
    description: 'Tisk vlastních návrhů z úterý, dokončování, broušení a finální úpravy. Vše si děti odnesou domů.',
    highlights: ['Tisk vlastních modelů', 'Post-processing', 'Hotové výtisky domů'],
  },
  {
    day: 'Čtvrtek',
    icon: Cpu,
    color: 'trust',
    title: 'IoT & Arduino — úvod',
    description: 'Co je to IoT a k čemu slouží. Seznámení s Arduinem a Micro:bitem, práce se senzory a LED diodami, první programy.',
    highlights: ['Arduino & Micro:bit', 'Senzory a LED', 'První IoT obvod'],
  },
  {
    day: 'Pátek',
    icon: Cpu,
    color: 'trust',
    title: 'IoT projekt + výstava',
    description: 'Dokončení vlastního IoT zařízení a malá výstava pro rodiče. Děti prezentují, co za týden vytvořily, a odnesou si svůj projekt domů.',
    highlights: ['Vlastní IoT zařízení', 'Prezentace pro rodiče', 'Projekt domů'],
  },
]

const dailySchedule = [
  { time: '8:00', title: 'Příchod dětí', description: '' },
  { time: '8:30', title: 'Ranní rozcvička', description: 'Krátká hra nebo výzva na rozehřátí před hlavním programem.' },
  { time: '9:00', title: 'Výukový blok I', description: 'Hlavní téma dne — výuka s lektorem, ukázky, diskuze.' },
  { time: '10:30', title: 'Přestávka', description: 'Svačina a pití.' },
  { time: '10:45', title: 'Výukový blok II', description: 'Praktická část — děti pracují samostatně nebo ve dvojicích na svém projektu.' },
  { time: '12:00', title: 'Oběd', description: 'Zajištěný oběd pro všechny účastníky (v ceně tábora).' },
  { time: '13:00', title: 'Venkovní aktivita', description: 'Pohyb, vzduch, hry. V případě špatného počasí organizovaný program uvnitř.' },
  { time: '14:00', title: 'Odpolední blok', description: 'Pokračování práce na projektech, nová témata nebo kreativní výzvy.' },
  { time: '15:00', title: 'Přestávka', description: 'Odpolední pauza a svačina.' },
  { time: '15:15', title: 'Tvůrčí práce', description: 'Samostatná práce na vlastním projektu, individuální přístup lektorů.' },
  { time: '16:00', title: 'Postupný odchod', description: 'Shrnutí dne, prostor pro dotazy rodičů.' },
]

const campFaqs = [
  {
    question: 'Co má dítě mít s sebou?',
    answer: 'Jen dobrou náladu a svačinu na dopoledne a odpoledne. Oběd zajišťujeme my každý den. Veškeré technické vybavení, tiskárny, Arduina, VR headsety i materiály jsou na místě.',
  },
  {
    question: 'Co si dítě odnese domů?',
    answer: 'Vlastnoručně navržený a vytisknutý 3D model (i více), vlastní IoT zařízení sestavené na Arduinu nebo Micro:bitu a spoustu nových zkušeností. V pátek odpoledne pořádáme malou výstavu pro rodiče.',
  },
  {
    question: 'Je potřeba nějaká předchozí zkušenost?',
    answer: 'Ne, program je navržen pro začátečníky i mírně pokročilé. Lektoři přizpůsobí obtížnost každému dítěti — začátečníci dostávají asistenci, pokročilí složitější výzvy.',
  },
  {
    question: 'Je zajištěn oběd pro děti s alergiemi?',
    answer: 'Ano, při registraci se ptáme na stravovací omezení a alergie. Spolupracujeme s dodavatelem, který dokáže připravit alternativní varianty.',
  },
  {
    question: 'Jak probíhá platba?',
    answer: 'Platba probíhá bezpečně kartou online přímo při registraci. Fakturu obdržíte automaticky emailem.',
  },
  {
    question: 'Kde přesně tábor probíhá?',
    answer: 'Ve FabLabu v Kreativním centru Vary&Te, Dykova, Stará Role — největším kreativním centru v Karlovarském kraji s profesionálním zázemím pro 3D tisk, VR a IoT.',
  },
]

const colorMap = {
  primary: {
    bg: 'bg-primary-50', icon: 'text-primary-600',
    badge: 'bg-primary-100 text-primary-700',
    gradient: 'from-primary-600 to-primary-500',
    check: 'text-primary-500',
  },
  accent: {
    bg: 'bg-accent-50', icon: 'text-accent-600',
    badge: 'bg-accent-100 text-accent-700',
    gradient: 'from-accent-600 to-accent-500',
    check: 'text-accent-500',
  },
  trust: {
    bg: 'bg-trust-50', icon: 'text-trust-600',
    badge: 'bg-trust-100 text-trust-700',
    gradient: 'from-trust-600 to-trust-500',
    check: 'text-trust-500',
  },
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
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

export default function LetniPrimestskyCampPage() {
  const location = useLocation()
  const program = location.programs.find(p => p.id === 'letni-primestsky')
  const terms = location.terms.filter(t => t.program === 'letni-primestsky')

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/program-mix.webp"
              alt="Letní příměstský tábor chytrých technologií Karlovy Vary"
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
                <Link href={buildPath(location, '')} className="text-gray-400 hover:text-primary-400 transition-colors">
                  Domů
                </Link>
                <span className="text-gray-500 mx-2">/</span>
                <span className="text-white font-medium">Letní příměstský tábor</span>
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium mb-6 border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-cta-400" />
                <span>Pondělí – Pátek</span>
                <span className="w-px h-4 bg-white/30" />
                <span className="text-cta-400">8:00 – 16:00</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
              >
                Letní příměstský tábor{' '}
                <span className="bg-gradient-to-r from-accent-400 via-primary-400 to-accent-400 bg-clip-text text-transparent">
                  chytrých technologií
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
              >
                Celý týden 3D tisk, 3D modelování a IoT s Arduinem — ve FabLabu
                Kreativního centra Vary&Te v Karlových Varech.{' '}
                <span className="text-white font-medium">Pro děti 10–15 let.</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a
                  href="#registrace"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-cta-500 hover:bg-cta-400 text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-cta-500/30 hover:-translate-y-0.5"
                >
                  Přihlásit dítě
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
                  { icon: Calendar, label: '5 dní', sublabel: 'Po – Pá' },
                  { icon: Clock, label: '8:00–16:00', sublabel: 'každý den' },
                  { icon: Users, label: 'Max 12', sublabel: 'dětí' },
                  { icon: Utensils, label: 'Obědy', sublabel: 'v ceně' },
                ].map((fact, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <fact.icon className="w-5 h-5 text-accent-400 flex-shrink-0" />
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
                3 technologie, <span className="text-gradient">jeden týden</span>
              </h2>
              <p className="text-lg text-gray-600">
                Týden je rozdělený na dva tematické bloky — první tři dny věnujeme
                3D tisku a modelování, ve čtvrtek a v pátek se vrhneme na IoT s Arduinem.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Printer, color: 'primary', title: '3D tisk', day: 'Po + St', description: 'Od stažených modelů přes vlastní návrhy až po hotové výtisky. Děti pracují na profesionálních tiskárnách FabLabu.', highlights: ['FDM tisk', 'Profi tiskárny', 'Výtisky domů'] },
                { icon: Box, color: 'accent', title: '3D modelování', day: 'Úterý', description: 'Z hotových modelů k vlastním kreacím. Děti navrhnou vlastní objekt, který si druhý den vytisknou.', highlights: ['Základy 3D softwaru', 'Vlastní návrh', 'Příprava pro tisk'] },
                { icon: Cpu, color: 'trust', title: 'IoT & Arduino', day: 'Čt + Pá', description: 'Práce se senzory, LED a mikropočítači. Každé dítě postaví vlastní chytré zařízení a odnese si ho domů.', highlights: ['Arduino & Micro:bit', 'Senzory a LED', 'IoT projekt domů'] },
              ].map((tech, index) => {
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
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{tech.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{tech.description}</p>
                    <ul className="space-y-2">
                      {tech.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className={`w-4 h-4 ${colors.check} flex-shrink-0`} />
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

        {/* Týdenní přehled */}
        <section id="harmonogram" className="section-padding bg-gray-50 scroll-mt-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="heading-2 text-gray-900 mb-4">
                Týdenní <span className="text-gradient">přehled</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Každý den nové téma. Projekty na sebe navazují — to, co dítě vytvoří v pondělí, si v pátek odnese domů.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {weeklyDays.map((day, index) => {
                const colors = colorMap[day.color as keyof typeof colorMap]
                return (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                  >
                    <div className={`bg-gradient-to-r ${colors.gradient} p-4`}>
                      <p className="text-xs font-semibold text-white/80 uppercase tracking-wide mb-1">{day.day}</p>
                      <div className="flex items-center gap-2">
                        <day.icon className="w-5 h-5 text-white" />
                        <h3 className="text-sm font-bold text-white">{day.title}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-600 mb-3">{day.description}</p>
                      <ul className="space-y-1.5">
                        {day.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-gray-700">
                            <Check className={`w-3.5 h-3.5 ${colors.check} flex-shrink-0`} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Denní harmonogram */}
        <section className="section-padding bg-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="heading-2 text-gray-900 mb-4">
                Typický <span className="text-gradient">den tábora</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Střídáme tvoření, přestávky a venkovní aktivity. Rodiče mají klid — děti jsou v rukou zkušených lektorů od 8:00 do 16:00.
              </p>
            </motion.div>

            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-accent-600 to-primary-600 p-5">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Denní harmonogram</h3>
                    <p className="text-sm text-white/80">Pondělí – Pátek, 8:00 – 16:00</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                {dailySchedule.map((item, i) => (
                  <div key={i} className={`flex gap-4 py-3 ${i < dailySchedule.length - 1 ? 'border-b border-gray-100' : ''}`}>
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
        </section>

        {/* Praktické informace */}
        <section className="section-padding bg-gray-50">
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
                    text: 'Oběd každý den v ceně. Na dopoledne a odpoledne si děti přinesou vlastní svačinu. Pitný režim zajištěn po celý den.',
                  },
                  {
                    icon: Printer,
                    title: 'Vybavení',
                    text: 'Profesionální FabLab vybavení — průmyslové 3D tiskárny, VR headsety, Arduino soupravy a počítače. Děti nenosí nic technického.',
                  },
                  {
                    icon: Users,
                    title: 'Kapacita',
                    text: 'Maximálně 12 dětí na turnus. Poměr lektorů 1 : 5 zajišťuje individuální přístup a bezpečnost každého dítěte.',
                  },
                  {
                    icon: MapPin,
                    title: 'Místo',
                    text: 'FabLab v Kreativním centru Vary&Te, Dykova, Stará Role, Karlovy Vary. Největší kreativní centrum v Karlovarském kraji.',
                  },
                ].map((info, i) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-5 rounded-xl bg-white border border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-accent-600" />
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

        {/* Registrace */}
        <section id="registrace" className="section-padding bg-gradient-to-br from-accent-600 to-primary-700 scroll-mt-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="heading-2 text-white mb-4">
                Termín a registrace
              </h2>
              {program && (
                <p className="text-xl text-white/90">
                  Cena: <span className="font-bold text-white">{program.price.toLocaleString('cs-CZ')} Kč</span>{' '}
                  za celý týden (vč. obědů a materiálů)
                </p>
              )}
            </motion.div>

            <div className={`grid gap-6 max-w-4xl mx-auto ${terms.length === 1 ? 'sm:max-w-md' : 'sm:grid-cols-2'}`}>
              {program && terms.map((term, i) => {
                const start = new Date(term.startDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
                const end = new Date(term.endDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })
                const url = `/registrace?location=${location.id}&program=${program.id}&term=${term.id}`
                const isConfirmed = term.status === 'confirmed'
                return (
                  <motion.div
                    key={term.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-accent-600" />
                        <h3 className="text-lg font-bold text-gray-900">
                          {start} – {end}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">{location.venues[0].name}</span>
                      </div>
                      <p className="text-xs text-gray-500 ml-6 mb-4">{location.venues[0].address}, {location.venues[0].city}</p>

                      <div className="flex items-center gap-2 mb-6 text-sm">
                        <div className={`w-2 h-2 rounded-full ${isConfirmed ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        <span className={`font-medium ${isConfirmed ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {isConfirmed ? 'Registrace otevřena' : 'Připravujeme — registrace brzy otevřena'}
                        </span>
                      </div>

                      <Link
                        href={url}
                        className="w-full btn-primary justify-center"
                      >
                        {isConfirmed ? 'Závazná registrace' : 'Nezávazná registrace'}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                      <p className="text-xs text-gray-500 text-center mt-3">
                        5 kroků · platba kartou · faktura automaticky
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-white/60 mt-8 text-sm"
            >
              Registrace probíhá přímo přes systém Weeks. Po přihlášení vám přijde potvrzení emailem.
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
                <Link href={buildPath(location, 'kontakt')} className="text-primary-600 hover:underline font-medium">
                  Kontaktujte nás
                </Link>
              </p>

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                {campFaqs.map((faq) => (
                  <FAQItem key={faq.question} {...faq} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section-padding bg-gradient-to-br from-accent-600 via-primary-600 to-trust-600">
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
                3D tisk, 3D modelování a IoT — technologie, které budou formovat svět.
                Ať je vaše dítě součástí.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#registrace"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-100 text-primary-600 font-semibold rounded-xl transition-all duration-300"
                >
                  Přihlásit dítě
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <Link
                  href={buildPath(location, 'kontakt')}
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
