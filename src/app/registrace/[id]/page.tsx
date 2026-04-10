import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RegistrationConfirmation } from '@/components/registration/RegistrationConfirmation'
import { LocationProvider } from '@/contexts/LocationContext'
import { DEFAULT_LOCATION } from '@/lib/locations'

export const metadata = {
  title: 'Potvrzení registrace | Weeks',
  robots: 'noindex, nofollow',
}

export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <LocationProvider location={DEFAULT_LOCATION}>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="section-container">
          <RegistrationConfirmation registrationId={id} />
        </div>
      </main>
      <Footer />
    </LocationProvider>
  )
}
