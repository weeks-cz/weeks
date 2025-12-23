'use client'

import { motion } from 'framer-motion'
import { Target, Heart, Lightbulb, Users, ShieldCheck, Award, Building2, MapPin, Gamepad2, Code, Box, Palette, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
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
    description: 'Učíme děti pracovat v týmu, sdílet nápady a pomáhat si navzájem - stejně jako v reálném IT světě.',
  },
]

const partners = [
  {
    name: 'DDM Praha 6',
    shortName: 'DDM',
    color: 'primary',
    description: 'Dům dětí a mládeže Praha 6 poskytuje osvětovou činnost již od roku 1953. Za více než 70 let působení se stal jednou z největších a nejrespektovanějších institucí pro volnočasové aktivity dětí a mládeže v České republice.',
    details: [
      'Více než 70 let zkušeností s prací s dětmi',
      'Certifikovaní a proškolení instruktoři',
      'Tisíce spokojených dětí a rodičů každý rok',
      'Akreditované vzdělávací programy',
      'Pojištění účastníků a bezpečnostní protokoly',
    ],
    location: 'Praha 6',
    established: '1953',
  },
  {
    name: 'HWLab Praha',
    shortName: 'HW',
    color: 'accent',
    description: 'HWLab je moderní technologické centrum v Kongresovém centru Praha zaměřené na digitální výrobu, prototypování a vzdělávání. Disponuje profesionálním vybavením a prostory navrženými pro komfortní a bezpečnou práci.',
    details: [
      'Profesionální 3D tiskárny Prusa i3 MK3S+',
      'VR headsety Meta Quest a HTC Vive',
      'Vybavená elektronická dílna s Arduino a ESP32',
      'Klimatizované prostory s kuchyňkou a odpočinkovými zónami',
      'Výborná dostupnost MHD (metro C - Vyšehrad)',
    ],
    location: '5. května 11, Praha 4 - Nusle',
    established: '2018',
  },
]

const teamMembers = [
  {
    name: 'Kryštof Ježdík',
    role: 'VR & Herní vývoj',
    icon: Gamepad2,
    description: 'Propojuje virtuální realitu s tvorbou her a programováním. Nadšenec do 3D tisku.',
  },
  {
    name: 'Lukáš Kubík',
    role: 'Web & Programování',
    icon: Code,
    description: 'Specialista na webové technologie a programování. Učí děti vytvářet vlastní projekty.',
  },
  {
    name: 'Štěpán Jurenka',
    role: '3D modelování & Tisk',
    icon: Box,
    description: 'Expert na 3D technologie s pedagogickými zkušenostmi z DDM. Kombinuje kreativitu s technikou.',
  },
  {
    name: 'Lukáš Kautský',
    role: 'Grafika & Design',
    icon: Palette,
    description: 'Pomáhá dětem objevit svět vizuální tvorby a digitálního designu.',
  },
]

const colorClasses = {
  primary: {
    bg: 'bg-primary-100',
    text: 'text-primary-600',
  },
  accent: {
    bg: 'bg-accent-100',
    text: 'text-accent-600',
  },
}

export default function AboutPage() {
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
                Víkendové IT kempy, kde děti získávají praktické dovednosti
                s nejmodernějšími technologiemi pod vedením zkušených lektorů.
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
                  Weeks není jen o výuce programování nebo 3D tisku. Jde o rozvoj kritického myšlení,
                  kreativity a schopnosti řešit problémy. Učíme děti, že chyba není neúspěch,
                  ale příležitost k učení. Že nejlepší projekty vznikají iterací a experimentováním.
                </p>
              </motion.div>

              {/* Values Grid */}
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

        {/* Partners Section */}
        <section className="section-padding bg-gray-50">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="heading-2 text-gray-900 mb-4">
                Naši <span className="text-gradient">partneři</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Weeks funguje díky spolupráci s institucemi, které mají dlouholetou tradici
                a prokázané zkušenosti v oblasti vzdělávání a práce s dětmi.
              </p>
            </motion.div>

            <div className="space-y-12 max-w-5xl mx-auto">
              {partners.map((partner, index) => {
                const colors = colorClasses[partner.color as keyof typeof colorClasses]
                return (
                  <motion.div
                    key={partner.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white rounded-2xl p-8 md:p-12 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Logo/Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-24 h-24 ${colors.bg} rounded-2xl flex items-center justify-center`}>
                          <span className={`text-3xl font-bold ${colors.text}`}>
                            {partner.shortName}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {partner.name}
                          </h3>
                          <div className="flex gap-4 text-sm text-gray-500 mt-2 md:mt-0">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{partner.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              <span>Od {partner.established}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-6">
                          {partner.description}
                        </p>

                        <ul className="space-y-2">
                          {partner.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Award className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                              <span className="text-gray-700">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
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
                Náš <span className="text-gradient">tým</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Pracujeme s lektory, kteří mají zkušenosti z praxe a zároveň lásku k výuce.
                Každý lektor prošel školením DDM Praha 6 a má ověřené reference.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  {/* Icon */}
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

        {/* Safety & Certification Section */}
        <section className="section-padding bg-trust-50">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="heading-2 text-trust-800 mb-8 text-center">
                Bezpečnost a certifikace
              </h2>

              <div className="bg-white rounded-2xl p-8 md:p-12">
                <p className="text-lg text-gray-700 mb-8 text-center">
                  Bezpečnost dětí je naší absolutní prioritou. Dodržujeme přísné protokoly
                  a standardy stanovené DDM Praha 6.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4">
                    <ShieldCheck className="w-8 h-8 text-trust-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Pojištění účastníků
                      </h3>
                      <p className="text-sm text-gray-600">
                        Každé dítě je pojištěno po celou dobu konání kempu
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
                        Maximálně 5 dětí na jednoho lektora pro individuální přístup
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4">
                    <Award className="w-8 h-8 text-trust-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Certifikovaní lektoři
                      </h3>
                      <p className="text-sm text-gray-600">
                        Všichni instruktoři prošli školením a mají ověřené reference
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
                Rádi vám zodpovíme jakékoliv otázky ohledně našich kempů,
                bezpečnosti nebo programu.
              </p>
              <Link href="/kontakt" className="btn-primary">
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
