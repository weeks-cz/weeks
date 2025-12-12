import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Stránka nenalezena
        </h2>
        <p className="text-gray-600 mb-8">
          Omlouváme se, ale hledaná stránka neexistuje.
        </p>
        <Link href="/" className="btn-primary">
          Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  )
}
