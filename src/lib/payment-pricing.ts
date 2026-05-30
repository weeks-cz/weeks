import { getLocationById } from './locations'

/**
 * Trusted price source for payments. Resolves price from server-side location
 * config keyed by program id — NEVER from a client-supplied amount.
 */
export function getTrustedPriceKc(locationId: string, program: string): number {
  const location = getLocationById(locationId)
  const cfg = location.programs.find((p) => p.id === program)
  if (!cfg) {
    throw new Error(`No trusted price for location=${locationId} program=${program}`)
  }
  return cfg.price
}
