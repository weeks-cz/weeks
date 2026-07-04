'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight, ExternalLink } from 'lucide-react'
import { trackNavCTA, trackUcebnaClick } from '@/lib/analytics'
import { CitySwitcher } from '@/components/ui/CitySwitcher'
import { useLocation } from '@/contexts/LocationContext'
import { buildPath } from '@/lib/locations'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = location.isDefault
    ? [
        { name: 'Program', href: '/program' },
        { name: 'E-shop', href: '/eshop' },
        { name: 'Proč Weeks', href: '/#proc-weeks' },
        { name: 'O nás', href: '/o-nas' },
        { name: 'Kontakt', href: '/kontakt' },
      ]
    : [
        { name: 'Program', href: `/${location.slug}#program` },
        { name: 'Proč Weeks', href: `/${location.slug}#proc-weeks` },
        { name: 'O nás', href: buildPath(location, 'o-nas') },
        { name: 'Kontakt', href: buildPath(location, 'kontakt') },
      ]

  const logoHref = buildPath(location, '')
  const ctaHref = location.isDefault ? '/#prihlasit' : '#prihlasit'

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      >
        <nav
          className="glass rounded-full mt-4 mx-4 px-6 py-4 flex items-center justify-between pointer-events-auto w-full max-w-7xl"
          aria-label="Hlavní navigace"
        >
        {/* Logo */}
        <Link href={logoHref} className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Image
              src="/images/weeks-logo.png"
              alt=""
              width={44}
              height={44}
              className="w-11 h-11 object-contain"
              priority
              aria-hidden="true"
            />
          </motion.div>
          <span className="text-xl font-display font-bold tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
            Weeks
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative px-4 py-2 font-medium text-slate-600 hover:text-slate-900 transition-colors group"
            >
              {item.name}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary-500 group-hover:w-2/3 transition-all duration-300" />
            </Link>
          ))}
          <a
            href="https://iot.weeks.cz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Učebna — výuková platforma (otevře se v nové záložce)"
            onClick={() => trackUcebnaClick('desktop')}
            className="ml-2 flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Učebna
            <ExternalLink className="w-3 h-3 ml-1" aria-hidden="true" />
          </a>
          <div className="ml-3">
            <CitySwitcher />
          </div>
          <Link
            href={ctaHref}
            className="ml-4 btn-primary group"
            onClick={() => trackNavCTA('desktop')}
          >
            Vybrat termín
            <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile: city switcher (always visible) + menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <CitySwitcher compact />
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            className="shrink-0 p-2 rounded-lg hover:bg-primary-50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-900" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6 text-slate-900" aria-hidden="true" />
            )}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-cream/95 backdrop-blur-xl border-b border-slate-200 overflow-hidden mt-24"
          >
            <div className="section-container py-8 space-y-2">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-4 font-display text-4xl text-slate-900 hover:text-primary-600 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navigation.length * 0.05 }}
                className="border-t border-slate-200 pt-4 mt-4"
              >
                <a
                  href="https://iot.weeks.cz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Učebna — výuková platforma (otevře se v nové záložce)"
                  onClick={() => { trackUcebnaClick('mobile'); setMobileMenuOpen(false) }}
                  className="flex items-center px-4 py-3 text-sm text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
                >
                  Učebna
                  <ExternalLink className="w-3 h-3 ml-1.5" aria-hidden="true" />
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navigation.length + 1) * 0.05 }}
                className="pt-4 flex flex-col gap-2"
              >
                <Link
                  href={ctaHref}
                  className="btn-primary w-full text-center justify-center"
                  onClick={() => { trackNavCTA('mobile'); setMobileMenuOpen(false) }}
                >
                  Vybrat termín
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </>
  )
}
