'use client'

import { use, Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PaymentRedirect } from '@/components/registration/PaymentRedirect'

function PaymentContent({ id }: { id: string }) {
  return (
    <>
      <Header vToku />
      <main id="obsah" className="w2">
        <PaymentRedirect registrationId={id} />
      </main>
      <Footer />
    </>
  )
}

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <Suspense fallback={<div className="w2"><p className="nacitani">Načítání...</p></div>}>
      <PaymentContent id={id} />
    </Suspense>
  )
}
