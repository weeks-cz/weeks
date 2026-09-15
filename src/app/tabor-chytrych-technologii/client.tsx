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
        <section className="relative bg-paper blueprint-grid border-b border-ink/15 overflow-hidden">
          <div className="section-container grid lg:grid-cols-12 gap-12 lg:gap-10 items-start pt-32 pb-16 md:pt-40 md:pb-20">
            <div className="lg:col-span-7">
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 font-mono text-xs uppercase tracking-[0.2em]"
              >
                <Link href="/" className="text-ink/50 hover:text-primary-600 transition-colors">
                  Domů
                </Link>
                <span className="text-ink/30 mx-2">/</span>
                <Link href="/program" className="text-ink/50 hover:text-primary-600 transition-colors">
                  Programy
                </Link>
                <span className="text-ink/30 mx-2">/</span>
                <span className="text-ink font-medium">Tábor chytrých technologií</span>
              </motion.div>

              {/* Mono kóta */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mono-label mb-6 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-primary-600" aria-hidden="true" />
                Sobota + Neděle · 9:00 – 17:00
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="heading-1 text-ink mb-6"
              >
                Tábor chytrých{' '}
                <span className="text-primary-600">technologií</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-ink-500 mb-8 max-w-2xl leading-relaxed"
              >
                Za jeden víkend si vaše dítě vyzkouší 3D tisk, naprogramuje IoT projekt
                na Micro:bitu a prozkoumá virtuální realitu.
                <span className="text-ink font-medium"> Pro děti 10–15 let.</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a
                  href="#terminy"
                  className="btn-primary group px-8 py-4"
                >
                  Vybrat termín a přihlásit se
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#program"
                  className="btn-outline px-8 py-4"
                >
                  Co děti čeká
                </a>
              </motion.div>

              {/* Spec sheet — technický štítek tábora */}
              <motion.dl
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 grid grid-cols-2 sm:grid-cols-4 border border-ink rounded-md overflow-hidden bg-white"
              >
                {[
                  { icon: Calendar, label: '2 dny', sublabel: 'So + Ne' },
                  { icon: Clock, label: '16 hodin', sublabel: 'programu' },
                  { icon: Users, label: 'Max 15', sublabel: 'dětí' },
                  { icon: Utensils, label: 'Obědy', sublabel: 'v ceně' },
                ].map((fact, i) => (
                  <div
                    key={i}
                    className={`p-4 border-ink/15 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${i > 0 ? 'sm:border-l' : ''}`}
                  >
                    <fact.icon className="w-4 h-4 text-primary-600 mb-2" aria-hidden="true" />
                    <dd className="font-display text-sm font-semibold text-ink">{fact.label}</dd>
                    <dt className="font-mono text-xs text-ink/50 uppercase tracking-wider mt-0.5">{fact.sublabel}</dt>
                  </div>
                ))}
              </motion.dl>
            </div>

            {/* Photo column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative lg:mt-16"
            >
              <div className="relative border border-ink rounded-md overflow-hidden shadow-hard bg-white">
                <Image
                  src="/images/hwlab/hwlab-7972.webp"
                  alt="Tábor chytrých technologií - děti pracují s 3D tiskárnami a VR"
                  width={880}
                  height={660}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover w-full aspect-[4/3]"
                  priority
                  quality={75}
                />
              </div>
              <p className="mono-label mt-4 text-right" aria-hidden="true">
                HWLab, Praha 6
              </p>
            </motion.div>
          </div>
        </section>

        {/* O programu */}
        <section id="program" className="section-padding bg-paper scroll-mt-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mb-16"
            >
              <p className="mono-label mb-4">Program</p>
              <h2 className="heading-2 text-ink mb-4">
                3 technologie, <span className="text-primary-600">jeden víkend</span>
              </h2>
              <p className="text-lg text-ink-500">
                Program je navržený tak, aby si děti vyzkoušely tři odlišné oblasti
                a zjistily, co je baví nejvíc.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  primary: { bg: 'bg-primary-600', text: 'text-primary-600' },
                  trust: { bg: 'bg-trust-600', text: 'text-trust-600' },
                  accent: { bg: 'bg-accent-500', text: 'text-accent-600' },
                }
                const colors = colorMap[tech.color as keyof typeof colorMap]

                return (
                  <motion.div
                    key={tech.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="card-maker p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-sm ${colors.bg} border border-ink flex items-center justify-center`}>
                        <tech.icon className="w-6 h-6 text-white" aria-hidden="true" />
                      </div>
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">
                        {tech.day}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-ink mb-3">{tech.title}</h3>
                    <p className="text-ink-500 mb-4">{tech.description}</p>

                    <ul className="space-y-2 border-t border-ink/15 pt-4">
                      {tech.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-ink">
                          <Check className={`w-4 h-4 ${colors.text} flex-shrink-0`} aria-hidden="true" />
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
        <section id="harmonogram" className="section-padding bg-paper-soft border-y border-ink/15 scroll-mt-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto mb-12"
            >
              <p className="mono-label mb-4">Harmonogram</p>
              <h2 className="heading-2 text-ink mb-4">
                Harmonogram <span className="text-primary-600">víkendu</span>
              </h2>
              <p className="text-lg text-ink-500">
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
                <div className="border border-ink rounded-md bg-white overflow-hidden">
                  <div className="flex items-center gap-3 pb-5 px-6 pt-6 mb-2 border-b border-ink/15">
                    <Printer className="w-6 h-6 text-primary-600" aria-hidden="true" />
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink">Sobota – 3D tisk</h3>
                      <p className="font-mono text-xs text-ink/50 uppercase tracking-wider">První kroky a vlastní 3D model</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-0">
                      {sobotaProgram.map((item, i) => (
                        <div key={i} className={`flex gap-4 py-3 ${i < sobotaProgram.length - 1 ? 'border-b border-ink/15' : ''}`}>
                          <span className="text-sm font-mono font-semibold text-ink w-12 flex-shrink-0">{item.time}</span>
                          <div>
                            <p className="font-display font-semibold text-ink text-sm leading-tight">{item.title}</p>
                            {item.description && (
                              <p className="text-xs text-ink-500 mt-0.5">{item.description}</p>
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
                <div className="border border-ink rounded-md bg-white overflow-hidden">
                  <div className="flex items-center gap-3 pb-5 px-6 pt-6 mb-2 border-b border-ink/15">
                    <Cpu className="w-6 h-6 text-accent-600" aria-hidden="true" />
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink">Neděle – IoT & VR</h3>
                      <p className="font-mono text-xs text-ink/50 uppercase tracking-wider">Programování a virtuální světy</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-0">
                      {nedeleProgram.map((item, i) => (
                        <div key={i} className={`flex gap-4 py-3 ${i < nedeleProgram.length - 1 ? 'border-b border-ink/15' : ''}`}>
                          <span className="text-sm font-mono font-semibold text-ink w-12 flex-shrink-0">{item.time}</span>
                          <div>
                            <p className="font-display font-semibold text-ink text-sm leading-tight">{item.title}</p>
                            {item.description && (
                              <p className="text-xs text-ink-500 mt-0.5">{item.description}</p>
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
        <section className="section-padding bg-paper">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <p className="mono-label mb-4">Praktické informace</p>
              <h2 className="heading-2 text-ink mb-8">
                Praktické <span className="text-primary-600">informace</span>
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
                    text: 'Sobota i neděle, příchod od 8:30, program 9:00–16:30, odchod do 17:00.',
                  },
                ].map((info, i) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="card-maker flex gap-4 p-5"
                  >
                    <div className="w-10 h-10 rounded-sm bg-white border border-ink/15 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-ink mb-1">{info.title}</h3>
                      <p className="text-sm text-ink-500">{info.text}</p>
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
        <section id="terminy" className="section-padding bg-ink text-paper blueprint-grid-dark border-y border-ink scroll-mt-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="mono-label-dark mb-4">Termíny</p>
              <h2 className="heading-2 text-paper mb-4">
                {confirmedMixTerms.length > 0 ? 'Potvrzené termíny' : 'Jarní termíny proběhly'}
              </h2>
              <p className="text-xl text-paper/90 max-w-2xl mx-auto">
                {confirmedMixTerms.length > 0
                  ? 'Víkendový tábor So+Ne, 9:00–17:00. Registrace přes DDM Praha 6.'
                  : 'Nové termíny právě chystáme. Ozvěte se nám a dáme vám včas vědět.'}
              </p>
              <p className="text-lg text-paper/70 mt-2">
                Cena: <span className="font-bold text-paper font-mono">2 990 Kč</span> za víkend (vč. obědů a materiálů)
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
                    className="bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        <h3 className="text-lg font-bold text-ink">{termin.weekendDateLabel}</h3>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-ink-500">
                          <MapPin className="w-4 h-4 text-ink/50 flex-shrink-0" />
                          <span className="font-medium">{termin.location || 'HWLab Praha'}</span>
                        </div>
                        {termin.locationDetail && (
                          <p className="text-xs text-ink-500 ml-6">{termin.locationDetail}</p>
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
                              <span className={`font-medium ${isFull ? 'text-red-600' : isLow ? 'text-cta-700' : 'text-trust-700'}`}>
                                {isFull ? 'Obsazeno' : `${spots} volných míst`}
                              </span>
                            </div>

                            {isFull || !termin.registrationUrl ? (
                              <span className="w-full btn-primary text-center justify-center opacity-50 cursor-not-allowed">
                                {isFull ? 'Obsazeno' : 'Registrace připravujeme'}
                              </span>
                            ) : (
                              <a
                                href={termin.registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full btn-primary text-center justify-center"
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
              className="text-center text-white/60 mt-8 text-sm"
            >
              Registrace probíhá přes systém DDM Praha 6. Po přihlášení vám přijde potvrzení emailem.
            </motion.p>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding bg-paper-soft border-b border-ink/15">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <p className="mono-label mb-4">FAQ</p>
              <h2 className="heading-2 text-ink mb-4">
                Časté dotazy <span className="text-primary-600">k táboru</span>
              </h2>
              <p className="text-lg text-ink-500 mb-10">
                Nenašli jste odpověď?{' '}
                <Link href="/kontakt" className="text-primary-600 hover:underline font-medium">
                  Kontaktujte nás
                </Link>
              </p>

              <FAQAccordion items={campFaqs} focusRingClass="focus:ring-primary-500" />
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section-padding bg-paper blueprint-grid">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-2 text-ink mb-6">
                Připravte své dítě na budoucnost
              </h2>
              <p className="text-xl text-ink-500 mb-8">
                3D tisk, programování a virtuální realita – technologie, které budou formovat svět.
                Ať je vaše dítě součástí.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#terminy"
                  className="btn-primary px-8 py-4"
                >
                  Vybrat termín
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <Link
                  href="/kontakt"
                  className="btn-outline px-8 py-4"
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
