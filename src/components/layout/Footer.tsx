'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Ikona, type IkonaId } from '@/components/w2/Ikona'
import { sazba, telefonSazba } from '@/components/w2/text'
import { SITE, SOCIALNI_SITE } from '@/lib/site'
import { openCookieSettings } from '@/lib/consent'

// E-shop je z navigace dočasně schovaný — tým se zatím nerozhodl, jestli ho
// chce mít veřejně. Není smazaný: route `/eshop` dál funguje, takže staré
// odkazy a QR kódy nepadají. Návrat = vrátit řádek do `ODKAZY`.
//
// Pořadí je po řádcích dvousloupcové mřížky: vlevo navigace, vpravo právní.
const ODKAZY: Array<{ name: string; href: string } | 'cookies'> = [
  { name: 'Tábory', href: '/tabory' },
  { name: 'Ochrana osobních údajů', href: '/gdpr' },
  { name: 'Oslavy', href: '/oslavy' },
  { name: 'Podmínky užití', href: '/podminky' },
  { name: 'Pro firmy', href: '/firmy' },
  'cookies',
  { name: 'O nás', href: '/o-nas' },
  { name: 'Kontakt', href: '/kontakt' },
]

const IKONA_SITE: Record<(typeof SOCIALNI_SITE)[number]['id'], IkonaId> = {
  instagram: 'ig',
  facebook: 'fb',
}

// Věta říká jen to, co web nabízí. „Se zkušenými instruktory“ z ní vypadlo:
// je to tvrzení, které stránka nemá čím doložit.
const POPIS =
  'Týdenní příměstské IT tábory pro děti 9 až 15 let. 3D tisk, IoT s Arduinem a vývoj her.'

export function Footer() {
  return (
    <div className="w2 w2-cast">
      <footer className="ftr dark mrizka vz vz-ftr">
        <div className="wrap">
          <div className="ftr-top">
            <div>
              <Link className="logo" href="/">
                <Image src="/images/weeks-logo.png" alt="" width={364} height={245} />
                Weeks
              </Link>
              <p className="ftr-o">{sazba(POPIS)}</p>
            </div>
            <nav className="ftr-odkazy" aria-label="Odkazy v patičce">
              {ODKAZY.map((o) =>
                o === 'cookies' ? (
                  <a
                    key="cookies"
                    href="#cookies"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault()
                      openCookieSettings()
                    }}
                  >
                    Nastavení cookies
                  </a>
                ) : (
                  <Link key={o.href} href={o.href}>
                    {o.name}
                  </Link>
                )
              )}
              <a href="https://ucebna.weeks.cz/" target="_blank" rel="noopener noreferrer">
                Online učebna
              </a>
            </nav>
            <div className="ftr-kontakt">
              <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>
                <Ikona id="tel" /> {telefonSazba(SITE.phone)}
              </a>
              <a href={`mailto:${SITE.email}`}>
                <Ikona id="mail" /> {SITE.email}
              </a>
              <div className="ftr-soc">
                {SOCIALNI_SITE.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Weeks ${s.naSiti} (otevře se v nové záložce)`}
                  >
                    <Ikona id={IKONA_SITE[s.id]} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Identifikace provozovatele a odznaky. Logo Comgate je podmínka
              provozu platební brány (viz commit bd4adfd). Zápis na
              Kudyznudy.cz zakladatel 2026-09-24 potvrdil. */}
          <div className="ftr-dole">
            <p>
              {sazba(
                `${SITE.legalName}, IČO ${SITE.ico} · ${SITE.address} · ${new Date().getFullYear()} Weeks. Všechna práva vyhrazena.`
              )}
            </p>
            <div className="ftr-loga">
              <a
                className="ftr-kzn"
                href="https://www.kudyznudy.cz/?utm_source=kzn&utm_medium=partneri_kzn&utm_campaign=banner"
                title="Kudyznudy.cz – tipy na výlet"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/kudy-z-nudy-white.png"
                  alt="Kudyznudy.cz – tipy na výlet"
                  width={126}
                  height={28}
                />
              </a>
              <span>Platby zajišťuje</span>
              <Image
                className="comgate"
                src="/images/comgate-logo.png"
                alt="Comgate"
                width={102}
                height={24}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
