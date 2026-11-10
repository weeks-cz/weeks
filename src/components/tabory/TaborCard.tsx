'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MapPin, Star } from 'lucide-react'
import { getFocusModules } from '@/lib/focus'
import { GOOGLE_PROFIL, maRecenze } from '@/lib/recenze'
import { getVenue, type CityId, type VenueId } from '@/lib/cities'
import type { Tabor } from '@/lib/tabory'
import { isBookable, type Turnus } from '@/lib/turnusy'
import { useTermCapacity, volnaMistaText } from '@/components/turnusy/SpotsLeft'
import { datumKratce, turnusLabels } from '@/components/turnusy/turnus-labels'

/**
 * Karta tématu — základní dlaždice výpisu `/tabory`.
 *
 * Nese téma, technologie, a pod tím termíny, které to téma v daném městě má.
 * Rodič vybírá v pořadí město → téma → termín, takže seznam turnusů je až
 * uvnitř karty tématu, ne vedle ní.
 *
 * Termíny jsou klikací štítky se stavem míst — stejné jako přepínač termínů
 * v nákupním boxu stránky termínu (`NakupniBox`), ať rodič pozná, že je to
 * tatáž volba. Stav míst je živý (`/api/term-capacity`) a řídí se stejným
 * pravidlem jako všude jinde: počet až od deseti volných míst níž.
 *
 * Barvy drží role: cyan (`accent`) = technologie, amber (`cta`) = stav a akce.
 *
 * Celá karta je odkaz na tábor (neviditelný odkaz přes celou kartu);
 * štítky termínů leží nad ním (`relative z-10`) a vedou na svůj termín.
 * Místo konání stojí v kartě u termínů, ne jako samostatná dlaždice města —
 * v Praze má každý tábor jiné místo (2026-11-10).
 */
export function TaborCard({
  tabor,
  mesto,
  turnusy = [],
  index = 0,
}: {
  tabor: Tabor
  /** Město, v jehož sekci karta stojí — vybírá fotku z `tabor.fotoMesta`. */
  mesto?: CityId
  /** Turnusy tohohle tématu — už zúžené na město, ve kterém karta stojí. */
  turnusy?: Turnus[]
  /** Pořadí v mřížce, jen kvůli odstupňovanému náběhu animace. */
  index?: number
}) {
  const reduced = useReducedMotion()
  const chystame = tabor.status === 'chystame'
  const technologie = getFocusModules(tabor.focus).map((m) => m.name)
  const capacity = useTermCapacity(turnusy[0]?.city)
  const foto = (mesto && tabor.fotoMesta?.[mesto]) || tabor.foto
  const mista = Array.from(
    new Set(turnusy.map((t) => t.venueId).filter((id): id is VenueId => id !== null)),
  ).map((id) => getVenue(id))

  const anim = reduced
    ? {}
    : {
        initial: { y: 18 },
        whileInView: { y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.45, delay: index * 0.06 },
      }

  return (
    <motion.article {...anim} className="card-maker flex flex-col overflow-hidden">
      {foto ? (
        <div className="relative aspect-[16/9] border-b border-ink/15">
          <Image
            src={foto.src}
            alt={foto.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-1.5 bg-accent-400" aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col p-7">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-bold tracking-tight text-ink">{tabor.shortName}</h3>
          {chystame && (
            <span className="shrink-0 rounded-sm border border-ink bg-cta-300 px-2.5 py-1 text-xs font-semibold text-ink">
              Chystáme
            </span>
          )}
        </div>

        {!chystame && maRecenze() && (
          <p className="mb-3 flex items-center gap-1.5 text-sm text-ink-500">
            <Star className="h-4 w-4 fill-cta-400 text-cta-400" aria-hidden="true" />
            <strong className="text-ink">{GOOGLE_PROFIL.prumer}</strong> · {GOOGLE_PROFIL.pocet} hodnocení na Google
          </p>
        )}

        {technologie.length > 0 && (
          <p className="mb-4 text-sm font-medium text-accent-700">{technologie.join(' · ')}</p>
        )}

        <p className="mb-6 text-ink-500">{tabor.perex}</p>

        {turnusy.length > 0 ? (
          <div className="mb-7 border-t border-ink/15 pt-5">
            <p className="mb-3 text-sm font-medium text-ink">Termíny</p>
            <ul className="flex flex-wrap gap-2">
              {turnusy.map((turnus) => {
                const l = turnusLabels(turnus)
                const prodejny = isBookable(turnus)
                const volno = capacity?.[turnus.id]?.spotsLeft
                const pozn = volno !== undefined ? volnaMistaText(volno) : null
                return (
                  <li key={turnus.id}>
                    <Link
                      href={`/tabory/termin/${turnus.slug}`}
                      className={`relative z-10 flex min-h-11 bg-white flex-col justify-center rounded-md border-2 px-4 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        prodejny ? 'border-ink/20 hover:border-ink' : 'border-dashed border-ink/20 hover:border-ink/50'
                      }`}
                    >
                      <span className="font-display font-semibold text-ink">
                        {turnus.start && turnus.end ? datumKratce(turnus.start, turnus.end) : 'Termín upřesníme'}
                      </span>
                      <span className={`text-xs ${pozn ? 'font-medium text-cta-700' : 'text-ink-500'}`}>
                        {pozn ?? (l.cena || l.stav)}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <p className="mt-4 flex items-start gap-2 text-sm text-ink-500">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
              {mista.length > 0
                ? mista.map((v) => `${v.name}, ${v.city}`).join(' · ')
                : 'Místo konání upřesníme'}
            </p>
          </div>
        ) : (
          <p className="mb-7 border-t border-ink/15 pt-5 text-sm text-ink-500">
            {chystame ? 'Zatím bez termínu' : 'Termíny upřesníme'}
          </p>
        )}

        <Link href={`/tabory/${tabor.id}`} className="btn-primary group relative z-10 mt-auto w-full">
          {chystame ? 'Chci vědět víc' : 'Zobrazit tábor'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>

      {/* Proklik celou kartou: neviditelný odkaz přes celou plochu, až za
          obsahem, aby ležel nad fotkou i textem. Štítky termínů a tlačítko
          jsou nad ním (`z-10`). Pro čtečku a klávesnici je skrytý — tam
          stačí tlačítko „Zobrazit tábor“. */}
      <Link
        href={`/tabory/${tabor.id}`}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 z-[1]"
      />
    </motion.article>
  )
}
