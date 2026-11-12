import Link from 'next/link'
import Image from 'next/image'
import { Ikona } from './Ikona'
import { TerminRadky } from './TerminRadky'
import { sazba } from './text'
import { getCity, getVenue, type CityId } from '@/lib/cities'
import type { Tabor } from '@/lib/tabory'
import { isBookable, type Turnus } from '@/lib/turnusy'

/**
 * Karta tábora v jednom městě: fotka, název (odkaz na stránku tématu), místo,
 * jedna věta, cena a řádky termínů s tlačítkem „Vybrat“.
 *
 * Cena stojí na kartě jednou a jen tehdy, když ji mají všechny prodejné
 * termíny stejnou — jinak by jedno číslo o některém z nich lhalo.
 *
 * Tábor, který se ve městě teprve chystá, má na fotce štítek „Chystáme“,
 * žádné místo ani cenu (nejsou potvrzené) a řádek s „Dát vědět“.
 *
 * Serverová komponenta; živou obsazenost si načítají jen řádky termínů
 * (`TerminRadky`).
 */
export function TaborKarta({
  tabor,
  mesto,
  turnusy,
  stitekMesta = true,
}: {
  tabor: Tabor
  mesto: CityId
  /** Turnusy tohohle tábora v tomhle městě. */
  turnusy: Turnus[]
  /** Štítek města na fotce. Ve výpisu, kde město stojí v nadpisu nad kartami, je zbytečný. */
  stitekMesta?: boolean
}) {
  const nabidka = turnusy.filter((t) => t.status !== 'uzavreno')
  const prodejne = nabidka.filter(isBookable)
  const chysta = prodejne.length === 0 && nabidka.length > 0
  const foto = tabor.fotoMesta?.[mesto] ?? tabor.foto
  const venueId = prodejne[0]?.venueId
  const venue = venueId ? getVenue(venueId) : null
  const ceny = [...new Set(prodejne.map((t) => t.priceKc))]
  const cena = ceny.length === 1 && ceny[0] !== null ? `${ceny[0].toLocaleString('cs-CZ')} Kč` : null
  const href = `/tabory/${tabor.id}`

  return (
    <article className="tabor">
      {foto && (
        <Link className="tabor-foto" href={href} tabIndex={-1} aria-hidden="true">
          <Image src={foto.src} alt="" width={1200} height={900} sizes="(min-width: 900px) 560px, 100vw" />
          {chysta ? (
            <span className="stitek stitek-stav">Chystáme</span>
          ) : (
            stitekMesta && (
              <span className="stitek">
                <Ikona id="misto" /> {getCity(mesto).name}
              </span>
            )
          )}
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
        {nabidka.length > 0 && (
          <div className="tabor-koupit">
            {cena && (
              <p className="tabor-cena">
                <b>{sazba(cena)}</b> za týden
              </p>
            )}
            <TerminRadky
              turnusy={chysta ? nabidka : prodejne}
              mesto={mesto}
              textChystame="Termín a místo upřesníme"
            />
          </div>
        )}
      </div>
    </article>
  )
}
