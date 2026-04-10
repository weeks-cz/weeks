import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RegistrationForm } from '@/components/registration/RegistrationForm'
import { LocationProvider } from '@/contexts/LocationContext'
import { DEFAULT_LOCATION } from '@/lib/locations'

export const metadata = {
  title: 'Registrace na tábor | Weeks',
  description: 'Zaregistrujte své dítě na IT tábor Weeks.',
  robots: 'noindex, nofollow',
}

export default function RegistracePage() {
  return (
    <LocationProvider location={DEFAULT_LOCATION}>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="section-container">
          <Suspense fallback={<div className="text-center py-12 text-gray-500">Načítání formuláře...</div>}>
            <RegistrationForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </LocationProvider>
  )
}
