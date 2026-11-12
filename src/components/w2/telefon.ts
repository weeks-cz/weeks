'use client'

import { useEffect, useState } from 'react'
import { TELEFON_HODINY } from '@/lib/site'

const DNY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Je teď někdo u telefonu? Počítá se v pražském čase, ne v čase návštěvníka —
 * rodič na dovolené v jiném pásmu by jinak viděl zelenou tečku v noci.
 */
export function jeNaTelefonu(ted: Date): boolean {
  if (!TELEFON_HODINY) return false
  const casti = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Prague',
    weekday: 'short',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(ted)
  const den = DNY.indexOf(casti.find((c) => c.type === 'weekday')?.value ?? '')
  const hodina = Number(casti.find((c) => c.type === 'hour')?.value)
  return TELEFON_HODINY.dny.includes(den) && hodina >= TELEFON_HODINY.od && hodina < TELEFON_HODINY.do
}

/**
 * Stav telefonu pro kontakt s tváří (hlavička, karta u dotazů).
 *
 * Počítá se až v prohlížeči — server nezná čas návštěvníka a stránky jsou
 * statické, takže by ukazoval hodinu sestavení. Do té doby je tečka šedá.
 * S `TELEFON_HODINY = null` web o dostupnosti netvrdí nic a tečka se nekreslí
 * (`maHodiny`).
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
