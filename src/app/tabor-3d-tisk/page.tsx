'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Printer, Clock, Calendar, Users, Utensils, Laptop, ChevronDown, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { trackInterestSubmit, trackViewOneDayCamp, trackRegistrationFormOpen, trackRegistrationClick } from '@/lib/analytics'
import { GallerySection, GalleryImage } from '@/components/sections/GallerySection'

const galleryImages: GalleryImage[] = [
  { src: '/images/gallery/3d-prints-collection.jpg', alt: 'Kolekce výtisků z tábora', featured: true },
  { src: '/images/gallery/3d-uv-curing.jpg', alt: 'UV vytvrzování resinových výtisků', featured: true },
  { src: '/images/gallery/3d-dragon-hands.jpg', alt: 'Liška z 3D tiskárny' },
  { src: '/images/gallery/3d-cat-lowpoly.jpg', alt: 'Low-poly kočka' },
  { src: '/images/gallery/3d-dragon-desk.jpg', alt: 'Oranžová liška na stole' },
  { src: '/images/gallery/3d-resin-figurines.jpg', alt: 'Resinové figurky' },
  { src: '/images/gallery/3d-printer-slicer.jpg', alt: 'Práce s 3D tiskárnou a slicerem' },
  { src: '/images/gallery/3d-printers-row.jpg', alt: 'Řada Prusa tiskáren' },
]

// Potvrzené termíny s DDM registračními linky
const confirmedTerminy = [
  { id: '3d-19-04', date: '19. dubna 2026', day: 'neděle', label: 'Neděle 19. dubna', registrationUrl: 'https://www.ddmp6.cz/tabory/?id=775#js-application' },
  { id: '3d-16-05', date: '16. května 2026', day: 'sobota', label: 'Sobota 16. května', registrationUrl: 'https://www.ddmp6.cz/tabory/?id=786#js-application' },
]

// Připravované termíny
const pripravujemeTerminy = [
  { id: '3d-25-04', date: '25. dubna', day: 'sobota', label: 'Sobota 25. dubna' },
  { id: '3d-03-05', date: '3. května', day: 'neděle', label: 'Neděle 3. května' },
  { id: '3d-09-05', date: '9. května', day: 'sobota', label: 'Sobota 9. května' },
]

const printerModels = ['MK3S', 'MK4S', 'Mini+', 'CORE One', 'CORE One L', 'XL', 'SL1S']

const dayProgram = [
  { time: '8:30', title: 'Příchod dětí', description: '' },
  { time: '9:00', title: 'Seznámení a úvod', description: 'Představení lektorů, organizační info a úvod do programu.' },
  { time: '9:30', title: '3D tisk – teorie', description: 'Základní principy fungování tiskárny, jak najít model online a základy přípravy pro tisk.' },
  { time: '10:00', title: '3D tisk – praxe', description: 'Praktické ovládání tiskárny, spuštění prvních tisků od začátku do konce.' },
  { time: '10:30', title: 'Přestávka', description: 'Svačina a pití.' },
  { time: '10:45', title: 'Návrh vlastního modelu', description: 'Každý si navrhne vlastní 3D model v jednoduchém programu.' },
  { time: '12:00', title: 'Oběd', description: 'Zajištěný oběd pro všechny účastníky.' },
  { time: '13:00', title: 'Poobědová pauza', description: 'Venkovní aktivita (v případě špatného počasí organizovaný program uvnitř).' },
  { time: '14:00', title: 'Spuštění tisku a dokončení', description: 'Příprava modelu pro tisk, nastavení tiskárny, odstraňování podpor a kontrola kvality.' },
  { time: '15:00', title: 'Přestávka', description: 'Odpolední pauza.' },
  { time: '15:15', title: 'Samostatná práce', description: 'Samostatné modelování, individuální příprava tisku pro vlastní objekty.' },
  { time: '16:30', title: 'Postupný odchod', description: 'Děti si odnáší všechny své výtvory domů. Prostor pro dotazy rodičů.' },
]

