'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { trackTerminCta } from '@/lib/analytics'

/**
 * Lepicí lišta s hlavní akcí, když hlavní tlačítko odjede z obrazovky.
 *
 * Na mobilu přes celou šířku u spodního okraje, na počítači jako užší pás
 * dole uprostřed. Je vidět jen tehdy, když rodič **přescrolloval** za první
 * sledovaný prvek a žádný ze sledovaných prvků zrovna není na obrazovce —
 * vedle hlavního tlačítka nebo závěrečné výzvy by byla jen druhá kopie
 * téhož (pravidlo z auditu Muud: lišta se schová, když je CTA vidět).
 *
 * Lišta animuje jen posun, ne průhlednost: je to doplněk, ne nosný text, ale
 * ani doplněk nemá zůstat neviditelný, když se animace nespustí.
 */
export function NakupniLista({
  nadpis,
  podnadpis,
  ctaText,
  href,
  sleduj,
  termId,
}: {
  nadpis: string
  podnadpis?: string
  ctaText: string
  href: string
  /** `id` prvků, při jejichž viditelnosti se lišta schová. První z nich je hlavní tlačítko. */
  sleduj: string[]
  /** Vyplněné jen na stránce termínu — klik se pak měří jako `termin_cta_click`. */
  termId?: string
}) {
  const [ukazat, setUkazat] = useState(false)

  useEffect(() => {
    const prvky = sleduj
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (prvky.length === 0) return

    const viditelne = new Set<Element>()
    const prepocitej = () => {
      const zaPrvnim = prvky[0].getBoundingClientRect().bottom < 0
      setUkazat(zaPrvnim && viditelne.size === 0)
    }
    const observer = new IntersectionObserver((zaznamy) => {
      for (const z of zaznamy) {
        if (z.isIntersecting) viditelne.add(z.target)
        else viditelne.delete(z.target)
      }
      prepocitej()
    })
    prvky.forEach((el) => observer.observe(el))
    window.addEventListener('scroll', prepocitej, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', prepocitej)
    }
  }, [sleduj])

  const kotva = href.startsWith('#')
  const obsah = (
    <>
      {ctaText}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </>
  )
  const tlacitko = 'btn-primary shrink-0 px-5 py-2.5 text-sm sm:text-base'

  return (
    <div
      aria-hidden={!ukazat}
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 sm:bottom-4 sm:px-4 ${
        ukazat ? 'translate-y-0' : 'pointer-events-none translate-y-[150%]'
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 border-t border-paper/15 bg-ink px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-paper shadow-hard-amber sm:rounded-md sm:border sm:border-ink sm:px-5 sm:pb-3">
        <div className="min-w-0">
          <p className="truncate font-display font-semibold leading-tight">{nadpis}</p>
          {podnadpis && <p className="truncate text-xs text-paper/60">{podnadpis}</p>}
        </div>
        {kotva ? (
          <a href={href} tabIndex={ukazat ? undefined : -1} className={tlacitko}>
            {obsah}
          </a>
        ) : (
          <Link
            href={href}
            tabIndex={ukazat ? undefined : -1}
            onClick={() => termId && trackTerminCta({ source: 'lista', termId })}
            className={tlacitko}
          >
            {obsah}
          </Link>
        )}
      </div>
    </div>
  )
}
