import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Všechna pole jsou povinná' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neplatný formát emailu' },
        { status: 400 }
      )
    }

    // Send to Formspree
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID || process.env.NEXT_PUBLIC_FORMSPREE_ID

    if (formspreeId) {
      const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Kontaktní formulář Weeks - zpráva od ${name}`,
        }),
      })

      if (!formspreeResponse.ok) {
        console.error('Formspree error:', await formspreeResponse.text())
        return NextResponse.json(
          { error: 'Nepodařilo se odeslat zprávu' },
          { status: 500 }
        )
      }
    } else {
      // Fallback: Log to console if no Formspree ID configured
      console.log('Contact form submission (Formspree not configured):')
      console.log({ name, email, message, timestamp: new Date().toISOString() })
    }

    return NextResponse.json({
      success: true,
      message: 'Zpráva byla úspěšně odeslána',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Interní chyba serveru' },
      { status: 500 }
    )
  }
}
