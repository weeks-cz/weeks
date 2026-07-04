'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLocation } from '@/contexts/LocationContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Clock, Users, MapPin, Calendar, ArrowRight, Utensils, Laptop, Cpu, Printer, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ProjectGallery } from '../_components/ProjectGallery'
import { VenueShowcase } from '../_components/VenueShowcase'
import { CampViewTracker } from '../_components/CampViewTracker'

const sobotaProgram = [
  { time: '9:00', title: 'Příchod dětí', description: '' },
  { time: '9:15', title: 'Seznámení a úvod', description: 'Představení lektorů, organizační info a úvod do programu tábora.' },
  { time: '9:45', title: '3D tisk – teorie', description: 'Základní principy fungování tiskárny, jak najít model online a základy přípravy pro tisk.' },
  { time: '10:15', title: '3D tisk – praxe', description: 'Praktické ovládání tiskárny, spuštění prvních tisků od začátku do konce.' },
  { time: '10:45', title: 'Přestávka', description: 'Svačina a pití.' },
  { time: '11:00', title: 'Virtuální realita', description: 'VR headsety, interaktivní výzvy a zážitky.' },
  { time: '12:00', title: 'Oběd', description: 'Zajištěný oběd pro všechny účastníky.' },
  { time: '13:00', title: 'Poobědová pauza', description: 'Venkovní aktivita (v případě špatného počasí organizovaný program uvnitř).' },
  { time: '14:00', title: 'Návrh vlastního modelu', description: 'Základy modelování v jednoduchém programu, tisk vymodelovaného objektu.' },
  { time: '15:00', title: 'Přestávka', description: 'Odpolední pauza.' },
  { time: '15:15', title: '3D tisk – samostatná práce', description: 'Samostatné modelování, individuální příprava tisku pro vlastní objekty.' },
  { time: '16:30', title: 'Dokončení a úklid', description: 'Dokončení projektů a úklid pracoviště.' },
  { time: '17:00', title: 'Postupný odchod', description: 'Prostor pro dotazy rodičů.' },
]

const nedeleProgram = [
  { time: '9:00', title: 'Příchod dětí', description: '' },
  { time: '9:15', title: 'Kontrola a vyjmutí tisků', description: 'Prohlídka modelů vytištěných přes noc.' },
  { time: '9:45', title: 'Úvod do IoT', description: 'Co je to IoT a k čemu slouží. Seznámení s Arduinem.' },
  { time: '10:45', title: 'Přestávka', description: 'Svačina a pití.' },
  { time: '11:00', title: 'Arduino I', description: 'Seznámení s Arduinem, první Arduino projekt.' },
  { time: '12:00', title: 'Oběd', description: 'Zajištěný oběd pro všechny účastníky.' },
  { time: '13:00', title: 'Poobědová pauza', description: 'Venkovní aktivita (v případě špatného počasí organizovaný program uvnitř).' },
  { time: '14:00', title: 'Arduino II', description: 'Pokračování s Arduino projekty.' },
  { time: '15:00', title: 'Přestávka', description: 'Odpolední pauza.' },
  { time: '15:15', title: 'IoT zařízení', description: 'Výroba chytrého zařízení, které si děti odnesou domů.' },
  { time: '16:30', title: 'Dokončení a předání', description: 'Předání vytisknutých modelů a vlastního IoT zařízení.' },
  { time: '17:00', title: 'Postupný odchod', description: 'Prostor pro dotazy rodičů.' },
]

const campFaqs = [
  { question: 'Co má dítě mít s sebou?', answer: 'Jen dobrou náladu a svačinu na dopoledne a odpoledne. Oběd zajišťujeme my. Všechno technické vybavení, nástroje i materiály jsou na místě.' },
  { question: 'Musí dítě přijít oba dny?', answer: 'Ano, víkendový tábor je koncipován jako celek sobota + neděle, protože projekty na sebe navazují (např. 3D tisky se tisknou přes noc). Jednotlivé dny neprodáváme.' },
  { question: 'Je zajištěn oběd pro děti s alergiemi?', answer: 'Ano, při registraci se ptáme na stravovací omezení a alergie. Spolupracujeme s dodavatelem, který dokáže připravit bezlepkové, vegetariánské i jiné speciální varianty.' },
  { question: 'Je potřeba nějaká předchozí zkušenost?', answer: 'Ne, žádné předchozí zkušenosti nejsou potřeba. Program přizpůsobujeme úrovni každého dítěte. Začátečníci začínají s asistovanými projekty, pokročilí dostanou složitější výzvy.' },
  { question: 'Kolik stojí víkendový tábor?', answer: 'Cena je 2 990 Kč za celý víkend (sobota + neděle). Zahrnuje veškeré materiály, obědy oba dny a všechny vytvořené projekty si děti odnášejí domů.' },
]

