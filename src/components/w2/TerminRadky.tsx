'use client'

import Link from 'next/link'
import { Ikona } from './Ikona'
import { rozsahTesne, sazba } from './text'
import type { CityId } from '@/lib/cities'
import { isBookable, type Turnus } from '@/lib/turnusy'
import { useTermCapacity, volnaMistaText } from '@/components/turnusy/SpotsLeft'
import { turnusLabels } from '@/components/turnusy/turnus-labels'

/**
 * Řádky termínů jednoho tábora v jednom městě — na kartě tábora i na lístku
 * stránky tématu. Celý řádek je odkaz na stránku termínu.
 *
 * Klientská komponenta kvůli živé obsazenosti: obsazený termín nesmí nabízet
 * „Vybrat“ a u posledních míst má být vidět, kolik jich zbývá. Dokud se
 * obsazenost nenačte, řádek žádné číslo neukazuje — nikdy vymyšlené.
 *
 * Termín, který se teprve chystá, má řádek bez data: „Termín upřesníme“
 * a „Dát vědět“ vede na jeho stránku s formulářem.
 */
export function TerminRadky({
  turnusy,
  mesto,
  className = 'terminy',
  textChystame = 'Termín upřesníme',
}: {
  turnusy: Turnus[]
  mesto: CityId
  className?: string
  /** Řádek termínu bez data. Karta bez místa konání říká „Termín a místo upřesníme“. */
  textChystame?: string
}) {
  const capacity = useTermCapacity(mesto)
  const radky = turnusy.filter((t) => t.status !== 'uzavreno')

  return (
    <div className={className}>
      {radky.map((t) => {
        const href = `/tabory/termin/${t.slug}`
        if (!isBookable(t) && t.status !== 'plno') {
          return (
            <Link className="termin" href={href} key={t.id}>
              <span className="termin-datum">{textChystame}</span>
              <span className="btn-mini">Dát vědět</span>
            </Link>
          )
        }
        const volno = capacity?.[t.id]?.spotsLeft
        const plno = t.status === 'plno' || volno === 0
        const mista = volno !== undefined && !plno ? volnaMistaText(volno) : null
        return (
          <Link className="termin" href={href} key={t.id}>
            <span className="termin-ik">
              <Ikona id="kalendar" />
            </span>
            <span className="termin-datum">
              {sazba(rozsahTesne(turnusLabels(t).datum))}
              {mista && <small> · {sazba(mista)}</small>}
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
  )
}
