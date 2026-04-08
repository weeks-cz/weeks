import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IT tábory 18.–19. dubna | Weeks',
  description: 'Jednodenní IT tábory pro děti v Praze. IoT & elektronika (So 18.4.) a 3D tisk (Ne 19.4.). Přihlaste dítě přes DDM Praha 6.',
  robots: 'noindex, nofollow',
}

export default function DubenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
