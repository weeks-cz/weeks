// Sklik (Seznam) měřicí kód. Jednotný skript c.seznam.cz/js/rc.js poskytuje
// window.rc s metodami retargetingHit (budování publika) a conversionHit
// (měření konverze). Obojí gateujeme marketingovým souhlasem stejně jako Meta
// Pixel — skript se načte jen se souhlasem, takže hity běží s consent: 1.
//
// Aktivace: založ v Skliku retargeting + konverzi (Nástroje → Měřicí kódy),
// zkopíruj číselná ID a vlož je do těchto env proměnných. Bez nich kód no-opuje.

export const SKLIK_RTG_ID = (process.env.NEXT_PUBLIC_SKLIK_RTG_ID || '').trim()
export const SKLIK_CONVERSION_ID = (process.env.NEXT_PUBLIC_SKLIK_CONVERSION_ID || '').trim()

declare global {
  interface Window {
    rc?: {
      retargetingHit: (conf: { rtgId: number; consent?: number }) => void
      conversionHit: (conf: { id: number; value?: number; consent?: number }) => void
    }
  }
}

/** Retargetingový zásah — voláme na každém zobrazení stránky (s marketing souhlasem). */
export function sklikRetargetingHit() {
  if (!SKLIK_RTG_ID) return
  if (typeof window === 'undefined' || typeof window.rc?.retargetingHit !== 'function') return
  window.rc.retargetingHit({ rtgId: Number(SKLIK_RTG_ID), consent: 1 })
}

/**
 * Konverzní zásah na stránce potvrzení zaplacené registrace. Protože se rc.js
 * načítá až po udělení souhlasu, může potvrzovací stránka přijít dřív než skript —
 * proto krátce počkáme (max ~5 s), než window.rc existuje. Bez souhlasu rc.js
 * vůbec není → funkce tiše skončí (konverzi tak měříme jen se souhlasem).
 */
export function sklikConversionHit(value?: number) {
  if (!SKLIK_CONVERSION_ID || typeof window === 'undefined') return
  let tries = 0
  const fire = () => {
    if (typeof window.rc?.conversionHit === 'function') {
      window.rc.conversionHit({ id: Number(SKLIK_CONVERSION_ID), value, consent: 1 })
      return
    }
    if (tries++ < 25) setTimeout(fire, 200)
  }
  fire()
}
