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
                <span className="text-ink font-medium">3D tisk</span>
              </motion.div>

              {/* Mono kóta */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mono-label mb-6 flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-primary-600" aria-hidden="true" />
                Jednodenní tábor · 9:00 – 17:00
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="heading-1 text-ink mb-6"
              >
                Jednodenní tábor{' '}
                <span className="text-primary-600">3D tisku</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-ink-500 mb-8 max-w-2xl leading-relaxed"
              >
                Za jeden den si vaše dítě navrhne vlastní 3D model, vytiskne ho na profesionální
                tiskárně Prusa a odnese si ho domů.
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
                  src="/images/program-3dtisk.webp"
                  alt="Jednodenní tábor 3D tisku - děti pracují s 3D tiskárnami"
                  width={880}
                  height={660}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover w-full aspect-[4/3]"
                  priority
                  quality={75}
                />
              </div>
              <p className="mono-label mt-4 text-right" aria-hidden="true">
                Tiskárny Prusa — HWLab, Praha 6
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
                Od nápadu k hotovému <span className="text-primary-600">výrobku</span>
              </h2>
              <p className="text-lg text-ink-500">
                Za jeden den projdete celým procesem 3D tisku – od prvního návrhu po hotový výtisk,
                který si odnesete domů.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="card-maker p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-sm bg-primary-600 border border-ink flex items-center justify-center">
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
                        <Check className="w-4 h-4 text-primary-600 flex-shrink-0" aria-hidden="true" />
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
              className="mt-12"
            >
              <p className="mono-label mb-4">Tiskneme na tiskárnách Prusa Research</p>
              <div className="flex flex-wrap gap-px bg-ink/15 border border-ink/15 rounded-md overflow-hidden w-fit">
                {printerModels.map(model => (
                  <span key={model} className="px-4 py-2 bg-white font-mono text-sm text-ink">
                    {model}
                  </span>
                ))}
              </div>
            </motion.div>
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
                Harmonogram <span className="text-primary-600">dne</span>
              </h2>
              <p className="text-lg text-ink-500">
                Příchod od 8:30, program 9:00–16:30. Střídáme tvoření, přestávky i venkovní aktivity.
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
                  <Printer className="w-6 h-6 text-primary-600" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">3D tisk – program dne</h3>
                    <p className="font-mono text-xs text-ink/50 uppercase tracking-wider">Od návrhu po hotový výtisk</p>
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
                          className="absolute -left-[4.5px] top-[17px] w-2 h-2 bg-primary-600"
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
          subtitle="Podívejte se na ukázky 3D výtisků, které děti vytvořily na našich táborech"
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
                Jednodenní i dvoudenní 3D tisk, 9:00–17:00. Cena u každého termínu.
              </p>
              <p className="text-lg text-paper/70 mt-2">
                Jednodenní <span className="font-bold text-paper font-mono">1 490 Kč</span> · dvoudenní{' '}
                <span className="font-bold text-paper font-mono">2 990 Kč</span> (vč. oběda a materiálů)
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
                badgeDot: 'bg-trust-400',
                badgePillBg: 'bg-trust-500/20',
                badgePillText: 'text-trust-300',
                primaryBtnBg: 'bg-primary-600 hover:bg-primary-700',
                inputRing: 'focus:ring-primary-400',
                checkboxAccent: 'text-primary-400 focus:ring-primary-400',
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
                Od nápadu k výrobku za jeden den
              </h2>
              <p className="text-xl text-ink-500 mb-8">
                Vaše dítě si navrhne, vytiskne a odnese domů vlastní 3D model.
                Žádné předchozí zkušenosti nepotřebuje.
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
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
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
