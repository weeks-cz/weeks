'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navigation = [
  { name: 'Program', href: '/program' },
  { name: 'Proč Weeks', href: '/#proc-weeks' },
  { name: 'O nás', href: '/o-nas' },
  { name: 'Kontakt', href: '/kontakt' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="section-container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gradient">Weeks</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Link href="#prihlasit" className="btn-primary">
            Přihlásit se
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="section-container py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-gray-600 hover:text-primary-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="#prihlasit"
              className="btn-primary w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Přihlásit se
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
