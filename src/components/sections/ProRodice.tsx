'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Clock, HeartPulse, UsersRound } from 'lucide-react'
import { PROVOZNI_DOBA } from '@/lib/site'
import { getTurnusy } from '@/lib/turnusy'

/**
 * Pás pro rodiče — emerald v roli „klid rodičů".
 *
 * Vznikl rozdělením `USPSection`, která byla jeden seznam šesti dlaždic bez
 * adresáta: půlka mluvila k rodiči, půlka k dítěti a dohromady to nemluvilo
 * k nikomu. Sem jdou jen věci, které Weeks umí doložit — malé skupiny,
 * proškolení v první pomoci, kapacita z dat a rozsah dne.
 *
 * Pevný poměr „1:5“ tu stával a zmizel: kolik lektorů na turnus bude, záleží
 * na počtu přihlášených, a číslo, které nemusí platit, sem nepatří. Sem se přestěhoval
 * i trojlístek z rušené sekce „Kde a s kým".
 *
 * Žádné pojištění, certifikace ani sliby doby odezvy: pro nic z toho web
 * nemá podklad.
 */
export function ProRodice() {
  const reduced = useReducedMotion()

  // Nejvyšší kapacita napříč turnusy. Číslo se nepíše natvrdo, aby se sekce
  // sama nerozešla s daty.
  const kapacita = getTurnusy().reduce((max, t) => Math.max(max, t.capacity), 0)

  const body = [
    {
      icon: UsersRound,
      title: 'Malé skupinky',
      text: 'Při práci děti dělíme do menších skupin, lektor se dostane ke každému.',
    },
    {
      icon: HeartPulse,
      title: 'Proškolení v první pomoci',
      text: 'Lektoři jsou proškolení v první pomoci a s dětmi pracují dlouhodobě.',
    },
    {
      kota: String(kapacita),
      title: `Nejvýše ${kapacita} dětí v turnusu`,
      text: 'Kapacitu držíme malou schválně, ne proto, že se nesešlo víc dětí.',
    },
    {
      icon: Clock,
      title: 'Postaráno celý den',
      text: `Od ${PROVOZNI_DOBA.od} do ${PROVOZNI_DOBA.do}. Oběd, přestávky a střídání aktivit.`,
    },
  ]

  const anim = (i: number) =>
    reduced
      ? {}
      : {
          initial: { y: 18 },
          whileInView: { y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.45, delay: i * 0.06 },
        }

  return (
    <section id="pro-rodice" className="section-padding border-y border-trust-200 bg-trust-50">
      <div className="section-container">
        <div className="mb-10 max-w-3xl">
          <p className="mono-label mb-4 text-trust-700/70">Pro rodiče</p>
          <h2 className="heading-2 text-ink">
            Co máte <span className="text-trust-600">jisté</span>
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {body.map((u, i) => (
            <motion.div key={u.title} {...anim(i)} className="flex gap-5">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-trust-600 bg-white font-display text-lg font-bold text-trust-600"
                aria-hidden="true"
              >
                {u.icon ? <u.icon className="h-7 w-7" /> : u.kota}
              </div>
              <div>
                <h3 className="mb-1.5 font-display text-lg font-semibold text-ink">{u.title}</h3>
                <p className="text-ink-500">{u.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
