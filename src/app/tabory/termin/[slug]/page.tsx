import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { EventSchema, BreadcrumbSchema } from '@/components/seo/StructuredData'
import { TerminDetail } from '@/components/turnusy/TerminDetail'
import { turnusLabels } from '@/components/turnusy/turnus-labels'
import { getCity } from '@/lib/cities'
import { SITE } from '@/lib/site'
import { getTurnus, getTurnusy, getTaboryTurnusu } from '@/lib/turnusy'

/**
 * Stránka konkrétního termínu — detail produktu (`TerminDetail`, redesign
 * 2026-10-19, viz `docs/superpowers/specs/2026-10-19-tabory-detail-redesign.md`).
 *
 * Popis tábora se sem schválně NEDUPLIKUJE. Při několika tématech, dvou
 * městech a více termínech by vznikla řada skoro shodných stránek a vyhledávač
 * by si z nich vybral jednu sám. Popis proto žije jen na stránce tématu; sem
 * patří jen strukturovaný výtah (body ze zaměření, týden v kostce).
 *
 * Adresa je `/tabory/termin/[slug]`, ne vnořená pod téma: turnus může mít témat
 * víc a změna tématu by jinak vynutila přesměrování adresy, která je na
 * vydané faktuře.
 */

/** Adres je málo a mění se jen s daty — předgenerují se staticky. */
export function generateStaticParams() {
  return getTurnusy().map((turnus) => ({ slug: turnus.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const turnus = getTurnus(slug)
  if (!turnus) return {}

  const mesto = getCity(turnus.city).name
  const l = turnusLabels(turnus)
  const title = `Letní IT tábor ${mesto} — ${l.datum} | Weeks`
  const url = `${SITE.url}/tabory/termin/${turnus.slug}`

  return {
    title: { absolute: title },
    description: turnus.perex,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: turnus.perex,
      url,
      siteName: SITE.name,
      type: 'website',
      locale: 'cs_CZ',
      // Next slučuje `openGraph` z různých úrovní jen mělce — vlastní blok tu
      // proto musí nést i obrázek a `url`, jinak by se sdílený odkaz na termín
      // v náhledu tvářil jako obecná stránka `/tabory`.
      images: [{ url: `${SITE.url}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: turnus.perex,
      images: [`${SITE.url}/opengraph-image`],
    },
  }
}

export default async function TerminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const turnus = getTurnus(slug)
  if (!turnus) notFound()

  const l = turnusLabels(turnus)
  const tabor = getTaboryTurnusu(turnus)[0]

  return (
    <>
      <EventSchema turnusy={[turnus]} />
      <BreadcrumbSchema
        items={[
          { name: 'Domů', url: SITE.url },
          { name: 'Tábory', url: `${SITE.url}/tabory` },
          ...(tabor
            ? [{ name: tabor.shortName, url: `${SITE.url}/tabory/${tabor.id}` }]
            : []),
          // Poslední položka musí textem odpovídat tomu, co stránka níž
          // doopravdy ukazuje, ne jen datu.
          { name: `${l.mesto} — ${l.datum}`, url: `${SITE.url}/tabory/termin/${turnus.slug}` },
        ]}
      />
      {/* Bez oranžového tlačítka v liště — rodič termín už má a druhé
          oranžové tlačítko by soupeřilo s „Přihlásit dítě“. */}
      <Header bezCta />
      <TerminDetail turnus={turnus} />
      <Footer />
    </>
  )
}
