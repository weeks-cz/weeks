'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail, Phone } from 'lucide-react'
import { useLocation } from '@/contexts/LocationContext'

export function Footer() {
  const location = useLocation()
  return (
    <footer className="bg-gray-900 text-gray-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-900/20 rounded-full blur-3xl" />
      </div>

      <div className="section-container py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/images/weeks-logo.png"
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
                aria-hidden="true"
              />
              <span className="text-xl font-display font-bold text-white">Weeks</span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6">
              Víkendové IT kempy pro děti 10-15 let. 3D tisk, VR, IoT a programování
              v profesionálním prostředí {location.venues[0].name}.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs font-medium text-gray-300">
                {location.organizer.name}
              </div>
              <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs font-medium text-gray-300">
                {location.venues[0].name}
              </div>
              <a
                href="https://www.kudyznudy.cz/?utm_source=kzn&utm_medium=partneri_kzn&utm_campaign=banner"
                title="Kudyznudy.cz – tipy na výlet"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <Image
                  src="/images/kudy-z-nudy-white.png"
                  width={150}
                  height={33}
                  alt="Kudyznudy.cz – tipy na výlet"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-white font-semibold mb-5">Navigace</h3>
            <ul className="space-y-3">
              {[
                { name: 'Program', href: '/program' },
                { name: 'Proč Weeks', href: '/#proc-weeks' },
                { name: 'O nás', href: '/o-nas' },
                { name: 'Kontakt', href: '/kontakt' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-primary-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display text-white font-semibold mb-5">Právní informace</h3>
            <ul className="space-y-3">
              {[
                { name: 'Ochrana osobních údajů', href: '/gdpr' },
                { name: 'Podmínky užití', href: '/podminky' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-primary-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-white font-semibold mb-5">Kontakt</h3>
            <ul className="space-y-4">
              {location.venues.map((venue) => (
                <li key={venue.name} className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm">
                    <span className="text-gray-300 font-medium">{venue.name}</span><br />
                    {venue.address}, {venue.city}
                  </span>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                <a
                  href={`mailto:${location.contact.email}`}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {location.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            {new Date().getFullYear()} Weeks. Všechna práva vyhrazena.
          </p>
          <p className="text-sm text-gray-400">
            Projekt Weeks je organizován {location.organizer.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
