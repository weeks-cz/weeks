'use client'

import { motion } from 'framer-motion'
import { Printer, Cpu, Box, Globe, Gamepad2, Code2, Sparkles, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { trackViewTerms, trackProgramInterest } from '@/lib/analytics'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Všech 7 programů s marketingovými popisy
const programs = [
  {
    id: 'mix',
    icon: Sparkles,
    title: 'Tábor chytrých technologií',
    subtitle: 'Víkendový tábor pro děti 10–15 let',
    color: 'mix',
    image: '/images/program-mix.webp',
    description: 'Za jeden víkend si vaše dítě vyzkouší 3D tisk, IoT programování i virtuální realitu. Odnese si vlastní výtisky, naprogramované projekty a zážitky z VR.',
    extendedDescription: 'Dva dny plné objevování. V sobotu se děti ponoří do světa 3D tisku – navrhnou si vlastní model a pošlou ho na profesionální tiskárnu. V neděli je čeká programování IoT projektů na Micro:bitu/Arduinu a zážitky ve virtuální realitě. Není potřeba žádné předchozí zkušenosti.',
    learnings: [
      'Vlastní 3D výtisk, který si sami navrhnou a vytisknou',
      'Naprogramovaný IoT projekt na Micro:bitu',
      'Zážitek z virtuální reality a pochopení, jak funguje',
      'Přehled o tom, která oblast technologií je baví nejvíc',
    ],
    ultimateGoal: 'Dítě objeví, která technologie ho baví, a odnese si domů vlastní výtvory.',
  },
  {
    id: '3d-tisk',
    icon: Printer,
    title: '3D tisk',
    subtitle: 'Od nápadu k výrobku',
    color: 'primary',
    image: '/images/program-3dtisk.webp',
    description: 'Od nápadu k hotovému výrobku. Děti navrhnou vlastní model a vytisknou si ho na profesionálních tiskárnách. Domů si odnesou něco, co samy vytvořily.',
    extendedDescription: 'Celý den věnovaný 3D tisku od začátku do konce. Děti se naučí, jak z jednoduchého náčrtu vytvořit počítačový model, jak ho připravit k tisku a jak ovládat tiskárnu. Vyzkoušejí si i dokončovací práce – odstraňování podpor a kontrolu kvality. Pracujeme s tiskárnami Prusa Research (MK3S, MK4S, Mini+, CORE One, XL a další).',
    learnings: [
      'Vlastní navržený a vytištěný model (klíčenka, stojánek, hračka...)',
      'Schopnost připravit a spustit tisk samostatně',
      'Základy 3D modelování v jednoduchém programu',
      'Pochopení, jak 3D tisk funguje a k čemu se dá využít',
    ],
    ultimateGoal: 'Dítě dokáže samostatně navrhnout jednoduchý model a vytisknout ho - a ví, že to zvládne i doma.',
  },
  {
    id: 'iot',
    icon: Cpu,
    title: 'IoT & elektronika',
    subtitle: 'Chytrá zařízení',
    color: 'trust',
    image: '/images/program-iot.webp',
    description: 'Postavit si vlastní chytré zařízení? S Micro:bitem a Arduinem děti propojí senzory, světýlka a displeje a naprogramují je, aby dělaly přesně to, co chtějí.',
    extendedDescription: 'Den plný bastlení a objevování. Děti si postaví vlastní elektronické projekty s Micro:bitem a Arduinem – od blikající LED až po chytré zařízení, které reaguje na okolí. Naučí se propojovat součástky, psát jednoduché programy a pochopit, jak fungují chytré věci kolem nás. Žádné předchozí znalosti nejsou potřeba.',
    learnings: [
      'Vlastní fungující elektronický projekt',
      'Pochopení, jak fungují chytrá zařízení kolem nás',
      'Základy propojování elektronických součástek',
      'První zkušenost s programováním hardwaru',
    ],
    ultimateGoal: 'Dítě pochopí, jak elektronika funguje, a získá zkušenosti pro vlastní projekty doma.',
  },
  {
    id: 'blender',
    icon: Box,
    title: '3D modelování',
    subtitle: 'Digitální tvorba',
    color: 'accent',
    image: '/images/program-blender.webp',
    description: 'Tvorba 3D modelů jako v animovaných filmech. Vlastní postavička, scéna nebo předmět, který můžou vytisknout na 3D tiskárně.',
    extendedDescription: 'Vstup do světa digitální tvorby. Děti se naučí vytvářet 3D modely v programu Blender - stejném nástroji, který používají profesionální studia. Vytvoří si vlastní postavičku, předmět nebo celou scénu. Výsledek můžou použít jako obrázek, animaci, nebo ho poslat na 3D tisk.',
    learnings: [
      'Vlastní 3D model vytvořený od nuly',
      'Základy práce v profesionálním 3D programu',
      'Schopnost vytvořit obrázek (render) svého modelu',
      'Pochopení, jak vznikají 3D grafika ve hrách a filmech',
    ],
    ultimateGoal: 'Dítě vytvoří vlastní 3D model a pochopí základy digitální tvorby, kterou může rozvíjet dál.',
  },
  {
    id: 'web',
    icon: Globe,
    title: 'Tvorba webu',
    subtitle: 'Vlastní stránky',
    color: 'cta',
    image: '/images/program-web.webp',
    description: 'Vlastní webová stránka, kterou můžou ukázat kamarádům a rodině. Portfolio, blog nebo fan stránka na téma, které je baví.',
    extendedDescription: 'Za víkend od nuly k vlastní webové stránce. Děti se naučí, jak weby fungují, a vytvoří si vlastní - třeba portfolio svých prací, blog, nebo stránku o svém koníčku. Naučí se základy HTML a CSS a pochopí, jak internet funguje. Žádné předchozí zkušenosti nejsou potřeba.',
    learnings: [
      'Vlastní webová stránka, kterou si mohou spustit na počítači',
      'Pochopení, jak weby fungují',
      'Schopnost upravit vzhled stránky podle svých představ',
      'Základy HTML, CSS a bezpečnosti na internetu',
    ],
    ultimateGoal: 'Dítě pochopí, jak weby fungují, naučí se základy tvorby a získá dovednosti pro další rozvoj.',
  },
  {
    id: 'hry',
    icon: Gamepad2,
    title: 'Vývoj her',
    subtitle: 'Tvorba vlastní hry',
    color: 'primary',
    image: '/images/program-hry.webp',
    description: 'Z hráče tvůrcem. Děti vytvoří vlastní hru, kterou si můžou zahrát i doma a ukázat kamarádům.',
    extendedDescription: 'Každý hraje hry, ale jak vznikají? Za víkend to děti zjistí a vytvoří si vlastní. Pracujeme v Unity - stejném programu, ve kterém vznikají i profesionální hry. Děti navrhnou herní svět, naprogramují pohyb postavy a vytvoří hratelnou hru, kterou si odnesou domů.',
    learnings: [
      'Vlastní hratelná hra, kterou si můžou zahrát i doma',
      'Pochopení, jak hry fungují "pod kapotou"',
      'Základy herního designu a programování',
      'Zkušenost s profesionálním herním enginem',
    ],
    ultimateGoal: 'Dítě se promění z hráče v tvůrce - pochopí, jak hry vznikají, a odnese si vlastní hru.',
  },
  {
    id: 'csharp',
    icon: Code2,
    title: 'Programování',
    subtitle: 'První kroky v kódu',
    color: 'trust',
    image: '/images/program-csharp.webp',
    description: 'První kroky v programování. Od jednoduchých příkazů po vlastní fungující program, který něco užitečného dělá.',
    extendedDescription: 'Programování je jako učit se nový jazyk - jazyk, kterým mluvíte s počítačem. Za víkend děti pochopí základy a napíší vlastní program. Začneme jednoduše a postupně přidáváme. Na konci bude mít každý vlastní fungující program, který si odnese domů.',
    learnings: [
      'Vlastní fungující program',
      'Pochopení základních principů programování',
      'Schopnost číst a upravovat jednoduchý kód',
      'Základ pro další učení jakéhokoliv programovacího jazyka',
    ],
    ultimateGoal: 'Dítě pochopí, že programování není magie, a získá základ, na kterém může stavět dál.',
  },
]

const colorClasses = {
  mix: {
    bg: 'bg-accent-100',
    icon: 'text-accent-600',
    badge: 'bg-accent-100 text-accent-700',
    gradient: 'from-accent-600 to-primary-600',
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
                Víkendové i jednodenní tábory, 7 různých oblastí. Vyberte si podle toho, co vaše dítě baví – nebo zkuste Tábor chytrých technologií a objevte to společně.
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
                    key={program.id}
                    id={program.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative scroll-mt-32"
                  >
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

                        {/* Co si odnesou */}
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

                        {/* Cíl programu */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6">
                          <p className="text-sm font-semibold text-gray-900 mb-1">Cíl programu:</p>
                          <p className="text-gray-600 text-sm">{program.ultimateGoal}</p>
                        </div>

                        {/* CTA Button */}
                        {program.id === 'mix' ? (
                          <Link
                            href="/tabor-chytrych-technologii#terminy"
                            className="btn-primary inline-flex items-center"
                            onClick={() => trackViewTerms('program_mix')}
                          >
                            Zobrazit termíny
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </Link>
                        ) : program.id === '3d-tisk' ? (
                          <Link
                            href="/tabor-3d-tisk#terminy"
                            className="btn-primary inline-flex items-center"
                            onClick={() => trackProgramInterest(program.id, program.title)}
                          >
                            Zobrazit termíny 3D tisk
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </Link>
                        ) : program.id === 'iot' ? (
                          <Link
                            href="/tabor-iot#terminy"
                            className="btn-primary inline-flex items-center"
                            onClick={() => trackProgramInterest(program.id, program.title)}
                          >
                            Zobrazit termíny IoT
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </Link>
                        ) : (
                          <Link
                            href="/#prihlasit"
                            className="btn-primary inline-flex items-center"
                            onClick={() => trackProgramInterest(program.id, program.title)}
                          >
                            Mám zájem o program {program.title}
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </Link>
                        )}
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
                            {program.id === '3d-tisk' || program.id === 'iot' ? (
                              <>
                                <p className="font-semibold mb-2">Jednodenní tábor</p>
                                <p className="text-sm text-white/80">
                                  Sobota nebo neděle, 9:00–17:00. Vše potřebné zajistíme, stačí přijít s chutí tvořit.
                                </p>
                              </>
                            ) : program.id === 'mix' ? (
                              <>
                                <p className="font-semibold mb-2">Víkendový tábor</p>
                                <p className="text-sm text-white/80">
                                  Sobota + neděle, 9:00–17:00. 3D tisk, IoT a VR v jednom víkendu.
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="font-semibold mb-2">Víkendový formát</p>
                                <p className="text-sm text-white/80">
                                  Sobota + neděle, 9:00–17:00. Vše potřebné zajistíme, stačí přijít s chutí tvořit.
                                </p>
                              </>
                            )}
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
                Nevíte si rady?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Pokud si nejste jistí, který program je pro vaše dítě nejlepší,
                doporučujeme začít s <strong>Táborem chytrých technologií</strong> - ochutná 3D tisk, IoT i VR a pak se může rozhodnout.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tabor-chytrych-technologii#terminy" className="btn-primary bg-white text-primary-600 hover:bg-gray-100" onClick={() => trackViewTerms('program_bottom_cta')}>
                  Zobrazit termíny
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
