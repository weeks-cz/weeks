import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { OrganizationSchema, LocalBusinessSchema, EventSchema } from '@/components/seo/StructuredData'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

const siteUrl = 'https://weeksweb.vercel.app'
const siteTitle = 'Weeks - Víkendové IT kempy pro děti | Praha Vyšehrad'
const siteDescription = 'Víkendové IT kempy pro děti 10-15 let na Vyšehradě v Praze. 3D tisk, VR, programování, robotika a IoT. Každou sobotu a neděli. Expert instruktoři, moderní vybavení HWLab, pod záštitou DDM Praha 6.'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3B82F6',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | Weeks',
  },
  description: siteDescription,
  authors: [{ name: 'Weeks Team', url: siteUrl }],
  creator: 'DDM Praha 6',
  publisher: 'DDM Praha 6',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: siteUrl,
    siteName: 'Weeks',
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Weeks - Víkendové IT kempy pro děti v Praze',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@weeks_cz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'google-site-verification-code-here',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <head>
        <OrganizationSchema />
        <LocalBusinessSchema />
        <EventSchema />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
