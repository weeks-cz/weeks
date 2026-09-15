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
              Ochrana osobních údajů
            </h1>
            <p className="text-ink-500 text-lg">
              Zásady zpracování osobních údajů v souladu s nařízením GDPR
            </p>
            <p className="text-ink/50 text-sm mt-4">
              Účinnost od: 1. prosince 2024
            </p>
          </header>

          {/* Content */}
          <div className="max-w-none">
            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">1. Správce osobních údajů</h2>
              <p className="text-ink mb-4">
                Správcem Vašich osobních údajů je:
              </p>
              <div className="bg-white p-6 rounded-md border border-ink/15">
                <p className="text-ink font-semibold mb-2">DDM Praha 6 (Dům dětí a mládeže Praha 6)</p>
                <p className="text-ink text-base mb-1">Projekt: Weeks - Víkendové IT kempy pro děti</p>
                <p className="text-ink text-base mb-1">Email: info@weeks.cz</p>
                <p className="text-ink text-base mb-1">Web: weeks.cz</p>
                <p className="text-ink-500 text-sm mt-2">DDM Praha 6 je organizátorem a správcem osobních údajů v rámci projektu Weeks.</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">2. Jaké osobní údaje sbíráme</h2>
              <p className="text-ink mb-4">
                Prostřednictvím našeho webu sbíráme pouze následující osobní údaje:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
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
                  <Link href="#karlovy-vary" className="underline">zásady ochrany osobních údajů</Link>.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">3. Účel zpracování osobních údajů</h2>
              <p className="text-ink mb-4">
                Vaši emailovou adresu zpracováváme pro následující účely:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
                <li>Zasílání informací o nových termínech kempů</li>
                <li>Upozornění na spuštění registrace</li>
                <li>Marketingová komunikace týkající se našich aktivit</li>
                <li>Informace o změnách v programu nebo podmínkách</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">4. Právní základ zpracování</h2>
              <p className="text-ink mb-4">
                Právním základem pro zpracování Vašich osobních údajů je:
              </p>
              <div className="bg-white p-6 rounded-md border border-ink/15">
                <p className="text-ink font-semibold mb-2">
                  Souhlas subjektu údajů (čl. 6 odst. 1 písm. a) GDPR)
                </p>
                <p className="text-ink text-base">
                  Váš dobrovolný souhlas udělený při zadání emailové adresy do waitlist formuláře.
                  Souhlas můžete kdykoli odvolat.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">5. Doba uchovávání údajů</h2>
              <p className="text-ink mb-4">
                Vaše osobní údaje uchováváme po dobu:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
                <li>Po dobu, po kterou trvá Váš souhlas se zasíláním informací</li>
                <li>Maximálně 3 roky od poslední interakce (otevření emailu, kliknutí na odkaz)</li>
                <li>Do doby, než požádáte o výmaz Vašich údajů</li>
              </ul>
              <p className="text-ink mt-4">
                Po uplynutí uvedené doby — nebo kdykoli na základě Vaší žádosti — Vaše údaje
                z naší evidence odstraníme nebo anonymizujeme. O výmaz můžete požádat na info@weeks.cz.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">6. Vaše práva</h2>
              <p className="text-ink mb-4">
                V souvislosti se zpracováním Vašich osobních údajů máte následující práva:
              </p>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">Právo na přístup</h3>
                  <p className="text-ink text-base">
                    Máte právo získat informaci o tom, jaké údaje o Vás zpracováváme.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">Právo na opravu</h3>
                  <p className="text-ink text-base">
                    Máte právo na opravu nepřesných nebo neúplných osobních údajů.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">Právo na výmaz</h3>
                  <p className="text-ink text-base">
                    Máte právo požadovat vymazání Vašich osobních údajů (právo "být zapomenut").
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">Právo na přenositelnost</h3>
                  <p className="text-ink text-base">
                    Máte právo získat kopii Vašich údajů ve strukturovaném, běžně používaném formátu.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">Právo vznést námitku</h3>
                  <p className="text-ink text-base">
                    Máte právo vznést námitku proti zpracování Vašich osobních údajů.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">Právo odvolat souhlas</h3>
                  <p className="text-ink text-base">
                    Máte právo kdykoli odvolat souhlas se zpracováním údajů, aniž by to mělo vliv na
                    zákonnost zpracování založeného na souhlasu uděleném před jeho odvoláním.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">7. Jak uplatnit Vaše práva</h2>
              <p className="text-ink mb-4">
                Pro uplatnění Vašich práv nás můžete kontaktovat:
              </p>
              <div className="bg-white p-6 rounded-md border border-ink/15">
                <ul className="space-y-2 text-ink-500">
                  <li><strong>Email:</strong> info@weeks.cz</li>
                  <li><strong>Odhlášení z odběru:</strong> Pomocí odkazu v patičce každého emailu</li>
                </ul>
              </div>
              <p className="text-ink mt-4">
                Na Vaši žádost odpovíme bez zbytečného odkladu, nejpozději do jednoho měsíce od
                obdržení žádosti. Tuto lhůtu můžeme v odůvodněných případech prodloužit o další dva měsíce.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">8. Kontakt pro ochranu osobních údajů</h2>
              <p className="text-ink mb-4">
                Pro dotazy týkající se zpracování osobních údajů nás můžete kontaktovat:
              </p>
              <div className="bg-white p-6 rounded-md border border-ink/15">
                <p className="text-ink text-base">Email: info@weeks.cz</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">9. Předávání údajů třetím stranám</h2>
              <p className="text-ink mb-4">
                Vaše osobní údaje můžeme předávat následujícím kategoriím příjemců:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
                <li><strong>Formspree</strong> – zpracování odeslaných formulářů (kontakt, registrace zájmu)</li>
                <li><strong>Vercel</strong> – hosting a technický provoz webu</li>
                <li><strong>Google (Google Analytics)</strong> – měření návštěvnosti, pouze s Vaším souhlasem</li>
                <li><strong>Meta Platforms (Facebook Pixel)</strong> – měření účinnosti reklam, pouze s Vaším souhlasem</li>
                <li><strong>Sanity</strong> – správa obsahu webu</li>
                <li><strong>Sentry</strong> – monitoring chyb serverové části aplikace (pomáhá nám rychle odhalit a opravit závady)</li>
              </ul>
              <p className="text-ink mt-4">
                Všichni zpracovatelé jsou pečlivě vybráni a zavázáni k ochraně osobních údajů v souladu
                s GDPR. Vaše údaje neprodáváme třetím stranám pro jejich marketingové účely.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">10. Cookies a sledovací technologie</h2>
              <p className="text-ink mb-4">
                Náš web může používat následující typy cookies:
              </p>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">Nezbytné cookies</h3>
                  <p className="text-ink text-base">
                    Technické cookies nutné pro správné fungování webu. Tyto cookies nevyžadují souhlas.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">Analytické cookies</h3>
                  <p className="text-ink text-base">
                    Slouží k měření návštěvnosti a analýze chování uživatelů na webu (Google Analytics).
                    Používáme je pouze s Vaším souhlasem.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-ink/15">
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">Marketingové cookies</h3>
                  <p className="text-ink text-base">
                    Slouží k měření účinnosti reklam a cílení (Facebook Pixel / Meta).
                    Aktivujeme je pouze s Vaším souhlasem.
                  </p>
                </div>
              </div>
              <p className="text-ink mt-4">
                Svůj souhlas s cookies můžete kdykoli změnit nebo odvolat odkazem
                <strong> „Nastavení cookies"</strong> v patičce webu — stejně snadno, jako jste jej udělili.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">10a. Přibližná poloha podle IP adresy</h2>
              <p className="text-ink mb-4">
                Pro zobrazení nabídky táborů z nejbližšího místa odvozujeme z Vaší IP adresy
                přibližný region (kraj). Tuto informaci <strong>neukládáme</strong> — slouží pouze
                k jednorázovému zobrazení upozornění na tábory ve Vašem kraji (např. v Karlových Varech).
                Právním základem je náš oprávněný zájem nabídnout relevantní obsah; zpracování je
                minimální a nevede k identifikaci konkrétní osoby.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">11. Zabezpečení osobních údajů</h2>
              <p className="text-ink mb-4">
                Přijali jsme vhodná technická a organizační opatření k ochraně Vašich osobních údajů
                před náhodným nebo neoprávněným zničením, ztrátou, změnou, neoprávněným zpřístupněním
                nebo jakýmkoliv jiným neoprávněným zpracováním.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
                <li>Šifrované připojení (HTTPS)</li>
                <li>Pravidelné bezpečnostní aktualizace</li>
                <li>Přístup k údajům pouze pro oprávněné osoby</li>
                <li>Pravidelné zálohy dat</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">12. Právo podat stížnost</h2>
              <p className="text-ink mb-4">
                Pokud se domníváte, že zpracováváme Vaše osobní údaje v rozporu s právními předpisy,
                máte právo podat stížnost u dozorového úřadu:
              </p>
              <div className="bg-white p-6 rounded-md border border-ink/15">
                <p className="text-ink font-semibold mb-2">
                  Úřad pro ochranu osobních údajů
                </p>
                <p className="text-ink text-base mb-1">Pplk. Sochora 27</p>
                <p className="text-ink text-base mb-1">170 00 Praha 7</p>
                <p className="text-ink text-base mb-1">Web: www.uoou.cz</p>
                <p className="text-ink text-base">Email: posta@uoou.cz</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">13. Změny zásad ochrany osobních údajů</h2>
              <p className="text-ink mb-4">
                Tyto zásady můžeme čas od času aktualizovat. O podstatných změnách Vás budeme
                informovat emailem nebo prostřednictvím oznámení na našem webu.
              </p>
              <p className="text-ink">
                Doporučujeme Vám tyto zásady pravidelně kontrolovat, abyste byli informováni
                o tom, jak chráníme Vaše osobní údaje.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">14. Kontakt</h2>
              <p className="text-ink mb-4">
                V případě jakýchkoliv dotazů ohledně těchto zásad nebo zpracování Vašich osobních
                údajů nás neváhejte kontaktovat:
              </p>
              <div className="bg-white p-6 rounded-md border border-ink/15">
                <p className="text-primary-900 font-semibold mb-2">Weeks - projekt DDM Praha 6</p>
                <p className="text-primary-800 text-base mb-1">Email: info@weeks.cz</p>
                <p className="text-primary-800 text-base">
                  Místo konání: Kongresové centrum Praha, 5. května 11, 140 00 Praha 4 - Nusle
                </p>
              </div>
            </section>

            <div className="border-t border-ink/15 pt-8 mt-12">
              <p className="text-ink-500 text-sm">
                Tyto zásady ochrany osobních údajů jsou platné a účinné od 1. prosince 2024.
              </p>
              <p className="text-ink-500 text-sm mt-2">
                Poslední aktualizace: 4. února 2026
              </p>
            </div>

            {/*
              Přeneseno doslova z bývalé samostatné stránky /karlovy-vary/gdpr (smazána spolu
              s adresou karlovy-vary v přestavbě struktury webu) — jde o jediné znění zásad,
              podle kterého se řídí přímá platba a registrace na tomto webu (Comgate).
              Text ani identifikační údaje nejsou nově formulovány.
            */}
            <div className="border-t border-ink/15 pt-12 mt-12" id="karlovy-vary">
              <p className="mono-label mb-4">Karlovy Vary</p>
              <p className="text-ink/50 text-sm mb-8">
                Účinnost od: 1. května 2026
              </p>

              <section className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">15. Správce osobních údajů</h2>
                <p className="text-ink mb-4">
                  Správcem Vašich osobních údajů je:
                </p>
                <div className="bg-white p-6 rounded-md border border-ink/15">
                  <p className="text-ink font-semibold mb-2">Lukáš Kubík</p>
                  <p className="text-ink text-base mb-1">IČO: 24878511</p>
                  <p className="text-ink text-base mb-1">Projekt: Weeks – Letní příměstský tábor chytrých technologií</p>
                  <p className="text-ink text-base mb-1">Email: info@weeks.cz</p>
                  <p className="text-ink text-base">Web: weeks.cz</p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">16. Jaké osobní údaje sbíráme</h2>
                <p className="text-ink mb-4">
                  Prostřednictvím registračního formuláře na tábor sbíráme následující osobní údaje:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-ink-500">
                  <li><strong>Jméno a příjmení dítěte</strong> – pro identifikaci účastníka</li>
                  <li><strong>Věk dítěte</strong> – pro zařazení do vhodné skupiny</li>
                  <li><strong>Jméno a příjmení rodiče / zákonného zástupce</strong></li>
                  <li><strong>Emailová adresa</strong> – pro komunikaci a potvrzení registrace</li>
                  <li><strong>Telefonní číslo</strong> – pro urgentní kontakt v průběhu tábora</li>
                  <li><strong>Stravovací omezení a alergie</strong> – pro zajištění bezpečnosti dítěte</li>
                  <li><strong>Zdravotní omezení</strong> – pouze pokud jsou relevantní pro bezpečnou účast</li>
                  <li><strong>IP adresa při odeslání registrace</strong> – uchováváme jako doklad o udělení souhlasu s obchodními podmínkami (oprávněný zájem, čl. 6 odst. 1 písm. f) GDPR)</li>
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
                <h2 className="font-display text-2xl font-bold text-ink mb-4">17. Účel zpracování osobních údajů</h2>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-md border border-ink/15">
                    <p className="text-ink font-semibold mb-2">Registrace a organizace tábora</p>
                    <ul className="list-disc pl-6 space-y-1 text-ink-500">
                      <li>Zpracování a potvrzení přihlášky</li>
                      <li>Komunikace s rodiči před táborem, v jeho průběhu a po něm</li>
                      <li>Zajištění stravování a bezpečnosti dítěte</li>
                      <li>Fakturace a vedení účetních dokladů</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-md border border-ink/15">
                    <p className="text-ink font-semibold mb-2">Informování o novinkách (pouze se souhlasem)</p>
                    <ul className="list-disc pl-6 space-y-1 text-ink-500">
                      <li>Zasílání informací o nových termínech a volných místech</li>
                      <li>Marketingová komunikace týkající se aktivit Weeks</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">18. Právní základ zpracování</h2>
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-md border border-ink/15">
                    <p className="text-ink font-semibold mb-2">
                      Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR)
                    </p>
                    <p className="text-ink text-base">
                      Zpracování registračních údajů je nezbytné pro splnění smlouvy (přihláška na tábor),
                      jejíž stranou je subjekt údajů (zákonný zástupce dítěte).
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-md border border-ink/15">
                    <p className="text-ink font-semibold mb-2">
                      Souhlas subjektu údajů (čl. 6 odst. 1 písm. a) GDPR)
                    </p>
                    <p className="text-ink text-base">
                      Zpracování emailové adresy pro zasílání novinek a marketingové komunikace
                      je podmíněno Vaším dobrovolným souhlasem. Souhlas můžete kdykoli odvolat.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-md border border-ink/15">
                    <p className="text-ink font-semibold mb-2">
                      Splnění právní povinnosti (čl. 6 odst. 1 písm. c) GDPR)
                    </p>
                    <p className="text-ink text-base">
                      Vedení účetních dokladů v souladu s účetními a daňovými předpisy ČR.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-md border border-ink/15">
                    <p className="text-ink font-semibold mb-2">
                      Výslovný souhlas se zvláštní kategorií údajů (čl. 9 odst. 2 písm. a) GDPR)
                    </p>
                    <p className="text-ink text-base">
                      Pokud v registraci uvedete zdravotní omezení nebo alergie dítěte (zvláštní
                      kategorie osobních údajů), zpracováváme je na základě Vašeho výslovného souhlasu
                      výhradně za účelem zajištění bezpečné účasti dítěte na táboře. Uvedení těchto
                      údajů je dobrovolné.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">19. Doba uchovávání údajů</h2>
                <ul className="list-disc pl-6 space-y-2 text-ink-500">
                  <li><strong>Registrační údaje</strong> – po dobu trvání tábora a 1 rok po jeho skončení (pro případné reklamace)</li>
                  <li><strong>Účetní doklady</strong> – 5 let od konce zdaňovacího období (zákonná povinnost)</li>
                  <li><strong>Emailová adresa pro novinky</strong> – do odvolání souhlasu, maximálně 3 roky od poslední interakce</li>
                </ul>
                <p className="text-ink mt-4">
                  Po uplynutí uvedených dob údaje z evidence odstraníme nebo anonymizujeme. O výmaz
                  svých údajů (mimo zákonem povinné účetní doklady) můžete kdykoli požádat na info@weeks.cz.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">20. Vaše práva</h2>
                <p className="text-ink mb-4">
                  V souvislosti se zpracováním Vašich osobních údajů máte následující práva:
                </p>
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-lg border border-ink/15">
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">Právo na přístup</h3>
                    <p className="text-ink text-base">Máte právo získat informaci o tom, jaké údaje o Vás zpracováváme.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-ink/15">
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">Právo na opravu</h3>
                    <p className="text-ink text-base">Máte právo na opravu nepřesných nebo neúplných osobních údajů.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-ink/15">
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">Právo na výmaz</h3>
                    <p className="text-ink text-base">Máte právo požadovat vymazání Vašich osobních údajů (právo „být zapomenut"), pokud odpadl právní základ pro jejich zpracování.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-ink/15">
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">Právo na přenositelnost</h3>
                    <p className="text-ink text-base">Máte právo získat kopii Vašich údajů ve strukturovaném, běžně používaném formátu.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-ink/15">
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">Právo vznést námitku</h3>
                    <p className="text-ink text-base">Máte právo vznést námitku proti zpracování Vašich osobních údajů pro účely přímého marketingu.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-ink/15">
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">Právo odvolat souhlas</h3>
                    <p className="text-ink text-base">Máte právo kdykoli odvolat souhlas se zpracováním údajů, aniž by to mělo vliv na zákonnost zpracování před jeho odvoláním.</p>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">21. Jak uplatnit Vaše práva</h2>
                <p className="text-ink mb-4">
                  Pro uplatnění Vašich práv nás kontaktujte:
                </p>
                <div className="bg-white p-6 rounded-md border border-ink/15">
                  <ul className="space-y-2 text-ink-500">
                    <li><strong>Email:</strong> info@weeks.cz</li>
                    <li><strong>Odhlášení z odběru:</strong> Pomocí odkazu v patičce každého emailu</li>
                  </ul>
                </div>
                <p className="text-ink mt-4">
                  Na Vaši žádost odpovíme bez zbytečného odkladu, nejpozději do jednoho měsíce od
                  obdržení žádosti.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">22. Předávání údajů třetím stranám</h2>
                <p className="text-ink mb-4">
                  Vaše osobní údaje jsou zpracovávány za pomoci následujících zpracovatelů:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-ink-500">
                  <li><strong>Supabase</strong> – cloudová databáze pro uložení registračních dat (servery v EU)</li>
                  <li><strong>Formspree</strong> – zpracování kontaktních a zájmových formulářů</li>
                  <li><strong>Resend</strong> – odesílání transakčních e-mailů (potvrzení registrace, nástupní list)</li>
                  <li><strong>Fakturoid</strong> – vystavení a evidence daňových dokladů (faktur)</li>
                  <li><strong>Vercel</strong> – hosting webové aplikace</li>
                  <li><strong>Comgate a.s.</strong> – provozovatel platební brány (zpracování platby), IČ 27924505</li>
                  <li><strong>Sentry</strong> – monitoring chyb serverové části aplikace</li>
                </ul>
                <p className="text-ink mt-4">
                  Vaše údaje neprodáváme třetím stranám pro jejich marketingové účely.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">23. Zabezpečení osobních údajů</h2>
                <ul className="list-disc pl-6 space-y-2 text-ink-500">
                  <li>Šifrované připojení (HTTPS)</li>
                  <li>Data v databázi chráněna pomocí Row Level Security (Supabase)</li>
                  <li>Přístup k registračním datům pouze pro oprávněné osoby</li>
                  <li>Pravidelné zálohy dat</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">24. Cookies a sledovací technologie</h2>
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-md border border-ink/15">
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">Nezbytné cookies</h3>
                    <p className="text-ink text-base">Technické cookies nutné pro správné fungování webu. Tyto cookies nevyžadují souhlas.</p>
                  </div>
                  <div className="bg-white p-6 rounded-md border border-ink/15">
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">Analytické cookies</h3>
                    <p className="text-ink text-base">Slouží k měření návštěvnosti a analýze chování uživatelů. Používáme je pouze s Vaším souhlasem.</p>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">25. Právo podat stížnost</h2>
                <p className="text-ink mb-4">
                  Pokud se domníváte, že zpracováváme Vaše osobní údaje v rozporu s právními předpisy,
                  máte právo podat stížnost u dozorového úřadu:
                </p>
                <div className="bg-white p-6 rounded-md border border-ink/15">
                  <p className="text-ink font-semibold mb-2">Úřad pro ochranu osobních údajů</p>
                  <p className="text-ink text-base mb-1">Pplk. Sochora 27</p>
                  <p className="text-ink text-base mb-1">170 00 Praha 7</p>
                  <p className="text-ink text-base mb-1">Web: www.uoou.cz</p>
                  <p className="text-ink text-base">Email: posta@uoou.cz</p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">26. Kontakt</h2>
                <div className="bg-primary-50 p-6 rounded-md border border-primary-200">
                  <p className="text-primary-900 font-semibold mb-2">Weeks – Letní příměstský tábor Karlovy Vary</p>
                  <p className="text-primary-800 text-base mb-1">Správce: Lukáš Kubík, IČO 24878511</p>
                  <p className="text-primary-800 text-base mb-1">Email: info@weeks.cz</p>
                  <p className="text-primary-800 text-base">Místo konání: Kreativní centrum VARY&amp;TE, Stará Role 175, Karlovy Vary</p>
                </div>
              </section>

              <div className="pt-8">
                <p className="text-ink-500 text-sm">
                  Tyto zásady ochrany osobních údajů jsou platné a účinné od 1. května 2026.
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
