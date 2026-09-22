/**
 * Převod zdrojových fotek na WebP do `public/images/`.
 *
 * HEIC z iPhonu není jeden obrázek, ale mřížka dlaždic 512×512 — u fotky
 * 4032×3024 jich je 48. `sharp` ho sám nerozbalí: libheif v něm má bezpečnostní
 * strop 16 referencí a spadne na „Number of references in iref box exceeds the
 * security limits". Dlaždice proto vysype ffmpeg, který zároveň v `-show_stream_groups`
 * řekne, kam která patří, a slepí je `sharp`.
 *
 * Rotaci nese box `irot`, ne EXIF, takže ji dopočítáváme ručně.
 *
 * Použití:
 *   node scripts/fotky-na-webp.mjs <zdroj> <cíl.webp> [--sirka=2000] [--rotace=90]
 *
 * Vyžaduje ffmpeg v PATH nebo v FFMPEG_PATH (HEIC vstup; pro JPG/PNG není potřeba).
 */

import { execFileSync } from 'child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { dirname, extname, join } from 'path'
import { pathToFileURL } from 'url'
import sharp from 'sharp'

const FFMPEG = process.env.FFMPEG_PATH ?? 'ffmpeg'
const FFPROBE = process.env.FFPROBE_PATH ?? 'ffprobe'

/** Úhel z boxu `irot` — 0–3 jako násobky 90° proti směru hodinových ručiček. */
function uhelIrot(soubor) {
  const b = readFileSync(soubor)
  const i = b.indexOf('irot', 0, 'ascii')
  return i === -1 ? 0 : (b[i + 4] & 0x03) * 90
}

/** Slepí dlaždice HEIC do jednoho bufferu podle rozpisu z ffprobe. */
async function rozbalHeic(soubor) {
  const probe = JSON.parse(
    execFileSync(FFPROBE, ['-v', 'error', '-show_stream_groups', '-of', 'json', soubor], {
      encoding: 'utf8',
    })
  )
  const mrizka = probe.stream_groups?.[0]?.components?.[0]
  if (!mrizka) throw new Error(`${soubor}: ffprobe v souboru nenašel mřížku dlaždic`)

  const tmp = mkdtempSync(join(tmpdir(), 'heic-'))
  try {
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', soubor, '-map', '0:g:0', join(tmp, 't_%03d.png')])
    const dlazdice = readdirSync(tmp)
      .filter((f) => f.endsWith('.png'))
      .sort()

    const plátno = await sharp({
      create: {
        width: mrizka.coded_width,
        height: mrizka.coded_height,
        channels: 3,
        background: '#000',
      },
    })
      .composite(
        mrizka.subcomponents.map((s, i) => ({
          input: join(tmp, dlazdice[i]),
          left: s.tile_horizontal_offset,
          top: s.tile_vertical_offset,
        }))
      )
      .png()
      .toBuffer()

    // Ořez musí jít vlastním průchodem: sharp rotuje dřív, než ořezává, takže
    // by výřez po otočení padal mimo plátno.
    return await sharp(plátno)
      .extract({ left: 0, top: 0, width: mrizka.width, height: mrizka.height })
      .png()
      .toBuffer()
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

export async function naWebp(zdroj, cil, { sirka, kvalita = 82, rotace } = {}) {
  const jeHeic = ['.heic', '.heif'].includes(extname(zdroj).toLowerCase())
  const vstup = jeHeic ? await rozbalHeic(zdroj) : zdroj
  const uhel = rotace ?? (jeHeic ? 360 - uhelIrot(zdroj) : 0)

  let img = sharp(vstup)
  if (uhel % 360 !== 0) img = img.rotate(uhel)
  if (sirka) img = img.resize({ width: sirka, withoutEnlargement: true })

  mkdirSync(dirname(cil), { recursive: true })
  const info = await img.webp({ quality: kvalita }).toFile(cil)
  return info
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [zdroj, cil, ...prepinace] = process.argv.slice(2)
  if (!zdroj || !cil) {
    console.error('Použití: node scripts/fotky-na-webp.mjs <zdroj> <cíl.webp> [--sirka=N] [--rotace=N]')
    process.exit(1)
  }
  const hodnota = (jmeno) => {
    const p = prepinace.find((x) => x.startsWith(`--${jmeno}=`))
    return p ? Number(p.split('=')[1]) : undefined
  }

  const info = await naWebp(zdroj, cil, { sirka: hodnota('sirka'), rotace: hodnota('rotace') })
  console.log(`${cil}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} kB`)
}
