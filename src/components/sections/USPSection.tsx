'use client'

import { motion } from 'framer-motion'
import { Building2, Package, GraduationCap, Shield, Clock, Train } from 'lucide-react'

/**
 * Texty vychází z toho, co dřív mělo v `locations.ts` jen Karlovy Vary
 * (Praha měla chudší sadu, vázanou na partnera HWLab) — zbavené zmínek
 * o jednom konkrétním městě nebo prostoru, protože úvodka je teď společná
 * pro obě.
 */
const usps = [
  {
    icon: Building2,
    title: 'Profesionální vybavení',
    description: 'Vaše dítě pracuje s profesionálním vybavením — průmyslové 3D tiskárny, VR headsety a pokročilá IoT zařízení. Profesionální zázemí kreativního centra, žádné hračky.',
  },
  {
    icon: Package,
    title: 'Projekty, které si odnesou domů',
    description: 'Učíme tvorbou, ne teorií. Každý tábor znamená dokončený projekt - vytištěný model, funkční elektroniku nebo nahrané aplikace.',
  },
  {
    icon: GraduationCap,
    // Dřív tu stálo, že lektoři jsou „aktivní programátoři, inženýři
    // a designéři" s „praxí z oboru". To je stejná kategorie tvrzení jako
    // „mají ověřené reference", které tahle fáze smazala z /o-nas — dá se na
    // ně zeptat „kde to je" a web na to nemá odpověď. Dlaždice se navíc
    // vykresluje přímo nad `KdeASKym`, která slibuje jen doložitelná fakta.
    // Znění o první pomoci je doslovně převzaté z `getSiteFaq()`
    // (`src/lib/site.ts`), aby se FAQ a úvodka nerozešly.
    title: 'Lektoři, ne hlídání',
    description: 'Lektoři sami pracují s technologiemi, které na táboře učí. Jsou proškolení v první pomoci a s dětmi pracují dlouhodobě.',
  },
  {
    icon: Clock,
    title: 'Kompletní servis od 8 do 17',
    description: 'Celý týden oběd, přestávky a střídání aktivit. Rodiče mají klid, děti mají postaráno o vše.',
  },
  {
    icon: Shield,
    title: 'Organizováno Weeks',
    description: 'Tábory organizuje tým Weeks s důrazem na kvalitu výuky, bezpečnost dětí a profesionální přístup.',
  },
  {
    icon: Train,
    title: 'Moderní kreativní centra',
    description: 'Tábory probíhají v moderních kreativních centrech s dílnami a vybavenými prostory pro tvorbu.',
  },
]

export function USPSection() {
  return (
    <section id="proc-weeks" className="section-padding bg-paper">
      <div className="section-container">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mono-label mb-4"
          >
            Proč Weeks
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-2 text-ink mb-4"
          >
            Proč zvolit <span className="text-primary-600">Weeks</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-ink-500"
          >
            Kombinace profesionálního zázemí, odborných lektorů a zábavy.
          </motion.p>
        </div>

        {/* USP rows — číslovaný seznam s kótami */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 border-b border-ink/15">
          {usps.map((usp, index) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-5 py-8 border-t border-ink/15"
            >
              <span className="font-mono text-sm text-ink/40 pt-1 w-8 shrink-0" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink mb-1 flex items-center gap-2">
                  <usp.icon className="w-5 h-5 text-primary-600 shrink-0" aria-hidden="true" />
                  {usp.title}
                </h3>
                <p className="text-ink-500">
                  {usp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
