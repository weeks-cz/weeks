'use client'

import { use, Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PaymentRedirect } from '@/components/registration/PaymentRedirect'

function PaymentContent({ id }: { id: string }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-paper flex items-center justify-center py-24 px-4">
        <PaymentRedirect registrationId={id} />
      </main>
      <Footer />
    </>
  )
}

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center text-ink/50">Načítání...</div>}>
      <PaymentContent id={id} />
    </Suspense>
  )
}
