'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Cpu, Clock, Calendar, Users, Utensils, Laptop, Check, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GallerySection, GalleryImage } from '@/components/sections/GallerySection'
import { TermsList, FAQAccordion } from '@/components/camps/TermsList'
import type { TermDisplay } from '@/lib/camps'

const galleryImages: GalleryImage[] = [
  { src: '/images/gallery/iot-arduino-breadboard.jpg', alt: 'Práce s Arduino breadboardem', featured: true },
  { src: '/images/gallery/iot-plant-sensor.jpg', alt: 'IoT senzor na květině' },
  { src: '/images/gallery/iot-arduino-programming.jpg', alt: 'Programování Arduina', featured: true },
  { src: '/images/gallery/iot-breadboard-detail.jpg', alt: 'Detail breadboardu s LEDkami' },
  { src: '/images/gallery/iot-plant-sensor-2.jpg', alt: 'Chytré zavlažování květin' },
  { src: '/images/gallery/iot-circuit-design.jpg', alt: 'Návrh IoT obvodu' },
]

const dayProgram = [
  { time: '8:30', title: 'Příchod dětí', description: '' },
  { time: '9:00', title: 'Seznámení a úvod', description: 'Představení lektorů, organizační info a úvod do programu.' },
  { time: '9:30', title: 'Úvod do IoT', description: 'Co je to IoT a k čemu slouží. Seznámení s Arduinem.' },
  { time: '10:30', title: 'Přestávka', description: 'Svačina a pití.' },
  { time: '10:45', title: 'Arduino I', description: 'Seznámení s Arduinem, první Arduino projekt.' },
  { time: '12:00', title: 'Oběd', description: 'Zajištěný oběd pro všechny účastníky.' },
  { time: '13:00', title: 'Poobědová pauza', description: 'Venkovní aktivita (v případě špatného počasí organizovaný program uvnitř).' },
  { time: '14:00', title: 'Arduino II', description: 'Pokračování s Arduino projekty.' },
  { time: '15:00', title: 'Přestávka', description: 'Odpolední pauza.' },
  { time: '15:15', title: 'IoT zařízení', description: 'Výroba chytrého zařízení, které si děti odnesou domů.' },
  { time: '16:30', title: 'Postupný odchod', description: 'Děti si odnáší zkušenosti a know-how. Prostor pro dotazy rodičů.' },
]

const campFaqs = [
  {
    question: 'Je potřeba nějaká předchozí zkušenost s elektronikou?',
    answer: 'Ne, žádné předchozí zkušenosti nejsou potřeba. Program je navržený tak, aby zvládli i úplní začátečníci. Pokročilí dostanou složitější výzvy.',
  },
  {
    question: 'Co si děti odnesou domů?',
    answer: 'Děti si odnesou zkušenosti s programováním a elektronikou. Micro:bity a Arduina zůstávají v laboratoři, ale děti získají přístup k online prostředí, kde mohou pokračovat v programování doma.',
  },
  {
    question: 'Je oběd v ceně?',
    answer: 'Ano, oběd je zajištěný a v ceně tábora. Na dopoledne a odpoledne si děti přinesou vlastní svačinu. Pití je k dispozici po celý den.',
  },
  {
    question: 'Jaký je rozdíl oproti víkendovému táboru?',
    answer: 'Jednodenní tábor je zaměřený čistě na IoT a elektroniku – za jeden den postavíte vlastní chytré zařízení. Víkendový Tábor chytrých technologií kombinuje 3D tisk, IoT a virtuální realitu.',
  },
  {
    question: 'Kolik stojí jednodenní tábor?',
    answer: 'Cena je 1 490 Kč za jeden den (8 hodin programu, sobota nebo neděle dle termínu). Zahrnuje veškeré materiály, oběd a vybavení.',
  },
]

interface TaborIoTClientProps {
  confirmedTerms: TermDisplay[]
  upcomingTerms: TermDisplay[]
}

