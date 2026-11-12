'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { parentSchema, childSchema, consentsSchema, healthConsentChybi, HEALTH_CONSENT_CHYBI, INSURANCE_OPTIONS, type ParentData, type ChildData, type ConsentsData } from '@/lib/registration'
import { getTurnusById, getFocusTurnusu, getTaboryTurnusu, isBookable } from '@/lib/turnusy'
import { getCity } from '@/lib/cities'
import { getFocusModules } from '@/lib/focus'
import { zalohaDostupna, zruseniZdarmaDo, type PaymentPlan } from '@/lib/zaloha'
import { formatDatumCs, pragueIsoDate } from '@/lib/dates'
import { turnusLabels } from '@/components/turnusy/TurnusCard'
import { trackRegistrationSubmit, trackRegistrationStep } from '@/lib/analytics'
import Link from 'next/link'
import { Ikona } from '@/components/w2/Ikona'
import { Mrizka } from '@/components/w2/Mrizka'
import { sazba, telefonSazba } from '@/components/w2/text'
import { PROVOZNI_DOBA, SITE } from '@/lib/site'

const STEPS = [
  { id: 1, title: 'Zákonný zástupce' },
  { id: 2, title: 'Dítě' },
  { id: 3, title: 'Vyzvednutí' },
  { id: 4, title: 'Souhlasy' },
  { id: 5, title: 'Shrnutí' },
]

type PickupFormState = {
  pickup_method: 'solo' | 'named_persons' | ''
  pickup_time: string
  pickup_persons: string
}

