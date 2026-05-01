import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const pageTitle = 'Ochrana osobních údajů (GDPR) – Weeks Karlovy Vary'
const pageDescription = 'Zásady ochrany osobních údajů pro letní příměstský tábor Weeks v Karlových Varech. Informace o zpracování osobních údajů v souladu s GDPR.'
const pageUrl = 'https://weeks.cz/karlovy-vary/gdpr'

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
  robots: {
    index: true,
    follow: true,
  },
}

export default function KVGDPRPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <article className="section-container max-w-4xl">
          {/* Back link */}
          <Link
            href="/karlovy-vary"
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
              Účinnost od: 1. května 2026
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
                <p className="text-gray-900 font-semibold mb-2">Lukáš Kubík</p>
                <p className="text-gray-700 text-base mb-1">IČO: 24878511</p>
                <p className="text-gray-700 text-base mb-1">Projekt: Weeks – Letní příměstský tábor chytrých technologií</p>
                <p className="text-gray-700 text-base mb-1">Email: info@weeks.cz</p>
                <p className="text-gray-700 text-base">Web: weeks.cz/karlovy-vary</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">2. Jaké osobní údaje sbíráme</h2>
              <p className="text-gray-700 mb-4">
                Prostřednictvím registračního formuláře na tábor sbíráme následující osobní údaje:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Jméno a příjmení dítěte</strong> – pro identifikaci účastníka</li>
                <li><strong>Věk dítěte</strong> – pro zařazení do vhodné skupiny</li>
                <li><strong>Jméno a příjmení rodiče / zákonného zástupce</strong></li>
                <li><strong>Emailová adresa</strong> – pro komunikaci a potvrzení registrace</li>
                <li><strong>Telefonní číslo</strong> – pro urgentní kontakt v průběhu tábora</li>
                <li><strong>Stravovací omezení a alergie</strong> – pro zajištění bezpečnosti dítěte</li>
                <li><strong>Zdravotní omezení</strong> – pouze pokud jsou relevantní pro bezpečnou účast</li>
              </ul>
              <div className="bg-primary-50 p-6 rounded-lg border border-primary-200 mt-6">
                <p className="text-primary-900 font-medium mb-2">Záchranná síť (waitlist)</p>
                <p className="text-primary-800 text-base">
                  Pokud zadáte pouze emailovou adresu do formuláře pro odběr novinek,
                  zpracováváme pouze tuto adresu — bez dalších osobních údajů.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">3. Účel zpracování osobních údajů</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-semibold mb-2">Registrace a organizace tábora</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Zpracování a potvrzení přihlášky</li>
                    <li>Komunikace s rodiči před táborem, v jeho průběhu a po něm</li>
                    <li>Zajištění stravování a bezpečnosti dítěte</li>
                    <li>Fakturace a vedení účetních dokladů</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-semibold mb-2">Informování o novinkách (pouze se souhlasem)</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Zasílání informací o nových termínech a volných místech</li>
                    <li>Marketingová komunikace týkající se aktivit Weeks</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">4. Právní základ zpracování</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-semibold mb-2">
                    Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR)
                  </p>
                  <p className="text-gray-700 text-base">
                    Zpracování registračních údajů je nezbytné pro splnění smlouvy (přihláška na tábor),
                    jejíž stranou je subjekt údajů (zákonný zástupce dítěte).
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-semibold mb-2">
                    Souhlas subjektu údajů (čl. 6 odst. 1 písm. a) GDPR)
                  </p>
                  <p className="text-gray-700 text-base">
                    Zpracování emailové adresy pro zasílání novinek a marketingové komunikace
                    je podmíněno Vaším dobrovolným souhlasem. Souhlas můžete kdykoli odvolat.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-900 font-semibold mb-2">
                    Splnění právní povinnosti (čl. 6 odst. 1 písm. c) GDPR)
                  </p>
                  <p className="text-gray-700 text-base">
                    Vedení účetních dokladů v souladu s účetními a daňovými předpisy ČR.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">5. Doba uchovávání údajů</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Registrační údaje</strong> – po dobu trvání tábora a 1 rok po jeho skončení (pro případné reklamace)</li>
                <li><strong>Účetní doklady</strong> – 5 let od konce zdaňovacího období (zákonná povinnost)</li>
                <li><strong>Emailová adresa pro novinky</strong> – do odvolání souhlasu, maximálně 3 roky od poslední interakce</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">6. Vaše práva</h2>
              <p className="text-gray-700 mb-4">
                V souvislosti se zpracováním Vašich osobních údajů máte následující práva:
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Právo na přístup', text: 'Máte právo získat informaci o tom, jaké údaje o Vás zpracováváme.' },
                  { title: 'Právo na opravu', text: 'Máte právo na opravu nepřesných nebo neúplných osobních údajů.' },
                  { title: 'Právo na výmaz', text: 'Máte právo požadovat vymazání Vašich osobních údajů (právo „být zapomenut"), pokud odpadl právní základ pro jejich zpracování.' },
                  { title: 'Právo na přenositelnost', text: 'Máte právo získat kopii Vašich údajů ve strukturovaném, běžně používaném formátu.' },
                  { title: 'Právo vznést námitku', text: 'Máte právo vznést námitku proti zpracování Vašich osobních údajů pro účely přímého marketingu.' },
                  { title: 'Právo odvolat souhlas', text: 'Máte právo kdykoli odvolat souhlas se zpracováním údajů, aniž by to mělo vliv na zákonnost zpracování před jeho odvoláním.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700 text-base">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">7. Jak uplatnit Vaše práva</h2>
              <p className="text-gray-700 mb-4">
                Pro uplatnění Vašich práv nás kontaktujte:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Email:</strong> info@weeks.cz</li>
                  <li><strong>Odhlášení z odběru:</strong> Pomocí odkazu v patičce každého emailu</li>
                </ul>
              </div>
              <p className="text-gray-700 mt-4">
                Na Vaši žádost odpovíme bez zbytečného odkladu, nejpozději do jednoho měsíce od
                obdržení žádosti.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">8. Předávání údajů třetím stranám</h2>
              <p className="text-gray-700 mb-4">
                Vaše osobní údaje jsou zpracovávány za pomoci následujících zpracovatelů:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Supabase</strong> – cloudová databáze pro uložení registračních dat (servery v EU)</li>
                <li><strong>Formspree</strong> – zpracování kontaktních formulářů a zasílání emailů</li>
                <li><strong>Vercel</strong> – hosting webové aplikace</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Vaše údaje neprodáváme třetím stranám pro jejich marketingové účely.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">9. Zabezpečení osobních údajů</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Šifrované připojení (HTTPS)</li>
                <li>Data v databázi chráněna pomocí Row Level Security (Supabase)</li>
                <li>Přístup k registračním datům pouze pro oprávněné osoby</li>
                <li>Pravidelné zálohy dat</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">10. Cookies a sledovací technologie</h2>
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
                    Slouží k měření návštěvnosti a analýze chování uživatelů. Používáme je pouze s Vaším souhlasem.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">11. Právo podat stížnost</h2>
              <p className="text-gray-700 mb-4">
                Pokud se domníváte, že zpracováváme Vaše osobní údaje v rozporu s právními předpisy,
                máte právo podat stížnost u dozorového úřadu:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-semibold mb-2">Úřad pro ochranu osobních údajů</p>
                <p className="text-gray-700 text-base mb-1">Pplk. Sochora 27</p>
                <p className="text-gray-700 text-base mb-1">170 00 Praha 7</p>
                <p className="text-gray-700 text-base mb-1">Web: www.uoou.cz</p>
                <p className="text-gray-700 text-base">Email: posta@uoou.cz</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="heading-3 text-gray-900 mb-4">12. Kontakt</h2>
              <div className="bg-primary-50 p-6 rounded-lg border border-primary-200">
                <p className="text-primary-900 font-semibold mb-2">Weeks – Letní příměstský tábor Karlovy Vary</p>
                <p className="text-primary-800 text-base mb-1">Správce: Lukáš Kubík, IČO 24878511</p>
                <p className="text-primary-800 text-base mb-1">Email: info@weeks.cz</p>
                <p className="text-primary-800 text-base">Místo konání: Kreativní centrum Vary&amp;Te, Stará Role 175, Karlovy Vary</p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-12">
              <p className="text-gray-500 text-sm">
                Tyto zásady ochrany osobních údajů jsou platné a účinné od 1. května 2026.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
