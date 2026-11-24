import { datumCesky, turnusLabels } from '@/components/turnusy/turnus-labels'
import { rozsahTesne } from '@/components/w2/text'
import { getCity, getVenue } from './cities'
import {
  DENNI_HARMONOGRAM,
  getAktivniTabory,
  getChystaneTabory,
  zkusiSiTabora,
  type Tabor,
} from './tabory'
import { getTurnusy, getTurnusyByTabor, isBookable, type Turnus } from './turnusy'
import { MIMO_CENU, PROVOZNI_DOBA, SITE, SOCIALNI_SITE, V_CENE, getSiteFaq, vCeneTabora } from './site'
import { TYM } from './tym'

/**
 * `/llms.txt` a `/llms-full.txt` — web pro jazykové modely (návrh standardu
 * llmstxt.org).
 *
 * `llms.txt` drží tvar ze specifikace: nadpis H1 s názvem, citace se shrnutím,
 * pár odstavců bez nadpisu a pak sekce H2 se seznamy odkazů
 * „- [název](adresa): poznámka“. Sekce „Optional“ (název ze specifikace,
 * nepřekládá se) je to, co může nástroj s krátkým kontextem vynechat.
 * `llms-full.txt` je totéž v plném znění, aby model nemusel stahovat stránky.
 *
 * Oba texty se skládají z dat (`tabory.ts`, `turnusy.ts`, `site.ts`), ne
 * ručně: termín, cena nebo lektor se tu změní ve stejném deployi jako na webu.
 * Volná místa se mění průběžně, proto tu nejsou — jen kapacita a odkaz na
 * stránku termínu, kde je stav živý.
 *
 * Interní věci sem nepatří stejně jako na web: žádné ceny prostorů, marže
 * ani interní poznámky (repozitář i výstup jsou veřejné).
 */

const URL = SITE.url

/** Odkazy v textu vždy absolutní — model soubor často čte bez kontextu domény. */
const abs = (cesta: string) => `${URL}${cesta}`

/**
 * Data mají místy dlouhou pomlčku („Svačiny — dopolední…“); v textu pro
 * čtenáře platí krátká. Nezlomitelné mezery z cen (`toLocaleString`) zůstávají.
 */
const text = (s: string) => s.replace(/\s—\s/g, ' – ').replace(/—/g, '–')

function cena(kc: number): string {
  return `${kc.toLocaleString('cs-CZ')} Kč`
}

function datumTurnusu(t: Turnus): string {
  return rozsahTesne(turnusLabels(t).datum)
}

/** Turnusy, které jsou v nabídce: v prodeji nebo obsazené (chystané a proběhlé ne). */
function turnusyVNabidce(): Turnus[] {
  return getTurnusy().filter((t) => isBookable(t) || t.status === 'plno')
}

function nazevTaboru(t: Turnus): string {
  return getAktivniTabory()
    .filter((tabor) => t.taborIds.includes(tabor.id))
    .map((tabor) => tabor.name)
    .join(' + ')
}

function stavTurnusu(t: Turnus): string {
  return t.status === 'plno' ? 'obsazeno' : 'přijímáme přihlášky'
}

function radekTurnusu(t: Turnus): string {
  const misto = t.venueId ? getVenue(t.venueId) : null
  const casti = [
    misto ? `${misto.name}, ${misto.street}, ${misto.city}` : getCity(t.city).name,
    t.priceKc !== null ? `${cena(t.priceKc)} za týden` : null,
    t.zaloha ? `záloha ${cena(t.zaloha.castkaKc)}, doplatek do ${datumCesky(t.zaloha.doplatekDo)}` : null,
    `kapacita ${t.capacity} dětí`,
    `věk ${t.ageRange.replace('-', '–')} let`,
    stavTurnusu(t),
  ].filter(Boolean)
  return `- [${nazevTaboru(t)} – ${getCity(t.city).name}, ${datumTurnusu(t)}](${abs(`/tabory/termin/${t.slug}`)}): ${casti.join('; ')}`
}