export default function KVMix() {
  const location = useLocation()
  const program = location.programs.find(p => p.id === 'mix')!
  const terms = location.terms.filter(t => t.program === 'mix')
  const venue = location.venues[0]
  const [activeDay, setActiveDay] = useState<'sobota' | 'neděle'>('sobota')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  return (
    <>
      <CampViewTracker location={location.id} program="mix" value={program.price} />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-night">
          <div className="absolute inset-0 opacity-20 pointer-events-none noise" />
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/images/varyete/fablab-5.avif"
              alt="FabLab Kreativního centra VARY&TE v Karlových Varech"
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

              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-6 backdrop-blur-sm border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-cta-400" />
                Víkendový tábor · So + Ne
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="heading-1 text-white mb-6"
              >
                Tábor chytrých technologií
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed"
              >
                Za jeden víkend si vaše dítě vyzkouší 3D tisk, virtuální realitu i&nbsp;IoT
                s&nbsp;Arduinem — ve FabLabu VARY&amp;TE v&nbsp;Karlových Varech.{' '}
                <span className="text-white font-medium">A vlastní projekty si odnese domů.</span>
              </motion.p>

              {/* Spec sheet */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl"
              >
                {[
                  { label: 'VĚK', value: '10–15 let' },
                  { label: 'KAPACITA', value: 'Max 15' },
                  { label: 'CENA', value: '2 990 Kč' },
                  { label: 'ČAS', value: '9:00–17:00' },
                ].map((spec, i) => (
                  <div key={i} className="card-glow p-4">
                    <p className="data-label text-xs mb-2">{spec.label}</p>
                    <p className="font-display text-white text-lg">{spec.value}</p>
                  </div>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="#terminy"
                  className="btn-primary inline-flex items-center justify-center"
                >
                  Zobrazit termíny
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/karlovy-vary/kontakt"
                  className="btn-outline inline-flex items-center justify-center"
                >
                  Máte dotazy?
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {[
                  { icon: Calendar, label: '2 dny', sublabel: 'So + Ne' },
                  { icon: Clock, label: '9:00–17:00', sublabel: 'oba dny' },
                  { icon: Users, label: `Max ${program.capacity}`, sublabel: 'dětí' },
                  { icon: Utensils, label: 'Obědy', sublabel: 'v ceně' },
                ].map((fact, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <fact.icon className="w-5 h-5 text-accent-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">{fact.label}</p>
                      <p className="text-xs text-slate-400">{fact.sublabel}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Info */}
        <section className="section-padding bg-night-800">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="heading-2 text-white mb-6">Co se naučíte</h2>
                <div className="space-y-4">
                  {[
                    '3D tisk — od návrhu po hotový výtisk',
                    'IoT & elektronika — Micro:bit a Arduino',
                    'Virtuální realita — ponoření do VR světů',
                    'Programování základů — C# a Python',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary-400">{i + 1}</span>
                      </div>
                      <p className="text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="card-glow rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-4">Praktické informace</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-300">
                      <Clock className="w-5 h-5 text-accent-400" />
                      <span>So + Ne, 9:00–17:00 (oba dny)</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <Users className="w-5 h-5 text-accent-400" />
                      <span>Max. {program.capacity} dětí ve skupině</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <MapPin className="w-5 h-5 text-accent-400" />
                      <span>{venue.name}, {venue.city}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-cta-400">{program.price.toLocaleString('cs-CZ')} Kč</span>
                    </div>
                  </div>
                </div>
                <div className="card-glow rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-2">Věk</h3>
                  <p className="text-slate-300">{program.ageRange} let</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Practical Info Cards */}
        <section className="section-padding bg-night-800">
          <div className="section-container">
            <h2 className="heading-2 text-center mb-10 text-white">Na co se máte těšit</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card-glow rounded-xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center mb-4">
                  <Utensils className="w-5 h-5 text-accent-400" />
                </div>
                <h3 className="font-semibold text-white mb-3">Stravování</h3>
                <p className="text-sm text-slate-300">Oběd je zajištěný a v ceně oba dny. Na dopoledne a odpoledne si děti přinesou vlastní svačinu. Pití je k dispozici po celý den.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="card-glow rounded-xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center mb-4">
                  <Laptop className="w-5 h-5 text-accent-400" />
                </div>
                <h3 className="font-semibold text-white mb-3">Vybavení</h3>
                <p className="text-sm text-slate-300">Veškeré technické vybavení — 3D tiskárny, VR headsety, Arduina i senzory — je na místě ve VARY&TE. Děti nemusí nic nosit.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="card-glow rounded-xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-accent-400" />
                </div>
                <h3 className="font-semibold text-white mb-3">Kapacita</h3>
                <p className="text-sm text-slate-300">Maximálně {program.capacity} dětí na termín. Menší skupinka zajišťuje individuální přístup lektorů ke každému dítěti.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="card-glow rounded-xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-accent-400" />
                </div>
                <h3 className="font-semibold text-white mb-3">Čas</h3>
                <p className="text-sm text-slate-300">Sobota + neděle. Program 9:00–17:00 oba dny.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Day Schedules */}
        <section className="section-padding bg-night">
          <div className="section-container">
            <h2 className="heading-2 text-center mb-10 text-white">Program tábora</h2>

            {/* Day Tabs */}
            <div className="flex gap-4 mb-8 justify-center flex-wrap">
              <button
                onClick={() => setActiveDay('sobota')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeDay === 'sobota'
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Sobota — 3D tisk & VR
                </div>
              </button>
              <button
                onClick={() => setActiveDay('neděle')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeDay === 'neděle'
                    ? 'bg-trust-500/20 text-trust-300 border border-trust-500/40'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Neděle — IoT & Arduino
                </div>
              </button>
            </div>

            {/* Schedule Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto space-y-3"
              >
                {(activeDay === 'sobota' ? sobotaProgram : nedeleProgram).map((item, i) => (
                  <div key={i} className="card-glow rounded-lg overflow-hidden hover:border-accent-400/60 transition-all">
                    <div className="p-4 flex gap-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-accent-500/20">
                          <span className="font-mono font-semibold text-accent-300 text-sm">{item.time}</span>
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Kde to probíhá — VARY&TE FabLab */}
        <VenueShowcase />

        {/* Co si dítě odnese — galerie projektů */}
        <ProjectGallery />

        {/* Terms */}
        <section id="terminy" className="section-padding bg-night-800">
          <div className="section-container">
            <h2 className="heading-2 text-center mb-10 text-white">Termíny — {location.name}</h2>
            {terms.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {terms.map((term) => (
                  <motion.div
                    key={term.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`rounded-xl p-6 ${term.status === 'preparing' ? 'card-glow border-dashed' : 'card-glow'}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-accent-400" />
                      <span className="font-semibold text-white">
                        {new Date(term.startDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })}
                        {' – '}
                        {new Date(term.endDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">So + Ne · {venue.name}</p>
                    {term.status === 'confirmed' ? (
                      <Link
                        href={`/registrace?location=${location.id}&program=${program.id}&term=${term.id}`}
                        className="btn-primary w-full text-center justify-center text-sm"
                      >
                        Registrovat dítě
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    ) : (
                      <div>
                        <span className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-3">
                          Připravujeme
                        </span>
                        <Link
                          href={`/registrace?location=${location.id}&program=${program.id}&term=${term.id}`}
                          className="btn-outline w-full text-center justify-center text-sm"
                        >
                          Nezávazná registrace
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-300">Termíny budou brzy vypsány.</p>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-night">
          <div className="section-container max-w-3xl">
            <h2 className="heading-2 text-center mb-10 text-white">Často kladené otázky</h2>
            <div className="space-y-3">
              {campFaqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="card-glow rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-night-700/50 transition-colors"
                  >
                    <h3 className="font-semibold text-white text-left">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-accent-400 flex-shrink-0 transition-transform ${
                        openFaqIndex === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/10 bg-night-800/50"
                      >
                        <p className="px-6 py-4 text-slate-300">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative py-20 bg-gradient-to-br from-primary-600/10 via-accent-600/10 to-trust-600/10 border-t border-white/10 overflow-hidden">
          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="heading-2 text-white mb-4">3D tisk, IoT i VR za jeden víkend</h2>
              <p className="text-lg text-slate-300 mb-8">
                Vaše dítě projde všemi technologiemi za 2 dny a odnese si domů vlastní projekty. Žádné předchozí zkušenosti nepotřebuje.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="#terminy" className="btn-primary">
                  Zobrazit termíny
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link href="/karlovy-vary/kontakt" className="btn-secondary">
                  Máte dotazy?
                </Link>
              </div>
              <p className="text-sm text-white/70">
                Hledáte celotýdenní program?{' '}
                <Link href="/karlovy-vary/letni-primestsky" className="underline hover:text-white transition-colors">
                  Letní příměstský tábor (Po–Pá)
                </Link>
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
