'use client'

import { motion } from 'framer-motion'
import { Calendar, Check, Sparkles, Users, Clock, Phone, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { trackInterestSubmit, trackRegistrationFormOpen, trackRegistrationClick } from '@/lib/analytics'
import type { TermDisplay } from '@/lib/camps'

const INFO_PHONE_LABEL = '+420 703 046 440'
const INFO_PHONE_HREF = 'tel:+420703046440'
const INFO_EMAIL = 'admin@weeks.cz'

type Program = '3d-tisk' | 'iot'

interface WeekendCampHighlightProps {
  terms: TermDisplay[]
  program: Program
  programTitle: string
}

function formatPrice(price: number | null): string {
  if (price == null) return ''
  return `${price.toLocaleString('cs-CZ')} Kč`
}

const DAY_NAMES = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota']

// Skutečný název dne z ISO data (T12:00 kvůli časovým zónám) — ať výběr dne
// sedí na reálné datum tábora, ne na předpoklad So/Ne.
function dayName(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return Number.isNaN(d.getTime()) ? '' : DAY_NAMES[d.getDay()]
}

export function WeekendCampHighlight({ terms, program, programTitle }: WeekendCampHighlightProps) {
  if (terms.length === 0) return null
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {terms.map((term) => (
        <WeekendCard key={term.id} term={term} program={program} programTitle={programTitle} />
      ))}
    </div>
  )
}

function WeekendCard({ term, program, programTitle }: { term: TermDisplay; program: Program; programTitle: string }) {
  const year = term.startDate.slice(0, 4)
  const baseTermin = `Dvoudenní ${programTitle} ${term.weekendDateLabel} ${year}`
  const hasLink = term.status === 'open_with_link' && !!term.registrationUrl
  // Skutečné dny tábora (např. čtvrtek + pátek) — odvozené z datumů
  const dayOptions = Array.from(new Set([dayName(term.startDate), dayName(term.endDate)].filter(Boolean)))

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-white shadow-xl border border-primary-100 overflow-hidden"
    >
      {/* Horní gradientový pruh */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cta-400 text-gray-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> NOVĚ
          </span>
          <h3 className="text-xl font-bold text-white">Dvoudenní tábor {programTitle}</h3>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-white/90 text-sm">
          <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {term.weekendDateLabel}</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" /> 2 dny</span>
          <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4" /> max {term.capacity} dětí</span>
          {term.price != null && <span className="font-bold text-white">{formatPrice(term.price)}</span>}
        </div>
      </div>

      <div className="p-6">
        {/* Pitch */}
        <p className="text-gray-600 mb-4">
          Dva navazující dny u 3D tiskáren — víc času na vlastní projekty, větší výtisky
          a prostor projít si celý proces od návrhu po hotový kus do detailu.
        </p>

        {/* Flexibilita */}
        <div className="flex gap-3 p-4 rounded-xl bg-cta-50 border border-cta-200 mb-6">
          <Check className="w-5 h-5 text-cta-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Stačí přijít i jen na jeden den.</span>{' '}
            Není to problém — program dítěti přizpůsobíme, ať dorazí na oba dny, nebo jen na jeden.
          </p>
        </div>

        {/* Dvě cesty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Blok A: celý víkend */}
          <div className="rounded-2xl border border-gray-200 p-5">
            <h4 className="font-semibold text-gray-900 mb-1">Oba dny</h4>
            {hasLink ? (
              <>
                <p className="text-sm text-gray-500 mb-4">Registrace přes DDM Praha 6.</p>
                <a
                  href={term.registrationUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackRegistrationClick({
                    termId: term.id,
                    termDates: term.weekendDateLabel,
                    termLocation: term.location || 'HWLab Praha',
                    spotsAvailable: Math.max(0, term.capacity - term.enrolledCount),
                    outboundUrl: term.registrationUrl!,
                    campType: 'weekend',
                  })}
                  className="w-full inline-flex items-center justify-center px-5 py-3 bg-cta-500 hover:bg-cta-400 text-gray-900 font-semibold rounded-xl transition-all text-sm"
                >
                  Přihlásit se <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Registrace poběží přes DDM Praha 6 — brzy ji otevřeme. Nechte email a dáme vědět.
                </p>
                <WaitlistForm
                  program={program}
                  programTitle={programTitle}
                  termin={`${baseTermin} — oba dny`}
                  buttonLabel="Dejte mi vědět"
                />
              </>
            )}
          </div>

          {/* Blok B: jen jeden den */}
          {term.singleDayOption && (
            <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-5">
              <h4 className="font-semibold text-gray-900 mb-1">Chceš přijít jen na jeden den?</h4>
              <p className="text-sm text-gray-500 mb-4">
                Napište nám a domluvíme se na jednodenní účasti.
              </p>
              <SingleDayForm program={program} programTitle={programTitle} baseTermin={baseTermin} days={dayOptions} />
              <div className="mt-4 pt-4 border-t border-primary-100 space-y-2 text-sm">
                <a href={INFO_PHONE_HREF} className="flex items-center gap-2 text-gray-700 hover:text-primary-700">
                  <Phone className="w-4 h-4 text-primary-600" /> {INFO_PHONE_LABEL}
                </a>
                <a href={`mailto:${INFO_EMAIL}`} className="flex items-center gap-2 text-gray-700 hover:text-primary-700">
                  <Mail className="w-4 h-4 text-primary-600" /> {INFO_EMAIL}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function WaitlistForm({ program, programTitle, termin, buttonLabel = 'Odeslat' }: {
  program: Program; programTitle: string; termin: string; buttonLabel?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [gdpr, setGdpr] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true); setError(null)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, program, termin, gdprConsent: gdpr }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Něco se pokazilo')
      setSubmitted(true)
      trackInterestSubmit({ programId: program, programTitle, termin, campType: 'weekend' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se odeslat. Zkuste to znovu.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-3 bg-trust-50 border border-trust-200 rounded-xl text-center">
        <Check className="w-5 h-5 text-trust-600 mx-auto mb-1" />
        <p className="text-sm font-medium text-trust-800">Děkujeme! Dáme vám vědět.</p>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); trackRegistrationFormOpen({ programId: program, programTitle, termin, campType: 'weekend' }) }}
        className="w-full inline-flex items-center justify-center px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors text-sm"
      >
        {buttonLabel}
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="váš@email.cz" required
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
      />
      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input type="checkbox" checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} required className="mt-0.5 w-4 h-4 text-primary-600 focus:ring-primary-400" />
        <span>Souhlasím se <Link href="/gdpr" className="underline">zpracováním osobních údajů</Link></span>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting || !gdpr || !email.trim()}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed">
        {submitting ? 'Odesílám…' : 'Odeslat'}
      </button>
    </form>
  )
}