const campFaqs = [
  {
    question: 'Je potřeba nějaká předchozí zkušenost s 3D tiskem?',
    answer: 'Ne, žádné předchozí zkušenosti nejsou potřeba. Program je navržený tak, aby zvládli i úplní začátečníci. Pokročilí dostanou složitější výzvy.',
  },
  {
    question: 'Co si děti odnesou domů?',
    answer: 'Každé dítě si odnese vlastní navržený a vytištěný 3D model – klíčenku, stojánek, hračku nebo jiný předmět podle vlastního návrhu.',
  },
  {
    question: 'Je oběd v ceně?',
    answer: 'Ano, oběd je zajištěný a v ceně tábora. Na dopoledne a odpoledne si děti přinesou vlastní svačinu. Pití je k dispozici po celý den.',
  },
  {
    question: 'Jaký je rozdíl oproti víkendovému táboru?',
    answer: 'Jednodenní tábor je zaměřený čistě na 3D tisk – za jeden den projdete celý proces od návrhu po hotový výtisk. Víkendový Tábor chytrých technologií kombinuje 3D tisk, IoT a virtuální realitu.',
  },
  {
    question: 'Kolik stojí jednodenní tábor?',
    answer: 'Cena je 1 490 Kč za jeden den (8 hodin programu, sobota nebo neděle dle termínu). Zahrnuje veškeré materiály, oběd a všechny vytvořené projekty si děti odnášejí domů.',
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

function InterestForm({ terminId, terminLabel, buttonLabel = 'Nezávazná registrace' }: { terminId: string; terminLabel: string; buttonLabel?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          program: '3d-tisk',
          termin: terminLabel,
          gdprConsent,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Něco se pokazilo')

      setIsSubmitted(true)
      trackInterestSubmit({
        programId: '3d-tisk',
        programTitle: '3D tisk',
        termin: terminLabel,
        campType: 'oneday',
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
        className="mt-4 p-4 bg-trust-50 border border-trust-200 rounded-xl text-center"
      >
        <Check className="w-6 h-6 text-trust-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-trust-800">Děkujeme! Dáme vám vědět.</p>
      </motion.div>
    )
  }

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => {
            setIsOpen(true)
            trackViewOneDayCamp('3d-tisk', `termin_${terminId}`)
            trackRegistrationFormOpen({
              programId: '3d-tisk',
              programTitle: '3D tisk',
              termin: terminLabel,
              campType: 'oneday',
            })
          }}
          className="btn-outline border-white/50 text-white hover:bg-white/10 inline-flex items-center gap-2"
        >
          {buttonLabel}
        </button>
      ) : (
        <AnimatePresence>
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="mt-4 space-y-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="váš@email.cz"
              className="w-full px-4 py-2.5 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
              required
            />
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id={`gdpr-${terminId}`}
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 text-primary-400 focus:ring-primary-400"
                required
              />
              <label htmlFor={`gdpr-${terminId}`} className="text-xs text-white/60 cursor-pointer">
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
              disabled={isSubmitting || !gdprConsent || !email.trim()}
              className="w-full btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Odesílám...' : 'Odeslat'}
            </button>
          </motion.form>
        </AnimatePresence>
      )}
    </div>
  )
}

