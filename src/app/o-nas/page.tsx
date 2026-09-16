'use client'

import { motion } from 'framer-motion'
import { Target, Heart, Lightbulb, Users, ShieldCheck, MapPin, Gamepad2, Code, Box, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getTurnusy } from '@/lib/turnusy'
import { getVenue, type VenueId } from '@/lib/cities'
import { SITE } from '@/lib/site'

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
    description: 'Expert na 3D technologie. Kombinuje kreativitu s technikou.',
  },
]

export default function AboutPage() {
  const turnusy = getTurnusy()

  // Místa konání — jen ta, která nějaký turnus doopravdy má. Dnes vyjde jedna
  // karta (FabLab VARY&TE u karlovarského turnusu), pražský turnus místo
  // ještě nemá. Kód počítá s tím, že se to může časem změnit.
  const venueIds = Array.from(
    new Set(turnusy.map((t) => t.venueId).filter((id): id is VenueId => id !== null))
  )
  const venues = venueIds.map((id) => getVenue(id))

  // Nejvyšší kapacita napříč turnusy — dnes vyjde 15 u obou, číslo se ale
  // nepíše natvrdo, aby se stránka sama nerozešla s daty (viz `KdeASKym.tsx`).
  const kapacita = turnusy.reduce((max, t) => Math.max(max, t.capacity), 0)

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
                IT tábory, kde děti získávají praktické dovednosti
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

        {/* Venue Section — dřív ukazovala cizí instituce (DDM, HWLab), dnes
            reálná místa konání odvozená z turnusů, viz `venues` výše. */}
        {venues.length > 0 && (
          <section className="section-padding bg-paper-soft border-y border-ink/15">
            <div className="section-container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <p className="mono-label mb-4">Zázemí</p>
                <h2 className="heading-2 text-ink mb-4">
                  Kde tábory probíhají
                </h2>
                <p className="text-xl text-ink-500 max-w-2xl mx-auto">
                  Tábory pořádá {SITE.legalName}, IČO {SITE.ico}.
                </p>
              </motion.div>

              <div className="space-y-12 max-w-5xl mx-auto">
                {venues.map((venue, index) => (
                  <motion.div
                    key={venue.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="card-maker p-8 md:p-12"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 border border-ink rounded-sm flex items-center justify-center bg-white">
                          <MapPin className="w-10 h-10 text-primary-600" aria-hidden="true" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                          <h3 className="font-display text-2xl font-bold text-ink">
                            {venue.fullName}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-ink-500">
                            <MapPin className="w-4 h-4" aria-hidden="true" />
                            <span>{venue.street}, {venue.city} {venue.postalCode}</span>
                          </div>
                        </div>

                        <p className="text-ink-500 mb-6">
                          {venue.description}
                        </p>

                        {venue.url && (
                          <a
                            href={venue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-sm text-primary-600 hover:underline"
                          >
                            {venue.name} na webu
                          </a>
                        )}
                      </div>
                    </div>

                    {venue.photos && venue.photos.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8">
                        {venue.photos.map((src, i) => (
                          <div
                            key={src}
                            className="relative aspect-square border border-ink rounded-sm overflow-hidden"
                          >
                            <Image
                              src={src}
                              alt={`${venue.name} — fotografie prostoru ${i + 1}`}
                              fill
                              sizes="(max-width: 640px) 100vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

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
                Naši lektoři jsou odborníci z praxe s vášní pro výuku. Jsou proškolení
                v první pomoci a s dětmi pracují dlouhodobě.
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

        {/* Safety Section — karty „Pojištění účastníků" a „Certifikovaní lektoři"
            odstraněny v opravném kole 1 (nedoložitelná tvrzení, viz report). */}
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
                Bezpečnost
              </h2>

              <div className="card-maker p-8 md:p-12">
                <p className="text-lg text-ink-500 mb-8 text-center">
                  Bezpečnost dětí je naší absolutní prioritou. Lektoři jsou proškolení
                  v první pomoci a s dětmi pracují dlouhodobě.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <ShieldCheck className="w-8 h-8 text-trust-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-ink mb-1">
                        Nejvýše {kapacita} dětí v turnusu
                      </h3>
                      <p className="text-sm text-ink-500">
                        Kapacitu držíme malou schválně.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4">
                    <Heart className="w-8 h-8 text-trust-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-ink mb-1">
                        Kontakt na Weeks
                      </h3>
                      <p className="text-sm text-ink-500">
                        Telefon{' '}
                        <a
                          href={`tel:${SITE.phone.replace(/\s+/g, '')}`}
                          className="text-primary-600 hover:underline"
                        >
                          {SITE.phone}
                        </a>{' '}
                        i e-mail{' '}
                        <a href={`mailto:${SITE.email}`} className="text-primary-600 hover:underline">
                          {SITE.email}
                        </a>{' '}
                        máte vždy k dispozici.
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
                Rádi vám zodpovíme jakékoliv otázky ohledně našich táborů,
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
