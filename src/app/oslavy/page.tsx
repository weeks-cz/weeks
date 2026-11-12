import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { OslavaPoptavka } from '@/components/oslavy/OslavaPoptavka'
import { Ikona, type IkonaId } from '@/components/w2/Ikona'
import { Mrizka } from '@/components/w2/Mrizka'
import { sazba } from '@/components/w2/text'
import { MISTA, POTREBUJEME, PRIKLADY, PRUBEHY, ZAJISTIME } from '@/lib/oslavy'
import { SITE } from '@/lib/site'

/**
 * `/oslavy` — narozeniny a akce pro děti (nový vzhled, vlna 2).
 *
 * Rodiče se na oslavu ptali sami, aniž by ji web nabízel; nejbližší stránka
 * `/firmy` mluví na HR oddělení a o zaměstnaneckých benefitech. Spec:
 * `docs/superpowers/specs/2026-09-22-oslavy-design.md`.
 *
 * Stránka schválně **neprodává balíčky**. Ukazuje příklady, jak to může
 * vypadat, a zbytek nechává na poptávce — pevné varianty by musely říct, čím
 * se liší (délkou, počtem dětí, cenou), a to jsou údaje, které nikdo
 * nepotvrdil. Veškerý text nabídky bydlí v `src/lib/oslavy.ts`, kde ho hlídají
 * testy: žádná cena, žádná reference, žádný věk, žádný jmenovaný prostor.
 *
 * Fotka v záhlaví ukazuje výtisky z tábora, ne oslavu — žádná oslava zatím
 * neproběhla a stránka to nesmí naznačovat ani obrázkem.
 */

const IKONY_PRIKLADU: Record<string, IkonaId> = {
  'vlastni-vytisk': 'krabice',
  'rozsvitit-a-rozhybat': 'zarovka',
  'na-miru-oslavenci': 'hvezda',
}

const IKONY_MIST: Record<string, IkonaId> = {
  'u-vas': 'dum',
  'pronajaty-prostor': 'misto',
  skola: 'skola',
}

export default function OslavyPage() {
  const tel = `tel:${SITE.phone.replace(/\s/g, '')}`

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
                <Link href="/">Domů</Link> <span aria-hidden="true">/</span> <span>Oslavy</span>
              </nav>
              <h1>Oslava, ze které si děti něco odnesou</h1>
              <p className="zahlavi-perex">
                Přivezeme 3D tiskárnu a elektroniku tam, kde oslava probíhá, a děti si u toho něco postaví.
              </p>
              <ul className="vyhody">
                <li>
                  <Ikona id="dum" />
                  <b>U vás</b>
                  <span>doma i ve škole</span>
                </li>
                <li>
                  <Ikona id="krabice" />
                  <b>S technikou</b>
                  <span>vše vezeme s sebou</span>
                </li>
                <li>
                  <Ikona id="tuzka" />
                  <b>Na míru</b>
                  <span>podle dětí a času</span>
                </li>
              </ul>
              <div className="zahlavi-akce">
                <a className="btn btn-primary btn-lg" href="#poptavka">
                  Napsat o oslavě <Ikona id="dolu" />
                </a>
              </div>
            </div>
            <figure className="zahlavi-foto jen-desktop">
              <Image
                src="/images/tabor/vyrobky-kolekce.webp"
                alt="Výtisky z 3D tiskárny na stole: přívěsky, jmenovka Weeks, stojánek a ohebný had"
                width={900}
                height={900}
                sizes="(min-width: 900px) 460px, 1px"
                loading="lazy"
              />
            </figure>
          </div>
        </section>

        {/* ── Příklady ─────────────────────────────────────────────────── */}
        <section className="sec sec-papir bez-linky">
          <div className="wrap">
            <div className="sec-head">
              <h2>Jak to může vypadat</h2>
              <p>Nemáme pevné balíčky. Tohle jsou tři nápady, ze kterých se dá vyjít.</p>
            </div>
            <div className="karty r-cyan">
              {PRIKLADY.map((p) => (
                <article className="karta" key={p.id}>
                  <span className="karta-ik">
                    <Ikona id={IKONY_PRIKLADU[p.id] ?? 'jiskra'} />
                  </span>
                  <h3>{p.nadpis}</h3>
                  <p>{sazba(p.text)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Modelové průběhy ─────────────────────────────────────────── */}
        {/* Modely, ne balíčky: bez ceny a počtu dětí, s větou, že se dají
            poskládat jinak (viz `PRUBEHY` v `src/lib/oslavy.ts`). */}
        <section className="sec sec-tint">
          <div className="wrap">
            <div className="sec-head">
              <h2>Jak může oslava probíhat</h2>
              <p>Dva modely odpoledne od začátku do konce. Délku, pořadí i náplň domluvíme podle vás.</p>
            </div>
            <div className="prubehy">
              {PRUBEHY.map((p) => (
                <article className="prubeh" key={p.id}>
                  <div className="prubeh-hl">
                    <h3>{p.nadpis}</h3>
                    <span className="prubeh-delka">{p.delka}</span>
                  </div>
                  <ol className="prubeh-kroky">
                    {p.kroky.map((k) => (
                      <li key={k.cas}>
                        <span className="prubeh-cas">{k.cas}</span>
                        <div>
                          <b>{k.nadpis}</b>
                          <span>{sazba(k.text)}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Co přivezeme / co potřebujeme ────────────────────────────── */}
        <section className="sec">
          <div className="wrap dva">
            <div>
              <h2>Co přivezeme</h2>
              <ul className="zaskrt" style={{ marginTop: 16 }}>
                {ZAJISTIME.map((polozka) => (
                  <li key={polozka}>
                    <Ikona id="ok" />
                    <span>{sazba(polozka)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Co potřebujeme od vás</h2>
              <ul className="zaskrt" style={{ marginTop: 16 }}>
                {POTREBUJEME.map((polozka) => (
                  <li key={polozka}>
                    <Ikona id="ok" />
                    <span>{sazba(polozka)}</span>
                  </li>
                ))}
              </ul>
              <p className="pozn">Nic dalšího. Techniku, prodlužovačky i materiál vozíme s sebou.</p>
            </div>
          </div>
        </section>

        {/* ── Kde to proběhne ──────────────────────────────────────────── */}
        <section className="sec dark mrizka bez-linky">
          <Mrizka />
          <div className="wrap">
            <div className="sec-head">
              <h2>Přijedeme za vámi</h2>
              <p>Vlastní dílnu nemáme a nepotřebujeme ji.</p>
            </div>
            <div className="karty">
              {MISTA.map((m) => (
                <article className="karta" key={m.id}>
                  <span className="karta-ik">
                    <Ikona id={IKONY_MIST[m.id] ?? 'misto'} />
                  </span>
                  <h3>{m.nadpis}</h3>
                  <p>{sazba(m.text)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Poptávka ─────────────────────────────────────────────────── */}
        <section className="zaver amber vz vz-zaver" id="poptavka">
          <div className="wrap zaver-form">
            <div className="zaver-in">
              <h2>Domluvme oslavu</h2>
              <p>Napište, kolik dětí přijde, kdy to má být a kde. Ozveme se s návrhem programu.</p>
              <div className="zaver-kontakt">
                <a href={tel}>
                  <Ikona id="tel" /> {SITE.phone.replace(/ /g, ' ')}
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
            <OslavaPoptavka />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
