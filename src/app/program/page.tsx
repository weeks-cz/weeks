'use client'

import { motion } from 'framer-motion'
import { Printer, Glasses, Cpu, Code2, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

const programs = [
  {
    icon: Printer,
    title: '3D tisk & modelování',
    color: 'primary',
    description: 'Objevte fascinující svět digitální výroby. Děti se naučí navrhovat vlastní 3D modely v profesionálním CAD software, připravit je k tisku (slicing) a vytisknout na průmyslových 3D tiskárnách. Zkusí si i post-processing - broušení, lakování a sestavování složitějších projektů.',
    extendedDescription: 'Od první skici až po hotový výrobek v ruce. Pracujeme s profesionálními nástroji jako Fusion 360 nebo Tinkercad a tiskneme na spolehlivých tiskárnách Prusa. Děti se naučí nejen technickou stránku, ale i základy designu a funkčního myšlení.',
    learnings: [
      '3D modelování v CAD software (Fusion 360, Tinkercad)',
      'Příprava modelu k tisku - slicing, podpěry, nastavení parametrů',
      'Obsluha průmyslových 3D tiskáren Prusa',
      'Post-processing - broušení, lepení, malování modelů',
      'Řešení problémů při tisku a optimalizace designu',
    ],
    projects: [
      'Vlastní jmenovka nebo klíčenka s gravírováním',
      'Funkční mechanický gadget (fidget spinner, puzzle box)',
      'Držák na mobil nebo stojánek na sluchátka',
      'Vícebarevný nebo vícekomponentní projekt',
    ],
  },
  {
    icon: Glasses,
    title: 'Virtuální realita',
    color: 'accent',
    description: 'Vstupte do světa virtuální reality! Děti vyzkouší nejmodernější VR headsety a naučí se tvořit vlastní 3D prostředí a interaktivní zážitky. Od základů práce v 3D prostoru až po vytvoření vlastního VR světa, který si budou moci "projít".',
    extendedDescription: 'VR není jen zábava - je to budoucnost vzdělávání, designu i zábavy. Děti se seznámí s nástroji pro tvorbu VR obsahu, naučí se pracovat s 3D objekty v prostoru a vytvářet interaktivní scény. Vyzkoušíme si headsety Meta Quest a další profesionální vybavení.',
    learnings: [
      'Práce s VR headsety - ovládání, bezpečnost, best practices',
      'Základy 3D modelování pro VR prostředí',
      'Vytváření interaktivních scén a objektů',
      'Optimalizace VR obsahu pro plynulý zážitek',
      'Testování a iterace vlastních VR projektů',
    ],
    projects: [
      'Vlastní VR místnost s interaktivními objekty',
      'Jednoduchá VR hra nebo puzzle',
      'Virtuální galerie s vlastními 3D modely',
      'VR prezentace nebo "tour" vlastním světem',
    ],
  },
  {
    icon: Cpu,
    title: 'IoT & elektronika',
    color: 'trust',
    description: 'Vytvořte chytré zařízení od A do Z! Děti se naučí programovat mikrokontroléry Arduino a ESP32, připojovat senzory, ovládat LED pásky a propojit vše s internetem. Každý si odnese funkční IoT projekt, který může doma dál rozvíjet.',
    extendedDescription: 'Internet věcí je všude kolem nás - od chytrých žárovek po průmyslové senzory. Ukážeme dětem, jak to celé funguje zevnitř. Naučí se základy elektroniky, programování mikročipů a vytvoření vlastního zařízení připojeného k internetu.',
    learnings: [
      'Programování Arduino a ESP32 v C++ nebo MicroPython',
      'Práce se senzory - teplota, vzdálenost, světlo, pohyb',
      'Ovládání LED pásků a dalších výstupních zařízení',
      'Připojení k Wi-Fi a odesílání dat do cloudu',
      'Základy bezpečnosti IoT a ochrana dat',
    ],
    projects: [
      'Chytrá lampička ovládaná přes mobil',
      'Meteostanice s online sledováním dat',
      'Senzor parkování s LED indikací vzdálenosti',
      'Alarm s pohybovým čidlem a notifikacemi',
    ],
  },
  {
    icon: Code2,
    title: 'Programování & vývoj',
    color: 'cta',
    description: 'Naučte se programovat! Od základů až po funkční aplikace. Děti si vyberou cestu podle svých zájmů - tvorba her v Pythonu, webové aplikace v JavaScriptu, nebo mobilní appky. Vše s důrazem na praktické projekty a skutečně fungující kód.',
    extendedDescription: 'Programování je kreativní disciplína - je to jako psaní, jen místo slov používáme kód. Učíme děti myslet algoritmicky, rozdělit problém na menší části a vytvořit řešení. Používáme moderní nástroje a postupy z reálného vývoje software.',
    learnings: [
      'Základy programování - proměnné, cykly, podmínky, funkce',
      'Python nebo JavaScript podle úrovně a zájmu',
      'Práce s Git a verzováním kódu',
      'Debugging - hledání a oprava chyb v kódu',
      'Struktura projektu a čistý, čitelný kód',
    ],
    projects: [
      'Hra v Pygame (had, pong, space shooter)',
      'Webová aplikace s interaktivním rozhraním',
      'Discord bot s vlastními příkazy',
      'Automatizační skripty pro usnadnění práce',
    ],
  },
]

const colorClasses = {
  primary: {
    bg: 'bg-primary-100',
    icon: 'text-primary-600',
    hover: 'hover:border-primary-300',
    gradient: 'from-primary-600 to-primary-400',
  },
  accent: {
    bg: 'bg-accent-100',
    icon: 'text-accent-600',
    hover: 'hover:border-accent-300',
    gradient: 'from-accent-600 to-accent-400',
  },
  trust: {
    bg: 'bg-trust-100',
    icon: 'text-trust-600',
    hover: 'hover:border-trust-300',
    gradient: 'from-trust-600 to-trust-400',
  },
  cta: {
    bg: 'bg-cta-100',
    icon: 'text-cta-600',
    hover: 'hover:border-cta-300',
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
                <span className="text-gray-900 font-medium">Program</span>
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
                Každý program je navržený tak, aby děti získaly praktické dovednosti
                s nejmodernějšími technologiemi. Od prvního kroku až po hotový projekt.
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

                return (
                  <motion.div
                    key={program.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${isEven ? '' : 'lg:grid-flow-dense'}`}>
                      {/* Content */}
                      <div className={isEven ? '' : 'lg:col-start-2'}>
                        <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} rounded-2xl mb-6`}>
                          <program.icon className={`w-8 h-8 ${colors.icon}`} />
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
                            Co se naučíš
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
                      </div>

                      {/* Projects Card */}
                      <div className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}>
                        <div className={`sticky top-24 p-8 rounded-2xl bg-gradient-to-br ${colors.gradient} text-white`}>
                          <h3 className="text-2xl font-bold mb-6">
                            Příklady projektů
                          </h3>
                          <ul className="space-y-4">
                            {program.projects.map((project, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-sm font-semibold">{i + 1}</span>
                                </div>
                                <span className="text-white/90">{project}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-8 pt-6 border-t border-white/20">
                            <p className="text-sm text-white/80">
                              A mnoho dalších projektů podle zájmu a úrovně dětí!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
                Připraveni začít?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Každý víkend nabízíme různé programy. Zaregistrujte své dítě
                a vyberte si termín, který vám vyhovuje.
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
