'use client'

import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RegistrationForm } from '@/components/registration/RegistrationForm'

function RegistraceContent() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-paper pt-24 pb-16">
        <div className="section-container">
          <RegistrationForm />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function RegistracePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center text-ink/50">Načítání...</div>}>
      <RegistraceContent />
    </Suspense>
  )
}
