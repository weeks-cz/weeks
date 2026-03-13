import { NextRequest, NextResponse } from 'next/server'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Valid program IDs
const VALID_PROGRAMS = ['mix', 'mix-leto', '3d-tisk', 'iot', 'blender', 'web', 'hry', 'csharp', 'nevim']

// Program labels for email
const PROGRAM_LABELS: Record<string, string> = {
  'mix': 'Tábor chytrých technologií',
  'mix-leto': 'Tábor chytrých technologií – Léto 2026',
  '3d-tisk': '3D tisk',
  'iot': 'IoT & Arduino',
  'blender': '3D modelování (Blender)',
  'web': 'Tvorba webu',
  'hry': 'Vývoj her',
  'csharp': 'Programování C#',
  'nevim': 'Ještě nevím',
}

interface WaitlistRequestBody {
  email: string
  program: string
  childName?: string
  childAge?: string
  termin?: string
  gdprConsent: boolean
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: WaitlistRequestBody = await request.json()
    const { email, program, childName, childAge, termin, gdprConsent } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email je povinný' },
        { status: 400 }
      )
    }

    if (!gdprConsent) {
      return NextResponse.json(
        { error: 'Musíte souhlasit se zpracováním osobních údajů' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Neplatný formát emailu' },
        { status: 400 }
      )
    }

    // Validate program
    if (!program || !VALID_PROGRAMS.includes(program)) {
      return NextResponse.json(
        { error: 'Vyberte prosím program' },
        { status: 400 }
      )
    }

    // Get Formspree ID from environment
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID

    if (!formspreeId) {
      console.error('NEXT_PUBLIC_FORMSPREE_ID is not configured')
      return NextResponse.json(
        { error: 'Služba není správně nakonfigurována' },
        { status: 500 }
      )
    }

    // Prepare data for Formspree
    const programLabel = PROGRAM_LABELS[program] || program

    // Send to Formspree
    const formspreeResponse = await fetch(
      `https://formspree.io/f/${formspreeId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          program: programLabel,
          programId: program,
          childName: childName || '(neuvedeno)',
          childAge: childAge ? `${childAge} let` : '(neuvedeno)',
          ...(termin && { termin }),
          gdprConsent,
          _subject: termin
            ? `Zájem: ${programLabel} - ${termin} - ${email}`
            : `Waitlist: ${programLabel} - ${email}`,
          timestamp: new Date().toISOString(),
        }),
      }
    )

    if (!formspreeResponse.ok) {
      const errorData = await formspreeResponse.json().catch(() => ({}))
      console.error('Formspree error:', errorData)

      return NextResponse.json(
        { error: 'Nepodařilo se odeslat email. Zkuste to prosím znovu.' },
        { status: 500 }
      )
    }

    const data = await formspreeResponse.json()

    // Sync to Weeks Hub (must be awaited — serverless kills pending fetches after response)
    const hubUrl = process.env.WEEKS_HUB_API_URL
    const hubKey = process.env.WEEKS_HUB_API_KEY
    if (hubUrl && hubKey) {
      try {
        await fetch(`${hubUrl}/api/form-submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': hubKey,
          },
          body: JSON.stringify({
            form_type: 'waitlist',
            email,
            child_name: childName || null,
            child_age: childAge || null,
            program,
            gdpr_consent: gdprConsent,
          }),
        })
      } catch (err) {
        console.error('Weeks Hub sync error:', err)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email byl úspěšně přidán do waitlistu',
        data
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Waitlist API error:', error)

    return NextResponse.json(
      { error: 'Nastala neočekávaná chyba. Zkuste to prosím znovu.' },
      { status: 500 }
    )
  }
}