function SingleDayForm({ program, programTitle, baseTermin, days }: {
  program: Program; programTitle: string; baseTermin: string; days: string[]
}) {
  const [email, setEmail] = useState('')
  const [day, setDay] = useState(days[0] ?? '')
  const [gdpr, setGdpr] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true); setError(null)
    const termin = `${baseTermin} — jen jeden den (${day})`
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, program, termin, gdprConsent: gdpr }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Něco se pokazilo')
      setSubmitted(true)
      trackInterestSubmit({ programId: program, programTitle, termin, campType: 'weekend' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se odeslat. Zkuste to znovu.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-3 bg-trust-50 border border-trust-200 rounded-xl text-center">
        <Check className="w-5 h-5 text-trust-600 mx-auto mb-1" />
        <p className="text-sm font-medium text-trust-800">Děkujeme! Ozveme se vám.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="váš@email.cz" required
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
      />
      <div className="flex gap-2">
        {days.map((d) => (
          <button
            type="button" key={d} onClick={() => setDay(d)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${day === d ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'}`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>
      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input type="checkbox" checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} required className="mt-0.5 w-4 h-4 text-primary-600 focus:ring-primary-400" />
        <span>Souhlasím se <Link href="/gdpr" className="underline">zpracováním osobních údajů</Link></span>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting || !gdpr || !email.trim()}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed">
        {submitting ? 'Odesílám…' : 'Napište nám'}
      </button>
    </form>
  )
}
