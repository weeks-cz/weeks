'use client'

import { use, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RegistrationConfirmation } from '@/components/registration/RegistrationConfirmation'

function ConfirmationContent({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const token = searchParams.get('t') || ''

  return (
    <>
      <Header />
      <main className="min-h-screen bg-paper pt-24 pb-16">
        <div className="section-container">
          <RegistrationConfirmation registrationId={id} token={token} />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center text-ink/50">Načítání...</div>}>
      <ConfirmationContent id={id} />
    </Suspense>
  )
}
