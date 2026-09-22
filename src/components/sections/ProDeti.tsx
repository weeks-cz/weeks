'use client'

import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Box, Brain, Cpu, Gamepad2, Globe, Headset } from 'lucide-react'
import { MrizkaSekce } from '@/components/ui/MrizkaSekce'
import { getFocusModules, type FocusId } from '@/lib/focus'
import { getAktivniTabory, getChystaneTabory, type TaborId } from '@/lib/tabory'

/**
 * Tmavý blok pro děti — cyan v roli „technologie" a interaktivní mřížka.
 *
 * Druhá polovina rozdělené `USPSection`. Mřížka sedí sem, ne do hera: je to
 * jediná sekce psaná dětem, takže hravost patří sem, a v druhé polovině
 * stránky odměňuje toho, kdo si se stránkou hraje, místo aby rozptylovala
 * u hlavního sdělení.
 *
 * Dlaždice ukazují dvě věci najednou: zaměření běžícího tábora (odkud se
 * čtou přes `tabory.ts` → `focus.ts`, aby úvodka neslibovala něco jiného než
 * stránka tábora) a témata, která se teprve chystají. Dřív tu stála jen ta
 * první skupina, takže dítě z úvodky nevidělo, že Weeks chystá i hry, AI
 * a weby — a ta chystaná témata přitom mají vlastní stránky.
 *
 * Každá dlaždice vede na svůj tábor, ne na společný výpis: dítě, které
 * zaujme zrovna 3D tisk, má být o klik dál od jeho programu.
 */

const IKONY_ZAMERENI: Record<FocusId, LucideIcon> = {
  '3d-tisk': Box,
  'iot': Cpu,
  'vr': Headset,
  'herni-vyvoj': Gamepad2,
}

/** Chystané tábory nemají zaměření, ze kterého by se ikona dala odvodit. */
const IKONY_TABORU: Partial<Record<TaborId, LucideIcon>> = {
  'game-dev': Gamepad2,
  'ai': Brain,
  'webovy-tabor': Globe,
}

type Dlazdice = {
  klic: string
  nadpis: string
  text: string
  href: string
  Ikona: LucideIcon
  chystame: boolean
}

export function ProDeti() {
  const reduced = useReducedMotion()
  const bezici = getAktivniTabory()[0]

  const zBezici: Dlazdice[] = bezici
    ? getFocusModules(bezici.focus).map((z) => ({
        klic: z.id,
        nadpis: z.name,
        text: z.short,
        href: `/tabory/${bezici.id}`,
        Ikona: IKONY_ZAMERENI[z.id],
        chystame: false,
      }))
    : []

  const zChystanych: Dlazdice[] = getChystaneTabory().map((t) => ({
    klic: t.id,
    nadpis: t.shortName,
    text: t.perex,
    href: `/tabory/${t.id}`,
    Ikona: IKONY_TABORU[t.id] ?? Box,
    chystame: true,
  }))

  const dlazdice = [...zBezici, ...zChystanych]
  if (dlazdice.length === 0) return null

  const anim = (i: number) =>
    reduced
      ? {}
      : {
          initial: { y: 18 },
          whileInView: { y: 0 },
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
          {dlazdice.map(({ klic, nadpis, text, href, Ikona, chystame }, i) => (
            <motion.div key={klic} {...anim(i)}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-md border border-paper/15 bg-paper/[0.03] p-7 transition-colors hover:border-accent-400/60 hover:bg-paper/[0.06]"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <Ikona className="h-8 w-8 text-accent-400" aria-hidden="true" />
                  {/* Amber = stav, stejně jako na kartě turnusu. */}
                  {chystame && (
                    <span className="shrink-0 rounded-sm border border-cta-400 px-2 py-0.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-cta-300">
                      Chystáme
                    </span>
                  )}
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold text-paper">{nadpis}</h3>
                <p className="text-paper/70">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-medium text-accent-300">
                  Mrknout na tábor
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </motion.div>
          ))}

          {/* Poslední dlaždice je rozcestník, ne téma — zaplňuje mřížku a nahrazuje
              tlačítko, které pod sekcí stálo zvlášť. Amber, protože je to akce. */}
          <motion.div {...anim(dlazdice.length)}>
            <Link
              href="/tabory"
              className="group flex h-full flex-col justify-center rounded-md border border-cta-400/50 bg-cta-400/[0.07] p-7 transition-colors hover:border-cta-400 hover:bg-cta-400/[0.12]"
            >
              <h3 className="mb-2 font-display text-xl font-semibold text-paper">
                Všechna témata
              </h3>
              <p className="mb-5 text-paper/70">
                Kde tábory běží, kdy a co se na nich děje který den.
              </p>
              <span className="inline-flex items-center gap-2 font-semibold text-cta-300">
                Zobrazit tábory
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </MrizkaSekce>
  )
}
