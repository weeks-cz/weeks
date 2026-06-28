'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Baby, MapPin, FileCheck, ClipboardList, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { parentSchema, childSchema, consentsSchema, INSURANCE_OPTIONS, type ParentData, type ChildData, type ConsentsData } from '@/lib/registration'
import { getLocationById } from '@/lib/locations'
import { trackRegistrationSubmit, trackRegistrationStep } from '@/lib/analytics'
import Link from 'next/link'

const STEPS = [
  { id: 1, title: 'Zákonný zástupce', icon: User },
  { id: 2, title: 'Dítě', icon: Baby },
  { id: 3, title: 'Vyzvednutí', icon: MapPin },
  { id: 4, title: 'Souhlasy', icon: FileCheck },
  { id: 5, title: 'Shrnutí', icon: ClipboardList },
]

type PickupFormState = {
  pickup_method: 'solo' | 'named_persons' | ''
  pickup_time: string
  pickup_persons: string
}

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

  const [pickup, setPickup] = useState<PickupFormState>({
    pickup_method: '',
    pickup_time: '',
    pickup_persons: '',
  })

  const [consents, setConsents] = useState<ConsentsData>({
    vop_consent: false as unknown as true,
    gdpr_consent: false as unknown as true,
    photo_consent: false,
    marketing_consent: false,
  })

  const [customerNote, setCustomerNote] = useState('')

  const vopUrl = locationId === 'karlovy-vary' ? '/karlovy-vary/podminky' : '/podminky'
  const gdprUrl = locationId === 'karlovy-vary' ? '/karlovy-vary/gdpr' : '/gdpr'

  // Měření trychtýře: zaznamenej otevření formuláře (krok 1) jednou při načtení.
  useEffect(() => {
    trackRegistrationStep({ step: 1, locationId, program: programId, termId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Varuj při opuštění rozdělaného formuláře (zavření záložky / externí navigace).
  // Neplatí pro odeslání → /platba, protože to je client-side router.push (bez unloadu).
  useEffect(() => {
    const dirty = step > 1 || !!parent.parent_name || !!parent.parent_email || !!child.child_name
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [step, parent.parent_name, parent.parent_email, child.child_name])

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
      if (!pickup.pickup_method) {
        setFieldErrors({ pickup_method: ['Zvolte způsob vyzvednutí'] })
        return false
      }
      if (pickup.pickup_method === 'solo' && !pickup.pickup_time.trim()) {
        setFieldErrors({ pickup_time: ['Uveďte plánovaný čas odchodu'] })
        return false
      }
    } else if (step === 4) {
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
      const next = Math.min(step + 1, 5)
      setStep(next)
      trackRegistrationStep({ step: next, locationId, program: programId, termId })
      return
    }
    // Neúspěšná validace — posuň pohled na první chybu (čtečky ji oznámí přes role="alert").
    setTimeout(() => {
      document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
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
          pickup_method: pickup.pickup_method,
          pickup_time: pickup.pickup_time,
          pickup_persons: pickup.pickup_persons,
          ...consents,
          customer_note: customerNote,
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

      trackRegistrationSubmit({
        locationId,
        program: programId,
        termId,
        value: program?.price || 0,
        registrationId: data.registrationId,
      })

      router.push(`${data.paymentUrl}?location=${locationId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Něco se pokazilo')
    } finally {
      setIsSubmitting(false)
    }
  }

  function fillTestData() {
    setParent({
      parent_name: 'Jan Testovací',
      parent_email: 'test@weeks.cz',
      parent_phone: '+420 703 046 440',
      parent_address: 'Testovací 1, 360 01 Karlovy Vary',
    })
    setChild({
      child_name: 'Tomáš Testovací',
      child_birthdate: '2013-05-15',
      child_insurance: INSURANCE_OPTIONS[0],
      child_health_notes: '',
      child_experience: 'Trochu Scratch',
    })
    setPickup({ pickup_method: 'solo', pickup_time: '16:00', pickup_persons: '' })
    setConsents({
      vop_consent: true as unknown as true,
      gdpr_consent: true as unknown as true,
      photo_consent: true,
      marketing_consent: false,
    })
    setStep(5)
  }

  function FieldError({ name }: { name: string }) {
    const errors = fieldErrors[name]
    if (!errors?.length) return null
    return <p role="alert" className="text-sm text-red-600 mt-1">{errors[0]}</p>
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
      <div className="flex items-center justify-between mb-10 max-w-sm mx-auto">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              aria-current={step === s.id ? 'step' : undefined}
              aria-label={`Krok ${s.id}: ${s.title}${step === s.id ? ' – aktuální' : step > s.id ? ' – hotovo' : ''}`}
              className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors ${
                step >= s.id
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              <s.icon className="w-4 h-4" aria-hidden="true" />
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-6 sm:w-10 h-0.5 mx-1 ${step > s.id ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Dev autofill */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={fillTestData}
            className="px-4 py-2 text-xs font-mono bg-gray-800 text-green-400 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
          >
            ⚡ Dev: vyplnit testovací data
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-4 py-2 text-xs font-mono bg-gray-800 text-yellow-400 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
          >
            ↺ Krok 1
          </button>
        </div>
      )}

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
                  <p className="text-xs text-gray-500 mt-1">Nepovinné. Uvádějte jen údaje nutné pro bezpečnost — použijeme je výhradně k zajištění bezpečné účasti dítěte na táboře.</p>
                </div>
                <div>
                  <label htmlFor="child_exp" className="block text-sm font-medium text-gray-700 mb-1">Zkušenosti s technologiemi</label>
                  <textarea id="child_exp" value={child.child_experience} onChange={e => setChild({...child, child_experience: e.target.value})} className={inputClass('child_experience')} rows={2} placeholder="Nepovinné — jaké má dítě zkušenosti s počítači, programováním..." />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Pickup */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Způsob vyzvednutí</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Jak bude dítě vyzvedáváno po skončení tábora? *</p>
                  <div className="space-y-3">
                    <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${pickup.pickup_method === 'solo' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="pickup_method"
                        value="solo"
                        checked={pickup.pickup_method === 'solo'}
                        onChange={() => setPickup({ ...pickup, pickup_method: 'solo', pickup_persons: '' })}
                        className="mt-0.5 accent-primary-600"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Dítě odejde samo</p>
                        <p className="text-sm text-gray-500 mt-0.5">Dítě odejde po skončení programu samostatně</p>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${pickup.pickup_method === 'named_persons' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="pickup_method"
                        value="named_persons"
                        checked={pickup.pickup_method === 'named_persons'}
                        onChange={() => setPickup({ ...pickup, pickup_method: 'named_persons', pickup_time: '' })}
                        className="mt-0.5 accent-primary-600"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Vyzvedne jmenovaná osoba</p>
                        <p className="text-sm text-gray-500 mt-0.5">Dítě vyzvedne zákonný zástupce nebo níže uvedená osoba</p>
                      </div>
                    </label>
                  </div>
                  <FieldError name="pickup_method" />
                </div>

                {pickup.pickup_method === 'solo' && (
                  <motion.div key="pickup-time" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                    <label htmlFor="pickup_time" className="block text-sm font-medium text-gray-700 mb-1">V kolik hodin smí dítě odejít? *</label>
                    <input
                      id="pickup_time"
                      type="time"
                      value={pickup.pickup_time}
                      onChange={e => setPickup({ ...pickup, pickup_time: e.target.value })}
                      className={inputClass('pickup_time')}
                      min="08:00"
                      max="17:00"
                    />
                    <p className="text-xs text-gray-500 mt-1">Standardně dítě odchází po skončení programu. Čas vyberte, jen pokud má odejít dříve.</p>
                    <FieldError name="pickup_time" />
                  </motion.div>
                )}

                {pickup.pickup_method === 'named_persons' && (
                  <motion.div key="pickup-persons" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                    <label htmlFor="pickup_persons" className="block text-sm font-medium text-gray-700 mb-1">Kdo smí dítě vyzvednout? (nepovinné)</label>
                    <textarea
                      id="pickup_persons"
                      value={pickup.pickup_persons}
                      onChange={e => setPickup({ ...pickup, pickup_persons: e.target.value })}
                      className={inputClass('pickup_persons')}
                      rows={3}
                      placeholder={'Jana Nováková, +420 601 111 222\nPetr Novák, +420 602 333 444'}
                    />
                    <p className="text-xs text-gray-500 mt-1">Zákonný zástupce smí dítě vyzvednout vždy. Vyplňte, jen pokud bude dítě vyzvedávat někdo jiný — jméno a telefon každé osoby na samostatný řádek.</p>
                    <FieldError name="pickup_persons" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Consents */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Souhlasy</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="vop" checked={consents.vop_consent as boolean} onChange={e => setConsents({...consents, vop_consent: e.target.checked as unknown as true})} className="mt-1 w-5 h-5 shrink-0 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="vop" className="text-sm text-gray-700">
                    Souhlasím s{' '}
                    <Link href={vopUrl} target="_blank" className="text-primary-600 underline hover:text-primary-700">Všeobecnými obchodními podmínkami</Link>
                    {' '}*
                  </label>
                </div>
                <FieldError name="vop_consent" />

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="gdpr" checked={consents.gdpr_consent as boolean} onChange={e => setConsents({...consents, gdpr_consent: e.target.checked as unknown as true})} className="mt-1 w-5 h-5 shrink-0 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="gdpr" className="text-sm text-gray-700">
                    Souhlasím se{' '}
                    <Link href={gdprUrl} target="_blank" className="text-primary-600 underline hover:text-primary-700">zpracováním osobních údajů</Link>
                    , včetně případných zdravotních údajů dítěte, výhradně pro zajištění bezpečné účasti na táboře{' '}*
                  </label>
                </div>
                <FieldError name="gdpr_consent" />

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="photo" checked={consents.photo_consent} onChange={e => setConsents({...consents, photo_consent: e.target.checked})} className="mt-1 w-5 h-5 shrink-0 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="photo" className="text-sm text-gray-700">
                    Souhlasím s pořizováním fotografií a videí dítěte pro dokumentaci tábora a propagaci na webu a sociálních sítích (nepovinné)
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="marketing" checked={consents.marketing_consent} onChange={e => setConsents({...consents, marketing_consent: e.target.checked})} className="mt-1 w-5 h-5 shrink-0 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="marketing" className="text-sm text-gray-700">
                    Souhlasím se zasíláním novinek a informací o dalších táborech (nepovinné)
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Summary */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Vyzvednutí</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {pickup.pickup_method === 'solo' && (
                      <p>Dítě odejde samo · čas odchodu: {pickup.pickup_time}</p>
                    )}
                    {pickup.pickup_method === 'named_persons' && (
                      <>
                        <p>Vyzvedne jmenovaná osoba:</p>
                        <p className="whitespace-pre-line pl-2">{pickup.pickup_persons}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <label htmlFor="customer_note" className="block text-sm font-medium text-gray-700 mb-1">Poznámka k objednávce (nepovinné)</label>
                  <textarea
                    id="customer_note"
                    value={customerNote}
                    onChange={e => setCustomerNote(e.target.value)}
                    maxLength={1000}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Cokoliv, co bychom měli vědět — např. kdo vám tábor doporučil."
                  />
                </div>

                <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                  Odesláním registrace potvrzujete souhlas s{' '}
                  <Link href={vopUrl} target="_blank" className="underline">VOP</Link>{' '}
                  a{' '}
                  <Link href={gdprUrl} target="_blank" className="underline">zpracováním osobních údajů</Link>.
                  Po odeslání budete přesměrováni na platbu.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div role="alert" aria-live="assertive" className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button onClick={prevStep} className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              <ArrowLeft className="w-4 h-4" />
              Zpět
            </button>
          ) : <div />}

          {step < 5 ? (
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
