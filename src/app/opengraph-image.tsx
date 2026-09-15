import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/site'

/**
 * Náhled pro sdílení (Open Graph / Twitter), vygenerovaný kódem místo
 * statického obrázku — `public/og-image-v2.jpg` inzeroval nabídku, kterou
 * web už nemá (víkendové/jednodenní formáty, DDM Praha 6 ve spolupráci
 * s HWLab). Tady smí být jen tvrzení, která dnes platí, a texty jsou
 * doslovně převzaté z `SITE` a z hlavních stránek (Hero, Rozcesti), ne
 * vymyšlené nanovo.
 *
 * Font se stahuje z Google Fonts s parametrem `text` — Google vrátí
 * podmnožinu, která obsahuje přesně tyhle znaky včetně diakritiky, takže
 * není potřeba řešit ruční ořez ani sázet na to, že vestavěný fallback font
 * (Noto Sans, jen základní latinka) diakritiku vůbec umí.
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

async function nacistFont(text: string, weight: number): Promise<ArrayBuffer> {
  const params = new URLSearchParams({ family: `Bricolage Grotesque:wght@${weight}`, text })
  const css = await fetch(`https://fonts.googleapis.com/css2?${params}`).then((r) => r.text())
  const zdroj = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/)?.[1]
  if (!zdroj) {
    throw new Error('Nepodařilo se najít zdroj fontu Bricolage Grotesque v odpovědi Google Fonts.')
  }
  const res = await fetch(zdroj)
  if (!res.ok) {
    throw new Error(`Nepodařilo se stáhnout font Bricolage Grotesque (${res.status}).`)
  }
  return res.arrayBuffer()
}

export default async function OpengraphImage() {
  const popisek = 'IT tábory pro děti'
  const nadpis1 = 'IT tábory,'
  const nadpis2 = 'kde děti tvoří budoucnost'
  const podnadpis = 'Týdenní příměstský tábor pro děti 9–15 let.'
  const domena = 'weeks.cz'
  const mesta = 'Praha · Karlovy Vary'

  const tuceText = `${nadpis1}${nadpis2}W${domena}`
  const bezneText = `${popisek}${podnadpis}${mesta}`

  const [tucne, bezne] = await Promise.all([
    nacistFont(tuceText, 700),
    nacistFont(bezneText, 500),
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
      fonts: [
        { name: 'Bricolage Grotesque', data: tucne, weight: 700, style: 'normal' },
        { name: 'Bricolage Grotesque', data: bezne, weight: 500, style: 'normal' },
      ],
    }
  )
}
