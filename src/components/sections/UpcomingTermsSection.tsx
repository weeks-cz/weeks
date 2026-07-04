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
    <section id="prihlasit" className="section-padding bg-night">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => sendGAEvent('event', 'view_homepage_terminy', {})}
          className="mb-10"
        >
          <p className="data-label mb-4">04 / TERMÍNY</p>
          <h2 className="heading-2 mb-8">
            Nejbližší <span className="text-gradient">termíny</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-3">
          {shown.map((term, index) => {
            const meta = campMeta[term.program] ?? campMeta['3d-tisk']
            const hasLink = !!term.registrationUrl && term.status === 'open_with_link'
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
                className="btn-primary text-sm px-4 py-2 flex-shrink-0"
              >
                Přihlásit se
              </a>
            ) : (
              <Link
                href={`${meta.href}#terminy`}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/25 text-accent-400 font-mono text-xs hover:border-accent-400/60 hover:shadow-glow transition-all rounded-lg flex-shrink-0"
              >
                Mám zájem
              </Link>
            )

            const cardClass = hasLink
              ? 'card-glow'
              : 'bg-night-800 border-dashed border border-white/25 rounded-lg transition-all duration-300'

            return (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`${cardClass} p-4`}
              >
                {/* Desktop layout */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="w-40 flex-shrink-0">
                    <span className="font-mono text-sm text-accent-400">{dateLabel}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={meta.href} className="inline-block group">
                      <span className="font-display text-white font-semibold group-hover:text-accent-400 transition-colors">
                        {meta.campLabel}
                      </span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="font-mono text-xs text-slate-400">{badgeLabel}</span>
                    <span className="font-mono text-xs text-slate-400">{priceLabel(term.price)}</span>
                    {cta}
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-accent-400">{dateLabel}</span>
                    <span className="font-mono text-xs text-slate-400">{badgeLabel}</span>
                  </div>

                  <Link href={meta.href} className="block group">
                    <span className="font-display text-white font-semibold group-hover:text-accent-400 transition-colors">
                      {meta.campLabel}
                    </span>
                  </Link>

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-slate-400">{priceLabel(term.price)}</span>
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
