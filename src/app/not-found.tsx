import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-night">
      <div className="text-center">
        <h1 className="font-display text-8xl font-bold text-gradient mb-4">404</h1>
        <h2 className="heading-2 text-white mb-4">
          Stránka nenalezena
        </h2>
        <p className="text-slate-300 mb-8">
          Omlouváme se, ale hledaná stránka neexistuje.
        </p>
        <Link href="/" className="btn-primary">
          Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  )
}
