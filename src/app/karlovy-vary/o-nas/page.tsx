'use client'

import { motion } from 'framer-motion'
import { Target, Heart, Lightbulb, Users, ShieldCheck, Award, MapPin, Gamepad2, Code, Box, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const values = [
  {
    icon: Target,
    title: 'Praktické dovednosti',
    description: 'Věříme, že děti se učí nejlépe praxí. Každý projekt je navržen tak, aby si děti odnášely reálné výsledky a funkční znalosti.',
  },
  {
    icon: Heart,
    title: 'Individuální přístup',
    description: 'Malé skupiny (max 5 dětí na lektora) nám umožňují přizpůsobit tempo a obsah potřebám každého dítěte.',
  },
  {
    icon: Lightbulb,
    title: 'Kreativita a inovace',
    description: 'Podporujeme experimentování a vlastní nápady. Nejlepší projekty vznikají, když děti mají svobodu tvořit.',
  },
  {
    icon: Users,
    title: 'Týmová spolupráce',
    description: 'Učíme děti pracovat v týmu, sdílet nápady a pomáhat si navzájem – stejně jako v reálném IT světě.',
  },
]

const teamMembers = [
  {
    name: 'Lukáš Kubík',
    role: 'Web & Programování',
    icon: Code,
    description: 'Specialista na webové technologie a programování. Učí děti vytvářet vlastní projekty od nuly.',
  },
  {
    name: 'Kryštof Ježdík',
    role: 'VR & Herní vývoj',
    icon: Gamepad2,
    description: 'Propojuje virtuální realitu s tvorbou her. Nadšenec do 3D tisku a nových technologií.',
  },
  {
    name: 'Štěpán Jurenka',
    role: '3D modelování & Tisk',
    icon: Box,
    description: 'Expert na 3D technologie s pedagogickými zkušenostmi. Kombinuje kreativitu s technikou.',
  },
]

export default function KVAboutPage() {
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Link href="/karlovy-vary" className="text-gray-500 hover:text-primary-600 transition-colors">
                  Domů
                </Link>
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-900 font-medium">O nás</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="heading-1 text-gray-900 mb-6"
              >
                O projektu <span className="text-gradient">Weeks</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Letní příměstské IT tábory v Karlových Varech, kde děti získávají
                praktické dovednosti s nejmodernějšími technologiemi.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="heading-2 text-gray-900 mb-6">
                  Naše <span className="text-gradient">mise</span>
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Věříme, že každé dítě má potenciál tvořit a inovovat. V době, kdy technologie
                  pronikají do všech aspektů života, je důležité, aby děti nebyly jen pasivními
                  uživateli, ale aktivními tvůrci.
                </p>
                <p className="text-lg text-gray-600">
                  Weeks v Karlových Varech není jen o výuce programování nebo 3D tisku. Jde o rozvoj
                  kritického myšlení, kreativity a schopnosti řešit problémy. Učíme děti, že chyba
                  není neúspěch, ale příležitost k učení.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-gray-50 rounded-2xl"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Venue & Organizer Section */}
        <section className="section-padding bg-gray-50">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="heading-2 text-gray-900 mb-4">
                Zázemí a <span className="text-gradient">organizátor</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Weeks v Karlových Varech je projekt organizovaný Lukášem Kubíkem,
                který probíhá v Kreativním centru VARY&amp;TE.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Venue card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-100 rounded-full text-xs font-semibold text-accent-700 mb-4">
                  Místo konání
                </div>
                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-accent-600">V&amp;T</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Kreativní centrum VARY&amp;TE
                </h3>
                <p className="text-gray-600 mb-6">
                  Moderní kreativní centrum v Karlových Varech vybavené profesionálními nástroji
                  pro 3D tisk, digitální výrobu a technologické vzdělávání. Příjemné prostředí
                  s klimatizovanými učebnami a kuchyňkou pro přípravu svačin.
                </p>
                <div className="flex items-center gap-2 text-sm text-accent-600 font-medium">
                  <MapPin className="w-4 h-4" />
                  Stará Role 175, Karlovy Vary
                </div>
              </motion.div>

              {/* Organizer card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 rounded-full text-xs font-semibold text-primary-700 mb-4">
                  Organizátor
                </div>
                <div className="h-16 mb-6 flex items-center">
                  <Image
                    src="/images/weeks-logo.png"
                    alt="Weeks"
                    width={64}
                    height={64}
                    className="object-contain h-full w-auto"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Weeks
                </h3>
                <p className="text-gray-600 mb-6">
                  Weeks je projekt zaměřený na IT vzdělávání dětí a mládeže ve věku 9–15 let.
                  Kombinuje praktické workshopy, profesionální vybavení a zkušené lektory z praxe.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary-600 font-medium">
                  <Award className="w-4 h-4" />
                  Lektoři s praxí z oboru
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding bg-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="heading-2 text-gray-900 mb-4">
                Lektorský <span className="text-gradient">tým</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Naši lektoři jsou odborníci z praxe s vášní pro výuku a individuální přístup k dětem.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <member.icon className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600">
                    {member.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="section-padding bg-trust-50">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="heading-2 text-trust-800 mb-8 text-center">
                Bezpečnost a péče
              </h2>

              <div className="bg-white rounded-2xl p-8 md:p-12">
                <p className="text-lg text-gray-700 mb-8 text-center">
                  Bezpečnost dětí je naší absolutní prioritou. Dodržujeme přísné
                  protokoly a dbáme na pohodu každého dítěte.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4">
                    <ShieldCheck className="w-8 h-8 text-trust-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Pojištění účastníků
                      </h3>
                      <p className="text-sm text-gray-600">
                        Každé dítě je pojištěno po celou dobu tábora
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4">
                    <Users className="w-8 h-8 text-trust-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Malé skupiny
                      </h3>
                      <p className="text-sm text-gray-600">
                        Maximálně 5 dětí na lektora pro individuální přístup
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4">
                    <Award className="w-8 h-8 text-trust-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Kurz první pomoci
                      </h3>
                      <p className="text-sm text-gray-600">
                        Všichni lektoři mají absolvovaný kurz první pomoci
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4">
                    <Heart className="w-8 h-8 text-trust-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Okamžitý kontakt
                      </h3>
                      <p className="text-sm text-gray-600">
                        Rodiče mají vždy k dispozici kontakt na lektory
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-2 text-gray-900 mb-6">
                Máte dotazy?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Rádi vám zodpovíme jakékoliv otázky ohledně tábora, bezpečnosti nebo programu.
              </p>
              <Link href="/karlovy-vary#kontakt" className="btn-primary">
                Kontaktujte nás
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
