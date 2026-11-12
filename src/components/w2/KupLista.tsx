'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { trackTerminCta } from '@/lib/analytics'

/**
 * Lepicí lišta s cenou a hlavní akcí u spodního okraje — jen na mobilu
 * (na počítači je nákupní box přilepený ve sloupci vedle obsahu).
 *
 * Je vidět jen tehdy, když rodič přescrolloval za první sledovaný prvek
 * a žádný ze sledovaných prvků zrovna není na obrazovce: vedle hlavního
 * tlačítka nebo závěrečné výzvy by byla jen druhá kopie téhož.
 */
export function KupLista({
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
    // `sleduj` je pole literálů z rodiče; závislost na obsahu, ne na identitě.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sleduj.join('|')])

  return (
    <div className={`kup-lista${ukazat ? ' je-videt' : ''}`} aria-hidden={!ukazat}>
      <div>
        <b>{nadpis}</b>
        {podnadpis && <span>{podnadpis}</span>}
      </div>
      {href.startsWith('#') ? (
        <a className="btn btn-primary" href={href} tabIndex={ukazat ? undefined : -1}>
          {ctaText}
        </a>
      ) : (
        <Link
          className="btn btn-primary"
          href={href}
          tabIndex={ukazat ? undefined : -1}
          onClick={() => termId && trackTerminCta({ source: 'lista', termId })}
        >
          {ctaText}
        </Link>
      )}
    </div>
  )
}
