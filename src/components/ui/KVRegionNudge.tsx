'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const DISMISS_KEY = 'kv-nudge-dismissed'

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
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!pathname || !isEligiblePath(pathname)) return
    if (localStorage.getItem(DISMISS_KEY)) return

    let cancelled = false

    const maybeShow = () => {
      fetch('/api/geo')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!cancelled && data?.isKarlovarsko) setShow(true)
        })
        .catch(() => {})
    }

    // Nezobrazovat přes cookie lištu — počkat, až je souhlas vyřešen,
    // ať se dole nepřekrývají dvě vyskakovací karty.
    if (localStorage.getItem('cookie-consent')) {
      maybeShow()
      return () => {
        cancelled = true
      }
    }

    const onConsent = () => {
      window.removeEventListener('cookie-consent-updated', onConsent)
      maybeShow()
    }
    window.addEventListener('cookie-consent-updated', onConsent)
    return () => {
      cancelled = true
      window.removeEventListener('cookie-consent-updated', onConsent)
    }
  }, [pathname])

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40"
          role="region"
          aria-label="Tábory v Karlových Varech"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-primary-100 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-primary-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Vypadá to, že jste z Karlovarska
                </p>
                <p className="text-sm text-gray-600 mb-3">
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
                className="shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Zavřít"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
