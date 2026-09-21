/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next 16 defaults to [75] and rejects other q values — 90 is opt-in for
    // the above-the-fold hero photo.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Katalog programů a jednodenní tábory splývají do výpisu táborů.
      // Cíl je rovnou `/tabory`, ne `/tabor` — jinak by vznikl řetěz 301 → 301.
      { source: '/program', destination: '/tabory', permanent: true },
      { source: '/tabor-chytrych-technologii', destination: '/tabory', permanent: true },
      { source: '/tabor-3d-tisk', destination: '/tabory', permanent: true },
      { source: '/tabor-iot', destination: '/tabory', permanent: true },
      { source: '/kveten', destination: '/tabory', permanent: true },
      // Jednostránkový detail `/tabor` ustoupil třem úrovním pod `/tabory`.
      // Adresa nikdy nebyla v indexu (žila jen na větvi feat/web-2027), takže
      // se tu nic nerozbíjí — pravidlo je tu pro odkazy z náhledů a záložek.
      { source: '/tabor', destination: '/tabory', permanent: true },
      { source: '/tabor/:slug', destination: '/tabory/termin/:slug', permanent: true },
      // Město přestává být větví webu — karlovarské adresy míří na svůj protějšek,
      // ne plošně na úvodku, ať se neztratí zpětné odkazy ani cíle reklam.
      { source: '/karlovy-vary', destination: '/tabory?mesto=karlovy-vary', permanent: true },
      { source: '/karlovy-vary/letni-primestsky', destination: '/tabory?mesto=karlovy-vary', permanent: true },
      { source: '/karlovy-vary/tabor-chytrych-technologii', destination: '/tabory?mesto=karlovy-vary', permanent: true },
      { source: '/karlovy-vary/o-nas', destination: '/o-nas', permanent: true },
      { source: '/karlovy-vary/kontakt', destination: '/kontakt', permanent: true },
      { source: '/karlovy-vary/gdpr', destination: '/gdpr', permanent: true },
      { source: '/karlovy-vary/podminky', destination: '/podminky', permanent: true },
    ]
  },
}

module.exports = nextConfig
