import { describe, it, expect } from 'vitest'
import { UKAZAT_VOLNA_MISTA_OD, volnaMistaText } from './SpotsLeft'

describe('volnaMistaText — kdy a jak ukázat volná místa', () => {
  it('nad prahem mlčí, ať čerstvý turnus nehlásí „15 z 15“', () => {
    expect(volnaMistaText(15)).toBeNull()
    expect(volnaMistaText(UKAZAT_VOLNA_MISTA_OD + 1)).toBeNull()
  })

  it('od prahu níž ukáže počet se správným tvarem', () => {
    expect(volnaMistaText(UKAZAT_VOLNA_MISTA_OD)).toBe('Zbývá 10 míst')
    expect(volnaMistaText(4)).toBe('Zbývá 4 místa')
    expect(volnaMistaText(2)).toBe('Zbývá 2 místa')
    expect(volnaMistaText(1)).toBe('Zbývá 1 místo')
  })

  it('bez volného místa hlásí obsazeno', () => {
    expect(volnaMistaText(0)).toBe('Obsazeno')
  })
})
