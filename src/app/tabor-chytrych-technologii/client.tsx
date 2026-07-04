'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Printer, Cpu, Glasses, Clock, MapPin, Calendar, Users, Utensils, Laptop, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState, useEffect } from 'react'
import { trackRegistrationClick } from '@/lib/analytics'
import { GallerySection, GalleryImage } from '@/components/sections/GallerySection'
import { FAQAccordion } from '@/components/camps/TermsList'
import type { TermDisplay } from '@/lib/camps'

const galleryImages: GalleryImage[] = [
  { src: '/images/gallery/3d-prints-collection.jpg', alt: 'Kolekce výtisků z tábora', featured: true },
  { src: '/images/gallery/3d-uv-curing.jpg', alt: 'UV vytvrzování resinových výtisků', featured: true },
  { src: '/images/gallery/3d-dragon-hands.jpg', alt: 'Liška z 3D tiskárny' },
  { src: '/images/gallery/iot-arduino-breadboard.jpg', alt: 'Práce s Arduino breadboardem' },
  { src: '/images/gallery/3d-cat-lowpoly.jpg', alt: 'Low-poly kočka' },
  { src: '/images/gallery/iot-plant-sensor.jpg', alt: 'IoT senzor na květině' },
  { src: '/images/gallery/3d-dragon-desk.jpg', alt: 'Oranžová liška na stole' },
  { src: '/images/gallery/iot-arduino-programming.jpg', alt: 'Programování Arduina' },
  { src: '/images/gallery/3d-resin-figurines.jpg', alt: 'Resinové figurky' },
  { src: '/images/gallery/iot-breadboard-detail.jpg', alt: 'Detail breadboardu s LEDkami' },
  { src: '/images/gallery/3d-printer-slicer.jpg', alt: 'Práce s 3D tiskárnou a slicerem' },
  { src: '/images/gallery/3d-printers-row.jpg', alt: 'Řada Prusa tiskáren' },
  { src: '/images/gallery/iot-plant-sensor-2.jpg', alt: 'Chytré zavlažování květin' },
  { src: '/images/gallery/iot-circuit-design.jpg', alt: 'Návrh IoT obvodu' },
]

// MIX weekend terms come from server props now (see TaborChytrychTechnologiiClient).
// The confirmedMixTerms prop carries open/open_with_link camps.

const sobotaProgram = [
  { time: '8:30', title: 'Příchod dětí', description: '' },
  { time: '9:00', title: 'Seznámení a úvod', description: 'Představení lektorů, organizační info a úvod do programu tábora.' },
  { time: '9:30', title: '3D tisk – teorie', description: 'Základní principy fungování tiskárny, jak najít model online a základy přípravy pro tisk.' },
  { time: '10:00', title: '3D tisk – praxe', description: 'Praktické ovládání tiskárny, spuštění prvních tisků od začátku do konce.' },
  { time: '10:30', title: 'Přestávka', description: 'Svačina a pití.' },
  { time: '10:45', title: 'Virtuální realita', description: 'VR headsety, interaktivní výzvy a zážitky.' },
  { time: '12:00', title: 'Oběd', description: 'Zajištěný oběd pro všechny účastníky.' },
  { time: '13:00', title: 'Poobědová pauza', description: 'Venkovní aktivita (v případě špatného počasí organizovaný program uvnitř).' },
  { time: '14:00', title: 'Návrh vlastního modelu', description: 'Základy modelování v jednoduchém programu, tisk vymodelovaného objektu.' },
  { time: '15:00', title: 'Přestávka', description: 'Odpolední pauza.' },
  { time: '15:15', title: '3D tisk – samostatná práce', description: 'Samostatné modelování, individuální příprava tisku pro vlastní objekty.' },
  { time: '16:30', title: 'Postupný odchod', description: 'Prostor pro dotazy rodičů.' },
]

