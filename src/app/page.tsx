import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { OrganizationSchema, LocalBusinessSchema } from '@/components/seo/StructuredData'
import { EmailZajem } from '@/components/w2/EmailZajem'
import { Faq } from '@/components/w2/Faq'
import { Hvezdy, Ikona } from '@/components/w2/Ikona'
import { KontaktKarta } from '@/components/w2/KontaktKarta'
import { Mrizka } from '@/components/w2/Mrizka'
import { OdkazTerminy } from '@/components/w2/OdkazTerminy'
import { Pas } from '@/components/w2/Pas'
import { PasFoto } from '@/components/w2/PasFoto'
import { RecenzeSekce } from '@/components/w2/RecenzeKarty'
import { TaboryUvodu } from '@/components/w2/TaboryUvodu'
import { Usp } from '@/components/w2/Usp'
import { sazba } from '@/components/w2/text'
import { getCity } from '@/lib/cities'
import { GOOGLE_PROFIL, maRecenze } from '@/lib/recenze'
import { SOCIALNI_SITE, getSiteFaq } from '@/lib/site'
import { getAktivniTabory, getChystaneTabory } from '@/lib/tabory'
import { getTurnusy, getTurnusyByTabor, oznameniPrihlasovani } from '@/lib/turnusy'

/**
 * Úvodní stránka (nový vzhled, listopad 2026) — rozcestí, ne katalog.
 *
 * Rodič z reklamy nebo z vyhledávače má do dvou obrazovek vidět, co Weeks
 * dělá, pro koho, a tábory, na které se dá přihlásit. Popis tábora tu není —
 * žije na stránce tématu.
 *
 * Rytmus sekcí (sousední sekce se liší pozadím):
 *
 *   úvod       tmavá + mřížka, která se rozsvěcí
 *   pás        jantarový
 *   tábory     světlá
 *   jistoty    zelená
 *   recenze    fialový nádech
 *   fotopás    fotka
 *   galerie    papír
 *   dotazy     šedý papír
 *   závěr      jantarový
 */

/** Dotazy, které jsou vidět hned. Zbytek se odkryje tlačítkem. */
const PRVNI_DOTAZY = [
  'Pro jak staré děti je tábor určený?',
  'Musí dítě něco umět dopředu?',
  'Co má dítě mít s sebou?',
  'Je v ceně oběd?',
  'Jak probíhá platba?',
  'Můžu zaplatit zálohu?',
]

const GALERIE = [
  {
    trida: 'gal-a',
    src: '/images/tabor/skupina-terasa-2.webp',
    alt: 'Děti z tábora Weeks s lektory na terase',
    popisek: 'Společná fotka z tábora',
    width: 1600,
    height: 1200,
  },
  {
    trida: 'gal-b',
    src: '/images/tabor/iot-led-palec.webp',
    alt: 'Chlapec ukazuje palec nahoru, před ním nepájivé pole s rozsvícenými LED diodami a Arduino',
    popisek: 'Arduino a LEDky',
    width: 1500,
    height: 2000,
  },
  {
    trida: 'gal-c',
    src: '/images/tabor/tisk-filament.webp',
    alt: 'Lektor pomáhá chlapci u 3D tiskárny',
    popisek: 'U 3D tiskárny',
    width: 1600,
    height: 898,
  },
  {
    trida: 'gal-d',
    src: '/images/tabor/u-pocitace-slicer.webp',
    alt: 'Děti u monitoru s modelem připraveným k tisku',
    popisek: 'Model před tiskem',
    width: 1200,
    height: 1600,
  },
]

