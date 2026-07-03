'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail, Phone, FileText, ArrowRight } from 'lucide-react'
import { useLocation } from '@/contexts/LocationContext'
import { buildPath } from '@/lib/locations'
import { openCookieSettings } from '@/lib/consent'

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

  // Trvalá, nenápadná záchytka pro druhou lokaci — pro ty, kdo přepínač měst v hlavičce
  // přehlédnou. Plná navigace (<a>), ať se LocationProvider znovu vyhodnotí podle cesty.
  const otherCity = location.isDefault
    ? { href: '/karlovy-vary', label: 'Tábory v Karlových Varech' }
    : { href: '/', label: 'Tábory v Praze' }

  const ageRange = location.programs[0]?.ageRange ?? '10-15'
  const description = location.isDefault
    ? `Víkendové IT kempy pro děti ${ageRange} let. 3D tisk, VR, IoT a programování v profesionálním prostředí ${location.venues[0].name}.`
    : `Letní příměstské IT tábory pro děti ${ageRange} let. 3D tisk, VR, IoT a programování v ${location.venues[0].name} v Karlových Varech.`

  return (
    <footer className="bg-ink text-paper/70 blueprint-grid-dark border-t border-ink relative overflow-hidden">
      <div className="section-container pt-12 pb-16 relative z-10">
        {/* Typografický watermark */}
        <p
          aria-hidden="true"
          className="font-display text-6xl md:text-8xl font-bold text-paper/10 select-none leading-none mb-12"
        >
          WEEKS
        </p>

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
              <span className="text-xl font-display font-bold text-paper">Weeks</span>
            </Link>
            <p className="text-paper/60 leading-relaxed mb-6">
              {description}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="px-3 py-1.5 border border-paper/20 rounded-sm font-mono text-xs text-paper/70">
                {location.organizer.name}
              </div>
              <div className="px-3 py-1.5 border border-paper/20 rounded-sm font-mono text-xs text-paper/70">
                {location.venues[0].name}
              </div>
              {location.isDefault && (
                <a
                  href="https://www.kudyznudy.cz/?utm_source=kzn&utm_medium=partneri_kzn&utm_campaign=banner"
                  title="Kudyznudy.cz – tipy na výlet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 border border-paper/20 rounded-sm hover:border-paper/50 transition-colors flex items-center"
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

            <a
              href={otherCity.href}
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-paper/60 hover:text-paper transition-colors"
            >
              <MapPin className="w-4 h-4 text-accent-400" />
              {otherCity.label}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mono-label-dark mb-5">Navigace</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-paper/60 hover:text-paper transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-paper/30 group-hover:bg-cta-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mono-label-dark mb-5">Právní informace</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-paper/60 hover:text-paper transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-paper/30 group-hover:bg-cta-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="text-paper/60 hover:text-paper transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-paper/30 group-hover:bg-cta-400 transition-colors" />
                  Nastavení cookies
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mono-label-dark mb-5">Kontakt</h3>
            <ul className="space-y-4">
              {location.venues.map((venue) => (
                <li key={venue.name} className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                  <span className="text-paper/60 text-sm">
                    <span className="text-paper font-medium">{venue.name}</span><br />
                    {venue.address}, {venue.city}
                  </span>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-400 shrink-0" />
                <a
                  href={`tel:${location.contact.phone.replace(/\s/g, '')}`}
                  className="font-mono text-paper/60 hover:text-paper transition-colors text-sm"
                >
                  {location.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-400 shrink-0" />
                <a
                  href={`mailto:${location.contact.email}`}
                  className="font-mono text-paper/60 hover:text-paper transition-colors text-sm"
                >
                  {location.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Provozovatel + platební brána — pro non-default lokace (KV = OSVČ Lukáš Kubík) */}
        {!location.isDefault && (
          <div className="mt-12 pt-8 border-t border-paper/15 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-3 max-w-2xl">
              <FileText className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
              <div className="text-sm text-paper/60 leading-relaxed">
                <p className="text-paper font-medium mb-1">Provozovatel</p>
                <p>{location.organizer.fullName}</p>
                <p className="text-xs text-paper/40 mt-1">
                  Úplné kontaktní a fakturační údaje najdete v{' '}
                  <Link href={buildPath(location, 'podminky')} className="underline hover:text-paper">obchodních podmínkách</Link>.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <p className="font-mono text-xs text-paper/40 mb-2 md:text-right">Platby zajišťuje</p>
              <a
                href="https://www.comgate.eu/cs/platebni-brana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-white rounded-sm px-3 py-2 hover:opacity-90 transition-opacity"
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
        <div className="mt-12 pt-8 border-t border-paper/15 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-paper/50">
            {new Date().getFullYear()} Weeks. Všechna práva vyhrazena.
          </p>
          <p className="text-sm text-paper/50">
            Projekt Weeks je organizován {location.organizer.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
