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
      // Katalog programů a jednodenní tábory splývají do jedné stránky tábora.
      { source: '/program', destination: '/tabor', permanent: true },
      { source: '/tabor-chytrych-technologii', destination: '/tabor', permanent: true },
      { source: '/tabor-3d-tisk', destination: '/tabor', permanent: true },
      { source: '/tabor-iot', destination: '/tabor', permanent: true },
      { source: '/kveten', destination: '/tabor', permanent: true },
      // Město přestává být větví webu — karlovarské adresy míří na svůj protějšek,
      // ne plošně na úvodku, ať se neztratí zpětné odkazy ani cíle reklam.
      { source: '/karlovy-vary', destination: '/tabor?mesto=karlovy-vary', permanent: true },
      { source: '/karlovy-vary/letni-primestsky', destination: '/tabor?mesto=karlovy-vary', permanent: true },
      { source: '/karlovy-vary/tabor-chytrych-technologii', destination: '/tabor?mesto=karlovy-vary', permanent: true },
      { source: '/karlovy-vary/o-nas', destination: '/o-nas', permanent: true },
      { source: '/karlovy-vary/kontakt', destination: '/kontakt', permanent: true },
      { source: '/karlovy-vary/gdpr', destination: '/gdpr', permanent: true },
      { source: '/karlovy-vary/podminky', destination: '/podminky', permanent: true },
    ]
  },
}

module.exports = nextConfig
