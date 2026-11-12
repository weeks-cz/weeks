'use client'

import Link from 'next/link'
import { Ikona } from '@/components/w2/Ikona'
import { sazba } from '@/components/w2/text'
import { trackTerminCta } from '@/lib/analytics'
import { formatDatumCs, pragueIsoDate } from '@/lib/dates'
import { zalohaDostupna, zruseniZdarmaDo } from '@/lib/zaloha'
import type { Turnus } from '@/lib/turnusy'
import { useTermCapacity, volnaMistaText } from './SpotsLeft'
import { TurnusInterestForm } from './TurnusInterestForm'

export type VariantaTerminu = {
  id: string
  slug: string
  /** Krátký rozsah „26.–30. 7. 2027", nebo název města u turnusu jinde. */
  label: string
  aktualni: boolean
}

/**
 * Nákupní box stránky termínu.
 *
 * Pořadí shora dolů je pořadí otázek rodiče: je ještě místo, kolik to stojí,
 * nechci radši jiný týden, kde se přihlásit — a pod tlačítkem tři jistoty
 * (co je v ceně, do kdy jde zrušit zdarma, co když se tábor nenaplní). Cena
 * i tlačítko musí být na mobilu (390 px) vidět bez posouvání.
 *
 * Klientská komponenta kvůli živé obsazenosti (`/api/term-capacity`): stránka
 * je statická, místa ubývají s každou registrací. Dokud data nedorazí, box
 * ukáže tlačítko a obecný stav — neznámá obsazenost nesmí registraci schovat.
 *
 * Jantarová je tu jen na tlačítku a na tečce stavu (role „akce a stav“).
 */
export function NakupniBox({
  turnus,
  cena,
  stav,
  ctaText,
  ctaHref,
  varianty,
  jinde,
}: {
  turnus: Turnus
  /** „5 990 Kč", nebo prázdný řetězec u turnusu bez ceny. */
  cena: string
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

  // Záloha a datum bezplatného zrušení jen tam, kde záloha ještě platí.
  const zaloha = zalohaDostupna(turnus, pragueIsoDate()) ? turnus.zaloha : undefined

  // Stav: nejdřív skutečný počet míst (když jich zbývá málo), jinak obecný
  // stav turnusu. U chystaného turnusu stav řekne věta pod „Cenu upřesníme“.
  const mista = spotsLeft !== undefined ? volnaMistaText(spotsLeft) : null
  const stavText = mista ?? (turnus.status === 'chystame' ? null : stav)

  return (
    <div className="box">
      {cena ? (
        <>
          {stavText && <p className="stav box-stav">{sazba(stavText)}</p>}
          <p className="cena">
            {cena} <small>za týden</small>
          </p>
          {zaloha && (
            <p className="cena-zaloha">
              {sazba(
                `nebo záloha ${zaloha.castkaKc.toLocaleString('cs-CZ')} Kč, doplatek do ${formatDatumCs(zaloha.doplatekDo)}`
              )}
            </p>
          )}
        </>
      ) : (
        <>
          <p className="cena">Cenu upřesníme</p>
          {turnus.status === 'chystame' && (
            <p className="cena-zaloha">
              Termín, místo i cenu teprve domlouváme. Dáme vám vědět jako prvním.
            </p>
          )}
        </>
      )}

      {/* Přepínač termínů téhož tábora ve stejném městě, hned nad tlačítkem. */}
      {varianty.length > 1 && (
        <div className="prep prep-nahore">
          <p>Termín</p>
          <div className="prep-moznosti">
            {varianty.map((v) => {
              const volno = capacity?.[v.id]?.spotsLeft
              const pozn = volno !== undefined ? volnaMistaText(volno) : null
              return (
                <Link
                  key={v.id}
                  href={`/tabory/termin/${v.slug}`}
                  aria-current={v.aktualni ? 'true' : undefined}
                >
                  {sazba(v.label)}
                  {pozn && <span>{sazba(pozn)}</span>}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Hlavní tlačítko. `id` sleduje lepicí lišta: dokud je tlačítko vidět,
          lišta se neukazuje. */}
      {ctaHref && !vyprodano ? (
        <Link
          id="hlavni-cta"
          className="btn btn-primary btn-lg btn-block"
          href={ctaHref}
          onClick={() => trackTerminCta({ source: 'uvod', termId: turnus.id })}
        >
          {ctaText} <Ikona id="sipka" />
        </Link>
      ) : (
        <a id="hlavni-cta" className="btn btn-primary btn-lg btn-block" href="#zajem">
          {vyprodano ? 'Chci vědět o volném místě' : 'Dát vědět, až otevřeme'} <Ikona id="sipka" />
        </a>
      )}

      {cena && ctaHref && (
        <ul className="pod-cta">
          {/* Krátké znění `V_CENE` ze site.ts; celý výčet je o klik dál. */}
          <li>
            <Ikona id="ok" />
            <span>
              V ceně oběd, pitný režim a materiál. <a href="#v-cene">Co všechno je v ceně</a>
            </span>
          </li>
          {zaloha && turnus.start && (
            <li>
              <Ikona id="ok" />
              <span>{sazba(`Zrušení zdarma do ${formatDatumCs(zruseniZdarmaDo(turnus.start))}`)}</span>
            </li>
          )}
          {/* Minimum počtu dětí jako záruka, ne jako riziko. Čísla a pravidlo
              (VOP čl. 22) jsou v sekci #zaruka. */}
          {turnus.minimum && (
            <li>
              <Ikona id="ok" />
              <span>
                Když se tábor nenaplní, nabídneme přesun, nebo vrátíme celou částku.{' '}
                <a href="#zaruka">Jak to funguje</a>
              </span>
            </li>
          )}
        </ul>
      )}

      {jinde.length > 0 && (
        <p className="cena-zaloha">
          {turnus.status === 'chystame' ? 'Mezitím přihlašujeme: ' : 'Také: '}
          {jinde.map((v, i) => (
            <span key={v.id}>
              {i > 0 && ', '}
              <Link className="link" href={`/tabory/termin/${v.slug}`}>
                {sazba(v.label)}
              </Link>
            </span>
          ))}
        </p>
      )}

      {vyprodano && <TurnusInterestForm turnus={turnus} source={`turnus-${turnus.slug}`} vyprodano />}
    </div>
  )
}
