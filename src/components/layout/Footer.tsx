'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import { SITE } from '@/lib/site'
import { openCookieSettings } from '@/lib/consent'
import { SocialniSite } from '@/components/ui/SocialniSite'

// E-shop je z navigace dočasně schovaný — tým se zatím nerozhodl, jestli ho
// chce mít veřejně. Není smazaný: route `/eshop` dál funguje, takže staré
// odkazy a QR kódy nepadají. Návrat = odkomentovat řádek.
const navLinks = [
  { name: 'Tábory', href: '/tabory' },
  { name: 'Oslavy', href: '/oslavy' },
  { name: 'Pro firmy', href: '/firmy' },
  // { name: 'E-shop', href: '/eshop' },
  { name: 'O nás', href: '/o-nas' },
  { name: 'Kontakt', href: '/kontakt' },
]

const legalLinks = [
  { name: 'Ochrana osobních údajů', href: '/gdpr' },
  { name: 'Podmínky užití', href: '/podminky' },
]

const description =
  'Týdenní příměstské IT tábory pro děti 9 až 15 let. 3D tisk, IoT a programování se zkušenými instruktory.'

export function Footer() {
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
            <Link href="/" className="flex items-center gap-3 mb-6">
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
            <SocialniSite tmave />
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
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-400 shrink-0" />
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                  className="font-mono text-paper/60 hover:text-paper transition-colors text-sm"
                >
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-400 shrink-0" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-mono text-paper/60 hover:text-paper transition-colors text-sm"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>

            {/* Identifikace provozovatele — drobně, ať nepřebíjí zbytek patičky. */}
            <p className="font-mono text-xs text-paper/50 mt-4">
              {SITE.legalName}, IČO {SITE.ico}
              <br />
              {SITE.address}
            </p>
          </div>
        </div>

        {/* Copyright + odznaky. Logo Comgate je podmínka provozu platební
            brány (viz commit bd4adfd), při přestavbě z patičky nechtěně
            vypadlo. Kudyznudy.cz se 2026-09-15 stáhlo jako „neověřené“,
            zakladatel zápis 2026-09-24 potvrdil a chce ho zpátky. */}
        <div className="mt-12 pt-8 border-t border-paper/15 flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-xs text-paper/50">
            {new Date().getFullYear()} Weeks. Všechna práva vyhrazena.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://www.kudyznudy.cz/?utm_source=kzn&utm_medium=partneri_kzn&utm_campaign=banner"
              title="Kudyznudy.cz – tipy na výlet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-sm border border-paper/20 px-3 py-2 transition-colors hover:border-paper/50"
            >
              <Image
                src="/images/kudy-z-nudy-white.png"
                width={150}
                height={33}
                alt="Kudyznudy.cz – tipy na výlet"
                className="h-7 w-auto opacity-80 transition-opacity hover:opacity-100"
              />
            </a>
            <a
              href="https://www.comgate.eu/cs/platebni-brana"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-sm bg-white px-3 py-2 transition-opacity hover:opacity-90"
            >
              <span className="font-mono text-[11px] text-ink-500">Platby zajišťuje</span>
              <Image
                src="/images/comgate-logo.png"
                width={119}
                height={28}
                alt="Comgate"
                className="h-6 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
