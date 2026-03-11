'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export function ContactSection() {
  return (
    <section id="kontakt" className="section-padding bg-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="heading-2 text-gray-900 mb-4 text-center">
            Kontaktujte <span className="text-gradient">nás</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Máte dotaz, který není v FAQ? Rádi vám pomůžeme.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
                  <a
                    href="mailto:info@weeks.cz"
                    className="text-primary-600 hover:underline"
                  >
                    info@weeks.cz
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Odpovídáme do 24 hodin (pracovní dny)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                  <a
                    href="tel:+420703046440"
                    className="text-primary-600 hover:underline"
                  >
                    +420 703 046 440
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Po-Pá 9:00-17:00
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Organizátor</h3>
                  <p className="text-gray-600">
                    DDM Praha 6<br />
                    <span className="text-sm text-gray-500">
                      Dům dětí a mládeže Praha 6
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Venues */}
            <div className="space-y-6">
              {/* Venue cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="https://maps.google.com/?q=Kongresové+centrum+Praha,+5.+května+11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">HWLab Praha</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Kongresové centrum Praha<br />
                    5. května 11, Praha 4
                  </p>
                  <p className="text-xs text-primary-600 mt-2 group-hover:underline">
                    Zobrazit na mapě →
                  </p>
                </a>
                <a
                  href="https://maps.google.com/?q=DDM+Praha+6,+U+Boroviček+5,+Praha+6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">DDM Praha 6</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    DDM Praha 6 – Bílá hora<br />
                    U Boroviček 5, Praha 6
                  </p>
                  <p className="text-xs text-primary-600 mt-2 group-hover:underline">
                    Zobrazit na mapě →
                  </p>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
