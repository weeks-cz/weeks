import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'fs'
import { extname, join } from 'path'

/**
 * Hlídá pravidlo z CLAUDE.md: „Load-bearing text never hides behind an
 * animation. Animate `y`, not `opacity`."
 *
 * Proč zrovna `whileInView`: `initial={{ opacity: 0 }}` se propíše i do HTML,
 * které pošle server. Obsah je pak doopravdy neviditelný — ne „jen
 * neanimovaný" — dokud nedoběhne hydratace a IntersectionObserver nespustí
 * přechod. Při rychlém scrollu se karty stihnou ukázat prázdné a tak to taky
 * vypadalo: sekce „Další témata" i dlaždice táborů problikávaly. Při `y`
 * zůstává obsah čitelný celou dobu a animace jen dorovná polohu.
 *
 * Test čte zdrojové soubory, protože jde o pravidlo napříč komponentami —
 * jedna komponenta si ho ohlídat neumí a příště ho poruší jiná.
 */

const KOREN = join(__dirname, '..')

function tsxSoubory(dir: string): string[] {
  return readdirSync(dir).flatMap((jmeno) => {
    const cesta = join(dir, jmeno)
    if (statSync(cesta).isDirectory()) return tsxSoubory(cesta)
    return extname(jmeno) === '.tsx' ? [cesta] : []
  })
}

describe('odhalovací animace při scrollu', () => {
  it('nikde neskrývá obsah přes opacity', () => {
    const prohresky = tsxSoubory(KOREN).flatMap((cesta) =>
      readFileSync(cesta, 'utf8')
        .split('\n')
        .map((radek, i) => ({ radek, cislo: i + 1 }))
        .filter(({ radek }) => radek.includes('whileInView') && radek.includes('opacity'))
        .map(({ cislo, radek }) => `${cesta.slice(KOREN.length + 1)}:${cislo} ${radek.trim()}`)
    )

    expect(prohresky).toEqual([])
  })

  it('kontroluje dost souborů, aby to nebyl test naprázdno', () => {
    expect(tsxSoubory(KOREN).length).toBeGreaterThan(20)
  })
})
