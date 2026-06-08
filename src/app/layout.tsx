import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { DM_Sans, Outfit } from 'next/font/google'
import './globals.css'
import { OrganizationSchema, LocalBusinessSchema, EventSchema } from '@/components/seo/StructuredData'
import { CookieConsent } from '@/components/ui/CookieConsent'
import { KVRegionNudge } from '@/components/ui/KVRegionNudge'
import { MetaPixel } from '@/components/analytics/MetaPixel'
import { GoogleAnalyticsGated } from '@/components/analytics/GoogleAnalyticsGated'
import { QRTracker } from '@/components/analytics/QRTracker'
import { MotionProvider } from '@/components/providers/MotionProvider'
import { ShopProvider } from '@/components/shop/ShopProvider'

const GA_ID = (process.env.NEXT_PUBLIC_GA_ID || 'G-9955Q5FRRX').trim()

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-outfit',
  display: 'swap',
})

const siteUrl = 'https://weeks.cz'
const siteTitle = 'Weeks - IT tábory pro děti'
const siteDescription = 'IT tábory pro děti 10-15 let. 3D tisk, VR, programování, IoT a elektronika. Víkendové i jednodenní formáty v Praze a Karlových Varech.'

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
  creator: 'Weeks',
  publisher: 'Weeks',
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
        url: `${siteUrl}/og-image-v2.jpg`,
        width: 1200,
        height: 630,
        alt: 'Weeks - IT tábory pro děti',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [`${siteUrl}/og-image-v2.jpg`],
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
      <body className={`${dmSans.variable} ${outfit.variable} font-sans`}>
        <ShopProvider>
          <MotionProvider>
            {children}
          </MotionProvider>
        </ShopProvider>
        <CookieConsent />
        <KVRegionNudge />
        <Suspense fallback={null}>
          <QRTracker />
        </Suspense>
        <MetaPixel />
        <GoogleAnalyticsGated gaId={GA_ID} />
      </body>
    </html>
  )
}
