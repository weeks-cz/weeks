'use client'

import type { ReactNode } from 'react'
import { trackViewTerms } from '@/lib/analytics'

/**
 * Odkaz na termíny, u kterého se měří klik (`view_terms`). Samostatná
 * klientská komponenta jen kvůli měření — okolní sekce zůstává serverová.
 */
export function OdkazTerminy({
  href,
  zdroj,
  className,
  children,
}: {
  href: string
  /** Odkud klik přišel — hodnota `source` v události. */
  zdroj: string
  className?: string
  children: ReactNode
}) {
  return (
    <a className={className} href={href} onClick={() => trackViewTerms(zdroj)}>
      {children}
    </a>
  )
}
