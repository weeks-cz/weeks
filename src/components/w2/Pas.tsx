import { getCity } from '@/lib/cities'
import { getCitiesWithTurnusy, getTurnusy, oznameniPrihlasovani } from '@/lib/turnusy'

/**
 * Běžící pás témat pod úvodem. Čistě ozdobný: pro čtečky je skrytý (obsah je
 * jinde na stránce), animaci řídí CSS a při omezeném pohybu stojí.
 *
 * Témata jsou jen to, co běžící tábory opravdu obsahují. Sezóna, města i věk
 * se berou z dat — pás nesmí hlásit rok, který už proběhl, ani město, kde
 * žádný termín není.
 */
const TEMATA = ['3D tisk', '3D modelování', 'Arduino a elektronika', 'Vývoj her v Godotu']

export function Pas() {
  const oznameni = oznameniPrihlasovani()
  const mesta = getCitiesWithTurnusy().map((m) => getCity(m).name)
  const vek = (getTurnusy()[0]?.ageRange ?? '9-15').replace('-', '–')
  const polozky = [
    ...TEMATA,
    ...(oznameni ? [`Léto ${oznameni.rok}`] : []),
    ...(mesta.length > 0 ? [mesta.join(' a ')] : []),
    `Pro děti ${vek} let`,
  ]

  return (
    <div className="pas" aria-hidden="true">
      <div className="pas-in">
        {[0, 1].map((n) => (
          <ul key={n}>
            {polozky.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
