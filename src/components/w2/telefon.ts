'use client'

import { useEffect, useState } from 'react'
import { TELEFON_HODINY } from '@/lib/site'

/** Je teď někdo u telefonu? Bez potvrzených hodin (`TELEFON_HODINY`) to web netvrdí. */
function jeNaTelefonu(ted: Date): boolean {
  if (!TELEFON_HODINY) return false
  const den = ted.getDay()
  const hodina = ted.getHours()
  return TELEFON_HODINY.dny.includes(den) && hodina >= TELEFON_HODINY.od && hodina < TELEFON_HODINY.do
}

/**
 * Stav telefonu pro kontakt s tváří (hlavička, karta u dotazů).
 *
 * Počítá se až v prohlížeči — server nezná čas návštěvníka a stránky jsou
 * statické, takže by ukazoval hodinu sestavení. Dokud tým hodiny nepotvrdí
 * (`TELEFON_HODINY` je `null`), web o dostupnosti netvrdí nic a zelená tečka
 * se nekreslí (`maHodiny`).
 */
export function useTelefonStav(): { online: boolean; text: string; maHodiny: boolean } {
  const [online, setOnline] = useState(false)

  useEffect(() => {
    if (!TELEFON_HODINY) return
    const prepocitej = () => setOnline(jeNaTelefonu(new Date()))
    prepocitej()
    const casovac = setInterval(prepocitej, 60_000)
    return () => clearInterval(casovac)
  }, [])

  const text = !TELEFON_HODINY ? 'Zavolejte nám' : online ? 'Jsme na telefonu' : 'Teď offline, ozveme se'
  return { online, text, maHodiny: TELEFON_HODINY !== null }
}
