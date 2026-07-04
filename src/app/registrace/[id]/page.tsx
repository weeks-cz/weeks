'use client'

import { use, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RegistrationConfirmation } from '@/components/registration/RegistrationConfirmation'
import { LocationProvider } from '@/contexts/LocationContext'
import { getLocationById, DEFAULT_LOCATION } from '@/lib/locations'

function ConfirmationContent({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const locationId = searchParams.get('location') || ''
  const token = searchParams.get('t') || ''
  const location = locationId ? getLocationById(locationId) : DEFAULT_LOCATION

  return (
    <LocationProvider location={location}>
      <Header />
      <main className="min-h-screen bg-night pt-24 pb-16">
        <div className="section-container">
          <RegistrationConfirmation registrationId={id} token={token} />
        </div>
      </main>
      <Footer />
    </LocationProvider>
  )
}

export default function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <Suspense fallback={<div className="min-h-screen bg-night flex items-center justify-center text-slate-500">Načítání...</div>}>
      <ConfirmationContent id={id} />
    </Suspense>
  )
}
