import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ShopInquiryItem {
  slug: string
  name: string
  quantity: number
  unitPrice: number
}

interface ShopInquiryRequestBody {
  name: string
  email: string
  phone?: string
  note?: string
  gdprConsent: boolean
  items: ShopInquiryItem[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ShopInquiryRequestBody
    const { name, email, phone, note, gdprConsent, items } = body

    if (!name || !email || !gdprConsent) {
      return NextResponse.json(
        { error: 'Vyplňte prosím jméno, email a souhlas se zpracováním údajů.' },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Neplatný formát e-mailu.' },
        { status: 400 }
      )
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Košík je prázdný.' },
        { status: 400 }
      )
    }

    const normalizedItems = items
      .filter((item) => item.slug && item.name && item.quantity > 0)
      .map((item) => ({
        ...item,
        quantity: Math.floor(item.quantity),
      }))

    const estimatedValue = normalizedItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    )

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID
    const subject = `E-shop poptávka Weeks - ${name}`
    const message = [
      `Zákazník: ${name}`,
      `E-mail: ${email}`,
      `Telefon: ${phone || '(neuvedeno)'}`,
      '',
      'Poptávané sady:',
      ...normalizedItems.map((item) => `- ${item.name} (${item.slug}) x${item.quantity} @ ${item.unitPrice} CZK`),
      '',
      `Orientační hodnota: ${estimatedValue} CZK`,
      '',
      'Poznámka:',
      note || '(bez poznamky)',
    ].join('\n')

    if (formspreeId) {
      const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone || '(neuvedeno)',
          message,
          inquiryType: 'shop',
          items: normalizedItems,
          estimatedValue,
          _subject: subject,
        }),
      })

      if (!formspreeResponse.ok) {
        console.error('Formspree error:', await formspreeResponse.text())
        return NextResponse.json(
          { error: 'Nepodařilo se odeslat poptávku. Zkuste to prosím znovu.' },
          { status: 500 }
        )
      }
    } else {
      console.log('Shop inquiry submission (Formspree not configured):')
      console.log({
        name,
        email,
        phone,
        note,
        items: normalizedItems,
        estimatedValue,
        timestamp: new Date().toISOString(),
      })
    }

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
            form_type: 'shop_inquiry',
            email,
            sender_name: name,
            phone: phone || null,
            message,
          }),
        })
      } catch (error) {
        console.error('Weeks Hub sync error:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Poptávka byla úspěšně odeslaná.',
    })
  } catch (error) {
    console.error('Shop inquiry API error:', error)
    return NextResponse.json(
      { error: 'Nastala neočekávaná chyba. Zkuste to prosím znovu.' },
      { status: 500 }
    )
  }
}
