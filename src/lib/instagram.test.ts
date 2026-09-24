import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect } from 'vitest'
import { INSTAGRAM_POSTY } from './instagram'

describe('Instagram pás', () => {
  it('každý post vede na Instagram a jeho fotka je opravdu v public/', () => {
    for (const p of INSTAGRAM_POSTY) {
      expect(p.url, p.id).toMatch(/^https:\/\/www\.instagram\.com\/(p|reel)\//)
      expect(p.obrazek, p.id).toMatch(/^\/images\/instagram\//)
      expect(existsSync(join(process.cwd(), 'public', p.obrazek)), `${p.id}: ${p.obrazek}`).toBe(true)
      expect(p.alt.trim(), `${p.id}: alt`).not.toBe('')
    }
  })

  it('id jsou jedinečná', () => {
    const id = INSTAGRAM_POSTY.map((p) => p.id)
    expect(new Set(id).size).toBe(id.length)
  })
})
