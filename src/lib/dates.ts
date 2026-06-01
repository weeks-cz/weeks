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
