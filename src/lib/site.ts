import { getVenue } from './cities'
import { getTurnusy, TURNUSY, type Turnus } from './turnusy'

/**
 * Globální konfigurace webu — to, co se po sjednocení měst nijak neliší.
 *
 * Kontakt, odpovědi do FAQ a popisy pro vyhledávače byly dřív uložené zvlášť
 * u každého města v `locations.ts`, přestože telefon i e-mail byly stejné.
 * Vlastností turnusu zůstává jen to, co se turnus od turnusu opravdu mění:
 * místo konání, termín, cena, kapacita a zaměření.
 */
export const SITE = {
  name: 'Weeks',
  legalName: 'Weeks s.r.o.',
  ico: '29984360',
  address: 'Arbesovo náměstí 70/4, Smíchov, 150 00 Praha 5',
  court: 'Městský soud v Praze, sp. zn. C 455169',
  phone: '+420 703 046 440',
  email: 'info@weeks.cz',
  url: 'https://weeks.cz',
} as const

/**
 * Sociální sítě. Ikony na webu se kreslí z tohohle seznamu, takže nová síť
 * = jeden řádek tady.
 */
export const SOCIALNI_SITE: Array<{
  id: 'instagram' | 'facebook'
  /** Šestý pád pro čtečky: „Weeks na Instagramu“. */
  naSiti: string
  url: string
}> = [
  { id: 'instagram', naSiti: 'na Instagramu', url: 'https://www.instagram.com/weeks.cz/' },
  {
    id: 'facebook',
    naSiti: 'na Facebooku',
    url: 'https://www.facebook.com/people/Weeks-It-kempy-pro-d%C4%9Bti/61585731803335/',
  },
]

/**
 * Provozní doba tábora — jediné místo, kde je napsaná.
 *
 * Dřív byla opsaná natvrdo na jedenácti místech (dlaždice, harmonogram,
 * /kontakt, nástupní list, VOP) a jednou se už rozešla: e-mail říkal 16:00,
 * VOP 17:00 a VOP podle konce provozní doby počítají poplatek za pozdní
 * vyzvednutí (§24). Kdo čas mění, mění ho tady.
 *
 * Příchod i odchod jsou okna, ne okamžik: program začíná v 9:00 a končí
 * v 16:00, půlhodina před a po je na postupný příchod a vyzvednutí.
 */
export const PROVOZNI_DOBA = {
  od: '8:30',
  do: '16:30',
  /** `od`–`do` s pomlčkou bez mezer — do dlaždic a štítků. */
  rozsah: '8:30–16:30',
  prichod: '8:30–9:00',
  odchod: '16:00–16:30',
} as const

/**
 * Věta o místech konání — složená z turnusů, ne natvrdo.
 *
 * `list` je kvůli testům: chování „turnus bez místa" i „turnus s místem" se
 * musí dát ověřit bez ohledu na to, co je zrovna v ostrých datech. Dnes tam
 * není ani jedno potvrzené místo, takže věta vrací variantu s upřesněním.
 */
export function getVenuesSentence(list: Turnus[] = TURNUSY): string {
  const nazvy = Array.from(
    new Set(
      getTurnusy(list)
        .map((t) => (t.venueId ? getVenue(t.venueId).name : null))
        .filter((n): n is string => n !== null)
    )
  )

  if (nazvy.length === 0) {
    return 'Místa konání upřesníme u každého turnusu, jakmile je potvrdíme.'
  }
  // Věta se schválně vyhýbá skloňování cizích názvů míst („probíhají v FabLabu
  // VARY&TE" vs. „probíhají v Praze") — v šabloně by to znamenalo uhodnout i
  // předložku (v/ve) i pád, a to se s libovolným názvem nedá spolehlivě
  // vyřešit. Dvojtečkový výčet pád nepotřebuje.
  if (nazvy.length === 1) {
    return `Místa konání: ${nazvy[0]}. Přesné místo najdete u každého turnusu.`
  }
  return `Místa konání: ${nazvy.slice(0, -1).join(', ')} a ${nazvy[nazvy.length - 1]}. Přesné místo najdete u každého turnusu.`
}

export function getSiteFaq(): Array<{ question: string; answer: string }> {
  return [
    {
      question: 'Pro jak staré děti je tábor určený?',
      answer:
        'Pro děti od 9 do 15 let. Skupiny dělíme podle věku a zkušeností, takže starší se nenudí a mladší nezůstanou pozadu.',
    },
    {
      question: 'Musí dítě něco umět dopředu?',
      answer:
        'Ne. Začínáme od nuly a všechno si děti vyzkouší pod vedením lektora. Kdo už něco umí, dostane náročnější zadání.',
    },
    {
      question: 'Co má dítě mít s sebou?',
      answer:
        'Jen dobrou náladu a svačinu na dopoledne a odpoledne. Oběd zajišťujeme my každý den. Veškeré technické vybavení, tiskárny, Arduina i materiály jsou na místě.',
    },
    {
      question: 'Kde tábory probíhají?',
      answer: getVenuesSentence(),
    },
    {
      // Dřív tu stál pevný poměr „jeden lektor na pět dětí“. Ten ale záleží na
      // tom, kolik dětí se přihlásí a kolik lektorů na turnus bude — web ho
      // proto neslibuje. Slibuje jen to, co drží kapacita turnusu.
      question: 'Jak velké jsou skupiny?',
      answer:
        'Malé. Na turnus bereme nejvýše patnáct dětí a při práci je dělíme do menších skupinek, aby se lektor dostal ke každému.',
    },
    {
      question: 'Je v ceně oběd?',
      answer:
        'Ano. V ceně je oběd, pitný režim i veškerý materiál, který dítě během týdne spotřebuje. Nic dalšího se nedoplácí.',
    },
    {
      question: 'Je zajištěn oběd pro děti s alergiemi?',
      answer:
        'Ano, při registraci se ptáme na stravovací omezení a alergie. Spolupracujeme s dodavatelem, který dokáže připravit alternativní varianty.',
    },
    {
      question: 'Co si dítě odveze domů?',
      // Obecný slib o „sestaveném zařízení" tu stál proti konkrétní odpovědi
      // modulu `iot` v `focus.ts` („Micro:bity a Arduina zůstávají
      // v laboratoři"). Web nesmí tvrdit obojí — obecný slib proto mizí
      // a odpověď posílá čtenáře k zaměření, kde platí provozní pravda.
      answer:
        'Vlastní výtisk z 3D tiskárny a vlastní 3D model, který si navrhlo. U elektroniky záleží na zaměření turnusu — co si děti odvážejí a co zůstává v laboratoři, píšeme u každého zaměření zvlášť.',
    },
    {
      question: 'Jak probíhá platba?',
      answer:
        'Platba probíhá bezpečně zrychleným bankovním převodem přes platební bránu Comgate přímo při registraci. Daňový doklad obdržíte po zaplacení.',
    },
    {
      question: 'Kdo tábory pořádá?',
      answer: `Tábory pořádá ${SITE.legalName}, IČO ${SITE.ico}. Lektoři jsou proškolení v první pomoci a s dětmi pracují dlouhodobě.`,
    },
  ]
}
