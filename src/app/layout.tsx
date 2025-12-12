import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'Weeks - Víkendové IT kempy pro děti | HWLab Praha',
  description: 'Víkendové IT kempy pro děti 10-15 let na Vyšehradě. 3D tisk, VR, programování a IoT. Expert instruktoři, moderní vybavení, pod záštitou DDM Praha 6.',
  keywords: ['víkendové it kempy pro děti', '3d tisk pro děti praha', 'programování pro děti víkend', 'virtuální realita děti', 'hwlab praha kempy'],
  authors: [{ name: 'Weeks Team' }],
  openGraph: {
    title: 'Weeks - Víkendové IT kempy pro děti | HWLab Praha',
    description: 'Víkendové IT kempy pro děti 10-15 let na Vyšehradě. 3D tisk, VR, programování a IoT. Expert instruktoři, moderní vybavení.',
    url: 'https://weeks-web.vercel.app',
    siteName: 'Weeks',
    locale: 'cs_CZ',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
