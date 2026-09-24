import { MetadataRoute } from 'next'
import { getTabory } from '@/lib/tabory'
import { getTurnusy } from '@/lib/turnusy'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://weeks.cz'
  const currentDate = new Date()

  // Katalog programů, jednodenní tábory i karlovarská větev zanikly a trvale
  // přesměrovávají na svůj protějšek (viz next.config.js redirects) — do
  // sitemapy patří jen adresy, které skutečně vrací 200.
  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/tabory`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    // Téma nese popis tábora, termín jen datum a cenu. Chystané téma dostává
    // nižší prioritu — je to zatím záměr, ne nabídka.
    ...getTabory().map((tabor) => ({
      url: `${baseUrl}/tabory/${tabor.id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: tabor.status === 'aktivni' ? 0.9 : 0.6,
    })),
    ...getTurnusy().map((turnus) => ({
      url: `${baseUrl}/tabory/termin/${turnus.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    {
      url: `${baseUrl}/oslavy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/firmy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // `/eshop` tu schválně není: je schovaný z navigace, dokud se tým
    // nerozhodne, jestli ho provozovat (viz `Footer.tsx`). Route žije dál kvůli
    // starým odkazům a QR kódům, ale Googlu ho sami nenabízíme. Návrat = vrátit
    // položku sem spolu s odkazem v navigaci.
    {
      url: `${baseUrl}/o-nas`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gdpr`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/podminky`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