export function RegistrationForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const termId = searchParams.get('term') || ''
  const turnus = getTurnusById(termId)
  // Záloha se nabízí jen tam, kde je ještě dostupná (do termínu doplatku).
  const zaloha = turnus?.zaloha && zalohaDostupna(turnus, pragueIsoDate()) ? turnus.zaloha : null

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
    health_consent: false,
  })

  const [customerNote, setCustomerNote] = useState('')
  // Výchozí volba je záloha, pokud je dostupná. Server ji stejně ověří.
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('zaloha')

  const vopUrl = '/podminky'
  const gdprUrl = '/gdpr'

  // Měření trychtýře: zaznamenej otevření formuláře (krok 1) jednou při načtení —
  // ale jen když se opravdu vykreslí formulář. Adresu bez prodejného turnusu
  // vidí i lidé ze starých odkazů, kteří žádný formulář neuvidí; kdyby se krok 1
  // odpálil i pro ně, trychtýř v GA4 by byl trvale podhodnocený.
  useEffect(() => {
    if (!turnus || !isBookable(turnus)) return
    trackRegistrationStep({ step: 1, locationId: turnus.city, program: turnus.taborIds[0] ?? '', termId })
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
      if (healthConsentChybi(child.child_health_notes, consents.health_consent)) {
        setFieldErrors({ health_consent: [HEALTH_CONSENT_CHYBI] })
        return false
      }
    }
    return true
  }

  function nextStep() {
    if (validateStep()) {
      const next = Math.min(step + 1, 5)
      setStep(next)
      trackRegistrationStep({ step: next, locationId: turnus?.city ?? '', program: turnus?.taborIds[0] ?? '', termId })
      naZacatekKroku()
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
    naZacatekKroku()
  }

  // Tlačítka jsou pod formulářem: když byl krok dlouhý, začátek dalšího by
  // zůstal nad okrajem obrazovky. Posune se jen tehdy, když je karta mimo.
  function naZacatekKroku() {
    requestAnimationFrame(() => {
      const karta = document.querySelector('.objednavka .formular')
      if (karta && karta.getBoundingClientRect().top < 0) {
        karta.scrollIntoView({ block: 'start' })
      }
    })
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
          location_id: turnus?.city ?? '',
          program: turnus?.taborIds[0] ?? '',
          term_id: turnus?.id ?? '',
          term_start: turnus?.start ?? '',
          term_end: turnus?.end ?? '',
          payment_amount: turnus?.priceKc ?? 0,
          payment_plan: zaloha ? paymentPlan : 'plna',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registrace se nezdařila')
      }

      trackRegistrationSubmit({
        locationId: turnus?.city ?? '',
        program: turnus?.taborIds[0] ?? '',
        termId,
        value: turnus?.priceKc ?? 0,
        registrationId: data.registrationId,
      })

      router.push(data.paymentUrl)
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
      health_consent: false,
    })
    setStep(5)
  }

  function FieldError({ name }: { name: string }) {
    const errors = fieldErrors[name]
    if (!errors?.length) return null
    return <p role="alert" className="pole-chyba">{errors[0]}</p>
  }

  const pole = (name: string) => (fieldErrors[name] ? 'pole ma-chybu' : 'pole')

  if (!turnus || !isBookable(turnus)) {
    // Odkazy z reklam, e-mailů i karet turnusů míří na term_id, které buď
    // neexistuje, nebo turnus zatím (či už) není v prodeji.
    return (
      <section className="zahlavi zahlavi-kratke dark mrizka">
        <Mrizka />
        <div className="wrap">
          <div className="zahlavi-uzke">
            <h1>Registrace není otevřená</h1>
            <p className="zahlavi-perex">
              {sazba('Tenhle termín se právě nedá objednat. Vyberte si prosím jiný turnus.')}
            </p>
            <div className="zahlavi-akce">
              <Link href="/tabory" className="btn btn-primary btn-lg">
                Zpět na termíny <Ikona id="sipka" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const labels = turnusLabels(turnus)
  const cityName = getCity(turnus.city).name
  const focusNames = getFocusModules(getFocusTurnusu(turnus)).map(z => z.name).join(' · ')
  const tabor = getTaboryTurnusu(turnus)[0]
  const vek = turnus.ageRange.replace('-', '–')
  const aktualni = STEPS[step - 1]

  return (
    <>
      {/* ── Záhlaví s kroky ─────────────────────────────────────────── */}
      <section className="zahlavi zahlavi-kratke dark mrizka">
        <Mrizka />
        <div className="wrap">
          <nav className="drob" aria-label="Drobečková navigace">
            <Link href="/">Domů</Link> <span aria-hidden="true">/</span>{' '}
            <Link href="/tabory">Tábory</Link> <span aria-hidden="true">/</span>{' '}
            <Link href={`/tabory/termin/${turnus.slug}`}>{sazba(labels.datum)}</Link>{' '}
            <span aria-hidden="true">/</span> <span>Registrace</span>
          </nav>
          <h1>Registrace na tábor</h1>
          <p className="zahlavi-perex">
            {sazba(`${focusNames} · ${cityName} · ${labels.datum}`)}
          </p>
          <ol className="postup">
            {STEPS.map(s => (
              <li
                key={s.id}
                className={`postup-krok${step === s.id ? ' ted' : step > s.id ? ' hotovo' : ''}`}
                aria-current={step === s.id ? 'step' : undefined}
                aria-label={`Krok ${s.id}: ${s.title}${step === s.id ? ' – aktuální' : step > s.id ? ' – hotovo' : ''}`}
              >
                <span className="postup-text">{s.title}</span>
              </li>
            ))}
          </ol>
          <p className="postup-mobil" aria-hidden="true">
            Krok {step} z {STEPS.length}: <b>{aktualni.title}</b>
          </p>
        </div>
      </section>

      <section className="sec sec-papir bez-linky">
        <div className="wrap objednavka">
          <div className="formular">
            {/* Dev autofill */}
            {process.env.NODE_ENV === 'development' && (
              <div className="dev-lista">
                <button type="button" onClick={fillTestData}>
                  ⚡ Dev: vyplnit testovací data
                </button>
                <button type="button" onClick={() => setStep(1)}>
                  ↺ Krok 1
                </button>
              </div>
            )}

            {/* Step 1: Parent */}
            {step === 1 && (
              <div key="step1">
                <h2>Zákonný zástupce</h2>
                <div className="formular-krok">
                  <div className={pole('parent_name')}>
                    <label htmlFor="parent_name">Jméno a příjmení *</label>
                    <input id="parent_name" type="text" autoComplete="name" value={parent.parent_name} onChange={e => setParent({...parent, parent_name: e.target.value})} placeholder="Jan Novák" />
                    <FieldError name="parent_name" />
                  </div>
                  <div className={pole('parent_email')}>
                    <label htmlFor="parent_email">E-mail *</label>
                    <input id="parent_email" type="email" autoComplete="email" value={parent.parent_email} onChange={e => setParent({...parent, parent_email: e.target.value})} placeholder="jan@email.cz" />
                    <FieldError name="parent_email" />
                  </div>
                  <div className={pole('parent_phone')}>
                    <label htmlFor="parent_phone">Telefon *</label>
                    <input id="parent_phone" type="tel" autoComplete="tel" value={parent.parent_phone} onChange={e => setParent({...parent, parent_phone: e.target.value})} placeholder="+420 123 456 789" />
                    <FieldError name="parent_phone" />
                  </div>
                  <div className={pole('parent_address')}>
                    <label htmlFor="parent_address">Fakturační adresa *</label>
                    <input id="parent_address" type="text" autoComplete="street-address" value={parent.parent_address} onChange={e => setParent({...parent, parent_address: e.target.value})} placeholder="Ulice 123, 360 01 Karlovy Vary" />
                    <FieldError name="parent_address" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Child */}
            {step === 2 && (
              <div key="step2">
                <h2>Údaje o dítěti</h2>
                <div className="formular-krok">
                  <div className={pole('child_name')}>
                    <label htmlFor="child_name">Jméno a příjmení *</label>
                    <input id="child_name" type="text" value={child.child_name} onChange={e => setChild({...child, child_name: e.target.value})} placeholder="Tomáš Novák" />
                    <FieldError name="child_name" />
                  </div>
                  <div className="pole-rada">
                    <div className={pole('child_birthdate')}>
                      <label htmlFor="child_birthdate">Datum narození *</label>
                      <input id="child_birthdate" type="date" value={child.child_birthdate} onChange={e => setChild({...child, child_birthdate: e.target.value})} />
                      <FieldError name="child_birthdate" />
                    </div>
                    <div className={pole('child_insurance')}>
                      <label htmlFor="child_insurance">Zdravotní pojišťovna *</label>
                      <select id="child_insurance" value={child.child_insurance} onChange={e => setChild({...child, child_insurance: e.target.value})}>
                        {INSURANCE_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <FieldError name="child_insurance" />
                    </div>
                  </div>
                  <div className={pole('child_health_notes')}>
                    <label htmlFor="child_health">Zdravotní omezení / alergie</label>
                    <textarea id="child_health" value={child.child_health_notes} onChange={e => setChild({...child, child_health_notes: e.target.value})} rows={3} placeholder="Nepovinné — uveďte případné alergie, léky, omezení..." aria-describedby="child_health_pozn" />
                    <p id="child_health_pozn" className="pole-pozn">Nepovinné. Uvádějte jen údaje nutné pro bezpečnost — použijeme je výhradně k zajištění bezpečné účasti dítěte na táboře.</p>
                  </div>
                  <div className={pole('child_experience')}>
                    <label htmlFor="child_exp">Zkušenosti s technologiemi</label>
                    <textarea id="child_exp" value={child.child_experience} onChange={e => setChild({...child, child_experience: e.target.value})} rows={2} placeholder="Nepovinné — jaké má dítě zkušenosti s počítači, programováním..." />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Pickup */}
            {step === 3 && (
              <div key="step3">
                <h2>Způsob vyzvednutí</h2>
                <div className="formular-krok">
                  <fieldset className="volby">
                    <legend>Jak bude dítě vyzvedáváno po skončení tábora? *</legend>
                    <label className="volba-karta">
                      <input
                        type="radio"
                        name="pickup_method"
                        value="solo"
                        checked={pickup.pickup_method === 'solo'}
                        onChange={() => setPickup({ ...pickup, pickup_method: 'solo', pickup_persons: '' })}
                      />
                      <b>Dítě odejde samo</b>
                      <span>Dítě odejde po skončení programu samostatně</span>
                    </label>
                    <label className="volba-karta">
                      <input
                        type="radio"
                        name="pickup_method"
                        value="named_persons"
                        checked={pickup.pickup_method === 'named_persons'}
                        onChange={() => setPickup({ ...pickup, pickup_method: 'named_persons', pickup_time: '' })}
                      />
                      <b>Vyzvedne jmenovaná osoba</b>
                      <span>Dítě vyzvedne zákonný zástupce nebo níže uvedená osoba</span>
                    </label>
                    <FieldError name="pickup_method" />
                  </fieldset>

                  {pickup.pickup_method === 'solo' && (
                    <div className={pole('pickup_time')}>
                      <label htmlFor="pickup_time">V kolik hodin smí dítě odejít? *</label>
                      <input
                        id="pickup_time"
                        type="time"
                        value={pickup.pickup_time}
                        onChange={e => setPickup({ ...pickup, pickup_time: e.target.value })}
                        min="08:30"
                        max="16:30"
                        aria-describedby="pickup_time_pozn"
                      />
                      <p id="pickup_time_pozn" className="pole-pozn">Standardně dítě odchází po skončení programu. Čas vyberte, jen pokud má odejít dříve.</p>
                      <FieldError name="pickup_time" />
                    </div>
                  )}

                  {pickup.pickup_method === 'named_persons' && (
                    <div className={pole('pickup_persons')}>
                      <label htmlFor="pickup_persons">Kdo smí dítě vyzvednout? <i>(nepovinné)</i></label>
                      <textarea
                        id="pickup_persons"
                        value={pickup.pickup_persons}
                        onChange={e => setPickup({ ...pickup, pickup_persons: e.target.value })}
                        rows={3}
                        placeholder={'Jana Nováková, +420 601 111 222\nPetr Novák, +420 602 333 444'}
                        aria-describedby="pickup_persons_pozn"
                      />
                      <p id="pickup_persons_pozn" className="pole-pozn">Zákonný zástupce smí dítě vyzvednout vždy. Vyplňte, jen pokud bude dítě vyzvedávat někdo jiný — jméno a telefon každé osoby na samostatný řádek.</p>
                      <FieldError name="pickup_persons" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Consents */}
            {step === 4 && (
              <div key="step4">
                <h2>Souhlasy</h2>
                <div className="formular-krok souhlasy">
                  <div>
                    <label className="souhlas" htmlFor="vop">
                      <input type="checkbox" id="vop" checked={consents.vop_consent as boolean} onChange={e => setConsents({...consents, vop_consent: e.target.checked as unknown as true})} />
                      <span>
                        Souhlasím s{' '}
                        <Link href={vopUrl} target="_blank">Všeobecnými obchodními podmínkami</Link>
                        {' '}*
                      </span>
                    </label>
                    <FieldError name="vop_consent" />
                  </div>

                  <div>
                    <label className="souhlas" htmlFor="gdpr">
                      <input type="checkbox" id="gdpr" checked={consents.gdpr_consent as boolean} onChange={e => setConsents({...consents, gdpr_consent: e.target.checked as unknown as true})} />
                      <span>
                        Souhlasím se{' '}
                        <Link href={gdprUrl} target="_blank">zpracováním osobních údajů</Link>
                        {' '}pro účely registrace a zajištění tábora{' '}*
                      </span>
                    </label>
                    <FieldError name="gdpr_consent" />
                  </div>

                  {/* Výslovný souhlas podle čl. 9 GDPR — jen když rodič zdravotní
                      údaje vyplnil. Bez nich není co odsouhlasit. */}
                  {child.child_health_notes.trim() !== '' && (
                    <div>
                      <label className="souhlas" htmlFor="health">
                        <input type="checkbox" id="health" checked={consents.health_consent} onChange={e => setConsents({...consents, health_consent: e.target.checked})} />
                        <span>
                          Výslovně souhlasím se zpracováním zdravotních údajů dítěte uvedených
                          v přihlášce, výhradně pro zajištění jeho bezpečné účasti na táboře{' '}*
                        </span>
                      </label>
                      <FieldError name="health_consent" />
                    </div>
                  )}

                  <label className="souhlas" htmlFor="photo">
                    <input type="checkbox" id="photo" checked={consents.photo_consent} onChange={e => setConsents({...consents, photo_consent: e.target.checked})} />
                    <span>
                      Souhlasím s pořizováním fotografií a videí dítěte pro dokumentaci tábora a propagaci na webu a sociálních sítích <span className="souhlas-pozn">(nepovinné)</span>
                    </span>
                  </label>

                  <label className="souhlas" htmlFor="marketing">
                    <input type="checkbox" id="marketing" checked={consents.marketing_consent} onChange={e => setConsents({...consents, marketing_consent: e.target.checked})} />
                    <span>
                      Souhlasím se zasíláním novinek a informací o dalších táborech <span className="souhlas-pozn">(nepovinné)</span>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 5: Summary */}
            {step === 5 && (
              <div key="step5">
                <h2>Shrnutí registrace</h2>
                <div className="formular-krok">
                  <div className="shrnuti-tabor">
                    <b>{focusNames}</b>
                    <span>{cityName} · {labels.datum}</span>
                    <span className="shrnuti-cena">{(turnus.priceKc ?? 0).toLocaleString('cs-CZ')}&nbsp;Kč</span>
                  </div>

                  {zaloha && (
                    <fieldset className="volby">
                      <legend>Jak chcete zaplatit?</legend>
                      <label className="volba-karta">
                        <input
                          type="radio"
                          name="payment_plan"
                          value="zaloha"
                          checked={paymentPlan === 'zaloha'}
                          onChange={() => setPaymentPlan('zaloha')}
                        />
                        <b>Záloha {zaloha.castkaKc.toLocaleString('cs-CZ')}&nbsp;Kč teď</b>
                        <span>
                          doplatek {((turnus.priceKc ?? 0) - zaloha.castkaKc).toLocaleString('cs-CZ')}&nbsp;Kč do {formatDatumCs(zaloha.doplatekDo)}
                        </span>
                      </label>
                      <label className="volba-karta">
                        <input
                          type="radio"
                          name="payment_plan"
                          value="plna"
                          checked={paymentPlan === 'plna'}
                          onChange={() => setPaymentPlan('plna')}
                        />
                        <b>Celá částka {(turnus.priceKc ?? 0).toLocaleString('cs-CZ')}&nbsp;Kč</b>
                      </label>
                      <p className="pole-pozn">Zrušení zdarma do {formatDatumCs(zruseniZdarmaDo(turnus.start ?? ''))}.</p>
                    </fieldset>
                  )}

                  <div className="udaje oddelit">
                    <div>
                      <h3>Zákonný zástupce</h3>
                      <p>{parent.parent_name}</p>
                      <p>{parent.parent_email}</p>
                      <p>{parent.parent_phone}</p>
                      <p>{parent.parent_address}</p>
                    </div>
                    <div>
                      <h3>Dítě</h3>
                      <p>{child.child_name}</p>
                      <p>Narozen/a: {sazba(child.child_birthdate.split('-').reverse().map(Number).join('. '))}</p>
                      <p>Pojišťovna: {child.child_insurance}</p>
                      {child.child_health_notes && <p>Zdravotní info: {child.child_health_notes}</p>}
                    </div>
                    <div className="cely">
                      <h3>Vyzvednutí</h3>
                      {pickup.pickup_method === 'solo' && (
                        <p>Dítě odejde samo · čas odchodu: {pickup.pickup_time}</p>
                      )}
                      {pickup.pickup_method === 'named_persons' && (
                        <>
                          <p>Vyzvedne jmenovaná osoba:</p>
                          <p className="predformat">{pickup.pickup_persons}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pole oddelit">
                    <label htmlFor="customer_note">Poznámka k objednávce <i>(nepovinné)</i></label>
                    <textarea
                      id="customer_note"
                      value={customerNote}
                      onChange={e => setCustomerNote(e.target.value)}
                      maxLength={1000}
                      rows={3}
                      placeholder="Cokoliv, co bychom měli vědět — např. kdo vám tábor doporučil."
                    />
                  </div>

                  <p className="formular-pozn oddelit">
                    Odesláním registrace potvrzujete souhlas s{' '}
                    <Link href={vopUrl} target="_blank" className="link">VOP</Link>{' '}
                    a{' '}
                    <Link href={gdprUrl} target="_blank" className="link">zpracováním osobních údajů</Link>.
                    Po odeslání budete přesměrováni na platbu.
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p role="alert" aria-live="assertive" className="hlaska chyba" style={{ marginTop: 16 }}>
                {error}
              </p>
            )}

            {/* Navigation */}
            <div className="formular-nav">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="btn btn-outline">
                  <Ikona id="sipka" className="sipka-zpet" />
                  Zpět
                </button>
              )}

              {step < 5 ? (
                <button type="button" onClick={nextStep} className="btn btn-primary">
                  Další
                  <Ikona id="sipka" />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? (
                    <>
                      <Tocitko />
                      Odesílám...
                    </>
                  ) : (
                    <>
                      Přejít k platbě
                      <Ikona id="sipka" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ── Souhrn tábora (jen počítač; na mobilu je totéž v záhlaví) ── */}
          <aside className="souhrn" aria-label="Vybraný tábor">
            <span className="souhrn-stitek">Vybraný tábor</span>
            <h2>{tabor ? tabor.name : focusNames}</h2>
            <ul className="souhrn-radky">
              <li>
                <Ikona id="kalendar" />
                <span>{sazba(labels.datum)}</span>
              </li>
              <li>
                <Ikona id="misto" />
                <span>{sazba(`${labels.misto}, ${cityName}`)}</span>
              </li>
              <li>
                <Ikona id="hodiny" />
                <span>{sazba(`Po–pá ${PROVOZNI_DOBA.rozsah}`)}</span>
              </li>
              <li>
                <Ikona id="lide" />
                <span>{sazba(`${vek} let`)}</span>
              </li>
            </ul>
            <div className="souhrn-cena">
              <b>{labels.cena}</b>
              {zaloha && (
                <span>
                  {sazba(`nebo záloha ${zaloha.castkaKc.toLocaleString('cs-CZ')} Kč, doplatek`)}{' '}
                  <span className="nowrap">do {formatDatumCs(zaloha.doplatekDo)}</span>
                </span>
              )}
            </div>
            <p className="small muted">
              {sazba('Dotaz k přihlášce?')}{' '}
              <a className="link" href={`tel:${SITE.phone.replace(/\s/g, '')}`}>
                {telefonSazba(SITE.phone)}
              </a>
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}

/** Točící se kolečko při odesílání (dřív `Loader2` z lucide). */
function Tocitko() {
  return (
    <svg className="tocit" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.2-8.56" strokeLinecap="round" />
    </svg>
  )
}
