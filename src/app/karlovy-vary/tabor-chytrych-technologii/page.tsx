'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLocation } from '@/contexts/LocationContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Clock, Users, MapPin, Calendar, ArrowRight, Utensils, Laptop, Cpu, Printer, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-20 bg-gradient-to-br from-accent-600 to-accent-800 overflow-hidden">
          <div className="section-container relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-4 h-4" />
                Víkendový tábor
              </span>
              <h1 className="heading-1 text-white mb-4">Tábor chytrých technologií</h1>
              <p className="text-xl text-white/80 max-w-2xl">
                So + Ne: 3D tisk, IoT, virtuální realita a základy programování.
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
                      <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent-600">{i + 1}</span>
                      </div>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Praktické informace</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5 text-accent-500" />
                      <span>So 9:00 – Ne 16:00 (víkendový program)</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="w-5 h-5 text-accent-500" />
                      <span>Max. {program.capacity} dětí ve skupině</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5 text-accent-500" />
                      <span>{venue.name}, {venue.city}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="text-2xl font-bold text-accent-600">{program.price.toLocaleString('cs-CZ')} Kč</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Věk</h3>
                  <p className="text-gray-600">{program.ageRange} let</p>
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
                className="bg-white rounded-xl p-6 border border-accent-200"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                  <Utensils className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">Stravování</h3>
                <p className="text-sm text-gray-600">Oběd je zajištěný a v ceně oba dny. Na dopoledne a odpoledne si děti přinesou vlastní svačinu. Pití je k dispozici po celý den.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 border border-accent-200"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                  <Laptop className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">Vybavení</h3>
                <p className="text-sm text-gray-600">Veškeré technické vybavení — 3D tiskárny, VR headsety, Arduina i senzory — je na místě ve Vary&Te. Děti nemusí nic nosit.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 border border-accent-200"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">Kapacita</h3>
                <p className="text-sm text-gray-600">Maximálně {program.capacity} dětí na termín. Menší skupinka zajišťuje individuální přístup lektorů ke každému dítěti.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 border border-accent-200"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">Čas</h3>
                <p className="text-sm text-gray-600">Sobota + neděle. Příchod od 8:30, program 9:00–16:30 oba dny.</p>
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
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
                    <div className="p-4 flex gap-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-accent-100">
                          <span className="font-semibold text-accent-600 text-sm">{item.time}</span>
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Terms */}
        <section id="terminy" className="section-padding bg-gray-50">
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
                    className={`bg-white rounded-xl p-6 ${term.status === 'preparing' ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-accent-500" />
                      <span className="font-semibold text-gray-900">
                        {new Date(term.startDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">So + Ne · {venue.name}</p>
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
              <p className="text-center text-gray-500">Termíny budou brzy vypsány.</p>
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
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 text-left">{faq.question}</h3>
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
                        className="border-t border-gray-100 bg-gray-50"
                      >
                        <p className="px-6 py-4 text-gray-600">{faq.answer}</p>
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
