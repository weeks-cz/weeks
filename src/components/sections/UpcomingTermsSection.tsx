'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
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

// Meta Pixel "Lead" tracking — pouze pro kampaňový víkend 20.–21. 6.
// (So = IoT & elektronika, Ne = 3D tisk). Vrací null pro ostatní termíny,
// aby se Lead s content_name 'Tabor 20-21.6' nefíroval omylem jinde.
function fbLead(term: TermDisplay): { name: string; category: 'sobota' | 'nedele' } | null {
  if (term.startDate === '2026-06-20') return { name: 'Tabor 20-21.6', category: 'sobota' }
  if (term.startDate === '2026-06-21') return { name: 'Tabor 20-21.6', category: 'nedele' }
  return null
}

// Délka tábora fakticky (1 den / 2 dny / 5 dní) — místo kategorie "Jednodenní"
function daysWord(n: number): string {
  return n === 1 ? 'den' : n >= 2 && n <= 4 ? 'dny' : 'dní'
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
  // Meta Pixel "Lead": delegovaný klik na document, ať chytá i dynamicky
  // vykreslené odkazy. Neblokuje navigaci (žádný preventDefault, žádné čekání).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (typeof window.fbq !== 'function') return
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[data-fb-lead-name]')
      if (!link) return
      window.fbq('track', 'Lead', {
        content_name: link.dataset.fbLeadName,
        content_category: link.dataset.fbLeadCategory,
      })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Only render terms with a usable DDM registration link — the homepage CTA
  // is "Přihlásit se", not interest capture.
  const usable = terms.filter(t => t.registrationUrl && t.status === 'open_with_link')

  // Weekend specials without an open DDM link yet — shown as a highlighted
  // "coming soon" card with a "Zjistit víc" CTA to the camp detail page.
  const highlights = terms.filter(t => t.campType === 'weekend' && !(t.registrationUrl && t.status === 'open_with_link'))

  if (usable.length === 0 && highlights.length === 0) return null

  // Jeden seznam, jednotná struktura řádku, seřazeno podle data
  const shown = [...usable, ...highlights].sort((a, b) => a.startDate.localeCompare(b.startDate))

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
          {shown.map((term, index) => {
            const meta = campMeta[term.program] ?? campMeta['3d-tisk']
            const colors = meta.colors
            const hasLink = !!term.registrationUrl && term.status === 'open_with_link'
            const marker = hasLink
              ? getUrgency(term.startDate)
              : { label: 'Nově', className: 'bg-cta-400 text-gray-900' }
            const badgeLabel = `${term.dayCount} ${daysWord(term.dayCount)}`
            const dateLabel = shortDateLabel(term)

            const fb = fbLead(term)
            const cta = hasLink ? (
              <a
                href={term.registrationUrl!}
                target="_blank"
                rel="noopener noreferrer"
                data-fb-lead-name={fb?.name}
                data-fb-lead-category={fb?.category}
                onClick={() => handleClick(term)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-cta-500 hover:bg-cta-400 text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cta-500/30 text-sm flex-shrink-0"
              >
                Přihlásit se
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <Link
                href={`${meta.href}#terminy`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl transition-colors text-sm flex-shrink-0"
              >
                Zjistit víc
                <ArrowRight className="w-4 h-4" />
              </Link>
            )

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

                  {marker && (
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${marker.className} flex-shrink-0`}
                      role="status"
                    >
                      {marker.label}
                    </span>
                  )}

                  {cta}
                </div>

                {/* Mobile layout */}
                <div className="md:hidden p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/50" />
                      <span className="text-white font-medium text-sm">{dateLabel}</span>
                    </div>
                    {marker && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${marker.className}`}
                        role="status"
                      >
                        {marker.label}
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
                    {cta}
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
