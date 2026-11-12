import Link from 'next/link'
import { Faq } from '@/components/w2/Faq'
import { MistoFoto, tridaMista } from '@/components/w2/MistoFoto'
import { Hvezdy, Ikona } from '@/components/w2/Ikona'
import { KupLista } from '@/components/w2/KupLista'
import { RecenzeSekce, recenzeNaKarty } from '@/components/w2/RecenzeKarty'
import { TaborKarta } from '@/components/w2/TaborKarta'
import { IKONA_DNE, ZKRATKY_DNU } from '@/components/w2/dny'
import { rozsahTesne, sazba, telefonSazba } from '@/components/w2/text'
import { getCity, getVenue } from '@/lib/cities'
import { formatDatumCs } from '@/lib/dates'
import { GOOGLE_PROFIL, maRecenze } from '@/lib/recenze'
import { MIMO_CENU, PROVOZNI_DOBA, SITE, V_CENE_DLAZDICE, getSiteFaq } from '@/lib/site'
import { getAktivniTabory, type TaborId } from '@/lib/tabory'
import { TYM } from '@/lib/tym'
import { getTaboryTurnusu, getTurnusyByTabor, isBookable, type Turnus } from '@/lib/turnusy'
import { zruseniZdarmaDo } from '@/lib/zaloha'
import { NakupniBox, type VariantaTerminu } from './NakupniBox'
import { TerminGalerie, type FotkaGalerie } from './TerminGalerie'
import { TurnusInterestForm } from './TurnusInterestForm'
import { ZaverecneTlacitko } from './ZaverecneTlacitko'
import { datumCesky, datumKratce, turnusLabels } from './turnus-labels'

/**
 * Stránka termínu (redesign, listopad 2026).
 *
 * Termín je to, co se na webu prodává. Nahoře tmavý blok s názvem, datem,
 * fotkami a nákupním boxem — cena i tlačítko jsou na mobilu na první
 * obrazovce. Pod ním jen to, co rodič potřebuje k rozhodnutí o TOMHLE
 * termínu: týden v pěti kartách, co je v ceně, důležitá data se zárukou,
 * průběh přihlášky, místo, recenze, dotazy.
 *
 * Popis tábora se sem pořád neopisuje — žije na stránce tématu. Tady jsou
 * z něj dvě tři věty (`tabor.proTermin`) a názvy dnů, ne odstavce, takže
 * vedle sebe nestojí dvě skoro shodné stránky.
 */

/**
 * Fotky podle tématu. Jen snímky z táborů Weeks; fotka místa konání má
 * vlastní sekci. Tábor bez vlastního seznamu dostane společnou fotku.
 *
 * Společná fotka z terasy je upravená (dítě uprostřed nahrazeno), fotka
 * herního tábora také (obrazovky a dítě uprostřed). Popisky proto říkají jen
 * to, co je na snímku vidět — netvrdí, že jde o záběr z herního tábora, který
 * se ještě nekonal.
 */
const FOTKA_SPOLECNA: FotkaGalerie = {
  src: '/images/tabor/skupina-terasa-2.webp',
  alt: 'Děti z tábora Weeks s lektory na terase',
}

const FOTKY_PODLE_TABORA: Partial<Record<TaborId, FotkaGalerie[]>> = {
  'chytre-technologie': [
    {
      src: '/images/tabor/hero-dilna.webp',
      alt: 'Děti a lektoři v dílně u 3D tiskáren, na plátně promítnuté logo Weeks',
    },
    {
      src: '/images/tabor/u-pocitace-slicer.webp',
      alt: 'Děti u monitoru s modelem připraveným k tisku v PrusaSliceru',
    },
    {
      src: '/images/tabor/iot-led-palec.webp',
      alt: 'Chlapec u stolu ukazuje palec nahoru, před ním nepájivé pole s rozsvícenými LED diodami a Arduino',
    },
    {
      src: '/images/tabor/arduino-ruce.webp',
      alt: 'Ruce zapojují součástky do nepájivého pole u desky Arduino',
    },
    {
      src: '/images/tabor/fablab-prazdna-stoly.webp',
      alt: 'Stoly s monitory a regály s technikou ve FabLabu',
    },
  ],
  'game-dev': [
    {
      src: '/images/tabor/gd-deti-u-pocitacu.webp',
      alt: 'Děti zezadu u tří počítačů: na monitorech editor kódu, rozehraná 2D hra a editor scény',
    },
    {
      src: '/images/tabor/gd-hra-mince.webp',
      alt: 'Ukázka 2D hry v Godotu: postavička sbírá mince na plošinách',
    },
    FOTKA_SPOLECNA,
  ],
}

