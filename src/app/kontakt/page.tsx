'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare, Loader2, CheckCircle, AlertCircle, Navigation } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { trackLead } from '@/lib/fbpixel'
import { getTurnusy } from '@/lib/turnusy'
import { getVenue, type VenueId } from '@/lib/cities'
import { PROVOZNI_DOBA, SITE, getSiteFaq } from '@/lib/site'
import { SocialniSite } from '@/components/ui/SocialniSite'
import { MrizkaSekce } from '@/components/ui/MrizkaSekce'

// Provozní doba je vlastnost produktu (turnusu), ne dne v týdnu podle starého
// víkendového formátu — viz `Provozní doba táborů` na /podminky a rozvrh na
// /tabory. Žádné jiné hodiny (např. administrativní obsluhu telefonu) web
// nedokládá, proto tu nejsou — viz opravné kolo 1 v reportu.
const operatingHours = [
  { day: 'Pondělí – Pátek', hours: `${PROVOZNI_DOBA.od} – ${PROVOZNI_DOBA.do}`, note: 'Průběh tábora' },
]

// Výtah ze sdíleného FAQ (`getSiteFaq()`), ne vlastní kopie. /kontakt bylo
// jediná stránka s vlastními odpovědmi a rozcházelo se s nimi: tvrdilo, že si
// děti nosí „pouze svačinu na dopoledne", zatímco FAQ na úvodce i na /tabory
// mluví o svačině na dopoledne i odpoledne. Dokud se preview bere shora ze
// sdíleného zdroje, nemá se s čím rozejít — a tlačítko pod ním vede na celé FAQ.
const faqPreview = getSiteFaq().slice(0, 3)

export default function ContactPage() {
  // Místa konání — jen ta, která nějaký turnus doopravdy má. Dnes vyjde jedna
  // karta (FabLab VARY&TE u karlovarského turnusu), pražský turnus místo
  // ještě nemá. Kód počítá s tím, že se to může časem změnit.
  const turnusy = getTurnusy()
  const venueIds = Array.from(
    new Set(turnusy.map((t) => t.venueId).filter((id): id is VenueId => id !== null))
  )
  const venues = venueIds.map((id) => getVenue(id))
  const chybiMisto = turnusy.some((t) => t.venueId === null)

  const contactInfo = [
    {
      icon: Mail,
      title: 'E-mail',
      value: SITE.email,
      link: `mailto:${SITE.email}`,
      description: 'Odpovíme co nejdříve.',
    },
    {
      icon: Phone,
      title: 'Telefon',
      value: SITE.phone,
      link: `tel:${SITE.phone.replace(/\s+/g, '')}`,
      description: 'Ozveme se co nejdříve.',
    },
    {
      icon: MapPin,
      title: 'Místa konání',
      value: venues.length > 0 ? venues.map((v) => v.name).join(' · ') : 'Upřesníme',
      description:
        venues.length > 0
          ? `${venues.map((v) => v.city).join(', ')}${chybiMisto ? ' · další upřesníme' : ''}`
          : 'U každého turnusu upřesníme před otevřením termínu.',
    },
    {
      icon: Clock,
      title: 'Provozní doba táborů',
      value: 'Pondělí – Pátek',
      description: `${PROVOZNI_DOBA.od} – ${PROVOZNI_DOBA.do}`,
    },
  ]

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
                  initial={{ y: 20 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-maker p-6 text-center"
                >
                  <div className="w-12 h-12 bg-white border border-ink/15 rounded-sm flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  {/* `h2`, ne `h3`: karty jsou první nadpisy pod `h1` stránky
                      a úroveň by přeskakovala. Vzhled drží třída `mono-label`. */}
                  <h2 className="mono-label mb-2">
                    {info.title}
                  </h2>
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
                initial={{ x: -20 }}
                whileInView={{ x: 0 }}
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
                        <Loader2 className="w-5 h-5 animate-spin" />
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
                      <p>Něco se pokazilo. Zkuste to prosím znovu nebo nám napište na {SITE.email}</p>
                    </div>
                  )}

                  {submitStatus === 'idle' && (
                    <p className="text-sm text-ink-500 text-center">
                      Odpovíme vám co nejdříve.{' '}
                      <Link href="/gdpr" className="underline hover:text-ink">
                        Informace o zpracování údajů
                      </Link>
                    </p>
                  )}
                </form>
              </motion.div>

              {/* Map & Info */}
              <motion.div
                initial={{ x: 20 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Místa konání — karta na turnus, který má domluvené místo.
                    Dnes vyjde jedna (FabLab VARY&TE), pražský turnus místo
                    ještě nemá — stejný vzor jako sekce měst na `/tabory`. */}
                {venues.map((venue) => (
                  <div key={venue.id} className="card-maker overflow-hidden">
                    <div className="h-64">
                      <iframe
                        src={`https://www.google.com/maps?q=${venue.mapQuery}&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={venue.fullName}
                        aria-label={`Mapa: ${venue.fullName}`}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-4 border-t border-ink/15 bg-white">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-ink">{venue.fullName}</p>
                          <p className="text-xs text-ink-500">
                            {venue.street}, {venue.postalCode} {venue.city}
                          </p>
                        </div>
                        <a
                          href={`https://maps.google.com/?q=${venue.mapQuery}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary-600 hover:underline shrink-0"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Navigovat
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Turnusy bez domluveného místa — dnes pražský. Když nemá
                    místo žádný turnus, zůstane na stránce jen tahle věta. */}
                {chybiMisto && (
                  <p className="text-sm text-ink-500">
                    U turnusů bez uvedeného místa ho upřesníme před otevřením
                    termínu. Přehled najdete na stránce{' '}
                    <Link href="/tabory" className="underline hover:text-ink">
                      turnusů
                    </Link>
                    .
                  </p>
                )}

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

                {/* Sociální sítě — stejný seznam jako v patičce (`SOCIALNI_SITE`). */}
                <div className="card-maker p-6">
                  <h3 className="font-display text-lg font-semibold text-ink mb-4">
                    Sledujte nás
                  </h3>
                  <SocialniSite />
                </div>

                {/* Identifikace provozovatele — drobně, ať nepřebíjí kontaktní
                    údaje (stejný vzor jako v patičce, `Footer.tsx`). */}
                <p className="font-mono text-xs text-ink-500">
                  {SITE.legalName}, IČO {SITE.ico}
                  <br />
                  {SITE.address}
                  <br />
                  {SITE.court}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="section-padding bg-paper">
          <div className="section-container">
            <motion.div
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
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
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
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
        <MrizkaSekce odstin="tmavy" className="section-padding bg-ink text-paper blueprint-grid-dark border-y border-ink">
          <div className="section-container">
            <motion.div
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-2 text-paper mb-6">
                Stále máte dotazy?
              </h2>
              <p className="text-xl text-paper/90 mb-8">
                Neváhejte nás kontaktovat! Rádi vám poradíme a zodpovíme
                jakékoliv otázky ohledně našich táborů.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={`mailto:${SITE.email}`} className="btn-primary">
                  <Mail className="w-5 h-5" />
                  {SITE.email}
                </a>
                <a href={`tel:${SITE.phone.replace(/\s+/g, '')}`} className="border border-paper/30 text-paper hover:border-paper rounded-md px-6 py-3 font-semibold transition-all duration-200 inline-flex items-center justify-center">
                  <Phone className="w-5 h-5 mr-2" />
                  {SITE.phone}
                </a>
              </div>
            </motion.div>
          </div>
        </MrizkaSekce>
      </main>
      <Footer />
    </>
  )
}
