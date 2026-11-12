'use client'

import { useEffect, useRef } from 'react'
import { Ikona } from './Ikona'
import { sazba } from './text'

/**
 * Rozbalovací dotazy. Základ je čisté `<details>` se společným `name`:
 * otevřená je vždy jen jedna a funguje to i bez JavaScriptu a pro čtečky.
 *
 * Skript jen přidává plynulé rozbalení a sbalení (animace výšky). Text
 * odpovědi je v HTML od serveru celý — animace ho neschovává, jen mění výšku
 * už otevřeného prvku, takže když se nespustí, dotazy fungují dál.
 */
type Animovany = HTMLDetailsElement & { faqAnim?: Animation | null }

const KRIVKA = 'cubic-bezier(0.45, 0, 0.2, 1)'

export function Faq({ dotazy }: { dotazy: Array<{ question: string; answer: string }> }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const faq = ref.current
    if (!faq || typeof faq.animate !== 'function') return
    const klid = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const vse = Array.from(faq.querySelectorAll<Animovany>('details'))

    const animuj = (d: Animovany, z: number, na: number, trvani: number, hotovo?: () => void) => {
      d.faqAnim?.cancel()
      d.style.overflow = 'hidden'
      const anim = d.animate({ height: [`${z}px`, `${na}px`] }, { duration: klid ? 0 : trvani, easing: KRIVKA })
      d.faqAnim = anim
      anim.onfinish = () => {
        d.style.overflow = ''
        d.faqAnim = null
        hotovo?.()
      }
    }
    const otevri = (d: Animovany) => {
      const z = d.offsetHeight
      d.open = true
      const na = d.offsetHeight
      d.classList.add('je-otevrena')
      animuj(d, z, na, 620)
    }
    const zavri = (d: Animovany) => {
      const z = d.offsetHeight
      const s = d.querySelector('summary')
      if (!s) return
      const na = s.offsetHeight + (d.offsetHeight - d.clientHeight)
      d.classList.remove('je-otevrena')
      animuj(d, z, na, 520, () => {
        d.open = false
      })
    }

    faq.classList.add('faq-js')
    const uklid: Array<() => void> = []
    vse.forEach((d) => {
      // Bez `name`: sbalení ostatních si řídí skript, aby se stihlo animovat.
      d.removeAttribute('name')
      d.classList.toggle('je-otevrena', d.open)
      const s = d.querySelector('summary')
      if (!s) return
      const klik = (e: Event) => {
        e.preventDefault()
        if (d.classList.contains('je-otevrena')) {
          zavri(d)
          return
        }
        vse.filter((x) => x !== d && x.classList.contains('je-otevrena')).forEach(zavri)
        otevri(d)
      }
      s.addEventListener('click', klik)
      uklid.push(() => s.removeEventListener('click', klik))
    })

    return () => {
      uklid.forEach((f) => f())
      vse.forEach((d) => {
        d.faqAnim?.cancel()
        d.setAttribute('name', 'faq')
        d.classList.remove('je-otevrena')
      })
      faq.classList.remove('faq-js')
    }
  }, [])

  return (
    <div className="faq" ref={ref}>
      {dotazy.map((d) => (
        <details key={d.question} name="faq">
          <summary>
            {sazba(d.question)}{' '}
            <span className="faq-ik">
              <Ikona id="plus" />
            </span>
          </summary>
          <p>{sazba(d.answer)}</p>
        </details>
      ))}
    </div>
  )
}
