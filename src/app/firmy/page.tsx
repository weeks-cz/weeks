import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FirmyPoptavka } from '@/components/firmy/FirmyPoptavka'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import { Ikona, type IkonaId } from '@/components/w2/Ikona'
import { Mrizka } from '@/components/w2/Mrizka'
import { sazba, telefonSazba } from '@/components/w2/text'
import { getNabidky, type NabidkaId } from '@/lib/firmy'
import { SITE } from '@/lib/site'

// Ikona, barva, krátký popisek a text tlačítka se k nabídce nedají odvodit
// z dat (nadpisy v `src/lib/firmy.ts` jako „Dny pro děti zaměstnanců" se nedají
// bezpečně sklonit do tvaru „Poptat …"), proto jsou tady jako malá UI mapa
// vedle datového zdroje, ne jako duplicitní zdroj obsahu.
//
// Barva drží roli z palety, ne náladu: den pro děti zaměstnanců je o klidu
// rodičů (smaragd), workshop o technologiích (tyrkys), partnerství o značce
// samotné (indigo).
const NABIDKA_META: Record<NabidkaId, { ikona: IkonaId; role: string; kratce: string; poptat: string }> = {
  'deti-zamestnancu': {
    ikona: 'lide',
    role: 'r-emerald',
    kratce: 'benefit pro rodiče ve firmě',
    poptat: 'Poptat den pro děti zaměstnanců',
  },
  workshopy: {
    ikona: 'naradi',
    role: 'r-cyan',
    kratce: 'tým si něco postaví',
    poptat: 'Poptat workshop',
  },
  partnerstvi: {
    ikona: 'srdce',
    role: 'r-indigo',
    kratce: 'podpora technického vzdělávání',
    poptat: 'Poptat partnerství',
  },
}

/** Podklad sekcí se střídá, aby tři nabídky pod sebou nesplynuly. */
const PODKLADY = ['sec sec-papir bez-linky', 'sec sec-tint', 'sec']

/**
 * Stránka `/firmy` (nový vzhled, vlna 2) — tři nabídky pro tři různé lidi
 * (HR, office manager, marketing/vedení), jeden sdílený poptávkový formulář
 * dole. Zůstává serverová a staticky předgenerovaná: `FirmyPoptavka` si
 * `?typ=` z adresy čte sama za vlastní hranicí `Suspense`, takže stránka
 * nesmí sahat na `searchParams` — jinak by ji Next kvůli tomu přepnul na
 * dynamické vykreslování (viz komentář u `FirmyPoptavka`).
 *
 * Weeks zatím neodbavil žádnou firemní zakázku: stránka neuvádí cenu,
 * reference ani počet firem a o chybějících referencích mlčí (CLAUDE.md,
 * „/firmy (phase 4)“).
 */
