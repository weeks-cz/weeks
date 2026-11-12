import Image from 'next/image'
import type { Venue } from '@/lib/cities'

/**
 * Třída mřížky sekce „místo konání“ podle toho, jakou fotku místo má:
 * žádnou (jen text), běžnou (text vedle fotky), nebo širokou (panorama pod
 * textem přes celou šířku).
 */
export function tridaMista(venue: Venue): string {
  if (!venue.foto) return ' misto-samo'
  return venue.foto.siroka ? ' misto-sirka' : ''
}

/**
 * Fotka místa konání. Cizí snímek (`foto.zdroj`) dostane popisek s uvedením
 * autora a odkazem — bez něj se fotka, která není naše, na web nedává.
 */
export function MistoFoto({ venue, hned = false }: { venue: Venue; hned?: boolean }) {
  const foto = venue.foto
  if (!foto) return null

  const obrazek = (
    <Image
      src={foto.src}
      alt={foto.alt}
      width={foto.width}
      height={foto.height}
      // Panorama se na mobilu ořezává na 16 : 9, takže z něj je vidět jen
      // prostředek a prohlížeč potřebuje zhruba dvakrát širší soubor, než je
      // displej. Se „100vw“ si vzal 360 px a roztáhl je na výšku 185 px.
      sizes={
        foto.siroka
          ? '(min-width: 1184px) 1120px, (min-width: 760px) 100vw, 200vw'
          : '(min-width: 900px) 560px, 100vw'
      }
      loading={hned ? undefined : 'lazy'}
    />
  )
  if (!foto.popisek && !foto.zdroj) return obrazek

  return (
    <figure className="misto-foto">
      {obrazek}
      <figcaption>
        {foto.popisek}
        {foto.popisek && foto.zdroj ? ' ' : ''}
        {foto.zdroj && (
          <>
            Foto:{' '}
            <a href={foto.zdroj.url} target="_blank" rel="noopener noreferrer">
              {foto.zdroj.nazev}
            </a>
          </>
        )}
      </figcaption>
    </figure>
  )
}
