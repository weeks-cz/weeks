/**
 * Nezlomitelné mezery a spojovníky v českém textu. Volá se na texty, které se
 * skládají z dat (cena, datum, popis), kde je nejde napsat ručně.
 *
 * Proč: „5 990“ a „Kč“ na dvou řádcích, osamocené „v“ na konci řádku nebo
 * datum rozlomené za tečkou vypadají na 390 px jako chyba sazby.
 */
const MESICE =
  'ledna|února|března|dubna|května|června|července|srpna|září|října|listopadu|prosince'

export function sazba(text: string): string {
  return (
    text
      // tisíce: 5 990
      .replace(/(\d) (?=\d{3}(?!\d))/g, '$1\u00a0')
      // číslo a jednotka
      .replace(/(\d) (Kč|%|let|dní|dnů|hodnocení|dětí|míst)/g, '$1\u00a0$2')
      // datum: 12. 6. 2027, 12.–16. července 2027
      .replace(/(\d\.) (\d)/g, '$1\u00a0$2')
      .replace(/(\d\.)–(\d)/g, '$1–\u2060$2')
      .replace(/(\d:\d\d)–(\d)/g, '$1–\u2060$2')
      .replace(new RegExp(`(${MESICE}) (\\d{4})`, 'g'), '$1\u00a0$2')
      .replace(new RegExp(`(\\d\\.) (${MESICE})`, 'g'), '$1\u00a0$2')
      // jednopísmenné předložky a spojky (dvakrát: „a v Praze“)
      .replace(/(^|[\s(„])([ksvzouaiKSVZOUAI]) (?=\S)/g, '$1$2\u00a0')
      .replace(/(^|[\s(„])([ksvzouaiKSVZOUAI]) (?=\S)/g, '$1$2\u00a0')
      // pomlčka nezačíná řádek
      .replace(/ (–) /g, '\u00a0$1 ')
  )
}

/**
 * „12. – 16. července 2027“ → „12.–16. července 2027“. Rozsah ve stejném
 * měsíci se píše bez mezer kolem pomlčky; přes dva měsíce mezery zůstávají.
 */
export function rozsahTesne(datum: string): string {
  return datum.replace(/^(\d+\.) – (\d+\.) /, '$1–$2 ')
}
