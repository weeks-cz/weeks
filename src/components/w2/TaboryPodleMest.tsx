import { Suspense } from 'react'
import { FiltrMest } from './FiltrMest'
import { TaborKarta } from './TaborKarta'
import { EventSchema } from '@/components/seo/StructuredData'
import { getCity, type CityId } from '@/lib/cities'
import { getAktivniTabory } from '@/lib/tabory'
import { getCitiesWithTurnusy, getTurnusyByCity, isBookable, type Turnus } from '@/lib/turnusy'

/**
 * Tábory seskupené podle města s filtrem `?mesto=` — na `/tabory` i na úvodce.
 *
 * Pořadí město → téma → termín je pořadí, ve kterém rodič vybírá: nejdřív ví,
 * kam dítě dokáže dovézt, pak ho zajímá téma, nakonec termín. Úvodka dřív
 * kreslila karty v jedné řadě podle data (`TaboryUvodu`) a Praha s Karlovými
 * Vary se v ní míchaly; od 2026-11-24 má stejné rozložení jako výpis
 * (Lukáš: „vypadá to lépe, jak je první Praha a pak KV a ta filtrace“).
 *
 * `schema` vykreslí `EventSchema` ze stejné proměnné, ze které vznikají karty
 * — strukturovaná data tak nemůžou vypsat termín, který na stránce není
 * (hlídá `schema-turnusy.test.ts`). Filtr jen skrývá; v HTML jsou vždy všechna
 * města, proto schema bere turnusy všech.
 */

function kartyMesta(mesto: CityId) {
  const turnusyMesta = getTurnusyByCity(mesto)
  return (
    getAktivniTabory()
      .filter((tabor) => turnusyMesta.some((t) => t.taborIds.includes(tabor.id)))
      // Tábor, na který se dá přihlásit, stojí před táborem, který se chystá.
      .sort(
        (a, b) =>
          Number(!turnusyMesta.some((t) => t.taborIds.includes(a.id) && isBookable(t))) -
          Number(!turnusyMesta.some((t) => t.taborIds.includes(b.id) && isBookable(t)))
      )
      .map((tabor) => ({
        tabor,
        turnusy: turnusyMesta.filter((t) => t.taborIds.includes(tabor.id)),
      }))
  )
}

export function TaboryPodleMest({ schema = false }: { schema?: boolean }) {
  const bloky = getCitiesWithTurnusy().map((id) => {
    const karty = kartyMesta(id)
    return {
      id,
      name: getCity(id).name,
      karty,
      obsah: (
        <div className={`tabory${karty.length === 1 ? ' jedna' : ''}`}>
          {karty.map((k) => (
            <TaborKarta key={k.tabor.id} tabor={k.tabor} mesto={id} stitekMesta={false} turnusy={k.turnusy} />
          ))}
        </div>
      ),
    }
  })
  const turnusy: Turnus[] = bloky.flatMap((b) => b.karty.flatMap((k) => k.turnusy))

  if (bloky.length === 0) return null

  return (
    <>
      {schema && <EventSchema turnusy={turnusy} />}
      {/* `FiltrMest` čte `?mesto=` z adresy, proto Suspense. Záložní podoba je
          celý výpis bez filtru — stejný obsah, jen bez čipů. */}
      <Suspense
        fallback={bloky.map((b) => (
          <div className="mesto" key={b.id}>
            <h2>{b.name}</h2>
            {b.obsah}
          </div>
        ))}
      >
        <FiltrMest mesta={bloky.map(({ id, name, obsah }) => ({ id, name, obsah }))} />
      </Suspense>
    </>
  )
}
