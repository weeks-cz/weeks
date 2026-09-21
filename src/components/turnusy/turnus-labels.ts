import { isBookable, type Turnus } from '@/lib/turnusy'
import { getCity, getVenue } from '@/lib/cities'

/**
 * Popisky turnusu jako čistá funkce bez `'use client'`.
 *
 * Žije mimo `TurnusCard.tsx` schválně — ten modul nese `'use client'` kvůli
 * Framer Motion, a React server komponenty nesmí volat funkci exportovanou
 * z klientského modulu (smí ji jen vykreslit jako komponentu). `turnusLabels`
 * ale žádné klientské API nepoužívá, takže když bydlí tady, může ji zavolat
 * jak `TurnusCard`, tak i čistě serverová stránka `/tabory/termin/[slug]`.
 */

const MESICE_2P = [
  'ledna', 'února', 'března', 'dubna', 'května', 'června',
  'července', 'srpna', 'září', 'října', 'listopadu', 'prosince',
]

function denMesic(iso: string): { den: number; mesic: number; rok: number } {
  const d = new Date(iso + 'T12:00:00')
  return { den: d.getDate(), mesic: d.getMonth(), rok: d.getFullYear() }
}

/** Rozsah termínu česky: „12. – 16. července 2027", přes měsíce „29. července – 2. srpna 2027". */
function rozsahData(startIso: string, endIso: string): string {
  const a = denMesic(startIso)
  const b = denMesic(endIso)
  if (a.mesic === b.mesic && a.rok === b.rok) {
    return `${a.den}. – ${b.den}. ${MESICE_2P[b.mesic]} ${b.rok}`
  }
  return `${a.den}. ${MESICE_2P[a.mesic]} – ${b.den}. ${MESICE_2P[b.mesic]} ${b.rok}`
}

/**
 * Popisky karty turnusu jako čistá funkce — aby šly otestovat bez vykreslování.
 * Turnus, který není v prodeji, nedostane odkaz na registraci: `ctaHref` je
 * `null` a karta místo tlačítka nabídne sběr kontaktu.
 */
export function turnusLabels(turnus: Turnus) {
  const prodejny = isBookable(turnus)

  const datum =
    turnus.start && turnus.end ? rozsahData(turnus.start, turnus.end) : 'Termín upřesníme'

  const misto = turnus.venueId ? getVenue(turnus.venueId).name : 'Místo upřesníme'

  // toLocaleString vkládá mezi tisíce nezalomitelnou mezeru (U+00A0) — necháváme
  // ji záměrně, i před „Kč": cena se na úzké kartě nesmí zalomit uprostřed čísla.
  const cena = turnus.priceKc !== null ? `${turnus.priceKc.toLocaleString('cs-CZ')} Kč` : ''

  const stav =
    turnus.status === 'plno'
      ? 'Obsazeno'
      : turnus.status === 'chystame'
        ? 'Chystáme'
        : turnus.status === 'uzavreno'
          ? 'Proběhlo'
          : 'Přijímáme přihlášky'

  const ctaText = prodejny
    ? 'Přihlásit dítě'
    : turnus.status === 'plno'
      ? 'Chci vědět o volném místě'
      : turnus.status === 'uzavreno'
        ? 'Chci vědět o dalších termínech'
        : 'Chci vědět, až otevřeme'

  return {
    datum,
    mesto: getCity(turnus.city).name,
    misto,
    cena,
    stav,
    ctaText,
    ctaHref: prodejny ? `/registrace?term=${turnus.id}` : null,
  }
}
