import { NextResponse } from 'next/server'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    // Abuse guard: max 5 messages per IP per 10 min. Fail-open (Redis hiccup ≠ block).
    const limited = await rateLimit(`contact:${clientIp(request)}`, 5, 600)
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Příliš mnoho zpráv. Zkuste to prosím za chvíli.' },
        { status: 429 }
      )
    }

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

    // Send to Formspree (uses same ID as waitlist)
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID

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
            form_type: 'contact',
            email,
            sender_name: name,
            message,
          }),
        })
      } catch (err) {
        console.error('Weeks Hub sync error:', err)
      }
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
