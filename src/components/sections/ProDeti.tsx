'use client'

import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Box, Cpu, Gamepad2, Headset } from 'lucide-react'
import { MrizkaSekce } from '@/components/ui/MrizkaSekce'
import { getFocusModules, type FocusId } from '@/lib/focus'
import { getAktivniTabory } from '@/lib/tabory'

/**
 * Tmavý blok pro děti — cyan v roli „technologie" a interaktivní mřížka.
 *
 * Druhá polovina rozdělené `USPSection`. Mřížka sedí sem, ne do hera: je to
 * jediná sekce psaná dětem, takže hravost patří sem, a v druhé polovině
 * stránky odměňuje toho, kdo si se stránkou hraje, místo aby rozptylovala
 * u hlavního sdělení.
 *
 * Obsah se čte ze zaměření běžícího tábora (`tabory.ts` → `focus.ts`), ne
 * z vlastního seznamu — jinak by úvodka slibovala něco jiného než stránka
 * tábora.
 */

const IKONY: Record<FocusId, LucideIcon> = {
  '3d-tisk': Box,
  'iot': Cpu,
  'vr': Headset,
  'herni-vyvoj': Gamepad2,
}

export function ProDeti() {
  const reduced = useReducedMotion()
  const tabor = getAktivniTabory()[0]
  const zamereni = getFocusModules(tabor?.focus ?? [])

  if (zamereni.length === 0) return null

  const anim = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.45, delay: i * 0.06 },
        }

  return (
    <MrizkaSekce id="pro-deti" odstin="tmavy" className="section-padding bg-ink blueprint-grid-dark">
      <div className="section-container">
        <div className="mb-10 max-w-3xl">
          <p className="mono-label-dark mb-4 text-accent-300">Pro děti</p>
          <h2 className="heading-2 mb-4 text-paper">
            Co si <span className="text-accent-400">postavíš</span>
          </h2>
          <p className="text-lg text-paper/70">
            Žádné pracovní listy do šuplíku. Každý týden končí něčím, co si
            postavíš sám.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {zamereni.map((z, i) => {
            const Ikona = IKONY[z.id]
            return (
              <motion.div
                key={z.id}
                {...anim(i)}
                className="rounded-md border border-paper/15 bg-paper/[0.03] p-7"
              >
                <Ikona className="mb-5 h-8 w-8 text-accent-400" aria-hidden="true" />
                <h3 className="mb-2 font-display text-xl font-semibold text-paper">{z.name}</h3>
                <p className="text-paper/70">{z.short}</p>
              </motion.div>
            )
          })}
        </div>

        {tabor && (
          <div className="mt-10">
            <Link
              href={`/tabory/${tabor.id}`}
              className="group inline-flex items-center justify-center rounded-md border border-paper/30 px-6 py-3 font-semibold text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              Co se děje který den
              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        )}
      </div>
    </MrizkaSekce>
  )
}
