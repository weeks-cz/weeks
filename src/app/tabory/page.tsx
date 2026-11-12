import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import { EmailZajem } from '@/components/w2/EmailZajem'
import { Faq } from '@/components/w2/Faq'
import { FiltrMest } from '@/components/w2/FiltrMest'
import { Hvezdy, Ikona } from '@/components/w2/Ikona'
import { KontaktKarta } from '@/components/w2/KontaktKarta'
import { Mrizka } from '@/components/w2/Mrizka'
import { TaborKarta } from '@/components/w2/TaborKarta'
import { Usp } from '@/components/w2/Usp'
import { sazba } from '@/components/w2/text'
import { getCity, type CityId } from '@/lib/cities'
import { GOOGLE_PROFIL, maRecenze } from '@/lib/recenze'
import { PROVOZNI_DOBA, SITE, getSiteFaq } from '@/lib/site'
import { getAktivniTabory, getChystaneTabory } from '@/lib/tabory'
import { getCitiesWithTurnusy, getTurnusy, getTurnusyByCity, isBookable } from '@/lib/turnusy'

/**
 * Výpis táborů (nový vzhled, listopad 2026) — rozcestí, které vede rodiče
 * v pořadí město → téma → termín.
 *
 * Tohle pořadí není kosmetika: rodič nejdřív ví, kam dítě dokáže dovézt, pak
 * ho zajímá téma a teprve nakonec termín. Výpis je proto seskupený podle
 * města, uvnitř města stojí karta tábora a teprve v ní jsou termíny.
 *
 * Stránka je serverová a staticky předgenerovaná. Filtr `?mesto=` běží
 * v prohlížeči (`FiltrMest`); v HTML jsou vždy všechna města.
 */

/** Dotazy, které pomáhají s výběrem tábora. Celý seznam je na úvodní stránce. */
const DOTAZY_VYPISU = [
  'Pro jak staré děti je tábor určený?',
  'Musí dítě něco umět dopředu?',
  'Kde tábory probíhají?',
  'Je v ceně oběd?',
  'Můžu zaplatit zálohu?',
  'Jak velké jsou skupiny?',
]

/** „1 město“, „2 města“, „5 měst“. */
function pocetMest(n: number): string {
  if (n === 1) return '1 město'
  if (n >= 2 && n <= 4) return `${n} města`
  return `${n} měst`
}

/** „v Praze a Karlových Varech“ ze seznamu měst. */
function vMestech(mesta: CityId[]): string {
  const tvary = mesta.map((m) => getCity(m).lokal)
  if (tvary.length === 0) return ''
  if (tvary.length === 1) return `v ${tvary[0]}`
  return `v ${tvary.slice(0, -1).join(', ')} a ${tvary[tvary.length - 1]}`
}

function KartyMesta({ mesto }: { mesto: CityId }) {
  const turnusyMesta = getTurnusyByCity(mesto)
  const tabory = getAktivniTabory()
    .filter((tabor) => turnusyMesta.some((t) => t.taborIds.includes(tabor.id)))
    // Tábor, na který se dá přihlásit, stojí před táborem, který se chystá.
    .sort(
      (a, b) =>
        Number(!turnusyMesta.some((t) => t.taborIds.includes(a.id) && isBookable(t))) -
        Number(!turnusyMesta.some((t) => t.taborIds.includes(b.id) && isBookable(t)))
    )

  return (
    <div className={`tabory${tabory.length === 1 ? ' jedna' : ''}`}>
      {tabory.map((tabor) => (
        <TaborKarta
          key={tabor.id}
          tabor={tabor}
          mesto={mesto}
          stitekMesta={false}
          turnusy={turnusyMesta.filter((t) => t.taborIds.includes(tabor.id))}
        />
      ))}
    </div>
  )
}

