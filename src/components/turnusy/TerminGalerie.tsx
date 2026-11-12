'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

export type FotkaGalerie = { src: string; alt: string }

/**
 * Fotky na stránce termínu. Na mobilu pás, který se posouvá prstem (jedna
 * fotka na šířku obsahu, počitadlo v rohu), na počítači mozaika: velká fotka
 * a dvě menší. Posouvá se jen ručně — nic se samo nehýbe nad tlačítkem.
 *
 * Klientská komponenta jen kvůli počitadlu „1 / 3“.
 */
export function TerminGalerie({ fotky }: { fotky: FotkaGalerie[] }) {
  const pas = useRef<HTMLDivElement>(null)
  const [aktualni, setAktualni] = useState(1)

  if (fotky.length === 0) return null

  const prepocitej = () => {
    const el = pas.current
    if (!el || el.clientWidth === 0) return
    setAktualni(Math.min(fotky.length, Math.round(el.scrollLeft / el.clientWidth) + 1))
  }

  return (
    <div className="tg-obal">
      <div className="tg" tabIndex={0} role="region" aria-label="Fotky" ref={pas} onScroll={prepocitej}>
        {fotky.map((f, i) => (
          <figure key={f.src}>
            <Image
              src={f.src}
              alt={f.alt}
              width={1200}
              height={900}
              sizes="(min-width: 900px) 480px, 100vw"
              priority={i === 0}
            />
          </figure>
        ))}
      </div>
      {fotky.length > 1 && (
        <span className="tg-pocet" aria-hidden="true">
          {aktualni} / {fotky.length}
        </span>
      )}
    </div>
  )
}
