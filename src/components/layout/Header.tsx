'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight } from 'lucide-react'
import { trackNavCTA } from '@/lib/analytics'
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-gray-900/50 backdrop-blur-sm'
        }`}
      >
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
              className="w-11 h-11 object-contain"
              priority
              aria-hidden="true"
            />
          </motion.div>
          <span className={`text-xl font-display font-bold tracking-tight transition-colors ${
            scrolled ? 'text-gray-900 group-hover:text-primary-600' : 'text-white group-hover:text-primary-300'
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
              className={`relative px-4 py-2 font-medium transition-colors group ${
                scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white'
              }`}
            >
              {item.name}
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 group-hover:w-2/3 transition-all duration-300 ${
                scrolled ? 'bg-primary-500' : 'bg-white'
              }`} />
            </Link>
          ))}
          <CitySwitcher />
          <Link
            href={ctaHref}
            className="ml-4 btn-primary group"
            onClick={() => trackNavCTA('desktop')}
          >
            Vybrat termín
            <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? (
            <X className={`h-6 w-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} aria-hidden="true" />
          ) : (
            <Menu className={`h-6 w-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} aria-hidden="true" />
          )}
        </motion.button>
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
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="section-container py-4 space-y-1">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium rounded-lg transition-colors"
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
                className="pt-2 flex flex-col gap-2"
              >
                <div className="flex justify-center">
                  <CitySwitcher />
                </div>
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
