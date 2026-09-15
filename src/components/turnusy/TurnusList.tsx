'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { Turnus } from '@/lib/turnusy'
import { getCity, type CityId } from '@/lib/cities'
import { TurnusCard } from './TurnusCard'
import { useTermCapacity } from './SpotsLeft'

/**
 * Města, mezi kterými má smysl filtrovat.
 *
 * Při jednom městě vrací prázdné pole — přepínač nad seznamem, který se vejde
 * na obrazovku, je jen překážka. Přesně tím se web zbavuje překlikávání měst,
 * aniž by o tu možnost přišel při expanzi.
 */
export function filtrMest(list: Turnus[]): Array<{ id: CityId; name: string; pocet: number }> {
  const pocty = new Map<CityId, number>()
  for (const t of list) {
    pocty.set(t.city, (pocty.get(t.city) ?? 0) + 1)
  }
  if (pocty.size < 2) return []
  return Array.from(pocty.entries()).map(([id, pocet]) => ({
    id,
    name: getCity(id).name,
    pocet,
  }))
}

/**
 * Ověří hodnotu `?mesto=` z adresy proti tomu, co `filtrMest` skutečně
 * nabízí. Starý nebo překlepnutý odkaz z kampaně (např. `?mesto=brno`) se
 * tímhle jediným místem nikdy neprosadí dál — ani do filtrování seznamu, ani
 * do dotazu na živou kapacitu, ani do `aria-current`. Typ návratové hodnoty
 * plyne přímo z `mesta`, žádný přetyp na `CityId` není potřeba.
 */
export function platneMesto(
  vybrane: string | null,
  mesta: Array<{ id: CityId; name: string; pocet: number }>
): CityId | undefined {
  return mesta.find((m) => m.id === vybrane)?.id
}

function TurnusListContent({ turnusy }: { turnusy: Turnus[] }) {
  const searchParams = useSearchParams()
  const vybrane = searchParams.get('mesto')
  const mesta = filtrMest(turnusy)
  const platne = platneMesto(vybrane, mesta)

  const zobrazene = platne ? turnusy.filter((t) => t.city === platne) : turnusy

  const capacity = useTermCapacity(platne)

  if (turnusy.length === 0) {
    return (
      <p className="text-ink-500">
        Termíny na příští léto teprve chystáme. Nechte nám kontakt níž a ozveme se vám mezi prvními.
      </p>
    )
  }

  return (
    <div>
      {mesta.length > 0 && (
        <nav className="flex flex-wrap gap-2 mb-8" aria-label="Filtr podle města">
          <Link
            href="/tabor"
            scroll={false}
            aria-current={platne === undefined ? 'true' : undefined}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-colors ${
              platne === undefined
                ? 'border-ink bg-ink text-paper'
                : 'border-ink/15 text-ink-500 hover:border-ink/40'
            }`}
          >
            Všechna města
          </Link>
          {mesta.map((m) => (
            <Link
              key={m.id}
              href={`/tabor?mesto=${m.id}`}
              scroll={false}
              aria-current={platne === m.id ? 'true' : undefined}
              className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-colors ${
                platne === m.id
                  ? 'border-ink bg-ink text-paper'
                  : 'border-ink/15 text-ink-500 hover:border-ink/40'
              }`}
            >
              {m.name} ({m.pocet})
            </Link>
          ))}
        </nav>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {zobrazene.map((turnus) => (
          <TurnusCard
            key={turnus.id}
            turnus={turnus}
            spotsLeft={capacity?.[turnus.id]?.spotsLeft}
          />
        ))}
      </div>
    </div>
  )
}

export function TurnusList({ turnusy }: { turnusy: Turnus[] }) {
  // useSearchParams vyžaduje Suspense hranici, jinak Next 16 odmítne prerender.
  return (
    <Suspense fallback={<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" />}>
      <TurnusListContent turnusy={turnusy} />
    </Suspense>
  )
}
