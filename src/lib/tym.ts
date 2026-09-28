/**
 * Tým na stránce O nás.
 *
 * Dřív pole `teamMembers` přímo ve stránce, se třemi lidmi a jednou rolí
 * „lektor“. Tým se má rozrůstat o další lektory, kteří Weeks nezakládali —
 * proto data bydlí tady a role se skládá z `zakladatel`, ne z volného textu.
 *
 * Role dřív zněla „Jednatel · lektor“. Zmizela 2026-09-28: stránka tím
 * vypichovala funkci ve firmě a zároveň slibovala, že každý z nich učí na
 * každém turnusu — to platit nebude, až turnusů a lektorů přibude.
 *
 * Jak přidat lektora: nový řádek s `zakladatel: false`. Fotka a kontakt jsou
 * nepovinné; bez fotky se kreslí ikona oboru, bez kontaktu se kontakt
 * nevypisuje (a rodič dostane obecný `SITE.email` ve zbytku stránky).
 *
 * Kontakt se sem píše jen ten, který dotyčný chce mít veřejně — tenhle
 * repozitář je veřejný.
 */

export type IkonaOboru = 'gamepad' | 'code' | 'box' | 'cpu'

export interface ClenTymu {
  id: string
  jmeno: string
  /** Spoluzakladatel Weeks. Lektor, který Weeks nezakládal, má `false`. */
  zakladatel: boolean
  /** Čemu se na táboře věnuje. */
  obor: string
  ikona: IkonaOboru
  popis: string
  email?: string
  telefon?: string
  /** Cesta od `public/`, čtvercová fotka, např. `/images/tym/krystof.webp`. */
  foto?: string
}

export const TYM: ClenTymu[] = [
  {
    id: 'krystof-jezdik',
    jmeno: 'Kryštof Ježdík',
    zakladatel: true,
    obor: 'Herní vývoj & VR',
    ikona: 'gamepad',
    email: 'krystof.jezdik@weeks.cz',
    popis: 'Ukazuje dětem, jak z nápadu vznikne hra, kterou si pak samy zahrají — a jak se staví virtuální světy.',
  },
  {
    id: 'lukas-kubik',
    jmeno: 'Lukáš Kubík',
    zakladatel: true,
    obor: 'Programování & web',
    ikona: 'code',
    email: 'lukas.kubik@weeks.cz',
    popis: 'Učí děti napsat první kód a vidět, co s ním udělá obrazovka i elektronika na stole.',
  },
  {
    id: 'stepan-jurenka',
    jmeno: 'Štěpán Jurenka',
    zakladatel: true,
    obor: '3D modelování & tisk',
    ikona: 'box',
    email: 'stepan.jurenka@weeks.cz',
    popis: 'Provede děti od prvního modelu v počítači až po hotový výtisk, který si odnesou domů.',
  },
]

/** „Spoluzakladatel“, nebo „Lektor“. */
export function roleClena(clen: ClenTymu): string {
  return clen.zakladatel ? 'Spoluzakladatel' : 'Lektor'
}
