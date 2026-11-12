import { Ikona } from './Ikona'
import { sazba } from './text'

/**
 * Rozbalovací dotazy. Čisté `<details>` se společným `name`, takže je
 * otevřená vždy jen jedna a funguje to i bez JavaScriptu a pro čtečky.
 */
export function Faq({ dotazy }: { dotazy: Array<{ question: string; answer: string }> }) {
  return (
    <div className="faq">
      {dotazy.map((d) => (
        <details key={d.question} name="faq">
          <summary>
            {sazba(d.question)}{' '}
            <span className="faq-ik">
              <Ikona id="plus" />
            </span>
          </summary>
          <p>{sazba(d.answer)}</p>
        </details>
      ))}
    </div>
  )
}
