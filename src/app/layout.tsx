import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'Weeks - Víkendové IT tábory pro děti | HWLab Praha',
  description: 'Víkendové IT tábory pro děti 10-15 let v HWLabu Praha. 3D tisk, virtuální realita, IoT a programování pod záštitou DDM Praha 6.',
  keywords: ['IT tábory pro děti', 'víkendové tábory Praha', '3D tisk pro děti', 'VR tábory', 'programování pro děti', 'HWLab'],
  authors: [{ name: 'Weeks Team' }],
  openGraph: {
    title: 'Weeks - Víkendové IT tábory pro děti',
    description: 'Víkendové IT tábory pro děti 10-15 let v HWLabu Praha. 3D tisk, VR, IoT.',
    url: 'https://weeks.cz',
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
