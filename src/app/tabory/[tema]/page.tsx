import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import { TemaDetail } from '@/components/tabory/TemaDetail'
import { SITE } from '@/lib/site'
import { getTabor, getTabory } from '@/lib/tabory'

/**
 * Stránka tématu — jediné místo, kde žije popis tábora. Obsah vykresluje
 * `TemaDetail` (redesign 2026-10-19, viz
 * `docs/superpowers/specs/2026-10-19-tabory-detail-redesign.md`).
 *
 * Stránky termínů popis schválně neopakují: při čtyřech tématech, dvou městech
 * a několika termínech by web měl sadu skoro shodných stránek a vyhledávač by
 * si z nich vybral jednu sám.
 */

export function generateStaticParams() {
  return getTabory().map((tabor) => ({ tema: tabor.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tema: string }>
}): Promise<Metadata> {
  const { tema } = await params
  const tabor = getTabor(tema)
  if (!tabor) return {}

  const title = `${tabor.name} | Weeks`
  const url = `${SITE.url}/tabory/${tabor.id}`

  return {
    title: { absolute: title },
    description: tabor.perex,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: tabor.perex,
      url,
      siteName: SITE.name,
      type: 'website',
      locale: 'cs_CZ',
      images: [{ url: `${SITE.url}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: tabor.perex,
      images: [`${SITE.url}/opengraph-image`],
    },
  }
}

export default async function TaborTemaPage({ params }: { params: Promise<{ tema: string }> }) {
  const { tema } = await params
  const tabor = getTabor(tema)
  if (!tabor) notFound()

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Domů', url: SITE.url },
          { name: 'Tábory', url: `${SITE.url}/tabory` },
          { name: tabor.shortName, url: `${SITE.url}/tabory/${tabor.id}` },
        ]}
      />
      <Header />
      <TemaDetail tabor={tabor} />
      <Footer />
    </>
  )
}
