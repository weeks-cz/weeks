'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Printer, Phone, MessageCircle, ArrowRight, Mail, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { sendGAEvent } from '@next/third-parties/google'
import { trackRegistrationClick, trackInterestSubmit } from '@/lib/analytics'
import { trackLead } from '@/lib/fbpixel'

/** Send a GA4 virtual pageview — appears in Pages & screens report */
function trackVirtualPageview(path: string) {
  sendGAEvent('event', 'page_view', {
    page_location: `https://weeks.cz${path}`,
    page_title: path,
  })
}

const CAMPS = [
  {
    id: 'iot' as const,
    title: 'IoT & elektronika',
    date: 'Sobota 18. dubna',
    termin: '18. dubna 2026',
    time: '8:30 – 16:30',
    description: 'Micro:bit, Arduino, senzory a vlastní chytré zařízení. Jeden den plný zážitků.',
    price: '1 490 Kč',
    ddmUrl: 'https://www.ddmp6.cz/tabory/?id=773',
    icon: Cpu,
    gradient: 'from-trust-500/30 to-trust-400/20',
    iconBg: 'bg-trust-500',
    buttonBg: 'bg-cta-500 hover:bg-cta-400',
    buttonShadow: 'hover:shadow-cta-500/30',
    dotColor: 'bg-trust-400',
    badgeColor: 'bg-trust-500/20 text-trust-300',
  },
  {
    id: '3d-tisk' as const,
    title: '3D tisk',
    date: 'Neděle 19. dubna',
    termin: '19. dubna 2026',
    time: '8:30 – 16:30',
    description: 'Od 3D návrhu po hotový výtisk na profesionální tiskárně. Jeden den, vlastní výtvor.',
    price: '1 490 Kč',
    ddmUrl: 'https://www.ddmp6.cz/tabory/?id=775',
    icon: Printer,
    gradient: 'from-primary-500/30 to-primary-400/20',
    iconBg: 'bg-primary-500',
    buttonBg: 'bg-cta-500 hover:bg-cta-400',
    buttonShadow: 'hover:shadow-cta-500/30',
    dotColor: 'bg-primary-400',
    badgeColor: 'bg-primary-500/20 text-primary-300',
  },
]

function CampCard({ camp, index }: { camp: typeof CAMPS[number]; index: number }) {
  const [email, setEmail] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const Icon = camp.icon

  const handleDDMClick = () => {
    trackVirtualPageview(`/registrace-duben-${camp.id}`)
    trackRegistrationClick({
      termId: camp.id,
      termDates: camp.date,
      termLocation: 'DDM Praha 6',
      spotsAvailable: 15,
      outboundUrl: camp.ddmUrl,
      campType: 'oneday',
    })
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          program: camp.id,
          termin: camp.termin,
          gdprConsent,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Něco se pokazilo')

      setIsSubmitted(true)
      setEmail('')
      setGdprConsent(false)

      trackVirtualPageview(`/lead-duben-${camp.id}`)
      trackInterestSubmit({
        programId: camp.id,
        programTitle: camp.title,
        termin: camp.termin,
        campType: 'oneday',
      })
      trackLead()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se odeslat. Zkuste to znovu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      id={`card-${camp.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="scroll-mt-4"
    >
      <div className={`h-full bg-gradient-to-br ${camp.gradient} backdrop-blur rounded-2xl p-5 sm:p-8 border border-white/20 flex flex-col`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl ${camp.iconBg} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${camp.badgeColor}`}>
            Jednodenní
          </span>
        </div>

        {/* Title + date */}
        <h2 className="text-2xl font-display font-bold text-white mb-1">
          {camp.title}
        </h2>
        <p className="text-white/90 font-semibold text-sm mb-3">
          {camp.date} · {camp.time}
        </p>

        {/* Description */}
        <p className="text-white/70 text-sm mb-4">
          {camp.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`w-2 h-2 rounded-full ${camp.dotColor}`} />
          <span className="text-white font-semibold">{camp.price}</span>
          <span className="text-white/50 text-sm">· max 15 dětí</span>
        </div>

        {/* Primary CTA */}
        <a
          href={camp.ddmUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDDMClick}
          className={`group inline-flex items-center justify-center px-6 py-3.5 ${camp.buttonBg} text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl ${camp.buttonShadow} text-base`}
        >
          Přihlásit dítě
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>

        {/* Pre-framing */}
        <p className="text-white/40 text-xs mt-3 leading-relaxed">
          Přihlášení probíhá přes oficiální systém DDM Praha 6. Celé to zabere asi 3 minuty.
        </p>

        {/* Divider */}
        <div className="border-t border-white/10 my-4" />

        {/* Záchranná síť — email lead capture */}
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 py-2"
            role="status"
            aria-live="polite"
          >
            <CheckCircle className="w-5 h-5 text-trust-400 flex-shrink-0" />
            <p className="text-white/80 text-sm">Děkujeme! Pošleme vám připomínku.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleEmailSubmit}>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-white/40" />
              <p className="text-white/60 text-xs">
                Nestíháte teď? Nechte e-mail, pošleme připomínku.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="váš@email.cz"
                className="flex-1 px-3 py-2 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cta-500 min-w-0"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !gdprConsent || !email.trim()}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSubmitting ? '...' : 'Odeslat'}
              </button>
            </div>
            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                id={`gdpr-${camp.id}`}
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-white/30 bg-white/10 text-cta-500 focus:ring-cta-500 focus:ring-offset-0"
                required
              />
              <label htmlFor={`gdpr-${camp.id}`} className="text-[11px] text-white/40 cursor-pointer leading-tight">
                Souhlasím se zpracováním osobních údajů.{' '}
                <Link href="/gdpr" className="underline hover:text-white/60">
                  Více info
                </Link>
              </label>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-xs text-red-300"
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </form>
        )}
      </div>
    </motion.div>
  )
}

