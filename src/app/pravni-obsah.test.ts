import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Obsah právních stránek (`OBSAH`) je ručně psané pole vedle textu. Kdo
 * přidá, smaže nebo přečísluje oddíl, musí upravit i obsah – jinak odkaz
 * vede do prázdna. Test porovná kotvy oddílů s položkami obsahu.
 */
const STRANKY = ['gdpr', 'podminky']

describe.each(STRANKY)('obsah /%s', (stranka) => {
  const zdroj = readFileSync(path.join(__dirname, stranka, 'page.tsx'), 'utf-8')
  const oddily = [...zdroj.matchAll(/<section id="(cl-\d+)">\s*<h2>([^<]+)<\/h2>/g)].map((m) => ({
    id: m[1],
    nazev: m[2],
  }))
  const obsah = [...zdroj.matchAll(/\{ id: '([^']+)', nazev: '([^']+)' \}/g)].map((m) => ({
    id: m[1],
    nazev: m[2],
  }))

  it('má oddíly', () => {
    expect(oddily.length).toBeGreaterThan(5)
  })

  it('obsah odpovídá oddílům (kotva i nadpis, ve stejném pořadí)', () => {
    expect(obsah).toEqual(oddily)
  })
})
