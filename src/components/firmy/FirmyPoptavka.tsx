'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Ikona } from '@/components/w2/Ikona'
import { getNabidky, isNabidkaId, NABIDKA_IDS, type NabidkaId } from '@/lib/firmy'
import { telefonSazba } from '@/components/w2/text'
import { SITE } from '@/lib/site'
import { trackFirmyPoptavka } from '@/lib/analytics'

/**
 * Samotný formulář. Odděleně od `FirmyPoptavka`, protože ho potřebují dvě
 * místa se stejným tvarem: fallback před hydratací (bez adresy) a obsah po
 * ní (s adresou) — viz komentář u `FirmyPoptavka` níž.
 */
function FirmyPoptavkaForm({ zvolenyTyp }: { zvolenyTyp: NabidkaId }) {
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
          // Souhlas posíláme jen jako doklad, že ho odesílatel udělil — server
          // se podle něj nerozhoduje. Že je zaškrtnutý, hlídá `required` na
          // zaškrtávátku níž.
          gdprConsent,
        }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok) {
        setSubmitted(true)
        trackFirmyPoptavka({ typ })
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
    <div className="formular">
      <h3>Napište nám pár vět</h3>
      <p>Ozveme se s návrhem a cenou.</p>

      {submitted ? (
        <div className="hlaska" role="status" aria-live="polite">
          <b>Poptávku k nabídce „{vybranaNabidka.nadpis}“ jsme přijali, děkujeme.</b>
          Ozveme se na {email}. Kdyby cokoli, napište na{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> nebo zavolejte na{' '}
          <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{telefonSazba(SITE.phone)}</a>.
        </div>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <fieldset className="volba">
            <legend>Co vás zajímá</legend>
            <div className="volba-cipy">
              {nabidky.map((n) => (
                <label key={n.id}>
                  <input
                    type="radio"
                    name="firmy-typ"
                    value={n.id}
                    checked={typ === n.id}
                    onChange={() => setTyp(n.id)}
                  />
                  <span>{n.nadpis}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="pole-rada">
            <div className="pole">
              <label htmlFor="firmy-firma">Firma</label>
              <input
                id="firmy-firma"
                type="text"
                autoComplete="organization"
                required
                value={firma}
                onChange={(e) => setFirma(e.target.value)}
                placeholder="Název firmy"
              />
            </div>
            <div className="pole">
              <label htmlFor="firmy-name">Jméno a příjmení</label>
              <input
                id="firmy-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jan Novák"
              />
            </div>
          </div>

          <div className="pole-rada">
            <div className="pole">
              <label htmlFor="firmy-email">E-mail</label>
              <input
                id="firmy-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jan.novak@firma.cz"
              />
            </div>
            <div className="pole">
              <label htmlFor="firmy-telefon">
                Telefon <i>(nepovinné)</i>
              </label>
              <input
                id="firmy-telefon"
                type="tel"
                autoComplete="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="+420"
              />
            </div>
          </div>

          <div className="pole">
            <label htmlFor="firmy-message">Zpráva</label>
            <textarea
              id="firmy-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Co byste od spolupráce čekali, kolik lidí a v jakém termínu."
            />
          </div>

          <label className="souhlas">
            <input
              type="checkbox"
              checked={gdprConsent}
              onChange={(e) => setGdprConsent(e.target.checked)}
              required
            />
            <span>
              Souhlasím se zpracováním osobních údajů. <Link href="/gdpr">Více informací</Link>
            </span>
          </label>

          {/* `role="alert"` schválně: prvek vzniká až se svou hláškou a samotné
              `aria-live` na nově vloženém uzlu většina odečítačů neoznámí.
              Stejný tvar jako `TurnusInterestForm` a `OslavaPoptavka`. */}
          {error && (
            <p className="hlaska chyba" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? 'Odesílám…' : 'Odeslat poptávku'}
            <Ikona id="odeslat" />
          </button>
        </form>
      )}
    </div>
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
 * jako filtr měst ve `src/app/tabory/page.tsx`).
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
