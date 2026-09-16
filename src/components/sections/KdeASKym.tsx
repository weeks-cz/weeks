import { Users, ShieldCheck, Gauge, MapPin } from 'lucide-react'
import { getTurnusy } from '@/lib/turnusy'
import { getVenue, type VenueId } from '@/lib/cities'
import { SITE } from '@/lib/site'

/**
 * Náhrada za smazanou `TrustSection` s pruhem log partnerů (DDM, HWLab).
 * Ta smazaná sekce si důvěryhodnost půjčovala od cizích institucí — tahle
 * naopak ukazuje jen to, co Weeks samo umí doložit: kde tábory doopravdy
 * probíhaly, kdo je vede jménem a tři údaje, které jsou dnes pravdivé
 * (poměr lektor/dítě, proškolení v první pomoci, strop kapacity na turnus).
 * Schválně bez loga, bez slibu doby odpovědi a bez zmínky o pojištění —
 * pro žádné z toho dnes není podklad, který by web mohl tvrdit veřejně.
 *
 * Serverová komponenta — obsah je statický výtah z dat, žádná interaktivita
 * navíc tu není potřeba.
 */

/**
 * Jméno a role přesně podle `teamMembers` v `src/app/o-nas/page.tsx` (ř. 67).
 * Pole odtud nejde importovat, protože ho stránka neexportuje — hodnoty jsou
 * proto opsané. Při změně týmu na /o-nas je potřeba upravit i tady.
 */
const TYM = [
  { name: 'Kryštof Ježdík', role: 'VR & Herní vývoj' },
  { name: 'Lukáš Kubík', role: 'Web & Programování' },
  { name: 'Štěpán Jurenka', role: '3D modelování & Tisk' },
]

export function KdeASKym() {
  const turnusy = getTurnusy()

  // Místa konání — jen ta, která nějaký turnus doopravdy má. Dnes vyjde
  // jedna karta (FabLab VARY&TE u karlovarského turnusu), pražský turnus
  // místo ještě nemá. Kód počítá s tím, že se to může časem změnit.
  const venueIds = Array.from(
    new Set(turnusy.map((t) => t.venueId).filter((id): id is VenueId => id !== null))
  )
  const venues = venueIds.map((id) => getVenue(id))

  // Nejvyšší kapacita napříč turnusy — dnes vyjde 15 u obou, číslo se ale
  // nepíše natvrdo, aby se sekce sama nerozešla s daty.
  const kapacita = turnusy.reduce((max, t) => Math.max(max, t.capacity), 0)

  const udaje = [
    {
      icon: Users,
      title: 'Jeden lektor na pět dětí',
      text: 'Malá skupina, na každé dítě zbude čas.',
    },
    {
      icon: ShieldCheck,
      title: 'Proškolení v první pomoci',
      text: 'Lektoři jsou proškolení v první pomoci a s dětmi pracují dlouhodobě.',
    },
    {
      icon: Gauge,
      title: `Nejvýše ${kapacita} dětí v turnusu`,
      text: 'Kapacitu držíme malou schválně.',
    },
  ]

  return (
    <section className="section-padding bg-paper">
      <div className="section-container">
        <div className="max-w-3xl mb-12">
          <p className="mono-label mb-4">Ověřitelné, ne slibované.</p>
          <h2 className="heading-2 text-ink mb-4">Kde a s kým</h2>
        </div>

        {venues.length > 0 && (
          <div className="mb-12">
            <h3 className="mono-label mb-4">Místa konání</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {venues.map((venue) => (
                <div key={venue.id} className="card-maker p-6 flex gap-4">
                  <div
                    className="w-12 h-12 bg-white border border-ink/15 rounded-sm flex items-center justify-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-semibold text-ink mb-1">
                      {venue.name}
                    </h4>
                    <p className="text-ink-500 mb-2">{venue.description}</p>
                    <p className="text-sm text-ink-500">Tady tábory Weeks probíhaly.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-12">
          <h3 className="mono-label mb-4">Tým</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TYM.map((clen) => (
              <div key={clen.name} className="border-t border-ink/15 pt-4">
                <p className="font-display text-base font-semibold text-ink">{clen.name}</p>
                <p className="text-sm text-ink-500">{clen.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-ink/15 pt-8">
          {udaje.map((u) => (
            <div key={u.title} className="flex gap-4">
              <u.icon className="w-6 h-6 text-primary-600 shrink-0" aria-hidden="true" />
              <div>
                <h4 className="font-display text-base font-semibold text-ink mb-1">{u.title}</h4>
                <p className="text-sm text-ink-500">{u.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-ink/15 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm">
          <a href={`tel:${SITE.phone.replace(/\s+/g, '')}`} className="text-primary-600 hover:underline">
            {SITE.phone}
          </a>
          <a href={`mailto:${SITE.email}`} className="text-primary-600 hover:underline">
            {SITE.email}
          </a>
        </div>
      </div>
    </section>
  )
}
