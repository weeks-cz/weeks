import { Metadata } from 'next'

// Platební mezistránka — nemá co dělat ve vyhledávačích.
export const metadata: Metadata = {
  title: { absolute: 'Platba | Weeks' },
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
