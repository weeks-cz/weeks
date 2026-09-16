import { describe, it, expect } from 'vitest'
import { LOCATIONS } from './locations'

describe('konfigurace lokalit', () => {
  it('nejmenuje instituce, se kterými Weeks nespolupracuje', () => {
    const text = JSON.stringify(LOCATIONS)
    for (const zakazane of ['DDM', 'HWLab', 'Kubík', '24878511', 'ddmp6']) {
      expect(text, `konfigurace obsahuje „${zakazane}"`).not.toContain(zakazane)
    }
  })
})
