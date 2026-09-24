import { Facebook, Instagram } from 'lucide-react'
import { SOCIALNI_SITE } from '@/lib/site'
import { cn } from '@/lib/utils'

const IKONY = { instagram: Instagram, facebook: Facebook } as const

/**
 * Ikony sociálních sítí ze `SOCIALNI_SITE`. Používá se na víc místech
 * (patička, /kontakt, O nás), proto jedna komponenta a jeden seznam adres.
 */
export function SocialniSite({ tmave = false, className }: { tmave?: boolean; className?: string }) {
  return (
    <ul className={cn('flex gap-3', className)}>
      {SOCIALNI_SITE.map((s) => {
        const Ikona = IKONY[s.id]
        return (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Weeks ${s.naSiti} (otevře se v nové záložce)`}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-sm border transition-colors',
                tmave
                  ? 'border-paper/20 text-paper/70 hover:border-paper/50 hover:text-paper'
                  : 'border-ink/15 text-ink-500 hover:border-primary-600 hover:text-primary-600'
              )}
            >
              <Ikona className="h-5 w-5" aria-hidden="true" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