function lektoriTaboru(tabor: Tabor): string[] {
  return (tabor.lektori ?? [])
    .map((id) => TYM.find((c) => c.id === id))
    .filter((c): c is (typeof TYM)[number] => c !== undefined)
    .map((c) => c.jmeno)
}

function shrnuti(): string {
  const mesta = Array.from(new Set(getTurnusy().map((t) => getCity(t.city).lokal)))
  const vMestech = mesta.length > 1 ? `${mesta.slice(0, -1).join(', ')} a ${mesta[mesta.length - 1]}` : mesta[0]
  return `Týdenní příměstské IT tábory pro děti od 9 do 15 let v ${vMestech}. Pondělí až pátek ${PROVOZNI_DOBA.rozsah}, malé skupiny, oběd v ceně. Pořádá ${SITE.legalName} (IČO ${SITE.ico}).`
}

function zakladniFakta(): string[] {
  const ceny = Array.from(
    new Set(turnusyVNabidce().map((t) => t.priceKc).filter((c): c is number => c !== null))
  ).sort((a, b) => a - b)
  const cenaText =
    ceny.length === 0 ? null : ceny.length === 1 ? cena(ceny[0]) : `od ${cena(ceny[0])}`
  return [
    `Každý tábor je jeden týden na jedno téma. Děti přicházejí ${PROVOZNI_DOBA.prichod} a vyzvedávají se ${PROVOZNI_DOBA.odchod}; přespává se doma. Začátečníci jsou vítaní, programovat ani nic jiného předem umět nemusí.`,
    [
      cenaText ? `Cena ${cenaText} za týden.` : null,
      `V ceně: ${V_CENE.join(', ').toLowerCase()}. Mimo cenu: ${MIMO_CENU.map((m) => text(m)).join('; ').toLowerCase()}.`,
      'Přihláška a platba probíhají online na stránce termínu (platební brána Comgate), u turnusů se zálohou lze zaplatit nejdřív zálohu.',
    ]
      .filter(Boolean)
      .join(' '),
    `Kontakt: ${SITE.email}, ${SITE.phone}. Pořadatel: ${SITE.legalName}, IČO ${SITE.ico}, ${SITE.address}.`,
  ]
}

export function llmsTxt(): string {
  const tabory = getAktivniTabory()
  const chystane = getChystaneTabory()
  const terminy = turnusyVNabidce()

  const r: string[] = []
  r.push(`# ${SITE.name}`, '', `> ${shrnuti()}`, '')
  r.push(...zakladniFakta().flatMap((p) => [p, '']))

  r.push('## Tábory', '')
  for (const tabor of tabory) {
    const lektori = lektoriTaboru(tabor)
    r.push(
      `- [${tabor.name}](${abs(`/tabory/${tabor.id}`)}): ${text(tabor.perex)}${lektori.length ? ` Lektor: ${lektori.join(', ')}.` : ''}`
    )
  }
  for (const tabor of chystane) {
    r.push(`- [${tabor.name}](${abs(`/tabory/${tabor.id}`)}): Chystáme, termín zatím není. ${text(tabor.perex)}`)
  }
  r.push('')

  if (terminy.length > 0) {
    r.push('## Termíny', '')
    r.push(`- [Všechny tábory a termíny](${abs('/tabory')}): výpis podle měst s filtrem; volná místa ukazuje stránka termínu`)
    r.push(...terminy.map(radekTurnusu), '')
  }

  r.push('## O Weeks a kontakt', '')
  r.push(`- [O nás](${abs('/o-nas')}): kdo Weeks vede, lektoři a místa, kde tábory běží`)
  r.push(`- [Kontakt](${abs('/kontakt')}): ${SITE.email}, ${SITE.phone}, kontaktní formulář`)
  r.push(`- [Oslavy](${abs('/oslavy')}): technické oslavy narozenin a akce pro děti na poptávku`)
  r.push(`- [Pro firmy](${abs('/firmy')}): dny pro děti zaměstnanců, workshopy a spolupráce`)
  r.push('')

  r.push('## Podmínky', '')
  r.push(`- [Obchodní podmínky](${abs('/podminky')}): přihláška, platba, záloha, storno a minimální počet dětí`)
  r.push(`- [Ochrana osobních údajů](${abs('/gdpr')}): jak Weeks zpracovává údaje dětí a rodičů`)
  r.push('')

  r.push('## Optional', '')
  r.push(`- [Plné znění pro jazykové modely](${abs('/llms-full.txt')}): programy táborů po dnech, rozvrh dne, místa a časté dotazy v jednom souboru`)
  r.push(`- [Online učebna](https://ucebna.weeks.cz): výuková platforma Weeks pro děti, elektronika a programování v prohlížeči`)
  for (const s of SOCIALNI_SITE) {
    r.push(`- [Weeks ${s.naSiti}](${s.url})`)
  }

  return text(r.join('\n')) + '\n'
}

