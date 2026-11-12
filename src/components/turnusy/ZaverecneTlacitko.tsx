'use client'

import Link from 'next/link'
import { Ikona } from '@/components/w2/Ikona'
import { trackTerminCta } from '@/lib/analytics'

/**
 * Tlačítko závěrečné výzvy na stránce termínu. Samostatně jen kvůli měření
 * kliku (`termin_cta_click`, `source: 'zaver'`) — zbytek výzvy je serverový.
 * Na jantarové ploše je tmavé: jantarové tlačítko by na ní nebylo vidět.
 */
export function ZaverecneTlacitko({ href, text, termId }: { href: string; text: string; termId: string }) {
  return (
    <Link
      className="btn btn-dark btn-lg"
      href={href}
      onClick={() => trackTerminCta({ source: 'zaver', termId })}
    >
      {text} <Ikona id="sipka" />
    </Link>
  )
}
