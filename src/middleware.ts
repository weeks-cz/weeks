import { NextRequest, NextResponse } from 'next/server'

// Basic auth pro KV preview-on-domain.
//
// Když jsou nastaveny env vars PREVIEW_AUTH_USER + PREVIEW_AUTH_PASS, vyžadujeme basic auth
// pouze pro KV cesty (/karlovy-vary/*) a sdílený registračně-platební flow (/registrace,
// /platba, /api/register, /api/payment/*). Vše ostatní (Praha homepage, /program,
// /tabor-*, /o-nas atd.) zůstává veřejně přístupné.
//
// Až bude Comgate schválen a KV poputuje do veřejného launche, env vars se odstraní —
// middleware projde bez ověření, KV bude veřejně dostupné.

const PROTECTED_PREFIXES = [
  '/karlovy-vary',
  '/registrace',
  '/platba',
  '/api/register',
  '/api/payment',
  '/api/registration',
]

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'))
}

export function middleware(request: NextRequest) {
  const user = process.env.PREVIEW_AUTH_USER
  const pass = process.env.PREVIEW_AUTH_PASS

  // Bez env vars middleware nikdy nic nepožaduje.
  if (!user || !pass) {
    return NextResponse.next()
  }

  // Mimo chráněné cesty projdi bez ověření.
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Ověření Authorization hlavičky.
  const auth = request.headers.get('authorization')
  if (auth) {
    const [scheme, encoded] = auth.split(' ')
    if (scheme === 'Basic' && encoded) {
      try {
        const decoded = atob(encoded)
        const sepIndex = decoded.indexOf(':')
        const submittedUser = decoded.slice(0, sepIndex)
        const submittedPass = decoded.slice(sepIndex + 1)
        if (submittedUser === user && submittedPass === pass) {
          // Přidej noindex hlavičku, ať to roboti nezačnou indexovat během pre-launchu.
          const response = NextResponse.next()
          response.headers.set('X-Robots-Tag', 'noindex, nofollow')
          return response
        }
      } catch {
        // fallthrough na 401
      }
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      // Jednoduchý ASCII realm — některé prohlížeče (Edge, Chrome variants) ignorují
      // prompt dialog, pokud realm obsahuje non-ASCII znaky nebo závorky.
      'WWW-Authenticate': 'Basic realm="weeks pre-launch"',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

export const config = {
  matcher: [
    // Spouštěj middleware na všem kromě statických souborů — vlastní logika rozhodne,
    // co skutečně vyžaduje ověření.
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/cron).*)',
  ],
}
