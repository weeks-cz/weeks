'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CalendarCheck, CheckCircle, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import type { Turnus } from '@/lib/turnusy'
import { getCity } from '@/lib/cities'
import { SITE } from '@/lib/site'
import { trackSeasonInterest } from '@/lib/analytics'

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? 'mrezolbj'

/**
 * Sběr kontaktu na chystaný turnus.
 *
 * V mrtvé sezóně (žádný turnus k prodeji) i mimo ni pro turnus ve stavu
 * `chystame` nemá web co nabídnout k okamžité registraci. Tenhle formulář
 * nahrazuje „přihlásit" výzvou „nechte kontakt" — bez turnusu sbírá zájem
 * o celou příští sezónu, s turnusem o konkrétní termín.
 *
 * `source` rozlišuje v GA, ze které stránky kontakt přišel.
 */
export function TurnusInterestForm({ turnus, source }: { turnus?: Turnus; source: string }) {
  const reduced = useReducedMotion()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const mesto = turnus ? getCity(turnus.city).name : undefined
  // Turnus ve stavu `plno` je otevřený, jen vyprodaný — nadpis o „otevření"
  // by u něj lhal. Jazyk drží stejný, jaký pro tenhle stav používá
  // `turnusLabels`/`TurnusCard` ("Chci vědět o volném místě"), jen ve větě.
  const obsazeno = turnus?.status === 'plno'
  const heading = !turnus
    ? 'Chcete vědět o termínech mezi prvními?'
    : obsazeno
      ? 'Chcete vědět o volném místě?'
      : 'Chcete vědět, až tenhle turnus otevřeme?'
  const program = turnus ? `${mesto} — zájem o turnus ${turnus.id}` : 'Zájem o příští sezónu'
  const subject = turnus ? `Zájem o turnus ${turnus.id} – ${mesto}` : 'Zájem o příští sezónu'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          program,
          gdprConsent,
          zdroj: source,
          _subject: subject,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        trackSeasonInterest({
          locationId: turnus?.city ?? 'web',
          season: turnus?.id ?? 'pristi-sezona',
          source,
        })
      } else {
        setError(`Nepodařilo se odeslat. Zkuste to znovu nebo napište na ${SITE.email}.`)
      }
    } catch {
      setError(`Nepodařilo se odeslat. Zkuste to znovu nebo napište na ${SITE.email}.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-2xl mx-auto bg-paper rounded-md border border-ink/15 p-6 sm:p-8"
    >
      <div className="text-center">
        <div className="w-14 h-14 rounded-md bg-ink/5 border border-ink/15 flex items-center justify-center mx-auto mb-5">
          <CalendarCheck className="w-7 h-7 text-ink" aria-hidden="true" />
        </div>
        {/* `h2`, ne `h3`: na stránce turnusu stojí tenhle formulář rovnou pod
            `h1` a úroveň by přeskakovala. Velikost drží třídy, ne úroveň. */}
        <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mb-2">{heading}</h2>
        {mesto ? (
          <p className="mono-label">{mesto}</p>
        ) : (
          <p className="text-ink-500 leading-relaxed">
            Necháte nám kontakt a ozveme se, jakmile budou termíny jasné.
          </p>
        )}
      </div>

      {submitted ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-7 bg-trust-50 rounded-md p-6 text-center border border-trust-200"
        >
          <CheckCircle className="w-10 h-10 text-trust-500 mx-auto mb-3" aria-hidden="true" />
          <p className="font-semibold text-trust-800 mb-1">Máme to, děkujeme!</p>
          <p className="text-sm text-trust-700">
            {!turnus
              ? 'Jakmile budou termíny jasné'
              : obsazeno
                ? 'Jakmile se uvolní místo'
                : 'Jakmile tenhle turnus otevřeme'}, ozveme se na{' '}
            <span className="font-medium">{email}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="turnus-interest-name" className="block text-sm font-medium text-ink mb-1">
                Jméno rodiče
              </label>
              <input
                id="turnus-interest-name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jan Novák"
                className="w-full px-4 py-2.5 rounded-md bg-white border border-ink/20 text-ink placeholder:text-ink/40 text-sm focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
              />
            </div>
            <div>
              <label htmlFor="turnus-interest-email" className="block text-sm font-medium text-ink mb-1">
                E-mail
              </label>
              <input
                id="turnus-interest-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rodic@email.cz"
                className="w-full px-4 py-2.5 rounded-md bg-white border border-ink/20 text-ink placeholder:text-ink/40 text-sm focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 justify-center pt-1">
            <input
              type="checkbox"
              id="turnus-interest-gdpr"
              checked={gdprConsent}
              onChange={(e) => setGdprConsent(e.target.checked)}
              required
              className="mt-0.5 w-4 h-4 rounded-sm border-ink/30 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="turnus-interest-gdpr" className="text-xs text-ink-500 cursor-pointer text-left">
              Souhlasím se zpracováním osobních údajů.{' '}
              <Link href="/gdpr" className="underline hover:text-primary-600">
                Více informací
              </Link>
            </label>
          </div>

          {error && (
            <p role="alert" aria-live="assertive" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !gdprConsent}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Odesílám…' : 'Dejte mi vědět o termínech'}
            <Mail className="w-4 h-4" aria-hidden="true" />
          </button>

          <p className="text-xs text-ink-500 text-center">
            Nezávazné. Údaje použijeme jen k informování o táborech, nikdy je nepředáme třetí straně.
          </p>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-ink/15 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
        <a
          href={`mailto:${SITE.email}`}
          className="inline-flex items-center gap-2 text-ink-500 hover:text-ink transition-colors"
        >
          <Mail className="w-4 h-4 text-ink/40" aria-hidden="true" />
          {SITE.email}
        </a>
        <a
          href={`tel:${SITE.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-2 text-ink-500 hover:text-ink transition-colors"
        >
          <Phone className="w-4 h-4 text-ink/40" aria-hidden="true" />
          {SITE.phone}
        </a>
      </div>
    </motion.div>
  )
}
