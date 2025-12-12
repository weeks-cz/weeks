import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold text-white">Weeks</span>
            <p className="mt-4 text-gray-400 max-w-md">
              Víkendové IT tábory pro děti 10-15 let v HWLabu Praha.
              3D tisk, virtuální realita, IoT a programování.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-gray-500">Pod záštitou:</span>
              {/* TODO: Add DDM and HWLab logos */}
              <span className="text-sm font-medium text-gray-400">DDM Praha 6</span>
              <span className="text-sm font-medium text-gray-400">HWLab</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Rychlé odkazy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/program" className="hover:text-white transition-colors">
                  Program
                </Link>
              </li>
              <li>
                <Link href="/#proc-weeks" className="hover:text-white transition-colors">
                  Proč Weeks
                </Link>
              </li>
              <li>
                <Link href="/o-nas" className="hover:text-white transition-colors">
                  O nás
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Právní informace</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/gdpr" className="hover:text-white transition-colors">
                  Ochrana osobních údajů
                </Link>
              </li>
              <li>
                <Link href="/podminky" className="hover:text-white transition-colors">
                  Podmínky užití
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Weeks. Všechna práva vyhrazena.
          </p>
          <p className="text-sm text-gray-500">
            Provozovatel: DDM Praha 6
          </p>
        </div>
      </div>
    </footer>
  )
}
