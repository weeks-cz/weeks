import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper blueprint-grid">
      <div className="text-center px-4">
        <h1 className="font-display text-9xl font-bold text-ink/10 mb-4">404</h1>
        <p className="mono-label mb-6">Chyba</p>
        <h2 className="font-display text-3xl font-semibold text-ink mb-4">
          Stránka nenalezena
        </h2>
        <p className="text-ink-500 mb-8 text-lg">
          Omlouváme se, ale hledaná stránka neexistuje.
        </p>
        <Link href="/" className="btn-primary">
          Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  )
}
