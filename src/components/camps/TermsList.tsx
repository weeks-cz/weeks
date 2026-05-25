'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Calendar, Check, ChevronDown, Bell } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
  trackInterestSubmit, trackViewOneDayCamp, trackRegistrationFormOpen, trackRegistrationClick,
} from '@/lib/analytics'
import type { TermDisplay } from '@/lib/camps'

const INFO_PHONE_LABEL = '+420 703 046 440'
const INFO_PHONE_HREF = 'tel:+420703046440'
const INFO_EMAIL = 'admin@weeks.cz'

const DAY_NAMES = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota']

function dayName(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return Number.isNaN(d.getTime()) ? '' : DAY_NAMES[d.getDay()]
}

// Seznam názvů dní termínu (např. ['čtvrtek','pátek'])
function enumerateDays(startIso: string, endIso: string): string[] {
  const start = new Date(startIso + 'T12:00:00')
  const end = new Date(endIso + 'T12:00:00')
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return []
  const out: string[] = []
  const d = new Date(start)
  while (d.getTime() <= end.getTime() && out.length < 7) {
    out.push(DAY_NAMES[d.getDay()])
    d.setDate(d.getDate() + 1)
  }
  return out
}

function priceLabel(price: number | null): string {
  if (price == null) return ''
  return `${price.toLocaleString('cs-CZ')} Kč`
}

function daysWord(n: number): string {
  return n === 1 ? 'den' : n >= 2 && n <= 4 ? 'dny' : 'dní'
}

interface AccentClasses {
  badgeDot: string
  badgePillBg: string
  badgePillText: string
  primaryBtnBg: string
  inputRing: string
  checkboxAccent: string
}

interface TermsListProps {
  program: '3d-tisk' | 'iot'
  programTitle: string
  // Status buckets — open has DDM link, openNoLink is confirmed but link not ready,
  // collectingInterest is "we might run this", full is no spots
  open: TermDisplay[]
  openNoLink: TermDisplay[]
  collectingInterest: TermDisplay[]
  full: TermDisplay[]
  accentClasses: AccentClasses
}

// Datum + případně počet dní (vícedenní) + cena — jednotná hlavička karty
function TermHeading({ term }: { term: TermDisplay }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-white/70 flex-shrink-0" />
        <h4 className="text-lg font-bold text-white">{term.fullLabel}</h4>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/15 text-white text-xs font-semibold">
          {term.dayCount} {daysWord(term.dayCount)}
          {term.dayCount > 1 && dayName(term.startDate) && dayName(term.endDate)
            ? ` · ${dayName(term.startDate)}–${dayName(term.endDate)}`
            : ''}
        </span>
        {term.price != null && (
          <span className="text-sm font-semibold text-white/90">{priceLabel(term.price)}</span>
        )}
      </div>
    </div>
  )
}

