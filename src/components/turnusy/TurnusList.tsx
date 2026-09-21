'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getCitiesWithTurnusy, type Turnus } from '@/lib/turnusy'
import { getCity, type CityId } from '@/lib/cities'
import { TurnusCard } from './TurnusCard'
import { useTermCapacity } from './SpotsLeft'

/**
 * Města, mezi kterými má smysl filtrovat.
 *
 * Při jednom městě vrací prázdné pole — přepínač nad seznamem, který se vejde
 * na obrazovku, je jen překážka. Přesně tím se web zbavuje překlikávání měst,
 * aniž by o tu možnost přišel při expanzi.
 *
 * Která města mají co nabídnout se počítá přes `getCitiesWithTurnusy`, aby
 * tahle logika žila na jednom místě a ne dvakrát po svém.
 */
export function filtrMest(list: Turnus[]): Array<{ id: CityId; name: string; pocet: number }> {
  const mesta = getCitiesWithTurnusy(list)
  if (mesta.length < 2) return []
  return mesta.map((id) => ({
    id,
    name: getCity(id).name,
    pocet: list.filter((t) => t.city === id).length,
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
          {/* Sekce je bg-ink text-paper (viz tmavá sekce termínů na stránce tématu) — tokeny `border-ink`/
              `text-ink-500` tu byly navržené pro světlý podklad a na tmavém dávaly
              kontrast kolem 2,4 : 1. Neaktivní odkaz proto stojí na `text-paper/70`
              (~7 : 1 vůči bg-ink, nad WCAG AA 4,5 : 1 pro běžný text), stejně jako
              ostatní tmavé sekce webu (Header mobilní nav, Footer). */}
          <Link
            href="/tabory"
            scroll={false}
            aria-current={platne === undefined ? 'true' : undefined}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-colors ${
              platne === undefined
                ? 'border-paper bg-paper text-ink'
                : 'border-paper/25 text-paper/70 hover:border-paper/50 hover:text-paper'
            }`}
          >
            Všechna města
          </Link>
          {mesta.map((m) => (
            <Link
              key={m.id}
              href={`/tabory?mesto=${m.id}`}
              scroll={false}
              aria-current={platne === m.id ? 'true' : undefined}
              className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-colors ${
                platne === m.id
                  ? 'border-paper bg-paper text-ink'
                  : 'border-paper/25 text-paper/70 hover:border-paper/50 hover:text-paper'
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

/**
 * Kostra karet pro dobu, než se hydratuje `TurnusListContent` (i to, co se
 * pošle jako statické HTML při prerenderu — prázdný `<div>` by tu chvíli
 * nechal zet dírou pod nadpisem sekce).
 */
function TurnusListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="status" aria-busy="true" aria-label="Načítáme turnusy">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col bg-paper border border-ink/15 rounded-md p-6 animate-pulse">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="h-3 w-24 rounded-sm bg-ink/10" />
            <div className="h-3 w-16 rounded-sm bg-ink/10" />
          </div>
          <div className="h-5 w-3/4 rounded-sm bg-ink/10 mb-3" />
          <div className="h-3 w-1/2 rounded-sm bg-ink/10 mb-6" />
          <div className="h-3 w-full rounded-sm bg-ink/10 mb-2" />
          <div className="h-3 w-5/6 rounded-sm bg-ink/10 mb-6" />
          <div className="mt-auto pt-4 border-t border-ink/15 flex items-center justify-between">
            <div className="h-4 w-16 rounded-sm bg-ink/10" />
            <div className="h-9 w-32 rounded-sm bg-ink/10" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TurnusList({ turnusy }: { turnusy: Turnus[] }) {
  // useSearchParams vyžaduje Suspense hranici, jinak Next 16 odmítne prerender.
  return (
    <Suspense fallback={<TurnusListSkeleton />}>
      <TurnusListContent turnusy={turnusy} />
    </Suspense>
  )
}
