import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Ikona, type IkonaId } from '@/components/w2/Ikona'
import { MistoFoto, tridaMista } from '@/components/w2/MistoFoto'
import { Mrizka } from '@/components/w2/Mrizka'
import { Usp } from '@/components/w2/Usp'
import { sazba, telefonSazba } from '@/components/w2/text'
import { getCity, getVenue, type VenueId } from '@/lib/cities'
import { GOOGLE_PROFIL, maRecenze } from '@/lib/recenze'
import { SITE } from '@/lib/site'
import { getTurnusy } from '@/lib/turnusy'
import { TYM, roleClena, type IkonaOboru } from '@/lib/tym'

/**
 * O nás (nový vzhled, vlna 2).
 *
 * Stránka o lidech, ne o prodeji: kdo Weeks dělá, jak vzniklo, kdo za co
 * odpovídá a kde tábory běží. Serverová a statická; drobečkové schema
 * vykresluje `layout.tsx`.
 *
 * Co tu schválně není (viz CLAUDE.md, „Team“): poměr lektorů na děti, strop
 * kapacity ani věta, že zakladatelé učí na každém turnusu. Bezpečnost
 * nepopisuje vlastní odstavec, ale stejný pás „Co máte jisté“ jako na úvodní
 * stránce (`Usp`) — jedno místo, kde jsou ty sliby napsané.
 */

/** Na čem programu záleží. Zkrácená podoba dřívějších „hodnot“. */
const HODNOTY: Array<{ ikona: IkonaId; nadpis: string; text: string }> = [
  {
    ikona: 'cil',
    nadpis: 'Praxe místo výkladu',
    text: 'Každý projekt končí věcí, kterou dítě ukáže doma.',
  },
  {
    ikona: 'lide',
    nadpis: 'Malé skupinky',
    text: 'Tempo přizpůsobujeme tomu, kdo zrovna sedí u stolu.',
  },
  {
    ikona: 'zarovka',
    nadpis: 'Vlastní nápady',
    text: 'Nejlepší projekty vznikají, když mají děti volnost zkoušet.',
  },
  {
    ikona: 'srdce',
    nadpis: 'Práce v týmu',
    text: 'Děti si radí a pomáhají, stejně jako v opravdovém vývoji.',
  },
]

/** Nezlomitelná mezera: „3D tisk“ se nesmí rozdělit na dva řádky. */
const NBSP = String.fromCharCode(160)

// Tým bydlí v `src/lib/tym.ts` — tam se přidávají další lektoři.
const IKONY_OBORU: Record<IkonaOboru, IkonaId> = {
  stan: 'stan',
  code: 'kod',
  box: 'krabice',
  hra: 'hra',
}

