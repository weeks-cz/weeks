import { TaborKarta } from './TaborKarta'
import { EventSchema } from '@/components/seo/StructuredData'
import { getAktivniTabory } from '@/lib/tabory'
import { getTurnusyByTabor, isBookable } from '@/lib/turnusy'

/**
 * Karty táborů na úvodní stránce: běžící tábor × město, kde se na něj dá
 * přihlásit. Nejbližší termín první.
 *
 * Strukturovaná data úvodky (`EventSchema`) vykresluje tatáž komponenta, která
 * vykresluje karty, a ze stejné proměnné. Kdyby stála na stránce samostatně,
 * mohla by vypsat termín, který na ní není vidět — takhle se ty dva seznamy
 * nemají jak rozejít (hlídá `schema-turnusy.test.ts`).
 */
export function TaboryUvodu() {
  const karty = getAktivniTabory()
    .flatMap((tabor) => {
      const prodejne = getTurnusyByTabor(tabor.id).filter(isBookable)
      return [...new Set(prodejne.map((t) => t.city))].map((mesto) => ({
        tabor,
        mesto,
        turnusy: prodejne.filter((t) => t.city === mesto),
      }))
    })
    .sort((a, b) => (a.turnusy[0]?.start ?? '').localeCompare(b.turnusy[0]?.start ?? ''))
  const turnusy = karty.flatMap((k) => k.turnusy)

  if (karty.length === 0) return null

  return (
    <>
      <EventSchema turnusy={turnusy} />
      <div className={`tabory${karty.length === 1 ? ' jedna' : ''}`}>
        {karty.map((k) => (
          <TaborKarta key={`${k.tabor.id}-${k.mesto}`} tabor={k.tabor} mesto={k.mesto} turnusy={k.turnusy} />
        ))}
      </div>
    </>
  )
}
