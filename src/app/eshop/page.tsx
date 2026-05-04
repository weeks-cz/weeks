import Link from 'next/link'
import { ArrowRight, Cpu, ExternalLink, Layers3, PackagePlus, ShieldCheck, Sparkles } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductCatalog } from '@/components/shop/ProductCatalog'

export default function ShopPage() {
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
      <main className="bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-primary-50/40 to-accent-50/30 pt-32 pb-16">
          <div className="section-container relative z-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-primary-700 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                  Připravované Weeks produkty
                </div>
                <h1 className="heading-1 text-gray-900">
                  Sady, kity a malé projekty pro domácí chytrou elektroniku
                </h1>
                <p className="mt-6 max-w-2xl text-xl leading-8 text-gray-600">
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
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-700"
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
                <div key={item.title} className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100">
                    <item.icon className="h-5 w-5 text-primary-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-gray-100 bg-white py-14">
          <div className="section-container">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-600">Jak to funguje</p>
                <h2 className="heading-2 mt-2 text-gray-900">Aby zákazník nekupoval stejné věci dvakrát</h2>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  Starter sada má základ. Home Lab a Explorer lze koupit jako celé sady, nebo jen jako kity pro ty, kteří už doma Starter mají. Malé projekty jsou samostatná ochutnávka za nižší cenu.
                </p>
                <a
                  href="https://iot.weeks.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-primary-700 transition-colors hover:text-primary-900"
                >
                  Otevřít Weeks Učebnu
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {howItWorks.map((item, index) => (
                  <div key={item.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="nabidka" className="section-padding">
          <div className="section-container">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-600">Nabídka</p>
                <h2 className="heading-2 mt-2 text-gray-900">Katalog sad, kitů a projektů</h2>
              </div>
              <p className="hidden max-w-xl text-right text-sm leading-6 text-gray-500 lg:block">
                U každého produktu jde projevit zájem. Pomůže nám to rozhodnout, co složit jako první.
              </p>
            </div>

            <ProductCatalog />
          </div>
        </section>

        <section className="bg-gray-900 py-16 text-white">
          <div className="section-container">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80">
                  <ShieldCheck className="h-4 w-4" />
                  Pro rodiče
                </div>
                <h2 className="heading-2">Dítě má doma na čem pracovat</h2>
                <p className="mt-4 text-lg leading-8 text-white/70">
                  Nabídku skládáme tak, aby dávala smysl i po první sadě. Zákazník může začít kompletní sadou, navázat levnějším kitem nebo si vybrat jen jeden samostatný projekt.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {featuredProjects.map((project) => (
                  <div key={project} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-medium text-white/85">
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
