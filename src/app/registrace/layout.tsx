import { Metadata } from 'next'

// Registrační / potvrzovací stránky (obsahují PII) nepatří do vyhledávačů.
export const metadata: Metadata = {
  title: { absolute: 'Registrace | Weeks' },
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
