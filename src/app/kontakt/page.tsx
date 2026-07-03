'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare, Loader2, CheckCircle, AlertCircle, Navigation } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { trackLead } from '@/lib/fbpixel'

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
    value: '+420 703 046 440',
    link: 'tel:+420703046440',
    description: 'Po-Pá 9:00-17:00',
  },
  {
    icon: MapPin,
    title: 'Místa konání',
    value: 'Praha 4 & Praha 6',
    description: 'HWLab Praha · DDM Praha 6',
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
  const [activeVenue, setActiveVenue] = useState<'hwlab' | 'ddm'>('hwlab')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    gdprConsent: false,
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
        setFormData({ name: '', email: '', message: '', gdprConsent: false })
        trackLead()
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
        <section className="bg-paper blueprint-grid border-b border-ink/15 pt-32 pb-16">
          <div className="section-container">
            <div className="max-w-4xl mx-auto text-center">
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 font-mono text-xs uppercase tracking-[0.2em]"
              >
                <Link href="/" className="text-ink/50 hover:text-primary-600 transition-colors">
                  Domů
                </Link>
                <span className="text-ink/30 mx-2">/</span>
                <span className="text-ink font-medium">Kontakt</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mono-label mb-4"
              >
                Kontakt
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="heading-1 text-ink mb-6"
              >
                Kontaktujte nás
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-ink-500 max-w-2xl mx-auto"
              >
                Máte dotaz, který není v FAQ? Nebo chcete jen pozdravit?
                Rádi vám pomůžeme!
              </motion.p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="section-padding bg-paper">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-maker p-6 text-center"
                >
                  <div className="w-12 h-12 bg-white border border-ink/15 rounded-sm flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="mono-label mb-2">
                    {info.title}
                  </h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      target={info.link.startsWith('http') ? '_blank' : undefined}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-mono text-primary-600 hover:underline block mb-1"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-ink font-medium mb-1">{info.value}</p>
                  )}
                  <p className="text-sm text-ink-500">{info.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Contact Section - Form & Map */}
        <section className="section-padding bg-paper-soft border-y border-ink/15">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="mono-label mb-4">Formulář</p>
                <h2 className="heading-2 text-ink mb-6">
                  Napište nám
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
                      Vaše jméno
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-md bg-white border border-ink/20 text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
                      placeholder="Jan Novák"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-md bg-white border border-ink/20 text-ink placeholder:text-ink/40 font-mono text-sm focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
                      placeholder="jan.novak@email.cz"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-ink mb-2">
                      Zpráva
                    </label>
                    <textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 rounded-md bg-white border border-ink/20 text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink resize-none"
                      placeholder="Vaše zpráva..."
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="gdpr-contact"
                      required
                      checked={formData.gdprConsent}
                      onChange={(e) => setFormData({ ...formData, gdprConsent: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded-sm border-ink/30"
                    />
                    <label htmlFor="gdpr-contact" className="text-sm text-ink-500 cursor-pointer">
                      Souhlasím se{' '}
                      <Link href="/gdpr" className="underline hover:text-ink">
                        zpracováním osobních údajů
                      </Link>{' '}
                      za účelem zpracování mého dotazu.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.gdprConsent}
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
                    <div className="flex items-center gap-2 p-4 bg-trust-50 text-trust-700 rounded-md border border-trust-200" role="alert">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <p>Děkujeme za zprávu! Odpovíme vám co nejdříve.</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-md border border-red-200" role="alert">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p>Něco se pokazilo. Zkuste to prosím znovu nebo nám napište na info@weeks.cz</p>
                    </div>
                  )}

                  {submitStatus === 'idle' && (
                    <p className="text-sm text-ink-500 text-center">
                      Odpovíme vám do 24 hodin v pracovních dnech.{' '}
                      <Link href="/gdpr" className="underline hover:text-ink">
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
                {/* Venue Tabs + Map */}
                <div className="card-maker overflow-hidden">
                  <div className="flex border-b border-ink/15">
                    <button
                      onClick={() => setActiveVenue('hwlab')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeVenue === 'hwlab'
                          ? 'text-ink font-semibold border-b-2 border-ink'
                          : 'text-ink-500 hover:text-ink'
                      }`}
                    >
                      HWLab Praha
                    </button>
                    <button
                      onClick={() => setActiveVenue('ddm')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeVenue === 'ddm'
                          ? 'text-ink font-semibold border-b-2 border-ink'
                          : 'text-ink-500 hover:text-ink'
                      }`}
                    >
                      DDM Praha 6
                    </button>
                  </div>
                  <div className="h-64">
                    {activeVenue === 'hwlab' ? (
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2561.5!2d14.4285!3d50.0621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b9390e8c4a4a7%3A0x400af0f6614d810!2sKongresov%C3%A9%20centrum%20Praha!5e0!3m2!1scs!2scz!4v1703196000000"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="HWLab Praha - Kongresové centrum Praha"
                        className="w-full h-full"
                      />
                    ) : (
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.0!2d14.3350!3d50.0830!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b951a0e1c4b1d%3A0x1e4b5a6e3a7b8c9d!2sU+Borovi%C4%8Dek+5%2C+Praha+6!5e0!3m2!1scs!2scz!4v1703196000000"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="DDM Praha 6 - U Boroviček 5"
                        className="w-full h-full"
                      />
                    )}
                  </div>
                  <div className="p-4 border-t border-ink/15 bg-white">
                    {activeVenue === 'hwlab' ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-ink">Kongresové centrum Praha</p>
                          <p className="text-xs text-ink-500">5. května 11, Praha 4 · Metro C – Vyšehrad</p>
                        </div>
                        <a
                          href="https://maps.google.com/?q=Kongresové+centrum+Praha,+5.+května+11"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary-600 hover:underline shrink-0"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Navigovat
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-ink">DDM Praha 6 – Bílá hora</p>
                          <p className="text-xs text-ink-500">U Boroviček 5, Praha 6</p>
                        </div>
                        <a
                          href="https://maps.google.com/?q=DDM+Praha+6,+U+Boroviček+5,+Praha+6"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary-600 hover:underline shrink-0"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Navigovat
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Provozní doba */}
                <div className="card-maker p-6">
                  <h3 className="font-display text-lg font-semibold text-ink mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    Provozní doba
                  </h3>
                  <div className="space-y-3">
                    {operatingHours.map((item, index) => (
                      <div key={index} className="flex justify-between items-start pb-3 border-b border-ink/15 last:border-0">
                        <div>
                          <p className="font-medium text-ink">{item.day}</p>
                          <p className="text-sm text-ink-500">{item.note}</p>
                        </div>
                        <p className="font-semibold font-mono text-primary-600">{item.hours}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organizátor */}
                <div className="card-maker p-6 border-ink bg-primary-50">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">
                    Organizátor
                  </h3>
                  <p className="text-ink mb-1 font-medium">
                    DDM Praha 6
                  </p>
                  <p className="text-sm text-ink-500">
                    Dům dětí a mládeže Praha 6
                  </p>
                  <p className="text-sm text-ink-500 mt-3">
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
        <section className="section-padding bg-paper">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <p className="mono-label text-center mb-4">FAQ</p>
              <h2 className="heading-2 text-ink mb-4 text-center">
                Často kladené otázky
              </h2>
              <p className="text-lg text-ink-500 mb-12 text-center">
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
                    className="card-maker rounded-md p-6"
                  >
                    <h3 className="font-semibold text-ink mb-2">
                      {item.question}
                    </h3>
                    <p className="text-ink-500">
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
        <section className="section-padding bg-ink text-paper blueprint-grid-dark border-y border-ink">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-2 text-paper mb-6">
                Stále máte dotazy?
              </h2>
              <p className="text-xl text-paper/90 mb-8">
                Neváhejte nás kontaktovat! Rádi vám poradíme a zodpovíme
                jakékoliv otázky ohledně našich kempů.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:info@weeks.cz" className="btn-primary">
                  <Mail className="w-5 h-5 mr-2" />
                  info@weeks.cz
                </a>
                <a href="tel:+420703046440" className="border border-paper/30 text-paper hover:border-paper rounded-md px-6 py-3 font-semibold transition-all duration-200 inline-flex items-center justify-center">
                  <Phone className="w-5 h-5 mr-2" />
                  +420 703 046 440
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
