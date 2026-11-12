'use client'

import type { ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { CityId } from '@/lib/cities'

/**
 * Filtr výpisu táborů podle města. Stav žije v adrese (`?mesto=`), takže
 * odkaz na vyfiltrovaný výpis jde poslat a staré adresy `/karlovy-vary`
 * (přesměrované na `/tabory?mesto=karlovy-vary`) dopadnou správně.
 *
 * Bloky měst dostává hotové od serveru a jen rozhoduje, které jsou vidět —
 * karty táborů tak zůstávají serverové a v HTML jsou vždy všechny (bez
 * JavaScriptu je vidět celý výpis).
 */
export function FiltrMest({
  mesta,
}: {
  mesta: Array<{ id: CityId; name: string; obsah: ReactNode }>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const parametr = params.get('mesto')
  const vybrane = mesta.some((m) => m.id === parametr) ? (parametr as CityId) : null

  const vyber = (id: CityId | null) => {
    router.replace(id ? `${pathname}?mesto=${id}` : pathname, { scroll: false })
  }

  return (
    <>
      {mesta.length > 1 && (
        <div className="cipy" role="group" aria-label="Filtr podle města">
          <button type="button" className="cip" aria-pressed={vybrane === null} onClick={() => vyber(null)}>
            Všechna města
          </button>
          {mesta.map((m) => (
            <button
              key={m.id}
              type="button"
              className="cip"
              aria-pressed={vybrane === m.id}
              onClick={() => vyber(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}
      {mesta.map((m) => (
        <div className="mesto" key={m.id} hidden={vybrane !== null && vybrane !== m.id}>
          <h2>{m.name}</h2>
          {m.obsah}
        </div>
      ))}
    </>
  )
}
