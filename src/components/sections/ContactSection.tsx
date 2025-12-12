'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'

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
            Kontakt
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Máte dotaz? Neváhejte se nám ozvat.
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
                    href="mailto:weeks@ddmpraha6.cz"
                    className="text-primary-600 hover:underline"
                  >
                    weeks@ddmpraha6.cz
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                  <a
                    href="tel:+420123456789"
                    className="text-primary-600 hover:underline"
                  >
                    +420 123 456 789
                  </a>
                  <p className="text-sm text-gray-500 mt-1">
                    Po-Pá 9:00-17:00
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Adresa</h3>
                  <p className="text-gray-600">
                    HWLab Praha<br />
                    Vyšehrad<br />
                    Praha 2
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline text-sm mt-2 inline-block"
                  >
                    Zobrazit na mapě →
                  </a>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-gray-100 rounded-2xl h-80 lg:h-auto flex items-center justify-center">
              {/* TODO: Add actual map embed */}
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Mapa HWLabu</p>
                <p className="text-sm">Bude doplněna</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