export function llmsFullTxt(): string {
  const r: string[] = []
  r.push(`# ${SITE.name}`, '', `> ${shrnuti()}`, '')
  r.push(...zakladniFakta().flatMap((p) => [p, '']))
  r.push(`Stručná verze s odkazy: ${abs('/llms.txt')}`, '')

  r.push('## Jak vypadá den', '')
  for (const b of DENNI_HARMONOGRAM) {
    r.push(`- ${b.time} ${b.title}: ${text(b.description)}`)
  }
  r.push('')

  for (const tabor of getAktivniTabory()) {
    r.push(`## ${tabor.name}`, '')
    r.push(`Stránka tábora: ${abs(`/tabory/${tabor.id}`)}`, '')
    r.push(text(tabor.popis), '')

    const lektori = (tabor.lektori ?? [])
      .map((id) => TYM.find((c) => c.id === id))
      .filter((c): c is (typeof TYM)[number] => c !== undefined)
    for (const l of lektori) r.push(`Lektor: ${l.jmeno}. ${text(l.popis)}`, '')

    r.push('### Co si dítě vyzkouší', '')
    r.push(...zkusiSiTabora(tabor).map((b) => `- ${text(b)}`), '')

    if (tabor.program && tabor.program.length > 0) {
      r.push('### Program týdne', '')
      r.push('Program je orientační, lektor ho přizpůsobí skupině.', '')
      for (const den of tabor.program) {
        r.push(`- ${den.den} – ${den.title}: ${text(den.description)}`)
      }
      r.push('')
    }

    r.push('### V ceně', '')
    r.push(...vCeneTabora(tabor).map((v) => `- ${v}`), '')

    const terminy = getTurnusyByTabor(tabor.id).filter((t) => isBookable(t) || t.status === 'plno')
    if (terminy.length > 0) {
      r.push('### Termíny', '')
      r.push(...terminy.map(radekTurnusu), '')
    }

    if (tabor.faq && tabor.faq.length > 0) {
      r.push('### Dotazy k tomuto táboru', '')
      for (const d of tabor.faq) r.push(`- ${d.question} ${text(d.answer)}`)
      r.push('')
    }
  }

  const chystane = getChystaneTabory()
  if (chystane.length > 0) {
    r.push('## Chystáme', '')
    for (const tabor of chystane) {
      r.push(`- [${tabor.name}](${abs(`/tabory/${tabor.id}`)}): termín zatím není. ${text(tabor.perex)}`)
    }
    r.push('')
  }

  r.push('## Časté dotazy', '')
  for (const d of getSiteFaq()) r.push(`- ${d.question} ${text(d.answer)}`)
  r.push('')

  r.push('## Kontakt a pořadatel', '')
  r.push(`- E-mail: ${SITE.email}`)
  r.push(`- Telefon: ${SITE.phone}`)
  r.push(`- Pořadatel: ${SITE.legalName}, IČO ${SITE.ico}, ${SITE.address}, ${SITE.court}`)
  r.push(`- Obchodní podmínky: ${abs('/podminky')}`)
  r.push(`- Ochrana osobních údajů: ${abs('/gdpr')}`)

  return text(r.join('\n')) + '\n'
}
