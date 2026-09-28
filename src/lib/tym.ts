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
 * Jak přidat lektora: nový řádek s `zakladatel: false` (a bez `naStarosti`,
 * pokud nic neřídí). Fotka, kontakt i LinkedIn jsou nepovinné; bez fotky se
 * kreslí ikona oboru, bez kontaktu se kontakt nevypisuje (a rodič dostane obecný `SITE.email` ve zbytku stránky).
 *
 * Kontakt se sem píše jen ten, který dotyčný chce mít veřejně — tenhle
 * repozitář je veřejný.
 */

export type IkonaOboru = 'stan' | 'code' | 'box'

export interface ClenTymu {
  id: string
  jmeno: string
  /** Spoluzakladatel Weeks. Lektor, který Weeks nezakládal, má `false`. */
  zakladatel: boolean
  /**
   * Co má ve Weeks na starosti — podle toho rodič nebo firma pozná, komu
   * napsat. Na všem se podílí všichni, tohle je jen kdo za co odpovídá.
   * Lektor, který nic neřídí, pole nemá.
   */
  naStarosti?: string
  /** V čem je doma. Krátce — jedna až tři věci. */
  obor: string
  ikona: IkonaOboru
  popis: string
  email?: string
  telefon?: string
  linkedin?: string
  /** Cesta od `public/`, čtvercová fotka, např. `/images/tym/krystof.webp`. */
  foto?: string
}

// Obory se 2026-09-28 zúžily na to, čemu se kdo doopravdy věnuje. „Herní
// vývoj & VR“ u Kryštofa byla minulost (VR v programu tábora ani není)
// a IoT s Arduinem, polovina zaměření tábora, nestálo u nikoho.
export const TYM: ClenTymu[] = [
  {
    id: 'krystof-jezdik',
    jmeno: 'Kryštof Ježdík',
    zakladatel: true,
    naStarosti: 'Letní tábory',
    obor: 'Organizace táborů',
    ikona: 'stan',
    email: 'krystof.jezdik@weeks.cz',
    linkedin: 'https://www.linkedin.com/in/kry%C5%A1tof-je%C5%BEd%C3%ADk-5bba57238/',
    popis:
      'Jako lektor a vedoucí workshopů v HWLabu učí děti techniku dlouho před Weeks. Za sebou má i organizaci herních akcí a práci v pražském herním akcelerátoru. Když zrovna neřeší tábor, řeší auta.',
  },
  {
    id: 'lukas-kubik',
    jmeno: 'Lukáš Kubík',
    zakladatel: true,
    naStarosti: 'Učebna a web',
    obor: 'Vývoj · UX · design',
    ikona: 'code',
    email: 'lukas.kubik@weeks.cz',
    linkedin: 'https://www.linkedin.com/in/luk%C3%A1%C5%A1-kub%C3%ADk-251605245/',
    popis:
      'Vyvíjí weby a aplikace a pracuje jako e-commerce specialista v marketingové agentuře. Ve Weeks staví všechno, co běží na obrazovce — tenhle web, online učebnu i interní aplikaci, ve které tým tábory řídí.',
  },
  {
    id: 'stepan-jurenka',
    jmeno: 'Štěpán Jurenka',
    zakladatel: true,
    naStarosti: 'Spolupráce s firmami',
    obor: '3D modelování · 3D tisk · IoT',
    ikona: 'box',
    email: 'stepan.jurenka@weeks.cz',
    linkedin: 'https://www.linkedin.com/in/%C5%A1t%C4%9Bp%C3%A1n-jurenka-461598294/',
    popis:
      'Lektor a vedoucí workshopů v HWLabu. Jeho doménou je 3D modelování a tisk — v Blenderu modeluje mnohem déle, než Weeks existuje — a elektronika s Arduinem.',
  },
]

/** „Spoluzakladatel“, nebo „Lektor“. */
export function roleClena(clen: ClenTymu): string {
  return clen.zakladatel ? 'Spoluzakladatel' : 'Lektor'
}
