'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLocation } from '@/contexts/LocationContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Clock, Users, MapPin, Calendar, ArrowRight, Utensils, Laptop, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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
  { question: 'Je potřeba nějaká předchozí zkušenost s elektronikou?', answer: 'Ne, žádné předchozí zkušenosti nejsou potřeba. Program je navržený tak, aby zvládli i úplní začátečníci. Pokročilí dostanou složitější výzvy.' },
  { question: 'Co si děti odnesou domů?', answer: 'Děti si odnesou zkušenosti s programováním a elektronikou. Micro:bity a Arduina zůstávají v laboratoři, ale děti získají přístup k online prostředí, kde mohou pokračovat v programování doma.' },
  { question: 'Je oběd v ceně?', answer: 'Ano, oběd je zajištěný a v ceně tábora. Na dopoledne a odpoledne si děti přinesou vlastní svačinu. Pití je k dispozici po celý den.' },
  { question: 'Jaký je rozdíl oproti víkendovému táboru?', answer: 'Jednodenní tábor je zaměřený čistě na IoT a elektroniku – za jeden den postavíte vlastní chytré zařízení. Víkendový Tábor chytrých technologií kombinuje 3D tisk, IoT a virtuální realitu.' },
  { question: 'Kolik stojí jednodenní tábor?', answer: 'Cena je 1 490 Kč za jeden den (8 hodin programu, sobota nebo neděle dle termínu). Zahrnuje veškeré materiály, oběd a vybavení.' },
]

const practicalInfoCards = [
  { icon: Utensils, title: 'Stravování', description: 'Oběd je zajištěný a v ceně. Na dopoledne a odpoledne si děti přinesou vlastní svačinu. Pití je k dispozici po celý den.' },
  { icon: Laptop, title: 'Vybavení', description: 'Micro:bity, Arduina, senzory a veškeré komponenty jsou na místě ve Vary&Te. Děti nemusí nic nosit.' },
  { icon: Users, title: 'Kapacita', description: 'Maximálně 15 dětí na termín. Menší skupinka zajišťuje individuální přístup lektorů.' },
  { icon: Clock, title: 'Čas', description: 'Sobota nebo neděle dle termínu. Příchod od 8:30, program 9:00–16:30.' },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-trust-500 focus-visible:ring-offset-2 transition"
      >
        <span className="font-medium text-gray-900 text-left">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 flex-shrink-0 ml-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 overflow-hidden"
          >
            <p className="px-6 py-4 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function KVIoT() {
  const location = useLocation()
  const program = location.programs.find(p => p.id === 'iot')!
  const terms = location.terms.filter(t => t.program === 'iot')
  const venue = location.venues[0]

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-20 bg-gradient-to-br from-trust-600 to-trust-800 overflow-hidden">
          <div className="section-container relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
                <Cpu className="w-4 h-4" />
                Jednodenní tábor
              </span>
              <h1 className="heading-1 text-white mb-4">IoT & elektronika</h1>
              <p className="text-xl text-white/80 max-w-2xl">
                Micro:bit, Arduino a senzory — vytvořte si vlastní chytré zařízení.
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
                    'Základy práce s Micro:bit a Arduino',
                    'Zapojení senzorů a komponent',
                    'Programování chytrého zařízení',
                    'Vlastní IoT projekt — výsledek domů',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-trust-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-trust-600">{i + 1}</span>
                      </div>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Klíčové informace</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5 text-trust-500" />
                      <span>8:30 – 16:30 (celodenní program)</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="w-5 h-5 text-trust-500" />
                      <span>Max. {program.capacity} dětí ve skupině</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5 text-trust-500" />
                      <span>{venue.name}, {venue.city}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="text-2xl font-bold text-trust-600">{program.price.toLocaleString('cs-CZ')} Kč</span>
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

        {/* Day Program Schedule */}
        <section className="section-padding bg-gray-50">
          <div className="section-container">
            <h2 className="heading-2 text-center mb-10">Harmonogram dne</h2>
            <div className="max-w-3xl mx-auto space-y-3">
              {dayProgram.map((slot, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-lg p-4 border border-gray-200 flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <Cpu className="w-5 h-5 text-trust-600 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-mono text-sm font-semibold text-trust-600">{slot.time}</span>
                      <h3 className="font-semibold text-gray-900">{slot.title}</h3>
                    </div>
                    {slot.description && <p className="text-sm text-gray-600">{slot.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Practical Info Cards */}
        <section className="section-padding">
          <div className="section-container">
            <h2 className="heading-2 text-center mb-10">Praktické informace</h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {practicalInfoCards.map((card, i) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-trust-100 rounded-lg">
                        <Icon className="w-5 h-5 text-trust-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{card.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="section-padding bg-gray-50" id="terminy">
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
                      <Calendar className="w-5 h-5 text-trust-500" />
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

        {/* FAQ Section */}
        <section className="section-padding">
          <div className="section-container max-w-2xl mx-auto">
            <h2 className="heading-2 text-center mb-10">Často kladené otázky</h2>
            <div className="space-y-3">
              {campFaqs.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative py-16 bg-gradient-to-br from-trust-600 via-trust-700 to-trust-800 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"></div>
          </div>
          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="heading-2 text-white mb-3">Vlastní chytré zařízení za jeden den</h2>
              <p className="text-lg text-white/80 mb-8">
                Vaše dítě si naprogramuje a postaví IoT projekt s Micro:bitem a Arduinem. Žádné předchozí zkušenosti nepotřebuje.
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
              <div className="pt-8 border-t border-white/20">
                <p className="text-white/70 text-sm mb-3">Hledáte víkendový tábor?</p>
                <Link
                  href="/karlovy-vary/tabor-chytrych-technologii"
                  className="inline-flex items-center gap-2 text-white hover:text-white/90 font-medium transition"
                >
                  Tábor chytrých technologií
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
