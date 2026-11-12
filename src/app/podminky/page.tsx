import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Ikona } from '@/components/w2/Ikona'
import { Mrizka } from '@/components/w2/Mrizka'
import { PravniObsah, type PolozkaObsahu } from '@/components/w2/PravniObsah'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import { MIMO_CENU, PROVOZNI_DOBA, SITE, V_CENE } from '@/lib/site'

const pageTitle = 'Podmínky užití'
const pageDescription = 'Podmínky užití webu a všeobecné obchodní podmínky IT táborů Weeks.'
const pageUrl = 'https://weeks.cz/podminky'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'Weeks',
    // Next slučuje `openGraph` z metadat jen mělce — vlastní blok tu proto musí
    // nést i obrázek, jinak přebije kořenový a náhled při sdílení zmizí.
    images: [
      {
        url: `${SITE.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: pageTitle,
      },
    ],
  },
  // Twitter dědí ze stejného důvodu jako `openGraph` — vlastní blok na téhle
  // úrovni jen mělce přebíjí kořenový, takže bez obrázku se stránka sdílí
  // bez náhledu.
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
    images: [`${SITE.url}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

/*
  Jeden pořadatel pro obě části dokumentu.

  Část A (podmínky užití webu) dřív uváděla jako provozovatele a organizátora
  DDM Praha 6 a tvrdila, že registrace i platby běží přes systém DDM. Část B
  (VOP přenesené z bývalé /karlovy-vary/podminky) uváděla jako pořadatele
  Lukáše Kubíka a vztahovala se jen na Karlovy Vary, ačkoliv `RegistrationForm`
  na ni posílá všechny. Identifikace pořadatele teď v obou částech pochází ze
  `SITE`, tvrzení o registraci přes DDM jsou pryč a působnost VOP je celý
  produkt, ne jedno město.

  Závěrečná opravná vlna dorovnala i dvě místa, která dřív čekala na majitele:
  čl. 20 už neinzeruje ceny zrušených formátů (2 990 Kč / 4 990 Kč), ale odkazuje
  na cenu u konkrétního turnusu, a čl. 21.2 s cizím číslem účtu je pryč celý.
  Ani cena, ani číslo účtu se sem nedopisují — to jsou rozhodnutí majitele,
  ne opravy textu. Podrobnosti u obou míst v komentáři přímo nad nimi.

  Text čeká na kontrolu týmu.
*/

/** Obsah stránky – musí odpovídat oddílům níž (`id` = kotva `<section>`). */
const OBSAH: PolozkaObsahu[] = [
  { cast: 'Část A – užití webu' },
  { id: 'cl-1', nazev: '1. Úvodní ustanovení' },
  { id: 'cl-2', nazev: '2. Provozovatel webu' },
  { id: 'cl-3', nazev: '3. Účel a charakter webu' },
  { id: 'cl-4', nazev: '4. Přihlášení na tábor' },
  { id: 'cl-5', nazev: '5. Pravidla užívání webu' },
  { id: 'cl-6', nazev: '6. Autorská práva a duševní vlastnictví' },
  { id: 'cl-7', nazev: '7. Odpovědnost za obsah' },
  { id: 'cl-8', nazev: '8. Omezení odpovědnosti' },
  { id: 'cl-9', nazev: '9. Ochrana osobních údajů' },
  { id: 'cl-10', nazev: '10. Cookies' },
  { id: 'cl-11', nazev: '11. Technická dostupnost webu' },
  { id: 'cl-12', nazev: '12. Změny podmínek' },
  { id: 'cl-13', nazev: '13. Řešení sporů' },
  { id: 'cl-14', nazev: '14. Oddělitelnost ustanovení' },
  { id: 'cl-15', nazev: '15. Kontakt' },
  { cast: 'Část B – obchodní podmínky' },
  { id: 'cl-16', nazev: '16. Úvodní ustanovení' },
  { id: 'cl-17', nazev: '17. Pořadatel' },
  { id: 'cl-18', nazev: '18. Místo konání' },
  { id: 'cl-19', nazev: '19. Přihláška a uzavření smlouvy' },
  { id: 'cl-20', nazev: '20. Cena tábora' },
  { id: 'cl-21', nazev: '21. Platební podmínky' },
  { id: 'cl-22', nazev: '22. Storno podmínky' },
  { id: 'cl-23', nazev: '23. Práva a povinnosti pořadatele' },
  { id: 'cl-24', nazev: '24. Práva a povinnosti zákonného zástupce a účastníka' },
  { id: 'cl-25', nazev: '25. Ochrana osobních údajů' },
  { id: 'cl-26', nazev: '26. Pořizování fotografií a videí' },
  { id: 'cl-27', nazev: '27. Nástupní list' },
  { id: 'cl-28', nazev: '28. Reklamace a stížnosti' },
  { id: 'cl-29', nazev: '29. Závěrečná ustanovení' },
  { id: 'cl-30', nazev: '30. Kontakt' },
]

export default function PodminkyPage() {
  const breadcrumbItems = [
    { name: 'Domů', url: 'https://weeks.cz' },
    { name: 'Podmínky užití', url: 'https://weeks.cz/podminky' },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Header vToku />
      <main id="obsah" className="w2">
        <section className="zahlavi zahlavi-kratke dark mrizka">
          <Mrizka />
          <div className="wrap">
            <div className="zahlavi-uzke">
              <nav className="drob" aria-label="Drobečková navigace">
                <Link href="/">Domů</Link> <span aria-hidden="true">/</span> <span>Podmínky</span>
              </nav>
              <h1>Podmínky užití</h1>
              <p className="zahlavi-perex">Podmínky užití webu a všeobecné obchodní podmínky táborů Weeks</p>
              <div className="cipy-info">
                <span className="cip-info">
                  <Ikona id="kalendar" />
                  Účinnost od: 10. října 2026
                </span>
                <a className="cip-info" href="#cast-a">
                  <Ikona id="dolu" />
                  Část A – užití webu
                </a>
                <a className="cip-info" href="#vop">
                  <Ikona id="dolu" />
                  Část B – obchodní podmínky
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="sec sec-papir bez-linky">
          <div className="wrap pravni-rozvrh">
            <PravniObsah polozky={OBSAH} />

            <article className="pravni">
            <p className="pravni-cast" id="cast-a">Část A — Podmínky užití webu</p>

            <section id="cl-1">
              <h2>1. Úvodní ustanovení</h2>
              <p>
                Tyto podmínky užití (dále jen „Podmínky") upravují přístup a užívání webových
                stránek <strong>weeks.cz</strong> (dále jen „Web"), které provozuje {SITE.legalName}{' '}
                a které slouží k prezentaci a prodeji IT táborů Weeks.
              </p>
              <p>
                Používáním tohoto webu vyjadřujete souhlas s těmito Podmínkami. Pokud s nimi
                nesouhlasíte, prosím nepoužívejte tento Web.
              </p>
            </section>

            <section id="cl-2">
              <h2>2. Provozovatel webu</h2>
              <div className="ramec">
                <p className="tucne">Provozovatelem webu a pořadatelem táborů je:</p>
                <p className="tucne">{SITE.legalName}</p>
                <p>IČO: {SITE.ico}</p>
                <p>Sídlo: {SITE.address}</p>
                <p>Zapsaná v obchodním rejstříku vedeném u {SITE.court}</p>
                <p>E-mail: {SITE.email}</p>
                <p>Telefon: {SITE.phone}</p>
                <p>Web: weeks.cz</p>
                <p>
                  <strong>Místo konání táborů:</strong> je uvedené u konkrétního turnusu na weeks.cz
                </p>
              </div>
            </section>

            <section id="cl-3">
              <h2>3. Účel a charakter webu</h2>
              <p>
                Tento Web slouží k těmto účelům:
              </p>
              <ul>
                <li>Prezentace IT táborů Weeks pro děti 9–15 let</li>
                <li>Informace o programu, termínech a podmínkách účasti</li>
                <li>Přihlášení dítěte na turnus a úhrada ceny tábora (čl. 19 až 21 níže)</li>
                <li>Sběr kontaktních údajů pro informování o nových termínech</li>
                <li>Poskytování obecných informací o aktivitách</li>
              </ul>
            </section>

            <section id="cl-4">
              <h2>4. Přihlášení na tábor</h2>
              <p>
                Přihlašování účastníků na tábory probíhá následovně:
              </p>
              <div>
                <div>
                  <h3>4.1 Formulář zájmu</h3>
                  <p>
                    U turnusů, které zatím nejsou otevřené k registraci, můžete na tomto webu
                    zanechat kontakt pro informování o termínech a spuštění registrace.
                  </p>
                </div>
                <div>
                  <h3>4.2 Závazná přihláška a platba</h3>
                  <p>
                    Závaznou přihlášku na otevřený turnus, uzavření smlouvy, cenu, platbu a storno
                    upravují všeobecné obchodní podmínky v části B těchto Podmínek (čl. 16 a následující).
                  </p>
                </div>
              </div>
            </section>

            <section id="cl-5">
              <h2>5. Pravidla užívání webu</h2>
              <p>
                Při užívání tohoto webu se zavazujete:
              </p>
              <ul>
                <li>Používat Web v souladu s platnými právními předpisy</li>
                <li>Neprovádět žádné aktivity, které by mohly poškodit Web nebo jeho uživatele</li>
                <li>Nepokoušet se získat neoprávněný přístup k systémům nebo datům</li>
                <li>Nezneužívat kontaktní formuláře pro spam nebo jiné nelegitimní účely</li>
                <li>Respektovat autorská práva a další práva duševního vlastnictví</li>
                <li>Poskytovat pravdivé a aktuální údaje při vyplňování formulářů</li>
              </ul>
            </section>

            <section id="cl-6">
              <h2>6. Autorská práva a duševní vlastnictví</h2>
              <p>
                Veškerý obsah tohoto webu, včetně textů, grafiky, log, fotografií, designu a dalších
                prvků, je chráněn autorským právem a je majetkem {SITE.legalName} nebo třetích stran,
                které poskytly souhlas k jejich použití.
              </p>
              <div>
                <div className="ramec">
                  <h3>6.1 Zakázané použití</h3>
                  <p>
                    Bez předchozího písemného souhlasu není dovoleno kopírovat, distribuovat,
                    upravovat, zobrazovat nebo jinak používat obsah tohoto webu pro komerční účely.
                  </p>
                </div>
                <div className="ramec">
                  <h3>6.2 Osobní použití</h3>
                  <p>
                    Obsah můžete používat pro osobní, nekomerční účely, pokud zachováte všechna
                    oznámení o autorských právech a další oznámení o vlastnictví.
                  </p>
                </div>
              </div>
            </section>

            <section id="cl-7">
              <h2>7. Odpovědnost za obsah</h2>
              <div>
                <div className="ramec">
                  <h3>7.1 Přesnost informací</h3>
                  <p>
                    Veškeré informace na tomto webu jsou poskytovány v dobré víře. Snažíme se
                    udržovat informace aktuální a přesné, ale nemůžeme zaručit jejich úplnost
                    nebo správnost.
                  </p>
                </div>
                <div className="ramec">
                  <h3>7.2 Změny informací</h3>
                  <p>
                    Vyhrazujeme si právo kdykoli změnit nebo aktualizovat obsah webu bez předchozího
                    upozornění.
                  </p>
                </div>
                <div className="ramec">
                  <h3>7.3 Externí odkazy</h3>
                  <p>
                    Web může obsahovat odkazy na externí webové stránky třetích stran. Neneseme
                    odpovědnost za obsah těchto externích stránek.
                  </p>
                </div>
              </div>
            </section>

            <section id="cl-8">
              <h2>8. Omezení odpovědnosti</h2>
              <p>
                V maximálním rozsahu povoleném platnými právními předpisy:
              </p>
              <ul>
                <li>
                  Provozovatel neodpovídá za jakékoli přímé nebo nepřímé škody vzniklé
                  použitím nebo nemožností použití tohoto webu
                </li>
                <li>
                  Provozovatel nezaručuje, že Web bude nepřetržitě dostupný nebo bez chyb
                </li>
                <li>
                  Provozovatel neodpovídá za škody způsobené počítačovými viry, malwarem
                  nebo jinými škodlivými komponenty
                </li>
                <li>
                  Provozovatel neodpovídá za ztrátu dat, zisku nebo jiné škody vzniklé
                  v souvislosti s použitím webu
                </li>
              </ul>
              <div>
                <p className="tucne">Odpovědnost za tábory</p>
                <p>
                  Průběh tábora, podmínky účasti a práva a povinnosti pořadatele upravují
                  všeobecné obchodní podmínky v části B (zejména čl. 23 a 24).
                </p>
              </div>
            </section>

            <section id="cl-9">
              <h2>9. Ochrana osobních údajů</h2>
              <p>
                Zpracování osobních údajů se řídí našimi zásadami ochrany osobních údajů,
                které jsou dostupné na stránce:
              </p>
              <div className="ramec">
                <Link
                  href="/gdpr"
                  className="tucne"
                >
                  Ochrana osobních údajů (GDPR)
                </Link>
              </div>
            </section>

            <section id="cl-10">
              <h2>10. Cookies</h2>
              <p>
                Tento web může používat cookies a podobné technologie pro zlepšení uživatelského
                zážitku a analýzu návštěvnosti. Podrobné informace o používání cookies najdete
                v našich zásadách ochrany osobních údajů.
              </p>
            </section>

            <section id="cl-11">
              <h2>11. Technická dostupnost webu</h2>
              <p>
                Snažíme se zajistit nepřetržitou dostupnost webu, ale:
              </p>
              <ul>
                <li>
                  Vyhrazujeme si právo dočasně omezit nebo přerušit přístup k webu z důvodu
                  údržby, aktualizací nebo technických problémů
                </li>
                <li>
                  Negarantujeme 100% dostupnost webu
                </li>
                <li>
                  O plánovaných odstávkách se pokusíme informovat předem
                </li>
              </ul>
            </section>

            <section id="cl-12">
              <h2>12. Změny podmínek</h2>
              <p>
                Vyhrazujeme si právo tyto Podmínky kdykoli změnit nebo aktualizovat. Změny
                nabývají účinnosti okamžikem jejich zveřejnění na tomto webu.
              </p>
              <p>
                Doporučujeme pravidelně kontrolovat tyto Podmínky, abyste byli informováni
                o případných změnách. Dalším používáním webu po změně Podmínek vyjadřujete
                souhlas s aktualizovanými Podmínkami.
              </p>
            </section>

            <section id="cl-13">
              <h2>13. Řešení sporů</h2>
              <p>
                Případné spory vzniklé z těchto Podmínek nebo v souvislosti s nimi budou řešeny:
              </p>
              <ul>
                <li>Primárně dohodou mezi stranami</li>
                <li>V případě neúspěšného vyřešení sporu příslušným soudem v České republice</li>
                <li>Podle práva České republiky</li>
              </ul>
              <div className="ramec">
                <p className="tucne">
                  Mimosoudní řešení sporů
                </p>
                <p>
                  Pokud jste spotřebitelem, máte právo obrátit se s případnými stížnostmi
                  na Českou obchodní inspekci (www.coi.cz) nebo využít systém řešení sporů online
                  na platformě ODR (ec.europa.eu/consumers/odr).
                </p>
              </div>
            </section>

            <section id="cl-14">
              <h2>14. Oddělitelnost ustanovení</h2>
              <p>
                Pokud by jakékoli ustanovení těchto Podmínek bylo shledáno neplatným nebo
                nevymahatelným, zůstávají ostatní ustanovení v plné platnosti a účinnosti.
              </p>
            </section>

            <section id="cl-15">
              <h2>15. Kontakt</h2>
              <p>
                V případě jakýchkoliv dotazů týkajících se těchto Podmínek nebo webu nás
                můžete kontaktovat:
              </p>
              <div className="ramec">
                <p className="tucne">{SITE.legalName}</p>
                <p>
                  <strong>IČO:</strong> {SITE.ico}
                </p>
                <p>
                  <strong>Sídlo:</strong> {SITE.address}
                </p>
                <p>
                  <strong>E-mail:</strong> {SITE.email}
                </p>
                <p>
                  <strong>Telefon:</strong> {SITE.phone}
                </p>
                <p>
                  <strong>Web:</strong> weeks.cz
                </p>
              </div>
            </section>

            {/*
              Část B — VOP přenesené z bývalé samostatné stránky /karlovy-vary/podminky
              (smazána spolu s adresou karlovy-vary v přestavbě struktury webu). Jde
              o jediné znění VOP, které upravuje skutečný prodej (platba, storno, místo
              konání) přes tento web (Comgate). Oproti přenesenému znění je jiný jen
              pořadatel (`SITE` místo fyzické osoby), působnost (všechny tábory Weeks
              místo Karlových Varů) a místo konání (odkaz na turnus místo jedné adresy).
            */}
            <div className="pravni-b" id="vop">
              <p className="pravni-cast">Část B — Všeobecné obchodní podmínky (přihláška na tábor)</p>

              <section id="cl-16">
                <h2>16. Úvodní ustanovení</h2>
                <p>
                  Tyto všeobecné obchodní podmínky (dále jen „VOP") upravují smluvní vztah mezi pořadatelem
                  IT táborů Weeks a zákonným zástupcem přihlašovaného dítěte (dále jen „zákonný zástupce").
                </p>
                <p>
                  Odesláním závazné přihlášky zákonný zástupce potvrzuje, že se s těmito VOP
                  seznámil, rozumí jim a souhlasí s nimi. VOP jsou platné a závazné ode dne odeslání přihlášky.
                </p>
              </section>

              <section id="cl-17">
                <h2>17. Pořadatel</h2>
                <div className="ramec">
                  <p className="tucne">Pořadatelem táborů je:</p>
                  <p className="tucne">{SITE.legalName}</p>
                  <p className="muted">IČO: {SITE.ico}</p>
                  <p className="muted">Sídlo: {SITE.address}</p>
                  <p className="muted">
                    Společnost zapsaná v obchodním rejstříku vedeném u {SITE.court}.
                  </p>
                  <p className="muted">
                    <strong>E-mail:</strong> {SITE.email}<br />
                    <strong>Telefon:</strong> {SITE.phone}<br />
                    <strong>Web:</strong> weeks.cz
                  </p>
                </div>
              </section>

              <section id="cl-18">
                <h2>18. Místo konání</h2>
                <div className="ramec">
                  <p>
                    Místo konání je uvedené u konkrétního turnusu na weeks.cz a přesnou adresu
                    obdrží zákonný zástupce v nástupním listu (čl. 27).
                  </p>
                  <p className="small muted">
                    Provozní doba táborů: <strong>{PROVOZNI_DOBA.rozsah}</strong> (příchod{' '}
                    {PROVOZNI_DOBA.prichod}, vyzvednutí {PROVOZNI_DOBA.odchod})
                  </p>
                </div>
              </section>

              <section id="cl-19">
                <h2>19. Přihláška a uzavření smlouvy</h2>
                <div>
                  <div className="ramec">
                    <h3>19.1 Závazná přihláška</h3>
                    <p className="muted">
                      Přihlášení na tábor probíhá vyplněním a odesláním závazné elektronické přihlášky
                      dostupné na webových stránkách weeks.cz. Přihláška je závazná okamžikem jejího odeslání.
                    </p>
                  </div>
                  <div className="ramec">
                    <h3>19.2 Vznik smluvního vztahu</h3>
                    <p className="muted">
                      Smluvní vztah mezi pořadatelem a zákonným zástupcem vzniká úhradou zálohy nebo
                      celé ceny tábora v souladu s těmito VOP. Do té doby se jedná o nezávaznou rezervaci.
                    </p>
                  </div>
                  <div className="ramec">
                    <h3>19.3 Potvrzení</h3>
                    <p className="muted">
                      Po úspěšné platbě obdrží zákonný zástupce potvrzovací e-mail na uvedenou e-mailovou adresu.
                      Přibližně 7 dní před zahájením tábora bude zaslán nástupní list s praktickými informacemi.
                    </p>
                  </div>
                </div>
              </section>

              {/*
                Čl. 20 dřív inzeroval cenové karty dvou formátů, které se nečají:
                „MIX – Víkendový tábor 2 990 Kč / So + Ne" a „Letní příměstský tábor
                4 990 Kč / Po–Pá". Dnešní produkt je jeden a oba turnusy mají
                v `turnusy.ts` `priceKc: null`, takže oblástky inzerovaly částky, za
                které se nic prodat nedá.

                Karty jsou pryč a zbyl odkaz na cenu u konkrétního turnusu — tam je
                jediný zdroj pravdy. Částka se sem záměrně žádná nedopisuje: stanovit
                cenu je rozhodnutí majitele, ne oprava textu.
              */}
              <section id="cl-20">
                <h2>20. Cena tábora</h2>
                <p>
                  Cena tábora je uvedená u konkrétního turnusu v{' '}
                  <Link href="/tabory">nabídce turnusů</Link>{' '}
                  a platí ve výši, kterou zobrazuje přihláška v okamžiku jejího odeslání.
                </p>
                {/* Výčet čte `V_CENE` / `MIMO_CENU` ze site.ts — stejný seznam
                    ukazuje stránka termínu, slib na webu a ve smlouvě se nerozejde.
                    Co si dítě odnese, se liší podle tábora (`tabor.odnese`),
                    proto tu stojí odkazem na stránku termínu. */}
                <p className="small muted">
                  V ceně tábora je zahrnuto: {V_CENE.join(', ').toLowerCase()} a to, co si dítě
                  podle stránky turnusu z tábora odnese (například vlastní výtisky z 3D tiskárny
                  nebo vlastní hru). Součástí ceny není: {MIMO_CENU.join('; ').toLowerCase()}.
                </p>
              </section>

              <section id="cl-21">
                <h2>21. Platební podmínky</h2>
                <div>
                  <div className="ramec">
                    <h3>21.1 Způsob platby</h3>
                    <p className="muted">
                      Platba probíhá zrychleným bankovním převodem prostřednictvím{' '}
                      <a href="https://www.comgate.eu/cs/platebni-brana" target="_blank" rel="noopener noreferrer">platební brány Comgate</a>.
                      Po odeslání přihlášky budete přesměrováni na bránu, kde platbu dokončíte platebním tlačítkem své banky.
                      Jak platba bankovním tlačítkem probíhá, popisuje{' '}
                      <a href="https://help.comgate.cz/docs/bankovni-prevody" target="_blank" rel="noopener noreferrer">nápověda Comgate</a>.
                    </p>
                  </div>
                  {/*
                    Čl. 21.2 („Bankovní převod") je pryč celý. Uváděl číslo cizího
                    účtu včetně IBAN — účet, který nepatří pořadateli, jak ho
                    identifikuje čl. 2 a čl. 17 tohoto dokumentu. Navíc si odporoval
                    s čl. 21.1 přímo nad ním: platba probíhá výhradně přes platební bránu
                    Comgate, žádný převod na účet pořadatele se nezadává ručně. Nové
                    číslo účtu se sem záměrně nedopisuje — to je údaj, který musí potvrdit
                    majitel. Čl. 21.1 popisuje skutečný stav a stačí sám.
                  */}
                  <div className="ramec">
                    <h3>21.2 Faktura</h3>
                    <p className="muted">
                      Fakturu zašle pořadatel zákonnému zástupci e-mailem nejpozději do 14 dnů
                      od přijetí platby. Pořadatel není plátcem DPH.
                    </p>
                  </div>
                  <div className="ramec">
                    <h3>21.3 Provozovatel platební brány</h3>
                    <p className="muted">
                      Platební služby zajišťuje společnost{' '}
                      <a href="https://www.comgate.eu/cs/platebni-brana" target="_blank" rel="noopener noreferrer"><strong>Comgate a.s.</strong></a>, IČ: 27924505,
                      DIČ: CZ27924505, se sídlem Gočárova třída 1754/48b, Pražské Předměstí, 500 02 Hradec Králové.
                    </p>
                    <p className="muted">
                      Reklamace a dotazy k platbám vyřizuje přímo Comgate:{' '}
                      <a href="mailto:platby-podpora@comgate.cz">platby-podpora@comgate.cz</a>,
                      tel. <a href="tel:+420228224267">+420 228 224 267</a>.
                    </p>
                  </div>
                  <div className="ramec">
                    <h3>21.4 Záloha a doplatek</h3>
                    <p className="muted">
                      Zákonný zástupce může uhradit zálohu, jejíž výše je uvedena u turnusu, a zbytek ceny
                      doplatit do termínu uvedeného u turnusu. Pořadatel zašle zákonnému zástupci připomínku
                      doplatku. Pokud doplatek nedorazí ani do 7 dnů od upozornění, může pořadatel místo
                      uvolnit a uhrazenou částku vrátit podle čl. 22. Platbu zálohou lze zvolit u přihlášek
                      podaných od 2. 11. 2026.
                    </p>
                  </div>
                </div>
              </section>

              <section id="cl-22">
                <h2>22. Storno podmínky</h2>
                <div className="tabulka">
                  <table>
                    <thead>
                      <tr>
                        <th>Lhůta před zahájením tábora</th>
                        <th>Storno poplatek</th>
                        <th>Vráceno</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>30 a více dní</td>
                        <td className="t-ok">0 %</td>
                        <td>plná cena</td>
                      </tr>
                      <tr>
                        <td>15–29 dní</td>
                        <td className="t-pul">50 %</td>
                        <td>polovina ceny</td>
                      </tr>
                      <tr>
                        <td>14 dní a méně / nenastoupení</td>
                        <td className="t-ne">100 %</td>
                        <td>0 Kč</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <div className="ramec ramec-ok">
                    <p className="tucne small">Výjimka: náhradní dítě</p>
                    <p className="small">
                      Pokud zákonný zástupce zajistí za odhlašované dítě náhradního účastníka,
                      storno poplatek se neúčtuje.
                    </p>
                  </div>
                  <div className="ramec ramec-info">
                    <p className="tucne small">Výjimka: nemoc s lékařským potvrzením</p>
                    <p className="small">
                      V případě nemoci dítěte doložené lékařským potvrzením vydaným nejpozději
                      v den zahájení tábora může pořadatel přistoupit k individuálnímu řešení —
                      zpravidla vrácení 50 % ceny bez ohledu na lhůtu.
                    </p>
                  </div>
                  <div>
                    <p className="tucne small">Zrušení ze strany pořadatele</p>
                    <p className="small muted">
                      Turnus se koná při minimálním počtu přihlášených dětí uvedeném u turnusu na
                      weeks.cz. Pokud se minimum nenaplní, oznámí pořadatel zrušení turnusu
                      zákonným zástupcům e-mailem nejpozději ke dni uvedenému u turnusu. Pokud se
                      v téže sezóně a městě koná jiný turnus, může pořadatel turnusy sloučit do
                      toho s vyšším počtem přihlášených; zrušení se pak týká jen turnusu, který se
                      nekoná.
                    </p>
                    <p className="small muted">
                      Pořadatel je dále oprávněn tábor zrušit z jiných závažných důvodů.
                    </p>
                    <p className="small muted">
                      Při zrušení turnusu ze strany pořadatele si zákonný zástupce zvolí přesun
                      na jiný turnus téže sezóny, pokud je v něm volné místo, nebo vrácení plné
                      uhrazené ceny do 10 pracovních dní. Storno poplatek se v takovém případě
                      neúčtuje.
                    </p>
                  </div>
                </div>

                <p className="small muted">
                  Storno musí být oznámeno písemně e-mailem na adresu {SITE.email}.
                  Vrácení platby proběhne na účet, ze kterého byla platba přijata, do 10 pracovních dní.
                </p>
                <p className="small muted">
                  U přihlášky, která je uhrazena jen zálohou, se storno poplatek počítá z celé ceny
                  turnusu, ale nikdy nepřekročí částku, kterou zákonný zástupce dosud uhradil.
                </p>
              </section>

              <section id="cl-23">
                <h2>23. Práva a povinnosti pořadatele</h2>
                <ul>
                  <li>Zajistit odborné vedení tábora kvalifikovanými lektory</li>
                  <li>Zajistit bezpečné prostředí odpovídající charakteru aktivit</li>
                  <li>Zajistit oběd po dobu tábora</li>
                  <li>Informovat zákonné zástupce o průběhu tábora při zjištění nestandardní situace</li>
                  <li>Zachovávat mlčenlivost o osobních údajích účastníků v souladu s GDPR</li>
                  <li>Odmítnout účast dítěti, které svým chováním ohrožuje bezpečnost nebo výuku ostatních</li>
                  <li>Upravit program tábora z provozních nebo bezpečnostních důvodů</li>
                </ul>
              </section>

              <section id="cl-24">
                <h2>24. Práva a povinnosti zákonného zástupce a účastníka</h2>
                <ul>
                  <li>Přihlásit zdravé dítě — zákonný zástupce nesmí přivést nemocné dítě na tábor</li>
                  <li>Uvést pravdivé a úplné informace v přihlášce, zejména zdravotní omezení a alergie</li>
                  <li>Dostavit se (nebo zajistit dostavení dítěte) v souladu s nástupním listem</li>
                  <li>Vyzvednou dítě způsobem uvedeným v přihlášce</li>
                  <li>Uhradit cenu tábora v souladu s platebními podmínkami</li>
                  <li>Respektovat pokyny lektorů a organizačního týmu</li>
                  <li>Dbát na to, aby dítě respektovalo vybavení místa konání a ostatní účastníky</li>
                </ul>
                <div>
                  <p className="muted">
                    <strong>Cennosti.</strong> Pořadatel doporučuje nevybavovat dítě cennými předměty
                    (mobilní telefon, tablet, šperky, vyšší hotovost). Za ztrátu, poškození nebo odcizení
                    cenných předmětů, které si dítě přinese na tábor, pořadatel nenese odpovědnost.
                  </p>
                  <p className="muted">
                    <strong>Pozdní vyzvednutí.</strong> Zákonný zástupce je povinen vyzvednout dítě
                    (nebo zajistit jeho odchod) nejpozději do konce provozní doby. Při pozdním
                    vyzvednutí je pořadatel oprávněn účtovat poplatek za prodloužený dohled ve výši
                    150 Kč za každých započatých 30 minut po skončení provozní doby (čl. 18).
                  </p>
                </div>
              </section>

              <section id="cl-25">
                <h2>25. Ochrana osobních údajů</h2>
                <p>
                  Pořadatel zpracovává osobní údaje zákonných zástupců a dětí v rozsahu nezbytném pro
                  organizaci a provoz tábora. Zpracování probíhá v souladu s nařízením GDPR a příslušnými
                  právními předpisy ČR.
                </p>
                <p>
                  Údaje jsou uchovávány po dobu nezbytnou pro plnění smluvních a zákonných povinností,
                  nejdéle 5 let od konání tábora. Zákonný zástupce má právo na přístup ke svým údajům,
                  jejich opravu, výmaz nebo omezení zpracování.
                </p>
                <p>
                  Podrobné informace o zpracování osobních údajů jsou dostupné na stránce{' '}
                  <Link href="/gdpr">Ochrana osobních údajů (GDPR)</Link>.
                </p>
              </section>

              <section id="cl-26">
                <h2>26. Pořizování fotografií a videí</h2>
                <p>
                  Během tábora může docházet k pořizování fotografií a videozáznamů pro dokumentaci
                  a propagaci aktivit na webu weeks.cz a sociálních sítích. Souhlas s fotografováním
                  je nepovinný a zákonný zástupce jej uděluje (nebo neuděluje) při vyplnění přihlášky.
                </p>
                <p>
                  Souhlas lze kdykoli odvolat písemně na adrese {SITE.email}.
                  Odvolání souhlasu nemá vliv na zákonnost zpracování před jeho odvoláním.
                </p>
              </section>

              <section id="cl-27">
                <h2>27. Nástupní list</h2>
                <p>
                  Přibližně 7 dní před zahájením tábora obdrží zákonný zástupce na uvedený e-mail
                  nástupní list s praktickými informacemi (přesná adresa, čas nástupu, co přinést,
                  kontakt na lektora). V případě, že e-mail neobdržíte, kontaktujte nás na {SITE.email}.
                </p>
                <p>
                  <strong>Povinné dokumenty při nástupu.</strong> Zákonný zástupce je povinen v den nástupu
                  předat vedoucímu tábora vlastnoručně podepsané <strong>Prohlášení o bezinfekčnosti</strong>{' '}
                  (ne starší než 1 den) a <strong>kopii průkazu zdravotní pojišťovny</strong> dítěte.
                  Bez předání těchto dokumentů nemůže být dítěti umožněna účast na táboře. Formulář
                  prohlášení o bezinfekčnosti je součástí nástupního listu.
                </p>
              </section>

              <section id="cl-28">
                <h2>28. Reklamace a stížnosti</h2>
                <p>
                  Reklamace nebo stížnosti uplatňujte písemně na e-mailové adrese {SITE.email}.
                  Pořadatel se zavazuje reagovat do 5 pracovních dní.
                </p>
                <p>
                  Jako spotřebitel máte právo obrátit se s případnými stížnostmi na Českou obchodní
                  inspekci (www.coi.cz) nebo využít platformu pro online řešení sporů ODR
                  (ec.europa.eu/consumers/odr).
                </p>
              </section>

              <section id="cl-29">
                <h2>29. Závěrečná ustanovení</h2>
                <p>
                  Tyto VOP se řídí právním řádem České republiky. Případné spory budou řešeny
                  příslušným soudem v České republice.
                </p>
                <p>
                  Pořadatel si vyhrazuje právo tyto VOP kdykoli změnit. Na přihlášky odeslané
                  přede dnem účinnosti změny se vztahují VOP platné v den odeslání přihlášky.
                </p>
                <p>
                  Pokud by jakékoli ustanovení těchto VOP bylo shledáno neplatným, ostatní
                  ustanovení zůstávají v plné platnosti.
                </p>
              </section>

              <section id="cl-30">
                <h2>30. Kontakt</h2>
                <div className="ramec ramec-kontakt">
                  <p className="tucne">{SITE.legalName}</p>
                  <p><strong>IČO:</strong> {SITE.ico}</p>
                  <p><strong>Sídlo:</strong> {SITE.address}</p>
                  <p><strong>Místo konání:</strong> uvedené u konkrétního turnusu na weeks.cz</p>
                  <p><strong>E-mail:</strong> {SITE.email}</p>
                  <p><strong>Telefon:</strong> {SITE.phone}</p>
                </div>
              </section>
            </div>

            <div className="pravni-paticka">
              <p className="small muted">
                Tyto podmínky užití a všeobecné obchodní podmínky jsou platné a účinné od 16. září 2026.
              </p>
              <p className="small muted">
                Poslední aktualizace: 16. září 2026
              </p>
            </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
