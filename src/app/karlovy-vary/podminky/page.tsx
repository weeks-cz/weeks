import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const pageTitle = 'Všeobecné obchodní podmínky – Weeks Karlovy Vary'
const pageDescription = 'Všeobecné obchodní podmínky pro IT tábory Weeks v Karlových Varech. Podmínky přihlášení, platby, storna a účasti.'
const pageUrl = 'https://weeks.cz/karlovy-vary/podminky'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'Weeks',
  },
  robots: { index: true, follow: true },
}

export default function KVPodminkyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-night pt-24 pb-16">
        <article className="section-container max-w-3xl">
          <Link
            href="/karlovy-vary"
            className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zpět na Karlovy Vary
          </Link>

          <header className="mb-12">
            <h1 className="font-display text-4xl font-bold text-white mb-4">
              Všeobecné obchodní podmínky
            </h1>
            <p className="text-slate-300 text-lg">
              IT tábory Weeks – Karlovy Vary
            </p>
            <p className="text-slate-500 text-sm mt-4">
              Účinnost od: 1. května 2026
            </p>
          </header>

          <div className="space-y-8">

            {/* 1 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">1. Úvodní ustanovení</h2>
              <p className="text-slate-300 mb-4">
                Tyto všeobecné obchodní podmínky (dále jen „VOP") upravují smluvní vztah mezi pořadatelem
                IT táborů Weeks v Karlových Varech a zákonným zástupcem přihlašovaného dítěte (dále jen „zákonný zástupce").
              </p>
              <p className="text-slate-300">
                Odesláním závazné přihlášky zákonný zástupce potvrzuje, že se s těmito VOP
                seznámil, rozumí jim a souhlasí s nimi. VOP jsou platné a závazné ode dne odeslání přihlášky.
              </p>
            </section>

            {/* 2 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">2. Pořadatel</h2>
              <div className="bg-night-800 p-6 rounded-lg border border-white/10">
                <p className="text-white font-semibold mb-3">Pořadatelem táborů je:</p>
                <p className="text-white font-medium">Lukáš Kubík</p>
                <p className="text-slate-300 mt-1">IČO: 24878511</p>
                <p className="text-slate-300">Sídlo: Kováříkova 1145/11, Hlubočepy, 152 00 Praha 5</p>
                <p className="text-slate-300 mt-3">
                  Fyzická osoba podnikající na základě živnostenského oprávnění.
                </p>
                <p className="text-slate-300 mt-3">
                  <strong>E-mail:</strong> info@weeks.cz<br />
                  <strong>Telefon:</strong> +420 703 046 440<br />
                  <strong>Web:</strong> weeks.cz
                </p>
              </div>
            </section>

            {/* 3 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">3. Místo konání</h2>
              <div className="bg-night-800 p-6 rounded-lg border border-white/10">
                <p className="text-white font-medium mb-1">FabLab v Kreativní Centrum VARY&amp;TE</p>
                <p className="text-slate-300">Dykova, Stará Role, 360 17 Karlovy Vary</p>
                <p className="text-slate-300 mt-3 text-sm">
                  Provozní doba táborů: <strong>8:00–17:00</strong>
                </p>
              </div>
            </section>

            {/* 4 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">4. Přihláška a uzavření smlouvy</h2>
              <div className="space-y-4">
                <div className="bg-night-800 p-5 rounded-lg border border-white/10">
                  <h3 className="text-base font-semibold text-white mb-2">4.1 Závazná přihláška</h3>
                  <p className="text-slate-300 text-base">
                    Přihlášení na tábor probíhá vyplněním a odesláním závazné elektronické přihlášky
                    dostupné na webových stránkách weeks.cz. Přihláška je závazná okamžikem jejího odeslání.
                  </p>
                </div>
                <div className="bg-night-800 p-5 rounded-lg border border-white/10">
                  <h3 className="text-base font-semibold text-white mb-2">4.2 Vznik smluvního vztahu</h3>
                  <p className="text-slate-300 text-base">
                    Smluvní vztah mezi pořadatelem a zákonným zástupcem vzniká úhradou ceny tábora
                    v souladu s těmito VOP. Do té doby se jedná o nezávaznou rezervaci.
                  </p>
                </div>
                <div className="bg-night-800 p-5 rounded-lg border border-white/10">
                  <h3 className="text-base font-semibold text-white mb-2">4.3 Potvrzení</h3>
                  <p className="text-slate-300 text-base">
                    Po úspěšné platbě obdrží zákonný zástupce potvrzovací e-mail na uvedenou e-mailovou adresu.
                    Přibližně 7 dní před zahájením tábora bude zaslán nástupní list s praktickými informacemi.
                  </p>
                </div>
              </div>
            </section>

            {/* 5 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">5. Cena tábora</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-primary-50 p-5 rounded-lg border border-primary-200">
                  <p className="font-semibold text-primary-900 mb-1">MIX – Víkendový tábor</p>
                  <p className="text-2xl font-bold text-primary-900">2 990 Kč</p>
                  <p className="text-sm text-primary-700 mt-1">So + Ne, oběd v ceně</p>
                </div>
                <div className="bg-primary-50 p-5 rounded-lg border border-primary-200">
                  <p className="font-semibold text-primary-900 mb-1">Letní příměstský tábor</p>
                  <p className="text-2xl font-bold text-primary-900">4 990 Kč</p>
                  <p className="text-sm text-primary-700 mt-1">Po–Pá (celý týden), oběd v ceně</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mt-4">
                V ceně tábora jsou zahrnuty: odborné vedení, materiál a pomůcky, oběd.
                Doprava na místo konání a zpět není součástí ceny.
              </p>
            </section>

            {/* 6 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">6. Platební podmínky</h2>
              <div className="space-y-4">
                <div className="bg-night-800 p-5 rounded-lg border border-white/10">
                  <h3 className="text-base font-semibold text-white mb-2">6.1 Způsob platby</h3>
                  <p className="text-slate-300 text-base">
                    Platba probíhá zrychleným bankovním převodem prostřednictvím{' '}
                    <a href="https://www.comgate.eu/cs/platebni-brana" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline hover:text-primary-700">platební brány Comgate</a>.
                    Po odeslání přihlášky budete přesměrováni na bránu, kde platbu dokončíte platebním tlačítkem své banky.
                    Jak platba bankovním tlačítkem probíhá, popisuje{' '}
                    <a href="https://help.comgate.cz/docs/bankovni-prevody" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline hover:text-primary-700">nápověda Comgate</a>.
                  </p>
                </div>
                <div className="bg-night-800 p-5 rounded-lg border border-white/10">
                  <h3 className="text-base font-semibold text-white mb-2">6.2 Bankovní převod</h3>
                  <p className="text-slate-300 text-base mb-2">
                    Při platbě bankovním převodem je zákonný zástupce povinen uhradit platbu
                    do <strong>3 pracovních dnů</strong> od odeslání přihlášky.
                    Po uplynutí této lhůty bez přijetí platby rezervace automaticky zaniká.
                  </p>
                  <p className="text-slate-300 text-base">
                    Číslo účtu pro bankovní převod:{' '}
                    <strong className="font-mono">2267467012/3030</strong> (Air Bank, IBAN: CZ29 3030 0000 0022 6746 7012)
                  </p>
                </div>
                <div className="bg-night-800 p-5 rounded-lg border border-white/10">
                  <h3 className="text-base font-semibold text-white mb-2">6.3 Faktura</h3>
                  <p className="text-slate-300 text-base">
                    Daňový doklad bude zákonném zástupci zaslán e-mailem po přijetí platby.
                    Pořadatel není plátcem DPH.
                  </p>
                </div>
                <div className="bg-night-800 p-5 rounded-lg border border-white/10">
                  <h3 className="text-base font-semibold text-white mb-2">6.4 Provozovatel platební brány</h3>
                  <p className="text-slate-300 text-base mb-2">
                    Platební služby zajišťuje společnost{' '}
                    <a href="https://www.comgate.eu/cs/platebni-brana" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline hover:text-primary-700"><strong>Comgate a.s.</strong></a>, IČ: 27924505,
                    DIČ: CZ27924505, se sídlem Gočárova třída 1754/48b, Pražské Předměstí, 500 02 Hradec Králové.
                  </p>
                  <p className="text-slate-300 text-base">
                    Reklamace a dotazy k platbám vyřizuje přímo Comgate:{' '}
                    <a href="mailto:platby-podpora@comgate.cz" className="text-primary-600 underline hover:text-primary-700">platby-podpora@comgate.cz</a>,
                    tel. <a href="tel:+420228224267" className="text-primary-600 underline hover:text-primary-700">+420 228 224 267</a>.
                  </p>
                </div>
              </div>
            </section>

            {/* 7 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">7. Storno podmínky</h2>
              <div className="overflow-hidden rounded-lg border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-night-800">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-white">Lhůta před zahájením tábora</th>
                      <th className="px-4 py-3 text-left font-semibold text-white">Storno poplatek</th>
                      <th className="px-4 py-3 text-left font-semibold text-white">Vráceno</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="bg-night-800">
                      <td className="px-4 py-3 text-slate-300">30 a více dní</td>
                      <td className="px-4 py-3 text-trust-400 font-medium">0 %</td>
                      <td className="px-4 py-3 text-slate-300">plná cena</td>
                    </tr>
                    <tr className="bg-night-800">
                      <td className="px-4 py-3 text-slate-300">15–29 dní</td>
                      <td className="px-4 py-3 text-cta-400 font-medium">50 %</td>
                      <td className="px-4 py-3 text-slate-300">polovina ceny</td>
                    </tr>
                    <tr className="bg-night-800">
                      <td className="px-4 py-3 text-slate-300">14 dní a méně / nenastoupení</td>
                      <td className="px-4 py-3 text-red-400 font-medium">100 %</td>
                      <td className="px-4 py-3 text-slate-300">0 Kč</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 space-y-3">
                <div className="bg-trust-500/10 p-4 rounded-lg border border-trust-400/40">
                  <p className="text-trust-400 font-medium mb-1 text-sm">Výjimka: náhradní dítě</p>
                  <p className="text-slate-300 text-sm">
                    Pokud zákonný zástupce zajistí za odhlašované dítě náhradního účastníka,
                    storno poplatek se neúčtuje.
                  </p>
                </div>
                <div className="bg-primary-500/10 p-4 rounded-lg border border-primary-400/40">
                  <p className="text-primary-300 font-medium mb-1 text-sm">Výjimka: nemoc s lékařským potvrzením</p>
                  <p className="text-slate-300 text-sm">
                    V případě nemoci dítěte doložené lékařským potvrzením vydaným nejpozději
                    v den zahájení tábora může pořadatel přistoupit k individuálnímu řešení —
                    zpravidla vrácení 50 % ceny bez ohledu na lhůtu.
                  </p>
                </div>
                <div className="bg-night-800 p-4 rounded-lg border border-white/10">
                  <p className="text-white font-medium mb-1 text-sm">Zrušení ze strany pořadatele</p>
                  <p className="text-slate-300 text-sm">
                    Pořadatel je oprávněn tábor zrušit z důvodu nedostatečného počtu přihlášených
                    nebo z jiných závažných důvodů. V takovém případě vrátí zákonným zástupcům
                    plnou uhrazenou cenu do 10 pracovních dní.
                  </p>
                </div>
              </div>

              <p className="text-slate-300 text-sm mt-4">
                Storno musí být oznámeno písemně e-mailem na adresu info@weeks.cz.
                Vrácení platby proběhne na účet, ze kterého byla platba přijata, do 10 pracovních dní.
              </p>
            </section>

            {/* 8 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">8. Práva a povinnosti pořadatele</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-300">
                <li>Zajistit odborné vedení tábora kvalifikovanými lektory</li>
                <li>Zajistit bezpečné prostředí odpovídající charakteru aktivit</li>
                <li>Zajistit oběd po dobu tábora</li>
                <li>Informovat zákonné zástupce o průběhu tábora při zjištění nestandardní situace</li>
                <li>Zachovávat mlčenlivost o osobních údajích účastníků v souladu s GDPR</li>
                <li>Odmítnout účast dítěti, které svým chováním ohrožuje bezpečnost nebo výuku ostatních</li>
                <li>Upravit program tábora z provozních nebo bezpečnostních důvodů</li>
              </ul>
            </section>

            {/* 9 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">9. Práva a povinnosti zákonného zástupce a účastníka</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-300">
                <li>Přihlásit zdravé dítě — zákonný zástupce nesmí přivést nemocné dítě na tábor</li>
                <li>Uvést pravdivé a úplné informace v přihlášce, zejména zdravotní omezení a alergie</li>
                <li>Dostavit se (nebo zajistit dostavení dítěte) v souladu s nástupním listem</li>
                <li>Vyzvednou dítě způsobem uvedeným v přihlášce</li>
                <li>Uhradit cenu tábora v souladu s platebními podmínkami</li>
                <li>Respektovat pokyny lektorů a organizačního týmu</li>
                <li>Dbát na to, aby dítě respektovalo vybavení místa konání a ostatní účastníky</li>
              </ul>
              <div className="mt-4 space-y-3">
                <p className="text-slate-300">
                  <strong>Cennosti.</strong> Pořadatel doporučuje nevybavovat dítě cennými předměty
                  (mobilní telefon, tablet, šperky, vyšší hotovost). Za ztrátu, poškození nebo odcizení
                  cenných předmětů, které si dítě přinese na tábor, pořadatel nenese odpovědnost.
                </p>
                <p className="text-slate-300">
                  <strong>Pozdní vyzvednutí.</strong> Zákonný zástupce je povinen vyzvednout dítě
                  (nebo zajistit jeho odchod) nejpozději do konce denního programu. Při pozdním
                  vyzvednutí je pořadatel oprávněn účtovat poplatek za prodloužený dohled ve výši
                  150 Kč za každých započatých 30 minut po skončení denního programu.
                </p>
              </div>
            </section>

            {/* 10 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">10. Ochrana osobních údajů</h2>
              <p className="text-slate-300 mb-4">
                Pořadatel zpracovává osobní údaje zákonných zástupců a dětí v rozsahu nezbytném pro
                organizaci a provoz tábora. Zpracování probíhá v souladu s nařízením GDPR a příslušnými
                právními předpisy ČR.
              </p>
              <p className="text-slate-300 mb-4">
                Údaje jsou uchovávány po dobu nezbytnou pro plnění smluvních a zákonných povinností,
                nejdéle 5 let od konání tábora. Zákonný zástupce má právo na přístup ke svým údajům,
                jejich opravu, výmaz nebo omezení zpracování.
              </p>
              <p className="text-slate-300">
                Podrobné informace o zpracování osobních údajů jsou dostupné na stránce{' '}
                <Link href="/karlovy-vary/gdpr" className="text-primary-600 underline hover:text-primary-700">Ochrana osobních údajů (GDPR)</Link>.
              </p>
            </section>

            {/* 11 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">11. Pořizování fotografií a videí</h2>
              <p className="text-slate-300 mb-4">
                Během tábora může docházet k pořizování fotografií a videozáznamů pro dokumentaci
                a propagaci aktivit na webu weeks.cz a sociálních sítích. Souhlas s fotografováním
                je nepovinný a zákonný zástupce jej uděluje (nebo neuděluje) při vyplnění přihlášky.
              </p>
              <p className="text-slate-300">
                Souhlas lze kdykoli odvolat písemně na adrese info@weeks.cz.
                Odvolání souhlasu nemá vliv na zákonnost zpracování před jeho odvoláním.
              </p>
            </section>

            {/* 12 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">12. Nástupní list</h2>
              <p className="text-slate-300">
                Přibližně 7 dní před zahájením tábora obdrží zákonný zástupce na uvedený e-mail
                nástupní list s praktickými informacemi (přesná adresa, čas nástupu, co přinést,
                kontakt na lektora). V případě, že e-mail neobdržíte, kontaktujte nás na info@weeks.cz.
              </p>
              <p className="text-slate-300 mt-4">
                <strong>Povinné dokumenty při nástupu.</strong> Zákonný zástupce je povinen v den nástupu
                předat vedoucímu tábora vlastnoručně podepsané <strong>Prohlášení o bezinfekčnosti</strong>{' '}
                (ne starší než 1 den) a <strong>kopii průkazu zdravotní pojišťovny</strong> dítěte.
                Bez předání těchto dokumentů nemůže být dítěti umožněna účast na táboře. Formulář
                prohlášení o bezinfekčnosti je součástí nástupního listu.
              </p>
            </section>

            {/* 13 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">13. Reklamace a stížnosti</h2>
              <p className="text-slate-300 mb-4">
                Reklamace nebo stížnosti uplatňujte písemně na e-mailové adrese info@weeks.cz.
                Pořadatel se zavazuje reagovat do 5 pracovních dní.
              </p>
              <p className="text-slate-300 mb-4">
                Jako spotřebitel máte právo obrátit se s případnými stížnostmi na Českou obchodní
                inspekci (www.coi.cz) nebo využít platformu pro online řešení sporů ODR
                (ec.europa.eu/consumers/odr).
              </p>
            </section>

            {/* 14 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">14. Závěrečná ustanovení</h2>
              <p className="text-slate-300 mb-4">
                Tyto VOP se řídí právním řádem České republiky. Případné spory budou řešeny
                příslušným soudem v České republice.
              </p>
              <p className="text-slate-300 mb-4">
                Pořadatel si vyhrazuje právo tyto VOP kdykoli změnit. Na přihlášky odeslané
                přede dnem účinnosti změny se vztahují VOP platné v den odeslání přihlášky.
              </p>
              <p className="text-slate-300">
                Pokud by jakékoli ustanovení těchto VOP bylo shledáno neplatným, ostatní
                ustanovení zůstávají v plné platnosti.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-4">15. Kontakt</h2>
              <div className="bg-primary-50 p-6 rounded-lg border border-primary-200">
                <p className="text-primary-900 font-semibold mb-3">Weeks – IT tábory Karlovy Vary</p>
                <p className="text-primary-800 mb-1"><strong>Pořadatel:</strong> Lukáš Kubík, IČO: 24878511 (úplná adresa sídla v čl. 1)</p>
                <p className="text-primary-800 mb-1"><strong>Místo konání:</strong> FabLab v Kreativní Centrum VARY&amp;TE, Dykova, Stará Role, 360 17 Karlovy Vary</p>
                <p className="text-primary-800 mb-1"><strong>E-mail:</strong> info@weeks.cz</p>
                <p className="text-primary-800"><strong>Telefon:</strong> +420 703 046 440</p>
              </div>
            </section>

            <div className="border-t border-white/10 pt-8 mt-12">
              <p className="text-slate-400 text-sm">
                Tyto VOP jsou platné a účinné od 1. května 2026.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
