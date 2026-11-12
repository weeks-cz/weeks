'use client'

import { useEffect, useState } from 'react'
import { TELEFON_HODINY, type TelefonHodiny } from '@/lib/site'

const DNY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Je teď někdo u telefonu? Počítá se v pražském čase, ne v čase návštěvníka —
 * rodič na dovolené v jiném pásmu by jinak viděl zelenou tečku v noci.
 */
export function jeNaTelefonu(ted: Date, hodiny: TelefonHodiny | null = TELEFON_HODINY): boolean {
  if (!hodiny) return false
  const casti = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Prague',
    weekday: 'short',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(ted)
  const den = DNY.indexOf(casti.find((c) => c.type === 'weekday')?.value ?? '')
  const hodina = Number(casti.find((c) => c.type === 'hour')?.value)
  return hodiny.dny.includes(den) && hodina >= hodiny.od && hodina < hodiny.do
}

/**
 * Stav telefonu pro kontakt s tváří (hlavička, karta u dotazů).
 *
 * Počítá se až v prohlížeči — server nezná čas návštěvníka a stránky jsou
 * statické, takže by ukazoval hodinu sestavení. Dokud se nespočítá, web
 * o dostupnosti netvrdí nic: text je „Zavolejte nám“ a tečka se nekreslí
 * (`maHodiny`). Dřív tu byl výchozí stav „offline“, takže serverové HTML
 * říkalo „Teď offline, ozveme se“ i v úterý v deset dopoledne — každému, komu
 * se skript nenačetl, a všem ostatním do první vteřiny.
 * Stejně se chová `TELEFON_HODINY = null`.
 */
export function useTelefonStav(): { online: boolean; text: string; maHodiny: boolean } {
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    if (!TELEFON_HODINY) return
    const prepocitej = () => setOnline(jeNaTelefonu(new Date()))
    prepocitej()
    const casovac = setInterval(prepocitej, 60_000)
    return () => clearInterval(casovac)
  }, [])

  const text = online === null ? 'Zavolejte nám' : online ? 'Jsme na telefonu' : 'Teď offline, ozveme se'
  return { online: online === true, text, maHodiny: online !== null }
}
