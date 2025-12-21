import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'

const pageTitle = 'Podmínky užití'
const pageDescription = 'Podmínky užití webu pro víkendové IT kempy Weeks provozované DDM Praha 6. Obchodní podmínky a pravidla pro užívání webu.'
const pageUrl = 'https://weeksweb.vercel.app/podminky'

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
    { name: 'Domů', url: 'https://weeksweb.vercel.app' },
    { name: 'Podmínky užití', url: 'https://weeksweb.vercel.app/podminky' },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Header />
      <main className="min-h-screen bg-white pt-24 pb-16">
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
            <h1 className="heading-1 text-gray-900 mb-4">
              Podmínky užití
            </h1>
            <p className="text-gray-600 text-lg">
              Obchodní podmínky a pravidla pro užívání webu Weeks
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Účinnost od: 1. prosince 2024
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">1. Úvodní ustanovení</h2>
              <p className="text-gray-700 mb-4">
                Tyto podmínky užití (dále jen "Podmínky") upravují přístup a užívání webových
                stránek <strong>weeksweb.vercel.app</strong> (dále jen "Web"), které slouží jako
                informační a prezentační platforma pro víkendové IT kempy Weeks.
              </p>
              <p className="text-gray-700">
                Používáním tohoto webu vyjadřujete souhlas s těmito Podmínkami. Pokud s nimi
                nesouhlasíte, prosím nepoužívejte tento Web.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">2. Provozovatel webu</h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-semibold mb-4">Provozovatelem webu je:</p>
                <p className="text-gray-900 font-medium mb-2">Dům dětí a mládeže Praha 6</p>
                <p className="text-gray-700 text-base mb-1">Sídlo: Praha 6</p>
                <p className="text-gray-700 text-base mb-1">Email: info@weeks.cz</p>
                <p className="text-gray-700 text-base mb-1">Web: weeksweb.vercel.app</p>
                <p className="text-gray-700 text-base mt-4">
                  <strong>Místo konání kempů:</strong> Kongresové centrum Praha, 5. května 11, 140 00 Praha 4 - Nusle
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">3. Účel a charakter webu</h2>
              <p className="text-gray-700 mb-4">
                Tento Web slouží výhradně k informačním a prezentačním účelům:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Prezentace víkendových IT kempů Weeks pro děti 10-15 let</li>
                <li>Informace o programu, termínech a podmínkách účasti</li>
                <li>Sběr kontaktních údajů (emailů) pro informování o nových termínech</li>
                <li>Poskytování obecných informací o aktivitách</li>
              </ul>
              <div className="bg-primary-50 p-6 rounded-lg border border-primary-200 mt-6">
                <p className="text-primary-900 font-medium mb-2">Důležité upozornění</p>
                <p className="text-primary-800 text-base">
                  Tento Web <strong>není e-shop</strong> a neuskutečňují se na něm žádné přímé
                  nákupy nebo platby. Registrace a přihlašování na kempy probíhá výhradně přes
                  externí registrační systém DDM Praha 6.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">4. Registrace na kempy</h2>
              <p className="text-gray-700 mb-4">
                Přihlašování účastníků na víkendové kempy probíhá následovně:
              </p>
              <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 Waitlist formulář</h3>
                  <p className="text-gray-700 text-base">
                    Na tomto webu můžete zanechat svůj email pro informování o nových termínech
                    a spuštění registrace.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 Registrační systém DDM</h3>
                  <p className="text-gray-700 text-base">
                    Samotná registrace dětí probíhá přes externí registrační systém DDM Praha 6.
                    Podmínky registrace, platby a účasti se řídí pravidly DDM Praha 6.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4.3 Odpovědnost</h3>
                  <p className="text-gray-700 text-base">
                    Provozovatel tohoto webu neodpovídá za proces registrace, platby ani průběh
                    kempů. Tyto aktivity zajišťuje DDM Praha 6.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">5. Pravidla užívání webu</h2>
              <p className="text-gray-700 mb-4">
                Při užívání tohoto webu se zavazujete:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Používat Web v souladu s platnými právními předpisy</li>
                <li>Neprovádět žádné aktivity, které by mohly poškodit Web nebo jeho uživatele</li>
                <li>Nepokoušet se získat neoprávněný přístup k systémům nebo datům</li>
                <li>Nezneužívat kontaktní formuláře pro spam nebo jiné nelegitimní účely</li>
                <li>Respektovat autorská práva a další práva duševního vlastnictví</li>
                <li>Poskytovat pravdivé a aktuální údaje při vyplňování formulářů</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">6. Autorská práva a duševní vlastnictví</h2>
              <p className="text-gray-700 mb-4">
                Veškerý obsah tohoto webu, včetně textů, grafiky, log, fotografií, designu a dalších
                prvků, je chráněn autorským právem a je majetkem DDM Praha 6 nebo třetích stran,
                které poskytly souhlas k jejich použití.
              </p>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.1 Zakázané použití</h3>
                  <p className="text-gray-700 text-base">
                    Bez předchozího písemného souhlasu není dovoleno kopírovat, distribuovat,
                    upravovat, zobrazovat nebo jinak používat obsah tohoto webu pro komerční účely.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.2 Osobní použití</h3>
                  <p className="text-gray-700 text-base">
                    Obsah můžete používat pro osobní, nekomerční účely, pokud zachováte všechna
                    oznámení o autorských právech a další oznámení o vlastnictví.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">7. Odpovědnost za obsah</h2>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">7.1 Přesnost informací</h3>
                  <p className="text-gray-700 text-base">
                    Veškeré informace na tomto webu jsou poskytovány v dobré víře. Snažíme se
                    udržovat informace aktuální a přesné, ale nemůžeme zaručit jejich úplnost
                    nebo správnost.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">7.2 Změny informací</h3>
                  <p className="text-gray-700 text-base">
                    Vyhrazujeme si právo kdykoli změnit nebo aktualizovat obsah webu bez předchozího
                    upozornění.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">7.3 Externí odkazy</h3>
                  <p className="text-gray-700 text-base">
                    Web může obsahovat odkazy na externí webové stránky třetích stran. Neneseme
                    odpovědnost za obsah těchto externích stránek.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">8. Omezení odpovědnosti</h2>
              <p className="text-gray-700 mb-4">
                V maximálním rozsahu povoleném platnými právními předpisy:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
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
              <h2 className="heading-3 text-gray-900 mb-4">9. Ochrana osobních údajů</h2>
              <p className="text-gray-700 mb-4">
                Zpracování osobních údajů se řídí našimi zásadami ochrany osobních údajů,
                které jsou dostupné na stránce:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <Link
                  href="/gdpr"
                  className="text-primary-600 hover:text-primary-700 font-medium text-lg underline"
                >
                  Ochrana osobních údajů (GDPR)
                </Link>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">10. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Tento web může používat cookies a podobné technologie pro zlepšení uživatelského
                zážitku a analýzu návštěvnosti. Podrobné informace o používání cookies najdete
                v našich zásadách ochrany osobních údajů.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">11. Technická dostupnost webu</h2>
              <p className="text-gray-700 mb-4">
                Snažíme se zajistit nepřetržitou dostupnost webu, ale:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
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
              <h2 className="heading-3 text-gray-900 mb-4">12. Změny podmínek</h2>
              <p className="text-gray-700 mb-4">
                Vyhrazujeme si právo tyto Podmínky kdykoli změnit nebo aktualizovat. Změny
                nabývají účinnosti okamžikem jejich zveřejnění na tomto webu.
              </p>
              <p className="text-gray-700">
                Doporučujeme pravidelně kontrolovat tyto Podmínky, abyste byli informováni
                o případných změnách. Dalším používáním webu po změně Podmínek vyjadřujete
                souhlas s aktualizovanými Podmínkami.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">13. Řešení sporů</h2>
              <p className="text-gray-700 mb-4">
                Případné spory vzniklé z těchto Podmínek nebo v souvislosti s nimi budou řešeny:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Primárně dohodou mezi stranami</li>
                <li>V případě neúspěšného vyřešení sporu příslušným soudem v České republice</li>
                <li>Podle práva České republiky</li>
              </ul>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
                <p className="text-gray-900 font-medium mb-2">
                  Mimosoudní řešení sporů
                </p>
                <p className="text-gray-700 text-base">
                  Pokud jste spotřebitelem, máte právo obrátit se s případnými stížnostmi
                  na Českou obchodní inspekci (www.coi.cz) nebo využít systém řešení sporů online
                  na platformě ODR (ec.europa.eu/consumers/odr).
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">14. Oddělitelnost ustanovení</h2>
              <p className="text-gray-700">
                Pokud by jakékoli ustanovení těchto Podmínek bylo shledáno neplatným nebo
                nevymahatelným, zůstávají ostatní ustanovení v plné platnosti a účinnosti.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">15. Kontakt</h2>
              <p className="text-gray-700 mb-4">
                V případě jakýchkoliv dotazů týkajících se těchto Podmínek nebo webu nás
                můžete kontaktovat:
              </p>
              <div className="bg-primary-50 p-6 rounded-lg border border-primary-200">
                <p className="text-primary-900 font-semibold mb-2">Weeks - DDM Praha 6</p>
                <p className="text-primary-800 text-base mb-1">
                  <strong>Email:</strong> info@weeks.cz
                </p>
                <p className="text-primary-800 text-base mb-1">
                  <strong>Web:</strong> weeksweb.vercel.app
                </p>
                <p className="text-primary-800 text-base">
                  <strong>Místo konání:</strong> Kongresové centrum Praha, 5. května 11, 140 00 Praha 4 - Nusle
                </p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-12">
              <p className="text-gray-500 text-sm">
                Tyto podmínky užití jsou platné a účinné od 1. prosince 2024.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Poslední aktualizace: 12. prosince 2024
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
