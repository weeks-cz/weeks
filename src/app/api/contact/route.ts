import { NextResponse } from 'next/server'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { parseContactBody } from './contact-payload'

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
    const parsed = parseContactBody(body)
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const { data } = parsed
    const { name, email, message, firma, telefon, typ, gdprConsent, subject } = data

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
          ...(firma ? { firma } : {}),
          ...(telefon ? { telefon } : {}),
          ...(typ ? { typ } : {}),
          // Souhlas se posílá dál jen proto, aby po něm zůstal doklad u odeslané
          // zprávy. Nic se podle něj nerozhoduje — povinnost zaškrtnout hlídá
          // formulář, server hodnotu jen přenese.
          gdprConsent,
          _subject: subject,
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
      // Bez Formspree je konzole jediným záznamem, takže musí nést i pole,
      // která přidal poptávkový formulář — jinak není poznat, čí poptávka to
      // byla a o co šlo.
      console.log({
        name,
        email,
        message,
        firma,
        telefon,
        typ,
        gdprConsent,
        formType: data.formType,
        timestamp: new Date().toISOString(),
      })
    }

    // Sync to Weeks Hub (must be awaited — serverless kills pending fetches after response)
    // weeks-hub musí hodnotu form_type 'firmy' znát, jinak firemní poptávku
    // zahodí — Formspree ji dostane tak jako tak, takže se neztratí.
    const hubUrl = process.env.WEEKS_HUB_API_URL
    const hubKey = process.env.WEEKS_HUB_API_KEY
    if (hubUrl && hubKey) {
      try {
        const hubResponse = await fetch(`${hubUrl}/api/form-submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': hubKey,
          },
          body: JSON.stringify({
            form_type: data.formType,
            email,
            sender_name: name,
            message,
            ...(firma ? { firma } : {}),
            ...(telefon ? { telefon } : {}),
            ...(typ ? { typ } : {}),
            // Doklad o uděleném souhlasu, ne podmínka — viz komentář u odeslání
            // do Formspree výš.
            gdpr_consent: gdprConsent,
          }),
        })

        // `await fetch` vyhodí jen u síťové chyby. Odmítnutí hubem (typicky 400
        // „neznám form_type 'firmy'") by jinak prošlo tiše a předdeployové
        // ověření by se o něm nedozvědělo. Poptávku tím ale neshazujeme:
        // Formspree ji dostal, návštěvník za výpadek hubu nemůže.
        if (!hubResponse.ok) {
          console.error(
            'Weeks Hub sync failed:',
            hubResponse.status,
            await hubResponse.text().catch(() => '<tělo odpovědi se nepodařilo přečíst>')
          )
        }
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
