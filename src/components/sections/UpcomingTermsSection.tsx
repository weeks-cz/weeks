'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { sendGAEvent } from '@next/third-parties/google'
import { trackRegistrationClick } from '@/lib/analytics'
import type { TermDisplay } from '@/lib/camps'

const campMeta: Record<string, { label: string; href: string; campLabel: string; colors: { bg: string; text: string }; campType: 'weekend' | 'oneday' }> = {
  'tech':    { label: 'Tábor chytrých technologií', href: '/tabor-chytrych-technologii', campLabel: 'Tábor chytrých technologií', colors: { bg: 'bg-accent-500/20', text: 'text-accent-300' }, campType: 'weekend' },
  '3d-tisk': { label: '3D tisk',                    href: '/tabor-3d-tisk',              campLabel: '3D tisk',                   colors: { bg: 'bg-primary-400/20', text: 'text-primary-300' }, campType: 'oneday' },
  'iot':     { label: 'IoT & elektronika',          href: '/tabor-iot',                  campLabel: 'IoT & elektronika',         colors: { bg: 'bg-trust-400/20', text: 'text-trust-300' }, campType: 'oneday' },
}

function shortDateLabel(termin: TermDisplay): string {
  // "So 18. dubna" / "4. – 5. července"
  if (termin.campType === 'weekend') return termin.weekendDateLabel
  const dayShort = termin.dayLabel === 'sobota' ? 'So' : termin.dayLabel === 'neděle' ? 'Ne' : ''
  return dayShort ? `${dayShort} ${termin.dateShortLabel}` : termin.dateShortLabel
}

function priceLabel(price: number | null): string {
  if (!price) return ''
  return `${price.toLocaleString('cs-CZ').replace(/,/g, ' ')} Kč`
}

function getUrgency(dateStr: string): { label: string; className: string } | null {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  const diffDays = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return null
  if (diffDays === 0) return { label: 'Dnes!', className: 'bg-cta-500 text-gray-900' }
  if (diffDays <= 6) return { label: 'Poslední dny!', className: 'bg-red-500 text-white animate-pulse' }
  if (diffDays <= 21) return { label: `za ${diffDays} dní`, className: 'bg-cta-500/20 text-cta-300' }
  return null
}

export function UpcomingTermsSection({ terms }: { terms: TermDisplay[] }) {
  // Only render terms with a usable DDM registration link — the homepage CTA
  // is "Přihlásit se", not interest capture.
  const usable = terms.filter(t => t.registrationUrl && t.status === 'open_with_link')

  // Weekend specials without an open DDM link yet — shown as a highlighted
  // "coming soon" card with a "Zjistit víc" CTA to the camp detail page.
  const highlights = terms.filter(t => t.campType === 'weekend' && !(t.registrationUrl && t.status === 'open_with_link'))

  if (usable.length === 0 && highlights.length === 0) return null

  const handleClick = (term: TermDisplay) => {
    const meta = campMeta[term.program] ?? campMeta['3d-tisk']
    trackRegistrationClick({
      termId: term.id,
      termDates: shortDateLabel(term),
      termLocation: term.location || 'HWLab Praha',
      spotsAvailable: Math.max(0, term.capacity - term.enrolledCount),
      outboundUrl: term.registrationUrl!,
      campType: meta.campType,
    })
  }

  return (
    <section id="prihlasit" className="section-padding bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => sendGAEvent('event', 'view_homepage_terminy', {})}
          className="text-center mb-10"
        >
          {usable.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium text-white/80 mb-6">
              <Calendar className="w-4 h-4" />
              {usable.length} {usable.length === 1 ? 'termín' : usable.length < 5 ? 'termíny' : 'termínů'} s otevřenou registrací
            </div>
          )}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Nejbližší{' '}
            <span className="bg-gradient-to-r from-cta-400 to-cta-300 bg-clip-text text-transparent">
              termíny
            </span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Vyberte si a přihlaste se — registrace přes DDM Praha 6
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-3">
          {/* Highlighted weekend specials without an open registration link yet */}
          {highlights.map((term) => {
            const meta = campMeta[term.program] ?? campMeta['3d-tisk']
            return (
              <motion.div
                key={`hl-${term.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-sm rounded-2xl border border-cta-400/50 p-4 flex flex-col md:flex-row md:items-center gap-3"
              >
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cta-400 text-gray-900 text-xs font-bold self-start">
                  <Sparkles className="w-3.5 h-3.5" /> NOVĚ
                </span>
                <div className="flex items-center gap-2 md:w-44 flex-shrink-0">
                  <Clock className="w-4 h-4 text-white/50" />
                  <span className="text-white font-medium text-sm">{shortDateLabel(term)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-white font-semibold">Dvoudenní {meta.campLabel}</span>
                  {term.price ? <span className="text-white/60 text-sm ml-2">{priceLabel(term.price)}</span> : null}
                </div>
                <Link
                  href={`${meta.href}#dvoudenni`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl transition-colors text-sm flex-shrink-0 self-start md:self-auto"
                >
                  Zjistit víc
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )
          })}
          {usable.map((term, index) => {
            const meta = campMeta[term.program] ?? campMeta['3d-tisk']
            const colors = meta.colors
            const urgency = getUrgency(term.startDate)
            const badgeLabel = meta.campType === 'weekend' ? 'Víkendový' : 'Jednodenní'
            const dateLabel = shortDateLabel(term)

            return (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-colors"
              >
                {/* Desktop layout */}
                <div className="hidden md:flex items-center gap-4 p-4">
                  <div className="flex items-center gap-3 w-52 flex-shrink-0">
                    <Clock className="w-4 h-4 text-white/50 flex-shrink-0" />
                    <span className="text-white font-medium text-sm">{dateLabel}</span>
                  </div>

                  <Link href={meta.href} className="flex items-center gap-3 flex-1 min-w-0 group">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} flex-shrink-0`}>
                      {badgeLabel}
                    </span>
                    <span className="text-white font-semibold truncate group-hover:text-cta-300 transition-colors">
                      {meta.campLabel}
                    </span>
                  </Link>

                  <span className="text-white/70 text-sm font-medium flex-shrink-0">{priceLabel(term.price)}</span>

                  {urgency && (
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${urgency.className} flex-shrink-0`}
                      role="status"
                      aria-label={`Do začátku zbývá: ${urgency.label}`}
                    >
                      {urgency.label}
                    </span>
                  )}

                  <a
                    href={term.registrationUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleClick(term)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-cta-500 hover:bg-cta-400 text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cta-500/30 text-sm flex-shrink-0"
                  >
                    Přihlásit se
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Mobile layout */}
                <div className="md:hidden p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/50" />
                      <span className="text-white font-medium text-sm">{dateLabel}</span>
                    </div>
                    {urgency && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${urgency.className}`}
                        role="status"
                        aria-label={`Do začátku zbývá: ${urgency.label}`}
                      >
                        {urgency.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                      {badgeLabel}
                    </span>
                    <Link href={meta.href} className="text-white font-semibold text-sm hover:text-cta-300 transition-colors truncate">
                      {meta.campLabel}
                    </Link>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm font-medium">{priceLabel(term.price)}</span>
                    <a
                      href={term.registrationUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleClick(term)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-cta-500 hover:bg-cta-400 text-gray-900 font-semibold rounded-xl transition-all duration-300 text-sm"
                    >
                      Přihlásit se
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
