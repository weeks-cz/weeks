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
        <section className="relative bg-paper blueprint-grid border-b border-ink/15 overflow-hidden">
          <div className="section-container grid lg:grid-cols-12 gap-12 lg:gap-10 items-start pt-32 pb-16 md:pt-40 md:pb-20">
            <div className="lg:col-span-7">
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 font-mono text-xs uppercase tracking-[0.2em]"
              >
                <Link href="/" className="text-ink/50 hover:text-trust-600 transition-colors">
                  Domů
                </Link>
                <span className="text-ink/30 mx-2">/</span>
                <Link href="/program" className="text-ink/50 hover:text-trust-600 transition-colors">
                  Programy
                </Link>
                <span className="text-ink/30 mx-2">/</span>
                <span className="text-ink font-medium">IoT & elektronika</span>
              </motion.div>

              {/* Mono kóta */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mono-label mb-6 flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-trust-600" aria-hidden="true" />
                Jednodenní tábor · 9:00 – 17:00
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="heading-1 text-ink mb-6"
              >
                Jednodenní tábor{' '}
                <span className="text-trust-600">IoT & elektroniky</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-ink-500 mb-8 max-w-2xl leading-relaxed"
              >
                Za jeden den si vaše dítě naprogramuje Micro:bit/Arduino, propojí senzory
                a postaví vlastní chytré zařízení.
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
                  Zobrazit termíny
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
                  { icon: Calendar, label: '1 den', sublabel: 'So / Ne' },
                  { icon: Clock, label: '8 hodin', sublabel: 'programu' },
                  { icon: Users, label: 'Max 15', sublabel: 'dětí' },
                  { icon: Utensils, label: 'Oběd', sublabel: 'v ceně' },
                ].map((fact, i) => (
                  <div
                    key={i}
                    className={`p-4 border-ink/15 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${i > 0 ? 'sm:border-l' : ''}`}
                  >
                    <fact.icon className="w-4 h-4 text-trust-600 mb-2" aria-hidden="true" />
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
                  src="/images/program-iot.webp"
                  alt="Jednodenní tábor IoT - děti pracují s Micro:bitem, Arduinem a senzory"
                  width={880}
                  height={660}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover w-full aspect-[4/3]"
                  priority
                  quality={75}
                />
              </div>
              <p className="mono-label mt-4 text-right" aria-hidden="true">
                Arduino breadboard – HWLab, Praha 6
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
                Postav si vlastní <span className="text-trust-600">chytré zařízení</span>
              </h2>
              <p className="text-lg text-ink-500">
                Za jeden den projdete od základů elektroniky po vlastní fungující IoT projekt,
                který reaguje na okolní svět.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="card-maker p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-sm bg-trust-600 border border-ink flex items-center justify-center">
                      <block.icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">
                      Krok {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-ink mb-3">{block.title}</h3>
                  <p className="text-ink-500 mb-4">{block.description}</p>

                  <ul className="space-y-2 border-t border-ink/15 pt-4">
                    {block.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-ink">
                        <Check className="w-4 h-4 text-trust-600 flex-shrink-0" aria-hidden="true" />
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
                Harmonogram <span className="text-trust-600">dne</span>
              </h2>
              <p className="text-lg text-ink-500">
                Příchod od 8:30, program 9:00–16:30. Střídáme bastlení, přestávky i venkovní aktivity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              {/* Timeline s kótovací čarou */}
              <div className="border border-ink rounded-md bg-white p-6 md:p-8">
                <div className="flex items-center gap-3 pb-5 mb-2 border-b border-ink/15">
                  <Cpu className="w-6 h-6 text-trust-600" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">IoT & elektronika – program dne</h3>
                    <p className="font-mono text-xs text-ink/50 uppercase tracking-wider">Od základů po vlastní chytré zařízení</p>
                  </div>
                </div>
                <ol className="relative">
                  {dayProgram.map((item, i) => (
                    <li key={i} className="relative flex gap-5 pb-1">
                      <span className="font-mono text-sm font-medium text-ink w-12 flex-shrink-0 pt-2.5 text-right">
                        {item.time}
                      </span>
                      <div
                        className={`relative pl-5 py-2.5 border-l ${i < dayProgram.length - 1 ? 'border-ink/30' : 'border-transparent'}`}
                      >
                        <span
                          className="absolute -left-[4.5px] top-[17px] w-2 h-2 bg-trust-600"
                          aria-hidden="true"
                        />
                        <p className="font-display font-semibold text-ink text-sm leading-tight">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-ink-500 mt-1">{item.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
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
                Praktické <span className="text-trust-600">informace</span>
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
                    className="card-maker flex gap-4 p-5"
                  >
                    <div className="w-10 h-10 rounded-sm bg-white border border-ink/15 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-trust-600" aria-hidden="true" />
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
          accentColor="trust"
          title="Co si děti odnesou domů"
          subtitle="Podívejte se na ukázky IoT projektů, které děti sestavily na našich táborech"
        />

        {/* Termíny */}
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
                Termíny
              </h2>
              <p className="text-xl text-paper/90 max-w-2xl mx-auto">
                Jednodenní tábor IoT & elektroniky, 9:00–17:00.
              </p>
              <p className="text-lg text-paper/70 mt-2">
                Cena: <span className="font-bold text-paper font-mono">1 490 Kč</span> za den (vč. oběda a materiálů)
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
                badgePillBg: 'bg-trust-400/20',
                badgePillText: 'text-trust-200',
                primaryBtnBg: 'bg-cta-500 hover:bg-cta-400',
                inputRing: 'focus:ring-cta-400',
                checkboxAccent: 'text-cta-400 focus:ring-cta-400',
              }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-paper/60 mt-8 text-sm"
            >
              Registrace potvrzených termínů probíhá přes systém DDM Praha 6.
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
                Časté dotazy <span className="text-trust-600">k táboru</span>
              </h2>
              <p className="text-lg text-ink-500 mb-10">
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
        <section className="section-padding bg-paper blueprint-grid">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-2 text-ink mb-6">
                Pochop, jak funguje svět kolem tebe
              </h2>
              <p className="text-xl text-ink-500 mb-8">
                Vaše dítě naprogramuje vlastní chytré zařízení a pochopí,
                jak fungují technologie v každodenním životě.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#terminy"
                  className="btn-primary px-8 py-4"
                >
                  Zobrazit termíny
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <Link
                  href="/kontakt"
                  className="btn-outline px-8 py-4"
                >
                  Máte dotazy?
                </Link>
              </div>

              {/* Crosslink to weekend camp */}
              <div className="mt-12 pt-8 border-t border-ink/15">
                <p className="text-ink-500 mb-3">Hledáte víkendový tábor?</p>
                <Link
                  href="/tabor-chytrych-technologii"
                  className="inline-flex items-center gap-2 text-trust-600 hover:text-trust-700 font-semibold transition-colors"
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
