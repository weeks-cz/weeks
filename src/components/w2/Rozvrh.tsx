import type { CSSProperties } from 'react'
import { Ikona } from './Ikona'
import { sazba } from './text'
import { DENNI_HARMONOGRAM, DEN_V_KOSTCE } from '@/lib/tabory'

/**
 * „Jak vypadá jeden den“: přehled v šesti pruzích (výška pruhu odpovídá délce
 * bloku) a pod ním rozbalovací podrobný rozvrh ve dlaždicích.
 *
 * Obojí čte z `tabory.ts` (`DEN_V_KOSTCE`, `DENNI_HARMONOGRAM`) — rozvrh je
 * stejný pro všechny tábory a časy tu nejsou napsané podruhé.
 */
export function Rozvrh() {
  return (
    <section className="sec bez-linky sec-den" id="den">
      <div className="wrap">
        <div className="sec-head">
          <h2>Jak vypadá jeden den</h2>
          <p>Každý den má stejný rytmus. Dopoledne a odpoledne se tvoří, po obědě se jde ven.</p>
        </div>
        <ol className="rozvrh">
          {DEN_V_KOSTCE.map((b) => (
            <li key={b.time} className={`r-${b.druh}`} style={{ '--m': b.minut } as CSSProperties}>
              <b>{b.time}</b>
              <span className="rozvrh-pruh">
                <Ikona id={b.ikona} />
              </span>
              <div>
                <strong>{b.nazev}</strong>
                <span>{sazba(b.kratce)}</span>
              </div>
            </li>
          ))}
        </ol>
        <details className="rozbal">
          <summary className="btn btn-outline">
            Podrobný rozvrh dne <Ikona id="dolu" />
          </summary>
          <ol className="cas">
            {DENNI_HARMONOGRAM.map((b) => (
              <li key={b.time} className={b.druh ? `c-${b.druh}` : undefined}>
                <b>{b.time}</b>
                <strong>{b.nazev}</strong>
                <span>{sazba(b.kratce)}</span>
              </li>
            ))}
          </ol>
          <p className="cas-pozn">Když prší, je místo hodiny venku program uvnitř.</p>
        </details>
      </div>
    </section>
  )
}
