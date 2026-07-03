'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { trackViewTerms } from '@/lib/analytics'
import { useLocation } from '@/contexts/LocationContext'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

// Mono kóta se vypisuje jako na terminálu. Při reduced-motion se zobrazí celá hned.
function useTypewriter(text: string, startDelayMs = 250, speedMs = 26) {
  const reduced = useReducedMotion()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (reduced) {
      setCount(text.length)
      return
    }
    setCount(0)
    let i = 0
    let interval: ReturnType<typeof setInterval> | undefined
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1
        setCount(i)
        if (i >= text.length && interval) clearInterval(interval)
      }, speedMs)
    }, startDelayMs)
    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [text, reduced, startDelayMs, speedMs])

  return { shown: text.slice(0, count), done: count >= text.length }
}

// Řádek titulku najíždí zespodu v masce (clip reveal).
function RevealLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function HeroSection() {
  const location = useLocation()
  const reduced = useReducedMotion()
  // Věk bereme z configu lokace (Praha 10–15, KV 9–15), ne natvrdo.
  const ageLabel = (location.programs[0]?.ageRange ?? '10-15').replace('-', '–')
  const venue = location.venues[0]

  const kota = `${location.hero.badge} · Registrace otevřena`
  const typed = useTypewriter(kota)

  // Interaktivní mřížka: buňky blueprint gridu se za kurzorem rozsvítí a pohasnou
  // (fading trail) + měkká záře pod kurzorem. Jen na zařízeních s přesným
  // kurzorem a bez reduced-motion.
  const sectionRef = useRef<HTMLElement>(null)
  const [cursorEnabled, setCursorEnabled] = useState(false)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const [trail, setTrail] = useState<{ key: number; cx: number; cy: number }[]>([])
  const lastCell = useRef('')
  const trailKey = useRef(0)

  useEffect(() => {
    setCursorEnabled(window.matchMedia('(pointer: fine)').matches && !reduced)
  }, [reduced])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cursorEnabled || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCursor({ x, y })

    const cx = Math.floor(x / 32) * 32
    const cy = Math.floor(y / 32) * 32
    const cellId = `${cx},${cy}`
    if (cellId === lastCell.current) return
    lastCell.current = cellId
    const key = ++trailKey.current
    setTrail(t => [...t.slice(-24), { key, cx, cy }])
    // Buňku odstraníme až po doběhnutí fade animace (0.9 s)
    setTimeout(() => {
      setTrail(t => t.filter(c => c.key !== key))
    }, 950)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCursor(null)}
      className="relative bg-paper blueprint-grid border-b border-ink/15 overflow-hidden"
    >
      {/* Interaktivní mřížka — fading trail buněk + měkká záře pod kurzorem */}
      {cursorEnabled && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {trail.map(c => (
            <div
              key={c.key}
              className="cell-fade absolute w-8 h-8 bg-primary-500/[0.13]"
              style={{ left: c.cx, top: c.cy }}
            />
          ))}
          {cursor && (
            <div
              className="absolute w-56 h-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/[0.07] blur-3xl transition-[left,top] duration-150 ease-out"
              style={{ left: cursor.x, top: cursor.y }}
            />
          )}
        </div>
      )}

      <div className="section-container grid lg:grid-cols-12 gap-12 lg:gap-10 items-center pt-32 pb-16 md:pt-40 md:pb-24">
        {/* Text column */}
        <div className="lg:col-span-7">
          {/* Mono kóta — typewriter */}
          <p className="mono-label mb-6 min-h-[1.25em]">
            {typed.shown}
            <span
              aria-hidden="true"
              className={`inline-block w-[0.6em] -mb-px border-b-2 border-cta-500 transition-opacity duration-300 ${
                typed.done ? 'opacity-0' : 'animate-pulse opacity-100'
              }`}
            />
          </p>

          {/* Headline — clip reveal po řádcích */}
          <h1 className="heading-1 text-ink mb-6">
            <RevealLine delay={0.45}>IT tábory,</RevealLine>
            <RevealLine delay={0.6}>
              <span className="text-primary-600">
                kde děti tvoří{' '}
                <span className="relative inline-block">
                  budoucnost
                  {/* Plotter podtržení */}
                  <svg
                    aria-hidden="true"
                    className="absolute left-0 -bottom-[0.12em] w-full h-[0.14em] overflow-visible"
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <motion.path
                      d="M3 7 C 45 3.5, 95 9, 197 4.5"
                      stroke="#F59E0B"
                      strokeWidth={5}
                      strokeLinecap="round"
                      initial={{ pathLength: reduced ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7, delay: 1.5, ease: 'easeInOut' }}
                    />
                  </svg>
                </span>
              </span>
            </RevealLine>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: EASE_OUT }}
            className="text-lg md:text-xl text-ink-500 mb-10 max-w-xl leading-relaxed"
          >
            {location.hero.subtitle} Profesionální vybavení,
            zkušení instruktoři a projekty, které si Vaše dítě odnese domů.
            <span className="text-ink font-medium"> Pro děti {ageLabel} let.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05, ease: EASE_OUT }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="#prihlasit"
              className="btn-primary group px-8 py-4"
              onClick={() => trackViewTerms('homepage_hero')}
            >
              Vybrat termín
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#program"
              className="btn-outline group px-8 py-4"
            >
              <Play className="mr-2 w-5 h-5" />
              Co děti čeká
            </Link>
          </motion.div>

          {/* Trust row — mono spec line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.35 }}
            className="mt-14 pt-6 border-t border-ink/15"
          >
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="mono-label mb-1">Organizátor</dt>
                <dd className="text-sm font-medium text-ink flex items-center gap-2">
                  {location.organizer.logoUrl && (
                    <Image
                      src={location.organizer.logoUrl}
                      alt=""
                      width={20}
                      height={20}
                      className="object-contain w-5 h-5"
                      aria-hidden="true"
                    />
                  )}
                  {location.organizer.name}
                </dd>
              </div>
              <div>
                <dt className="mono-label mb-1">Místa konání</dt>
                <dd className="text-sm font-medium text-ink">
                  {location.venues.map(v => v.name).join(' & ')}
                </dd>
              </div>
              <div>
                <dt className="mono-label mb-1">Věková skupina</dt>
                <dd className="text-sm font-medium text-ink font-mono">{ageLabel} let</dd>
              </div>
            </dl>
          </motion.div>
        </div>

        {/* Photo column — "print sweep" odhalení + cvaknutí hard-shadow */}
        <div className="lg:col-span-5 relative">
          <motion.div
            className="relative border border-ink rounded-md bg-white"
            initial={reduced ? false : { boxShadow: '0px 0px 0 0 rgba(12,14,26,0)' }}
            animate={{ boxShadow: '4px 4px 0 0 rgba(12,14,26,1)' }}
            transition={{ duration: 0.25, delay: 1.4, ease: 'easeOut' }}
          >
            <motion.div
              className="overflow-hidden rounded-[5px]"
              initial={reduced ? false : { clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 0.9, delay: 0.5, ease: EASE_OUT }}
            >
              <Image
                src={location.isDefault ? '/images/hwlab/hwlab-7976.webp' : '/images/program-mix.webp'}
                alt={location.isDefault
                  ? 'HWLab — učebna s počítači a 3D tiskárnami'
                  : `FabLab VARY&TE — IT tábor v ${location.name}`}
                width={880}
                height={660}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover w-full aspect-[4/3]"
                priority
                quality={75}
              />
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.5 }}
            className="mono-label mt-4 text-right"
            aria-hidden="true"
          >
            {venue.name} — {venue.city}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
