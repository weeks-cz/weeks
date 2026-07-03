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
        <section className="relative bg-paper blueprint-grid border-b border-ink/15 overflow-hidden">
          <div className="section-container grid lg:grid-cols-12 gap-12 lg:gap-10 items-start pt-16 pb-16 md:pt-20 md:pb-20">
            <div className="lg:col-span-7">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mono-label mb-6 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-accent-500" aria-hidden="true" />
                Víkendový tábor · So + Ne
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="heading-1 text-ink mb-6"
              >
                Tábor chytrých{' '}
                <span className="text-primary-600">technologií</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-lg md:text-xl text-ink-500 mb-8 max-w-2xl leading-relaxed"
              >
                Za jeden víkend si vaše dítě vyzkouší 3D tisk, virtuální realitu i&nbsp;IoT
                s&nbsp;Arduinem — ve FabLabu VARY&amp;TE v&nbsp;Karlových Varech.{' '}
                <span className="text-ink font-medium">A vlastní projekty si odnese domů.</span>
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="#terminy"
                  className="btn-primary group px-8 py-4"
                >
                  Zobrazit termíny
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/karlovy-vary/kontakt"
                  className="btn-outline px-8 py-4"
                >
                  Máte dotazy?
                </Link>
              </motion.div>

              {/* Spec sheet */}
              <motion.dl
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12 grid grid-cols-2 sm:grid-cols-4 border border-ink rounded-md overflow-hidden bg-white"
              >
                {[
                  { icon: Calendar, label: '2 dny', sublabel: 'So + Ne' },
                  { icon: Clock, label: '9:00–17:00', sublabel: 'oba dny' },
                  { icon: Users, label: `Max ${program.capacity}`, sublabel: 'dětí' },
                  { icon: Utensils, label: 'Obědy', sublabel: 'v ceně' },
                ].map((fact, i) => (
                  <div
                    key={i}
                    className={`p-4 border-ink/15 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${i > 0 ? 'sm:border-l' : ''}`}
                  >
                    <fact.icon className="w-4 h-4 text-accent-500 mb-2" aria-hidden="true" />
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
              className="lg:col-span-5 relative lg:mt-10"
            >
              <div className="relative border border-ink rounded-md overflow-hidden shadow-hard bg-white">
                <Image
                  src="/images/varyete/fablab-5.avif"
                  alt="FabLab Kreativního centra VARY&TE v Karlových Varech"
                  width={880}
                  height={660}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover w-full aspect-[4/3]"
                  priority
                />
              </div>
              <p className="mono-label mt-4 text-right" aria-hidden="true">
                FabLab VARY&amp;TE — Karlovy Vary
              </p>
            </motion.div>
          </div>
        </section>

        {/* Info */}
        <section className="section-padding">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="heading-2 mb-6">Co se naučíte</h2>
                <div className="space-y-4">
                  {[
                    '3D tisk — od návrhu po hotový výtisk',
                    'IoT & elektronika — Micro:bit a Arduino',
                    'Virtuální realita — ponoření do VR světů',
                    'Programování základů — C# a Python',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-sm border border-ink/20 bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="font-mono text-xs font-bold text-accent-600">{i + 1}</span>
                      </div>
                      <p className="text-ink-500">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white border border-ink/15 rounded-md p-6">
                  <h3 className="font-semibold text-ink mb-4">Praktické informace</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-ink-500">
                      <Clock className="w-5 h-5 text-accent-500" />
                      <span>So + Ne, 9:00–17:00 (oba dny)</span>
                    </div>
                    <div className="flex items-center gap-3 text-ink-500">
                      <Users className="w-5 h-5 text-accent-500" />
                      <span>Max. {program.capacity} dětí ve skupině</span>
                    </div>
                    <div className="flex items-center gap-3 text-ink-500">
                      <MapPin className="w-5 h-5 text-accent-500" />
                      <span>{venue.name}, {venue.city}</span>
                    </div>
                    <div className="flex items-center gap-3 text-ink-500">
                      <span className="text-2xl font-bold text-accent-600">{program.price.toLocaleString('cs-CZ')} Kč</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-ink/15 rounded-md p-6">
                  <h3 className="font-semibold text-ink mb-2">Věk</h3>
                  <p className="text-ink-500">{program.ageRange} let</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Practical Info Cards */}
        <section className="section-padding bg-accent-50">
          <div className="section-container">
            <h2 className="heading-2 text-center mb-10">Na co se máte těšit</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-md p-6 border border-accent-200"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                  <Utensils className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-ink mb-3">Stravování</h3>
                <p className="text-sm text-ink-500">Oběd je zajištěný a v ceně oba dny. Na dopoledne a odpoledne si děti přinesou vlastní svačinu. Pití je k dispozici po celý den.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-md p-6 border border-accent-200"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                  <Laptop className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-ink mb-3">Vybavení</h3>
                <p className="text-sm text-ink-500">Veškeré technické vybavení — 3D tiskárny, VR headsety, Arduina i senzory — je na místě ve VARY&TE. Děti nemusí nic nosit.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-md p-6 border border-accent-200"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-ink mb-3">Kapacita</h3>
                <p className="text-sm text-ink-500">Maximálně {program.capacity} dětí na termín. Menší skupinka zajišťuje individuální přístup lektorů ke každému dítěti.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-md p-6 border border-accent-200"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-ink mb-3">Čas</h3>
                <p className="text-sm text-ink-500">Sobota + neděle. Program 9:00–17:00 oba dny.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Day Schedules */}
        <section className="section-padding">
          <div className="section-container">
            <h2 className="heading-2 text-center mb-10">Program tábora</h2>

            {/* Day Tabs */}
            <div className="flex gap-4 mb-8 justify-center">
              <button
                onClick={() => setActiveDay('sobota')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeDay === 'sobota'
                    ? 'bg-accent-600 text-white shadow-lg'
                    : 'bg-paper-soft text-ink-500 hover:bg-ink/10'
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
                    ? 'bg-accent-600 text-white shadow-lg'
                    : 'bg-paper-soft text-ink-500 hover:bg-ink/10'
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
                  <div key={i} className="bg-white rounded-lg border border-ink/15 overflow-hidden hover:shadow-sm transition-shadow">
                    <div className="p-4 flex gap-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-accent-100">
                          <span className="font-semibold text-accent-600 text-sm">{item.time}</span>
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-ink">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-ink-500 mt-1">{item.description}</p>
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
        <section id="terminy" className="section-padding bg-paper-soft border-y border-ink/15">
          <div className="section-container">
            <h2 className="heading-2 text-center mb-10">Termíny — {location.name}</h2>
            {terms.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {terms.map((term) => (
                  <motion.div
                    key={term.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`bg-white rounded-md p-6 ${term.status === 'preparing' ? 'border-2 border-dashed border-ink/30' : 'border border-ink/15 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-accent-500" />
                      <span className="font-semibold text-ink">
                        {new Date(term.startDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })}
                        {' – '}
                        {new Date(term.endDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })}
                      </span>
                    </div>
                    <p className="text-sm text-ink-500 mb-4">So + Ne · {venue.name}</p>
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
              <p className="text-center text-ink-500">Termíny budou brzy vypsány.</p>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding">
          <div className="section-container max-w-3xl">
            <h2 className="heading-2 text-center mb-10">Často kladené otázky</h2>
            <div className="space-y-3">
              {campFaqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-ink/15 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-paper-soft border-y border-ink/15 transition-colors"
                  >
                    <h3 className="font-semibold text-ink text-left">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-accent-600 flex-shrink-0 transition-transform ${
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
                        className="border-t border-ink/10 bg-paper-soft border-y border-ink/15"
                      >
                        <p className="px-6 py-4 text-ink-500">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative py-20 bg-gradient-to-br from-accent-600 via-accent-700 to-accent-800 overflow-hidden">
          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="heading-1 text-white mb-4">3D tisk, IoT i VR za jeden víkend</h2>
              <p className="text-lg text-white/80 mb-8">
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
