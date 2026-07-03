'use client'

import { useState, useEffect } from 'react'
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
  const [scrolled, setScrolled] = useState(false)
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fullscreen mobilní menu: zamknout scroll stránky, dokud je otevřené.
  useEffect(() => {
    if (!mobileMenuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          mobileMenuOpen
            ? 'bg-ink border-paper/20'
            : 'bg-paper/95 backdrop-blur-md border-ink/15'
        }`}
      >
        <nav
          className={`section-container relative z-10 flex items-center justify-between transition-all duration-300 ${
            scrolled && !mobileMenuOpen ? 'py-2.5' : 'py-4'
          }`}
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
          <span className={`text-xl font-display font-bold tracking-tight transition-colors ${
            mobileMenuOpen ? 'text-paper' : 'text-ink group-hover:text-primary-600'
          }`}>
            Weeks
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative px-4 py-2 font-medium text-ink/70 hover:text-ink transition-colors group"
            >
              {item.name}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cta-500 group-hover:w-2/3 transition-all duration-300" />
            </Link>
          ))}
          <a
            href="https://iot.weeks.cz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Učebna — výuková platforma (otevře se v nové záložce)"
            onClick={() => trackUcebnaClick('desktop')}
            className="ml-2 flex items-center text-sm text-ink/50 hover:text-ink transition-colors"
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
            className={`shrink-0 p-2 rounded-md transition-colors ${
              mobileMenuOpen ? 'hover:bg-paper/10' : 'hover:bg-ink/5'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-paper" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6 text-ink" aria-hidden="true" />
            )}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Navigation — fullscreen ink overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-ink text-paper blueprint-grid-dark overflow-y-auto"
          >
            <div className="section-container flex min-h-full flex-col justify-between pt-28 pb-10">
              <div className="space-y-2">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="block py-2 font-display text-4xl font-bold tracking-tight text-paper hover:text-cta-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navigation.length * 0.05 }}
                  className="border-t border-paper/20 pt-4 mt-6"
                >
                  <a
                    href="https://iot.weeks.cz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Učebna — výuková platforma (otevře se v nové záložce)"
                    onClick={() => { trackUcebnaClick('mobile'); setMobileMenuOpen(false) }}
                    className="inline-flex items-center py-2 text-paper/60 hover:text-paper transition-colors"
                  >
                    Učebna
                    <ExternalLink className="w-4 h-4 ml-1.5" aria-hidden="true" />
                  </a>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navigation.length + 1) * 0.05 }}
                className="space-y-6"
              >
                <Link
                  href={ctaHref}
                  className="btn-primary w-full text-center justify-center"
                  onClick={() => { trackNavCTA('mobile'); setMobileMenuOpen(false) }}
                >
                  Vybrat termín
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
                <p className="mono-label-dark">
                  WEEKS — IT TÁBORY · PRAHA &amp; KARLOVY VARY
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </>
  )
}
