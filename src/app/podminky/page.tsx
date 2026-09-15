import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'

const pageTitle = 'Podmínky užití'
const pageDescription = 'Podmínky užití webu pro víkendové IT kempy Weeks. Obchodní podmínky a pravidla pro užívání webu.'
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
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PodminkyPage() {
  const breadcrumbItems = [
    { name: 'Domů', url: 'https://weeks.cz' },
    { name: 'Podmínky užití', url: 'https://weeks.cz/podminky' },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Header />
      <main className="min-h-screen bg-paper pt-24 pb-16">
        <article className="section-container max-w-4xl">
          {/* Breadcrumb */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zpět na hlavní stránku
          </Link>

          {/* Header */}
          <header className="mb-12">
            <p className="mono-label mb-4">Právní</p>
            <h1 className="heading-1 text-ink mb-4">
              Podmínky užití
            </h1>
            <p className="text-ink-500 text-lg">
              Obchodní podmínky a pravidla pro užívání webu Weeks
            </p>
            <p className="text-ink/50 text-sm mt-4">
              Účinnost od: 1. prosince 2024
            </p>
          </header>

          {/* Content */}
          <div className="max-w-none">
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">1. Úvodní ustanovení</h2>
              <p className="text-ink mb-4">
                Tyto podmínky užití (dále jen "Podmínky") upravují přístup a užívání webových
                stránek <strong>weeks.cz</strong> (dále jen "Web"), které slouží jako
                informační a prezentační platforma pro víkendové IT kempy Weeks.
              </p>
              <p className="text-ink">
                Používáním tohoto webu vyjadřujete souhlas s těmito Podmínkami. Pokud s nimi
                nesouhlasíte, prosím nepoužívejte tento Web.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">2. Provozovatel webu</h2>
              <div className="bg-white p-6 rounded-md border border-ink/15">
                <p className="text-ink font-semibold mb-4">Provozovatelem webu a organizátorem kempů je:</p>
                <p className="text-ink font-medium mb-2">DDM Praha 6 (Dům dětí a mládeže Praha 6)</p>
                <p className="text-ink text-base mb-1">Projekt: Weeks - Víkendové IT kempy pro děti</p>
                <p className="text-ink text-base mb-1">Email: info@weeks.cz</p>
                <p className="text-ink text-base mb-1">Web: weeks.cz</p>
                <p className="text-ink text-base mt-4">
                  <strong>Místo konání kempů:</strong> Kongresové centrum Praha, 5. května 11, 140 00 Praha 4 - Nusle
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">3. Účel a charakter webu</h2>
              <p className="text-ink mb-4">
                Tento Web slouží výhradně k informačním a prezentačním účelům:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
                <li>Prezentace víkendových IT kempů Weeks pro děti 10-15 let</li>
                <li>Informace o programu, termínech a podmínkách účasti</li>
                <li>Sběr kontaktních údajů (emailů) pro informování o nových termínech</li>
                <li>Poskytování obecných informací o aktivitách</li>
              </ul>
              <div className="bg-primary-50 p-6 rounded-lg border border-primary-200 mt-6">
                <p className="text-primary-900 font-medium mb-2">Důležité upozornění</p>
                <p className="text-primary-800 text-base">
                  Registrace a platby pro tábory v Praze probíhají výhradně přes registrační systém
                  DDM Praha 6.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">4. Registrace na kempy</h2>
              <p className="text-ink mb-4">
                Přihlašování účastníků na víkendové kempy probíhá následovně:
              </p>
              <div className="bg-white p-6 rounded-lg border border-ink/15 space-y-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">4.1 Waitlist formulář</h3>
                  <p className="text-ink text-base">
                    Na tomto webu můžete zanechat svůj email pro informování o nových termínech
                    a spuštění registrace.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">4.2 Registrační systém DDM</h3>
                  <p className="text-ink text-base">
                    Samotná registrace dětí probíhá přes externí registrační systém DDM Praha 6.
                    Podmínky registrace, platby a účasti se řídí pravidly DDM Praha 6.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">4.3 Odpovědnost</h3>
                  <p className="text-ink text-base">
                    Provozovatel tohoto webu neodpovídá za proces registrace, platby ani průběh
                    kempů. Tyto aktivity zajišťuje DDM Praha 6.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">5. Pravidla užívání webu</h2>
              <p className="text-ink mb-4">
                Při užívání tohoto webu se zavazujete:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
                <li>Používat Web v souladu s platnými právními předpisy</li>
                <li>Neprovádět žádné aktivity, které by mohly poškodit Web nebo jeho uživatele</li>
                <li>Nepokoušet se získat neoprávněný přístup k systémům nebo datům</li>
                <li>Nezneužívat kontaktní formuláře pro spam nebo jiné nelegitimní účely</li>
                <li>Respektovat autorská práva a další práva duševního vlastnictví</li>
                <li>Poskytovat pravdivé a aktuální údaje při vyplňování formulářů</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">6. Autorská práva a duševní vlastnictví</h2>
              <p className="text-ink mb-4">
                Veškerý obsah tohoto webu, včetně textů, grafiky, log, fotografií, designu a dalších
                prvků, je chráněn autorským právem a je majetkem projektu Weeks nebo třetích stran,
                které poskytly souhlas k jejich použití.
              </p>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">6.1 Zakázané použití</h3>
                  <p className="text-ink text-base">
                    Bez předchozího písemného souhlasu není dovoleno kopírovat, distribuovat,
                    upravovat, zobrazovat nebo jinak používat obsah tohoto webu pro komerční účely.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">6.2 Osobní použití</h3>
                  <p className="text-ink text-base">
                    Obsah můžete používat pro osobní, nekomerční účely, pokud zachováte všechna
                    oznámení o autorských právech a další oznámení o vlastnictví.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">7. Odpovědnost za obsah</h2>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">7.1 Přesnost informací</h3>
                  <p className="text-ink text-base">
                    Veškeré informace na tomto webu jsou poskytovány v dobré víře. Snažíme se
                    udržovat informace aktuální a přesné, ale nemůžeme zaručit jejich úplnost
                    nebo správnost.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">7.2 Změny informací</h3>
                  <p className="text-ink text-base">
                    Vyhrazujeme si právo kdykoli změnit nebo aktualizovat obsah webu bez předchozího
                    upozornění.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">7.3 Externí odkazy</h3>
                  <p className="text-ink text-base">
                    Web může obsahovat odkazy na externí webové stránky třetích stran. Neneseme
                    odpovědnost za obsah těchto externích stránek.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">8. Omezení odpovědnosti</h2>
              <p className="text-ink mb-4">
                V maximálním rozsahu povoleném platnými právními předpisy:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
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
              <div className="bg-accent-50 p-6 rounded-lg border border-accent-200 mt-6">
                <p className="text-accent-900 font-medium mb-2">Odpovědnost za kempy</p>
                <p className="text-accent-800 text-base">
                  Za průběh, bezpečnost a kvalitu víkendových kempů odpovídá výhradně
                  DDM Praha 6 a HWLab Praha jako místo konání. Podmínky účasti a pravidla
                  odpovědnosti najdete v dokumentech DDM Praha 6.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">9. Ochrana osobních údajů</h2>
              <p className="text-ink mb-4">
                Zpracování osobních údajů se řídí našimi zásadami ochrany osobních údajů,
                které jsou dostupné na stránce:
              </p>
              <div className="bg-white p-6 rounded-md border border-ink/15">
                <Link
                  href="/gdpr"
                  className="text-primary-600 hover:text-primary-700 font-medium text-lg underline"
                >
                  Ochrana osobních údajů (GDPR)
                </Link>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">10. Cookies</h2>
              <p className="text-ink mb-4">
                Tento web může používat cookies a podobné technologie pro zlepšení uživatelského
                zážitku a analýzu návštěvnosti. Podrobné informace o používání cookies najdete
                v našich zásadách ochrany osobních údajů.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">11. Technická dostupnost webu</h2>
              <p className="text-ink mb-4">
                Snažíme se zajistit nepřetržitou dostupnost webu, ale:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
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

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">12. Změny podmínek</h2>
              <p className="text-ink mb-4">
                Vyhrazujeme si právo tyto Podmínky kdykoli změnit nebo aktualizovat. Změny
                nabývají účinnosti okamžikem jejich zveřejnění na tomto webu.
              </p>
              <p className="text-ink">
                Doporučujeme pravidelně kontrolovat tyto Podmínky, abyste byli informováni
                o případných změnách. Dalším používáním webu po změně Podmínek vyjadřujete
                souhlas s aktualizovanými Podmínkami.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">13. Řešení sporů</h2>
              <p className="text-ink mb-4">
                Případné spory vzniklé z těchto Podmínek nebo v souvislosti s nimi budou řešeny:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
                <li>Primárně dohodou mezi stranami</li>
                <li>V případě neúspěšného vyřešení sporu příslušným soudem v České republice</li>
                <li>Podle práva České republiky</li>
              </ul>
              <div className="bg-paper-soft p-6 rounded-lg border border-ink/15 mt-6">
                <p className="text-ink font-medium mb-2">
                  Mimosoudní řešení sporů
                </p>
                <p className="text-ink text-base">
                  Pokud jste spotřebitelem, máte právo obrátit se s případnými stížnostmi
                  na Českou obchodní inspekci (www.coi.cz) nebo využít systém řešení sporů online
                  na platformě ODR (ec.europa.eu/consumers/odr).
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">14. Oddělitelnost ustanovení</h2>
              <p className="text-ink">
                Pokud by jakékoli ustanovení těchto Podmínek bylo shledáno neplatným nebo
                nevymahatelným, zůstávají ostatní ustanovení v plné platnosti a účinnosti.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">15. Kontakt</h2>
              <p className="text-ink mb-4">
                V případě jakýchkoliv dotazů týkajících se těchto Podmínek nebo webu nás
                můžete kontaktovat:
              </p>
              <div className="bg-white p-6 rounded-md border border-ink/15">
                <p className="text-primary-900 font-semibold mb-2">Weeks - projekt DDM Praha 6</p>
                <p className="text-primary-800 text-base mb-1">
                  <strong>Organizátor:</strong> DDM Praha 6 (Dům dětí a mládeže Praha 6)
                </p>
                <p className="text-primary-800 text-base mb-1">
                  <strong>Email:</strong> info@weeks.cz
                </p>
                <p className="text-primary-800 text-base mb-1">
                  <strong>Web:</strong> weeks.cz
                </p>
                <p className="text-primary-800 text-base">
                  <strong>Místo konání:</strong> Kongresové centrum Praha, 5. května 11, 140 00 Praha 4 - Nusle
                </p>
              </div>
            </section>

            <div className="border-t border-ink/15 pt-8 mt-12">
              <p className="text-ink-500 text-sm">
                Tyto podmínky užití jsou platné a účinné od 1. prosince 2024.
              </p>
              <p className="text-ink-500 text-sm mt-2">
                Poslední aktualizace: 4. února 2026
              </p>
            </div>

            {/*
              Přeneseno doslova z bývalé samostatné stránky /karlovy-vary/podminky (smazána spolu
              s adresou karlovy-vary v přestavbě struktury webu) — jde o jediné znění VOP, které
              upravuje skutečný prodej (platba, storno, místo konání) přes tento web (Comgate).
              Text ani identifikační údaje nejsou nově formulovány.
            */}
            <div className="border-t border-ink/15 pt-12 mt-12" id="karlovy-vary">
              <p className="mono-label mb-4">Karlovy Vary</p>
              <p className="text-ink/50 text-sm mb-8">
                Účinnost od: 1. května 2026
              </p>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">16. Úvodní ustanovení</h2>
                <p className="text-ink mb-4">
                  Tyto všeobecné obchodní podmínky (dále jen „VOP") upravují smluvní vztah mezi pořadatelem
                  IT táborů Weeks v Karlových Varech a zákonným zástupcem přihlašovaného dítěte (dále jen „zákonný zástupce").
                </p>
                <p className="text-ink">
                  Odesláním závazné přihlášky zákonný zástupce potvrzuje, že se s těmito VOP
                  seznámil, rozumí jim a souhlasí s nimi. VOP jsou platné a závazné ode dne odeslání přihlášky.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">17. Pořadatel</h2>
                <div className="bg-white p-6 rounded-md border border-ink/15">
                  <p className="text-ink font-semibold mb-3">Pořadatelem táborů je:</p>
                  <p className="text-ink font-medium">Lukáš Kubík</p>
                  <p className="text-ink-500 mt-1">IČO: 24878511</p>
                  <p className="text-ink-500">Sídlo: Kováříkova 1145/11, Hlubočepy, 152 00 Praha 5</p>
                  <p className="text-ink-500 mt-3">
                    Fyzická osoba podnikající na základě živnostenského oprávnění.
                  </p>
                  <p className="text-ink-500 mt-3">
                    <strong>E-mail:</strong> info@weeks.cz<br />
                    <strong>Telefon:</strong> +420 703 046 440<br />
                    <strong>Web:</strong> weeks.cz
                  </p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">18. Místo konání</h2>
                <div className="bg-white p-6 rounded-md border border-ink/15">
                  <p className="text-ink font-medium mb-1">FabLab v Kreativní Centrum VARY&amp;TE</p>
                  <p className="text-ink-500">Dykova, Stará Role, 360 17 Karlovy Vary</p>
                  <p className="text-ink-500 mt-3 text-sm">
                    Provozní doba táborů: <strong>8:00–17:00</strong>
                  </p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">19. Přihláška a uzavření smlouvy</h2>
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-md border border-ink/15">
                    <h3 className="text-base font-semibold text-ink mb-2">19.1 Závazná přihláška</h3>
                    <p className="text-ink-500 text-base">
                      Přihlášení na tábor probíhá vyplněním a odesláním závazné elektronické přihlášky
                      dostupné na webových stránkách weeks.cz. Přihláška je závazná okamžikem jejího odeslání.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-md border border-ink/15">
                    <h3 className="text-base font-semibold text-ink mb-2">19.2 Vznik smluvního vztahu</h3>
                    <p className="text-ink-500 text-base">
                      Smluvní vztah mezi pořadatelem a zákonným zástupcem vzniká úhradou ceny tábora
                      v souladu s těmito VOP. Do té doby se jedná o nezávaznou rezervaci.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-md border border-ink/15">
                    <h3 className="text-base font-semibold text-ink mb-2">19.3 Potvrzení</h3>
                    <p className="text-ink-500 text-base">
                      Po úspěšné platbě obdrží zákonný zástupce potvrzovací e-mail na uvedenou e-mailovou adresu.
                      Přibližně 7 dní před zahájením tábora bude zaslán nástupní list s praktickými informacemi.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">20. Cena tábora</h2>
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
                <p className="text-ink-500 text-sm mt-4">
                  V ceně tábora jsou zahrnuty: odborné vedení, materiál a pomůcky, oběd.
                  Doprava na místo konání a zpět není součástí ceny.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">21. Platební podmínky</h2>
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-md border border-ink/15">
                    <h3 className="text-base font-semibold text-ink mb-2">21.1 Způsob platby</h3>
                    <p className="text-ink-500 text-base">
                      Platba probíhá zrychleným bankovním převodem prostřednictvím{' '}
                      <a href="https://www.comgate.eu/cs/platebni-brana" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline hover:text-primary-700">platební brány Comgate</a>.
                      Po odeslání přihlášky budete přesměrováni na bránu, kde platbu dokončíte platebním tlačítkem své banky.
                      Jak platba bankovním tlačítkem probíhá, popisuje{' '}
                      <a href="https://help.comgate.cz/docs/bankovni-prevody" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline hover:text-primary-700">nápověda Comgate</a>.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-md border border-ink/15">
                    <h3 className="text-base font-semibold text-ink mb-2">21.2 Bankovní převod</h3>
                    <p className="text-ink-500 text-base mb-2">
                      Při platbě bankovním převodem je zákonný zástupce povinen uhradit platbu
                      do <strong>3 pracovních dnů</strong> od odeslání přihlášky.
                      Po uplynutí této lhůty bez přijetí platby rezervace automaticky zaniká.
                    </p>
                    <p className="text-ink-500 text-base">
                      Číslo účtu pro bankovní převod:{' '}
                      <strong className="font-mono">2267467012/3030</strong> (Air Bank, IBAN: CZ29 3030 0000 0022 6746 7012)
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-md border border-ink/15">
                    <h3 className="text-base font-semibold text-ink mb-2">21.3 Faktura</h3>
                    <p className="text-ink-500 text-base">
                      Daňový doklad bude zákonném zástupci zaslán e-mailem po přijetí platby.
                      Pořadatel není plátcem DPH.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-md border border-ink/15">
                    <h3 className="text-base font-semibold text-ink mb-2">21.4 Provozovatel platební brány</h3>
                    <p className="text-ink-500 text-base mb-2">
                      Platební služby zajišťuje společnost{' '}
                      <a href="https://www.comgate.eu/cs/platebni-brana" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline hover:text-primary-700"><strong>Comgate a.s.</strong></a>, IČ: 27924505,
                      DIČ: CZ27924505, se sídlem Gočárova třída 1754/48b, Pražské Předměstí, 500 02 Hradec Králové.
                    </p>
                    <p className="text-ink-500 text-base">
                      Reklamace a dotazy k platbám vyřizuje přímo Comgate:{' '}
                      <a href="mailto:platby-podpora@comgate.cz" className="text-primary-600 underline hover:text-primary-700">platby-podpora@comgate.cz</a>,
                      tel. <a href="tel:+420228224267" className="text-primary-600 underline hover:text-primary-700">+420 228 224 267</a>.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">22. Storno podmínky</h2>
                <div className="overflow-hidden rounded-lg border border-ink/15">
                  <table className="w-full text-sm">
                    <thead className="bg-paper-soft">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-ink">Lhůta před zahájením tábora</th>
                        <th className="px-4 py-3 text-left font-semibold text-ink">Storno poplatek</th>
                        <th className="px-4 py-3 text-left font-semibold text-ink">Vráceno</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/15">
                      <tr className="bg-white">
                        <td className="px-4 py-3 text-ink-500">30 a více dní</td>
                        <td className="px-4 py-3 text-green-700 font-medium">0 %</td>
                        <td className="px-4 py-3 text-ink-500">plná cena</td>
                      </tr>
                      <tr className="bg-paper-soft">
                        <td className="px-4 py-3 text-ink-500">15–29 dní</td>
                        <td className="px-4 py-3 text-amber-700 font-medium">50 %</td>
                        <td className="px-4 py-3 text-ink-500">polovina ceny</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-4 py-3 text-ink-500">14 dní a méně / nenastoupení</td>
                        <td className="px-4 py-3 text-red-700 font-medium">100 %</td>
                        <td className="px-4 py-3 text-ink-500">0 Kč</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="bg-trust-50 p-4 rounded-md border border-trust-200/50">
                    <p className="text-trust-900 font-medium mb-1 text-sm">Výjimka: náhradní dítě</p>
                    <p className="text-trust-800 text-sm">
                      Pokud zákonný zástupce zajistí za odhlašované dítě náhradního účastníka,
                      storno poplatek se neúčtuje.
                    </p>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-md border border-primary-200/50">
                    <p className="text-primary-900 font-medium mb-1 text-sm">Výjimka: nemoc s lékařským potvrzením</p>
                    <p className="text-primary-800 text-sm">
                      V případě nemoci dítěte doložené lékařským potvrzením vydaným nejpozději
                      v den zahájení tábora může pořadatel přistoupit k individuálnímu řešení —
                      zpravidla vrácení 50 % ceny bez ohledu na lhůtu.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-ink/15">
                    <p className="text-ink font-medium mb-1 text-sm">Zrušení ze strany pořadatele</p>
                    <p className="text-ink-500 text-sm">
                      Pořadatel je oprávněn tábor zrušit z důvodu nedostatečného počtu přihlášených
                      nebo z jiných závažných důvodů. V takovém případě vrátí zákonným zástupcům
                      plnou uhrazenou cenu do 10 pracovních dní.
                    </p>
                  </div>
                </div>

                <p className="text-ink-500 text-sm mt-4">
                  Storno musí být oznámeno písemně e-mailem na adresu info@weeks.cz.
                  Vrácení platby proběhne na účet, ze kterého byla platba přijata, do 10 pracovních dní.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">23. Práva a povinnosti pořadatele</h2>
                <ul className="list-disc pl-6 space-y-2 text-ink-500">
                  <li>Zajistit odborné vedení tábora kvalifikovanými lektory</li>
                  <li>Zajistit bezpečné prostředí odpovídající charakteru aktivit</li>
                  <li>Zajistit oběd po dobu tábora</li>
                  <li>Informovat zákonné zástupce o průběhu tábora při zjištění nestandardní situace</li>
                  <li>Zachovávat mlčenlivost o osobních údajích účastníků v souladu s GDPR</li>
                  <li>Odmítnout účast dítěti, které svým chováním ohrožuje bezpečnost nebo výuku ostatních</li>
                  <li>Upravit program tábora z provozních nebo bezpečnostních důvodů</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">24. Práva a povinnosti zákonného zástupce a účastníka</h2>
                <ul className="list-disc pl-6 space-y-2 text-ink-500">
                  <li>Přihlásit zdravé dítě — zákonný zástupce nesmí přivést nemocné dítě na tábor</li>
                  <li>Uvést pravdivé a úplné informace v přihlášce, zejména zdravotní omezení a alergie</li>
                  <li>Dostavit se (nebo zajistit dostavení dítěte) v souladu s nástupním listem</li>
                  <li>Vyzvednou dítě způsobem uvedeným v přihlášce</li>
                  <li>Uhradit cenu tábora v souladu s platebními podmínkami</li>
                  <li>Respektovat pokyny lektorů a organizačního týmu</li>
                  <li>Dbát na to, aby dítě respektovalo vybavení místa konání a ostatní účastníky</li>
                </ul>
                <div className="mt-4 space-y-3">
                  <p className="text-ink-500">
                    <strong>Cennosti.</strong> Pořadatel doporučuje nevybavovat dítě cennými předměty
                    (mobilní telefon, tablet, šperky, vyšší hotovost). Za ztrátu, poškození nebo odcizení
                    cenných předmětů, které si dítě přinese na tábor, pořadatel nenese odpovědnost.
                  </p>
                  <p className="text-ink-500">
                    <strong>Pozdní vyzvednutí.</strong> Zákonný zástupce je povinen vyzvednout dítě
                    (nebo zajistit jeho odchod) nejpozději do konce denního programu. Při pozdním
                    vyzvednutí je pořadatel oprávněn účtovat poplatek za prodloužený dohled ve výši
                    150 Kč za každých započatých 30 minut po skončení denního programu.
                  </p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">25. Ochrana osobních údajů</h2>
                <p className="text-ink mb-4">
                  Pořadatel zpracovává osobní údaje zákonných zástupců a dětí v rozsahu nezbytném pro
                  organizaci a provoz tábora. Zpracování probíhá v souladu s nařízením GDPR a příslušnými
                  právními předpisy ČR.
                </p>
                <p className="text-ink mb-4">
                  Údaje jsou uchovávány po dobu nezbytnou pro plnění smluvních a zákonných povinností,
                  nejdéle 5 let od konání tábora. Zákonný zástupce má právo na přístup ke svým údajům,
                  jejich opravu, výmaz nebo omezení zpracování.
                </p>
                <p className="text-ink">
                  Podrobné informace o zpracování osobních údajů jsou dostupné na stránce{' '}
                  <Link href="/gdpr#karlovy-vary" className="text-primary-600 underline hover:text-primary-700">Ochrana osobních údajů (GDPR)</Link>.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">26. Pořizování fotografií a videí</h2>
                <p className="text-ink mb-4">
                  Během tábora může docházet k pořizování fotografií a videozáznamů pro dokumentaci
                  a propagaci aktivit na webu weeks.cz a sociálních sítích. Souhlas s fotografováním
                  je nepovinný a zákonný zástupce jej uděluje (nebo neuděluje) při vyplnění přihlášky.
                </p>
                <p className="text-ink">
                  Souhlas lze kdykoli odvolat písemně na adrese info@weeks.cz.
                  Odvolání souhlasu nemá vliv na zákonnost zpracování před jeho odvoláním.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">27. Nástupní list</h2>
                <p className="text-ink">
                  Přibližně 7 dní před zahájením tábora obdrží zákonný zástupce na uvedený e-mail
                  nástupní list s praktickými informacemi (přesná adresa, čas nástupu, co přinést,
                  kontakt na lektora). V případě, že e-mail neobdržíte, kontaktujte nás na info@weeks.cz.
                </p>
                <p className="text-ink mt-4">
                  <strong>Povinné dokumenty při nástupu.</strong> Zákonný zástupce je povinen v den nástupu
                  předat vedoucímu tábora vlastnoručně podepsané <strong>Prohlášení o bezinfekčnosti</strong>{' '}
                  (ne starší než 1 den) a <strong>kopii průkazu zdravotní pojišťovny</strong> dítěte.
                  Bez předání těchto dokumentů nemůže být dítěti umožněna účast na táboře. Formulář
                  prohlášení o bezinfekčnosti je součástí nástupního listu.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">28. Reklamace a stížnosti</h2>
                <p className="text-ink mb-4">
                  Reklamace nebo stížnosti uplatňujte písemně na e-mailové adrese info@weeks.cz.
                  Pořadatel se zavazuje reagovat do 5 pracovních dní.
                </p>
                <p className="text-ink mb-4">
                  Jako spotřebitel máte právo obrátit se s případnými stížnostmi na Českou obchodní
                  inspekci (www.coi.cz) nebo využít platformu pro online řešení sporů ODR
                  (ec.europa.eu/consumers/odr).
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">29. Závěrečná ustanovení</h2>
                <p className="text-ink mb-4">
                  Tyto VOP se řídí právním řádem České republiky. Případné spory budou řešeny
                  příslušným soudem v České republice.
                </p>
                <p className="text-ink mb-4">
                  Pořadatel si vyhrazuje právo tyto VOP kdykoli změnit. Na přihlášky odeslané
                  přede dnem účinnosti změny se vztahují VOP platné v den odeslání přihlášky.
                </p>
                <p className="text-ink">
                  Pokud by jakékoli ustanovení těchto VOP bylo shledáno neplatným, ostatní
                  ustanovení zůstávají v plné platnosti.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">30. Kontakt</h2>
                <div className="bg-primary-50 p-6 rounded-md border border-primary-200">
                  <p className="text-primary-900 font-semibold mb-3">Weeks – IT tábory Karlovy Vary</p>
                  <p className="text-primary-800 mb-1"><strong>Pořadatel:</strong> Lukáš Kubík, IČO: 24878511 (úplná adresa sídla v čl. 16)</p>
                  <p className="text-primary-800 mb-1"><strong>Místo konání:</strong> FabLab v Kreativní Centrum VARY&amp;TE, Dykova, Stará Role, 360 17 Karlovy Vary</p>
                  <p className="text-primary-800 mb-1"><strong>E-mail:</strong> info@weeks.cz</p>
                  <p className="text-primary-800"><strong>Telefon:</strong> +420 703 046 440</p>
                </div>
              </section>

              <div className="pt-8">
                <p className="text-ink-500 text-sm">
                  Tyto VOP jsou platné a účinné od 1. května 2026.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
