import { Hvezdy, Ikona } from './Ikona'
import { sazba } from './text'
import { GOOGLE_PROFIL, maRecenze, recenzeProTabor, type Recenze } from '@/lib/recenze'
import type { TaborId } from '@/lib/tabory'

/**
 * Které recenze na kartu: nejdřív ty s textem, které se k táboru hodí
 * (`recenzeProTabor` — recenze o jiném táboře se na stránce tohohle
 * neukazuje), a do počtu tří se doplní hodnocení bez textu. Ta se ukážou jen
 * hvězdami a jménem; text se nikdy nevymýšlí.
 */
export function recenzeNaKarty(tabor?: TaborId, pocet = 3): Recenze[] {
  const vse = recenzeProTabor(tabor)
  return [...vse.filter((r) => r.text), ...vse.filter((r) => !r.text)].slice(0, pocet)
}

/**
 * Sekce „Co říkají rodiče“: nadpis se souhrnem z Google, tři karty, odkaz na
 * všechny recenze a věta o tom, že recenze neověřujeme. Počet hodnocení se
 * neuvádí — je jich zatím málo a číslo by působilo proti souhrnu.
 */
export function RecenzeSekce({
  tabor,
  poznamka,
  bezLinky = true,
  vodoznak = false,
}: {
  tabor?: TaborId
  /** Věta nad kartami, když recenze nejsou z tohohle tábora (`tabor.poznamkaKRecenzim`). */
  poznamka?: string
  bezLinky?: boolean
  /** Velké W v pozadí sekce — jen na úvodní stránce. */
  vodoznak?: boolean
}) {
  if (!maRecenze()) return null
  const karty = recenzeNaKarty(tabor)
  if (karty.length === 0) return null

  return (
    <section
      className={`sec sec-tint${bezLinky ? ' bez-linky' : ''}${vodoznak ? ' vz vz-recenze' : ''}`}
      id="recenze"
    >
      <div className="wrap">
        <div className="sec-head rec-head">
          <h2>Co říkají rodiče</h2>
          <p className="rec-souhrn">
            <Hvezdy /> <b>{sazba(`${GOOGLE_PROFIL.prumer} z 5`)}</b> na Google
          </p>
        </div>
        {poznamka && <p className="rec-pozn">{sazba(poznamka)}</p>}
        <div className="rec-pas" tabIndex={0} role="region" aria-label="Recenze rodičů z Google">
          {karty.map((r) => (
            <figure className="rec" key={r.id}>
              <span role="img" aria-label={`Hodnocení ${r.hvezdicky} z 5`}>
                <Hvezdy pocet={r.hvezdicky} />
              </span>
              {r.text ? (
                <blockquote>
                  <p>„{sazba(r.text.trim())}“</p>
                </blockquote>
              ) : (
                <p className="rec-bez">Hodnocení bez textu</p>
              )}
              <footer>
                <span className="rec-kdo" aria-hidden="true">
                  {r.autor.charAt(0)}
                </span>
                <span>
                  <b>{r.autor}</b>
                  {r.kdy && <span>{sazba(r.kdy)}</span>}
                </span>
              </footer>
            </figure>
          ))}
        </div>
        <div className="rec-dole">
          {GOOGLE_PROFIL.url && (
            <a className="btn btn-outline" href={GOOGLE_PROFIL.url} target="_blank" rel="noopener noreferrer">
              Všechny recenze na Google <Ikona id="ven" />
            </a>
          )}
          <p className="small muted">
            Recenze přebíráme beze změny z Google. Neověřujeme, zda jejich autoři tábor navštívili.
          </p>
        </div>
      </div>
    </section>
  )
}
