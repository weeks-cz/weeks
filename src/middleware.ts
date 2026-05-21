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

  // HTML body s no-store cache. Firefox v některých konfiguracích neukáže basic auth
  // dialog, pokud 401 response má text/plain content-type nebo cacheovatelné headers —
  // request pak visí v "Waiting for server" stavu donekonečna. HTML response to fixuje.
  const html = `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8"><title>Weeks — autentizace</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 32rem; margin: 4rem auto; padding: 0 1rem; color: #111;">
  <h1 style="font-size: 1.25rem;">Weeks — pre-launch</h1>
  <p>Tato část webu je v přípravě a vyžaduje přístupové údaje.</p>
  <p>Pokud vidíte tuto stránku místo přihlašovacího dialogu, otevřete URL znovu nebo použijte odkaz s vloženými údaji od organizátora.</p>
</body>
</html>`
  return new NextResponse(html, {
    status: 401,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'WWW-Authenticate': 'Basic realm="weeks pre-launch"',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store, must-revalidate',
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
