'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Ikona } from '@/components/w2/Ikona'
import { useTelefonStav } from '@/components/w2/telefon'
import { sazba, telefonSazba } from '@/components/w2/text'
import { trackNavCTA, trackUcebnaClick } from '@/lib/analytics'
import { getTurnusy, isBookable } from '@/lib/turnusy'
import { getAllCities } from '@/lib/cities'
import { GOOGLE_PROFIL, maRecenze } from '@/lib/recenze'
import { SITE } from '@/lib/site'

// E-shop je z navigace dočasně schovaný — tým se zatím nerozhodl, jestli ho
// chce mít veřejně. Není smazaný: route `/eshop` dál funguje, takže staré
// odkazy a QR kódy nepadají. Návrat = odkomentovat řádek.
const navItems = [
  { name: 'Tábory', href: '/tabory' },
  { name: 'Oslavy', href: '/oslavy' },
  { name: 'Pro firmy', href: '/firmy' },
  // { name: 'E-shop', href: '/eshop' },
  { name: 'O nás', href: '/o-nas' },
  { name: 'Kontakt', href: '/kontakt' },
]

const UCEBNA = 'https://ucebna.weeks.cz/'

/**
 * Hlavička po redesignu (listopad 2026): tmavá lišta se třemi fakty, pod ní
 * lepicí pruh s logem, navigací, kontaktem a jedním jantarovým tlačítkem.
 *
 * `vToku` zapínají přepracované stránky: hlavička je součást toku stránky
 * (lišta odjede, pruh se přilepí). Stránky, které ještě přepracované nejsou,
 * počítají s původní hlavičkou připnutou napevno a mají podle ní horní
 * odsazení — těm zůstává připnutá a lištu nedostanou, aby se jim neposunul
 * obsah. Až budou přepracované všechny, prop zmizí.
 *
 * `bezCta` schová jantarové tlačítko v pruhu na počítači (stránka termínu,
 * kde by soupeřilo s „Přihlásit dítě“ v nákupním boxu).
 */
export function Header({
  bezCta = false,
  vToku = false,
}: { bezCta?: boolean; vToku?: boolean } = {}) {
  const [menu, setMenu] = useState(false)
  const { online, text: stavText, maHodiny } = useTelefonStav()
  const pathname = usePathname()

  // Stejný trojstav jako na /tabory a v úvodu — hlavní tlačítko nesmí
  // slibovat výběr termínu, když se zrovna nedá koupit nic.
  const turnusy = getTurnusy()
  const prodejne = turnusy.filter(isBookable)
  const vyprodano = prodejne.length === 0 && turnusy.some((t) => t.status === 'plno')
  const ctaLabel = prodejne.length
    ? 'Vybrat termín'
    : vyprodano
      ? 'Chci vědět o volném místě'
      : 'Chci vědět o termínech'

  // Lišta: tři fakta, každé z dat. Rok se bere z nejbližšího prodejného termínu.
  const rok = prodejne
    .map((t) => t.start)
    .filter((s): s is string => Boolean(s))
    .sort()[0]
    ?.slice(0, 4)
  const stavPrihlasek = rok ? `Přihlášky na léto ${rok} otevřené` : 'Termíny na další léto chystáme'
  const mesta = getAllCities().map((c) => c.name)
  const mestaText =
    mesta.length > 1 ? `${mesta.slice(0, -1).join(', ')} a ${mesta[mesta.length - 1]}` : mesta[0]
  const hodnoceni = maRecenze() && GOOGLE_PROFIL.url ? GOOGLE_PROFIL.prumer : null

  const tel = `tel:${SITE.phone.replace(/\s/g, '')}`

  // Po přechodu na jinou stránku menu zavřít.
  useEffect(() => {
    setMenu(false)
  }, [pathname])

  const aktivni = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`) ? ('page' as const) : undefined


  return (
    <div className={`w2 w2-cast${vToku ? '' : ' w2-pevna'}`}>
      {/* Každá stránka má `<main id="obsah">` (od vlny 3 i registrace, platba,
          právní stránky a e-shop), proto odkaz může být v hlavičce napevno. */}
      <a className="preskocit" href="#obsah">
        Přeskočit na obsah
      </a>
      {vToku && (
        <div className="top dark">
          <div className="wrap">
            <ul className="top-in">
              <li>
                <Ikona id="kalendar" />
                {stavPrihlasek}
              </li>
              {hodnoceni && (
                <li>
                  <Ikona id="hvezda" />
                  <span>
                    {sazba(`${hodnoceni} z 5`)} <span className="top-skryj">na Google</span>
                  </span>
                </li>
              )}
              <li className="top-jen-d">
                <Ikona id="misto" />
                {sazba(mestaText)}
              </li>
            </ul>
          </div>
        </div>
      )}
      <header className="hdr">
        <div className="wrap hdr-in">
          <Link className="logo" href="/">
            <Image src="/images/weeks-logo.png" alt="" width={364} height={245} priority />
            Weeks
          </Link>
          <nav className="nav" aria-label="Hlavní navigace">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} aria-current={aktivni(item.href)}>
                {item.name}
              </Link>
            ))}
            <a
              href={UCEBNA}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Učebna, výuková platforma (otevře se v nové záložce)"
              onClick={() => trackUcebnaClick('desktop')}
            >
              Učebna
            </a>
          </nav>
          <div className="hdr-vpravo">
            <a
              className={`hdr-kontakt${online ? ' je-online' : ''}`}
              href={tel}
              aria-label={`Zavolat do Weeks: ${SITE.phone}`}
            >
              <span className="hdr-tel" aria-hidden="true">
                <Ikona id="tel" />
              </span>
              <span className="avatar">
                <Image src="/images/tym-avatar.webp" alt="" width={40} height={40} />
                {maHodiny && <span className="avatar-stav" aria-hidden="true" />}
              </span>
              <span className="hdr-kontakt-text">
                <b>{stavText}</b>
                <span>{telefonSazba(SITE.phone)}</span>
              </span>
            </a>
            {!bezCta && (
              <Link
                className="btn btn-primary hdr-cta"
                href="/tabory"
                onClick={() => trackNavCTA('desktop')}
              >
                {ctaLabel}
              </Link>
            )}
            <button
              type="button"
              className="menu-btn"
              aria-expanded={menu}
              aria-controls="menu"
              aria-label={menu ? 'Zavřít menu' : 'Otevřít menu'}
              onClick={() => setMenu((m) => !m)}
            >
              <Ikona id="menu" />
            </button>
          </div>
        </div>
        <div className="menu" id="menu" hidden={!menu}>
          <nav className="wrap" aria-label="Navigace">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={aktivni(item.href)}
                onClick={() => setMenu(false)}
              >
                {item.name}
              </Link>
            ))}
            <a
              href={UCEBNA}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Učebna, výuková platforma (otevře se v nové záložce)"
              onClick={() => {
                trackUcebnaClick('mobile')
                setMenu(false)
              }}
            >
              Učebna
            </a>
            <Link
              className="btn btn-primary btn-block"
              href="/tabory"
              onClick={() => {
                trackNavCTA('mobile')
                setMenu(false)
              }}
            >
              {ctaLabel} <Ikona id="sipka" />
            </Link>
          </nav>
        </div>
      </header>
    </div>
  )
}
