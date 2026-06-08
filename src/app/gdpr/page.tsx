import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'

const pageTitle = 'Ochrana osobních údajů (GDPR)'
const pageDescription = 'Zásady ochrany osobních údajů pro víkendové IT kempy Weeks. Informace o zpracování osobních údajů v souladu s GDPR.'
const pageUrl = 'https://weeks.cz/gdpr'

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

export default function GDPRPage() {
  const breadcrumbItems = [
    { name: 'Domů', url: 'https://weeks.cz' },
    { name: 'Ochrana osobních údajů', url: 'https://weeks.cz/gdpr' },
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
              Ochrana osobních údajů
            </h1>
            <p className="text-gray-600 text-lg">
              Zásady zpracování osobních údajů v souladu s nařízením GDPR
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Účinnost od: 1. prosince 2024
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">1. Správce osobních údajů</h2>
              <p className="text-gray-700 mb-4">
                Správcem Vašich osobních údajů je:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-semibold mb-2">DDM Praha 6 (Dům dětí a mládeže Praha 6)</p>
                <p className="text-gray-700 text-base mb-1">Projekt: Weeks - Víkendové IT kempy pro děti</p>
                <p className="text-gray-700 text-base mb-1">Email: info@weeks.cz</p>
                <p className="text-gray-700 text-base mb-1">Web: weeks.cz</p>
                <p className="text-gray-500 text-sm mt-2">DDM Praha 6 je organizátorem a správcem osobních údajů v rámci projektu Weeks.</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">2. Jaké osobní údaje sbíráme</h2>
              <p className="text-gray-700 mb-4">
                Prostřednictvím našeho webu sbíráme pouze následující osobní údaje:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Emailová adresa</strong> – při přihlášení k odběru novinek o termínech kempů (waitlist formulář)</li>
              </ul>
              <div className="bg-primary-50 p-6 rounded-lg border border-primary-200 mt-6">
                <p className="text-primary-900 font-medium mb-2">Důležitá informace</p>
                <p className="text-primary-800 text-base">
                  Registrace a přihlašování dětí na kempy probíhá výhradně přes registrační systém
                  DDM Praha 6. Při této registraci se řídíte zásadami ochrany osobních údajů DDM Praha 6.
                </p>
                <p className="text-primary-800 text-base mt-3">
                  Pro tábory v Karlových Varech (provozovatel Lukáš Kubík, IČ 24878511) platí samostatné{' '}
                  <Link href="/karlovy-vary/gdpr" className="underline">zásady ochrany osobních údajů</Link>.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">3. Účel zpracování osobních údajů</h2>
              <p className="text-gray-700 mb-4">
                Vaši emailovou adresu zpracováváme pro následující účely:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Zasílání informací o nových termínech kempů</li>
                <li>Upozornění na spuštění registrace</li>
                <li>Marketingová komunikace týkající se našich aktivit</li>
                <li>Informace o změnách v programu nebo podmínkách</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">4. Právní základ zpracování</h2>
              <p className="text-gray-700 mb-4">
                Právním základem pro zpracování Vašich osobních údajů je:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-semibold mb-2">
                  Souhlas subjektu údajů (čl. 6 odst. 1 písm. a) GDPR)
                </p>
                <p className="text-gray-700 text-base">
                  Váš dobrovolný souhlas udělený při zadání emailové adresy do waitlist formuláře.
                  Souhlas můžete kdykoli odvolat.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">5. Doba uchovávání údajů</h2>
              <p className="text-gray-700 mb-4">
                Vaše osobní údaje uchováváme po dobu:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Po dobu, po kterou trvá Váš souhlas se zasíláním informací</li>
                <li>Maximálně 3 roky od poslední interakce (otevření emailu, kliknutí na odkaz)</li>
                <li>Do doby, než požádáte o výmaz Vašich údajů</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Po uplynutí uvedené doby — nebo kdykoli na základě Vaší žádosti — Vaše údaje
                z naší evidence odstraníme nebo anonymizujeme. O výmaz můžete požádat na info@weeks.cz.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">6. Vaše práva</h2>
              <p className="text-gray-700 mb-4">
                V souvislosti se zpracováním Vašich osobních údajů máte následující práva:
              </p>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Právo na přístup</h3>
                  <p className="text-gray-700 text-base">
                    Máte právo získat informaci o tom, jaké údaje o Vás zpracováváme.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Právo na opravu</h3>
                  <p className="text-gray-700 text-base">
                    Máte právo na opravu nepřesných nebo neúplných osobních údajů.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Právo na výmaz</h3>
                  <p className="text-gray-700 text-base">
                    Máte právo požadovat vymazání Vašich osobních údajů (právo "být zapomenut").
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Právo na přenositelnost</h3>
                  <p className="text-gray-700 text-base">
                    Máte právo získat kopii Vašich údajů ve strukturovaném, běžně používaném formátu.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Právo vznést námitku</h3>
                  <p className="text-gray-700 text-base">
                    Máte právo vznést námitku proti zpracování Vašich osobních údajů.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Právo odvolat souhlas</h3>
                  <p className="text-gray-700 text-base">
                    Máte právo kdykoli odvolat souhlas se zpracováním údajů, aniž by to mělo vliv na
                    zákonnost zpracování založeného na souhlasu uděleném před jeho odvoláním.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">7. Jak uplatnit Vaše práva</h2>
              <p className="text-gray-700 mb-4">
                Pro uplatnění Vašich práv nás můžete kontaktovat:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> info@weeks.cz</li>
                  <li><strong>Odhlášení z odběru:</strong> Pomocí odkazu v patičce každého emailu</li>
                </ul>
              </div>
              <p className="text-gray-700 mt-4">
                Na Vaši žádost odpovíme bez zbytečného odkladu, nejpozději do jednoho měsíce od
                obdržení žádosti. Tuto lhůtu můžeme v odůvodněných případech prodloužit o další dva měsíce.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">8. Kontakt pro ochranu osobních údajů</h2>
              <p className="text-gray-700 mb-4">
                Pro dotazy týkající se zpracování osobních údajů nás můžete kontaktovat:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-700 text-base">Email: info@weeks.cz</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">9. Předávání údajů třetím stranám</h2>
              <p className="text-gray-700 mb-4">
                Vaše osobní údaje můžeme předávat následujícím kategoriím příjemců:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Formspree</strong> – zpracování odeslaných formulářů (kontakt, registrace zájmu)</li>
                <li><strong>Vercel</strong> – hosting a technický provoz webu</li>
                <li><strong>Google (Google Analytics)</strong> – měření návštěvnosti, pouze s Vaším souhlasem</li>
                <li><strong>Meta Platforms (Facebook Pixel)</strong> – měření účinnosti reklam, pouze s Vaším souhlasem</li>
                <li><strong>Sanity</strong> – správa obsahu webu</li>
                <li><strong>Sentry</strong> – monitoring chyb serverové části aplikace (pomáhá nám rychle odhalit a opravit závady)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Všichni zpracovatelé jsou pečlivě vybráni a zavázáni k ochraně osobních údajů v souladu
                s GDPR. Vaše údaje neprodáváme třetím stranám pro jejich marketingové účely.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">10. Cookies a sledovací technologie</h2>
              <p className="text-gray-700 mb-4">
                Náš web může používat následující typy cookies:
              </p>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nezbytné cookies</h3>
                  <p className="text-gray-700 text-base">
                    Technické cookies nutné pro správné fungování webu. Tyto cookies nevyžadují souhlas.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytické cookies</h3>
                  <p className="text-gray-700 text-base">
                    Slouží k měření návštěvnosti a analýze chování uživatelů na webu (Google Analytics).
                    Používáme je pouze s Vaším souhlasem.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketingové cookies</h3>
                  <p className="text-gray-700 text-base">
                    Slouží k měření účinnosti reklam a cílení (Facebook Pixel / Meta).
                    Aktivujeme je pouze s Vaším souhlasem.
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                Svůj souhlas s cookies můžete kdykoli změnit nebo odvolat odkazem
                <strong> „Nastavení cookies"</strong> v patičce webu — stejně snadno, jako jste jej udělili.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">10a. Přibližná poloha podle IP adresy</h2>
              <p className="text-gray-700 mb-4">
                Pro zobrazení nabídky táborů z nejbližšího místa odvozujeme z Vaší IP adresy
                přibližný region (kraj). Tuto informaci <strong>neukládáme</strong> — slouží pouze
                k jednorázovému zobrazení upozornění na tábory ve Vašem kraji (např. v Karlových Varech).
                Právním základem je náš oprávněný zájem nabídnout relevantní obsah; zpracování je
                minimální a nevede k identifikaci konkrétní osoby.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">11. Zabezpečení osobních údajů</h2>
              <p className="text-gray-700 mb-4">
                Přijali jsme vhodná technická a organizační opatření k ochraně Vašich osobních údajů
                před náhodným nebo neoprávněným zničením, ztrátou, změnou, neoprávněným zpřístupněním
                nebo jakýmkoliv jiným neoprávněným zpracováním.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Šifrované připojení (HTTPS)</li>
                <li>Pravidelné bezpečnostní aktualizace</li>
                <li>Přístup k údajům pouze pro oprávněné osoby</li>
                <li>Pravidelné zálohy dat</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">12. Právo podat stížnost</h2>
              <p className="text-gray-700 mb-4">
                Pokud se domníváte, že zpracováváme Vaše osobní údaje v rozporu s právními předpisy,
                máte právo podat stížnost u dozorového úřadu:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-semibold mb-2">
                  Úřad pro ochranu osobních údajů
                </p>
                <p className="text-gray-700 text-base mb-1">Pplk. Sochora 27</p>
                <p className="text-gray-700 text-base mb-1">170 00 Praha 7</p>
                <p className="text-gray-700 text-base mb-1">Web: www.uoou.cz</p>
                <p className="text-gray-700 text-base">Email: posta@uoou.cz</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">13. Změny zásad ochrany osobních údajů</h2>
              <p className="text-gray-700 mb-4">
                Tyto zásady můžeme čas od času aktualizovat. O podstatných změnách Vás budeme
                informovat emailem nebo prostřednictvím oznámení na našem webu.
              </p>
              <p className="text-gray-700">
                Doporučujeme Vám tyto zásady pravidelně kontrolovat, abyste byli informováni
                o tom, jak chráníme Vaše osobní údaje.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">14. Kontakt</h2>
              <p className="text-gray-700 mb-4">
                V případě jakýchkoliv dotazů ohledně těchto zásad nebo zpracování Vašich osobních
                údajů nás neváhejte kontaktovat:
              </p>
              <div className="bg-primary-50 p-6 rounded-lg border border-primary-200">
                <p className="text-primary-900 font-semibold mb-2">Weeks - projekt DDM Praha 6</p>
                <p className="text-primary-800 text-base mb-1">Email: info@weeks.cz</p>
                <p className="text-primary-800 text-base">
                  Místo konání: Kongresové centrum Praha, 5. května 11, 140 00 Praha 4 - Nusle
                </p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-12">
              <p className="text-gray-500 text-sm">
                Tyto zásady ochrany osobních údajů jsou platné a účinné od 1. prosince 2024.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Poslední aktualizace: 4. února 2026
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
