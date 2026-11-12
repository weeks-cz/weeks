'use client'

import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RegistrationForm } from '@/components/registration/RegistrationForm'

function RegistraceContent() {
  return (
    <>
      <Header vToku />
      <main id="obsah" className="w2">
        <RegistrationForm />
      </main>
      <Footer />
    </>
  )
}

export default function RegistracePage() {
  return (
    <Suspense fallback={<div className="w2"><p className="nacitani">Načítání...</p></div>}>
      <RegistraceContent />
    </Suspense>
  )
}