/** Dotazy, které se týkají přihlášky a placení — zbytek je na úvodní stránce. */
const DOTAZY_TERMINU = [
  'Co má dítě mít s sebou?',
  'Je zajištěn oběd pro děti s alergiemi?',
  'Jak probíhá platba?',
  'Můžu zaplatit zálohu?',
]

/** „Svačiny — dopolední…“ a „Doprava…“ → jedna věta s malými písmeny. */
function vetaMimoCenu(): string {
  const casti = MIMO_CENU.map((p) => {
    const [co, ...zbytek] = p.split(' — ')
    const mala = co.charAt(0).toLowerCase() + co.slice(1)
    return zbytek.length ? `${mala} (${zbytek.join(' — ')})` : mala
  })
  return `${casti.slice(0, -1).join(', ')}${casti.length > 1 ? ' a ' : ''}${casti[casti.length - 1]}.`
}

export function TerminDetail({ turnus }: { turnus: Turnus }) {
  const l = turnusLabels(turnus)
  const tabor = getTaboryTurnusu(turnus)[0]
  const venue = turnus.venueId ? getVenue(turnus.venueId) : null
  const prodejny = isBookable(turnus)
  const datum = rozsahTesne(l.datum)

  // Přepínač termínů: stejné téma, stejné město. Jiná města jen jako odkazy.
  const tematickeTurnusy = tabor ? getTurnusyByTabor(tabor.id) : [turnus]
  const kratce = (t: Turnus) =>
    t.start && t.end ? `${datumKratce(t.start, t.end)} ${t.end.slice(0, 4)}` : 'termín upřesníme'
  const varianty: VariantaTerminu[] = tematickeTurnusy
    .filter((t) => t.city === turnus.city)
    .map((t) => ({ id: t.id, slug: t.slug, label: kratce(t), aktualni: t.id === turnus.id }))
  const jinde: VariantaTerminu[] = tematickeTurnusy
    .filter((t) => t.city !== turnus.city)
    .map((t) => ({
      id: t.id,
      slug: t.slug,
      label: `${getCity(t.city).name} ${t.start ? kratce(t) : '(chystáme)'}`,
      aktualni: false,
    }))

  const fotky = (tabor && FOTKY_PODLE_TABORA[tabor.id]) || [FOTKA_SPOLECNA]
  const citace = maRecenze() ? recenzeNaKarty(tabor?.id).find((r) => r.text) : undefined
  const lektor = tabor?.lektori?.map((id) => TYM.find((c) => c.id === id)?.jmeno).find(Boolean)

  // Další tábory: ostatní běžící témata, každé ve městech, kde se dá přihlásit.
  const dalsi = getAktivniTabory()
    .filter((t) => t.id !== tabor?.id)
    .flatMap((t) => {
      const prodejne = getTurnusyByTabor(t.id).filter(isBookable)
      return [...new Set(prodejne.map((x) => x.city))].map((mesto) => ({
        tabor: t,
        mesto,
        turnusy: prodejne.filter((x) => x.city === mesto),
      }))
    })

  // Důležitá data, seřazená podle kalendáře. Jsou to fakta o termínu, ne
  // odpočet — stránka je statická, takže nic neporovnává s dneškem.
  const milniky = prodejny
    ? [
        turnus.zaloha && {
          kdy: turnus.zaloha.doplatekDo,
          datum: `do ${formatDatumCs(turnus.zaloha.doplatekDo)}`,
          co: `doplatek, pokud platíte zálohu ${turnus.zaloha.castkaKc.toLocaleString('cs-CZ')} Kč`,
        },
        turnus.start && {
          kdy: zruseniZdarmaDo(turnus.start),
          datum: `do ${formatDatumCs(zruseniZdarmaDo(turnus.start))}`,
          co: 'zrušení zdarma',
        },
        turnus.minimum && {
          kdy: turnus.minimum.rozhodnemeDo,
          datum: `do ${formatDatumCs(turnus.minimum.rozhodnemeDo)}`,
          co: 'rozhodneme, jestli se tábor koná',
        },
        turnus.start && {
          kdy: turnus.start,
          datum: formatDatumCs(turnus.start),
          co: 'tábor začíná',
          cil: true,
        },
      ]
        .filter((m): m is { kdy: string; datum: string; co: string; cil?: boolean } => Boolean(m))
        .sort((a, b) => a.kdy.localeCompare(b.kdy))
    : []

  // Řádek pod cenou ve spodní liště. Název tábora jen tehdy, když se celý
  // řádek vejde na 390 px na jeden řádek — jinak stačí město a datum.
  const kdeKdy =
    prodejny && turnus.start && turnus.end ? `${l.mesto} · ${datumKratce(turnus.start, turnus.end)}` : l.mesto
  const sNazvem = tabor ? `${tabor.shortName} · ${kdeKdy}` : kdeKdy
  const podnadpisListy = sNazvem.length <= 34 ? sNazvem : kdeKdy

  const dotazy = getSiteFaq().filter((d) => DOTAZY_TERMINU.includes(d.question))
  const vek = turnus.ageRange.replace('-', '–')

  return (
    <main id="obsah" className="w2">
      {/* ── Název, fotky a nákupní box ───────────────────────────────── */}
      <div className="detail dark mrizka">
        <div className="wrap">
          <nav className="drob" aria-label="Drobečková navigace">
            <Link href="/">Domů</Link> <span aria-hidden="true">/</span>{' '}
            <Link href="/tabory">Tábory</Link>
            {tabor && (
              <>
                {' '}
                <span aria-hidden="true">/</span> <Link href={`/tabory/${tabor.id}`}>{tabor.name}</Link>
              </>
            )}
          </nav>
          <div className="detail-nahore">
            <div className="detail-vlevo">
              <div className="titul">
                <h1>{sazba(tabor ? tabor.name : 'Letní příměstský tábor')}</h1>
                <p className="titul-radek">
                  {sazba(`${datum} · ${l.mesto}${venue ? `, ${venue.name}` : ''}`)}
                </p>
                <p className="titul-meta">
                  {sazba(`Pondělí až pátek ${PROVOZNI_DOBA.rozsah} · pro děti ${vek} let`)}
                </p>
                {maRecenze() && (
                  <a className="hodn" href="#recenze">
                    <Hvezdy />
                    <b>{sazba(`${GOOGLE_PROFIL.prumer} z 5`)}</b>
                    <span>hodnocení Weeks na Google</span>
                  </a>
                )}
              </div>
              <TerminGalerie fotky={fotky} />
              {tabor?.proTermin && (
                <div className="titul-dalsi">
                  <p className="titul-veta">{sazba(tabor.proTermin)}</p>
                </div>
              )}
            </div>
            <div className="detail-vpravo">
              <NakupniBox
                turnus={turnus}
                cena={l.cena}
                stav={l.stav}
                ctaText={l.ctaText}
                ctaHref={l.ctaHref}
                varianty={varianty}
                jinde={jinde}
              />
              {citace && (
                <figure className="box-citat">
                  <Hvezdy pocet={citace.hvezdicky} />
                  <blockquote>
                    <p>„{sazba(citace.text ?? '')}“</p>
                  </blockquote>
                  <figcaption>
                    <b>{citace.autor}</b> · Google{citace.kdy ? `, ${citace.kdy}` : ''}
                    {tabor?.poznamkaKRecenzim && !citace.tabor && (
                      <span className="box-citat-pozn">{sazba(tabor.poznamkaKRecenzim)}</span>
                    )}
                  </figcaption>
                </figure>
              )}
              <p className="box-pomoc-radek">
                Máte k táboru otázku?{' '}
                <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{telefonSazba(SITE.phone)}</a> ·{' '}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chystaný turnus: formulář zájmu hned pod úvodem, sem míří tlačítko
          „Dát vědět, až otevřeme“. */}
      {!prodejny && (
        <section className="sec bez-linky">
          <div className="wrap">
            <TurnusInterestForm turnus={turnus} source={`turnus-${turnus.slug}`} />
          </div>
        </section>
      )}

      {/* ── Týden v kostce ───────────────────────────────────────────── */}
      {tabor?.program && (
        <section className="sec sec-papir bez-linky" id="program">
          <div className="wrap">
            <div className="sec-head sec-head-rada">
              <h2>Týden v kostce</h2>
              <Link className="link" href={`/tabory/${tabor.id}#tyden`}>
                Celý program a rozvrh dne <Ikona id="sipka" />
              </Link>
            </div>
            <ol className="dny dny-svetle dny-kratke">
              {tabor.program.map((den) => (
                <li key={den.den}>
                  <div className="dny-hl">
                    <span className="dny-den">{ZKRATKY_DNU[den.den] ?? den.den}</span>
                    <span className="dny-ik">
                      <Ikona id={IKONA_DNE[den.ikona]} />
                    </span>
                  </div>
                  <h3>{sazba(den.kratce)}</h3>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── Co je v ceně ─────────────────────────────────────────────── */}
      {turnus.priceKc !== null && (
        <section className="vcene" id="v-cene">
          <div className="wrap">
            <h2>Co je v ceně</h2>
            <ul className="vcene-in">
              {V_CENE_DLAZDICE.map((d) => (
                <li key={d.text}>
                  <span className="usp-ik">
                    <Ikona id={d.ikona} />
                  </span>
                  <b>{sazba(d.text)}</b>
                </li>
              ))}
              {tabor?.odneseKratce && (
                <li>
                  <span className="usp-ik">
                    <Ikona id={tabor.id === 'game-dev' ? 'hra' : 'hvezda'} />
                  </span>
                  <b>{sazba(tabor.odneseKratce)}</b>
                </li>
              )}
            </ul>
            <p className="vcene-neni">
              <b>Není v ceně:</b> {sazba(vetaMimoCenu())}
            </p>
          </div>
        </section>
      )}

      {/* ── Důležitá data a záruka ───────────────────────────────────── */}
      {milniky.length > 0 && (
        <section className="sec bez-linky" id="zaruka">
          <div className="wrap">
            <div className="sec-head">
              <h2>Důležitá data</h2>
            </div>
            <ol className="milniky">
              {milniky.map((m) => (
                <li key={m.co} className={m.cil ? 'cil' : undefined}>
                  <b>{sazba(m.datum)}</b>
                  <span>{sazba(m.co)}</span>
                </li>
              ))}
            </ol>
            {turnus.minimum && (
              <div className="zaruka">
                <span className="zaruka-ik">
                  <Ikona id="stit" />
                </span>
                <div>
                  <h3>Když se tábor nenaplní</h3>
                  <p>
                    {sazba(
                      `Tábor se koná, když se přihlásí aspoň ${turnus.minimum.deti} dětí. Rozhodneme o tom do ${datumCesky(turnus.minimum.rozhodnemeDo)} a dáme vám vědět. Když se nekoná, nabídneme vám přesun na jiný termín, nebo vrátíme celou platbu.`
                    )}
                  </p>
                  <Link className="link" href="/podminky">
                    Obchodní podmínky, čl. 22
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Jak přihláška probíhá ────────────────────────────────────── */}
      {prodejny && (
        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <h2>Jak přihláška probíhá</h2>
            </div>
            <ol className="kroky">
              <li>
                <div>
                  <b>Vyplníte přihlášku</b>
                  <span>Údaje o dítěti a o vás. Na alergie a stravování se ptáme rovnou.</span>
                </div>
              </li>
              <li>
                <div>
                  <b>{turnus.zaloha ? 'Zaplatíte celou částku, nebo zálohu' : 'Zaplatíte převodem'}</b>
                  <span>
                    {sazba('Zrychleným bankovním převodem přes platební bránu Comgate, hned při přihlášce.')}
                  </span>
                </div>
              </li>
              <li>
                <div>
                  <b>Dostanete fakturu</b>
                  <span>
                    {sazba('E-mailem do 14 dnů od platby. Před táborem pošleme vše potřebné k nástupu.')}
                  </span>
                </div>
              </li>
            </ol>
            <p className="pozn">
              {sazba(
                `Tábor pořádá ${SITE.legalName}, IČO ${SITE.ico}${lektor ? `, hlavní lektor je ${lektor}` : ''}. Lektoři jsou proškolení v první pomoci.`
              )}
            </p>
          </div>
        </section>
      )}

      {/* ── Místo konání ─────────────────────────────────────────────── */}
      {venue && (
        <section className="sec" id="misto">
          <div className={`wrap misto-grid${tridaMista(venue)}`}>
            <div>
              <h2>{sazba(venue.fullName)}</h2>
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
        </section>
      )}

      <RecenzeSekce tabor={tabor?.id} poznamka={tabor?.poznamkaKRecenzim} />

      {/* ── Další tábory ─────────────────────────────────────────────── */}
      {dalsi.length > 0 && (
        <section className="sec bez-linky">
          <div className="wrap">
            <div className="sec-head">
              <h2>Další tábory Weeks</h2>
            </div>
            <div className={`tabory${dalsi.length === 1 ? ' jedna' : ''}`}>
              {dalsi.map((d) => (
                <TaborKarta key={`${d.tabor.id}-${d.mesto}`} tabor={d.tabor} mesto={d.mesto} turnusy={d.turnusy} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Dotazy ───────────────────────────────────────────────────── */}
      {dotazy.length > 0 && (
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
      )}

      {/* ── Závěrečná výzva ──────────────────────────────────────────── */}
      {prodejny && l.ctaHref && (
        <section className="zaver amber vz vz-zaver" id="zaverecna-vyzva">
          <div className="wrap zaver-cta">
            <div>
              <h2>Přihlaste dítě na léto</h2>
              <p>{sazba(`${tabor ? tabor.name : 'Letní příměstský tábor'}, ${l.mesto}, ${datum}.`)}</p>
            </div>
            <ZaverecneTlacitko href={l.ctaHref} text={l.ctaText} termId={turnus.id} />
          </div>
        </section>
      )}

      <KupLista
        nadpis={prodejny ? l.cena : 'Termín upřesníme'}
        podnadpis={podnadpisListy}
        ctaText={prodejny ? l.ctaText : 'Dát vědět'}
        href={prodejny && l.ctaHref ? l.ctaHref : '#zajem'}
        sleduj={['hlavni-cta', 'zajem', 'zaverecna-vyzva']}
        termId={prodejny ? turnus.id : undefined}
      />
    </main>
  )
}
