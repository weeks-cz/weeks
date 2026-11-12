import { Ikona } from './Ikona'

/** Položka obsahu: oddíl s kotvou, nebo mezititulek části (bez odkazu). */
export type PolozkaObsahu = { id: string; nazev: string } | { cast: string }

/**
 * Obsah právního textu (/gdpr, /podminky). Na mobilu rozbalovací blok nad
 * textem, od 1000 px stálý sloupec vedle textu. Obě podoby jsou v HTML,
 * přepíná je jen CSS – bez skriptu.
 */
export function PravniObsah({ polozky }: { polozky: PolozkaObsahu[] }) {
  const seznam = (
    <ol>
      {polozky.map((p) =>
        'cast' in p ? (
          <li key={p.cast} className="cast">
            {p.cast}
          </li>
        ) : (
          <li key={p.id}>
            <a href={`#${p.id}`}>{p.nazev}</a>
          </li>
        )
      )}
    </ol>
  )
  return (
    <div className="pravni-bok">
      <details className="pravni-obsah obsah-mobil">
        <summary>
          Obsah
          <Ikona id="dolu" />
        </summary>
        {seznam}
      </details>
      <nav className="pravni-obsah obsah-desktop" aria-label="Obsah">
        <p className="obsah-nadpis">Obsah</p>
        {seznam}
      </nav>
    </div>
  )
}
