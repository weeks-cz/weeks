'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export type FotkaGalerie = { src: string; alt: string }

/**
 * Galerie na stránce termínu — první věc, na kterou se rodič podívá.
 *
 * Jeden pás se `scroll-snap` pro mobil i počítač: na mobilu se táhne prstem,
 * na počítači se přepíná náhledy pod ním. Bez knihovny, stejně jako
 * `GoogleRecenze`. Fotky se neanimují — galerie je obsah, ne dekorace.
 *
 * Oranžový posunutý rám je stejný jako u fotky v heru úvodky: tím stránka
 * termínu patří ke zbytku webu.
 */
export function TerminGalerie({ fotky }: { fotky: FotkaGalerie[] }) {
  const pas = useRef<HTMLUListElement>(null)
  const [aktivni, setAktivni] = useState(0)

  useEffect(() => {
    const el = pas.current
    if (!el) return
    const prepocitej = () => {
      const index = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1))
      setAktivni(Math.min(Math.max(index, 0), fotky.length - 1))
    }
    el.addEventListener('scroll', prepocitej, { passive: true })
    return () => el.removeEventListener('scroll', prepocitej)
  }, [fotky.length])

  const ukaz = (index: number) => {
    const el = pas.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
  }

  if (fotky.length === 0) return null

  return (
    <div>
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-md bg-cta-400 sm:translate-x-4 sm:translate-y-4"
        />
        <ul
          ref={pas}
          aria-label="Fotky z tábora"
          className="relative flex snap-x snap-mandatory overflow-x-auto rounded-md border border-paper/20 bg-ink-700 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {fotky.map((fotka, i) => (
            <li key={fotka.src} className="relative aspect-[2/1] w-full shrink-0 snap-start sm:aspect-[16/9] lg:aspect-[4/3]">
              <Image
                src={fotka.src}
                alt={fotka.alt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
                priority={i === 0}
                loading={i === 0 ? undefined : 'lazy'}
              />
            </li>
          ))}
        </ul>
        {fotky.length > 1 && (
          <p
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 right-3 rounded-sm bg-ink/80 px-2 py-1 font-mono text-xs text-paper"
          >
            {aktivni + 1} / {fotky.length}
          </p>
        )}
      </div>

      {fotky.length > 1 && (
        <div className="mt-6 hidden gap-3 lg:flex">
          {fotky.map((fotka, i) => (
            <button
              key={fotka.src}
              type="button"
              onClick={() => ukaz(i)}
              aria-label={`Zobrazit fotku ${i + 1}: ${fotka.alt}`}
              aria-current={i === aktivni ? 'true' : undefined}
              className={`relative aspect-[4/3] w-20 overflow-hidden rounded-sm border transition-colors ${
                i === aktivni ? 'border-cta-400' : 'border-paper/20 opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={fotka.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
