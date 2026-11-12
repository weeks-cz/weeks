import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Faq } from '@/components/w2/Faq'
import { Ikona, type IkonaId } from '@/components/w2/Ikona'
import { KontaktFormular } from '@/components/w2/KontaktFormular'
import { Mrizka } from '@/components/w2/Mrizka'
import { sazba, telefonSazba } from '@/components/w2/text'
import { getVenue, type VenueId } from '@/lib/cities'
import { PROVOZNI_DOBA, SITE, SOCIALNI_SITE, getSiteFaq, telefonHodinyText } from '@/lib/site'
import { getTurnusy } from '@/lib/turnusy'
import { TYM } from '@/lib/tym'

/**
 * Kontakt (nový vzhled, vlna 2).
 *
 * Stránka je serverová a statická; klientský je jen formulář
 * (`KontaktFormular`) a dotazy. Drobečkové schema vykresluje `layout.tsx`.
 *
 * Co tu schválně není: jiné hodiny než ty, které web umí doložit — provozní
 * doba tábora (`PROVOZNI_DOBA`) a hodiny telefonu (`TELEFON_HODINY`).
 */

const IKONA_SITE: Record<(typeof SOCIALNI_SITE)[number]['id'], IkonaId> = {
  instagram: 'ig',
  facebook: 'fb',
}

export default function ContactPage() {
  // Místa konání — jen ta, která nějaký turnus doopravdy má.
  const turnusy = getTurnusy()
  const venues = Array.from(
    new Set(turnusy.map((t) => t.venueId).filter((id): id is VenueId => id !== null))
  ).map((id) => getVenue(id))
  const chybiMisto = turnusy.some((t) => t.venueId === null)

  // Komu psát rovnou: jen lidé, kteří za něco odpovídají a chtějí mít e-mail
  // veřejně (`tym.ts`).
  const komu = TYM.filter((clen) => clen.naStarosti && clen.email)

  // Výtah ze sdílených dotazů (`getSiteFaq()`), ne vlastní kopie — vlastní
  // odpovědi se tu už jednou rozešly s úvodní stránkou.
  const dotazy = getSiteFaq().slice(0, 5)

  const tel = `tel:${SITE.phone.replace(/\s/g, '')}`
  const hodiny = telefonHodinyText()

  return (
    <>
      <Header vToku />
      <main id="obsah" className="w2">
        {/* ── Záhlaví ──────────────────────────────────────────────────── */}
        <section className="zahlavi dark mrizka">
          <Mrizka />
          <div className="wrap">
            <div className="zahlavi-uzke">
              <nav className="drob" aria-label="Drobečková navigace">
                <Link href="/">Domů</Link> <span aria-hidden="true">/</span> <span>Kontakt</span>
              </nav>
              <h1>Napište nebo zavolejte</h1>
              <p className="zahlavi-perex">
                {sazba('Dotaz k táboru, přihlášce nebo platbě? Ozvěte se, rádi poradíme.')}
              </p>
            </div>
            <div className="rozcesti">
              <a href={tel}>
                <span className="rozcesti-ik">
                  <Ikona id="tel" />
                </span>
                <b>{telefonSazba(SITE.phone)}</b>
                <span>{hodiny ? sazba(`Na telefonu jsme ${hodiny}`) : 'Zavolejte nám'}</span>
                <Ikona id="sipka" />
              </a>
              <a href={`mailto:${SITE.email}`}>
                <span className="rozcesti-ik">
                  <Ikona id="mail" />
                </span>
                <b>{SITE.email}</b>
                <span>Na dotazy k táboru i přihlášce</span>
                <Ikona id="sipka" />
              </a>
              <a href="#formular">
                <span className="rozcesti-ik">
                  <Ikona id="tuzka" />
                </span>
                <b>Formulář</b>
                <span>Zprávu napíšete rovnou tady</span>
                <Ikona id="dolu" />
              </a>
            </div>
          </div>
        </section>

        {/* ── Formulář a komu psát ─────────────────────────────────────── */}
        <section className="sec sec-papir bez-linky">
          <div className="wrap dva">
            <KontaktFormular />
            <div>
              {komu.length > 0 && (
                <div className="bok-blok">
                  <h2 className="podnadpis">Komu psát rovnou</h2>
                  <p>{sazba('Na všem děláme společně, ale každý za něco odpovídá.')}</p>
                  <ul className="komu">
                    {komu.map((clen) => (
                      <li key={clen.id}>
                        <b>{clen.naStarosti}</b>
                        <span>{clen.jmeno}</span>
                        <a href={`mailto:${clen.email}`}>{clen.email}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="bok-blok">
                <h2 className="podnadpis">Kdy tábor běží</h2>
                <p>
                  {sazba(
                    `Pondělí až pátek ${PROVOZNI_DOBA.rozsah}. Děti přicházejí ${PROVOZNI_DOBA.prichod} a vyzvedáváte je ${PROVOZNI_DOBA.odchod}.`
                  )}
                </p>
              </div>
              <div className="bok-blok">
                <h2 className="podnadpis">Sledujte nás</h2>
                <div className="site">
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
              {/* Identifikace provozovatele — drobně, ať nepřebíjí kontakty. */}
              <p className="bok-blok small muted">
                {SITE.legalName}, IČO {SITE.ico}
                <br />
                {SITE.address}
                <br />
                {SITE.court}
              </p>
            </div>
          </div>
        </section>

        {/* ── Místa konání ─────────────────────────────────────────────── */}
        {venues.length > 0 && (
          <section className="sec sec-tint" id="mista">
            <div className="wrap">
              <div className="sec-head">
                <h2>Kde tábory běží</h2>
                <p>
                  {chybiMisto
                    ? 'Místo dalších termínů upřesníme, než je otevřeme. Vždy ho najdete u konkrétního termínu.'
                    : 'Přesné místo najdete vždy i u konkrétního termínu.'}
                </p>
              </div>
              <div className="mapy">
                {venues.map((venue) => (
                  <div className="mapa" key={venue.id}>
                    <iframe
                      src={`https://www.google.com/maps?q=${venue.mapQuery}&output=embed`}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Mapa: ${venue.fullName}`}
                    />
                    <div className="mapa-popis">
                      <b>{sazba(venue.fullName)}</b>
                      <span>{sazba(`${venue.street}, ${venue.postalCode} ${venue.city}`)}</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${venue.mapQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Otevřít v mapách <Ikona id="ven" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Dotazy ───────────────────────────────────────────────────── */}
        <section className="sec sec-faq vz vz-faq" id="faq">
          <div className="wrap bok">
            <div className="sec-head">
              <h2>Než napíšete</h2>
              <p>Na tohle se rodiče ptají nejčastěji.</p>
            </div>
            <Faq dotazy={dotazy} />
            <p className="faq-dal">
              <Link className="link" href="/#faq">
                Všechny dotazy
              </Link>
            </p>
          </div>
        </section>

        {/* ── Závěr ────────────────────────────────────────────────────── */}
        <section className="zaver amber vz vz-zaver">
          <div className="wrap zaver-cta">
            <div className="zaver-in">
              <h2>Vybíráte tábor na léto?</h2>
              <p>Termíny, ceny a místa najdete na jedné stránce.</p>
            </div>
            <Link className="btn btn-dark btn-lg" href="/tabory">
              Vybrat tábor <Ikona id="sipka" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
