'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const DISMISS_KEY = 'kv-nudge-dismissed'

// 'card' = výrazná kartička pro návštěvníky z Karlovarska (geo).
// 'pill' = nenápadný odkaz vlevo dole pro všechny ostatní (i VPN / když geo selže).
type Mode = 'hidden' | 'pill' | 'card'

// Na kterých (pražských) stránkách smí nudge vyskočit. NE na KV, NE na reklamních /
// checkout stránkách, kde by rušil konverzi — jen na hlavních obsahových stránkách,
// kam zájemce o tábor reálně přistane.
function isEligiblePath(pathname: string): boolean {
  if (pathname.startsWith('/karlovy-vary')) return false
  const blocked = ['/kveten', '/duben', '/registrace', '/platba', '/studio', '/eshop', '/api']
  if (blocked.some((p) => pathname.startsWith(p))) return false
  return pathname === '/' || pathname.startsWith('/program') || pathname.startsWith('/tabor')
}

export function KVRegionNudge() {
  const pathname = usePathname()
  const [mode, setMode] = useState<Mode>('hidden')

  useEffect(() => {
    if (!pathname || !isEligiblePath(pathname)) return
    if (localStorage.getItem(DISMISS_KEY)) return

    let cancelled = false

    const decide = () => {
      fetch('/api/geo')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (cancelled) return
          // Karlovarsko → silná kartička; jinak jemný pill (fail-open).
          setMode(data?.isKarlovarsko ? 'card' : 'pill')
        })
        // VPN / ad-blocker /api/geo často zablokuje — i tak ukaž aspoň pill.
        .catch(() => {
          if (!cancelled) setMode('pill')
        })
    }

    // Nezobrazovat přes cookie lištu — počkat, až je souhlas vyřešen,
    // ať se dole nepřekrývají dvě vyskakovací karty.
    if (localStorage.getItem('cookie-consent')) {
      decide()
      return () => {
        cancelled = true
      }
    }

    const onConsent = () => {
      window.removeEventListener('cookie-consent-updated', onConsent)
      decide()
    }
    window.addEventListener('cookie-consent-updated', onConsent)
    return () => {
      cancelled = true
      window.removeEventListener('cookie-consent-updated', onConsent)
    }
  }, [pathname])

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setMode('hidden')
  }

  return (
    <AnimatePresence>
      {mode === 'card' && (
        <motion.div
          key="card"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40"
          role="region"
          aria-label="Tábory v Karlových Varech"
        >
          <div className="bg-white rounded-md shadow-hard border border-ink p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 shrink-0 rounded-sm bg-primary-600 border border-ink flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-semibold text-ink mb-1">
                  Vypadá to, že jste z Karlovarska
                </p>
                <p className="text-sm text-ink-500 mb-3">
                  Pořádáme IT tábory i v Karlových Varech — letní příměstské i víkendové.
                </p>
                <Link
                  href="/karlovy-vary"
                  onClick={dismiss}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Zobrazit tábory v KV
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <button
                onClick={dismiss}
                className="shrink-0 p-1.5 hover:bg-paper-soft rounded-md transition-colors"
                aria-label="Zavřít"
              >
                <X className="w-4 h-4 text-ink/40" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {mode === 'pill' && (
        <motion.div
          key="pill"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-2rem)]"
        >
          <div className="flex items-center gap-1 rounded-sm bg-white/95 backdrop-blur-sm border border-ink/20 shadow-hard-sm pl-3 pr-1.5 py-1.5">
            <Link
              href="/karlovy-vary"
              onClick={dismiss}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink-500 hover:text-primary-600 transition-colors min-w-0"
            >
              <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
              <span className="truncate">Tábory i v Karlových Varech</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
            <button
              onClick={dismiss}
              className="shrink-0 p-1 rounded-sm hover:bg-paper-soft transition-colors"
              aria-label="Zavřít"
            >
              <X className="w-3.5 h-3.5 text-ink/40" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
