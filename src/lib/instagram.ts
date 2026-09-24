/**
 * Pás s Instagram posty na úvodce — ručně vybrané, ne z API.
 *
 * Rozhodnuto 2026-09-24: Instagram API chce Business účet a token, který po
 * 60 dnech vyprší, a služby třetích stran (Elfsight, Behold) přidávají cizí
 * skript a cookies. Šest vybraných fotek uložených na webu nic z toho nepotřebuje.
 *
 * Jak přidat post: fotku ulož do `public/images/instagram/` (čtverec, WebP,
 * ~800 px), sem přidej řádek s odkazem na post. `alt` popisuje, co je na
 * fotce, ne co je v popisku postu.
 *
 * Prázdný seznam = pás se nevykreslí. Hlídá to `instagram.test.ts`.
 */

export interface InstagramPost {
  id: string
  /** Cesta od `public/`, např. `/images/instagram/tisk-jmenovky.webp`. */
  obrazek: string
  alt: string
  /** Odkaz na post, `https://www.instagram.com/p/…/`. */
  url: string
}

/**
 * Vybráno 2026-09-24 z @weeks.cz. Jen skutečné fotky — většina starších postů
 * jsou reklamní grafiky s logem DDM, věkem „10–15 let“ a víkendovými tábory,
 * které už neplatí, a na web nepatří ani jako náhled.
 */
export const INSTAGRAM_POSTY: InstagramPost[] = [
  {
    id: 'tabor-karlovy-vary-2026',
    obrazek: '/images/instagram/tabor-karlovy-vary-2026.webp',
    alt: 'Děti s lektory na terase po letním táboře v Karlových Varech, mávají do objektivu',
    url: 'https://www.instagram.com/p/DbnvUOXjIBL/',
  },
  {
    id: '3d-tisk-drak',
    obrazek: '/images/instagram/3d-tisk-drak.webp',
    alt: 'Pohyblivý drak vytištěný na 3D tiskárně, stojí na dřevěném stole',
    url: 'https://www.instagram.com/p/DZ3KF4_DLEo/',
  },
  {
    id: 'maker-faire-praha',
    obrazek: '/images/instagram/maker-faire-praha.webp',
    alt: 'Lektor Weeks s mikrofonem na pražském Maker Faire',
    url: 'https://www.instagram.com/reel/DY5QDvUMvgL/',
  },
  {
    id: 'dilna-video',
    obrazek: '/images/instagram/dilna-video.webp',
    alt: 'Lektor Weeks mluví do kamery v dílně s nářadím a 3D tiskárnami',
    url: 'https://www.instagram.com/reel/DZFO9hvsjxW/',
  },
]
