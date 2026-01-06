import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail, Phone } from 'lucide-react'

export function Footer() {
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
              v profesionálním prostředí HWLab Praha.
            </p>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs font-medium text-gray-300">
                DDM Praha 6
              </div>
              <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-xs font-medium text-gray-300">
                HWLab
              </div>
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
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Kongresové centrum Praha<br />
                  5. května 11<br />
                  140 00 Praha 4 - Nusle
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                <a
                  href="mailto:info@weeks.cz"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  info@weeks.cz
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
            Provozováno pod záštitou DDM Praha 6
          </p>
        </div>
      </div>
    </footer>
  )
}
