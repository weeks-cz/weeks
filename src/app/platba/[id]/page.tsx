'use client'

import { use, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PaymentRedirect } from '@/components/registration/PaymentRedirect'
import { LocationProvider } from '@/contexts/LocationContext'
import { getLocationById, DEFAULT_LOCATION } from '@/lib/locations'

function PaymentContent({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const locationId = searchParams.get('location') || ''
  const location = locationId ? getLocationById(locationId) : DEFAULT_LOCATION

  return (
    <LocationProvider location={location}>
      <Header />
      <main className="min-h-screen bg-night flex items-center justify-center py-24 px-4">
        <PaymentRedirect registrationId={id} />
      </main>
      <Footer />
    </LocationProvider>
  )
}

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <Suspense fallback={<div className="min-h-screen bg-night flex items-center justify-center text-slate-500">Načítání...</div>}>
      <PaymentContent id={id} />
    </Suspense>
  )
}