export default function TaborIoTClient({ confirmedTerms, upcomingTerms }: TaborIoTClientProps) {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/program-iot.webp"
              alt="Jednodenní tábor IoT - děti pracují s Micro:bitem, Arduinem a senzory"
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
                <Link href="/" className="text-gray-400 hover:text-trust-400 transition-colors">
                  Domů
                </Link>
                <span className="text-gray-500 mx-2">/</span>
                <Link href="/program" className="text-gray-400 hover:text-trust-400 transition-colors">
                  Programy
                </Link>
                <span className="text-gray-500 mx-2">/</span>
                <span className="text-white font-medium">IoT & elektronika</span>
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium mb-6 border border-white/20"
              >
                <Cpu className="w-4 h-4 text-trust-400" />
                <span>Jednodenní tábor</span>
                <span className="w-px h-4 bg-white/30" />
                <span className="text-trust-400">9:00 – 17:00</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
              >
                Jednodenní tábor{' '}
                <span className="bg-gradient-to-r from-trust-400 to-trust-300 bg-clip-text text-transparent">
                  IoT & elektroniky
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
              >
                Za jeden den si vaše dítě naprogramuje Micro:bit/Arduino, propojí senzory
                a postaví vlastní chytré zařízení.
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
                    <fact.icon className="w-5 h-5 text-trust-400 flex-shrink-0" />
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
                Postav si vlastní <span className="bg-gradient-to-r from-trust-600 to-trust-400 bg-clip-text text-transparent">chytré zařízení</span>
              </h2>
              <p className="text-lg text-gray-600">
                Za jeden den projdete od základů elektroniky po vlastní fungující IoT projekt,
                který reaguje na okolní svět.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Cpu,
                  title: 'Micro:bit/Arduino a základy',
                  description: 'Seznámení s mikropočítači Micro:bit a Arduino, první program, ovládání LED displeje a tlačítek.',
                  highlights: ['Programování Micro:bitu a Arduina', 'LED displej a tlačítka', 'Online editor MakeCode'],
                },
                {
                  icon: Zap,
                  title: 'Senzory a propojení',
                  description: 'Připojení senzorů teploty, světla a pohybu. Děti uvidí, jak zařízení reaguje na okolí.',
                  highlights: ['Teplotní senzor', 'Senzor světla', 'Akcelerometr a kompas'],
                },
                {
                  icon: Check,
                  title: 'Vlastní projekt',
                  description: 'Každé dítě navrhne a postaví vlastní chytré zařízení – meteostanici, alarm nebo hru.',
                  highlights: ['Návrh vlastního zařízení', 'Kombinace senzorů', 'Prezentace projektu'],
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
                    <div className="w-12 h-12 rounded-xl bg-trust-50 flex items-center justify-center">
                      <block.icon className="w-6 h-6 text-trust-600" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-trust-100 text-trust-700 text-xs font-semibold">
                      Krok {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{block.title}</h3>
                  <p className="text-gray-600 mb-4">{block.description}</p>

                  <ul className="space-y-2">
                    {block.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-trust-600 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
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
                Harmonogram <span className="bg-gradient-to-r from-trust-600 to-trust-400 bg-clip-text text-transparent">dne</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Příchod od 8:30, program 9:00–16:30. Střídáme bastlení, přestávky i venkovní aktivity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="bg-gradient-to-r from-trust-600 to-trust-500 p-5">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-white" />
                    <div>
                      <h3 className="text-lg font-bold text-white">IoT & elektronika – program dne</h3>
                      <p className="text-sm text-white/80">Od základů po vlastní chytré zařízení</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-0">
                    {dayProgram.map((item, i) => (
                      <div key={i} className={`flex gap-4 py-3 ${i < dayProgram.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <span className="text-sm font-mono font-semibold text-trust-600 w-12 flex-shrink-0">{item.time}</span>
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
                Praktické <span className="bg-gradient-to-r from-trust-600 to-trust-400 bg-clip-text text-transparent">informace</span>
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
                    text: 'Veškeré technické vybavení, počítače, Micro:bity, Arduina i senzory jsou na místě. Děti nemusí nic nosit.',
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
                    <div className="w-10 h-10 rounded-lg bg-trust-100 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-trust-600" />
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
          accentColor="trust"
          title="Co si děti odnesou domů"
          subtitle="Podívejte se na ukázky IoT projektů, které děti sestavily na našich táborech"
        />

        {/* Termíny */}
        <section id="terminy" className="section-padding bg-gradient-to-br from-trust-600 to-trust-800 scroll-mt-24">
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
                Jednodenní tábor IoT & elektroniky, 9:00–17:00.
              </p>
              <p className="text-lg text-white/70 mt-2">
                Cena: <span className="font-bold text-white">1 490 Kč</span> za den (vč. oběda a materiálů)
              </p>
            </motion.div>

            <TermsList
              program="iot"
              programTitle="IoT & elektronika"
              confirmed={confirmedTerms}
              upcoming={upcomingTerms}
              accentClasses={{
                ringColor: 'focus:ring-trust-500',
                badgeDot: 'bg-trust-400',
                badgePillBg: 'bg-trust-400/20',
                badgePillText: 'text-trust-200',
                primaryBtnBg: 'bg-trust-600 hover:bg-trust-700',
                inputRing: 'focus:ring-trust-400',
                checkboxAccent: 'text-trust-400 focus:ring-trust-400',
              }}
            />

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
                Časté dotazy <span className="bg-gradient-to-r from-trust-600 to-trust-400 bg-clip-text text-transparent">k táboru</span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 text-center">
                Nenašli jste odpověď?{' '}
                <Link href="/kontakt" className="text-trust-600 hover:underline font-medium">
                  Kontaktujte nás
                </Link>
              </p>

              <FAQAccordion items={campFaqs} focusRingClass="focus:ring-trust-500" />
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA + crosslink */}
        <section className="section-padding bg-gradient-to-br from-trust-600 via-trust-700 to-trust-800">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-2 text-white mb-6">
                Pochop, jak funguje svět kolem tebe
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Vaše dítě naprogramuje vlastní chytré zařízení a pochopí,
                jak fungují technologie v každodenním životě.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#terminy"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-100 text-trust-600 font-semibold rounded-xl transition-all duration-300"
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
                  className="inline-flex items-center gap-2 text-white hover:text-trust-200 font-semibold transition-colors"
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
