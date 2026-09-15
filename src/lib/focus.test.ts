import { describe, it, expect } from 'vitest'
import { getFocus, getFocusModules, FOCUS_IDS } from './focus'

describe('getFocus', () => {
  it('vrátí modul zaměření podle id', () => {
    expect(getFocus('3d-tisk').name).toBe('3D tisk')
    expect(getFocus('iot').name).toBe('IoT a elektronika')
  })
})

describe('FOCUS_IDS', () => {
  it('každé zaměření má jméno, jednovětý popis a aspoň tři věci k vyzkoušení', () => {
    for (const id of FOCUS_IDS) {
      const focus = getFocus(id)
      expect(focus.name.length).toBeGreaterThan(0)
      expect(focus.short.length).toBeGreaterThan(20)
      expect(focus.tryOut.length).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('getFocusModules', () => {
  it('zachová pořadí, v jakém si je turnus vyžádal', () => {
    const modules = getFocusModules(['iot', '3d-tisk'])
    expect(modules.map((m) => m.id)).toEqual(['iot', '3d-tisk'])
  })

  it('u prázdného seznamu vrátí prázdný seznam', () => {
    expect(getFocusModules([])).toEqual([])
  })
})
