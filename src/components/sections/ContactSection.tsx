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
                    href="tel:+4202353233332"
                    className="text-primary-600 hover:underline"
                  >
                    +420 235 323 333-2
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
                  <h3 className="font-semibold text-gray-900 mb-1">Místo konání</h3>
                  <p className="text-gray-600">
                    Kongresové centrum Praha<br />
                    5. května 11<br />
                    140 00 Praha 4 - Nusle
                  </p>
                  <a
                    href="https://maps.google.com/?q=Kongresové+centrum+Praha,+5.+května+11"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline text-sm mt-2 inline-block"
                  >
                    Zobrazit na mapě →
                  </a>
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

            {/* Map */}
            <div className="bg-gray-100 rounded-2xl h-80 lg:h-auto min-h-[320px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2561.5!2d14.4285!3d50.0621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b9390e8c4a4a7%3A0x400af0f6614d810!2sKongresov%C3%A9%20centrum%20Praha!5e0!3m2!1scs!2scz!4v1703196000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kongresové centrum Praha - 5. května 11"
                className="w-full h-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
