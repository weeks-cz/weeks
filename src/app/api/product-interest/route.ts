import { NextRequest, NextResponse } from 'next/server'
import { getShopProduct, productTypeLabels, type ShopProductType } from '@/lib/shop'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_PRODUCT_TYPES: ShopProductType[] = ['set', 'upgrade-kit', 'project']

interface ProductInterestRequestBody {
  email: string
  name?: string
  note?: string
  gdprConsent: boolean
  productSlug: string
  productName: string
  productType: ShopProductType
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ProductInterestRequestBody
    const { email, name, note, gdprConsent, productSlug, productName, productType } = body

    if (!email || !productSlug || !productName || !gdprConsent) {
      return NextResponse.json(
        { error: 'Vyplňte prosím e-mail a souhlas se zpracováním údajů.' },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Neplatný formát e-mailu.' },
        { status: 400 }
      )
    }

    if (!VALID_PRODUCT_TYPES.includes(productType)) {
      return NextResponse.json(
        { error: 'Neplatný typ produktu.' },
        { status: 400 }
      )
    }

    const product = getShopProduct(productSlug)
    if (!product) {
      return NextResponse.json(
        { error: 'Produkt nebyl nalezen.' },
        { status: 404 }
      )
    }

    const productTypeLabel = productTypeLabels[productType]
    const subject = `Zájem o produkt Weeks - ${product.name} - ${email}`
    const message = [
      `Produkt: ${product.name}`,
      `Slug: ${product.slug}`,
      `Typ: ${productTypeLabel}`,
      `Orientační cena: ${product.price} CZK`,
      `Zákazník: ${name || '(neuvedeno)'}`,
      `E-mail: ${email}`,
      '',
      'Poznámka:',
      note || '(bez poznamky)',
    ].join('\n')

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID
    if (formspreeId) {
      const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          name: name || '(neuvedeno)',
          message,
          inquiryType: 'product_interest',
          productSlug: product.slug,
          productName: product.name,
          productType,
          productTypeLabel,
          gdprConsent,
          _subject: subject,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!formspreeResponse.ok) {
        console.error('Formspree error:', await formspreeResponse.text())
        return NextResponse.json(
          { error: 'Nepodařilo se odeslat zájem. Zkuste to prosím znovu.' },
          { status: 500 }
        )
      }
    } else {
      console.log('Product interest submission (Formspree not configured):')
      console.log({
        email,
        name,
        note,
        productSlug: product.slug,
        productName: product.name,
        productType,
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
            form_type: 'shop_interest',
            email,
            sender_name: name || null,
            message,
            program: product.slug,
            gdpr_consent: gdprConsent,
            product_slug: product.slug,
            product_name: product.name,
            product_type: productType,
          }),
        })
      } catch (error) {
        console.error('Weeks Hub sync error:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Zájem byl úspěšně odeslaný.',
    })
  } catch (error) {
    console.error('Product interest API error:', error)
    return NextResponse.json(
      { error: 'Nastala neočekávaná chyba. Zkuste to prosím znovu.' },
      { status: 500 }
    )
  }
}
