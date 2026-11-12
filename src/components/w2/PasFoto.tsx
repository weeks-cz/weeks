import Image from 'next/image'
import { DENNI_HARMONOGRAM } from '@/lib/tabory'

/**
 * Fotka přes celou šířku s jedním doložitelným tvrzením.
 *
 * Tvrzení není slogan: čas i to, že se po obědě jde ven, stojí
 * v `DENNI_HARMONOGRAM` (`src/lib/tabory.ts`), odkud si ho pás bere. Kdyby
 * se rozvrh změnil, změní se i text — ne aby na webu zůstala věta, kterou
 * program už neplní.
 *
 * Dvě podoby: výřez přes celou šířku (výchozí, záběr s jedním dějem), nebo
 * `foto.celek` — společná fotka, která se ukáže celá vedle textu, aby z ní
 * nikdo nevypadl (lektor na kraji, děti vpředu).
 */
const VYCHOZI = {
  src: '/images/tabor/venku-skupina.webp',
  alt: 'Chlapec venku na trávě stříká sprejem přes šablonu, ostatní děti stojí kolem',
}

/** „v 15:00“, ale „ve 13:00“ — podle toho, jak se hodina čte. */
function vKolik(cas: string): string {
  const hodina = parseInt(cas, 10)
  const ve = [2, 3, 4, 12, 13, 14, 20, 21, 22, 23].includes(hodina)
  return `${ve ? 've' : 'v'} ${cas}`
}

export function PasFoto({
  foto = VYCHOZI,
}: {
  foto?: { src: string; alt: string; celek?: boolean; width?: number; height?: number }
}) {
  const venku = DENNI_HARMONOGRAM.find((blok) => blok.druh === 'venku')

  return (
    <section className={`pas-foto${foto.celek ? ' pas-foto-celek' : ''}`}>
      <Image
        src={foto.src}
        alt={foto.alt}
        width={foto.width ?? 2000}
        height={foto.height ?? 1075}
        sizes={foto.celek ? '(min-width: 900px) 60vw, 100vw' : '100vw'}
        loading="lazy"
      />
      <div className="wrap">
        {venku && <p className="pas-foto-kdy">Každý den {vKolik(venku.time)}</p>}
        <h2>
          Celý den u počítače? <em>Ne.</em>
        </h2>
        <p>Po obědě se jde ven. Pohyb, vzduch a hry jsou součástí rozvrhu, ne odměna za dobré chování.</p>
      </div>
    </section>
  )
}
