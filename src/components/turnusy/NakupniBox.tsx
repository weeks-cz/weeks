'use client'

import Link from 'next/link'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { trackTerminCta } from '@/lib/analytics'
import { V_CENE } from '@/lib/site'
import type { Turnus } from '@/lib/turnusy'
import { SpotsLeftBadge, useTermCapacity, volnaMistaText } from './SpotsLeft'
import { TurnusInterestForm } from './TurnusInterestForm'

export type VariantaTerminu = {
  id: string
  slug: string
  /** Krátký rozsah „26.–30. 7.", nebo název města u turnusu jinde. */
  label: string
  aktualni: boolean
}

/**
 * Nákupní box stránky termínu — obdoba boxu „do košíku" na detailu produktu.
 *
 * Pořadí shora dolů je pořadí otázek rodiče: kolik to stojí, je ještě místo,
 * nechci radši jiný týden, kde se přihlásit, co když se tábor nenaplní. Vše
 * z toho musí být na mobilu (390 px) vidět bez posouvání — viz audit DP-001
 * v `docs/superpowers/specs/2026-10-19-tabory-detail-redesign.md`.
 *
 * Klientská komponenta kvůli živé obsazenosti (`/api/term-capacity`), stejně
 * jako dřív `TerminPrihlaska`: stránka je statická, místa ubývají s každou
 * registrací. Dokud data nedorazí, box ukáže tlačítko bez odznaku — neznámá
 * obsazenost nesmí registraci schovat.
 *
 * Oranžová je tu jen na tlačítku a na odznaku „Zbývá X míst" (role „akce
 * a stav"); stav „přijímáme přihlášky" je neutrální.
 */
