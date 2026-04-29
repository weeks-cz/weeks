import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Cpu, ExternalLink, Home, ShieldCheck, Sparkles } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartButton } from '@/components/shop/CartButton'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { formatPrice, shopProducts } from '@/lib/shop'

export default function ShopPage() {
  const howItWorks = [
    {
      title: 'Vyberete sadu',
      text: 'Každá varianta má vlastní úroveň a projekty, takže rodič nekupuje náhodnou krabici součástek.',
    },
    {
      title: 'Dítě dostane Učebnu',
      text: 'Přístup do Weeks Učebny je součástí ceny sady a projekty jsou připravené pro konkrétní komponenty.',
    },
    {
      title: 'Tvoří doma vlastním tempem',
      text: 'Sada funguje samostatně doma a pomáhá navázat na známé prostředí z tábora nebo kroužku.',
    },
  ]

  const featuredProjects = [
    'Semafor s tlačítkem',
    'Noční světlo se senzorem',
    'Digitální teploměr',
    'Alarm s pohybovým senzorem',
    'Mini meteorologická stanice',
    'Chytrý květináč',
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
                  Weeks sady chytré elektroniky
                </div>
                <h1 className="heading-1 text-gray-900">
                  E-shop pro děti, které chtějí stavět, zapojovat a programovat i doma
                </h1>
                <p className="mt-6 max-w-2xl text-xl leading-8 text-gray-600">
                  Každá sada je poskládaná pro konkrétní projekty ve Weeks Učebně. Dítě dostane komponenty, přístup k lekcím v ceně sady a může doma tvořit vlastním tempem.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <CartButton />
                <Link href="/eshop/kosik" className="btn-primary">
                  Koupit vybrané sady
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
                { icon: Cpu, title: 'Komponenty pro projekty', text: 'Sady stavíme na Arduino kompatibilních deskách, senzorech a výstupech, které dítě použije v lekcích.' },
                { icon: BookOpen, title: 'Učebna v ceně sady', text: 'K sadě patří přístup do online Učebny s vedenými projekty pro danou úroveň.' },
                { icon: Home, title: 'Funguje samostatně doma', text: 'Dítě může navázat na Weeks program, nebo začít doma od začátku podle připravených kroků.' },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100">
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
                <h2 className="heading-2 mt-2 text-gray-900">Není to jen krabice součástek</h2>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  Rodič kupuje jasnou cestu: komponenty, projekty a prostředí, ve kterém dítě ví, co staví a jak pokračovat dál.
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
                  <div key={item.title} className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
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

        <section className="section-padding">
          <div className="section-container">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-600">Nabídka</p>
                <h2 className="heading-2 mt-2 text-gray-900">Weeks sady podle úrovně</h2>
              </div>
              <p className="hidden max-w-xl text-right text-sm leading-6 text-gray-500 lg:block">
                Každá sada obsahuje přístup do Učebny a projekty připravené pro komponenty v balení.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              {shopProducts.map((product) => (
                <article
                  key={product.slug}
                  className="group overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-700 shadow-sm">
                      {product.badge}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-primary-600">{product.subtitle}</p>
                        <h3 className="mt-1 text-2xl font-bold text-gray-900">{product.name}</h3>
                      </div>
                      <div className="rounded-2xl bg-gray-50 px-4 py-2 text-right">
                        <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
                        <p className="text-xs text-gray-500">orientačně</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-600">{product.description}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                        {product.ageRange}
                      </span>
                      <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
                        {product.level}
                      </span>
                      <span className="rounded-full bg-trust-50 px-3 py-1 text-xs font-medium text-trust-700">
                        {product.leadTime}
                      </span>
                    </div>

                    <ul className="mt-5 space-y-2 text-sm text-gray-600">
                      {product.highlights.slice(0, 3).map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                        Ukázky projektů
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.projects.map((project) => (
                          <span key={project} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                            {project}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <AddToCartButton productSlug={product.slug} productName={product.name} />
                      <Link
                        href={`/eshop/${product.slug}`}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-700"
                      >
                        Detail sady
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
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
                  Sady jsou určené pro samostatné domácí tvoření. Když dítě zná Weeks z tábora nebo kroužku, může navázat ve známém prostředí; když začíná doma, Učebna ho provede prvními projekty.
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
