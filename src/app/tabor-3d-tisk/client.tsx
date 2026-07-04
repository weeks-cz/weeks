'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Printer, Clock, Calendar, Users, Utensils, Laptop, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GallerySection, GalleryImage } from '@/components/sections/GallerySection'
import { TermsList, FAQAccordion } from '@/components/camps/TermsList'
import type { TermDisplay } from '@/lib/camps'

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

interface Tabor3DTiskClientProps {
  open: TermDisplay[]
  openNoLink: TermDisplay[]
  collectingInterest: TermDisplay[]
  full: TermDisplay[]
}

export default function Tabor3DTiskClient({ open, openNoLink, collectingInterest, full }: Tabor3DTiskClientProps) {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-night">
          <div className="absolute inset-0 opacity-20 pointer-events-none noise" />
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/images/program-3dtisk.webp"
              alt="Jednodenní tábor 3D tisku - děti pracují s 3D tiskárnami"
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
                <p className="data-label mb-4">TÁBORY / 3D TISK</p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="heading-1 text-white mb-6"
              >
                Jednodenní tábor 3D tisku
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed"
              >
                Za jeden den si vaše dítě navrhne vlastní 3D model, vytiskne ho na profesionální
                tiskárně Prusa a odnese si ho domů.
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
                Od nápadu k hotovému <span className="text-primary-400">výrobku</span>
              </h2>
              <p className="text-lg text-slate-300">
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
                  className="card-glow p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-400/10 flex items-center justify-center">
                      <block.icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <p className="data-label text-xs">Krok {index + 1}</p>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{block.title}</h3>
                  <p className="text-slate-400 mb-4">{block.description}</p>

                  <ul className="space-y-2">
                    {block.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-primary-400 flex-shrink-0" />
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
              <p className="data-label mb-4">VYBAVENÍ</p>
              <p className="text-slate-300 mb-6">Tiskneme na tiskárnách Prusa Research</p>
              <div className="flex flex-wrap justify-center gap-2">
                {printerModels.map(model => (
                  <div key={model} className="card-glow px-3 py-1.5">
                    <p className="font-mono text-white text-sm">{model}</p>
                  </div>
                ))}
              </div>
            </motion.div>
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
                Program <span className="text-primary-400">dne</span>
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Příchod od 8:30, program 9:00–16:30. Střídáme tvoření, přestávky i venkovní aktivity.
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
          subtitle="Podívejte se na ukázky 3D výtisků, které děti vytvořily na našich táborech"
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
                Jednodenní 3D tisk, 9:00–17:00.
              </p>
              <p className="text-lg text-white mt-2">
                <span className="font-bold">1 490 Kč</span> <span className="text-slate-400">(vč. oběda a materiálů)</span>
              </p>
            </motion.div>

            <TermsList
              program="3d-tisk"
              programTitle="3D tisk"
              open={open}
              openNoLink={openNoLink}
              collectingInterest={collectingInterest}
              full={full}
              accentClasses={{
                badgeDot: 'bg-primary-400',
                badgePillBg: 'bg-primary-500/20',
                badgePillText: 'text-primary-300',
                primaryBtnBg: 'bg-primary-600 hover:bg-primary-700',
                inputRing: 'focus:ring-primary-400',
                checkboxAccent: 'text-primary-400 focus:ring-primary-400',
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
                Od nápadu k výrobku za jeden den
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Vaše dítě si navrhne, vytiskne a odnese domů vlastní 3D model.
                Žádné předchozí zkušenosti nepotřebuje.
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
