'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useLocation } from '@/contexts/LocationContext'
import { motion } from 'framer-motion'
import { Cpu, Clock, Users, MapPin, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

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
                  <h3 className="font-semibold text-gray-900 mb-4">Praktické informace</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5 text-trust-500" />
                      <span>9:00 – 16:00 (celodenní program)</span>
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

        {/* Terms */}
        <section className="section-padding bg-gray-50">
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
      </main>
      <Footer />
    </>
  )
}
