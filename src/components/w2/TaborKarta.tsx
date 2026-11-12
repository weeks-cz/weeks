'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Ikona } from './Ikona'
import { rozsahTesne, sazba } from './text'
import { getCity, getVenue, type CityId } from '@/lib/cities'
import type { Tabor } from '@/lib/tabory'
import { isBookable, type Turnus } from '@/lib/turnusy'
import { useTermCapacity, volnaMistaText } from '@/components/turnusy/SpotsLeft'
import { turnusLabels } from '@/components/turnusy/turnus-labels'

/**
 * Karta tábora v jednom městě: fotka se štítkem města, název (odkaz na stránku
 * tématu), místo, jedna věta, cena a řádky termínů s tlačítkem „Vybrat“.
 *
 * Cena stojí na kartě jednou a jen tehdy, když ji mají všechny prodejné
 * termíny stejnou — jinak by jedno číslo o některém z nich lhalo.
 *
 * Klientská komponenta kvůli živé obsazenosti: obsazený termín nesmí nabízet
 * „Vybrat“ a u posledních míst má být vidět, kolik jich zbývá.
 */
export function TaborKarta({
  tabor,
  mesto,
  turnusy,
}: {
  tabor: Tabor
  mesto: CityId
  /** Turnusy tohohle tábora v tomhle městě. */
  turnusy: Turnus[]
}) {
  const capacity = useTermCapacity(mesto)
  const prodejne = turnusy.filter(isBookable)
  const foto = tabor.fotoMesta?.[mesto] ?? tabor.foto
  const venueId = prodejne[0]?.venueId ?? turnusy[0]?.venueId
  const venue = venueId ? getVenue(venueId) : null
  const ceny = [...new Set(prodejne.map((t) => t.priceKc))]
  const cena = ceny.length === 1 && ceny[0] !== null ? `${ceny[0].toLocaleString('cs-CZ')} Kč` : null
  const href = `/tabory/${tabor.id}`

  return (
    <article className="tabor">
      {foto && (
        <Link className="tabor-foto" href={href} tabIndex={-1} aria-hidden="true">
          <Image src={foto.src} alt="" width={1200} height={900} sizes="(min-width: 900px) 560px, 100vw" />
          <span className="stitek">
            <Ikona id="misto" /> {getCity(mesto).name}
          </span>
        </Link>
      )}
      <div className="tabor-in">
        <h3>
          <Link href={href}>
            {sazba(tabor.name)} <Ikona id="sipka" />
          </Link>
        </h3>
        {venue && (
          <p className="tabor-kde">
            <Ikona id="misto" /> {sazba(`${venue.name}, ${venue.city}`)}
          </p>
        )}
        <p>{sazba(tabor.perex)}</p>
        {prodejne.length > 0 && (
          <div className="tabor-koupit">
            {cena && (
              <p className="tabor-cena">
                <b>{cena}</b> za týden
              </p>
            )}
            <div className="terminy">
              {prodejne.map((t) => {
                const volno = capacity?.[t.id]?.spotsLeft
                const mista = volno !== undefined ? volnaMistaText(volno) : null
                const plno = volno === 0
                return (
                  <Link className="termin" href={`/tabory/termin/${t.slug}`} key={t.id}>
                    <span className="termin-ik">
                      <Ikona id="kalendar" />
                    </span>
                    <span className="termin-datum">
                      {sazba(rozsahTesne(turnusLabels(t).datum))}
                      {mista && !plno && <small> · {sazba(mista)}</small>}
                    </span>
                    {plno ? (
                      <span className="btn-mini">Obsazeno</span>
                    ) : (
                      <span className="termin-jit">
                        Vybrat <Ikona id="sipka" />
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
