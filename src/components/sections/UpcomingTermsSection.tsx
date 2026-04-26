'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { sendGAEvent } from '@next/third-parties/google'
import { trackRegistrationClick } from '@/lib/analytics'

type CampType = 'mix' | '3d-tisk' | 'iot'

interface ConfirmedTerm {
  id: string
  date: string
  dateLabel: string
  camp: string
  campType: CampType
  location: string
  price: string
  href: string
  registrationUrl: string
}

const confirmedTerms: ConfirmedTerm[] = [
  {
    id: 'iot-18-4',
    date: '2026-04-18',
    dateLabel: 'So 18. dubna',
    camp: 'IoT & elektronika',
    campType: 'iot',
    location: 'HWLab Praha',
    price: '1 490 Kč',
    href: '/tabor-iot',
    registrationUrl: 'https://www.ddmp6.cz/tabory/?id=773',
  },
  {
    id: '3dtisk-19-4',
    date: '2026-04-19',
    dateLabel: 'Ne 19. dubna',
    camp: '3D tisk',
    campType: '3d-tisk',
    location: 'HWLab Praha',
    price: '1 490 Kč',
    href: '/tabor-3d-tisk',
    registrationUrl: 'https://www.ddmp6.cz/tabory/?id=775',
  },
  {
    id: '3dtisk-16-5',
    date: '2026-05-16',
    dateLabel: 'So 16. května',
    camp: '3D tisk',
    campType: '3d-tisk',
    location: 'HWLab Praha',
    price: '1 490 Kč',
    href: '/tabor-3d-tisk',
    registrationUrl: 'https://www.ddmp6.cz/tabory/?id=786',
  },
  {
    id: 'iot-17-5',
    date: '2026-05-17',
    dateLabel: 'Ne 17. května',
    camp: 'IoT & elektronika',
    campType: 'iot',
    location: 'HWLab Praha',
    price: '1 490 Kč',
    href: '/tabor-iot',
    registrationUrl: 'https://www.ddmp6.cz/tabory/?id=787',
  },
]

const campColors: Record<CampType, { bg: string; text: string }> = {
  mix: { bg: 'bg-accent-500/20', text: 'text-accent-300' },
  '3d-tisk': { bg: 'bg-primary-400/20', text: 'text-primary-300' },
  iot: { bg: 'bg-trust-400/20', text: 'text-trust-300' },
}

const campBadgeLabels: Record<CampType, string> = {
  mix: 'Víkendový',
  '3d-tisk': 'Jednodenní',
  iot: 'Jednodenní',
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

export function UpcomingTermsSection() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const upcoming = confirmedTerms.filter((t) => new Date(t.date + 'T00:00:00') >= now)

  if (upcoming.length === 0) return null

  const handleClick = (term: ConfirmedTerm) => {
    trackRegistrationClick({
      termId: term.id,
      termDates: term.dateLabel,
      termLocation: term.location,
      spotsAvailable: 15,
      outboundUrl: term.registrationUrl,
      campType: term.campType === 'mix' ? 'weekend' : 'oneday',
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium text-white/80 mb-6">
            <Calendar className="w-4 h-4" />
            {upcoming.length} {upcoming.length === 1 ? 'termín' : upcoming.length < 5 ? 'termíny' : 'termínů'} s otevřenou registrací
          </div>
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
          {upcoming.map((term, index) => {
            const colors = campColors[term.campType]
            const urgency = getUrgency(term.date)

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
                    <span className="text-white font-medium text-sm">{term.dateLabel}</span>
                  </div>

                  <Link href={term.href} className="flex items-center gap-3 flex-1 min-w-0 group">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} flex-shrink-0`}>
                      {campBadgeLabels[term.campType]}
                    </span>
                    <span className="text-white font-semibold truncate group-hover:text-cta-300 transition-colors">
                      {term.camp}
                    </span>
                  </Link>

                  <span className="text-white/70 text-sm font-medium flex-shrink-0">{term.price}</span>

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
                    href={term.registrationUrl}
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
                      <span className="text-white font-medium text-sm">{term.dateLabel}</span>
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
                      {campBadgeLabels[term.campType]}
                    </span>
                    <Link href={term.href} className="text-white font-semibold text-sm hover:text-cta-300 transition-colors truncate">
                      {term.camp}
                    </Link>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm font-medium">{term.price}</span>
                    <a
                      href={term.registrationUrl}
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
