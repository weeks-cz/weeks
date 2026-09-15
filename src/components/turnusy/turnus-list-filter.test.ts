import { describe, it, expect } from 'vitest'
import { filtrMest } from './TurnusList'
import type { Turnus } from '@/lib/turnusy'

const kv: Turnus = {
  id: 'kv-1', slug: 'kv-1', city: 'karlovy-vary', venueId: 'fablab-varyte',
  start: '2027-07-12', end: '2027-07-16', priceKc: 4990, capacity: 15,
  status: 'otevreno', focus: ['3d-tisk'], ageRange: '9-15', perex: 'Turnus ve Varech.',
}
const kv2: Turnus = { ...kv, id: 'kv-2', slug: 'kv-2', start: '2027-08-02', end: '2027-08-06' }
const praha: Turnus = {
  ...kv, id: 'praha-1', slug: 'praha-1', city: 'praha', venueId: null,
  start: null, end: null, priceKc: null, status: 'chystame', perex: 'Turnus v Praze.',
}

describe('filtrMest', () => {
  it('při jednom městě filtr nenabídne — přepínání by byla jen překážka', () => {
    expect(filtrMest([kv, kv2])).toEqual([])
  })

  it('při dvou městech vrátí obě i s počty', () => {
    const f = filtrMest([kv, kv2, praha])
    expect(f.map((m) => m.id).sort()).toEqual(['karlovy-vary', 'praha'])
    expect(f.find((m) => m.id === 'karlovy-vary')?.pocet).toBe(2)
    expect(f.find((m) => m.id === 'praha')?.pocet).toBe(1)
  })

  it('pojmenuje města lidsky, ne identifikátorem', () => {
    const f = filtrMest([kv, praha])
    expect(f.find((m) => m.id === 'karlovy-vary')?.name).toBe('Karlovy Vary')
  })

  it('u prázdného seznamu filtr nenabídne', () => {
    expect(filtrMest([])).toEqual([])
  })
})
