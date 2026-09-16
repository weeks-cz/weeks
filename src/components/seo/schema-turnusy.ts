import { getTurnusy, type Turnus } from '@/lib/turnusy'

export type Dostupnost = 'https://schema.org/InStock' | 'https://schema.org/SoldOut'

export interface TurnusProSchema {
  turnus: Turnus
  dostupnost: Dostupnost
}

/**
 * Které turnusy se smí objevit ve strukturovaných datech a s jakou dostupností.
 *
 * Proti `isBookable` je to o jeden stav širší: vyprodaný turnus (`plno`) se
 * ukáže jako `SoldOut`, ne aby ze schematu zmizel. „Vyprodáno" je pro Google
 * i pro rodiče užitečnější než ticho — a je to pravda, kterou stránka stejně
 * ukazuje.
 *
 * Turnus bez termínu, ceny nebo místa se nevykreslí za žádného stavu: schema
 * nemá co napsat do `startDate`, `offers.price` ani do adresy, a dopočítat to
 * záložní hodnotou by znamenalo slíbit něco, co neplatí.
 */
export function turnusyProSchema(list: Turnus[] = getTurnusy()): TurnusProSchema[] {
  return list
    .filter(
      (t) => t.start !== null && t.end !== null && t.priceKc !== null && t.venueId !== null
    )
    .filter((t) => t.status === 'otevreno' || t.status === 'plno')
    .map((t) => ({
      turnus: t,
      dostupnost:
        t.status === 'plno'
          ? ('https://schema.org/SoldOut' as const)
          : ('https://schema.org/InStock' as const),
    }))
}
