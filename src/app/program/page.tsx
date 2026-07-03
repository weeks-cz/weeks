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
        <section className="bg-paper blueprint-grid border-b border-ink/15 pt-32 pb-16">
          <div className="section-container">
            <div className="max-w-4xl mx-auto text-center">
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 font-mono text-xs uppercase tracking-[0.2em]"
              >
                <Link href="/" className="text-ink/50 hover:text-primary-600 transition-colors">
                  Domů
                </Link>
                <span className="text-ink/30 mx-2">/</span>
                <span className="text-ink font-medium">Programy</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mono-label mb-4"
              >
                7 programů
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="heading-1 text-ink mb-6"
              >
                Vyberte si podle toho,
                <br />
                <span className="text-primary-600">co vaše dítě baví</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-ink-500 max-w-2xl mx-auto"
              >
                Nebo zkuste Tábor chytrých technologií a objevte to společně.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Programs Detail Section */}
        <section className="section-padding bg-paper">
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
                          <div className={`w-12 h-12 rounded-sm border border-ink flex items-center justify-center`}>
                            <program.icon className={`w-6 h-6 ${colors.icon}`} />
                          </div>
                          <span className="border border-ink rounded-sm font-mono text-xs font-medium px-2.5 py-1 text-ink">
                            {program.subtitle}
                          </span>
                        </div>

                        <h2 className="heading-2 text-ink mb-4">
                          {program.title}
                        </h2>

                        <p className="text-lg text-ink-500 mb-4">
                          {program.description}
                        </p>

                        <p className="text-ink-500 mb-8">
                          {program.extendedDescription}
                        </p>

                        {/* Co si odnesou */}
                        <div className="mb-8">
                          <h3 className="font-display text-lg font-semibold text-ink mb-4">
                            Co si děti odnesou
                          </h3>
                          <ul className="space-y-3">
                            {program.learnings.map((learning, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <Check className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                                <span className="text-ink">{learning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Cíl programu */}
                        <div className="p-4 border border-ink/15 rounded-md bg-white mb-6">
                          <p className="text-sm font-semibold text-ink mb-1">Cíl programu:</p>
                          <p className="text-ink-500 text-sm">{program.ultimateGoal}</p>
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
                        <div className="sticky top-24 rounded-md overflow-hidden border border-ink">
                          <div className="relative h-80 lg:h-96">
                            <Image
                              src={program.image}
                              alt={program.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="object-cover"
                            />
                          </div>
                          <div className="p-6 bg-white border-t border-ink">
                            {program.id === '3d-tisk' || program.id === 'iot' ? (
                              <>
                                <p className="font-display font-semibold text-ink mb-2">Jednodenní tábor</p>
                                <p className="text-sm text-ink-500">
                                  Sobota nebo neděle, 9:00–17:00. Vše potřebné zajistíme, stačí přijít s chutí tvořit.
                                </p>
                              </>
                            ) : program.id === 'mix' ? (
                              <>
                                <p className="font-display font-semibold text-ink mb-2">Víkendový tábor</p>
                                <p className="text-sm text-ink-500">
                                  Sobota + neděle, 9:00–17:00. 3D tisk, IoT a VR v jednom víkendu.
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="font-display font-semibold text-ink mb-2">Víkendový formát</p>
                                <p className="text-sm text-ink-500">
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
        <section className="section-padding bg-ink text-paper blueprint-grid-dark border-y border-ink">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-2 text-paper mb-6">
                Nevíte si rady?
              </h2>
              <p className="text-xl text-paper/90 mb-8">
                Pokud si nejste jistí, který program je pro vaše dítě nejlepší,
                doporučujeme začít s <strong>Táborem chytrých technologií</strong> - ochutná 3D tisk, IoT i VR a pak se může rozhodnout.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tabor-chytrych-technologii#terminy" className="btn-primary" onClick={() => trackViewTerms('program_bottom_cta')}>
                  Zobrazit termíny
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/kontakt" className="border border-paper/30 text-paper hover:border-paper rounded-md px-6 py-3 font-semibold transition-all duration-200 inline-flex items-center justify-center">
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
