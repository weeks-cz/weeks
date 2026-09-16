import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/site'

/**
 * Náhled pro sdílení (Open Graph / Twitter), vygenerovaný kódem místo
 * statického obrázku — `public/og-image-v2.jpg` inzeroval nabídku, kterou
 * web už nemá (víkendové/jednodenní formáty, DDM Praha 6 ve spolupráci
 * s HWLab), a protože ležel v `public/`, chodil dál veřejně na adrese
 * weeks.cz/og-image-v2.jpg, i když už na něj nikdo neodkazoval. Proto je
 * smazaný. Tady smí být jen tvrzení, která dnes platí, a texty jsou
 * doslovně převzaté z `SITE` a z hlavních stránek (Hero, Rozcesti), ne
 * vymyšlené nanovo.
 *
 * Font (Bricolage Grotesque, SIL OFL) je uložený přímo v repozitáři a čte se
 * z disku — dřív se při každém buildu stahoval z Google Fonts, takže
 * nedostupnost cizí služby shodila `next build` a s ním nasazení čehokoliv
 * jiného.
 *
 * Google distribuuje tenhle font jako jeden variabilní soubor (tři osy:
 * opsz/wdth/wght), ale satori (parser, na kterém `next/og` staví) na jeho
 * `fvar` tabulce padá — Google Fonts přiřazují názvům os vlastní ID ≥256 a
 * satori je neumí dohledat. Proto jsou tu dvě staticky vyexportované váhy
 * (`fonttools varLib.instancer`, opsz=14/wdth=100 podle výchozí pojmenované
 * instance), přesně ty dvě, které web používá — ne znovu jeden sdílený
 * soubor.
 */

export const alt = `${SITE.name} — IT tábor pro děti`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const INK = '#0C0E1A'
const INK_60 = 'rgba(12, 14, 26, 0.6)'
const INK_50 = 'rgba(12, 14, 26, 0.5)'
const INK_06 = 'rgba(12, 14, 26, 0.06)'
const PAPER = '#FAFAF7'
const PRIMARY = '#4F46E5'

async function nacistFont(soubor: string): Promise<ArrayBuffer | null> {
  try {
    const cesta = join(process.cwd(), 'public', 'fonts', soubor)
    const buffer = await readFile(cesta)
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
  } catch {
    // Bez vlastního písma se náhled vykreslí systémovým — horší typografie je
    // pořád lepší než spadlý build, který zablokuje nasazení čehokoliv jiného.
    return null
  }
}

export default async function OpengraphImage() {
  const popisek = 'IT tábory pro děti'
  const nadpis1 = 'IT tábory,'
  const nadpis2 = 'kde děti tvoří budoucnost'
  const podnadpis = 'Týdenní příměstský tábor pro děti 9–15 let.'
  const domena = 'weeks.cz'
  const mesta = 'Praha · Karlovy Vary'

  const [tucne, bezne] = await Promise.all([
    nacistFont('bricolage-grotesque-700.ttf'),
    nacistFont('bricolage-grotesque-500.ttf'),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 88px',
          backgroundColor: PAPER,
          backgroundImage:
            'linear-gradient(to right, rgba(79,70,229,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(79,70,229,0.07) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          fontFamily: 'Bricolage Grotesque',
          position: 'relative',
        }}
      >
        {/* Vodoznak — stejný motiv jako velké „WEEKS" v patičce webu, jen v barvě
            inkoustu na papíru místo papíru na inkoustu. */}
        <div
          style={{
            position: 'absolute',
            right: '10px',
            bottom: '-100px',
            fontSize: 460,
            fontWeight: 700,
            color: INK_06,
            lineHeight: 1,
            display: 'flex',
          }}
        >
          W
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: INK_60,
          }}
        >
          {popisek}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, color: INK, lineHeight: 1.08 }}>
            {nadpis1}
          </div>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, color: PRIMARY, lineHeight: 1.08 }}>
            {nadpis2}
          </div>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 500, color: INK_60, marginTop: 28 }}>
            {podnadpis}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 26 }}>
          <div style={{ display: 'flex', fontWeight: 700, color: PRIMARY }}>{domena}</div>
          <div style={{ display: 'flex', fontWeight: 500, color: INK_50 }}>·</div>
          <div style={{ display: 'flex', fontWeight: 500, color: INK_60 }}>{mesta}</div>
        </div>
      </div>
    ),
    {
      ...size,
      // `fonts` buď dostane obě váhy, nebo se úplně vynechá — polovičaté
      // pokrytí (jen tučně, nebo jen normálně) by vypadalo hůř než čistý
      // systémový fallback.
      ...(tucne && bezne
        ? {
            fonts: [
              { name: 'Bricolage Grotesque', data: tucne, weight: 700 as const, style: 'normal' as const },
              { name: 'Bricolage Grotesque', data: bezne, weight: 500 as const, style: 'normal' as const },
            ],
          }
        : {}),
    }
  )
}