export default function DubenPage() {
  useEffect(() => {
    trackVirtualPageview('/ad/duben')
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-primary-950 to-gray-950">
      {/* Top bar with back link */}
      <div className="px-4 pt-4 pb-1 flex justify-end max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-white/30 hover:text-white/60 text-xs transition-colors"
        >
          ← Zpět na hlavní web
        </Link>
      </div>

      {/* Logo */}
      <div className="pb-2 flex flex-col items-center">
        <Link href="/" aria-label="Weeks — zpět na hlavní stránku">
          <Image
            src="/images/weeks-logo.png"
            alt="Weeks"
            width={120}
            height={120}
            className="h-14 w-auto"
          />
        </Link>
        <Link href="/" className="text-white/30 hover:text-white/50 text-xs mt-1 transition-colors">
          Více o nás na Weeks.cz
        </Link>
      </div>

      {/* Headline */}
      <div className="text-center px-4 pt-3 pb-4 sm:pb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-4xl font-display font-bold text-white mb-2"
        >
          Jednodenní IT tábory pro děti
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-sm sm:text-lg max-w-lg mx-auto"
        >
          Vyberte si jednodenní tábor pro vaše dítě. Sobota 18. a neděle 19. dubna v Praze.
        </motion.p>
      </div>

      {/* Quick camp switcher (mobile) — shows both options so user knows to scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex md:hidden justify-center gap-3 px-4 pb-4"
      >
        {CAMPS.map((camp) => {
          const Icon = camp.icon
          return (
            <a
              key={camp.id}
              href={`#card-${camp.id}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white/80 text-xs font-medium transition-colors hover:bg-white/20`}
            >
              <Icon className="w-3.5 h-3.5" />
              {camp.title}
            </a>
          )
        })}
      </motion.div>

      {/* Camp cards */}
      <div className="px-4 pb-8 sm:pb-12 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {CAMPS.map((camp, i) => (
            <CampCard key={camp.id} camp={camp} index={i} />
          ))}
        </div>
      </div>

      {/* Personal assistance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-4 pb-16 max-w-xl mx-auto text-center"
      >
        <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <p className="text-white/70 text-sm mb-4">
            Zasekli jste se v systému DDM nebo si nevíte rady?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:+420703046440"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              +420 703 046 440
            </a>
            <a
              href="https://wa.me/420703046440"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-trust-600/30 hover:bg-trust-600/50 text-trust-300 rounded-lg transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
          <p className="text-white/40 text-xs mt-3">
            Rádi vám s přihláškou rovnou pomůžeme.
          </p>
        </div>
      </motion.div>

      {/* Credibility footer */}
      <div className="px-4 pb-8 text-center">
        <p className="text-white/25 text-xs">
          Tuto zjednodušenou přihlášku pro vás připravil tým z{' '}
          <Link href="/" className="underline hover:text-white/40 transition-colors">Weeks.cz</Link>
        </p>
      </div>
    </main>
  )
}
