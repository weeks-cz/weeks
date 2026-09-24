/**
 * Google recenze na úvodce — ručně přepsané, ne načítané z API.
 *
 * Rozhodnuto 2026-09-24: Places API by chtělo Google Cloud projekt s billingem,
 * klíč ve Vercelu a stejně vrací nejvýš pět recenzí. Recenzí je pár a přibývají
 * pomalu, takže přepsat novou sem je rychlejší než udržovat napojení.
 *
 * POZOR — sem patří jen recenze, které **na Google profilu Weeks opravdu
 * stojí**, doslova a se jménem, jak ho autor zveřejnil. Žádné zkracování
 * do chvály, žádné „anonymní rodič“. Web si tu půjčuje cizí slova, takže musí
 * jít dohledat — proto je u sekce vždy odkaz na profil.
 *
 * Dokud je seznam prázdný (nebo chybí odkaz na profil), sekce se na webu
 * vůbec nevykreslí. Hlídá to `recenze.test.ts`.
 */

export interface Recenze {
  /** Stabilní klíč, třeba `jmeno-rok`. */
  id: string
  autor: string
  /** Celé hvězdičky 1–5, jak je autor dal. */
  hvezdicky: 1 | 2 | 3 | 4 | 5
  /**
   * Doslovný text recenze. Chybí u hodnocení, kde autor dal jen hvězdičky —
   * karta pak ukáže hvězdičky a jméno, text se nevymýšlí.
   */
  text?: string
  /** Kdy recenze vyšla, volně („srpen 2026“). Nepovinné. */
  kdy?: string
}

export const GOOGLE_PROFIL = {
  /** Odkaz na profil firmy na Google (Mapy / vyhledávání), kde recenze stojí. */
  url: 'https://maps.google.com/?cid=12133580976159458933' as string | null,
  /**
   * Souhrn z profilu — **při přidání recenze aktualizovat i tohle**, jinak web
   * ukazuje jiné číslo než Google. Stav 2026-09-24: 7 hodnocení, všechna 5★,
   * text mají jen tři.
   */
  prumer: '5,0',
  pocet: 7,
  /** Odkaz „napsat recenzi“ (g.page/r/…/review). Nepovinné. */
  napsatRecenziUrl: null as string | null,
}

/**
 * Všech sedm hodnocení z profilu (stav 2026-09-24) — zakladatel je chtěl
 * v carouselu všechna. Nejdřív ta s textem, pak hodnocení jen hvězdičkami.
 * Pořadí uvnitř skupin jako na Google.
 */
export const RECENZE: Recenze[] = [
  {
    id: 'milan-cuchta',
    autor: 'Milan Cuchta',
    hvezdicky: 5,
    text: 'Skvělý tábor v Karlových Varech. Syn chodil domů nadšený, nejvíce ho bavil 3D tisk. Lektoři byli super, určitě přijdeme zas.',
    kdy: 'srpen 2026',
  },
  {
    id: 'jan-plasil',
    autor: 'Jan Plašil',
    hvezdicky: 5,
    text: 'Tábor se dětem moc líbil. Přišly domů nadšené s novým koníčkem👍',
    kdy: 'září 2026',
  },
  {
    id: 'filip-jezdik',
    autor: 'Filip Jezdik',
    hvezdicky: 5,
    text: 'Dětem se moc líbilo!',
    kdy: 'srpen 2026',
  },
  { id: 'katka-jagrova', autor: 'Katka Jágrová', hvezdicky: 5, kdy: 'září 2026' },
  { id: 'stepan-ruzicka', autor: 'Stepan Ruzicka', hvezdicky: 5, kdy: 'srpen 2026' },
  { id: 'tomas-andrla', autor: 'Tomáš Andrla', hvezdicky: 5, kdy: 'srpen 2026' },
  { id: 'radek-pelech', autor: 'Radek Pelech', hvezdicky: 5, kdy: 'srpen 2026' },
]

/** Sekce se ukáže, jen když má co ukázat a kam odkázat. */
export function maRecenze(): boolean {
  return RECENZE.length > 0 && GOOGLE_PROFIL.url !== null
}
