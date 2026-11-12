'use client'

import { useEffect, useRef } from 'react'

/**
 * Mřížka, která se rozsvěcí. Vkládá se jako první potomek tmavé sekce
 * s třídou `mrizka`: na počítači svítí buňky pod kurzorem a kurzor sleduje
 * záře; bez kurzoru (dotyk, nebo než myš do sekce vjede) po mřížce běží
 * „signál“.
 *
 * Je to ozdoba, ne obsah: při omezeném pohybu se nespustí vůbec, mimo
 * obrazovku a ve skryté záložce stojí a po odchodu ze stránky po sobě uklidí
 * časovač i posluchače.
 */
const BUNKA = 32
const NEJVIC_BUNEK = 28

export function Mrizka() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const vrstva = ref.current
    const sekce = vrstva?.parentElement
    if (!vrstva || !sekce) return
    if (!window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const zare = vrstva.querySelector<HTMLElement>('.mrizka-zare')
    const maKurzor = window.matchMedia('(pointer: fine)').matches
    let posledni = ''
    let pocet = 0

    const rozsvit = (cx: number, cy: number, trida = '') => {
      const klic = `${cx}:${cy}`
      if (klic === posledni || pocet > NEJVIC_BUNEK) return
      posledni = klic
      const b = document.createElement('span')
      b.className = `mrizka-bunka ${trida}`
      b.style.left = `${cx * BUNKA}px`
      b.style.top = `${cy * BUNKA}px`
      pocet += 1
      b.addEventListener('animationend', () => {
        b.remove()
        pocet -= 1
      })
      vrstva.append(b)
    }

    // Signál: náhodná procházka po buňkách, drží směr a občas zahne.
    let sx = 2
    let sy = 2
    let dx = 1
    let dy = 0
    let casovac: ReturnType<typeof setInterval> | null = null
    let videt = false
    let mysUvnitr = false

    const krok = () => {
      const sloupcu = Math.floor(sekce.clientWidth / BUNKA)
      const radku = Math.floor(sekce.clientHeight / BUNKA)
      if (Math.random() < 0.28) {
        const n = Math.random() < 0.5 ? 1 : -1
        if (dx) {
          dx = 0
          dy = n
        } else {
          dy = 0
          dx = n
        }
      }
      if (sx + dx < 0 || sx + dx >= sloupcu) dx = -dx
      if (sy + dy < 0 || sy + dy >= radku) dy = -dy
      sx = Math.max(0, Math.min(sloupcu - 1, sx + dx))
      sy = Math.max(0, Math.min(radku - 1, sy + dy))
      rozsvit(sx, sy, 'signal')
    }

    const ridSignal = () => {
      const ma = videt && !mysUvnitr && !document.hidden
      if (ma && !casovac) casovac = setInterval(krok, 150)
      if (!ma && casovac) {
        clearInterval(casovac)
        casovac = null
      }
    }

    const pozorovatel = new IntersectionObserver((zaznamy) => {
      videt = zaznamy[0].isIntersecting
      ridSignal()
    })
    pozorovatel.observe(sekce)
    document.addEventListener('visibilitychange', ridSignal)

    const pohyb = (e: PointerEvent) => {
      const r = sekce.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (zare) {
        zare.style.transform = `translate(${x - 112}px, ${y - 112}px)`
        zare.style.opacity = '1'
      }
      rozsvit(Math.floor(x / BUNKA), Math.floor(y / BUNKA))
      if (!mysUvnitr) {
        mysUvnitr = true
        ridSignal()
      }
    }
    const odchod = () => {
      if (zare) zare.style.opacity = '0'
      mysUvnitr = false
      sx = Math.floor(Math.random() * 20)
      ridSignal()
    }
    if (maKurzor) {
      sekce.addEventListener('pointermove', pohyb)
      sekce.addEventListener('pointerleave', odchod)
    }

    return () => {
      if (casovac) clearInterval(casovac)
      pozorovatel.disconnect()
      document.removeEventListener('visibilitychange', ridSignal)
      sekce.removeEventListener('pointermove', pohyb)
      sekce.removeEventListener('pointerleave', odchod)
      vrstva.querySelectorAll('.mrizka-bunka').forEach((b) => b.remove())
    }
  }, [])

  return (
    <div className="mrizka-vrstva" aria-hidden="true" ref={ref}>
      <div className="mrizka-zare" />
    </div>
  )
}
