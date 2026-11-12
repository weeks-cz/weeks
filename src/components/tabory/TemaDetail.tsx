import Image from 'next/image'
import Link from 'next/link'
import { TurnusInterestForm } from '@/components/turnusy/TurnusInterestForm'
import { Faq } from '@/components/w2/Faq'
import { MistoFoto, tridaMista } from '@/components/w2/MistoFoto'
import { Hvezdy, Ikona } from '@/components/w2/Ikona'
import { KupLista } from '@/components/w2/KupLista'
import { Mrizka } from '@/components/w2/Mrizka'
import { PasFoto } from '@/components/w2/PasFoto'
import { RecenzeSekce } from '@/components/w2/RecenzeKarty'
import { Rozvrh } from '@/components/w2/Rozvrh'
import { TaborKarta } from '@/components/w2/TaborKarta'
import { TerminRadky } from '@/components/w2/TerminRadky'
import { IKONA_DNE, ZKRATKY_DNU } from '@/components/w2/dny'
import { sazba } from '@/components/w2/text'
import { getCity, getVenue, type CityId } from '@/lib/cities'
import { getFocusModules } from '@/lib/focus'
import { GOOGLE_PROFIL, maRecenze } from '@/lib/recenze'
import { PROVOZNI_DOBA, getSiteFaq } from '@/lib/site'
import { getAktivniTabory, zkusiSiTabora, type Tabor } from '@/lib/tabory'
import { getTurnusyByTabor, isBookable, type Turnus } from '@/lib/turnusy'
import { TYM } from '@/lib/tym'

/**
 * Stránka tématu (redesign, listopad 2026) — jediné místo, kde žije popis
 * tábora.
 *
 * Pořadí jde za rodičem: krátký úvod se třemi fakty a tlačítkem, hned pod ním
 * termíny a ceny (kdo ví kdy a kde, je o klik od přihlášky), teprve potom
 * obsah — co si dítě postaví, týden, den, kde to běží, recenze, dotazy.
 *
 * Serverová komponenta. Klientské jsou jen kousky, které to potřebují: mřížka
 * v záhlaví, živá obsazenost u termínů, animace dotazů a spodní lišta.
 */
export function TemaDetail({ tabor }: { tabor: Tabor }) {
  return tabor.status === 'aktivni' ? <AktivniTema tabor={tabor} /> : <ChystaneTema tabor={tabor} />
}

function Drobecky({ tabor }: { tabor: Tabor }) {
  return (
    <nav className="drob" aria-label="Drobečková navigace">
      <Link href="/">Domů</Link> <span aria-hidden="true">/</span> <Link href="/tabory">Tábory</Link>{' '}
      <span aria-hidden="true">/</span> <span>{tabor.name}</span>
    </nav>
  )
}

/** „na jednom tématu“, „na dvou tématech“ — věta pod nadpisem „Co si postavíš“. */
function naKolikaTematech(n: number): string {
  if (n === 1) return 'jednom tématu'
  if (n === 2) return 'dvou tématech'
  if (n === 3) return 'třech tématech'
  return `${n} tématech`
}

/**
 * Obecné dotazy, kterými se doplní dotazy tématu do pěti. Pořadí je pořadí
 * důležitosti; celý seznam je na úvodní stránce.
 */
const OBECNE_DOTAZY = [
  'Co má dítě mít s sebou?',
  'Musí dítě něco umět dopředu?',
  'Jak velké jsou skupiny?',
  'Je zajištěn oběd pro děti s alergiemi?',
]
const DOTAZU_NA_STRANCE = 5

function dotazyTematu(tabor: Tabor): Array<{ question: string; answer: string }> {
  const vlastni = tabor.faq ?? []
  // Tábor, který má vlastní dotaz o tom, co je potřeba umět, nepotřebuje
  // vedle něj ještě obecnou verzi téže otázky.
  const maVlastniUmet = vlastni.some((d) => d.question.includes('umět'))
  const obecne = getSiteFaq()
  const dopln = OBECNE_DOTAZY.filter((q) => !(maVlastniUmet && q.includes('umět')))
    .map((q) => obecne.find((d) => d.question === q))
    .filter((d): d is { question: string; answer: string } => Boolean(d))
  return [...vlastni, ...dopln].slice(0, DOTAZU_NA_STRANCE)
}