export function TermsList({
  program, programTitle,
  open, openNoLink, collectingInterest, full,
  accentClasses,
}: TermsListProps) {
  const nothing = open.length + openNoLink.length + collectingInterest.length + full.length === 0

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Open with DDM link — primary CTA */}
      {open.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${accentClasses.badgeDot}`} />
            Otevřené registrace
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {open.map((termin, index) => (
              <motion.div
                key={termin.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <TermHeading term={termin} />
                    <span className={`px-3 py-1 rounded-full ${accentClasses.badgePillBg} ${accentClasses.badgePillText} text-xs font-semibold flex-shrink-0`}>
                      Otevřeno
                    </span>
                  </div>

                  <p className="text-sm text-white/70 mb-6">
                    9:00–17:00, {termin.location || 'HWLab Praha'}. Registrace přes DDM Praha 6.
                  </p>

                  <a
                    href={termin.registrationUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-cta-500 hover:bg-cta-400 text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-cta-500/30 text-sm"
                    onClick={() => trackRegistrationClick({
                      termId: termin.id,
                      termDates: termin.dateLabel,
                      termLocation: termin.location || 'HWLab Praha',
                      spotsAvailable: Math.max(0, termin.capacity - termin.enrolledCount),
                      outboundUrl: termin.registrationUrl!,
                      campType: termin.dayCount > 1 ? 'weekend' : 'oneday',
                    })}
                  >
                    Přihlásit se
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>

                  {termin.singleDayOption && (
                    <SingleDayDisclosure
                      term={termin}
                      program={program}
                      programTitle={programTitle}
                      accentClasses={accentClasses}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Open but registration link not yet published — interest form */}
      {openNoLink.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-cta-300" />
            Brzy otevřeme registraci
          </h3>
          <p className="text-sm text-white/60 mb-6 max-w-xl">
            Termín je potvrzený, jen čekáme na zveřejnění registrace v systému DDM Praha 6.
            Nechte nám email a dáme vědět hned, jak bude otevřená.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openNoLink.map((termin, index) => (
              <motion.div
                key={termin.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <TermHeading term={termin} />
                    <span className="px-3 py-1 rounded-full bg-cta-500/20 text-cta-300 text-xs font-semibold flex-shrink-0">
                      Brzy otevřeme
                    </span>
                  </div>

                  <InterestForm
                    terminId={termin.id}
                    terminLabel={termin.fullLabel}
                    program={program}
                    programTitle={programTitle}
                    accentClasses={accentClasses}
                    buttonLabel="Dejte mi vědět"
                  />

                  {termin.singleDayOption && (
                    <SingleDayDisclosure
                      term={termin}
                      program={program}
                      programTitle={programTitle}
                      accentClasses={accentClasses}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Collecting interest — non-binding, may or may not run */}
      {collectingInterest.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white/80 mb-4 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cta-400" />
            Připravované termíny
          </h3>
          <p className="text-sm text-white/60 mb-6 max-w-xl">
            Zanechte nám email a dáme vám vědět nejpozději 14 dní před termínem, zda se tábor otevře.
            Nezavazujete se k ničemu — pouze dostanete včasnou informaci o otevření registrace.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collectingInterest.map((termin, index) => (
              <motion.div
                key={termin.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-dashed border-white/30 overflow-hidden"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-cta-500/20 text-cta-300 text-xs font-semibold mb-3">
                      Připravujeme
                    </span>
                    <TermHeading term={termin} />
                  </div>

                  <InterestForm
                    terminId={termin.id}
                    terminLabel={termin.fullLabel}
                    program={program}
                    programTitle={programTitle}
                    accentClasses={accentClasses}
                  />

                  {termin.singleDayOption && (
                    <SingleDayDisclosure
                      term={termin}
                      program={program}
                      programTitle={programTitle}
                      accentClasses={accentClasses}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Full — muted, no action */}
      {full.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white/50 mb-4">Obsazené termíny</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {full.map((termin) => (
              <div
                key={termin.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 opacity-60"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-white/50" />
                  <span className="text-sm font-medium text-white/70">{termin.fullLabel}</span>
                </div>
                <span className="text-xs text-red-300 font-semibold">Obsazeno</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {nothing && (
        <p className="text-center text-white/60">
          Aktuálně nejsou vypsané žádné termíny. Sledujte nás na sociálních sítích, nebo nám
          napište přes <Link href="/kontakt" className="underline">kontaktní formulář</Link>.
        </p>
      )}
    </div>
  )
}

function InterestForm({
  terminId, terminLabel, program, programTitle, accentClasses, buttonLabel = 'Nezávazná registrace',
}: {
  terminId: string
  terminLabel: string
  program: '3d-tisk' | 'iot'
  programTitle: string
  accentClasses: AccentClasses
  buttonLabel?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, program, termin: terminLabel, gdprConsent }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Něco se pokazilo')

      setIsSubmitted(true)
      trackInterestSubmit({ programId: program, programTitle, termin: terminLabel, campType: 'oneday' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se odeslat. Zkuste to znovu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 p-4 bg-trust-50 border border-trust-200 rounded-xl text-center"
      >
        <Check className="w-6 h-6 text-trust-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-trust-800">Děkujeme! Dáme vám vědět.</p>
      </motion.div>
    )
  }

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => {
            setIsOpen(true)
            trackViewOneDayCamp(program, `termin_${terminId}`)
            trackRegistrationFormOpen({ programId: program, programTitle, termin: terminLabel, campType: 'oneday' })
          }}
          className="btn-outline border-white/50 text-white hover:bg-white/10 inline-flex items-center gap-2"
        >
          {buttonLabel}
        </button>
      ) : (
        <AnimatePresence>
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="mt-4 space-y-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="váš@email.cz"
              className={`w-full px-4 py-2.5 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 ${accentClasses.inputRing} text-sm`}
              required
            />
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id={`gdpr-${terminId}`}
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                className={`mt-1 w-4 h-4 rounded border-white/30 bg-white/10 ${accentClasses.checkboxAccent}`}
                required
              />
              <label htmlFor={`gdpr-${terminId}`} className="text-xs text-white/60 cursor-pointer">
                Souhlasím se{' '}
                <Link href="/gdpr" className="underline hover:text-white">
                  zpracováním osobních údajů
                </Link>
              </label>
            </div>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting || !gdprConsent || !email.trim()}
              className={`w-full ${accentClasses.primaryBtnBg} text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Odesílám...' : 'Odeslat'}
            </button>
          </motion.form>
        </AnimatePresence>
      )}
    </div>
  )
}

