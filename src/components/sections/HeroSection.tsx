'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { trackViewTerms } from '@/lib/analytics'
import { getTurnusy, isBookable } from '@/lib/turnusy'
import { SITE } from '@/lib/site'

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

/**
 * Řádek titulku najíždí zespodu.
 *
 * Dřív to byl clip reveal (`y: '110%'` v masce `overflow-hidden`). Vypadal
 * líp, ale měl vadu, kterou je vidět jen když se něco pokazí: než se animace
 * spustí, je řádek odsunutý mimo masku, takže při zamrzlé záložce, chybě JS
 * nebo pomalé hydrataci zůstal hlavní nadpis webu prázdný. Posun o 24 px
 * dopadne v nejhorším případě tak, že nadpis stojí o kousek níž.
 */
function RevealLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.span
      className="block"
      initial={reduced ? false : { y: 24 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.span>
  )
}

export function HeroSection() {
  const reduced = useReducedMotion()
  const turnusy = getTurnusy()
  // Věk bereme z prvního turnusu, ne natvrdo z jedné lokality — obě dnešní
  // turnusy mají shodně '9-15', ale zdroj pravdy je turnus, ne stránka.
  const ageLabel = (turnusy[0]?.ageRange ?? '9-15').replace('-', '–')

  // Úvodka je rozcestí, ne stránka tábora — neslibuje otevřenou registraci
  // přímo tady, jen posílá dál na /tabory. Text hlavního tlačítka ale musí
  // odpovídat témuž trojstavu jako /tabory (`prodejny` / `vyprodano` /
  // nic k prodeji), jinak by u vyprodaných turnusů lhal, že se ještě
  // nevypisují.
  const prodejny = turnusy.some(isBookable)
  const vyprodano = !prodejny && turnusy.some((t) => t.status === 'plno')
  const heroCtaText = prodejny
    ? 'Vybrat turnus'
    : vyprodano
      ? 'Chci vědět o volném místě'
      : 'Chci vědět o termínech'

  const kota = 'Praha · Karlovy Vary'
  const typed = useTypewriter(kota)

  // Nosný text animuje jen posun, ne viditelnost — viz `RevealLine` výš.
  const anim = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { y: 18 },
          animate: { y: 0 },
          transition: { duration: 0.6, delay, ease: EASE_OUT },
        }

  return (
    // Interaktivní mřížka tu schválně NENÍ: přestěhovala se do sekce „Co si
    // postaví" (`ProDeti`). Je to jediná sekce psaná dětem, hravost tam patří,
    // a v druhé polovině stránky odměňuje toho, kdo si se stránkou hraje,
    // místo aby rozptylovala u hlavního sdělení.
    <section className="relative overflow-hidden border-b border-ink bg-ink blueprint-grid-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 select-none font-display text-[26rem] font-bold leading-none text-paper/[0.04]"
      >
        W
      </div>

      <div className="section-container relative z-10 grid items-center gap-12 pb-16 pt-32 md:pb-24 md:pt-40 lg:grid-cols-12 lg:gap-10">
        {/* Text */}
        <div className="lg:col-span-7">
          <p className="mono-label-dark mb-6 min-h-[1.25em] text-accent-300">
            {typed.shown}
            <span
              aria-hidden="true"
              className={`-mb-px inline-block w-[0.6em] border-b-2 border-cta-400 transition-opacity duration-300 ${
                typed.done ? 'opacity-0' : 'animate-pulse opacity-100'
              }`}
            />
          </p>

          <h1 className="heading-1 mb-6 text-paper">
            <RevealLine delay={0.1}>IT tábory,</RevealLine>
            <RevealLine delay={0.2}>
              kde děti tvoří{' '}
              <span className="relative inline-block text-accent-400">
                budoucnost
                {/* Plotter podtržení */}
                <svg
                  aria-hidden="true"
                  className="absolute -bottom-[0.12em] left-0 h-[0.14em] w-full overflow-visible"
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
                    transition={{ duration: 0.7, delay: 0.9, ease: 'easeInOut' }}
                  />
                </svg>
              </span>
            </RevealLine>
          </h1>

          <motion.p
            {...anim(0.3)}
            className="mb-10 max-w-xl text-lg leading-relaxed text-paper/70 md:text-xl"
          >
            Týdenní příměstské tábory, kde si děti postaví vlastní věc — od 3D
            modelu po zařízení, které samy naprogramují.
            <span className="font-medium text-paper"> Pro děti {ageLabel} let.</span>
          </motion.p>

          <motion.div {...anim(0.4)} className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/tabory"
              className="btn-primary group px-8 py-4"
              onClick={() => trackViewTerms('homepage_hero')}
            >
              {heroCtaText}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/tabory/chytre-technologie#program"
              className="group inline-flex items-center justify-center rounded-md border border-paper/30 px-8 py-4 font-semibold text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              <Play className="mr-2 h-5 w-5" />
              Co děti čeká
            </Link>
          </motion.div>

          <motion.div {...anim(0.5)} className="mt-14 border-t border-paper/15 pt-6">
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="mono-label-dark mb-1">Organizátor</dt>
                <dd className="text-sm font-medium text-paper">{SITE.name}</dd>
              </div>
              <div>
                <dt className="mono-label-dark mb-1">Místa konání</dt>
                <dd className="text-sm font-medium text-paper">Praha &amp; Karlovy Vary</dd>
              </div>
              <div>
                <dt className="mono-label-dark mb-1">Věková skupina</dt>
                <dd className="font-mono text-sm font-medium text-paper">{ageLabel} let</dd>
              </div>
            </dl>
          </motion.div>
        </div>

        {/* Fotka v posunutém amber rámu — nosný grafický prvek varianty B.
            Záběr na celou dílnu, ne na jedno dítě: skupina s lektory říká
            „tohle je tábor", zatímco portrét jednoho dítěte z něj dělá maskota
            a rodič v něm nevidí lidi, kterým dítě svěřuje. */}
        <div className="relative lg:col-span-5">
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-4 translate-y-4 rounded-md bg-cta-400"
          />
          <div className="relative overflow-hidden rounded-md border border-paper/20">
            <Image
              src="/images/hwlab/hero-print-day.webp"
              alt="Děti a lektoři v dílně u 3D tiskáren, na plátně promítnuté logo Weeks"
              width={880}
              height={660}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/3] w-full object-cover"
              priority
              quality={90}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
