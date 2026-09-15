const items = [
  '3D tisk',
  'IoT & elektronika',
  'Virtuální realita',
  'Programování',
  '3D modelování',
  'Vývoj her',
  'Tvorba webu',
  'Léto 2026',
  'Praha & Karlovy Vary',
]

function TickerRow() {
  return (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-5">{item}</span>
          <span className="text-cta-500">·</span>
        </span>
      ))}
    </span>
  )
}

// Dekorativní nekonečný pás — čistě CSS animace (viz .ticker-track v globals.css),
// při prefers-reduced-motion stojí. Pro čtečky skrytý (obsah je jinde na stránce).
export function TickerStrip() {
  return (
    <div className="bg-ink text-paper/80 overflow-hidden py-2.5 border-b border-ink" aria-hidden="true">
      <div className="ticker-track flex whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em]">
        <TickerRow />
        <TickerRow />
      </div>
    </div>
  )
}
