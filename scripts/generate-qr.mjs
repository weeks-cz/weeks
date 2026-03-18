import QRCode from 'qrcode'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputDir = join(__dirname, '..', 'public', 'qr')

const BASE_URL = 'https://weeks.cz/go'

const slugs = [
  'ddm',
  'hwlab',
  'skola1',
  'skola2',
  'skola3',
  'skola4',
  'skola5',
  'skola6',
  'skola7',
  'skola8',
]

const options = {
  type: 'png',
  width: 1024,
  margin: 2,
  color: {
    dark: '#1e1b4b', // indigo-950 (matches weeks.cz brand)
    light: '#ffffff',
  },
  errorCorrectionLevel: 'H', // highest — allows logo overlay if needed
}

await mkdir(outputDir, { recursive: true })

for (const slug of slugs) {
  const url = `${BASE_URL}/${slug}`
  const filePath = join(outputDir, `qr-${slug}.png`)

  await QRCode.toFile(filePath, url, options)
  console.log(`✓ ${slug.padEnd(20)} → ${url}`)
  console.log(`  saved: public/qr/qr-${slug}.png`)
}

console.log(`\nDone! ${slugs.length} QR codes generated in public/qr/`)
