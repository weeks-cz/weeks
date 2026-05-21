'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Printer, Cpu, Glasses, Clock, MapPin, Calendar, Users, Utensils, Laptop, Check, Sparkles, Sun } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState, useEffect } from 'react'
import { trackRegistrationClick, trackInterestSubmit } from '@/lib/analytics'
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
// The confirmedMixTerms prop carries open/open_with_link camps; summerWeekends
// carries collecting_interest camps for the multi-select interest form.

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

function SummerInterestForm({ summerWeekends }: { summerWeekends: TermDisplay[] }) {
  const [selected, setSelected] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleWeekend = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const selectAll = () => {
    if (selected.length === summerWeekends.length) {
      setSelected([])
    } else {
      setSelected(summerWeekends.map(w => w.id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selected.length === 0) return
    setIsSubmitting(true)
    setError(null)

    const selectedLabels = summerWeekends
      .filter(w => selected.includes(w.id))
      .map(w => w.weekendDateLabel)
      .join(', ')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          program: 'mix-leto',
          termin: `Léto 2026: ${selectedLabels}`,
          gdprConsent,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Něco se pokazilo')

      setIsSubmitted(true)
      trackInterestSubmit({
        programId: 'mix',
        programTitle: 'Tábor chytrých technologií – léto',
        termin: selectedLabels,
        campType: 'weekend',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se odeslat. Zkuste to znovu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 text-center"
      >
        <div className="w-14 h-14 bg-trust-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Děkujeme za váš zájem!</h3>
        <p className="text-white/70">
          Budeme vás kontaktovat nejpozději 14 dní před otevřením registrace
          na vámi vybrané termíny.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8">
      <p className="text-white/70 text-sm mb-6">
        Vyberte víkendy, které vám vyhovují. Můžete vybrat více termínů.
        Nejpozději 14 dní předem vás budeme informovat o otevření registrace.
        <span className="text-white font-medium"> Nezavazujete se k ničemu.</span>
      </p>

      {/* Select all */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-white/50">
          {selected.length > 0 ? `Vybráno: ${selected.length} z ${summerWeekends.length}` : 'Žádný termín nevybrán'}
        </span>
        <button
          type="button"
          onClick={selectAll}
          className="text-xs text-cta-300 hover:text-cta-200 font-medium transition-colors"
        >
          {selected.length === summerWeekends.length ? 'Zrušit výběr' : 'Vybrat vše'}
        </button>
      </div>

      {/* Weekend checkboxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {summerWeekends.map(weekend => {
          const isSelected = selected.includes(weekend.id)
          return (
            <button
              key={weekend.id}
              type="button"
              onClick={() => toggleWeekend(weekend.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-cta-500/20 border-cta-400/50 text-white'
                  : 'bg-white/5 border-white/15 text-white/70 hover:bg-white/10 hover:border-white/25'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected ? 'bg-cta-500 border-cta-500' : 'border-white/30'
              }`}>
                {isSelected && <Check className="w-3 h-3 text-gray-900" />}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0 opacity-60" />
                <span className="text-sm font-medium">{weekend.weekendDateLabel}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Email + submit */}
      <div className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="váš@email.cz"
          className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cta-400"
          required
        />
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="summer-gdpr"
            checked={gdprConsent}
            onChange={(e) => setGdprConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 text-cta-500 focus:ring-cta-500"
            required
          />
          <label htmlFor="summer-gdpr" className="text-xs text-white/50 cursor-pointer">
            Souhlasím se{' '}
            <Link href="/gdpr" className="underline hover:text-white">
              zpracováním osobních údajů
            </Link>
          </label>
        </div>
        {error && (
          <p className="text-sm text-red-300">{error}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !gdprConsent || !email.trim() || selected.length === 0}
          className="w-full py-3 px-6 bg-cta-500 hover:bg-cta-400 text-gray-900 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Odesílám...' : `Nezávazná registrace${selected.length > 0 ? ` (${selected.length} ${selected.length === 1 ? 'termín' : selected.length < 5 ? 'termíny' : 'termínů'})` : ''}`}
        </button>
      </div>
    </form>
  )
}

interface TaborChytrychTechnologiiClientProps {
  confirmedMixTerms: TermDisplay[]
  summerWeekends: TermDisplay[]
}

export default function TaborChytrychTechnologiiClient({
  confirmedMixTerms,
  summerWeekends,
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
                    text: 'Sobota i neděle, příchod od 8:30, program 9:00–16:30, odchod do 17:00.',
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

        {/* Galerie */}
        <GallerySection
          images={galleryImages}
          accentColor="primary"
          title="Co si děti odnesou domů"
          subtitle="Podívejte se na ukázky projektů, které děti vytvořily na našich táborech"
        />

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
                {confirmedMixTerms.length > 0 ? 'Potvrzené termíny' : 'Jarní termíny proběhly'}
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                {confirmedMixTerms.length > 0
                  ? 'Víkendový tábor So+Ne, 9:00–17:00. Registrace přes DDM Praha 6.'
                  : <>Podívejte se na <a href="#leto" className="underline hover:text-white">letní termíny</a> níže.</>}
              </p>
              <p className="text-lg text-white/70 mt-2">
                Cena: <span className="font-bold text-white">2 990 Kč</span> za víkend (vč. obědů a materiálů)
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
                        <h3 className="text-lg font-bold text-gray-900">{termin.weekendDateLabel}</h3>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="font-medium">{termin.location || 'HWLab Praha'}</span>
                        </div>
                        {termin.locationDetail && (
                          <p className="text-xs text-gray-500 ml-6">{termin.locationDetail}</p>
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

        {/* Letní tábory 2026 */}
        <section id="leto" className="section-padding bg-gradient-to-br from-cta-600 via-cta-700 to-primary-800 scroll-mt-24 relative overflow-hidden">
          {/* Decorative sun element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cta-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/10 rounded-full blur-3xl" />

          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-cta-200 mb-6 border border-white/10">
                <Sun className="w-4 h-4" />
                Léto 2026
              </div>
              <h2 className="heading-2 text-white mb-4">
                Letní víkendové tábory
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Sbíráme zájem o letní termíny. Vyberte víkendy, které se vám hodí,
                a my vás budeme včas informovat.
              </p>
              <p className="text-lg text-white/70 mt-2">
                Cena: <span className="font-bold text-white">2 990 Kč</span> za víkend (So + Ne, vč. obědů a materiálů)
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 overflow-hidden">
                <div className="px-6 pt-6 md:px-8 md:pt-8 pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Sun className="w-6 h-6 text-cta-300" />
                    <h3 className="text-lg font-bold text-white">Nezávazná registrace – léto 2026</h3>
                  </div>
                </div>
                <SummerInterestForm summerWeekends={summerWeekends} />
              </div>
            </motion.div>
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

              <FAQAccordion items={campFaqs} focusRingClass="focus:ring-primary-500" />
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
