'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLocation } from '@/contexts/LocationContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Printer, Clock, Users, MapPin, Calendar, ArrowRight, Utensils, Laptop, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      className="border border-gray-200 rounded-lg overflow-hidden"
      initial={false}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between gap-4 p-5 hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary-600 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-200"
          >
            <p className="p-5 text-gray-600 bg-gray-50">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function KV3DTisk() {
  const location = useLocation()
  const program = location.programs.find(p => p.id === '3d-tisk')!
  const terms = location.terms.filter(t => t.program === '3d-tisk')
  const venue = location.venues[0]

  const schedule = [
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

  const faqs = [
    { question: 'Je potřeba nějaká předchozí zkušenost s 3D tiskem?', answer: 'Ne, žádné předchozí zkušenosti nejsou potřeba. Program je navržený tak, aby zvládli i úplní začátečníci. Pokročilí dostanou složitější výzvy.' },
    { question: 'Co si děti odnesou domů?', answer: 'Každé dítě si odnese vlastní navržený a vytištěný 3D model – klíčenku, stojánek, hračku nebo jiný předmět podle vlastního návrhu.' },
    { question: 'Je oběd v ceně?', answer: 'Ano, oběd je zajištěný a v ceně tábora. Na dopoledne a odpoledne si děti přinesou vlastní svačinu. Pití je k dispozici po celý den.' },
    { question: 'Jaký je rozdíl oproti víkendovému táboru?', answer: 'Jednodenní tábor je zaměřený čistě na 3D tisk – za jeden den projdete celý proces od návrhu po hotový výtisk. Víkendový Tábor chytrých technologií kombinuje 3D tisk, IoT a virtuální realitu.' },
    { question: 'Kolik stojí jednodenní tábor?', answer: 'Cena je 1 490 Kč za jeden den (8 hodin programu, sobota nebo neděle dle termínu). Zahrnuje veškeré materiály, oběd a všechny vytvořené projekty si děti odnášejí domů.' },
  ]

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-20 bg-gradient-to-br from-primary-600 to-primary-800 overflow-hidden">
          <div className="section-container relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
                <Printer className="w-4 h-4" />
                Jednodenní tábor
              </span>
              <h1 className="heading-1 text-white mb-4">3D tisk</h1>
              <p className="text-xl text-white/80 max-w-2xl">
                Od návrhu po hotový výtisk na profesionální 3D tiskárně — vše za jeden den.
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
                    'Základy 3D modelování v TinkerCAD',
                    'Práce s profesionálními 3D tiskárnami',
                    'Příprava modelu pro tisk (slicing)',
                    'Dokončení a výsledek — vlastní výtisk domů',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary-600">{i + 1}</span>
                      </div>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="heading-2 mb-6">Praktické informace</h2>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Stravování</h3>
                      <p className="text-sm text-gray-600">Oběd je zajištěný a v ceně. Na dopoledne a odpoledne si děti přinesou vlastní svačinu. Pití je k dispozici po celý den.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Laptop className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Vybavení</h3>
                      <p className="text-sm text-gray-600">Veškeré technické vybavení a 3D tiskárny jsou na místě ve Vary&Te. Děti nemusí nic nosit.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Kapacita</h3>
                      <p className="text-sm text-gray-600">Maximálně {program.capacity} dětí na termín. Menší skupinka zajišťuje individuální přístup lektorů ke každému dítěti.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Čas</h3>
                      <p className="text-sm text-gray-600">Sobota nebo neděle dle termínu. Příchod od 8:30, program 9:00–16:30.</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Day Program Schedule */}
        <section className="section-padding bg-gray-50">
          <div className="section-container">
            <h2 className="heading-2 text-center mb-10">Harmonogram dne</h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 flex items-center gap-3">
                  <Printer className="w-6 h-6 text-white" />
                  <h3 className="text-lg font-semibold text-white">Typický průběh dne</h3>
                </div>

                {/* Schedule Items */}
                <div className="divide-y divide-gray-100">
                  {schedule.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 hover:bg-primary-50/30 transition-colors"
                    >
                      <div className="flex gap-4 md:gap-6">
                        <div className="flex-shrink-0">
                          <span className="font-mono text-sm font-semibold text-primary-600 whitespace-nowrap">{item.time}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Terms */}
        <section id="terminy" className="section-padding">
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
                      <Calendar className="w-5 h-5 text-primary-500" />
                      <span className="font-semibold text-gray-900">
                        {new Date(term.startDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{term.day} · {venue.name}</p>
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

        {/* FAQ */}
        <section className="section-padding bg-gray-50">
          <div className="section-container">
            <h2 className="heading-2 text-center mb-10">Časté otázky</h2>
            <div className="max-w-2xl mx-auto space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <FAQItem question={faq.question} answer={faq.answer} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="heading-1 text-white mb-4">Od nápadu k výrobku za jeden den</h2>
              <p className="text-lg text-white/80 mb-8">
                Vaše dítě si navrhne, vytiskne a odnese domů vlastní 3D model. Žádné předchozí zkušenosti nepotřebuje.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="#terminy" className="btn-primary text-center justify-center">
                  Zobrazit termíny
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link href="/karlovy-vary/kontakt" className="btn-secondary text-center justify-center">
                  Máte dotazy?
                </Link>
              </div>
              <p className="text-white/70 text-sm">
                Hledáte víkendový tábor?{' '}
                <Link href="/karlovy-vary/tabor-chytrych-technologii" className="text-white font-semibold hover:text-white/90 underline">
                  Přejít na Tábor chytrých technologií
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
