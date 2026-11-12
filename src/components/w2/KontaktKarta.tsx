'use client'

import Image from 'next/image'
import { Ikona } from './Ikona'
import { useTelefonStav } from './telefon'
import { telefonSazba } from './text'
import { SITE } from '@/lib/site'

/**
 * Karta s kontaktem u dotazů: tvář, telefon a e-mail.
 *
 * Tvář je generovaná a karta ji proto nikdy nejmenuje — stojí u ní „Tým
 * Weeks“, ne jméno konkrétního člověka.
 */
export function KontaktKarta() {
  const { online, text, maHodiny } = useTelefonStav()

  return (
    <div className={`kontakt-karta${online ? ' je-online' : ''}`}>
      <span className="avatar avatar-velky">
        <Image src="/images/tym-avatar.webp" alt="" width={56} height={56} loading="lazy" />
        {maHodiny && <span className="avatar-stav" aria-hidden="true" />}
      </span>
      <div>
        <b>Tým Weeks</b>
        <span>{text}</span>
      </div>
      <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>
        <Ikona id="tel" /> {telefonSazba(SITE.phone)}
      </a>
      <a href={`mailto:${SITE.email}`}>
        <Ikona id="mail" /> {SITE.email}
      </a>
    </div>
  )
}