const nedeleProgram = [
  { time: '8:30', title: 'Příchod dětí', description: '' },
  { time: '9:00', title: 'Kontrola a vyjmutí tisků', description: 'Prohlídka modelů vytištěných přes noc.' },
  { time: '9:30', title: 'Úvod do IoT', description: 'Co je to IoT a k čemu slouží. Seznámení s Arduinem.' },
  { time: '10:30', title: 'Přestávka', description: 'Svačina a pití.' },
  { time: '10:45', title: 'Arduino I', description: 'Seznámení s Arduinem, první Arduino projekt.' },
  { time: '12:00', title: 'Oběd', description: 'Zajištěný oběd pro všechny účastníky.' },
  { time: '13:00', title: 'Poobědová pauza', description: 'Venkovní aktivita (v případě špatného počasí organizovaný program uvnitř).' },
  { time: '14:00', title: 'Arduino II', description: 'Pokračování s Arduino projekty.' },
  { time: '15:00', title: 'Přestávka', description: 'Odpolední pauza.' },
  { time: '15:15', title: 'IoT zařízení', description: 'Výroba chytrého zařízení, které si děti odnesou domů.' },
  { time: '16:30', title: 'Postupný odchod', description: 'Předání vytisknutých modelů, prostor pro dotazy rodičů.' },
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

interface TaborChytrychTechnologiiClientProps {
  confirmedMixTerms: TermDisplay[]
}

export default function TaborChytrychTechnologiiClient({
  confirmedMixTerms,
}: TaborChytrychTechnologiiClientProps) {
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

  function getSpotsLeft(termin: TermDisplay): number {
    const live = termin.ddmId ? liveCapacity[termin.ddmId] : undefined
    return live ? live.spotsLeft : Math.max(0, termin.capacity - termin.enrolledCount)
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-night">
          <div className="absolute inset-0 opacity-20 pointer-events-none noise" />
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/images/hwlab/hwlab-7972.webp"
              alt="Tábor chytrých technologií - děti pracují s 3D tiskárnami a VR"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={75}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-night/95 via-night/85 to-night/60" />

          <div className="section-container relative z-10">
            <div className="max-w-3xl">
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <p className="data-label mb-4">TÁBORY / VÍKENDOVÝ TÁBOR</p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="heading-1 text-white mb-6"
              >
                Tábor chytrých technologií
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed"
              >
                Za jeden víkend si vaše dítě vyzkouší 3D tisk, naprogramuje IoT projekt
                na Micro:bitu a prozkoumá virtuální realitu.
                <span className="text-white font-medium"> Pro děti 10–15 let.</span>
              </motion.p>

              {/* Spec sheet */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl"
              >
                {[
                  { label: 'VĚK', value: '10–15 let' },
                  { label: 'KAPACITA', value: 'Max 15' },
                  { label: 'CENA', value: '2 990 Kč' },
                  { label: 'ČAS', value: '9:00–17:00' },
                ].map((spec, i) => (
                  <div key={i} className="card-glow p-4">
                    <p className="data-label text-xs mb-2">{ spec.label }</p>
                    <p className="font-display text-white text-lg">{spec.value}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a
                  href="#terminy"
                  className="btn-primary inline-flex items-center justify-center"
                >
                  Vybrat termín a přihlásit se
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <a
                  href="#program"
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  Co děti čeká
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* O programu */}
        <section id="program" className="section-padding bg-night scroll-mt-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <p className="data-label mb-4">PROGRAM</p>
              <h2 className="heading-2 text-white mb-4">
                3 technologie, <span className="text-primary-400">jeden víkend</span>
              </h2>
              <p className="text-lg text-slate-300">
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
                  primary: { bg: 'bg-primary-400/10', icon: 'text-primary-400', badge: 'bg-primary-400/20 text-primary-300' },
                  trust: { bg: 'bg-trust-400/10', icon: 'text-trust-400', badge: 'bg-trust-400/20 text-trust-300' },
                  accent: { bg: 'bg-accent-400/10', icon: 'text-accent-400', badge: 'bg-accent-400/20 text-accent-300' },
                }
                const colors = colorMap[tech.color as keyof typeof colorMap]

                return (
                  <motion.div
                    key={tech.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="card-glow p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                        <tech.icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      <p className="data-label text-xs">{tech.day}</p>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">{tech.title}</h3>
                    <p className="text-slate-400 mb-4">{tech.description}</p>

                    <ul className="space-y-2">
                      {tech.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
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
        <section id="harmonogram" className="section-padding bg-night scroll-mt-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="data-label mb-4">HARMONOGRAM</p>
              <h2 className="heading-2 text-white mb-4">
                Program <span className="text-primary-400">víkendu</span>
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Dva dny plné tvoření. Příchod od 8:30, program 9:00–16:30. Střídáme tvoření, přestávky i venkovní aktivity.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Sobota */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="pl-4">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                    <Printer className="w-5 h-5 text-primary-400" />
                    Sobota – 3D tisk
                  </h3>
                  <div className="space-y-0 border-l border-white/15">
                    {sobotaProgram.map((item, i) => (
                      <div key={i} className="pb-6 pl-6 relative">
                        <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-accent-400 -ml-1 mt-1" />
                        <p className="font-mono text-sm text-accent-400 mb-1">{item.time}</p>
                        <p className="text-white font-semibold text-sm">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Nedele */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="pl-4">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-trust-400" />
                    Neděle – IoT & VR
                  </h3>
                  <div className="space-y-0 border-l border-white/15">
                    {nedeleProgram.map((item, i) => (
                      <div key={i} className="pb-6 pl-6 relative">
                        <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-accent-400 -ml-1 mt-1" />
                        <p className="font-mono text-sm text-accent-400 mb-1">{item.time}</p>
                        <p className="text-white font-semibold text-sm">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Praktické informace */}
        <section className="section-padding bg-night">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <p className="data-label text-center mb-4">PRAKTICKÉ INFORMACE</p>
              <h2 className="heading-2 text-white mb-8 text-center">
                Co byste měli vědět
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
                    text: 'Maximálně 15 dětí na termín. Menší skupinka zajišťuje individuální přístup lektorů ke každému dítěti.',
                  },
                  {
                    icon: Clock,
                    title: 'Čas',
                    text: 'Sobota i neděle, příchod od 8:30, program 9:00–16:30, odchod do 17:00.',
                  },
                ].map((info, i) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-5 card-glow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-400/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{info.title}</h3>
                      <p className="text-sm text-slate-400">{info.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Galerie */}
        <GallerySection
          images={galleryImages}
          accentColor="primary"
          title="Co si děti odnesou domů"
          subtitle="Podívejte se na ukázky projektů, které děti vytvořily na našich táborech"
        />

        {/* Termíny a registrace */}
        <section id="terminy" className="section-padding bg-night scroll-mt-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="data-label mb-4">TERMÍNY</p>
              <h2 className="heading-2 text-white mb-4">
                {confirmedMixTerms.length > 0 ? 'Potvrzené termíny' : 'Jarní termíny proběhly'}
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                {confirmedMixTerms.length > 0
                  ? 'Víkendový tábor So+Ne, 9:00–17:00. Registrace přes DDM Praha 6.'
                  : 'Nové termíny právě chystáme. Ozvěte se nám a dáme vám včas vědět.'}
              </p>
              <p className="text-lg text-white mt-2">
                Cena: <span className="font-bold">2 990 Kč</span> <span className="text-slate-400">za víkend (vč. obědů a materiálů)</span>
              </p>
            </motion.div>

            {confirmedMixTerms.length > 0 && (
              <div className="max-w-md mx-auto">
                {confirmedMixTerms.map((termin, index) => (
                  <motion.div
                    key={termin.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="card-glow overflow-hidden"
                  >
                    <div className="h-1 bg-primary-400" />
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-primary-400" />
                        <h3 className="text-lg font-bold text-white">{termin.weekendDateLabel}</h3>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="font-medium">{termin.location || 'HWLab Praha'}</span>
                        </div>
                        {termin.locationDetail && (
                          <p className="text-xs text-slate-400 ml-6">{termin.locationDetail}</p>
                        )}
                      </div>

                      {(() => {
                        const spots = getSpotsLeft(termin)
                        const isFull = spots <= 0
                        const isLow = spots > 0 && spots <= 3
                        return (
                          <>
                            <div className="flex items-center gap-2 mb-6 text-sm">
                              <div className={`w-2 h-2 rounded-full ${isFull ? 'bg-red-500' : isLow ? 'bg-cta-500' : 'bg-trust-500'}`} />
                              <span className={`font-medium ${isFull ? 'text-red-400' : isLow ? 'text-cta-400' : 'text-trust-400'}`}>
                                {isFull ? 'Obsazeno' : `${spots} volných míst`}
                              </span>
                            </div>

                            {isFull || !termin.registrationUrl ? (
                              <span className="w-full inline-flex items-center justify-center px-6 py-3 bg-slate-500 text-white font-semibold rounded-lg opacity-50 cursor-not-allowed text-sm">
                                {isFull ? 'Obsazeno' : 'Registrace připravujeme'}
                              </span>
                            ) : (
                              <a
                                href={termin.registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary inline-flex items-center justify-center w-full"
                                onClick={() => trackRegistrationClick({
                                  termId: termin.ddmId || termin.id,
                                  termDates: termin.weekendDateLabel,
                                  termLocation: termin.location || 'HWLab Praha',
                                  spotsAvailable: spots,
                                  outboundUrl: termin.registrationUrl!,
                                  campType: 'weekend',
                                })}
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
            )}

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-slate-400 mt-8 text-sm"
            >
              Registrace probíhá přes systém DDM Praha 6. Po přihlášení vám přijde potvrzení emailem.
            </motion.p>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding bg-night">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <p className="data-label text-center mb-4">DOTAZY</p>
              <h2 className="heading-2 text-white mb-4 text-center">
                Časté dotazy <span className="text-primary-400">k táboru</span>
              </h2>
              <p className="text-lg text-slate-300 mb-10 text-center">
                Nenašli jste odpověď?{' '}
                <Link href="/kontakt" className="text-accent-400 hover:text-accent-300 font-medium">
                  Kontaktujte nás
                </Link>
              </p>

              <FAQAccordion items={campFaqs} focusRingClass="focus:ring-primary-400" />
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section-padding bg-night-800">
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
              <p className="text-xl text-slate-300 mb-8">
                3D tisk, programování a virtuální realita – technologie, které budou formovat svět.
                Ať je vaše dítě součástí.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#terminy"
                  className="btn-primary inline-flex items-center justify-center"
                >
                  Vybrat termín
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <Link
                  href="/kontakt"
                  className="btn-secondary inline-flex items-center justify-center"
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
