import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IT tábory 16.–17. května | Weeks',
  description: 'Jednodenní IT tábory pro děti v Praze. 3D tisk (So 16.5.) a IoT & elektronika (Ne 17.5.). Přihlaste dítě přes DDM Praha 6.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Jednodenní IT tábory pro děti | 16.–17. května',
    description: '3D tisk (So 16.5.) a IoT & elektronika (Ne 17.5.) v Praze. Pro děti 10–15 let. Organizátor: DDM Praha 6.',
    url: 'https://weeks.cz/kveten',
    siteName: 'Weeks – IT tábory pro děti',
    images: [{ url: 'https://weeks.cz/og-image.jpg', width: 1200, height: 630 }],
    locale: 'cs_CZ',
    type: 'website',
  },
}

export default function KvetenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