export default function AboutPage() {
  // Místa konání — jen ta, která nějaký turnus doopravdy má.
  const venues = Array.from(
    new Set(
      getTurnusy()
        .map((t) => t.venueId)
        .filter((id): id is VenueId => id !== null)
    )
  ).map((id) => getVenue(id))

  return (
    <>
      <Header vToku />
      <main id="obsah" className="w2">
        {/* ── Záhlaví ──────────────────────────────────────────────────── */}
        <section className="zahlavi dark mrizka">
          <Mrizka />
          <div className="wrap zahlavi-dva">
            <div>
              <nav className="drob" aria-label="Drobečková navigace">
                <Link href="/">Domů</Link> <span aria-hidden="true">/</span> <span>O nás</span>
              </nav>
              <h1>Kdo za Weeks stojí</h1>
              <p className="zahlavi-perex">
                {sazba(
                  'Tři spolužáci, kteří učí děti techniku a staví weby. Program táborů si vymýšlíme sami, od tématu po poslední den.'
                )}
              </p>
              <ul className="vyhody">
                <li>
                  <Ikona id="tuzka" />
                  <b>Program</b>
                  <span>píšeme si ho sami</span>
                </li>
                <li>
                  <Ikona id="lide" />
                  <b>Skupinky</b>
                  <span>malé, na každého je čas</span>
                </li>
                {maRecenze() && GOOGLE_PROFIL.url ? (
                  <li>
                    <Ikona id="hvezda" />
                    <b>{sazba(`${GOOGLE_PROFIL.prumer} z 5`)}</b>
                    <span>hodnocení na Google</span>
                  </li>
                ) : (
                  <li>
                    <Ikona id="stit" />
                    <b>První pomoc</b>
                    <span>lektoři jsou proškolení</span>
                  </li>
                )}
              </ul>
              <div className="zahlavi-akce">
                <a className="btn btn-primary btn-lg" href="#tym">
                  Poznat tým <Ikona id="dolu" />
                </a>
              </div>
            </div>
            <figure className="zahlavi-foto jen-desktop">
              <Image
                src="/images/tabor/skupina-terasa-2.webp"
                alt="Děti z tábora Weeks s lektory na terase"
                width={1600}
                height={1200}
                sizes="(min-width: 900px) 560px, 1px"
                loading="lazy"
              />
            </figure>
          </div>
        </section>

        {/* ── Příběh a hodnoty ─────────────────────────────────────────── */}
        {/* Bez „chtěli jsme dělat něco na sebe“ — to je důvod pro nás, ne pro
            rodiče. A bez „jednatelé a zároveň lektoři“: s víc turnusy a lektory
            to platit nebude (2026-09-28). */}
        <section className="sec sec-papir bez-linky">
          <div className="wrap dva">
            <div className="text">
              <h2>Ze spolužáků vlastní tábor</h2>
              <p>
                {sazba(
                  'Kryštof, Lukáš a Štěpán se znají ze Smíchovské průmyslovky a dnes spolu studují aplikovanou informatiku na VŠE. Kryštof se Štěpánem léta učí děti techniku jako lektoři, Lukáš staví weby a aplikace.'
                )}
              </p>
              <p>
                {sazba(
                  'O IT toho víme dost a umíme to předat dál — tak vzniklo Weeks. Na co se zeptáte, řešíte přímo s námi.'
                )}
              </p>
            </div>
            <div>
              <h2 className="podnadpis" style={{ marginTop: 0 }}>
                Na čem nám záleží
              </h2>
              <ul className="hodnoty r-indigo">
                {HODNOTY.map((h) => (
                  <li key={h.nadpis}>
                    <span className="karta-ik">
                      <Ikona id={h.ikona} />
                    </span>
                    <b>{h.nadpis}</b>
                    <span>{sazba(h.text)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Usp />

        {/* ── Tým ──────────────────────────────────────────────────────── */}
        <section className="sec dark mrizka bez-linky" id="tym">
          <Mrizka />
          <div className="wrap">
            <div className="sec-head">
              <h2>Tým</h2>
              <p>
                {sazba('Na všem děláme společně, ale každý za něco odpovídá. Napište rovnou tomu, kdo to má na starosti.')}
              </p>
            </div>
            <ul className="lide">
              {TYM.map((clen) => (
                <li className="clen" key={clen.id}>
                  {/* Fotka, a dokud není, ikona oboru. */}
                  <span className="clen-foto">
                    {clen.foto ? (
                      <Image src={clen.foto} alt="" width={112} height={112} loading="lazy" />
                    ) : (
                      <Ikona id={IKONY_OBORU[clen.ikona]} />
                    )}
                  </span>
                  <h3>{clen.jmeno}</h3>
                  <p className="clen-role">{sazba(`${roleClena(clen)} · ${clen.obor}`).replace(/3D /g, '3D' + NBSP)}</p>
                  {/* Komu co napsat — kvůli tomu hlavně rodič nebo firma na
                      tuhle kartu přijde, proto stojí hned pod jménem. */}
                  {clen.naStarosti && (
                    <p className="clen-starost">
                      Má na starosti <b>{clen.naStarosti}</b>
                    </p>
                  )}
                  <p className="clen-popis">{sazba(clen.popis)}</p>
                  {(clen.email || clen.telefon || clen.linkedin) && (
                    <div className="clen-odkazy">
                      {clen.email && (
                        <a href={`mailto:${clen.email}`}>
                          <Ikona id="mail" /> {clen.email}
                        </a>
                      )}
                      {clen.telefon && (
                        <a href={`tel:${clen.telefon.replace(/\s/g, '')}`}>
                          <Ikona id="tel" /> {telefonSazba(clen.telefon)}
                        </a>
                      )}
                      {clen.linkedin && (
                        <a
                          href={clen.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${clen.jmeno} na LinkedInu (otevře se v nové záložce)`}
                        >
                          <Ikona id="linkedin" /> LinkedIn
                        </a>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Místa konání ─────────────────────────────────────────────── */}
        {/* Místa jsou odvozená z termínů: kde žádný termín místo nemá, sekce
            se nevykreslí. Jsou to prostory, které si pronajímáme, ne partneři. */}
        {venues.length > 0 && (
          <section className="sec bez-linky" id="mista">
            <div className="wrap">
              <div className="sec-head">
                <h2>Kde tábory běží</h2>
                <p>
                  {sazba(
                    'V létě 2026 jsme tábor pořádali ve FabLabu VARY&TE v Karlových Varech a v létě 2027 se tam vracíme.'
                  )}
                </p>
              </div>
            </div>
            <div className="mista">
              {venues.map((venue) => (
                <div key={venue.id} className={`wrap misto-grid${tridaMista(venue)}`}>
                  <div>
                    <h3>{sazba(`${venue.fullName}, ${getCity(venue.cityId).name}`)}</h3>
                    <p style={{ marginTop: 8 }}>{sazba(venue.description)}</p>
                    <p>{sazba(`${venue.vybaveni}.`)}</p>
                    <a
                      className="adresa link"
                      href={`https://www.google.com/maps/search/?api=1&query=${venue.mapQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Ikona id="misto" /> {sazba(`${venue.street}, ${venue.city}`)}
                    </a>
                  </div>
                  <MistoFoto venue={venue} />
                </div>
              ))}
            </div>
            <div className="wrap">
              <p className="pozn">
                Tábory pořádá {SITE.legalName}, IČO {SITE.ico}.
              </p>
            </div>
          </section>
        )}

        {/* ── Závěr ────────────────────────────────────────────────────── */}
        <section className="zaver amber vz vz-zaver">
          <div className="wrap">
            <div className="zaver-in">
              <h2>Chcete se na něco zeptat?</h2>
              <p>{sazba('Na program, bezpečnost i přihlášku odpovídáme sami.')}</p>
              <div className="zaver-akce">
                <Link className="btn btn-dark btn-lg" href="/kontakt">
                  Napsat nebo zavolat <Ikona id="sipka" />
                </Link>
                <Link className="btn btn-outline btn-lg" href="/tabory">
                  Vybrat tábor
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
