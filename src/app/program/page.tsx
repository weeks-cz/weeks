'use client'

import { motion } from 'framer-motion'
import { Printer, Cpu, Box, Globe, Gamepad2, Code2, Sparkles, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Všech 7 programů s detailními popisy podle PDF
const programs = [
  {
    id: 'mix',
    icon: Sparkles,
    title: 'MIX - Ochutnej vše',
    subtitle: 'Ideální pro začátečníky',
    color: 'mix',
    image: '/images/hwlab/hwlab-7972.webp',
    description: 'Tábor zaměřený na chytré technologie a jejich propojování s reálným světem. Cílem není stát se odborníkem ve všech tématech, ale získat vhled do světa chytrých technologií s cílem, aby si dítě našlo odvětví, které ho chytne a začne se v něm dále rozvíjet.',
    extendedDescription: 'Během dvou dnů si děti prakticky vyzkouší 3D tisk, IoT (Micro:bit) i virtuální realitu. Důraz je na to, aby dítě vidělo chytré využití těchto technologií v dnešním světě a začalo ho napadat další využití. VR není jen o hraní - využijeme výukové aplikace zaměřené na rozvoj dítěte.',
    learnings: [
      'Ochutnávka budoucnosti: prakticky vyzkouší 3D tisk, IoT i virtuální realitu',
      '3D tisk v praxi: připraví model, ovládne tiskárnu, odnese si vlastní výtisk',
      'Svět chytré elektroniky: pochopí senzory a naprogramuje první projekt na Micro:bit',
      'VR i pro vzdělávání: virtuální realita není jen o hraní her',
      'Nalezení směru: zjistí, která technologie ho baví nejvíce',
    ],
    ultimateGoal: 'Otevřít dětem dveře do světa chytrých technologií, nechat je "ochutnat" budoucnost a pomoci jim objevit tu jednu vášeň, která je chytne a nasměruje jejich další rozvoj.',
  },
  {
    id: '3d-tisk',
    icon: Printer,
    title: '3D tisk',
    subtitle: 'Od návrhu k výtisku',
    color: 'primary',
    image: '/images/hwlab/hwlab-7990.webp',
    description: 'Základní rozdělení druhů 3D tiskáren na FDM a SLA. Popis jak fungují, výhody a nevýhody jednotlivých druhů. Ukázka filamentu vs. resinu a obecných využití 3D tisku v praxi.',
    extendedDescription: 'Práce se slicerem - základní funkce, ovládání a kompletní příprava prvního tisku. Rozebrání do hloubky, co dělají různé funkce a nastavení. Základy modelování v Tinkercad, export do sliceru a tisk. Post-processing včetně barvení, lepení, broušení a vyhlazování.',
    learnings: [
      'Vysvětlit jaké tiskárny máme a jaké jsou mezi nimi rozdíly (FDM vs SLA)',
      'Vybrat vhodný filament na konkrétní projekt a obhájit volbu',
      'Vyhledat a připravit model k 3D tisku ve sliceru',
      'Zavést filament, spustit tisk, vyčistit podložku, zkalibrovat tiskárnu',
      'Základy modelování a jednoduché úpravy modelů',
    ],
    ultimateGoal: 'Dítě dokáže po zadání problému vytvořit model (součástku), vybrat filament, naslicovat a vytisknout funkční díl a vysvětlit jednotlivé kroky.',
  },
  {
    id: 'iot',
    icon: Cpu,
    title: 'IoT & Arduino',
    subtitle: 'Chytrá elektronika',
    color: 'trust',
    image: '/images/hwlab/hwlab-7965.webp',
    description: 'Úvod do IoT - vysvětlení pojmů a využití ve světě. Ukázka mikropočítačů (ESP, Raspberry Pi, Micro:bit), představení Arduina a rozdíly mezi analogovým a digitálním signálem.',
    extendedDescription: 'Práce s breadboardem, vytvoření jednoduchého obvodu s LED diodou. Ukázka senzorů - vstupní a výstupní zařízení. Seznámení s Arduino IDE, základy práce s bloky a první kód. Implementace složitějších modulů jako display. Základy elektrotechniky a Ohmův zákon.',
    learnings: [
      'Vysvětlit co znamená IoT a kde se s tím mohou setkat',
      'Rozlišit druhy mikropočítačů které používáme',
      'Vysvětlit základní rozdíly analog vs digital, vstupní vs výstupní',
      'Správně zapojit jednoduchý obvod na breadboardu',
      'Vytvořit program a nahrát ho na Arduino',
    ],
    ultimateGoal: 'Dítě dokáže samostatně zapojit obvod se senzory, naprogramovat Arduino a vytvořit funkční IoT projekt.',
  },
  {
    id: 'blender',
    icon: Box,
    title: '3D modelování v Blenderu',
    subtitle: 'Grafika a animace',
    color: 'accent',
    image: '/images/hwlab/hwlab-7978.webp',
    description: 'Úvodní seznámení s oborem. Rozdělení 3D modelování na grafické a "praktické". Rozdělení grafiky na vektorovou a bitmapovou. Ukázka různých programů na modelování.',
    extendedDescription: 'První spuštění Blenderu, orientace v prostředí. Object mode vs edit mode, nástroje na úpravu modelu. Práce s Modifiers, vytváření textur. Import online modelů a textur. Tvorba scény, práce s kamerou. Rozdíly mezi Eevee a Cycles, vytváření renderů.',
    learnings: [
      'Schopnost říct co je 3D modelování a k čemu slouží',
      'Představení různých programů pro modelování',
      'Vysvětlení rozdělení druhů grafik a účelu modelování',
      'Tvorba jednoduchých modelů s využitím nástrojů Blenderu',
      'Tvorba základní textury a vytvoření kvalitního renderu',
    ],
    ultimateGoal: 'Dítě si odnese vlastní 3D model s texturami a profesionální render, který může sdílet nebo použít pro 3D tisk.',
  },
  {
    id: 'web',
    icon: Globe,
    title: 'Tvorba webu',
    subtitle: 'HTML, CSS & publikace',
    color: 'cta',
    image: '/images/hwlab/hwlab-7975.webp',
    description: 'Úvod do světa webových stránek - co je to web, jak funguje. Ukázka různých typů webových stránek (osobní portfolio, blog, e-shop). První kroky v HTML - struktura stránky, základní tagy.',
    extendedDescription: 'Úvod do CSS - co jsou styly, jak propojit s HTML. Práce s barvami, fonty, velikostmi a pozadím. Základy layoutu a responzivity. Práce s obrázky a ikonami - kde hledat volně dostupné zdroje. Základy bezpečnosti - co na web nedávat.',
    learnings: [
      'Chápat základní principy fungování webu (HTML, CSS, prohlížeč)',
      'Vytvořit jednoduchou webovou stránku s textem, obrázky a odkazy',
      'Nastylovat stránku pomocí CSS (barvy, fonty, rozložení)',
      'Vědět kde hledat zdroje a inspiraci (obrázky, ikony, návody)',
      'Základní povědomí o bezpečnosti a soukromí na webu',
    ],
    ultimateGoal: 'Dítě si odnese vlastní funkční webovou stránku (portfolio nebo stránku na vlastní téma) publikovanou online, kterou může ukázat rodině a kamarádům.',
  },
  {
    id: 'hry',
    icon: Gamepad2,
    title: 'Vývoj her',
    subtitle: 'Unity & Visual Scripting',
    color: 'primary',
    image: '/images/hwlab/hwlab-7968.webp',
    description: 'Úvod do světa vývoje her - všichni hry hrají, ale kdo z dětí ví jak doopravdy vznikají? Pochopení základních principů herního vývoje, enginů, základní logiky a principu programování.',
    extendedDescription: 'Práce v herním enginu Unity s využitím Visual Scripting (složitější Scratch). Tvorba jednoduché 2D hry - skákačka nebo top-down. Grafika bude předpřipravená. Naučíme se orientaci v Unity, práci s nástroji, pohyb hráče, smrt hráče, měření score, UI.',
    learnings: [
      'Od hráče k tvůrci: nahlédnou pod pokličku herního vývoje',
      'Reálný výsledek: hratelný build vlastní 2D hry a zdrojové soubory',
      'Logické myšlení: principy algoritmizace (podmínky, proměnné, akce)',
      'Samostatnost při řešení problémů: prostor pro vlastní nápady',
      'Práce s profesionálními nástroji: orientace v Unity',
    ],
    ultimateGoal: 'Proměnit děti z pasivních hráčů na aktivní tvůrce, kteří pochopí "jak to funguje" a odnesou si domů svou první, vlastnoručně naprogramovanou hru v Unity.',
  },
  {
    id: 'csharp',
    icon: Code2,
    title: 'Programování C#',
    subtitle: 'Základy programování',
    color: 'trust',
    image: '/images/hwlab/hwlab-7962.webp',
    description: 'Úvod a rozdělení programovacích jazyků. Základy programování - proměnné, cykly, podmínky a funkce. Praktické cvičení s reálnými příklady.',
    extendedDescription: 'C# je moderní programovací jazyk používaný pro vývoj her v Unity, desktopových aplikací i webových služeb. Děti se naučí základní koncepty programování, které jsou přenositelné do jakéhokoliv jiného jazyka.',
    learnings: [
      'Pochopení základních konceptů programování',
      'Práce s proměnnými a datovými typy',
      'Vytváření podmínek a cyklů',
      'Psaní a volání funkcí',
      'Debugging a hledání chyb v kódu',
    ],
    ultimateGoal: 'Dítě si odnese vlastní funkční program a základy programátorského myšlení, které může dále rozvíjet.',
  },
]

const colorClasses = {
  mix: {
    bg: 'bg-gradient-to-br from-primary-600 via-accent-600 to-trust-600',
    icon: 'text-white',
    badge: 'bg-white/20 text-white',
    gradient: 'from-primary-600 via-accent-600 to-trust-600',
  },
  primary: {
    bg: 'bg-primary-100',
    icon: 'text-primary-600',
    badge: 'bg-primary-100 text-primary-700',
    gradient: 'from-primary-600 to-primary-400',
  },
  accent: {
    bg: 'bg-accent-100',
    icon: 'text-accent-600',
    badge: 'bg-accent-100 text-accent-700',
    gradient: 'from-accent-600 to-accent-400',
  },
  trust: {
    bg: 'bg-trust-100',
    icon: 'text-trust-600',
    badge: 'bg-trust-100 text-trust-700',
    gradient: 'from-trust-600 to-trust-400',
  },
  cta: {
    bg: 'bg-cta-100',
    icon: 'text-cta-600',
    badge: 'bg-cta-100 text-cta-700',
    gradient: 'from-cta-600 to-cta-400',
  },
}

export default function ProgramPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl" />
          </div>

          <div className="section-container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Link href="/" className="text-gray-500 hover:text-primary-600 transition-colors">
                  Domů
                </Link>
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-900 font-medium">Programy</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="heading-1 text-gray-900 mb-6"
              >
                Naše <span className="text-gradient">programy</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                7 víkendových táborů zaměřených na různé oblasti IT.
                Od praktického 3D tisku přes programování až po vývoj her.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Programs Detail Section */}
        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="space-y-24">
              {programs.map((program, index) => {
                const colors = colorClasses[program.color as keyof typeof colorClasses]
                const isEven = index % 2 === 0
                const isMix = program.id === 'mix'

                return (
                  <motion.div
                    key={program.id}
                    id={program.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative scroll-mt-24"
                  >
                    {/* MIX gets special treatment */}
                    {isMix ? (
                      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 via-accent-600 to-trust-600 p-1">
                        <div className="relative rounded-[22px] overflow-hidden bg-gradient-to-br from-primary-600 via-accent-600 to-trust-600">
                          <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Content */}
                            <div className="p-8 lg:p-12">
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white w-fit mb-4">
                                <Sparkles className="w-4 h-4" />
                                {program.subtitle}
                              </div>

                              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
                                {program.title}
                              </h2>

                              <p className="text-lg text-white/90 mb-4">
                                {program.description}
                              </p>

                              <p className="text-white/80 mb-6">
                                {program.extendedDescription}
                              </p>

                              <div className="mb-8">
                                <h3 className="text-xl font-semibold text-white mb-4">
                                  Co si děti odnesou
                                </h3>
                                <ul className="space-y-3">
                                  {program.learnings.map((learning, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 text-white" />
                                      </div>
                                      <span className="text-white/90">{learning}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-4 bg-white/10 rounded-xl mb-6">
                                <p className="text-sm font-semibold text-white/90 mb-1">Ultimátní cíl:</p>
                                <p className="text-white/80 text-sm">{program.ultimateGoal}</p>
                              </div>

                              <Link
                                href="/#prihlasit"
                                className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center"
                              >
                                Mám zájem o MIX
                                <ArrowRight className="ml-2 w-5 h-5" />
                              </Link>
                            </div>

                            {/* Image */}
                            <div className="relative h-64 lg:h-auto min-h-[400px]">
                              <Image
                                src={program.image}
                                alt={program.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/50 via-transparent to-transparent lg:bg-gradient-to-l" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Regular program cards */
                      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${isEven ? '' : 'lg:grid-flow-dense'}`}>
                        {/* Content */}
                        <div className={isEven ? '' : 'lg:col-start-2'}>
                          <div className="flex items-center gap-4 mb-6">
                            <div className={`inline-flex items-center justify-center w-12 h-12 ${colors.bg} rounded-xl`}>
                              <program.icon className={`w-6 h-6 ${colors.icon}`} />
                            </div>
                            <div className={`inline-flex items-center px-3 py-1 ${colors.badge} rounded-full text-sm font-medium`}>
                              {program.subtitle}
                            </div>
                          </div>

                          <h2 className="heading-2 text-gray-900 mb-4">
                            {program.title}
                          </h2>

                          <p className="text-lg text-gray-600 mb-4">
                            {program.description}
                          </p>

                          <p className="text-gray-600 mb-8">
                            {program.extendedDescription}
                          </p>

                          {/* Co se naučíš */}
                          <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                              Co si děti odnesou
                            </h3>
                            <ul className="space-y-3">
                              {program.learnings.map((learning, i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <Check className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                                  <span className="text-gray-700">{learning}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Ultimátní cíl */}
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm font-semibold text-gray-900 mb-1">Ultimátní cíl:</p>
                            <p className="text-gray-600 text-sm">{program.ultimateGoal}</p>
                          </div>
                        </div>

                        {/* Image Card */}
                        <div className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}>
                          <div className="sticky top-24 rounded-2xl overflow-hidden shadow-xl">
                            <div className="relative h-80 lg:h-96">
                              <Image
                                src={program.image}
                                alt={program.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
                            </div>
                            <div className={`p-6 bg-gradient-to-br ${colors.gradient} text-white`}>
                              <p className="font-semibold mb-2">Víkendový formát</p>
                              <p className="text-sm text-white/80">
                                Sobota + neděle, 9:00 - 17:00. Vše potřebné zajistíme, stačí přijít s chutí tvořit.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-br from-primary-600 to-accent-600">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-2 text-white mb-6">
                Nevíte si rady?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Pokud si nejste jistí, který program je pro vaše dítě nejlepší,
                doporučujeme začít s <strong>MIX</strong> - ochutná všechno a pak se může rozhodnout.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#prihlasit" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                  Přejít na registraci
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/kontakt" className="btn-outline border-white text-white hover:bg-white/10">
                  Máte dotazy? Kontaktujte nás
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
