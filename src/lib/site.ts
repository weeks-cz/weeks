import { getVenue } from './cities'
import { getTurnusy } from './turnusy'

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

/** Věta o místech konání — složená z turnusů, ne natvrdo. */
export function getVenuesSentence(): string {
  const nazvy = Array.from(
    new Set(
      getTurnusy()
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
        'Jen dobrou náladu a svačinu na dopoledne a odpoledne. Oběd zajišťujeme my každý den. Veškeré technické vybavení, tiskárny, Arduina, VR headsety i materiály jsou na místě.',
    },
    {
      question: 'Kde tábory probíhají?',
      answer: getVenuesSentence(),
    },
    {
      question: 'Kolik dětí je na jednoho lektora?',
      answer:
        'Na jednoho lektora připadá pět dětí. Na turnus bereme nejvýše patnáct dětí, aby se na každé dostalo.',
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
      answer:
        'Vlastní výtisk z 3D tiskárny a sestavené zařízení, které si samo naprogramovalo. Obojí si odváží domů.',
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
