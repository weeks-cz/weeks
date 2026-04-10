'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Baby, FileCheck, ClipboardList, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { parentSchema, childSchema, consentsSchema, INSURANCE_OPTIONS, type ParentData, type ChildData, type ConsentsData } from '@/lib/registration'
import { getLocationById } from '@/lib/locations'
import Link from 'next/link'

const STEPS = [
  { id: 1, title: 'Zákonný zástupce', icon: User },
  { id: 2, title: 'Dítě', icon: Baby },
  { id: 3, title: 'Souhlasy', icon: FileCheck },
  { id: 4, title: 'Shrnutí', icon: ClipboardList },
]

export function RegistrationForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const locationId = searchParams.get('location') || 'karlovy-vary'
  const programId = searchParams.get('program') || ''
  const termId = searchParams.get('term') || ''

  const location = getLocationById(locationId)
  const program = location.programs.find(p => p.id === programId)
  const term = location.terms.find(t => t.id === termId)

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const [parent, setParent] = useState<ParentData>({
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    parent_address: '',
  })

  const [child, setChild] = useState<ChildData>({
    child_name: '',
    child_birthdate: '',
    child_insurance: INSURANCE_OPTIONS[0],
    child_health_notes: '',
    child_experience: '',
  })

  const [consents, setConsents] = useState<ConsentsData>({
    vop_consent: false as unknown as true,
    gdpr_consent: false as unknown as true,
    marketing_consent: false,
  })

  function validateStep(): boolean {
    setFieldErrors({})
    if (step === 1) {
      const result = parentSchema.safeParse(parent)
      if (!result.success) {
        setFieldErrors(result.error.flatten().fieldErrors as Record<string, string[]>)
        return false
      }
    } else if (step === 2) {
      const result = childSchema.safeParse(child)
      if (!result.success) {
        setFieldErrors(result.error.flatten().fieldErrors as Record<string, string[]>)
        return false
      }
    } else if (step === 3) {
      const result = consentsSchema.safeParse(consents)
      if (!result.success) {
        setFieldErrors(result.error.flatten().fieldErrors as Record<string, string[]>)
        return false
      }
    }
    return true
  }

  function nextStep() {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, 4))
    }
  }

  function prevStep() {
    setStep(s => Math.max(s - 1, 1))
    setFieldErrors({})
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...parent,
          ...child,
          ...consents,
          location_id: locationId,
          program: programId,
          term_id: termId,
          term_start: term?.startDate || '',
          term_end: term?.endDate || '',
          payment_amount: program?.price || 0,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registrace se nezdařila')
      }

      router.push(data.paymentUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Něco se pokazilo')
    } finally {
      setIsSubmitting(false)
    }
  }

  function FieldError({ name }: { name: string }) {
    const errors = fieldErrors[name]
    if (!errors?.length) return null
    return <p className="text-sm text-red-600 mt-1">{errors[0]}</p>
  }

  const inputClass = (name: string) =>
    `w-full px-4 py-3 rounded-lg border ${fieldErrors[name] ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors`

  if (!program || !term) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <h1 className="heading-2 mb-4">Registrace</h1>
        <p className="text-gray-600 mb-6">Neplatný odkaz na registraci. Vyberte si tábor a termín.</p>
        <Link href={`/${location.slug || ''}`} className="btn-primary">
          Zpět na výběr táborů
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="heading-2 mb-2">Registrace na tábor</h1>
        <p className="text-gray-600">
          {program.name} · {location.name} · {new Date(term.startDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-10 max-w-md mx-auto">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
              step >= s.id
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'border-gray-300 text-gray-400'
            }`}>
              <s.icon className="w-5 h-5" />
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 sm:w-16 h-0.5 mx-1 ${step > s.id ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <AnimatePresence mode="wait">
          {/* Step 1: Parent */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Zákonný zástupce</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700 mb-1">Jméno a příjmení *</label>
                  <input id="parent_name" type="text" value={parent.parent_name} onChange={e => setParent({...parent, parent_name: e.target.value})} className={inputClass('parent_name')} placeholder="Jan Novák" />
                  <FieldError name="parent_name" />
                </div>
                <div>
                  <label htmlFor="parent_email" className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                  <input id="parent_email" type="email" value={parent.parent_email} onChange={e => setParent({...parent, parent_email: e.target.value})} className={inputClass('parent_email')} placeholder="jan@email.cz" />
                  <FieldError name="parent_email" />
                </div>
                <div>
                  <label htmlFor="parent_phone" className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                  <input id="parent_phone" type="tel" value={parent.parent_phone} onChange={e => setParent({...parent, parent_phone: e.target.value})} className={inputClass('parent_phone')} placeholder="+420 123 456 789" />
                  <FieldError name="parent_phone" />
                </div>
                <div>
                  <label htmlFor="parent_address" className="block text-sm font-medium text-gray-700 mb-1">Fakturační adresa *</label>
                  <input id="parent_address" type="text" value={parent.parent_address} onChange={e => setParent({...parent, parent_address: e.target.value})} className={inputClass('parent_address')} placeholder="Ulice 123, 360 01 Karlovy Vary" />
                  <FieldError name="parent_address" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Child */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Údaje o dítěti</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="child_name" className="block text-sm font-medium text-gray-700 mb-1">Jméno a příjmení *</label>
                  <input id="child_name" type="text" value={child.child_name} onChange={e => setChild({...child, child_name: e.target.value})} className={inputClass('child_name')} placeholder="Tomáš Novák" />
                  <FieldError name="child_name" />
                </div>
                <div>
                  <label htmlFor="child_birthdate" className="block text-sm font-medium text-gray-700 mb-1">Datum narození *</label>
                  <input id="child_birthdate" type="date" value={child.child_birthdate} onChange={e => setChild({...child, child_birthdate: e.target.value})} className={inputClass('child_birthdate')} />
                  <FieldError name="child_birthdate" />
                </div>
                <div>
                  <label htmlFor="child_insurance" className="block text-sm font-medium text-gray-700 mb-1">Zdravotní pojišťovna *</label>
                  <select id="child_insurance" value={child.child_insurance} onChange={e => setChild({...child, child_insurance: e.target.value})} className={inputClass('child_insurance')}>
                    {INSURANCE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <FieldError name="child_insurance" />
                </div>
                <div>
                  <label htmlFor="child_health" className="block text-sm font-medium text-gray-700 mb-1">Zdravotní omezení / alergie</label>
                  <textarea id="child_health" value={child.child_health_notes} onChange={e => setChild({...child, child_health_notes: e.target.value})} className={inputClass('child_health_notes')} rows={3} placeholder="Nepovinné — uveďte případné alergie, léky, omezení..." />
                </div>
                <div>
                  <label htmlFor="child_exp" className="block text-sm font-medium text-gray-700 mb-1">Zkušenosti s technologiemi</label>
                  <textarea id="child_exp" value={child.child_experience} onChange={e => setChild({...child, child_experience: e.target.value})} className={inputClass('child_experience')} rows={2} placeholder="Nepovinné — jaké má dítě zkušenosti s počítači, programováním..." />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Consents */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Souhlasy</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="vop" checked={consents.vop_consent as boolean} onChange={e => setConsents({...consents, vop_consent: e.target.checked as unknown as true})} className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="vop" className="text-sm text-gray-700">
                    Souhlasím s{' '}
                    <Link href="/podminky" target="_blank" className="text-primary-600 underline hover:text-primary-700">Všeobecnými obchodními podmínkami</Link>
                    {' '}*
                  </label>
                </div>
                <FieldError name="vop_consent" />

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="gdpr" checked={consents.gdpr_consent as boolean} onChange={e => setConsents({...consents, gdpr_consent: e.target.checked as unknown as true})} className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="gdpr" className="text-sm text-gray-700">
                    Souhlasím se{' '}
                    <Link href="/gdpr" target="_blank" className="text-primary-600 underline hover:text-primary-700">zpracováním osobních údajů</Link>
                    {' '}*
                  </label>
                </div>
                <FieldError name="gdpr_consent" />

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="marketing" checked={consents.marketing_consent} onChange={e => setConsents({...consents, marketing_consent: e.target.checked})} className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="marketing" className="text-sm text-gray-700">
                    Souhlasím se zasíláním novinek a informací o dalších táborech (nepovinné)
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Shrnutí registrace</h2>
              <div className="space-y-6">
                <div className="bg-primary-50 rounded-xl p-4">
                  <h3 className="font-medium text-primary-900 mb-2">Tábor</h3>
                  <p className="text-primary-700">{program.name}</p>
                  <p className="text-sm text-primary-600">{location.name} · {new Date(term.startDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-lg font-bold text-primary-900 mt-2">{program.price.toLocaleString('cs-CZ')} Kč</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Zákonný zástupce</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{parent.parent_name}</p>
                      <p>{parent.parent_email}</p>
                      <p>{parent.parent_phone}</p>
                      <p>{parent.parent_address}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Dítě</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{child.child_name}</p>
                      <p>Narozen/a: {child.child_birthdate}</p>
                      <p>Pojišťovna: {child.child_insurance}</p>
                      {child.child_health_notes && <p>Zdravotní info: {child.child_health_notes}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button onClick={prevStep} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Zpět
            </button>
          ) : <div />}

          {step < 4 ? (
            <button onClick={nextStep} className="btn-primary">
              Další
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary disabled:opacity-50">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Odesílám...
                </>
              ) : (
                <>
                  Přejít k platbě
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
