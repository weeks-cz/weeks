'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'

interface RozcestiKarta {
  nadpis: string
  veta: string
  href: string
  /** Text tlačítka — musí pojmenovat cíl, jinak čtečka přečte čtyři
   * odkazy se stejným „Zjistit víc" bez rozlišení, kam vedou. */
  cta: string
  external?: boolean
}

/**
 * Směry, kam Weeks dnes vede — tábor, oslavy, firmy a učebna. První tři jsou stránky
 * tohohle webu (`/tabory`, `/oslavy`, `/firmy`), učebna běží na vlastní doméně, proto se
 * otevírá v novém okně (`external`).
 *
 * E-shop je zakomentovaný, ne smazaný — viz stejná poznámka v `Header.tsx`.
 */
const KARTY: RozcestiKarta[] = [
  {
    nadpis: 'Letní tábor',
    veta: 'Týdenní příměstský tábor pro děti 9–15 let.',
    href: '/tabory',
    cta: 'Zobrazit tábor',
  },
  {
    nadpis: 'Oslavy',
    veta: 'Technologie na dětskou oslavu — přijedeme i s tiskárnou.',
    href: '/oslavy',
    cta: 'Oslavy pro děti',
  },
  {
    nadpis: 'Pro firmy',
    veta: 'Dny pro děti zaměstnanců, workshopy pro týmy a partnerství.',
    href: '/firmy',
    cta: 'Nabídka pro firmy',
  },
  // {
  //   nadpis: 'E-shop',
  //   veta: 'Stavebnice a materiál, se kterým děti pracují na táboře.',
  //   href: '/eshop',
  //   cta: 'Otevřít e-shop',
  // },
  {
    nadpis: 'Učebna',
    veta: 'Online kurzy, ve kterých se dá pokračovat i po táboře.',
    href: 'https://iot.weeks.cz/',
    cta: 'Otevřít učebnu',
    external: true,
  },
]

export function Rozcesti() {
  const reduced = useReducedMotion()

  return (
    <section className="section-padding bg-paper">
      <div className="section-container">
        <div className="max-w-3xl mb-12">
          <p className="mono-label mb-4">Co Weeks dělá</p>
          <h2 className="heading-2 text-ink mb-4">
            Vyberte si, <span className="text-primary-600">co hledáte</span>
          </h2>
        </div>

        {/* Počet sloupců se řídí počtem karet, ne pevnou čtyřkou: po schování
            e-shopu jsou tři a ve čtyřsloupcové mřížce by zbyla prázdná díra. */}
        <div
          className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${
            KARTY.length % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
          }`}
        >
          {KARTY.map((karta, index) => (
            <motion.div
              key={karta.nadpis}
              initial={reduced ? false : { y: 16 }}
              whileInView={reduced ? undefined : { y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="card-maker flex flex-col p-6"
            >
              <h3 className="font-display text-lg font-semibold text-ink mb-2">{karta.nadpis}</h3>
              <p className="text-sm text-ink-500 mb-6 flex-1">{karta.veta}</p>
              {karta.external ? (
                <a
                  href={karta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${karta.cta} — výuková platforma (otevře se v nové záložce)`}
                  className="btn-outline text-sm self-start"
                >
                  {karta.cta}
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              ) : (
                <Link href={karta.href} className="btn-outline text-sm self-start">
                  {karta.cta}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
