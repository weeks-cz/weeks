import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Bricolage_Grotesque, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { CookieConsent } from '@/components/ui/CookieConsent'
import { MetaPixel } from '@/components/analytics/MetaPixel'
import { SklikTracking } from '@/components/analytics/SklikTracking'
import { GoogleAnalyticsGated } from '@/components/analytics/GoogleAnalyticsGated'
import { QRTracker } from '@/components/analytics/QRTracker'
import { MotionProvider } from '@/components/providers/MotionProvider'
import { ShopProvider } from '@/components/shop/ShopProvider'
import { SITE } from '@/lib/site'

const GA_ID = (process.env.NEXT_PUBLIC_GA_ID || 'G-9955Q5FRRX').trim()

const instrumentSans = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

// Výchozí metadata pro celý web — dědí je každá stránka, která si vlastní
// nenastaví (homepage žádná nemá). Popisují jediný produkt, který Weeks s.r.o.
// nabízí: týdenní letní příměstský tábor — stejným jazykem jako `/tabory`
// a úvodní stránka, ne stránku, která zanikla (žádné víkendové/jednodenní
// formáty, žádné DDM).
const siteUrl = SITE.url
const siteTitle = `${SITE.name} - IT tábory pro děti`
const siteDescription =
  'Týdenní příměstský tábor pro děti 9–15 let. 3D tisk, 3D modelování a IoT s Arduinem v malých skupinkách, oběd i materiál v ceně.'

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
  creator: SITE.name,
  publisher: SITE.legalName,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: siteUrl,
    siteName: SITE.name,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [`${siteUrl}/opengraph-image`],
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
  // Google Search Console je ověřená přes DNS TXT záznam (viz CLAUDE.md / subreg.cz),
  // proto zde není potřeba meta tag.
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className={`${instrumentSans.variable} ${bricolage.variable} ${plexMono.variable} font-sans`}>
        <ShopProvider>
          <MotionProvider>
            {children}
          </MotionProvider>
        </ShopProvider>
        <CookieConsent />
        <Suspense fallback={null}>
        </Suspense>
        <Suspense fallback={null}>
          <QRTracker />
        </Suspense>
        <MetaPixel />
        <SklikTracking />
        <GoogleAnalyticsGated gaId={GA_ID} />
      </body>
    </html>
  )
}
