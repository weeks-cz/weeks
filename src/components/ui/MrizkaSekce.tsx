'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Interaktivní blueprint mřížka: za kurzorem se rozsvěcují buňky (fading
 * trail) a pod ním jde měkká záře.
 *
 * Efekt dřív žil natvrdo v `HeroSection`. Vytažený ven se dá pověsit na
 * kteroukoli sekci — a patří spíš doprostřed stránky než do hera, kde
 * rozptyluje u hlavního sdělení.
 *
 * Běží jen tam, kde dává smysl: zařízení s přesným kurzorem (ne dotyk)
 * a bez `prefers-reduced-motion`. Jinak se vykreslí obyčejná statická sekce,
 * takže na obsah efekt nemá vliv.
 */

const ODSTINY = {
  /** Na světlém papíru — indigo, stejně jako dnešní hero. */
  svetly: { bunka: 'bg-primary-500/[0.13]', zare: 'bg-primary-500/[0.07]' },
  /** Na tmavém inkoustu — cyan, aby seděl do role „technologie". */
  tmavy: { bunka: 'bg-accent-400/[0.16]', zare: 'bg-accent-400/[0.08]' },
} as const

/** Rozteč mřížky v px — musí sedět na `background-size` v `.blueprint-grid*`. */
const BUNKA = 32

interface MrizkaSekceProps {
  children: ReactNode
  className?: string
  odstin?: keyof typeof ODSTINY
  id?: string
}

export function MrizkaSekce({ children, className = '', odstin = 'svetly', id }: MrizkaSekceProps) {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [aktivni, setAktivni] = useState(false)
  const [kurzor, setKurzor] = useState<{ x: number; y: number } | null>(null)
  const [stopa, setStopa] = useState<{ key: number; cx: number; cy: number }[]>([])
  const posledniBunka = useRef('')
  const klic = useRef(0)
  const casovace = useRef<number[]>([])

  useEffect(() => {
    setAktivni(window.matchMedia('(pointer: fine)').matches && !reduced)
  }, [reduced])

  // Bez úklidu by odpočty přežily odpojení komponenty a sahaly na stav,
  // který už nikdo nevykresluje.
  useEffect(() => {
    const aktualni = casovace
    return () => {
      aktualni.current.forEach((t) => window.clearTimeout(t))
      aktualni.current = []
    }
  }, [])

  const pohybMysi = (e: React.MouseEvent) => {
    if (!aktivni || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setKurzor({ x, y })

    const cx = Math.floor(x / BUNKA) * BUNKA
    const cy = Math.floor(y / BUNKA) * BUNKA
    const id = `${cx},${cy}`
    if (id === posledniBunka.current) return
    posledniBunka.current = id

    const k = ++klic.current
    setStopa((s) => [...s.slice(-24), { key: k, cx, cy }])
    // Buňka se odstraní až po doběhnutí `cell-fade` (0,9 s).
    const t = window.setTimeout(() => {
      setStopa((s) => s.filter((c) => c.key !== k))
      casovace.current = casovace.current.filter((x) => x !== t)
    }, 950)
    casovace.current.push(t)
  }

  const barvy = ODSTINY[odstin]

  return (
    <section
      id={id}
      ref={sectionRef}
      onMouseMove={pohybMysi}
      onMouseLeave={() => setKurzor(null)}
      className={`relative overflow-hidden ${className}`}
    >
      {aktivni && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {stopa.map((c) => (
            <div
              key={c.key}
              className={`cell-fade absolute h-8 w-8 ${barvy.bunka}`}
              style={{ left: c.cx, top: c.cy }}
            />
          ))}
          {kurzor && (
            <div
              className={`absolute h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-[left,top] duration-150 ease-out ${barvy.zare}`}
              style={{ left: kurzor.x, top: kurzor.y }}
            />
          )}
        </div>
      )}
      {children}
    </section>
  )
}
