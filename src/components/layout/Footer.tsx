'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail, Phone, FileText } from 'lucide-react'
import { useLocation } from '@/contexts/LocationContext'
import { buildPath } from '@/lib/locations'

export function Footer() {
  const location = useLocation()

  const logoHref = buildPath(location, '')

  const navLinks = location.isDefault
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

  const legalLinks = [
    { name: 'Ochrana osobních údajů', href: buildPath(location, 'gdpr') },
    { name: 'Podmínky užití', href: buildPath(location, 'podminky') },
  ]

  const description = location.isDefault
    ? `Víkendové IT kempy pro děti 10-15 let. 3D tisk, VR, IoT a programování v profesionálním prostředí ${location.venues[0].name}.`
    : `Letní příměstské IT tábory pro děti 10-15 let. 3D tisk, VR, IoT a programování v ${location.venues[0].name} v Karlových Varech.`

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
            <Link href={logoHref} className="flex items-center gap-3 mb-6">
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
              {description}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs font-medium text-gray-300">
                {location.organizer.name}
              </div>
              <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs font-medium text-gray-300">
                {location.venues[0].name}
              </div>
              {location.isDefault && (
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
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-white font-semibold mb-5">Navigace</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
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
              {legalLinks.map((link) => (
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
                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                <a
                  href={`tel:${location.contact.phone.replace(/\s/g, '')}`}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {location.contact.phone}
                </a>
              </li>
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

        {/* Provozovatel + platební brána — pro non-default lokace (KV = OSVČ Lukáš Kubík) */}
        {!location.isDefault && (
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-3 max-w-2xl">
              <FileText className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400 leading-relaxed">
                <p className="text-gray-300 font-medium mb-1">Provozovatel</p>
                <p>{location.organizer.fullName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Úplné kontaktní a fakturační údaje najdete v{' '}
                  <Link href={buildPath(location, 'podminky')} className="underline hover:text-gray-300">obchodních podmínkách</Link>.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <p className="text-xs text-gray-500 mb-2 md:text-right">Platby zajišťuje</p>
              <a
                href="https://www.comgate.eu/cs/platebni-brana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-white rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
                aria-label="Comgate – platební brána"
              >
                <Image
                  src="/images/comgate-logo.png"
                  width={119}
                  height={28}
                  alt="Comgate"
                  className="h-7 w-auto"
                />
              </a>
            </div>
          </div>
        )}

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
