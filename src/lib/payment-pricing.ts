import { getTurnusById, isBookable, TURNUSY, type Turnus } from './turnusy'

/**
 * Důvěryhodný zdroj ceny a kapacity pro registraci.
 *
 * Odvozuje se výhradně z turnusu na serveru — NIKDY z částky poslané klientem.
 * Vstupem je `term_id`, protože cena a kapacita patří turnusu, ne programu:
 * dva turnusy se stejným zaměřením se mohou lišit cenou.
 *
 * Turnus, který není v prodeji, vyhodí výjimku. Volající to překládá na
 * chybu 400 — ať už jde o překlep v adrese, nebo o pokus obejít vyprodáno.
 */
function resolveBookable(termId: string, list: Turnus[] = TURNUSY): Turnus {
  const turnus = getTurnusById(termId, list)
  if (!turnus) {
    throw new Error(`Neznámý turnus: ${termId}`)
  }
  if (!isBookable(turnus)) {
    throw new Error(`Turnus ${termId} není v prodeji (stav: ${turnus.status})`)
  }
  return turnus
}

export function getTrustedPriceKc(termId: string, list: Turnus[] = TURNUSY): number {
  // `isBookable` už zaručilo, že cena není null.
  return resolveBookable(termId, list).priceKc as number
}

export function getTrustedCapacity(termId: string, list: Turnus[] = TURNUSY): number {
  return resolveBookable(termId, list).capacity
}
