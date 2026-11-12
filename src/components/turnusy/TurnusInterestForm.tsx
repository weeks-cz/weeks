'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Turnus } from '@/lib/turnusy'
import { getCity } from '@/lib/cities'
import { Ikona } from '@/components/w2/Ikona'
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
/**
 * `id` je kotva, na kterou míří tlačítko „Chci vědět, až otevřeme" z karty
 * turnusu (`TurnusCard`). Každá stránka, která kartu vykresluje, vykresluje
 * i jeden tenhle formulář, takže odkaz `#zajem` má vždycky kam vést.
 */
export function TurnusInterestForm({
  turnus,
  source,
  id = 'zajem',
  vyprodano = false,
}: {
  turnus?: Turnus
  source: string
  id?: string
  /** Živá kapacita je vyčerpaná, i když data turnusu ještě hlásí `otevreno`. */
  vyprodano?: boolean
}) {

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
  const obsazeno = vyprodano || turnus?.status === 'plno'
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
    <div id={id} className="formular stred">
      {/* `h2`, ne `h3`: na stránce termínu stojí tenhle formulář rovnou pod
          `h1` a úroveň by přeskakovala. Velikost drží třída `formular`. */}
      <h2>{heading}</h2>
      <p>{mesto ?? 'Necháte nám kontakt a ozveme se, jakmile budou termíny jasné.'}</p>

      {submitted ? (
        <div className="hlaska" role="status" aria-live="polite">
          <b>Máme to, děkujeme!</b>
          {!turnus
            ? 'Jakmile budou termíny jasné'
            : obsazeno
              ? 'Jakmile se uvolní místo'
              : 'Jakmile tenhle turnus otevřeme'}
          , ozveme se na {email}.
        </div>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <div className="pole-rada">
            <div className="pole">
              <label htmlFor="turnus-interest-name">Jméno rodiče</label>
              <input
                id="turnus-interest-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jan Novák"
              />
            </div>
            <div className="pole">
              <label htmlFor="turnus-interest-email">E-mail</label>
              <input
                id="turnus-interest-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rodic@email.cz"
              />
            </div>
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
              `aria-live` na nově vloženém uzlu většina odečítačů neoznámí. */}
          {error && (
            <p className="hlaska chyba" role="alert" aria-live="assertive">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? 'Odesílám…' : 'Dejte mi vědět o termínech'}
            <Ikona id="mail" />
          </button>
          <p className="formular-pozn">
            Nezávazné. Údaje použijeme jen k informování o táborech, nikdy je nepředáme třetí straně.
          </p>
        </form>
      )}
    </div>
  )
}
