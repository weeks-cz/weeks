/** Czech human label for a camp term, e.g. "1. 8. 2026 – 2. 8. 2026". */
export function formatTermLabel(start: string, end: string): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' })
  return start === end ? fmt(start) : `${fmt(start)} – ${fmt(end)}`
}

/** YYYY-MM-DD, server timezone. */
export function isoDate(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}

/** YYYY-MM-DD `days` from now. */
export function isoDatePlusDays(days: number, from = new Date()): string {
  return isoDate(new Date(from.getTime() + days * 86_400_000))
}

/**
 * YYYY-MM-DD podle pražského času. `isoDate` počítá v UTC, takže kolem půlnoci
 * ukazuje předchozí den — pro rozhodnutí „je termín doplatku za námi" se musí
 * používat tahle funkce.
 */
export function pragueIsoDate(d = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}
