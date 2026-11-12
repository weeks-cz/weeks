import { Ikona, type IkonaId } from './Ikona'
import { sazba } from './text'
import { PROVOZNI_DOBA } from '@/lib/site'

/**
 * Zelený pás „Co máte jisté“ — čtyři věci, které web umí doložit: provozní
 * doba (z `PROVOZNI_DOBA`), oběd a materiál v ceně (`V_CENE`), malé skupiny
 * a první pomoc.
 *
 * Schválně tu není poměr lektorů na děti ani strop kapacity: obojí závisí na
 * konkrétním termínu a web je neslibuje (viz CLAUDE.md, „Team“).
 */
const BODY: Array<{ ikona: IkonaId; nadpis: string; text: string }> = [
  {
    ikona: 'hodiny',
    nadpis: PROVOZNI_DOBA.rozsah,
    text: `Pondělí až pátek, vyzvednutí do ${PROVOZNI_DOBA.do}.`,
  },
  { ikona: 'pribor', nadpis: 'Oběd v ceně', text: 'I pitný režim a veškerý materiál na tvoření.' },
  { ikona: 'lide', nadpis: 'Malé skupiny', text: 'Lektor se dostane ke každému dítěti.' },
  { ikona: 'stit', nadpis: 'První pomoc', text: 'Lektoři jsou proškolení a s dětmi pracují dlouhodobě.' },
]

export function Usp() {
  return (
    <section className="usp" aria-label="Co máte jisté">
      <div className="wrap">
        <ul className="usp-in">
          {BODY.map((b) => (
            <li key={b.nadpis}>
              <span className="usp-ik">
                <Ikona id={b.ikona} />
              </span>
              <b>{sazba(b.nadpis)}</b>
              <span>{sazba(b.text)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