export default function Tabor3DTiskPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/program-3dtisk.webp"
              alt="Jednodenní tábor 3D tisku - děti pracují s 3D tiskárnami"
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
                <span className="text-white font-medium">3D tisk</span>
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium mb-6 border border-white/20"
              >
                <Printer className="w-4 h-4 text-primary-400" />
                <span>Jednodenní tábor</span>
                <span className="w-px h-4 bg-white/30" />
                <span className="text-primary-400">9:00 – 17:00</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
              >
                Jednodenní tábor{' '}
                <span className="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                  3D tisku
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
              >
                Za jeden den si vaše dítě navrhne vlastní 3D model, vytiskne ho na profesionální
                tiskárně Prusa a odnese si ho domů.
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
                  Zobrazit termíny
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
                  { icon: Calendar, label: '1 den', sublabel: 'So / Ne' },
                  { icon: Clock, label: '8 hodin', sublabel: 'programu' },
                  { icon: Users, label: 'Max 15', sublabel: 'dětí' },
                  { icon: Utensils, label: 'Oběd', sublabel: 'v ceně' },
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
                Od nápadu k hotovému <span className="text-gradient">výrobku</span>
              </h2>
              <p className="text-lg text-gray-600">
                Za jeden den projdete celým procesem 3D tisku – od prvního návrhu po hotový výtisk,
                který si odnesete domů.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: 'Návrh modelu',
                  description: 'Děti si navrhnou vlastní 3D model v jednoduchém programu. Klíčenka, stojánek, hračka – záleží na fantazii.',
                  highlights: ['Základy 3D modelování', 'Vlastní návrh od nuly', 'Jednoduchý software'],
                },
                {
                  icon: Printer,
                  title: 'Tisk na tiskárně',
                  description: 'Model připravíme pro tisk a pustíme na profesionální 3D tiskárnu. Děti uvidí celý proces vrstvu po vrstvě.',
                  highlights: ['Příprava modelu pro tisk', 'Nastavení a spuštění tiskárny', 'Tisk vrstvu po vrstvě'],
                },
                {
                  icon: Check,
                  title: 'Dokončení a výsledek',
                  description: 'Hotový výtisk zkontrolujeme, odstraníme podpory a připravíme k předání. Každé dítě si odnese vlastní výrobek.',
                  highlights: ['Odstraňování podpor', 'Kontrola kvality tisku', 'Hotový výrobek domů'],
                },
              ].map((block, index) => (
                <motion.div
                  key={block.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                      <block.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
                      Krok {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{block.title}</h3>
                  <p className="text-gray-600 mb-4">{block.description}</p>

                  <ul className="space-y-2">
                    {block.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Naše tiskárny */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-sm font-medium text-gray-500 mb-4">Tiskneme na tiskárnách Prusa Research</p>
              <div className="flex flex-wrap justify-center gap-2">
                {printerModels.map(model => (
                  <span key={model} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100">
                    {model}
                  </span>
                ))}
              </div>
            </motion.div>
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
                Harmonogram <span className="text-gradient">dne</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Příchod od 8:30, program 9:00–16:30. Střídáme tvoření, přestávky i venkovní aktivity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-5">
                  <div className="flex items-center gap-3">
                    <Printer className="w-6 h-6 text-white" />
                    <div>
                      <h3 className="text-lg font-bold text-white">3D tisk – program dne</h3>
                      <p className="text-sm text-white/80">Od návrhu po hotový výtisk</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-0">
                    {dayProgram.map((item, i) => (
                      <div key={i} className={`flex gap-4 py-3 ${i < dayProgram.length - 1 ? 'border-b border-gray-100' : ''}`}>
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
                    text: 'Veškeré technické vybavení, počítače i 3D tiskárny Prusa jsou na místě. Děti nemusí nic nosit.',
                  },
                  {
                    icon: Users,
                    title: 'Kapacita',
                    text: 'Maximálně 15 dětí na termín. Menší skupinka zajišťuje individuální přístup lektorů ke každému dítěti.',
                  },
                  {
                    icon: Clock,
                    title: 'Čas',
                    text: 'Sobota nebo neděle dle termínu. Příchod od 8:30, program 9:00–16:30, odchod do 17:00.',
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
          subtitle="Podívejte se na ukázky 3D výtisků, které děti vytvořily na našich táborech"
        />

        {/* Termíny */}
        <section id="terminy" className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 scroll-mt-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="heading-2 text-white mb-4">
                Termíny
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Jednodenní tábor 3D tisku, 9:00–17:00.
              </p>
              <p className="text-lg text-white/70 mt-2">
                Cena: <span className="font-bold text-white">1 490 Kč</span> za den (vč. oběda a materiálů)
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-10">
              {/* Potvrzené termíny */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-trust-400" />
                  Potvrzené termíny
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {confirmedTerminy.map((termin, index) => (
                    <motion.div
                      key={termin.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-white/70" />
                            <h4 className="text-lg font-bold text-white">{termin.label}</h4>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-trust-500/20 text-trust-300 text-xs font-semibold">
                            Potvrzeno
                          </span>
                        </div>

                        <p className="text-sm text-white/70 mb-6">
                          9:00–17:00, HWLab Praha. Registrace přes DDM Praha 6.
                        </p>

                        <a
                          href={termin.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center px-6 py-3 bg-cta-500 hover:bg-cta-400 text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-cta-500/30 text-sm"
                          onClick={() => trackRegistrationClick({
                            termId: termin.id,
                            termDates: termin.date,
                            termLocation: 'HWLab Praha',
                            spotsAvailable: 15,
                            outboundUrl: termin.registrationUrl,
                            campType: 'oneday',
                          })}
                        >
                          Přihlásit se
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Připravované termíny */}
              <div>
                <h3 className="text-lg font-semibold text-white/80 mb-4 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cta-400" />
                  Připravované termíny
                </h3>
                <p className="text-sm text-white/60 mb-6 max-w-xl">
                  Zanechte nám email a dáme vám vědět nejpozději 14 dní před termínem, zda se tábor otevře.
                  Nezavazujete se k ničemu — pouze dostanete včasnou informaci o otevření registrace.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pripravujemeTerminy.map((termin, index) => (
                    <motion.div
                      key={termin.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-dashed border-white/30 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-cta-500/20 text-cta-300 text-xs font-semibold mb-3">
                            Připravujeme
                          </span>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-white/70 flex-shrink-0" />
                            <h4 className="text-base font-bold text-white">{termin.label}</h4>
                          </div>
                        </div>

                        <InterestForm terminId={termin.id} terminLabel={termin.label} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-white/60 mt-8 text-sm"
            >
              Registrace potvrzených termínů probíhá přes systém DDM Praha 6.
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

        {/* Bottom CTA + crosslink */}
        <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-2 text-white mb-6">
                Od nápadu k výrobku za jeden den
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Vaše dítě si navrhne, vytiskne a odnese domů vlastní 3D model.
                Žádné předchozí zkušenosti nepotřebuje.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#terminy"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-100 text-primary-600 font-semibold rounded-xl transition-all duration-300"
                >
                  Zobrazit termíny
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300"
                >
                  Máte dotazy?
                </Link>
              </div>

              {/* Crosslink to weekend camp */}
              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-white/70 mb-3">Hledáte víkendový tábor?</p>
                <Link
                  href="/tabor-chytrych-technologii"
                  className="inline-flex items-center gap-2 text-white hover:text-primary-200 font-semibold transition-colors"
                >
                  Tábor chytrých technologií – 3D tisk, IoT i VR za víkend
                  <ArrowRight className="w-4 h-4" />
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
