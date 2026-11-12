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
      <Header vToku />
      <main id="obsah" className="w2">
        <RegistrationConfirmation registrationId={id} token={token} />
      </main>
      <Footer />
    </>
  )
}

export default function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <Suspense fallback={<div className="w2"><p className="nacitani">Načítání...</p></div>}>
      <ConfirmationContent id={id} />
    </Suspense>
  )
}
