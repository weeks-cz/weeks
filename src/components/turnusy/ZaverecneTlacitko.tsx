'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { trackTerminCta } from '@/lib/analytics'

/**
 * Tlačítko závěrečné výzvy na stránce termínu. Samostatně jen kvůli měření
 * kliku (`termin_cta_click`, `source: 'zaver'`) — zbytek výzvy je serverový.
 */
export function ZaverecneTlacitko({ href, text, termId }: { href: string; text: string; termId: string }) {
  return (
    <Link
      href={href}
      onClick={() => trackTerminCta({ source: 'zaver', termId })}
      className="btn-secondary group shrink-0 px-8 py-4 text-lg"
    >
      {text}
      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  )
}
