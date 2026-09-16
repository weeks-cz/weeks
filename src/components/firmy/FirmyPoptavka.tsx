'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Briefcase, CheckCircle, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { getNabidky, NABIDKA_IDS, type NabidkaId } from '@/lib/firmy'
import { SITE } from '@/lib/site'

/** Ověří `?typ=` proti číselníku — překlep nebo stará hodnota z adresy se zahodí, ne aby formulář spadl. */
function isNabidkaId(value: string | null): value is NabidkaId {
  return value !== null && (NABIDKA_IDS as string[]).includes(value)
}

/**
 * Samotný formulář. Odděleně od `FirmyPoptavka`, protože ho potřebují dvě
 * místa se stejným tvarem: fallback před hydratací (bez adresy) a obsah po
 * ní (s adresou) — viz komentář u `FirmyPoptavka` níž.
 */
function FirmyPoptavkaForm({ zvolenyTyp }: { zvolenyTyp: NabidkaId }) {
  const reduced = useReducedMotion()
  const nabidky = getNabidky()

  const [typ, setTyp] = useState<NabidkaId>(zvolenyTyp)
  const [firma, setFirma] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [telefon, setTelefon] = useState('')
  const [message, setMessage] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // `zvolenyTyp` se může za běhu změnit — z nabídky na stránce vede odkaz
  // `/firmy?typ=workshopy#poptavka` na tenhle formulář, takže se `?typ=`
  // v adrese změní, i když už uživatel něco rozepsal. Přemountování by tu
  // rozepsanou zprávu smazalo, proto jen srovnáme vybranou hodnotu přepínače
  // přes `useEffect` — zbytek formuláře zůstává, jak byl.
  useEffect(() => {
    setTyp(zvolenyTyp)
  }, [zvolenyTyp])

  const vybranaNabidka = nabidky.find((n) => n.id === typ) ?? nabidky[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          firma,
          ...(telefon ? { telefon } : {}),
          typ,
        }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok) {
        setSubmitted(true)
      } else {
        // Chybovou hlášku bere formulář z odpovědi API (`data.error`) — tu
        // sestavuje `parseContactBody`/route handler a je to česká věta pro
        // uživatele. Vlastní text je jen záložní, pro síťovou chybu nebo
        // odpověď bez těla.
        setError(data?.error || `Nepodařilo se odeslat. Zkuste to znovu nebo napište na ${SITE.email}.`)
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
          <Briefcase className="w-7 h-7 text-ink" aria-hidden="true" />
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-ink mb-2">Máte zájem o spolupráci?</h3>
        <p className="text-ink-500 leading-relaxed">Napište nám pár vět a ozveme se vám zpět.</p>
      </div>

      {submitted ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-7 bg-trust-50 rounded-md p-6 text-center border border-trust-200"
        >
          <CheckCircle className="w-10 h-10 text-trust-500 mx-auto mb-3" aria-hidden="true" />
          <p className="font-semibold text-trust-800 mb-1">
            Poptávku k nabídce „{vybranaNabidka.nadpis}" jsme přijali, děkujeme.
          </p>
          <p className="text-sm text-trust-700">
            Ozveme se na <span className="font-medium">{email}</span>. Mezitím nás můžete kontaktovat i sami na{' '}
            <a href={`mailto:${SITE.email}`} className="font-medium underline">
              {SITE.email}
            </a>{' '}
            nebo{' '}
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="font-medium underline">
              {SITE.phone}
            </a>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <fieldset>
            <legend className="mono-label mb-2">Co vás zajímá</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {nabidky.map((n) => (
                <div key={n.id} className="relative">
                  <input
                    type="radio"
                    id={`firmy-typ-${n.id}`}
                    name="firmy-typ"
                    value={n.id}
                    checked={typ === n.id}
                    onChange={() => setTyp(n.id)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`firmy-typ-${n.id}`}
                    className="block cursor-pointer rounded-md border border-ink/20 px-3 py-2.5 text-center text-sm font-medium text-ink-500 transition-colors peer-checked:border-ink peer-checked:bg-ink/5 peer-checked:text-ink peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2"
                  >
                    {n.nadpis}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="firmy-firma" className="block text-sm font-medium text-ink mb-1">
                Firma
              </label>
              <input
                id="firmy-firma"
                type="text"
                required
                value={firma}
                onChange={(e) => setFirma(e.target.value)}
                placeholder="Název firmy"
                className="w-full px-4 py-2.5 rounded-md bg-white border border-ink/20 text-ink placeholder:text-ink/40 text-sm focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
              />
            </div>
            <div>
              <label htmlFor="firmy-name" className="block text-sm font-medium text-ink mb-1">
                Jméno a příjmení
              </label>
              <input
                id="firmy-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jan Novák"
                className="w-full px-4 py-2.5 rounded-md bg-white border border-ink/20 text-ink placeholder:text-ink/40 text-sm focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="firmy-email" className="block text-sm font-medium text-ink mb-1">
                E-mail
              </label>
              <input
                id="firmy-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jan.novak@firma.cz"
                className="w-full px-4 py-2.5 rounded-md bg-white border border-ink/20 text-ink placeholder:text-ink/40 text-sm focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
              />
            </div>
            <div>
              <label htmlFor="firmy-telefon" className="block text-sm font-medium text-ink mb-1">
                Telefon <span className="text-ink/40 font-normal">(nepovinné)</span>
              </label>
              <input
                id="firmy-telefon"
                type="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="+420 —"
                className="w-full px-4 py-2.5 rounded-md bg-white border border-ink/20 text-ink placeholder:text-ink/40 text-sm focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
              />
            </div>
          </div>

          <div>
            <label htmlFor="firmy-message" className="block text-sm font-medium text-ink mb-1">
              Zpráva
            </label>
            <textarea
              id="firmy-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Co byste od spolupráce čekali, kolik lidí a v jakém termínu."
              className="w-full px-4 py-2.5 rounded-md bg-white border border-ink/20 text-ink placeholder:text-ink/40 text-sm focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink resize-none"
            />
          </div>

          <div className="flex items-start gap-2 justify-center pt-1">
            <input
              type="checkbox"
              id="firmy-gdpr"
              checked={gdprConsent}
              onChange={(e) => setGdprConsent(e.target.checked)}
              required
              className="mt-0.5 w-4 h-4 rounded-sm border-ink/30 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="firmy-gdpr" className="text-xs text-ink-500 cursor-pointer text-left">
              Souhlasím se zpracováním osobních údajů.{' '}
              <Link href="/gdpr" className="underline hover:text-primary-600">
                Více informací
              </Link>
            </label>
          </div>

          {error && (
            <p aria-live="polite" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !gdprConsent}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Odesílám…' : 'Odeslat poptávku'}
            <Mail className="ml-2 w-4 h-4" aria-hidden="true" />
          </button>
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

/**
 * Čte `?typ=` z adresy a ověří ho proti `NABIDKA_IDS`, než ho pošle do
 * formuláře — `useSearchParams` funguje jen pod `Suspense` (viz `FirmyPoptavka`).
 */
function FirmyPoptavkaContent({ vychoziTyp }: { vychoziTyp?: NabidkaId }) {
  const searchParams = useSearchParams()
  const zAdresy = searchParams.get('typ')
  const typ = isNabidkaId(zAdresy) ? zAdresy : (vychoziTyp ?? NABIDKA_IDS[0])
  return <FirmyPoptavkaForm zvolenyTyp={typ} />
}

/**
 * Poptávkový formulář na `/firmy` — jeden formulář, tři režimy podle vybrané
 * nabídky, ne tři oddělené formuláře. Kterou nabídku formulář předvyplní,
 * jde nastavit dvěma způsoby: prop `vychoziTyp` (typicky žádný — stránka
 * `/firmy` volá `<FirmyPoptavka />` bez něj) a `?typ=` v adrese, kam vede
 * odkaz z jednotlivých nabídek (`/firmy?typ=workshopy#poptavka`). Adresa má
 * přednost, `vychoziTyp` je jen záložní hodnota pro volání bez ní; když
 * nesedí ani jedno, předvybere se první nabídka z číselníku.
 *
 * `/firmy` musí zůstat serverová a staticky předgenerovaná stránka — kdyby
 * `searchParams` četla ona, Next by ji kvůli tomu překlopil na dynamické
 * vykreslování. Adresu proto čte až tahle klientská komponenta, a protože
 * `useSearchParams` vyžaduje vlastní hranici `Suspense`, je tu (stejný vzor
 * jako `TaborInterestForm`/`TaborInterestFormContent` v `src/app/tabor/page.tsx:141-154`).
 * `fallback` je rovnou plnohodnotný formulář s výchozí (nebo první) nabídkou,
 * ne kostra — než se hydratuje, pořád jde odeslat, jen bez rozlišení podle adresy.
 */
export function FirmyPoptavka({ vychoziTyp }: { vychoziTyp?: NabidkaId }) {
  const fallbackTyp = vychoziTyp ?? NABIDKA_IDS[0]
  return (
    <Suspense fallback={<FirmyPoptavkaForm zvolenyTyp={fallbackTyp} />}>
      <FirmyPoptavkaContent vychoziTyp={vychoziTyp} />
    </Suspense>
  )
}
