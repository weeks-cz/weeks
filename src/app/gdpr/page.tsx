import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import { SITE } from '@/lib/site'

const pageTitle = 'Ochrana osobních údajů (GDPR)'
const pageDescription = 'Zásady ochrany osobních údajů pro IT tábory Weeks. Informace o zpracování osobních údajů v souladu s GDPR.'
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

/*
  Jedno znění zásad pro celý web.

  Do téhle fáze stránka nesla dvě paralelní sady oddílů: horní (správce DDM
  Praha 6, „sbíráme pouze e-mailovou adresu") a dolní, přenesenou z bývalé
  /karlovy-vary/gdpr (správce Lukáš Kubík, osm kategorií údajů). Sady si
  odporovaly ve správci, rozsahu údajů, právním základu i době uchování.
  Zůstalo jedno znění: identifikace pořadatele ze `SITE`, rozsah údajů podle
  toho, co formuláře skutečně sbírají (`src/lib/registration.ts`), a u každého
  tématu ta z obou formulací, která popisuje skutečný provoz webu (registrace
  v Supabase, platba přes Comgate). Žádná právní věta tu není nově vymyšlená —
  všechny pocházejí z předchozího znění téhle stránky.

  Text čeká na kontrolu týmu.
*/

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
              Účinnost od: 16. září 2026
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
                <p className="text-ink font-semibold mb-2">{SITE.legalName}</p>
                <p className="text-ink text-base mb-1">IČO: {SITE.ico}</p>
                <p className="text-ink text-base mb-1">Sídlo: {SITE.address}</p>
                <p className="text-ink text-base mb-1">Zapsaná v obchodním rejstříku vedeném u {SITE.court}</p>
                <p className="text-ink text-base mb-1">E-mail: {SITE.email}</p>
                <p className="text-ink text-base mb-1">Telefon: {SITE.phone}</p>
                <p className="text-ink text-base">Web: weeks.cz</p>
                <p className="text-ink-500 text-sm mt-2">
                  {SITE.legalName} je pořadatelem táborů Weeks a správcem osobních údajů účastníků.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">2. Jaké osobní údaje zpracováváme</h2>
              <p className="text-ink mb-4">
                Rozsah údajů závisí na tom, který formulář na webu vyplníte.
              </p>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-md border border-ink/15">
                  <p className="text-ink font-semibold mb-3">Závazná přihláška dítěte na tábor</p>
                  <p className="text-ink-500 text-base mb-3">Údaje o zákonném zástupci:</p>
                  <ul className="list-disc pl-6 space-y-2 text-ink-500 mb-4">
                    <li><strong>Jméno a příjmení</strong> – pro identifikaci smluvní strany</li>
                    <li><strong>E-mailová adresa</strong> – pro komunikaci a potvrzení registrace</li>
                    <li><strong>Telefonní číslo</strong> – pro urgentní kontakt v průběhu tábora</li>
                    <li><strong>Adresa</strong> – pro vystavení daňového dokladu</li>
                  </ul>
                  <p className="text-ink-500 text-base mb-3">Údaje o dítěti:</p>
                  <ul className="list-disc pl-6 space-y-2 text-ink-500 mb-4">
                    <li><strong>Jméno a příjmení</strong> – pro identifikaci účastníka</li>
                    <li><strong>Datum narození</strong> – pro zařazení do vhodné skupiny</li>
                    <li><strong>Zdravotní pojišťovna</strong> – pro případ ošetření dítěte; při nástupu se dokládá kopií průkazu (viz <Link href="/podminky" className="underline">podmínky</Link>, čl. 27)</li>
                    <li><strong>Zdravotní omezení a alergie</strong> (nepovinné) – pro zajištění bezpečnosti a stravování dítěte</li>
                    <li><strong>Dosavadní zkušenosti</strong> (nepovinné) – pro přizpůsobení zadání</li>
                  </ul>
                  <p className="text-ink-500 text-base mb-3">Údaje o vyzvedávání:</p>
                  <ul className="list-disc pl-6 space-y-2 text-ink-500 mb-4">
                    <li><strong>Způsob vyzvednutí</strong> (dítě odchází samo / s uvedenou osobou)</li>
                    <li><strong>Čas odchodu</strong> (nepovinné)</li>
                    <li><strong>Osoby oprávněné dítě vyzvednout</strong> (nepovinné) – abychom dítě nepředali nikomu jinému</li>
                  </ul>
                  <p className="text-ink-500 text-base mb-3">Souhlasy a doklad o jejich udělení:</p>
                  <ul className="list-disc pl-6 space-y-2 text-ink-500 mb-4">
                    <li><strong>Souhlas s obchodními podmínkami</strong> a <strong>souhlas se zpracováním osobních údajů</strong> (oba povinné)</li>
                    <li><strong>Souhlas s pořizováním fotografií</strong> a <strong>souhlas se zasíláním novinek</strong> (oba nepovinné)</li>
                    <li><strong>IP adresa při odeslání registrace</strong> – uchováváme jako doklad o udělení souhlasu s obchodními podmínkami (oprávněný zájem, čl. 6 odst. 1 písm. f) GDPR)</li>
                  </ul>
                  <p className="text-ink-500 text-base">
                    Dále zpracováváme <strong>poznámku k objednávce</strong> (nepovinné), pokud ji v posledním
                    kroku přihlášky vyplníte.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-md border border-ink/15">
                  <p className="text-ink font-semibold mb-3">Formuláře zájmu a odběr novinek</p>
                  <ul className="list-disc pl-6 space-y-2 text-ink-500">
                    <li><strong>Jméno a e-mailová adresa</strong> – při zanechání kontaktu na chystaný turnus</li>
                    <li><strong>E-mailová adresa</strong> – při přihlášení k odběru novinek na úvodní stránce</li>
                  </ul>
                  <p className="text-ink-500 text-base mt-3">
                    Zadáte-li pouze kontakt do těchto formulářů, žádné další osobní údaje o Vás
                    ani o dítěti nezpracováváme.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-md border border-ink/15">
                  <p className="text-ink font-semibold mb-3">Kontaktní formulář</p>
                  <ul className="list-disc pl-6 space-y-2 text-ink-500">
                    <li><strong>Jméno, e-mailová adresa a text zprávy</strong> – pro vyřízení Vašeho dotazu</li>
                  </ul>
                </div>
              </div>

              <div className="bg-primary-50 p-6 rounded-lg border border-primary-200 mt-6">
                <p className="text-primary-900 font-medium mb-2">Zdravotní omezení a alergie</p>
                <p className="text-primary-800 text-base">
                  Zdravotní omezení a alergie dítěte jsou zvláštní kategorií osobních údajů.
                  Jejich uvedení je dobrovolné a zpracováváme je na základě Vašeho výslovného
                  souhlasu — podrobnosti v článku 4 níže.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">3. Účel zpracování osobních údajů</h2>
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
                    <li>Upozornění na spuštění registrace</li>
                    <li>Informace o změnách v programu nebo podmínkách</li>
                    <li>Marketingová komunikace týkající se aktivit Weeks</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">4. Právní základ zpracování</h2>
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
                    Zpracování e-mailové adresy pro zasílání novinek a marketingové komunikace
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
                <div className="bg-white p-6 rounded-md border border-ink/15">
                  <p className="text-ink font-semibold mb-2">
                    Oprávněný zájem (čl. 6 odst. 1 písm. f) GDPR)
                  </p>
                  <p className="text-ink text-base">
                    IP adresu v okamžiku odeslání přihlášky uchováváme jako doklad o udělení
                    souhlasu s obchodními podmínkami.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">5. Doba uchovávání údajů</h2>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
                <li><strong>Registrační údaje</strong> – po dobu trvání tábora a 1 rok po jeho skončení (pro případné reklamace)</li>
                <li><strong>Účetní doklady</strong> – 5 let od konce zdaňovacího období (zákonná povinnost)</li>
                <li><strong>E-mailová adresa pro novinky</strong> – do odvolání souhlasu, maximálně 3 roky od poslední interakce</li>
              </ul>
              <p className="text-ink mt-4">
                Po uplynutí uvedených dob — nebo kdykoli na základě Vaší žádosti — údaje z evidence
                odstraníme nebo anonymizujeme. O výmaz svých údajů (mimo zákonem povinné účetní
                doklady) můžete kdykoli požádat na {SITE.email}.
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
                    Máte právo požadovat vymazání Vašich osobních údajů (právo „být zapomenut"),
                    pokud odpadl právní základ pro jejich zpracování.
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
                    Máte právo vznést námitku proti zpracování Vašich osobních údajů, zejména
                    pro účely přímého marketingu.
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
                  <li><strong>E-mail:</strong> {SITE.email}</li>
                  <li><strong>Odhlášení z odběru:</strong> Pomocí odkazu v patičce každého e-mailu</li>
                </ul>
              </div>
              <p className="text-ink mt-4">
                Na Vaši žádost odpovíme bez zbytečného odkladu, nejpozději do jednoho měsíce od
                obdržení žádosti. Tuto lhůtu můžeme v odůvodněných případech prodloužit o další dva měsíce.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">8. Předávání údajů třetím stranám</h2>
              <p className="text-ink mb-4">
                Vaše osobní údaje jsou zpracovávány za pomoci následujících zpracovatelů:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
                <li><strong>Supabase</strong> – cloudová databáze pro uložení registračních dat (servery v EU)</li>
                <li><strong>Formspree</strong> – zpracování kontaktních a zájmových formulářů</li>
                <li><strong>Resend</strong> – odesílání transakčních e-mailů (potvrzení registrace, nástupní list)</li>
                <li><strong>Fakturoid</strong> – vystavení a evidence daňových dokladů (faktur)</li>
                <li><strong>Comgate a.s.</strong> – provozovatel platební brány (zpracování platby), IČ 27924505</li>
                <li><strong>Vercel</strong> – hosting a technický provoz webu</li>
                <li><strong>Sentry</strong> – monitoring chyb serverové části aplikace (pomáhá nám rychle odhalit a opravit závady)</li>
                <li><strong>Sanity</strong> – správa obsahu webu</li>
                <li><strong>Google (Google Analytics)</strong> – měření návštěvnosti, pouze s Vaším souhlasem</li>
                <li><strong>Meta Platforms (Facebook Pixel)</strong> – měření účinnosti reklam, pouze s Vaším souhlasem</li>
              </ul>
              <p className="text-ink mt-4">
                Všichni zpracovatelé jsou pečlivě vybráni a zavázáni k ochraně osobních údajů v souladu
                s GDPR. Vaše údaje neprodáváme třetím stranám pro jejich marketingové účely.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">9. Zabezpečení osobních údajů</h2>
              <p className="text-ink mb-4">
                Přijali jsme vhodná technická a organizační opatření k ochraně Vašich osobních údajů
                před náhodným nebo neoprávněným zničením, ztrátou, změnou, neoprávněným zpřístupněním
                nebo jakýmkoliv jiným neoprávněným zpracováním.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-ink-500">
                <li>Šifrované připojení (HTTPS)</li>
                <li>Data v databázi chráněna pomocí Row Level Security (Supabase)</li>
                <li>Přístup k registračním datům pouze pro oprávněné osoby</li>
                <li>Pravidelné bezpečnostní aktualizace</li>
                <li>Pravidelné zálohy dat</li>
              </ul>
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
              <h2 className="font-display text-2xl font-bold text-ink mb-4">11. Přibližná poloha podle IP adresy</h2>
              <p className="text-ink mb-4">
                Pro zobrazení nabídky táborů z nejbližšího místa odvozujeme z Vaší IP adresy
                přibližný region (kraj). Tuto informaci <strong>neukládáme</strong> — slouží pouze
                k jednorázovému zobrazení upozornění na tábory ve Vašem kraji. Právním základem je
                náš oprávněný zájem nabídnout relevantní obsah; zpracování je minimální a nevede
                k identifikaci konkrétní osoby.
              </p>
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
                <p className="text-ink text-base">E-mail: posta@uoou.cz</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">13. Změny zásad ochrany osobních údajů</h2>
              <p className="text-ink mb-4">
                Tyto zásady můžeme čas od času aktualizovat. O podstatných změnách Vás budeme
                informovat e-mailem nebo prostřednictvím oznámení na našem webu.
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
              <div className="bg-primary-50 p-6 rounded-md border border-primary-200">
                <p className="text-primary-900 font-semibold mb-2">{SITE.legalName}</p>
                <p className="text-primary-800 text-base mb-1">IČO: {SITE.ico}</p>
                <p className="text-primary-800 text-base mb-1">Sídlo: {SITE.address}</p>
                <p className="text-primary-800 text-base mb-1">E-mail: {SITE.email}</p>
                <p className="text-primary-800 text-base mb-1">Telefon: {SITE.phone}</p>
                <p className="text-primary-800 text-base">
                  Místo konání tábora je uvedené u konkrétního turnusu na weeks.cz.
                </p>
              </div>
            </section>

            <div className="border-t border-ink/15 pt-8 mt-12">
              <p className="text-ink-500 text-sm">
                Tyto zásady ochrany osobních údajů jsou platné a účinné od 16. září 2026.
              </p>
              <p className="text-ink-500 text-sm mt-2">
                Poslední aktualizace: 16. září 2026
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
