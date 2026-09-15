import { getTurnusById, isBookable, TURNUSY, type Turnus } from './turnusy'
import type { CityId } from './cities'
import { getFocusModules } from './focus'

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

/**
 * Důvěryhodné město turnusu. Ukládá se do `registrations.location_id` místo
 * hodnoty od klienta — město určuje, jakou adresu a jaký kontakt rodič dostane
 * v nástupním listu, takže se nesmí rozejít s turnusem.
 */
export function getTrustedCity(termId: string, list: Turnus[] = TURNUSY): CityId {
  return resolveBookable(termId, list).city
}

/**
 * Důvěryhodný termín turnusu. Ukládá se do `registrations.term_start` a
 * `term_end` místo hodnot od klienta — uložené datum řídí popisek v e-mailu,
 * nástupní list i okno upomínkového cronu.
 */
export function getTrustedTerm(termId: string, list: Turnus[] = TURNUSY): { start: string; end: string } {
  const turnus = resolveBookable(termId, list)
  // `isBookable` už zaručilo, že ani jedno není null.
  return { start: turnus.start as string, end: turnus.end as string }
}

/**
 * Název tábora, jak se má objevit na faktuře a v e-mailu rodiči.
 *
 * Skládá se z turnusu, ne z toho, co poslal klient — ale na rozdíl od ceny,
 * kapacity, města a termínu NEKONTROLUJE stav prodeje: jméno tábora platí
 * i pro turnus, který mezitím doprodal (`plno`) nebo skončil (`uzavreno`) —
 * přesně v těchhle stavech běží nástupní list, upomínka platby i callback
 * z Comgate, který vystavuje fakturu z Fakturoidu. Vyhodí výjimku jen
 * u turnusu, který v `list` vůbec není.
 */
export function getTrustedProgramName(termId: string, list: Turnus[] = TURNUSY): string {
  const turnus = getTurnusById(termId, list)
  if (!turnus) {
    throw new Error(`Neznámý turnus: ${termId}`)
  }
  const zamereni = getFocusModules(turnus.focus).map((m) => m.name)
  return zamereni.length > 0
    ? `Letní příměstský tábor (${zamereni.join(', ')})`
    : 'Letní příměstský tábor'
}