/** Lístek jednoho města: kde, za kolik a řádky termínů. */
function Listek({ mesto, turnusy }: { mesto: CityId; turnusy: Turnus[] }) {
  // Vypsané termíny: prodejné a obsazené (ten řádek řekne „Obsazeno“).
  const prodejne = turnusy.filter((t) => isBookable(t) || t.status === 'plno')
  const chysta = prodejne.length === 0
  const venueId = prodejne[0]?.venueId
  const venue = venueId ? getVenue(venueId) : null
  const ceny = [...new Set(prodejne.map((t) => t.priceKc).filter((c): c is number => c !== null))]
  const cena = ceny.length > 0 ? `${ceny.length > 1 ? 'od ' : ''}${Math.min(...ceny).toLocaleString('cs-CZ')} Kč` : null

  return (
    <article className={`listek${chysta ? ' chysta' : ''}`}>
      <div className="listek-kde">
        <h3>
          <Ikona id="misto" /> {getCity(mesto).name}
          {chysta && (
            <>
              {' '}
              <span className="chystame-stav">Chystáme</span>
            </>
          )}
        </h3>
        <p className="tabor-kde">
          {venue
            ? sazba(`${venue.name}, ${venue.city}`)
            : 'Místo konání a cenu upřesníme spolu s termínem'}
        </p>
        {cena && (
          <p className="listek-cena">
            <b>{sazba(cena)}</b> za týden včetně oběda
          </p>
        )}
      </div>
      <TerminRadky turnusy={chysta ? turnusy : prodejne} mesto={mesto} className="listek-terminy terminy" />
    </article>
  )
}

