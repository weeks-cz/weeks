import Image from 'next/image'
import { DENNI_HARMONOGRAM } from '@/lib/tabory'

/**
 * Fotka přes celou šířku s jedním doložitelným tvrzením.
 *
 * Tvrzení není slogan: čas i to, že se po obědě jde ven, stojí
 * v `DENNI_HARMONOGRAM` (`src/lib/tabory.ts`), odkud si ho sekce bere. Kdyby
 * se rozvrh změnil, změní se i text — ne aby na úvodce zůstala věta, kterou
 * program už neplní.
 *
 * Serverová komponenta: obrázek a dva odstavce nepotřebují ani kilobajt JS.
 */
export function FotoPas() {
  const venku = DENNI_HARMONOGRAM.find((blok) => blok.title === 'Venkovní aktivita')

  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/images/tabor/venku-sablona.webp"
        alt="Dítě na trávě stříká barvu přes šablonu na karton během venkovního bloku tábora"
        width={1800}
        height={1350}
        loading="lazy"
        sizes="100vw"
        className="h-[360px] w-full object-cover md:h-[460px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent"
      />
      <div className="absolute inset-0 flex items-center">
        {/* `w-full` je tu nutné: `section-container` je uvnitř flexu flex
            položka, takže se smrskne na šířku obsahu a `mx-auto` ji pak
            vycentruje — text by nestál u levého okraje, kde je přechod
            nejtmavší, ale uprostřed fotky. */}
        <div className="section-container w-full">
          {venku && <p className="mono-label-dark mb-4 text-cta-300">Každý den v {venku.time}</p>}
          <h2 className="heading-2 max-w-xl text-paper">
            Celý den u počítače? <span className="text-cta-400">Ne.</span>
          </h2>
          <p className="mt-4 max-w-md text-lg text-paper/80">
            Po obědě se jde ven. Pohyb, vzduch a hry jsou součástí rozvrhu, ne
            odměna za dobré chování.
          </p>
        </div>
      </div>
    </section>
  )
}