export default function TaboryPage() {
  const turnusy = getTurnusy()
  const prodejne = turnusy.filter(isBookable)
  const mesta = getCitiesWithTurnusy()
  const chystane = getChystaneTabory()

  // Rok do nadpisu jen tehdy, když je co prodávat — jinak by stránka slibovala
  // léto, které ještě nemá jediný termín.
  const rok = prodejne
    .map((t) => t.start?.slice(0, 4))
    .filter((r): r is string => Boolean(r))
    .sort()[0]
  const vek = (turnusy[0]?.ageRange ?? '9-15').replace('-', '–')
  const ceny = [...new Set(prodejne.map((t) => t.priceKc).filter((c): c is number => c !== null))]
  const cena = ceny.length > 0 ? `${ceny.length > 1 ? 'od ' : ''}${Math.min(...ceny).toLocaleString('cs-CZ')} Kč` : null

  const bloky = mesta.map((id) => ({ id, name: getCity(id).name, obsah: <KartyMesta mesto={id} /> }))
  const obecne = getSiteFaq()
  const dotazy = DOTAZY_VYPISU.map((q) => obecne.find((d) => d.question === q)).filter(
    (d): d is { question: string; answer: string } => Boolean(d)
  )

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Domů', url: SITE.url },
          { name: 'Tábory', url: `${SITE.url}/tabory` },
        ]}
      />
      <Header vToku />
      <main id="obsah" className="w2">
        {/* ── Záhlaví ──────────────────────────────────────────────────── */}
        <section className="zahlavi dark mrizka">
          <Mrizka />
          <div className="wrap zahlavi-dva">
            <div>
              <nav className="drob" aria-label="Drobečková navigace">
                <Link href="/">Domů</Link> <span aria-hidden="true">/</span> <span>Tábory</span>
              </nav>
              <h1>{sazba(`Letní příměstské tábory${rok ? ` ${rok}` : ''}`)}</h1>
              <p className="zahlavi-perex">
                {sazba(
                  `Týdenní příměstské IT tábory ${vMestech(mesta)}. Od pondělí do pátku ${PROVOZNI_DOBA.rozsah} si děti postaví vlastní věc: výtisk z 3D tiskárny, zařízení s Arduinem nebo hru v Godotu.`
                )}
              </p>
              <ul className="vyhody">
                <li>
                  <Ikona id="lide" />
                  <b>{sazba(`${vek} let`)}</b>
                  <span>i úplní začátečníci</span>
                </li>
                <li>
                  <Ikona id="misto" />
                  <b>{sazba(pocetMest(mesta.length))}</b>
                  <span>{sazba(mesta.map((m) => getCity(m).name).join(' a '))}</span>
                </li>
                <li>
                  <Ikona id="pribor" />
                  <b>{cena ? sazba(cena) : 'S obědem'}</b>
                  <span>{cena ? 'týden včetně oběda' : 'i pitím a materiálem'}</span>
                </li>
              </ul>
              <div className="zahlavi-akce">
                <a className="btn btn-primary btn-lg" href="#mesta">
                  Vybrat tábor <Ikona id="dolu" />
                </a>
                {maRecenze() && GOOGLE_PROFIL.url && (
                  <a className="hodn" href={GOOGLE_PROFIL.url} target="_blank" rel="noopener noreferrer">
                    <Hvezdy />
                    <b>{sazba(`${GOOGLE_PROFIL.prumer} z 5`)}</b>
                    <span>na Google</span>
                  </a>
                )}
              </div>
            </div>
            <figure className="zahlavi-foto jen-desktop">
              <Image
                src="/images/tabor/skupina-terasa-2.webp"
                alt="Děti s lektory na terase"
                width={1600}
                height={1200}
                sizes="(min-width: 900px) 560px, 1px"
                loading="lazy"
              />
            </figure>
          </div>
        </section>

        {/* ── Města a jejich tábory ────────────────────────────────────── */}
        <section className="sec bez-linky" id="mesta">
          <div className="wrap">
            {/* `FiltrMest` čte `?mesto=` z adresy, proto Suspense. Záložní
                podoba je celý výpis bez filtru — stejný obsah, jen bez čipů. */}
            <Suspense
              fallback={bloky.map((b) => (
                <div className="mesto" key={b.id}>
                  <h2>{b.name}</h2>
                  {b.obsah}
                </div>
              ))}
            >
              <FiltrMest mesta={bloky} />
            </Suspense>

            <aside className="chystame">
              <div className="chystame-text">
                <p className="chystame-stav">Chystáme</p>
                <h3>Další tábory a města</h3>
                {chystane.length > 0 && (
                  <ul>
                    {chystane.map((t) => (
                      <li key={t.id}>
                        <span>
                          <Link href={`/tabory/${t.id}`}>{t.shortName}</Link>
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

        {/* ── Dotazy ───────────────────────────────────────────────────── */}
        <section className="sec sec-faq vz vz-faq" id="faq">
          <div className="wrap bok">
            <div className="sec-head">
              <h2>Časté dotazy rodičů</h2>
              <p>Nenašli jste odpověď? Napište nebo zavolejte, poradíme.</p>
            </div>
            <Faq dotazy={dotazy} />
            <div className="faq-kontakt">
              <KontaktKarta />
            </div>
          </div>
        </section>

        {/* ── Závěr: sběr e-mailu ──────────────────────────────────────── */}
        <section className="zaver amber vz vz-zaver" id="kontakt">
          <div className="wrap">
            <div className="zaver-in">
              <h2>Chcete vědět o termínech mezi prvními?</h2>
              <p>Necháte nám e-mail a ozveme se, jakmile vypíšeme další termíny a města.</p>
              <EmailZajem />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
