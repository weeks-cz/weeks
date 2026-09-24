'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Home, MapPin, School } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { OslavaPoptavka } from '@/components/oslavy/OslavaPoptavka'
import { MISTA, POTREBUJEME, PRIKLADY, PRUBEHY, ZAJISTIME } from '@/lib/oslavy'
import { SITE } from '@/lib/site'
import { MrizkaSekce } from '@/components/ui/MrizkaSekce'

/**
 * `/oslavy` — narozeniny a akce pro děti.
 *
 * Rodiče se na oslavu ptali sami, aniž by ji web nabízel; nejbližší stránka
 * `/firmy` mluví na HR oddělení a o zaměstnaneckých benefitech. Spec:
 * `docs/superpowers/specs/2026-09-22-oslavy-design.md`.
 *
 * Stránka schválně **neprodává balíčky**. Ukazuje příklady, jak to může
 * vypadat, a zbytek nechává na poptávce — pevné varianty by musely říct, čím
 * se liší (délkou, počtem dětí, cenou), a to jsou údaje, které nikdo
 * nepotvrdil. Veškerý text bydlí v `src/lib/oslavy.ts`, kde ho hlídají testy.
 */

const IKONY_MIST: Record<string, LucideIcon> = {
  'u-vas': Home,
  'pronajaty-prostor': MapPin,
  'skola': School,
}

