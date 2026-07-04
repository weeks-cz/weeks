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
  open: TermDisplay[]
  openNoLink: TermDisplay[]
  collectingInterest: TermDisplay[]
  full: TermDisplay[]
}

export default function TaborIoTClient({ open, openNoLink, collectingInterest, full }: TaborIoTClientProps) {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-night">
          <div className="absolute inset-0 opacity-20 pointer-events-none noise" />
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/images/program-iot.webp"
              alt="Jednodenní tábor IoT - děti pracují s Micro:bitem, Arduinem a senzory"
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
                <p className="data-label mb-4">TÁBORY / IOT & ELEKTRONIKA</p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="heading-1 text-white mb-6"
              >
                Jednodenní tábor IoT & elektroniky
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed"
              >
                Za jeden den si vaše dítě naprogramuje Micro:bit/Arduino, propojí senzory
                a postaví vlastní chytré zařízení.
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
                  { label: 'CENA', value: '1 490 Kč' },
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
                  Zobrazit termíny
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
                Postav si vlastní <span className="text-trust-400">chytré zařízení</span>
              </h2>
              <p className="text-lg text-slate-300">
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
                  className="card-glow p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-trust-400/10 flex items-center justify-center">
                      <block.icon className="w-6 h-6 text-trust-400" />
                    </div>
                    <p className="data-label text-xs">Krok {index + 1}</p>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{block.title}</h3>
                  <p className="text-slate-400 mb-4">{block.description}</p>

                  <ul className="space-y-2">
                    {block.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-trust-400 flex-shrink-0" />
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
                Program <span className="text-trust-400">dne</span>
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Příchod od 8:30, program 9:00–16:30. Střídáme bastlení, přestávky i venkovní aktivity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="pl-4">
                <div className="space-y-0 border-l border-white/15">
                  {dayProgram.map((item, i) => (
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
                    className="flex gap-4 p-5 card-glow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-trust-400/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-trust-400" />
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
          accentColor="trust"
          title="Co si děti odnesou domů"
          subtitle="Podívejte se na ukázky IoT projektů, které děti sestavily na našich táborech"
        />

        {/* Termíny */}
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
                Vyberte si termín
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Jednodenní tábor IoT & elektroniky, 9:00–17:00.
              </p>
              <p className="text-lg text-white mt-2">
                <span className="font-bold">1 490 Kč</span> <span className="text-slate-400">(vč. oběda a materiálů)</span>
              </p>
            </motion.div>

            <TermsList
              program="iot"
              programTitle="IoT & elektronika"
              open={open}
              openNoLink={openNoLink}
              collectingInterest={collectingInterest}
              full={full}
              accentClasses={{
                badgeDot: 'bg-trust-400',
                badgePillBg: 'bg-trust-500/20',
                badgePillText: 'text-trust-300',
                primaryBtnBg: 'bg-trust-600 hover:bg-trust-700',
                inputRing: 'focus:ring-trust-400',
                checkboxAccent: 'text-trust-400 focus:ring-trust-400',
              }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-slate-400 mt-8 text-sm"
            >
              Registrace potvrzených termínů probíhá přes systém DDM Praha 6.
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
                Časté dotazy <span className="text-trust-400">k táboru</span>
              </h2>
              <p className="text-lg text-slate-300 mb-10 text-center">
                Nenašli jste odpověď?{' '}
                <Link href="/kontakt" className="text-accent-400 hover:text-accent-300 font-medium">
                  Kontaktujte nás
                </Link>
              </p>

              <FAQAccordion items={campFaqs} focusRingClass="focus:ring-trust-400" />
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA + crosslink */}
        <section className="section-padding bg-night-800">
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
              <p className="text-xl text-slate-300 mb-8">
                Vaše dítě naprogramuje vlastní chytré zařízení a pochopí,
                jak fungují technologie v každodenním životě.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#terminy"
                  className="btn-primary inline-flex items-center justify-center"
                >
                  Zobrazit termíny
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <Link
                  href="/kontakt"
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  Máte dotazy?
                </Link>
              </div>

              {/* Crosslink to weekend camp */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-slate-400 mb-3">Hledáte víkendový tábor?</p>
                <Link
                  href="/tabor-chytrych-technologii"
                  className="inline-flex items-center gap-2 text-white hover:text-accent-300 font-semibold transition-colors"
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
