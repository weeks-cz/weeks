/**
 * Generate OG image (1200x630) from hero photo with overlay text.
 * Run: node scripts/generate-og-image.js
 */
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const SRC = path.join(__dirname, '..', 'public', 'images', 'hwlab', 'hwlab-7976.webp')
const OUT = path.join(__dirname, '..', 'public', 'og-image.jpg')

const W = 1200
const H = 630

const svgOverlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0f172a" stop-opacity="0.95"/>
      <stop offset="0.55" stop-color="#0f172a" stop-opacity="0.78"/>
      <stop offset="1" stop-color="#0f172a" stop-opacity="0.45"/>
    </linearGradient>
    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0f172a" stop-opacity="0.35"/>
      <stop offset="0.5" stop-color="#0f172a" stop-opacity="0"/>
      <stop offset="1" stop-color="#0f172a" stop-opacity="0.55"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#a5b4fc"/>
      <stop offset="0.5" stop-color="#67e8f9"/>
      <stop offset="1" stop-color="#a5b4fc"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#v)"/>

  <!-- Brand badge top-left -->
  <g transform="translate(60, 60)">
    <rect x="0" y="0" rx="22" ry="22" width="180" height="44"
          fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
    <circle cx="22" cy="22" r="5" fill="#fbbf24"/>
    <text x="40" y="29"
          font-family="Inter, Segoe UI, Arial, sans-serif"
          font-size="16" font-weight="600" fill="#ffffff" letter-spacing="0.3">
      IT tábory pro děti
    </text>
  </g>

  <!-- Headline -->
  <g transform="translate(60, 250)">
    <text font-family="Inter, Segoe UI, Arial, sans-serif"
          font-size="62" font-weight="800" fill="#ffffff" letter-spacing="-1.2">
      <tspan x="0" dy="0">IT tábory,</tspan>
      <tspan x="0" dy="76" fill="url(#brand)">kde děti tvoří budoucnost</tspan>
    </text>
  </g>

  <!-- Subheadline -->
  <g transform="translate(60, 460)">
    <text font-family="Inter, Segoe UI, Arial, sans-serif"
          font-size="24" font-weight="400" fill="rgba(255,255,255,0.82)" letter-spacing="0.2">
      <tspan x="0" dy="0">Praha · 10–15 let · Víkendové i jednodenní formáty</tspan>
    </text>
  </g>

  <!-- Bottom row: domain + partners -->
  <g transform="translate(60, 545)">
    <text font-family="Inter, Segoe UI, Arial, sans-serif"
          font-size="20" font-weight="600" fill="#fbbf24" letter-spacing="0.3">
      weeks.cz
    </text>
    <text x="120" font-family="Inter, Segoe UI, Arial, sans-serif"
          font-size="18" font-weight="400" fill="rgba(255,255,255,0.55)" letter-spacing="0.2">
      · pořádá DDM Praha 6 ve spolupráci s HWLab
    </text>
  </g>

  <!-- "W" mark bottom-right -->
  <g transform="translate(${W - 130}, ${H - 130})">
    <rect x="0" y="0" rx="20" ry="20" width="80" height="80"
          fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
    <text x="40" y="56" text-anchor="middle"
          font-family="Inter, Segoe UI, Arial, sans-serif"
          font-size="44" font-weight="800" fill="url(#brand)">W</text>
  </g>
</svg>
`

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Source image not found:', SRC)
    process.exit(1)
  }

  // Backup current og-image.jpg
  if (fs.existsSync(OUT)) {
    const backup = OUT.replace('.jpg', '.old.jpg')
    if (!fs.existsSync(backup)) {
      fs.copyFileSync(OUT, backup)
      console.log('Backed up old OG image to:', path.basename(backup))
    }
  }

  const overlayBuffer = Buffer.from(svgOverlay)

  await sharp(SRC)
    .resize(W, H, { fit: 'cover', position: 'center' })
    .composite([{ input: overlayBuffer, top: 0, left: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(OUT)

  const stats = fs.statSync(OUT)
  console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${(stats.size / 1024).toFixed(1)} KB, ${W}x${H})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
