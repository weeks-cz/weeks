import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Ikona } from '@/components/w2/Ikona'
import { Mrizka } from '@/components/w2/Mrizka'

/**
 * 404 (nový vzhled, vlna 3). Stránka má hlavičku a patičku jako ostatní –
 * dřív stála bez nich a člověk ze starého odkazu neměl kam dál než na úvod.
 * Dlaždice vedou tam, kam míří většina návštěv: tábory, oslavy, kontakt.
 */
export default function NotFound() {
  return (
    <>
      <Header vToku />
      <main id="obsah" className="w2">
        <section className="dark mrizka nenalezeno">
          <Mrizka />
          <span className="nenalezeno-cislo" aria-hidden="true">
            404
          </span>
          <div className="wrap">
            <div className="zahlavi-uzke">
              <h1>Stránka nenalezena</h1>
              <p className="zahlavi-perex">Omlouváme se, ale hledaná stránka neexistuje.</p>
              <div className="zahlavi-akce">
                <Link href="/" className="btn btn-primary btn-lg">
                  Zpět na hlavní stránku <Ikona id="sipka" />
                </Link>
              </div>
            </div>
            <div className="rozcesti">
              <Link href="/tabory">
                <span className="rozcesti-ik">
                  <Ikona id="stan" />
                </span>
                <b>Tábory</b>
                <span>Termíny, ceny a přihlášky</span>
                <Ikona id="sipka" />
              </Link>
              <Link href="/oslavy">
                <span className="rozcesti-ik">
                  <Ikona id="jiskra" />
                </span>
                <b>Oslavy</b>
                <span>Narozeniny a akce pro děti</span>
                <Ikona id="sipka" />
              </Link>
              <Link href="/kontakt">
                <span className="rozcesti-ik">
                  <Ikona id="tel" />
                </span>
                <b>Kontakt</b>
                <span>Napište nebo zavolejte</span>
                <Ikona id="sipka" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