export function NakupniBox({
  turnus,
  cena,
  cenaZaDen,
  stav,
  ctaText,
  ctaHref,
  varianty,
  jinde,
}: {
  turnus: Turnus
  /** „5 990 Kč", nebo prázdný řetězec u turnusu bez ceny. */
  cena: string
  cenaZaDen: string | null
  /** Text stavu z `turnusLabels` („Přijímáme přihlášky", „Chystáme"…). */
  stav: string
  ctaText: string
  /** `null` = turnus se koupit nedá, tlačítko vede na formulář zájmu. */
  ctaHref: string | null
  /** Termíny téhož tábora ve stejném městě, včetně tohohle. */
  varianty: VariantaTerminu[]
  /** Termíny téhož tábora v jiných městech. */
  jinde: VariantaTerminu[]
}) {
  const capacity = useTermCapacity(turnus.city)
  const spotsLeft = capacity?.[turnus.id]?.spotsLeft
  const vyprodano = spotsLeft === 0

  const stavMist =
    spotsLeft !== undefined && volnaMistaText(spotsLeft) !== null ? (
      <SpotsLeftBadge spotsLeft={spotsLeft} />
    ) : turnus.status === 'chystame' ? null : (
      <span className="inline-flex items-center gap-1.5 text-sm text-ink-500">
        <Check className="h-4 w-4 text-trust-600" aria-hidden="true" />
        {stav}
      </span>
    )

  return (
    <div className="rounded-md border border-ink bg-paper p-4 text-ink shadow-hard sm:p-6">
      {/* Cena */}
      {cena ? (
        <>
          <p className="font-display text-4xl font-bold leading-none tracking-tight">{cena}</p>
          <p className="mt-1.5 text-sm text-ink-500">
            za týden{cenaZaDen && <> · ≈ {cenaZaDen}/den</>} · oběd v ceně
          </p>
        </>
      ) : (
        <>
          <p className="font-display text-2xl font-bold leading-tight">Cenu upřesníme</p>
          {/* Bez osamocené pilulky „Chystáme" — stav řekne věta. */}
          {turnus.status === 'chystame' && (
            <p className="mt-1.5 text-sm text-ink-500">
              Termín, místo i cenu teprve domlouváme. Dáme vám vědět jako prvním.
            </p>
          )}
        </>
      )}

      {/* Stav míst stojí v řádku nad termíny — na vlastním řádku by na mobilu
          odsunul tlačítko pod okraj obrazovky. */}
      {(varianty.length > 1 || stavMist) && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="text-sm font-medium text-ink">{varianty.length > 1 ? 'Vyberte termín' : ''}</p>
          {stavMist}
        </div>
      )}

      {/* Přepínač termínů — jako výběr velikosti na e-shopu, hned nad tlačítkem. */}
      {varianty.length > 1 && (
        <div className="mt-2">
          <ul className="flex flex-wrap gap-2">
            {varianty.map((v) => {
              const volno = capacity?.[v.id]?.spotsLeft
              const pozn = volno !== undefined ? volnaMistaText(volno) : null
              return (
                <li key={v.id}>
                  {v.aktualni ? (
                    <span
                      aria-current="true"
                      className="flex min-h-11 flex-col justify-center rounded-md border-2 border-ink bg-ink px-4 py-1.5 font-display font-semibold text-paper"
                    >
                      {v.label}
                      {pozn && <span className="text-xs font-normal text-cta-300">{pozn}</span>}
                    </span>
                  ) : (
                    <Link
                      href={`/tabory/termin/${v.slug}`}
                      className="flex min-h-11 flex-col justify-center rounded-md border-2 border-ink/20 px-4 py-1.5 font-display font-semibold text-ink transition-colors hover:border-ink"
                    >
                      {v.label}
                      {pozn && <span className="text-xs font-normal text-ink-500">{pozn}</span>}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Hlavní tlačítko. `id` sleduje lepicí lišta: dokud je tlačítko vidět,
          lišta se neukazuje. */}
      <div id="hlavni-cta" className="mt-4">
        {ctaHref && !vyprodano ? (
          <Link
            href={ctaHref}
            onClick={() => trackTerminCta({ source: 'uvod', termId: turnus.id })}
            className="btn-primary group w-full py-3.5 text-lg"
          >
            {ctaText}
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <a href="#zajem" className="btn-primary group w-full py-3.5 text-lg">
            {vyprodano ? 'Chci vědět o volném místě' : 'Dát vědět, až otevřeme'}
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        )}
      </div>

      {/* Minimum počtu dětí jako záruka, ne jako riziko. Čísla a pravidlo
          (VOP čl. 22) jsou o klik dál v sekci #zaruka. */}
      {turnus.minimum && ctaHref && (
        <p className="mt-4 flex gap-2.5 text-sm text-ink-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-trust-600" aria-hidden="true" />
          <span>
            Když se tábor nenaplní, nabídneme přesun, nebo vrátíme celou částku.{' '}
            <a href="#zaruka" className="whitespace-nowrap font-medium text-primary-600 hover:underline">
              Jak to funguje
            </a>
          </span>
        </p>
      )}

      {cena && (
        <p className="mt-3 border-t border-ink/10 pt-3 text-sm text-ink-500">
          <span className="font-medium text-ink">V ceně:</span>{' '}
          {/* Bez první položky („Program a vedení lektorů") — ta je samozřejmá
              a na mobilu by odsunula řádek pod okraj. Malé jen první písmeno:
              celé `toLowerCase()` by z „3D" udělalo „3d". */}
          {V_CENE.slice(1)
            .map((p) => p.charAt(0).toLowerCase() + p.slice(1))
            .join(' · ')}
          .{' '}
          <a href="#v-cene" className="whitespace-nowrap font-medium text-primary-600 hover:underline">
            Podrobně
          </a>
        </p>
      )}

      {jinde.length > 0 && (
        <p className="mt-3 text-sm text-ink-500">
          {turnus.status === 'chystame' ? 'Mezitím přihlašujeme: ' : 'Také: '}
          {jinde.map((v, i) => (
            <span key={v.id}>
              {i > 0 && ', '}
              <Link
                href={`/tabory/termin/${v.slug}`}
                className="font-medium text-primary-600 hover:underline"
              >
                {v.label}
              </Link>
            </span>
          ))}
        </p>
      )}

      {vyprodano && (
        <div className="mt-6">
          <TurnusInterestForm turnus={turnus} source={`turnus-${turnus.slug}`} vyprodano />
        </div>
      )}
    </div>
  )
}
