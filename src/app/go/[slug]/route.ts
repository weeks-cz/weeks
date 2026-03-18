import { NextRequest, NextResponse } from 'next/server'

// QR code redirect mapping: slug → UTM parameters
// Each entry represents a physical location (poster, flyer, etc.)
const QR_REDIRECTS: Record<string, { source: string; medium: string; campaign: string; content: string; destination?: string }> = {
  'ddm': {
    source: 'plakat',
    medium: 'qr',
    campaign: 'jaro2026',
    content: 'ddm',
  },
  'hwlab': {
    source: 'plakat',
    medium: 'qr',
    campaign: 'jaro2026',
    content: 'hwlab',
  },
  'skola1': {
    source: 'plakat',
    medium: 'qr',
    campaign: 'jaro2026',
    content: 'skola1',
  },
  'skola2': {
    source: 'plakat',
    medium: 'qr',
    campaign: 'jaro2026',
    content: 'skola2',
  },
  'skola3': {
    source: 'plakat',
    medium: 'qr',
    campaign: 'jaro2026',
    content: 'skola3',
  },
  'skola4': {
    source: 'plakat',
    medium: 'qr',
    campaign: 'jaro2026',
    content: 'skola4',
  },
  'skola5': {
    source: 'plakat',
    medium: 'qr',
    campaign: 'jaro2026',
    content: 'skola5',
  },
  'skola6': {
    source: 'plakat',
    medium: 'qr',
    campaign: 'jaro2026',
    content: 'skola6',
  },
  'skola7': {
    source: 'plakat',
    medium: 'qr',
    campaign: 'jaro2026',
    content: 'skola7',
  },
  'skola8': {
    source: 'plakat',
    medium: 'qr',
    campaign: 'jaro2026',
    content: 'skola8',
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const config = QR_REDIRECTS[slug]

  if (!config) {
    // Unknown slug → redirect to homepage without UTM
    return NextResponse.redirect(new URL('/', request.url))
  }

  const destination = config.destination || '/'
  const url = new URL(destination, request.url)

  url.searchParams.set('utm_source', config.source)
  url.searchParams.set('utm_medium', config.medium)
  url.searchParams.set('utm_campaign', config.campaign)
  url.searchParams.set('utm_content', config.content)

  return NextResponse.redirect(url, 302)
}