export default function Home() {
  const oznameni = oznameniPrihlasovani()
  const jdePrihlasit = oznameni !== null
  const vek = (getTurnusy()[0]?.ageRange ?? '9-15').replace('-', '–')
  const aktivni = getAktivniTabory()

  // Co se chystá: běžící tábor ve městě, kde termín ještě není, a nová témata.
  const chystaneTerminy = aktivni.flatMap((tabor) =>
    getTurnusyByTabor(tabor.id)
      .filter((t) => t.status === 'chystame')
      .map((t) => ({
        klic: t.id,
        text: `${tabor.shortName} v ${getCity(t.city).lokal}`,
        href: `/tabory/termin/${t.slug}`,
      }))
  )
  const chystaneTabory = getChystaneTabory().map((t) => ({
    klic: t.id,
    text: t.shortName,
    href: `/tabory/${t.id}`,
  }))
  const chystame = [...chystaneTerminy, ...chystaneTabory]

  const vsechnyDotazy = getSiteFaq()
  const dotazy = [
    ...PRVNI_DOTAZY.map((q) => vsechnyDotazy.find((d) => d.question === q)).filter(
      (d): d is { question: string; answer: string } => Boolean(d)
    ),
    ...vsechnyDotazy.filter((d) => !PRVNI_DOTAZY.includes(d.question)),
  ]
  const instagram = SOCIALNI_SITE.find((s) => s.id === 'instagram')

  return (
    <>
      <OrganizationSchema />
      <LocalBusinessSchema />
      <Header vToku />
      <main id="obsah" className="w2">
        {/* ── Úvod ─────────────────────────────────────────────────────── */}
        <section className="hero dark mrizka">
          <Mrizka />
          <div className="wrap hero-in">
            <div>
              <h1>
                IT tábory, kde děti tvoří <em>budoucnost</em>
              </h1>
              <p className="hero-perex">
                {sazba(
                  'Týdenní příměstské tábory, kde si děti postaví vlastní věc – od 3D modelu přes zařízení, které samy naprogramují, po vlastní hru.'
                )}{' '}
                <strong className="nowrap">{sazba(`Pro děti ${vek} let.`)}</strong>
              </p>
              <div className="hero-cta">
                <OdkazTerminy
                  className="btn btn-primary btn-lg btn-block"
                  href={jdePrihlasit ? '#terminy' : '#kontakt'}
                  zdroj="homepage_hero"
                >
                  {jdePrihlasit ? 'Vybrat termín' : 'Chci vědět o termínech'} <Ikona id="sipka" />
                </OdkazTerminy>
              </div>
              {maRecenze() && (
                <a className="hodn" href="#recenze">
                  <Hvezdy />
                  <b>{sazba(`${GOOGLE_PROFIL.prumer} z 5`)}</b>
                  <span>hodnocení rodičů na Google</span>
                </a>
              )}
            </div>
            <div className="hero-foto">
              <Image
                src="/images/tabor/hero-dilna.webp"
                alt="Děti a lektoři v dílně u 3D tiskáren, na plátně promítnuté logo Weeks"
                width={1252}
                height={939}
                sizes="(min-width: 900px) 600px, 100vw"
                priority
              />
            </div>
          </div>
        </section>

        <Pas />

        {/* ── Tábory ───────────────────────────────────────────────────── */}
        <section className="sec bez-linky vz vz-terminy" id="terminy">
          <div className="wrap">
            <div className="sec-head">
              <h2>{oznameni ? `Tábory na léto ${oznameni.rok}` : 'Tábory Weeks'}</h2>
              {!jdePrihlasit && <p>Termíny na další léto chystáme. Nechte nám kontakt a dáme vám vědět.</p>}
            </div>
            <TaboryUvodu />
            <aside className="chystame">
              <div className="chystame-text">
                <p className="chystame-stav">Chystáme</p>
                <h3>Další tábory a města</h3>
                {chystame.length > 0 && (
                  <ul>
                    {chystame.map((c) => (
                      <li key={c.klic}>
                        <span>
                          <Link href={c.href}>{sazba(c.text)}</Link>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <a className="btn btn-outline" href="#kontakt">
                Dát vědět o nových termínech <Ikona id="sipka" />
              </a>
            </aside>
          </div>
        </section>

        <Usp />

        <RecenzeSekce vodoznak />

        <PasFoto />

        {/* ── Z našich táborů ──────────────────────────────────────────── */}
        <section className="sec sec-papir bez-linky">
          <div className="wrap">
            <div className="sec-head">
              <h2>Z našich táborů</h2>
            </div>
            <div className="gal">
              {GALERIE.map((f) => (
                <figure className={f.trida} key={f.src}>
                  <Image
                    src={f.src}
                    alt={f.alt}
                    width={f.width}
                    height={f.height}
                    sizes={f.trida === 'gal-a' ? '(min-width: 760px) 560px, 100vw' : '(min-width: 760px) 280px, 50vw'}
                    loading="lazy"
                  />
                  <figcaption>{f.popisek}</figcaption>
                </figure>
              ))}
              {instagram && (
                <a className="gal-ig" href={instagram.url} target="_blank" rel="noopener noreferrer">
                  <Ikona id="ig" />
                  <b>Další fotky</b>
                  <span>@weeks.cz na Instagramu</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── Dotazy ───────────────────────────────────────────────────── */}
        <section className="sec sec-faq vz vz-faq" id="faq">
          <div className="wrap bok">
            <div className="sec-head">
              <h2>Časté dotazy rodičů</h2>
              <p>Nenašli jste odpověď? Napište nebo zavolejte, poradíme.</p>
            </div>
            <Faq dotazy={dotazy} prvnich={PRVNI_DOTAZY.length} prvniOtevrena />
            <div className="faq-kontakt">
              <KontaktKarta />
            </div>
          </div>
        </section>

        {/* ── Závěr: sběr e-mailu ──────────────────────────────────────── */}
        <section className="zaver amber vz vz-zaver" id="kontakt">
          <div className="wrap">
            <div className="zaver-in">
              <h2>{jdePrihlasit ? 'Nenašli jste svůj termín nebo město?' : 'Chcete vědět o termínech mezi prvními?'}</h2>
              <p>Nechte nám kontakt a ozveme se vám, jakmile vypíšeme další termíny a města.</p>
              <EmailZajem />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
