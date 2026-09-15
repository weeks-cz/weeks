'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { setConsent, isConsentDecided, getConsent, CONSENT_REOPEN_EVENT } from '@/lib/consent'

function Toggle({
  checked, onChange, disabled, label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-primary-600' : 'bg-ink/20'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

function Category({
  title, description, checked, onChange, disabled,
}: {
  title: string
  description: string
  checked: boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-ink-500 mt-0.5">{description}</p>
      </div>
      <Toggle
        checked={checked}
        onChange={onChange ?? (() => {})}
        disabled={disabled}
        label={title}
      />
    </div>
  )
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  // Volitelné kategorie defaultně vypnuté — žádný předzaškrtnutý souhlas (EDPB).
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const pathname = usePathname()
  // Karlovy Vary má vlastní GDPR (provozovatel Lukáš Kubík); Praha používá /gdpr.
  const gdprHref = pathname?.startsWith('/karlovy-vary') ? '/karlovy-vary/gdpr' : '/gdpr'

  useEffect(() => {
    if (!isConsentDecided()) {
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Odkaz „Nastavení cookies" v patičce znovu otevře lištu s předvyplněnou aktuální volbou,
  // ať jde souhlas kdykoli změnit/odvolat (GDPR čl. 7(3)).
  useEffect(() => {
    const reopen = () => {
      const current = getConsent()
      setAnalytics(current?.analytics ?? false)
      setMarketing(current?.marketing ?? false)
      setShowSettings(true)
      setIsVisible(true)
    }
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen)
  }, [])

  const close = () => setIsVisible(false)
  const acceptAll = () => { setConsent({ analytics: true, marketing: true }); close() }
  const rejectAll = () => { setConsent({ analytics: false, marketing: false }); close() }
  const saveChoice = () => { setConsent({ analytics, marketing }); close() }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          role="dialog"
          aria-label="Nastavení cookies"
        >
          <div className="max-w-2xl mx-auto bg-white rounded-md shadow-hard border border-ink overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex w-12 h-12 shrink-0 rounded-sm bg-white border border-ink/15 items-center justify-center">
                  <Cookie className="w-6 h-6 text-primary-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">
                    Používáme cookies
                  </h3>
                  <p className="text-sm text-ink-500">
                    Nezbytné cookies web potřebuje k fungování. S vaším souhlasem využíváme
                    i analytické a marketingové cookies — pomáhají nám vylepšovat tábory
                    a ukazovat je rodičům, které by mohly zajímat. Více v{' '}
                    <Link href={gdprHref} className="text-primary-600 hover:underline">
                      zásadách ochrany osobních údajů
                    </Link>.
                  </p>

                  <AnimatePresence initial={false}>
                    {showSettings && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                          <Category
                            title="Nezbytné"
                            description="Nutné pro chod webu a zapamatování vašeho souhlasu. Nelze vypnout."
                            checked
                            disabled
                          />
                          <Category
                            title="Analytické"
                            description="Anonymní statistiky návštěvnosti (Google Analytics) — pomáhají nám web zlepšovat."
                            checked={analytics}
                            onChange={setAnalytics}
                          />
                          <Category
                            title="Marketingové"
                            description="Měření reklam (Meta Pixel), ať reklamu neukazujeme zbytečně těm, koho nezajímá."
                            checked={marketing}
                            onChange={setMarketing}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      onClick={acceptAll}
                      className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium border border-ink rounded-md transition-colors"
                    >
                      Přijmout vše
                    </button>
                    <button
                      onClick={rejectAll}
                      className="px-6 py-2.5 bg-white border border-ink/30 hover:bg-paper-soft text-ink font-medium rounded-md transition-colors"
                    >
                      Odmítnout vše
                    </button>
                    {showSettings ? (
                      <button
                        onClick={saveChoice}
                        className="px-6 py-2.5 bg-white border border-ink/30 hover:bg-paper-soft text-ink font-medium rounded-md transition-colors"
                      >
                        Uložit volbu
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-6 py-2.5 text-ink-500 hover:text-ink font-medium rounded-md transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        Nastavit
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={rejectAll}
                  className="shrink-0 p-2 hover:bg-paper-soft rounded-md transition-colors"
                  aria-label="Zavřít a odmítnout volitelné cookies"
                >
                  <X className="w-5 h-5 text-ink/40" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
