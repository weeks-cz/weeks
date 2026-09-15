'use client'

import { motion } from 'framer-motion'
import { Target, Heart, Lightbulb, Users, ShieldCheck, Award, Building2, MapPin, Gamepad2, Code, Box, type LucideIcon } from 'lucide-react'
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
    role: 'Organizátor & místo konání',
    description: 'Dům dětí a mládeže Praha 6 je organizátorem víkendových kempů Weeks a zároveň jedním ze dvou míst konání. Poskytuje osvětovou činnost již od roku 1953 a za více než 70 let působení se stal jednou z největších a nejrespektovanějších institucí pro volnočasové aktivity dětí a mládeže v České republice.',
    details: [
      'Více než 70 let zkušeností s prací s dětmi',
      'Certifikovaní a proškolení instruktoři',
      'Tisíce spokojených dětí a rodičů každý rok',
      'Akreditované vzdělávací programy',
      'Pojištění účastníků a bezpečnostní protokoly',
    ],
    location: 'U Boroviček 5, Praha 6',
    established: '1953',
  },
  {
    name: 'HWLab Praha',
    shortName: 'HW',
    color: 'accent',
    role: 'Místo konání',
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
                <span className="text-ink font-medium">O nás</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mono-label mb-4"
              >
                O projektu
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="heading-1 text-ink mb-6"
              >
                Weeks
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-ink-500 max-w-2xl mx-auto"
              >
                Víkendové IT kempy, kde děti získávají praktické dovednosti
                s nejmodernějšími technologiemi pod vedením zkušených lektorů.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding bg-paper">
          <div className="section-container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <p className="mono-label mb-4">Naše mise</p>
                <h2 className="heading-2 text-ink mb-6">
                  Každé dítě má potenciál tvořit
                </h2>
                <p className="text-lg text-ink-500 mb-4">
                  V době, kdy technologie pronikají do všech aspektů života, je důležité, aby děti nebyly jen pasivními
                  uživateli, ale aktivními tvůrci.
                </p>
                <p className="text-lg text-ink-500">
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
                    className="p-6 bg-paper-soft rounded-md border border-ink/15"
                  >
                    <div className="w-12 h-12 bg-white border border-ink/15 rounded-sm flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">
                      {value.title}
                    </h3>
                    <p className="text-ink-500">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="section-padding bg-paper-soft border-y border-ink/15">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="mono-label mb-4">Partneři</p>
              <h2 className="heading-2 text-ink mb-4">
                Organizátor a zázemí
              </h2>
              <p className="text-xl text-ink-500 max-w-2xl mx-auto">
                Weeks je projekt organizovaný DDM Praha 6, který probíhá
                ve dvou lokalitách – HWLab Praha a DDM Praha 6 – Bílá hora.
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
                    className="card-maker p-8 md:p-12"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Logo/Icon */}
                      <div className="flex-shrink-0">
                        {'role' in partner && (
                          <span className="border border-ink rounded-sm font-mono text-xs font-medium px-2.5 py-1 text-ink block mb-3 w-fit">
                            {partner.role}
                          </span>
                        )}
                        <div className={`w-24 h-24 border border-ink rounded-sm flex items-center justify-center bg-white`}>
                          <span className={`text-3xl font-bold ${colors.text}`}>
                            {partner.shortName}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="font-display text-2xl font-bold text-ink">
                            {partner.name}
                          </h3>
                          <div className="flex gap-4 text-sm text-ink-500 mt-2 md:mt-0">
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

                        <p className="text-ink-500 mb-6">
                          {partner.description}
                        </p>

                        <ul className="space-y-2">
                          {partner.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Award className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                              <span className="text-ink">{detail}</span>
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
        <section className="section-padding bg-paper">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="mono-label mb-4">Tým</p>
              <h2 className="heading-2 text-ink mb-4">
                Lektorský tým
              </h2>
              <p className="text-xl text-ink-500 max-w-2xl mx-auto">
                Naši lektoři jsou odborníci z praxe s vášní pro výuku. Každý z nich prošel
                školením DDM Praha 6, má ověřené reference a individuální přístup k dětem.
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
                  className="card-maker p-6 text-center flex flex-col"
                >
                  {/* Icon */}
                  <div className="w-24 h-24 bg-primary-600 border border-ink rounded-sm mx-auto mb-4 flex items-center justify-center">
                    <member.icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-ink mb-1">
                    {member.name}
                  </h3>
                  <p className="mono-label mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-ink-500">
                    {member.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety & Certification Section */}
        <section className="section-padding bg-paper-soft border-y border-ink/15">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <p className="mono-label text-center mb-4">Bezpečnost</p>
              <h2 className="heading-2 text-ink mb-8 text-center">
                Bezpečnost a certifikace
              </h2>

              <div className="card-maker p-8 md:p-12">
                <p className="text-lg text-ink-500 mb-8 text-center">
                  Bezpečnost dětí je naší absolutní prioritou. Dodržujeme přísné protokoly
                  a standardy stanovené DDM Praha 6.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4">
                    <ShieldCheck className="w-8 h-8 text-trust-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-ink mb-1">
                        Pojištění účastníků
                      </h3>
                      <p className="text-sm text-ink-500">
                        Každé dítě je pojištěno po celou dobu konání kempu
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4">
                    <Users className="w-8 h-8 text-trust-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-ink mb-1">
                        Malé skupiny
                      </h3>
                      <p className="text-sm text-ink-500">
                        Maximálně 5 dětí na jednoho lektora pro individuální přístup
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4">
                    <Award className="w-8 h-8 text-trust-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-ink mb-1">
                        Certifikovaní lektoři
                      </h3>
                      <p className="text-sm text-ink-500">
                        Všichni instruktoři prošli školením a mají ověřené reference
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4">
                    <Heart className="w-8 h-8 text-trust-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-ink mb-1">
                        Okamžitý kontakt
                      </h3>
                      <p className="text-sm text-ink-500">
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
        <section className="section-padding bg-paper">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="heading-2 text-ink mb-6">
                Máte dotazy?
              </h2>
              <p className="text-xl text-ink-500 mb-8">
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
