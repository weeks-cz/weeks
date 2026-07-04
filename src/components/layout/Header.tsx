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
import { MagneticButton } from '@/components/effects/MagneticButton'

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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-night/80 backdrop-blur-md border-b border-white/10">
        <nav className="section-container flex items-center justify-between py-4" aria-label="Hlavní navigace">
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
              className="w-11 h-11 object-contain brightness-0 invert"
              priority
              aria-hidden="true"
            />
          </motion.div>
          <span className="text-xl font-display font-bold tracking-tight text-white group-hover:text-accent-400 transition-colors">
            Weeks
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative px-4 py-2 font-medium text-slate-300 hover:text-white transition-colors group"
            >
              {item.name}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 group-hover:w-2/3 transition-all duration-300 decoration-accent-400 underline-offset-8 decoration-2" style={{
                backgroundColor: 'var(--accent-400, rgb(34, 211, 238))'
              }} />
            </Link>
          ))}
          <a
            href="https://iot.weeks.cz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Učebna — výuková platforma (otevře se v nové záložce)"
            onClick={() => trackUcebnaClick('desktop')}
            className="ml-2 flex items-center text-sm text-slate-400 hover:text-accent-400 transition-colors"
          >
            Učebna
            <ExternalLink className="w-3 h-3 ml-1" aria-hidden="true" />
          </a>
          <div className="ml-3">
            <CitySwitcher />
          </div>
          <MagneticButton>
            <Link
              href={ctaHref}
              className="ml-4 btn-primary group"
              onClick={() => trackNavCTA('desktop')}
            >
              Vybrat termín
              <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </MagneticButton>
        </div>

        {/* Mobile: city switcher (always visible) + menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <CitySwitcher compact />
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            className="shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6 text-white" aria-hidden="true" />
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
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[calc(var(--header-height,60px))] md:hidden bg-night overflow-y-auto"
          >
            <div className="section-container py-12 space-y-6 flex flex-col h-full">
              <nav className="space-y-6 flex-1">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="block text-4xl font-display font-bold text-white hover:text-accent-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navigation.length * 0.05 }}
                className="border-t border-white/10 pt-6 space-y-6"
              >
                <a
                  href="https://iot.weeks.cz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Učebna — výuková platforma (otevře se v nové záložce)"
                  onClick={() => { trackUcebnaClick('mobile'); setMobileMenuOpen(false) }}
                  className="flex items-center text-slate-400 hover:text-accent-400 transition-colors"
                >
                  Učebna
                  <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
                </a>

                <Link
                  href={ctaHref}
                  className="block btn-primary w-full text-center"
                  onClick={() => { trackNavCTA('mobile'); setMobileMenuOpen(false) }}
                >
                  Vybrat termín
                </Link>
              </motion.div>

              <div className="border-t border-white/10 pt-6 pb-6">
                <p className="data-label text-accent-400 font-mono text-xs uppercase tracking-wider">WEEKS — IT TÁBORY · PRAHA & KARLOVY VARY</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </>
  )
}
