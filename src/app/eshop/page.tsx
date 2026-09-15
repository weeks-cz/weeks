import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Cpu, ExternalLink, Layers3, PackagePlus, ShieldCheck, Sparkles } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductCatalog } from '@/components/shop/ProductCatalog'
import { getShopProducts } from '@/lib/shop'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'E-shop — stavebnice a projekty pro děti | Weeks' },
  description: 'Stavebnice a projekty Weeks pro mladé tvůrce — chytrý květináč, meteostanice a další. Navazují na výukovou Učebnu Weeks.',
  alternates: { canonical: 'https://weeks.cz/eshop' },
  openGraph: {
    title: 'E-shop — stavebnice a projekty pro děti | Weeks',
    description: 'Stavebnice a projekty Weeks pro mladé tvůrce — chytrý květináč, meteostanice a další.',
    url: 'https://weeks.cz/eshop',
    type: 'website',
    locale: 'cs_CZ',
  },
}

export default async function ShopPage() {
  const products = await getShopProducts()

  const howItWorks = [
    {
      title: 'Vyberete cestu',
      text: 'Celá sada je pro nový start. Kit je navazující balíček pro ty, kteří už mají základní výbavu. Projekt odemkne jen jednu konkrétní lekci.',
    },
    {
      title: 'Dítě dostane Učebnu',
      text: 'Podle produktu se odemkne celá úroveň, navazující část nebo jen samostatný projekt.',
    },
    {
      title: 'Dáme vědět, co vzniká',
      text: 'U připravovaných produktů můžete nechat kontakt. Podle zájmu doladíme pořadí, finální složení a dostupnost.',
    },
  ]

  const featuredProjects = [
    'Chytrý květináč',
    'Domácí meteostanice',
    'Chytrý notifikátor',
    'Parkovací asistent',
    'Hlídač potopy',
    'Chytrý knob',
  ]

  return (
    <>
      <Header />
      <main className="bg-paper">
        <section className="relative overflow-hidden bg-paper-soft border-y border-ink/15 pt-32 pb-16">
          <div className="relative z-10 mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8 2xl:px-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 border border-ink rounded-sm px-2.5 py-1 font-mono text-xs font-medium text-ink bg-paper">
                  <Sparkles className="h-4 w-4" />
                  Připravované Weeks produkty
                </div>
                <h1 className="heading-1 text-ink">
                  Sady, kity a malé projekty pro domácí chytrou elektroniku
                </h1>
                <p className="mt-6 max-w-2xl text-xl leading-8 text-ink-500">
                  Celé sady obsahují základní výbavu i komponenty pro úroveň v Učebně, kity navazují bez duplicit a malé projekty odemknou jen jednu konkrétní lekci.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="#nabidka" className="btn-primary">
                  Projít nabídku
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
                <a
                  href="https://iot.weeks.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  Podívat se do Učebny
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { icon: Cpu, title: 'Celé sady', text: 'Pro zákazníka, který chce rovnou kompletní balení včetně desky, breadboardu, kabelů a lekcí.' },
                { icon: PackagePlus, title: 'Navazující kity', text: 'Pro ty, kteří už mají Starter sadu a chtějí jen nové komponenty pro další level.' },
                { icon: Layers3, title: 'Malé projekty', text: 'Levnější balíčky, které v Učebně odemknou jen jeden konkrétní projekt.' },
              ].map((item) => (
                <div key={item.title} className="rounded-md border border-ink/15 bg-paper p-5 card-maker">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-sm bg-primary-600 border border-ink">
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-ink/15 bg-paper py-14">
          <div className="mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8 2xl:px-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="mono-label">Jak to funguje</p>
                <h2 className="heading-2 mt-2 text-ink">Aby zákazník nekupoval stejné věci dvakrát</h2>
                <p className="mt-4 text-lg leading-8 text-ink-500">
                  Starter sada má základ. Home Lab a Explorer lze koupit jako celé sady, nebo jen jako kity pro ty, kteří už doma Starter mají. Malé projekty jsou samostatná ochutnávka za nižší cenu.
                </p>
                <a
                  href="https://iot.weeks.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  Otevřít Weeks Učebnu
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {howItWorks.map((item, index) => (
                  <div key={item.title} className="rounded-md border border-ink/15 bg-paper-soft p-5">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-sm bg-ink border border-ink text-sm font-bold text-paper">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink-500">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="nabidka" className="section-padding bg-paper">
          <div className="mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8 2xl:px-10">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="mono-label">Nabídka</p>
                <h2 className="heading-2 mt-2 text-ink">Katalog sad, kitů a projektů</h2>
              </div>
              <p className="hidden max-w-xl text-right text-sm leading-6 text-ink-500 lg:block">
                U každého produktu jde projevit zájem. Pomůže nám to rozhodnout, co složit jako první.
              </p>
            </div>

            <ProductCatalog products={products} />
          </div>
        </section>

        <section className="bg-ink text-paper blueprint-grid-dark border-y border-ink py-16">
          <div className="mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-8 2xl:px-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 border border-ink rounded-sm px-2.5 py-1 font-mono text-xs font-medium text-ink bg-paper">
                  <ShieldCheck className="h-4 w-4" />
                  Pro rodiče
                </div>
                <h2 className="heading-2 text-paper">Mladý kutil má doma na čem pracovat</h2>
                <p className="mt-4 text-lg leading-8 text-paper/70">
                  Nabídku skládáme tak, aby dávala smysl i po první sadě. Zákazník může začít kompletní sadou, navázat levnějším kitem nebo si vybrat jen jeden samostatný projekt.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {featuredProjects.map((project) => (
                  <div key={project} className="rounded-sm border border-ink/20 bg-ink/10 p-4 font-mono text-sm font-medium text-paper">
                    {project}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
