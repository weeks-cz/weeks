import Image from 'next/image'
import { Instagram } from 'lucide-react'
import { INSTAGRAM_POSTY } from '@/lib/instagram'
import { SOCIALNI_SITE } from '@/lib/site'

/**
 * Pás s Instagram posty nad závěrečnou výzvou úvodky. Fotky jsou uložené na
 * webu (`src/lib/instagram.ts`), žádný skript Instagramu se nenačítá — proto
 * pás nepotřebuje souhlas s cookies. Prázdný seznam = pás se nevykreslí.
 */
export function InstagramPas() {
  const instagram = SOCIALNI_SITE.find((s) => s.id === 'instagram')
  if (INSTAGRAM_POSTY.length === 0 || !instagram) return null

  return (
    <section aria-labelledby="instagram-nadpis" className="border-b border-ink/15 bg-paper py-16">
      <div className="section-container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label mb-3">Instagram</p>
            <h2 id="instagram-nadpis" className="heading-3 text-ink">
              Z táborů na <span className="text-accent-600">@weeks.cz</span>
            </h2>
          </div>
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline self-start sm:self-auto"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            Sledovat
          </a>
        </div>

        {/* Mřížka podle počtu postů, ať řada nekončí prázdnými políčky. */}
        <ul
          className={
            INSTAGRAM_POSTY.length >= 6
              ? 'grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6'
              : 'grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3'
          }
        >
          {INSTAGRAM_POSTY.slice(0, INSTAGRAM_POSTY.length >= 6 ? 6 : 4).map((p) => (
            <li key={p.id}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-sm border border-ink/15"
              >
                <Image
                  src={p.obrazek}
                  alt={p.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="sr-only">(otevře post na Instagramu)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