// Rozbalovací "Můžu přijít jen na jeden den?" — pro vícedenní termíny s povolenou
// jednodenní účastí. Email + výběr konkrétního dne (z datumů) + kontakt.
function SingleDayDisclosure({
  term, program, programTitle, accentClasses,
}: {
  term: TermDisplay
  program: '3d-tisk' | 'iot'
  programTitle: string
  accentClasses: AccentClasses
}) {
  const days = enumerateDays(term.startDate, term.endDate)
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [day, setDay] = useState(days[0] ?? '')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const termin = `${programTitle} ${term.weekendDateLabel} — jen jeden den (${day})`
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, program, termin, gdprConsent }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Něco se pokazilo')
      setIsSubmitted(true)
      trackInterestSubmit({ programId: program, programTitle, termin, campType: 'oneday' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se odeslat. Zkuste to znovu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-white/15">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
          aria-expanded={false}
        >
          <ChevronDown className="w-4 h-4" />
          Můžu přijít jen na jeden den?
        </button>
      ) : isSubmitted ? (
        <div className="p-4 bg-trust-50 border border-trust-200 rounded-xl text-center">
          <Check className="w-6 h-6 text-trust-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-trust-800">Děkujeme! Ozveme se vám.</p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs text-white/60 mb-3">
              Jasně — stačí přijít i jen na jeden den. Program dítěti přizpůsobíme.
              Nechte nám email a den, ozveme se vám.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="váš@email.cz"
                className={`w-full px-4 py-2.5 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 ${accentClasses.inputRing} text-sm`}
                required
              />
              {days.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {days.map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setDay(d)}
                      className={`flex-1 min-w-[5rem] px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${day === d ? 'bg-white text-gray-900 border-white' : 'bg-white/10 text-white border-white/30 hover:border-white/60'}`}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id={`gdpr-1d-${term.id}`}
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  className={`mt-1 w-4 h-4 rounded border-white/30 bg-white/10 ${accentClasses.checkboxAccent}`}
                  required
                />
                <label htmlFor={`gdpr-1d-${term.id}`} className="text-xs text-white/60 cursor-pointer">
                  Souhlasím se{' '}
                  <Link href="/gdpr" className="underline hover:text-white">
                    zpracováním osobních údajů
                  </Link>
                </label>
              </div>
              {error && <p className="text-sm text-red-300">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting || !gdprConsent || !email.trim()}
                className={`w-full ${accentClasses.primaryBtnBg} text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? 'Odesílám...' : 'Napište nám'}
              </button>
            </form>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
              <a href={INFO_PHONE_HREF} className="hover:text-white">{INFO_PHONE_LABEL}</a>
              <a href={`mailto:${INFO_EMAIL}`} className="hover:text-white">{INFO_EMAIL}</a>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

export function FAQAccordion({ items, focusRingClass }: { items: { question: string; answer: string }[]; focusRingClass: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
      {items.map((faq) => (
        <FAQItem key={faq.question} {...faq} focusRingClass={focusRingClass} />
      ))}
    </div>
  )
}

function FAQItem({ question, answer, focusRingClass }: { question: string; answer: string; focusRingClass: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 ${focusRingClass} focus:ring-offset-2 rounded-lg`}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
