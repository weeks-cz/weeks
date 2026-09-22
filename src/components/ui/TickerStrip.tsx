import { getTurnusy } from '@/lib/turnusy'

const BASE_ITEMS = [
  '3D tisk',
  'IoT & elektronika',
  'Programování',
  '3D modelování',
  'Vývoj her',
  'Tvorba webu',
]

/**
 * Sezónní položka se bere z nejbližšího turnusu s potvrzeným termínem, ne
 * natvrdo — jinak ticker dřív nebo později hlásí sezónu, která už proběhla.
 * Dokud žádný turnus potvrzené datum nemá (dnešní stav — oba jsou
 * „chystáme"), sezóna se v pásu vůbec nezmiňuje, aby web nesliboval rok,
 * který není v datech.
 */
function sezonniPolozka(): string | null {
  const turnus = getTurnusy().find((t) => t.start !== null)
  if (!turnus?.start) return null
  const rok = new Date(`${turnus.start}T12:00:00`).getFullYear()
  return `Léto ${rok}`
}

function TickerRow({ items }: { items: string[] }) {
  return (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-5">{item}</span>
          <span className="text-ink/40">·</span>
        </span>
      ))}
    </span>
  )
}

/**
 * Dekorativní nekonečný pás — čistě CSS animace (viz .ticker-track
 * v globals.css), při prefers-reduced-motion stojí. Pro čtečky skrytý (obsah
 * je jinde na stránce).
 *
 * Amber, protože v paletě drží roli „akce a stav" — hned pod tmavým herem
 * je to zároveň předěl, který dvě sousední sekce oddělí barvou.
 */
export function TickerStrip() {
  const sezona = sezonniPolozka()
  const items = [...BASE_ITEMS, ...(sezona ? [sezona] : []), 'Praha & Karlovy Vary']

  return (
    <div className="overflow-hidden border-y border-ink bg-cta-400 py-2.5 text-ink" aria-hidden="true">
      <div className="ticker-track flex whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-[0.25em]">
        <TickerRow items={items} />
        <TickerRow items={items} />
      </div>
    </div>
  )
}