export default function FirmyPage() {
  const nabidky = getNabidky()
  const tel = `tel:${SITE.phone.replace(/\s/g, '')}`

  // Název drobečku souhlasí s odkazem v hlavičce (`Header.tsx`): „Pro firmy“.
  const breadcrumbItems = [
    { name: 'Domů', url: SITE.url },
    { name: 'Pro firmy', url: `${SITE.url}/firmy` },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Header vToku />
      <main id="obsah" className="w2">
        {/* ── Záhlaví ──────────────────────────────────────────────────── */}
        <section className="zahlavi dark mrizka">
          <Mrizka />
          <div className="wrap">
            <div className="zahlavi-uzke">
              <nav className="drob" aria-label="Drobečková navigace">
                <Link href="/">Domů</Link> <span aria-hidden="true">/</span> <span>Pro firmy</span>
              </nav>
              <h1>Weeks pro firmy</h1>
              <p className="zahlavi-perex">
                {sazba(
                  'O prázdninách pracujeme s dětmi na 3D tisku a elektronice s Arduinem. Stejné technologie a lektory nabízíme i firmám.'
                )}
              </p>
            </div>
            <nav className="rozcesti" aria-label="Přejít na nabídku">
              {nabidky.map((n) => {
                const meta = NABIDKA_META[n.id]
                return (
                  <a href={`#${n.id}`} key={n.id} className={meta.role}>
                    <span className="rozcesti-ik">
                      <Ikona id={meta.ikona} />
                    </span>
                    <b>{n.nadpis}</b>
                    <span>{meta.kratce}</span>
                    <Ikona id="dolu" />
                  </a>
                )
              })}
            </nav>
          </div>
        </section>

        {/* ── Tři nabídky ──────────────────────────────────────────────── */}
        {nabidky.map((nabidka, index) => {
          const meta = NABIDKA_META[nabidka.id]
          return (
            <section key={nabidka.id} id={nabidka.id} className={PODKLADY[index % PODKLADY.length]}>
              <div className={`wrap dva nabidka ${meta.role}`}>
                <div>
                  <div className="nabidka-hl">
                    <span className="karta-ik">
                      <Ikona id={meta.ikona} />
                    </span>
                    <h2>{nabidka.nadpis}</h2>
                  </div>
                  <p className="nabidka-pro">{sazba(nabidka.proKoho)}</p>
                  <p className="nabidka-perex">{sazba(nabidka.perex)}</p>
                  <h3 className="podnadpis">Jak to probíhá</h3>
                  <ul className="zaskrt role">
                    {nabidka.jakToProbiha.map((item) => (
                      <li key={item}>
                        <Ikona id="ok" />
                        <span>{sazba(item)}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Pole je dnes u všech tří nabídek prázdné (Weeks zatím
                      neodbavil žádnou firemní zakázku) — vykreslí se, až
                      v datech doopravdy něco bude. */}
                  {nabidka.reference && nabidka.reference.length > 0 && (
                    <>
                      <h3 className="podnadpis">Reference</h3>
                      <ul className="zaskrt role">
                        {nabidka.reference.map((r) => (
                          <li key={r}>
                            <Ikona id="ok" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <div className="nabidka-karta">
                  <div>
                    <h3>Co zajistíme my</h3>
                    <ul className="zaskrt role">
                      {nabidka.zajistimeMy.map((item) => (
                        <li key={item}>
                          <Ikona id="ok" />
                          <span>{sazba(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>Co zajistíte vy</h3>
                    <ul className="zaskrt role">
                      {nabidka.zajistiteVy.map((item) => (
                        <li key={item}>
                          <Ikona id="ok" />
                          <span>{sazba(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link className="btn btn-primary btn-block" href={`/firmy?typ=${nabidka.id}#poptavka`}>
                    {meta.poptat} <Ikona id="sipka" />
                  </Link>
                </div>
              </div>
            </section>
          )
        })}

        {/* ── Kde to proběhne ──────────────────────────────────────────── */}
        {/* Dvě možnosti, ne tři. „V našem prostoru“ tu stávalo neprávem —
            Weeks vlastní dílnu nemá — a „v partnerském prostoru“ odkazovalo
            na FabLab VARY&TE, se kterým partnerství podepsané není. */}
        <section className="sec dark mrizka bez-linky">
          <Mrizka />
          <div className="wrap">
            <div className="sec-head">
              <h2>Místo domluvíme</h2>
              <p>
                {sazba(
                  'Nemáme pro firmy jedno pevné místo. Vybíráme podle toho, kolik lidí přijde a co je potřeba k programu.'
                )}
              </p>
            </div>
            <div className="karty dve">
              <article className="karta">
                <span className="karta-ik">
                  <Ikona id="budova" />
                </span>
                <h3>U vás ve firmě</h3>
                <p>{sazba('Přivezeme vybavení i lektory. Potřebujeme místnost, stoly a elektřinu.')}</p>
              </article>
              <article className="karta">
                <span className="karta-ik">
                  <Ikona id="misto" />
                </span>
                <h3>V pronajatém prostoru</h3>
                <p>{sazba('Dílnu nebo sál najdeme a zařídíme podle počtu lidí a programu.')}</p>
              </article>
            </div>
          </div>
        </section>

        {/* ── Poptávka ─────────────────────────────────────────────────── */}
        <section className="zaver amber vz vz-zaver" id="poptavka">
          <div className="wrap zaver-form">
            <div className="zaver-in">
              <h2>Ozvěte se nám</h2>
              <p>{sazba('Vyberte, co vás zajímá, a napište pár vět. Ozveme se s návrhem a cenou.')}</p>
              <div className="zaver-kontakt">
                <a href={tel}>
                  <Ikona id="tel" /> {telefonSazba(SITE.phone)}
                </a>
                <a href={`mailto:${SITE.email}`}>
                  <Ikona id="mail" /> {SITE.email}
                </a>
              </div>
              {/* Identifikace provozovatele — drobně, ať nepřebíjí formulář. */}
              <p className="zaver-pravni">
                {SITE.legalName}, IČO {SITE.ico}
              </p>
            </div>
            <FirmyPoptavka />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
