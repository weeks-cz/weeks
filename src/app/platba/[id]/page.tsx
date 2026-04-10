import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PaymentMock } from '@/components/registration/PaymentMock'
import { LocationProvider } from '@/contexts/LocationContext'
import { DEFAULT_LOCATION } from '@/lib/locations'

export const metadata = {
  title: 'Platba | Weeks',
  robots: 'noindex, nofollow',
}

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <LocationProvider location={DEFAULT_LOCATION}>
      <Header />
      <main className="min-h-screen bg-slate-50 flex items-center justify-center py-24 px-4">
        <PaymentMock registrationId={id} />
      </main>
      <Footer />
    </LocationProvider>
  )
}
