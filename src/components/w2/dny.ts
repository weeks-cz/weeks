import type { IkonaId } from './Ikona'
import type { IkonaDne } from '@/lib/tabory'

/** Zkratka dne do karty týdne. */
export const ZKRATKY_DNU: Record<string, string> = {
  Pondělí: 'Po',
  Úterý: 'Út',
  Středa: 'St',
  Čtvrtek: 'Čt',
  Pátek: 'Pá',
}

/**
 * Klíč ikony dne z dat (`tabory.ts`) → ikona nového vzhledu. Data nesou jen
 * řetězec, aby šla načíst v testu bez Reactu.
 */
export const IKONA_DNE: Record<IkonaDne, IkonaId> = {
  napad: 'zarovka',
  tisk: 'krabice',
  model: 'tuzka',
  iot: 'cip',
  vr: 'jiskra',
  projekt: 'vlajka',
  level: 'krabice',
  hra: 'hra',
  zvuk: 'zvuk',
  kod: 'kod',
}