export default function OslavyPage() {
  const reduced = useReducedMotion()

  // Nosný text animuje jen posun, ne viditelnost: kdyby se animace nespustila
  // (zamrzlá záložka, chyba JS, pomalá hydratace), zůstal by nadpis prázdný.
  const anim = (delay = 0) =>
    reduced ? {} : { initial: { y: 16 }, animate: { y: 0 }, transition: { duration: 0.4, delay } }

  const animPriScrollu = (i: number) =>
    reduced
      ? {}
      : {
          initial: { y: 18 },
          whileInView: { y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.45, delay: i * 0.06 },
        }

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-ink/15 bg-paper blueprint-grid pb-16 pt-32">
          <div className="section-container relative z-10">
            <nav
              aria-label="Drobečková navigace"
              className="mb-8 font-mono text-xs uppercase tracking-[0.2em]"
            >
              <Link href="/" className="text-ink/50 transition-colors hover:text-primary-600">
                Domů
              </Link>
              <span className="mx-2 text-ink/30">/</span>
              <span className="font-medium text-ink">Oslavy</span>
            </nav>

            <motion.p {...anim()} className="mono-label mb-4">
              Oslavy
            </motion.p>
            <motion.h1 {...anim(0.05)} className="heading-1 mb-6 max-w-3xl text-ink">
              Oslava, ze které si děti{' '}
              <span className="text-accent-600">něco odnesou</span>
            </motion.h1>
            <motion.p
              {...anim(0.1)}
              className="mb-10 max-w-2xl text-lg leading-relaxed text-ink-500 md:text-xl"
            >
              Přivezeme 3D tiskárnu a elektroniku tam, kde oslava probíhá, a děti
              si u toho něco postaví. Kolik dětí přijde, jak dlouho program trvá
              a co se na něm bude dít — to domluvíme podle vás.
            </motion.p>

            <motion.div {...anim(0.15)}>
              <a href="#poptavka" className="btn-primary group">
                Napsat o oslavě
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Příklady — cyan v roli „technologie" */}
        <section className="section-padding border-y border-ink/15 bg-paper-soft">
          <div className="section-container">
            <div className="mb-12 max-w-3xl">
              <p className="mono-label mb-4">Jak to může vypadat</p>
              <h2 className="heading-2 mb-4 text-ink">
                Tři nápady, <span className="text-accent-600">ne balíčky</span>
              </h2>
              <p className="text-lg text-ink-500">
                Nemáme pevné varianty s pevným obsahem. Tohle jsou příklady, ze
                kterých se dá vyjít — a od kterých se dá odejít.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {PRIKLADY.map((p, i) => (
                <motion.article
                  key={p.id}
                  {...animPriScrollu(i)}
                  className="card-maker flex flex-col overflow-hidden"
                >
                  <div className="h-1.5 bg-accent-400" aria-hidden="true" />
                  <div className="flex flex-1 flex-col p-7">
                    <p className="mono-label mb-3">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="mb-3 font-display text-xl font-semibold text-ink">
                      {p.nadpis}
                    </h3>
                    <p className="text-ink-500">{p.text}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Modelové průběhy — celé odpoledne od začátku do konce. Modely,
            ne balíčky: bez ceny a počtu dětí, s větou, že se dají poskládat
            jinak (viz `PRUBEHY` v `src/lib/oslavy.ts`). */}
        <section className="section-padding border-b border-ink/15 bg-paper">
          <div className="section-container">
            <div className="mb-12 max-w-3xl">
              <p className="mono-label mb-4">Modelový průběh</p>
              <h2 className="heading-2 mb-4 text-ink">
                Jak může oslava <span className="text-accent-600">probíhat</span>
              </h2>
              <p className="text-lg text-ink-500">
                Dva modely, jak může odpoledne vypadat od začátku do konce. Délku,
                pořadí i náplň domluvíme individuálně — klidně úplně jinak.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {PRUBEHY.map((p, i) => (
                <motion.article key={p.id} {...animPriScrollu(i)} className="card-maker p-7">
                  <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold text-ink">{p.nadpis}</h3>
                    <p className="mono-label">{p.delka}</p>
                  </div>
                  <ol className="space-y-4">
                    {p.kroky.map((k) => (
                      <li key={k.cas} className="flex gap-4">
                        <span className="w-12 shrink-0 pt-0.5 font-mono text-sm font-semibold text-accent-700">
                          {k.cas}
                        </span>
                        <div>
                          <p className="font-semibold text-ink">{k.nadpis}</p>
                          <p className="text-ink-500">{k.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Co zajistíme / co potřebujeme */}
        <section className="section-padding bg-paper-soft">
          <div className="section-container">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <p className="mono-label mb-4">Zajistíme my</p>
                <h2 className="heading-2 mb-6 text-ink">Co přivezeme</h2>
                <ul className="space-y-3">
                  {ZAJISTIME.map((polozka) => (
                    <li key={polozka} className="flex gap-3 text-ink-500">
                      <Check
                        className="mt-1 h-5 w-5 shrink-0 text-trust-600"
                        aria-hidden="true"
                      />
                      {polozka}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mono-label mb-4">Zajistíte vy</p>
                <h2 className="heading-2 mb-6 text-ink">Co potřebujeme</h2>
                <ul className="space-y-3">
                  {POTREBUJEME.map((polozka) => (
                    <li key={polozka} className="flex gap-3 text-ink-500">
                      <Check
                        className="mt-1 h-5 w-5 shrink-0 text-trust-600"
                        aria-hidden="true"
                      />
                      {polozka}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-ink/60">
                  Nic dalšího — techniku, prodlužovačky i materiál vozíme s sebou.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Kde to proběhne — tmavá kotva stránky */}
        <MrizkaSekce odstin="tmavy" className="section-padding relative overflow-hidden border-y border-ink bg-ink blueprint-grid-dark">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 select-none font-display text-[22rem] font-bold leading-none text-paper/[0.04]"
          >
            W
          </div>
          <div className="section-container relative z-10">
            <div className="mb-10 max-w-3xl">
              <p className="mono-label-dark mb-4 text-accent-300">Kde to proběhne</p>
              <h2 className="heading-2 mb-4 text-paper">
                Přijedeme <span className="text-accent-400">za vámi</span>
              </h2>
              <p className="text-lg text-paper/70">
                Vlastní dílnu nemáme a nepotřebujeme ji — techniku i materiál
                vozíme s sebou.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {MISTA.map((m, i) => {
                const Ikona = IKONY_MIST[m.id] ?? MapPin
                return (
                  <motion.div
                    key={m.id}
                    {...animPriScrollu(i)}
                    className="rounded-md border border-paper/15 bg-paper/[0.03] p-6"
                  >
                    <Ikona className="mb-4 h-7 w-7 text-accent-400" aria-hidden="true" />
                    <h3 className="mb-2 font-display text-lg font-semibold text-paper">
                      {m.nadpis}
                    </h3>
                    <p className="text-paper/70">{m.text}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </MrizkaSekce>

        {/* Poptávka */}
        <section
          id="poptavka"
          className="section-padding scroll-mt-24 border-t border-ink/15 bg-paper-soft"
        >
          <div className="section-container">
            <OslavaPoptavka />
            {/* Identifikace provozovatele — drobně, ať nepřebíjí formulář nad ní
                (stejný vzor jako na `/kontakt` a `/firmy`). */}
            <p className="mt-8 text-center font-mono text-xs text-ink-500">
              {SITE.legalName}, IČO {SITE.ico}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
