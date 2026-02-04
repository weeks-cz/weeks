'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import Link from 'next/link'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Small delay to not show immediately on page load
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all')
    setIsVisible(false)
    // Here you would initialize analytics if consent given
    // initGA4()
    // initFBPixel()
  }

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex w-12 h-12 shrink-0 rounded-xl bg-primary-100 items-center justify-center">
                  <Cookie className="w-6 h-6 text-primary-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Používáme cookies
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Tento web provozuje DDM Praha 6 a používá cookies pro zlepšení vašeho zážitku a analýzu návštěvnosti.
                    Kliknutím na &quot;Přijmout vše&quot; souhlasíte s použitím všech cookies.
                    Více informací najdete v našich{' '}
                    <Link href="/gdpr" className="text-primary-600 hover:underline">
                      zásadách ochrany osobních údajů
                    </Link>.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={acceptAll}
                      className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Přijmout vše
                    </button>
                    <button
                      onClick={acceptNecessary}
                      className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      Pouze nezbytné
                    </button>
                  </div>
                </div>

                <button
                  onClick={acceptNecessary}
                  className="shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Zavřít"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
