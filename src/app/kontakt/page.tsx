'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'

const contactInfo = [
  {
    icon: Mail,
    title: 'E-mail',
    value: 'info@weeks.cz',
    link: 'mailto:info@weeks.cz',
    description: 'Odpovídáme do 24 hodin (pracovní dny)',
  },
  {
    icon: Phone,
    title: 'Telefon',
    value: '+420 XXX XXX XXX',
    link: 'tel:+420XXXXXXXXX',
    description: 'Po-Pá 9:00-17:00',
  },
  {
    icon: MapPin,
    title: 'Místo konání',
    value: 'DDM Praha 6',
    address: 'U Boroviček 5, 163 00 Praha 6',
    link: 'https://www.google.com/maps/search/?api=1&query=DDM+Praha+6,+U+Boroviček+5',
    description: 'DDM Praha 6 – Bílá hora',
  },
  {
    icon: Clock,
    title: 'Provozní doba kempů',
    value: 'Sobota & Neděle',
    description: '9:00 - 17:00',
  },
]

const operatingHours = [
  { day: 'Pondělí - Pátek', hours: '9:00 - 17:00', note: 'Administrativní hodiny' },
  { day: 'Sobota & Neděle', hours: '9:00 - 17:00', note: 'Průběh kempů' },
]

const faqPreview = [
  {
    question: 'Jakou úroveň znalostí dítě potřebuje?',
    answer: 'Žádnou! Programy přizpůsobujeme věku a zkušenostem dětí.',
  },
  {
    question: 'Co si dítě odnese domů?',
    answer: 'Všechny projekty, které během kempu vytvoří - 3D tisky, kód a další výtvory.',
  },
  {
    question: 'Je zajištěno stravování?',
    answer: 'Ano, oběd zajišťujeme my. Děti si nosí pouze svačinu na dopoledne.',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl" />
          </div>

          <div className="section-container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Link href="/" className="text-gray-500 hover:text-primary-600 transition-colors">
                  Domů
                </Link>
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-900 font-medium">Kontakt</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="heading-1 text-gray-900 mb-6"
              >
                Kontaktujte <span className="text-gradient">nás</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Máte dotaz, který není v FAQ? Nebo chcete jen pozdravit?
                Rádi vám pomůžeme!
              </motion.p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-gray-50 rounded-2xl text-center"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      target={info.link.startsWith('http') ? '_blank' : undefined}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-primary-600 hover:underline font-medium block mb-1"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-900 font-medium mb-1">{info.value}</p>
                  )}
                  {info.address && (
                    <p className="text-sm text-gray-600 mb-1">{info.address}</p>
                  )}
                  <p className="text-sm text-gray-500">{info.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Contact Section - Form & Map */}
        <section className="section-padding bg-gray-50">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-3 text-gray-900 mb-6">
                  Napište nám
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Vaše jméno
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Jan Novák"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="jan.novak@email.cz"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Zpráva
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Vaše zpráva..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Odesílám...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Odeslat zprávu
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg" role="alert">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <p>Děkujeme za zprávu! Odpovíme vám co nejdříve.</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg" role="alert">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p>Něco se pokazilo. Zkuste to prosím znovu nebo nám napište na info@weeks.cz</p>
                    </div>
                  )}

                  {submitStatus === 'idle' && (
                    <p className="text-sm text-gray-500 text-center">
                      Odpovíme vám do 24 hodin v pracovních dnech.{' '}
                      <Link href="/gdpr" className="underline hover:text-gray-700">
                        Informace o zpracování údajů
                      </Link>
                    </p>
                  )}
                </form>
              </motion.div>

              {/* Map & Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Map */}
                <div className="bg-gray-200 rounded-2xl h-80 overflow-hidden">
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

                {/* Provozní doba */}
                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    Provozní doba
                  </h3>
                  <div className="space-y-3">
                    {operatingHours.map((item, index) => (
                      <div key={index} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{item.day}</p>
                          <p className="text-sm text-gray-500">{item.note}</p>
                        </div>
                        <p className="font-semibold text-primary-600">{item.hours}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Provozovatel */}
                <div className="bg-primary-50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Organizátor
                  </h3>
                  <p className="text-gray-700 mb-1 font-medium">
                    DDM Praha 6
                  </p>
                  <p className="text-sm text-gray-600">
                    Dům dětí a mládeže Praha 6
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    Weeks je projekt organizovaný DDM Praha 6,
                    institucí s více než 70letou tradicí v oblasti
                    volnočasových aktivit pro děti.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="section-padding bg-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="heading-2 text-gray-900 mb-4 text-center">
                Často kladené <span className="text-gradient">otázky</span>
              </h2>
              <p className="text-lg text-gray-600 mb-12 text-center">
                Odpovědi na nejčastější dotazy najdete v naší FAQ sekci
              </p>

              <div className="space-y-4 mb-8">
                {faqPreview.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-2xl p-6"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.question}
                    </h3>
                    <p className="text-gray-600">
                      {item.answer}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Link href="/#faq" className="btn-outline">
                  Zobrazit všechny FAQ
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-br from-primary-600 to-accent-600">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-2 text-white mb-6">
                Stále máte dotazy?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Neváhejte nás kontaktovat! Rádi vám poradíme a zodpovíme
                jakékoliv otázky ohledně našich kempů.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:info@weeks.cz" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                  <Mail className="w-5 h-5 mr-2" />
                  info@weeks.cz
                </a>
                <a href="tel:+420XXXXXXXXX" className="btn-outline border-white text-white hover:bg-white/10">
                  <Phone className="w-5 h-5 mr-2" />
                  +420 XXX XXX XXX
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
