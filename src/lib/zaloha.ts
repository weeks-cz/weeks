import type { Turnus, Zaloha } from './turnusy'

/**
 * Záloha + doplatek — čistá logika bez I/O (testovatelná bez databáze a Comgate).
 *
 * Rodič může zaplatit celou cenu, nebo jen zálohu a zbytek do `doplatekDo`.
 * Částka, která se skutečně účtuje, se odvozuje TADY z turnusu a dnešního data —
 * nikdy ne z čísla poslaného klientem. Routy jen volají tyhle funkce.
 */

export type PaymentPlan = 'plna' | 'zaloha'
/** Druh jedné platby v `registration_payments`. */
export type PaymentKind = 'plna' | 'zaloha' | 'doplatek'

export const PAYMENT_PLANS: readonly PaymentPlan[] = ['plna', 'zaloha']

export function isPaymentPlan(value: unknown): value is PaymentPlan {
  return typeof value === 'string' && (PAYMENT_PLANS as readonly string[]).includes(value)
}

/** Počet dní mezi dvěma ISO daty (`to - from`). Počítá v UTC, takže DST nevadí. */
function dnyMezi(from: string, to: string): number {
  const [y1, m1, d1] = from.split('-').map(Number)
  const [y2, m2, d2] = to.split('-').map(Number)
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000)
}

/** ISO datum posunuté o `dny` (záporné = dřív). */
export function addDays(iso: string, dny: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + dny)).toISOString().slice(0, 10)
}

/**
 * Záloha je dostupná, dokud neuplyne `doplatekDo` (včetně toho dne).
 * Turnus bez zálohy ji nemá nikdy.
 */
export function zalohaDostupna(turnus: Pick<Turnus, 'zaloha'>, dnes: string): boolean {
  return turnus.zaloha !== undefined && dnes <= turnus.zaloha.doplatekDo
}

/**
 * Plán, který se skutečně použije. Záloha platí jen tam, kde je dostupná —
 * po termínu nebo u turnusu bez zálohy se přepne na plnou platbu.
 */
export function platnyPlan(pozadovany: PaymentPlan, zalohaJeDostupna: boolean): PaymentPlan {
  return pozadovany === 'zaloha' && zalohaJeDostupna ? 'zaloha' : 'plna'
}

/** Částka první platby (plná cena, nebo záloha) pro zvolený platný plán. */
export function castkaPrvniPlatby(
  plan: PaymentPlan,
  priceKc: number,
  turnus: Pick<Turnus, 'zaloha'>,
  dnes: string
): number {
  return platnyPlan(plan, zalohaDostupna(turnus, dnes)) === 'zaloha'
    ? (turnus.zaloha as Zaloha).castkaKc
    : priceKc
}

/**
 * Doplatek = cena minus to, co už rodič zaplatil. Nikdy záporný — přeplatek
 * se nevrací přes doplatek, to řeší storno.
 */
export function castkaDoplatku(priceKc: number, zaplaceno: number): number {
  return Math.max(0, priceKc - zaplaceno)
}

/** Všechny částky, které rodič vidí před první platbou (`/platba`, souhrn přihlášky). */
export function castkyPlatby(
  priceKc: number,
  turnus: Pick<Turnus, 'zaloha'>,
  dnes: string
): { plna: number; zaloha: number | null; doplatek: number | null } {
  if (!zalohaDostupna(turnus, dnes)) {
    return { plna: priceKc, zaloha: null, doplatek: null }
  }
  const zaloha = (turnus.zaloha as Zaloha).castkaKc
  return { plna: priceKc, zaloha, doplatek: castkaDoplatku(priceKc, zaloha) }
}

/**
 * Stav registrace odvozený ze součtu zaplacených plateb.
 *
 * `payment_amount` zůstává plná cena, takže „zaplaceno vše“ je jen součet
 * `paid` řádků ≥ ceny. Nic zaplaceno → registrace zůstává nezaplacená
 * (`pending`); cokoli menšího než cena → `partial`, místo je jisté, ale
 * nedoplacené.
 */
export function stavZPlateb(
  priceKc: number,
  zaplaceno: number
): { payment_status: 'pending' | 'partial' | 'completed'; status: 'pending' | 'confirmed' | 'paid' } {
  if (zaplaceno >= priceKc) return { payment_status: 'completed', status: 'paid' }
  if (zaplaceno > 0) return { payment_status: 'partial', status: 'confirmed' }
  return { payment_status: 'pending', status: 'pending' }
}

/**
 * Smí se odeslat prohlížečová / Meta konverze „nákup“ (Purchase)?
 *
 * Konverze je jen ta platba, která přinesla místo: plná platba, nebo záloha.
 * Doplatek konverzi znovu nezapočítá — jinak by se jedna přihláška počítala
 * dvakrát a hodnota by neodpovídala tomu, co se skutečně utratilo za místo.
 */
export function maOdeslatPurchase(plan: PaymentPlan, paymentStatus: string): boolean {
  return (plan === 'plna' && paymentStatus === 'completed') || (plan === 'zaloha' && paymentStatus === 'partial')
}

/** Den, do kdy lze zdarma zrušit: 30 dní před začátkem (VOP čl. 22, 0 % storno). */
export function zruseniZdarmaDo(start: string): string {
  return addDays(start, -30)
}

// ── Cron doplatků ──────────────────────────────────────────────────────────

export type DoplatekKrok = 'pripominka-14' | 'pripominka-3' | 'upozorneni-tymu'

export interface OdeslanoDoplatku {
  r14: boolean
  r3: boolean
  upozorneni: boolean
}

/**
 * Která připomínka doplatku se má dnes poslat, nebo `null`.
 *
 * Okna: 4–14 dní před `doplatekDo` → první připomínka; 0–3 dny → druhá;
 * po termínu → upozornění týmu. Vždy jen jeden krok, takže kdo zaplatí
 * zálohu až 2 dny před termínem, dostane jen poslední připomínku.
 * `dnes` i `doplatekDo` jsou pražské ISO datumy.
 */
export function doplatekKrok(
  dnes: string,
  doplatekDo: string,
  odeslano: OdeslanoDoplatku
): DoplatekKrok | null {
  const zbyva = dnyMezi(dnes, doplatekDo)
  if (zbyva < 0) return odeslano.upozorneni ? null : 'upozorneni-tymu'
  if (zbyva <= 3) return odeslano.r3 ? null : 'pripominka-3'
  if (zbyva <= 14) return odeslano.r14 ? null : 'pripominka-14'
  return null
}