function AktivniTema({ tabor }: { tabor: Tabor }) {
  const turnusy = getTurnusyByTabor(tabor.id).filter((t) => t.status !== 'uzavreno')
  const prodejne = turnusy.filter(isBookable)
  const zamereni = getFocusModules(tabor.focus)
  const vek = (turnusy[0]?.ageRange ?? '9-15').replace('-', '–')

  // Města: napřed ta, kde se dá přihlásit, potom ta, kde se termín chystá.
  const mesta = [...new Set(turnusy.map((t) => t.city))].sort(
    (a, b) =>
      Number(!turnusy.some((t) => t.city === a && isBookable(t))) -
      Number(!turnusy.some((t) => t.city === b && isBookable(t)))
  )
  const venues = [...new Set(prodejne.map((t) => t.venueId).filter((v) => v !== null))].map((id) =>
    getVenue(id)
  )
  const mestaBezMista = mesta.filter((m) => !venues.some((v) => v.cityId === m))

  const lektori = (tabor.lektori ?? [])
    .map((id) => TYM.find((c) => c.id === id)?.jmeno)
    .filter((j): j is string => Boolean(j))

  const ceny = [...new Set(prodejne.map((t) => t.priceKc).filter((c): c is number => c !== null))]
  const cena = ceny.length > 0 ? `${ceny.length > 1 ? 'od ' : ''}${Math.min(...ceny).toLocaleString('cs-CZ')} Kč` : null
  const jdePrihlasit = prodejne.length > 0
  const dotazy = dotazyTematu(tabor)

  return (
    <main id="obsah" className="w2">
      {/* ── Záhlaví: co to je, tři fakta, tlačítko ───────────────────── */}
      <section className="zahlavi dark mrizka">
        <Mrizka />
        <div className="wrap zahlavi-dva">
          <div>
            <Drobecky tabor={tabor} />
            <h1>{sazba(tabor.name)}</h1>
            <p className="zahlavi-perex">{sazba(tabor.popis)}</p>
            <ul className="vyhody">
              <li>
                <Ikona id="hodiny" />
                <b>{sazba(PROVOZNI_DOBA.rozsah)}</b>
                <span>pondělí až pátek</span>
              </li>
              <li>
                <Ikona id="lide" />
                <b>{sazba(`${vek} let`)}</b>
                <span>i úplní začátečníci</span>
              </li>
              <li>
                <Ikona id="pribor" />
                <b>S obědem</b>
                <span>i pitím a materiálem</span>
              </li>
            </ul>
            <div className="zahlavi-akce">
              <a className="btn btn-primary btn-lg" id="hlavni-cta" href="#terminy">
                {jdePrihlasit ? 'Vybrat termín' : 'Termíny'} <Ikona id="dolu" />
              </a>
              {maRecenze() && (
                <a className="hodn" href="#recenze">
                  <Hvezdy />
                  <b>{sazba(`${GOOGLE_PROFIL.prumer} z 5`)}</b>
                  <span>na Google</span>
                </a>
              )}
            </div>
          </div>
          {tabor.fotoHera && (
            <figure className="zahlavi-foto">
              <Image
                src={tabor.fotoHera.src}
                alt={tabor.fotoHera.alt}
                width={tabor.fotoHera.width}
                height={tabor.fotoHera.height}
                sizes="(min-width: 900px) 560px, 100vw"
                priority
              />
            </figure>
          )}
        </div>
      </section>

      {/* ── Termíny a ceny ───────────────────────────────────────────── */}
      <section className="sec sec-papir bez-linky" id="terminy">
        {/* Stará kotva: odkazy `…#turnusy` z dřívějška mají kam dopadnout. */}
        <span id="turnusy" />
        <div className="wrap">
          <div className="sec-head">
            <h2>{jdePrihlasit ? 'Termíny a ceny' : 'Termíny'}</h2>
            {!jdePrihlasit && (
              <p>
                Termíny na příští léto teprve vypisujeme. Nechte nám kontakt a ozveme se vám mezi
                prvními.
              </p>
            )}
          </div>
          {mesta.length > 0 ? (
            <div className="listky">
              {mesta.map((mesto) => (
                <Listek key={mesto} mesto={mesto} turnusy={turnusy.filter((t) => t.city === mesto)} />
              ))}
            </div>
          ) : (
            <TurnusInterestForm source={`tabor-${tabor.id}`} />
          )}
        </div>
      </section>

      {/* ── Co si postavíš ───────────────────────────────────────────── */}
      {zamereni.length > 0 && (
        <section className="sec" id="co-si-postavi">
          <div className="wrap">
            <div className="sec-head">
              <h2>Co si postavíš</h2>
              <p>
                Týden stojí na {naKolikaTematech(zamereni.length)}.{' '}
                {zamereni.length === 1 ? 'Končí' : 'Každé končí'} něčím, co uděláš sám.
              </p>
            </div>
            <div className={`co-postavi${zamereni.length === 1 ? ' jedno' : ''}`}>
              {zamereni.map((z) => {
                const text = (
                  <>
                    <h3>{z.name}</h3>
                    <p>{sazba(z.short)}</p>
                    <ul className="zaskrt tech" style={zamereni.length === 1 ? { marginTop: 12 } : undefined}>
                      {z.tryOut.map((bod) => (
                        <li key={bod}>
                          <Ikona id="ok" />
                          <span>{sazba(bod)}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )
                return (
                  <article key={z.id}>
                    {z.foto && (
                      <Image
                        src={z.foto.src}
                        alt={z.foto.alt}
                        width={1200}
                        height={800}
                        sizes="(min-width: 760px) 560px, 100vw"
                        loading="lazy"
                      />
                    )}
                    {zamereni.length === 1 ? <div>{text}</div> : text}
                  </article>
                )
              })}
            </div>
            {tabor.vyrobky && tabor.vyrobky.length > 0 && (
              <>
                <h3 className="podnadpis">Výrobky z tábora</h3>
                <div className="vyrobky" id="odnese">
                  {tabor.vyrobky.map((v) => (
                    <figure key={v.src}>
                      <Image
                        src={v.src}
                        alt={v.alt}
                        width={v.width}
                        height={v.height}
                        sizes="(min-width: 760px) 280px, 50vw"
                        loading="lazy"
                      />
                      <figcaption>{sazba(v.popisek)}</figcaption>
                    </figure>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ── Týden ────────────────────────────────────────────────────── */}
      {tabor.program && (
        <section className="sec bez-linky dark mrizka sec-tyden" id="tyden">
          <div className="wrap">
            <div className="sec-head">
              <h2>Jak vypadá týden</h2>
              <p>Projekty na sebe navazují. Co dítě v pondělí začne, to v pátek dokončí.</p>
            </div>
            <ol className="dny">
              {tabor.program.map((den) => (
                <li key={den.den}>
                  <div className="dny-hl">
                    <span className="dny-den">{ZKRATKY_DNU[den.den] ?? den.den}</span>
                    <span className="dny-ik">
                      <Ikona id={IKONA_DNE[den.ikona]} />
                    </span>
                  </div>
                  <h3>{sazba(den.kratce)}</h3>
                  <p>{sazba(den.shrnuti)}</p>
                </li>
              ))}
            </ol>
            {lektori.length > 0 && (
              <p className="lektor">
                {lektori.length === 1 ? 'Hlavní lektor' : 'Lektoři'}:{' '}
                <Link className="link" href="/o-nas">
                  {lektori.join(', ')}
                </Link>
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Den ──────────────────────────────────────────────────────── */}
      {tabor.program && <Rozvrh />}

      <PasFoto foto={tabor.fotoPas} />

      {/* ── Kde tábor běží ───────────────────────────────────────────── */}
      {venues.length > 0 && (
        <section className="sec bez-linky" id="misto">
          {venues.map((venue, i) => (
            <div
              key={venue.id}
              className={`wrap misto-grid${tridaMista(venue)}`}
              style={i > 0 ? { marginTop: 40 } : undefined}
            >
              <div>
                {i === 0 && <h2>Kde tábor běží</h2>}
                <h3 className="podnadpis" style={i === 0 ? { marginTop: 16 } : undefined}>
                  {sazba(`${venue.fullName}, ${getCity(venue.cityId).name}`)}
                </h3>
                <p>{sazba(venue.description)}</p>
                <p>{sazba(`${venue.vybaveni}.`)}</p>
                <a
                  className="adresa link"
                  href={`https://www.google.com/maps/search/?api=1&query=${venue.mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Ikona id="misto" /> {sazba(`${venue.street}, ${venue.city}`)}
                </a>
                {i === venues.length - 1 &&
                  mestaBezMista.map((m) => (
                    <p className="pozn" key={m}>
                      {getCity(m).name}: místo konání upřesníme spolu s termínem.
                    </p>
                  ))}
              </div>
              <MistoFoto venue={venue} />
            </div>
          ))}
        </section>
      )}

      <RecenzeSekce tabor={tabor.id} poznamka={tabor.poznamkaKRecenzim} />

      {/* ── Dotazy ───────────────────────────────────────────────────── */}
      <section className="sec sec-faq" id="faq">
        <div className="wrap bok">
          <div className="sec-head">
            <h2>Časté dotazy rodičů</h2>
          </div>
          <Faq dotazy={dotazy} />
          <p className="faq-dal">
            <Link className="link" href="/#faq">
              Všechny dotazy
            </Link>{' '}
            ·{' '}
            <Link className="link" href="/kontakt">
              Kontaktujte nás
            </Link>
          </p>
        </div>
      </section>

      {/* ── Závěrečná výzva ──────────────────────────────────────────── */}
      <section className="zaver amber vz vz-zaver" id="zaverecna-vyzva">
        <div className="wrap zaver-cta">
          <div>
            <h2>
              {jdePrihlasit
                ? 'Přihlaste dítě, dokud jsou volná místa'
                : 'Chcete vědět o termínech mezi prvními?'}
            </h2>
          </div>
          <a className="btn btn-dark btn-lg" href="#terminy">
            {jdePrihlasit ? 'Vybrat termín' : 'Nechat kontakt'} <Ikona id="sipka" />
          </a>
        </div>
      </section>

      <KupLista
        nadpis={cena ? `${cena} za týden` : tabor.shortName}
        podnadpis={cena ? 'Oběd v ceně' : undefined}
        ctaText={jdePrihlasit ? 'Vybrat termín' : 'Termíny'}
        href="#terminy"
        sleduj={['hlavni-cta', 'terminy', 'zaverecna-vyzva']}
      />
    </main>
  )
}

/**
 * Tábor, který se teprve chystá: záměr, sběr kontaktu a odkaz na tábory, na
 * které se přihlásit dá. Program, termín, cena ani vybavení tu nejsou — nic
 * z toho není potvrzené (viz komentář nad `TABORY`).
 */
function ChystaneTema({ tabor }: { tabor: Tabor }) {
  const bezici = getAktivniTabory().flatMap((t) => {
    const prodejne = getTurnusyByTabor(t.id).filter(isBookable)
    return [...new Set(prodejne.map((x) => x.city))].map((mesto) => ({
      tabor: t,
      mesto,
      turnusy: prodejne.filter((x) => x.city === mesto),
    }))
  })

  return (
    <main id="obsah" className="w2">
      <section className="zahlavi dark mrizka">
        <Mrizka />
        <div className="wrap">
          <Drobecky tabor={tabor} />
          <p className="chystame-stav" style={{ marginTop: 12 }}>
            Chystáme
          </p>
          <h1 style={{ marginTop: 12 }}>{sazba(tabor.name)}</h1>
          <p className="zahlavi-perex" style={{ maxWidth: 720 }}>
            {sazba(tabor.popis)}
          </p>
          <div className="zahlavi-akce">
            <a className="btn btn-primary btn-lg" id="hlavni-cta" href="#zajem">
              Dát vědět, až ho otevřeme <Ikona id="dolu" />
            </a>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <h2>Co si dítě zkusí</h2>
            <p>
              Program, termín ani cenu zatím nemáme potvrzené. Jakmile budou, najdete je tady jako
              první.
            </p>
          </div>
          <ul className="zaskrt tech" style={{ maxWidth: 720 }}>
            {zkusiSiTabora(tabor).map((bod) => (
              <li key={bod}>
                <Ikona id="ok" />
                <span>{sazba(bod)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec sec-papir bez-linky">
        <div className="wrap">
          <TurnusInterestForm source={`tabor-${tabor.id}`} />
        </div>
      </section>

      {bezici.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <h2>Tábory, na které se přihlásit dá</h2>
            </div>
            <div className={`tabory${bezici.length === 1 ? ' jedna' : ''}`}>
              {bezici.map((b) => (
                <TaborKarta key={`${b.tabor.id}-${b.mesto}`} tabor={b.tabor} mesto={b.mesto} turnusy={b.turnusy} />
              ))}
            </div>
          </div>
        </section>
      )}

      <KupLista
        nadpis={tabor.shortName}
        podnadpis="Tábor chystáme"
        ctaText="Dát vědět"
        href="#zajem"
        sleduj={['hlavni-cta', 'zajem']}
      />
    </main>
  )
}
