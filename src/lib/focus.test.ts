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

describe('obsah přenesený ze zanikajících stránek', () => {
  it('3D tisk jmenuje konkrétní modely tiskáren, se kterými děti pracují', () => {
    const printers = getFocus('3d-tisk').printers ?? []
    expect(printers.length).toBeGreaterThanOrEqual(4)
    expect(printers.join(' ')).toContain('MK4S')
  })

  it('IoT jmenuje konkrétní hardware', () => {
    const hardware = getFocus('iot').hardware ?? []
    expect(hardware.length).toBeGreaterThanOrEqual(2)
    expect(hardware.join(' ')).toContain('Arduino')
  })

  it('zaměření s vlastními otázkami rodičů mají u každé i odpověď', () => {
    for (const id of FOCUS_IDS) {
      for (const item of getFocus(id).faq ?? []) {
        expect(item.question.length, `${id}: ${item.question}`).toBeGreaterThan(5)
        expect(item.answer.length, `${id}: ${item.question}`).toBeGreaterThan(20)
      }
    }
  })

  it('každý odkaz na obrázek míří do veřejné složky, ne na cizí web', () => {
    for (const id of FOCUS_IDS) {
      for (const g of getFocus(id).gallery ?? []) {
        expect(g.src, `${id}`).toMatch(/^\/images\//)
      }
    }
  })

  it('každý obrázek v galerii má neprázdný alt popisek', () => {
    for (const id of FOCUS_IDS) {
      for (const g of getFocus(id).gallery ?? []) {
        expect(g.alt.length, `${id}: ${g.src}`).toBeGreaterThan(0)
      }
    }
  })
})
