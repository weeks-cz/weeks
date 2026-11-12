import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Zdroják stránky nebo komponenty bez komentářů — jen pro testy obsahu.
 *
 * Pojistky v `oslavy.test.ts` a `firmy.test.ts` hlídaly jen texty v `lib/`.
 * Nadpisy, perexy a hlášky formulářů jsou ale napsané přímo v TSX, takže
 * cena nebo vymyšlená zkušenost by tam prošla bez povšimnutí. Komentáře se
 * odstraňují, protože pravidlo („žádná cena, žádná reference“) v nich
 * stránky samy popisují a test by padal na vlastním vysvětlení.
 *
 * `cesta` je od kořene `src/`.
 */
export function zdrojBezKomentaru(cesta: string): string {
  return readFileSync(join(__dirname, '..', cesta), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
}
