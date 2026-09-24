'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from 'lucide-react'
import { GOOGLE_PROFIL, RECENZE, maRecenze } from '@/lib/recenze'

/**
 * Carousel Google recenzí. Bez knihovny: nativní `scroll-snap`, šipky jen
 * posouvají kontejner o šířku karty. Na mobilu jde táhnout prstem, na počítači
 * šipkami i kolečkem. Karty se neanimují — recenze je obsah, ne dekorace.
 *
 * Šipky se ukazují jen tehdy, když se karty nevejdou (na počítači se dvě
 * recenze vejdou vedle sebe a šipky by nedělaly nic), a na kraji pásu se
 * vypnou. Stav se přepočítává při scrollu i při změně šířky okna.
 *
 * Obsah je ručně v `src/lib/recenze.ts`; dokud tam nic není, sekce mlčí.
 */
export function GoogleRecenze() {
  const pas = useRef<HTMLUListElement>(null)
  const [muzeZpet, setMuzeZpet] = useState(false)
  const [muzeDal, setMuzeDal] = useState(false)

  useEffect(() => {
    const el = pas.current
    if (!el) return
    const prepocitej = () => {
      // Tolerance pár pixelů: zaokrouhlení u snap-scrollu nedojede přesně na konec.
      setMuzeZpet(el.scrollLeft > 4)
      setMuzeDal(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }
    prepocitej()
    el.addEventListener('scroll', prepocitej, { passive: true })
    // Sleduje pás i karty: na přechodu breakpointu se mění šířka karet,
    // ne nutně pásu.
    const ro = new ResizeObserver(prepocitej)
    ro.observe(el)
    el.querySelectorAll('li').forEach((li) => ro.observe(li))
    return () => {
      el.removeEventListener('scroll', prepocitej)
      ro.disconnect()
    }
  }, [])

  if (!maRecenze() || !GOOGLE_PROFIL.url) return null

  const posun = (smer: 1 | -1) => {
    const el = pas.current
    if (!el) return
    const karta = el.querySelector('li')
    const krok = karta ? karta.getBoundingClientRect().width + 24 : el.clientWidth
    el.scrollBy({ left: smer * krok, behavior: 'smooth' })
  }

  const tlacitko =
    'flex h-11 w-11 items-center justify-center rounded-sm border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30'

  return (
    <section
      id="recenze"
      aria-labelledby="recenze-nadpis"
      className="section-padding border-y border-ink/15 bg-paper"
    >
      <div className="section-container">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mono-label mb-4">Recenze na Google</p>
            <h2 id="recenze-nadpis" className="heading-2 text-ink">
              Co říkají <span className="text-primary-600">rodiče</span>
            </h2>
            <p className="mt-3 flex items-center gap-2 text-ink-500">
              <Star className="h-5 w-5 fill-cta-400 text-cta-400" aria-hidden="true" />
              <span>
                <strong className="text-ink">{GOOGLE_PROFIL.prumer}</strong> z 5 · {GOOGLE_PROFIL.pocet}{' '}
                hodnocení na Google
              </span>
            </p>
          </div>

          {(muzeZpet || muzeDal) && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => posun(-1)}
                disabled={!muzeZpet}
                aria-label="Předchozí recenze"
                className={tlacitko}
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => posun(1)}
                disabled={!muzeDal}
                aria-label="Další recenze"
                className={tlacitko}
              >
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <ul
          ref={pas}
          className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:thin]"
        >
          {RECENZE.map((r) => (
            <li
              key={r.id}
              className="card-maker flex w-[85%] shrink-0 snap-start flex-col p-7 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <div className="mb-4 flex gap-0.5" role="img" aria-label={`Hodnocení ${r.hvezdicky} z 5 hvězdiček`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    aria-hidden="true"
                    className={n <= r.hvezdicky ? 'h-5 w-5 fill-cta-400 text-cta-400' : 'h-5 w-5 text-ink/20'}
                  />
                ))}
              </div>
              {r.text ? (
                <blockquote className="flex-1 text-ink-500">„{r.text}“</blockquote>
              ) : (
                <p className="flex-1 font-mono text-xs text-ink/50">Hodnocení bez komentáře</p>
              )}
              <p className="mt-6 font-display font-semibold text-ink">
                {r.autor}
                {r.kdy && <span className="ml-2 font-mono text-xs font-normal text-ink/50">{r.kdy}</span>}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          <a
            href={GOOGLE_PROFIL.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-sm text-primary-600 hover:underline"
          >
            Všechny recenze na Google
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          {GOOGLE_PROFIL.napsatRecenziUrl && (
            <a
              href={GOOGLE_PROFIL.napsatRecenziUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-sm text-ink-500 hover:text-primary-600 hover:underline"
            >
              Napsat recenzi
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>

        {/* Zákon o ochraně spotřebitele (§ 4 odst. 5): kdo zpřístupňuje
            recenze, musí říct, zda a jak ověřuje, že jsou od zákazníků. */}
        <p className="mt-4 text-xs text-ink/50">
          Recenze přebíráme beze změny z Google. Neověřujeme, zda jejich autoři tábor navštívili.
        </p>
      </div>
    </section>
  )
}
