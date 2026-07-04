'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RegistrationForm } from '@/components/registration/RegistrationForm'
import { LocationProvider } from '@/contexts/LocationContext'
import { getLocationById, DEFAULT_LOCATION } from '@/lib/locations'

function RegistraceContent() {
  const searchParams = useSearchParams()
  const locationId = searchParams.get('location') || ''
  const location = locationId ? getLocationById(locationId) : DEFAULT_LOCATION

  return (
    <LocationProvider location={location}>
      <Header />
      <main className="min-h-screen bg-night pt-24 pb-16">
        <div className="section-container">
          <RegistrationForm />
        </div>
      </main>
      <Footer />
    </LocationProvider>
  )
}

export default function RegistracePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-night flex items-center justify-center text-slate-500">Načítání...</div>}>
      <RegistraceContent />
    </Suspense>
  )
}
