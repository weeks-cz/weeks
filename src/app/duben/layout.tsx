import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IT tábory 18.–19. dubna | Weeks',
  description: 'Jednodenní IT tábory pro děti v Praze. IoT & elektronika (So 18.4.) a 3D tisk (Ne 19.4.). Přihlaste dítě přes DDM Praha 6.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Jednodenní IT tábory pro děti | 18.–19. dubna',
    description: 'IoT & elektronika (So 18.4.) a 3D tisk (Ne 19.4.) v Praze. Pro děti 10–15 let. Organizátor: DDM Praha 6.',
    url: 'https://weeks.cz/duben',
    siteName: 'Weeks – IT tábory pro děti',
    images: [{ url: 'https://weeks.cz/og-image.jpg', width: 1200, height: 630 }],
    locale: 'cs_CZ',
    type: 'website',
  },
}

export default function DubenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
