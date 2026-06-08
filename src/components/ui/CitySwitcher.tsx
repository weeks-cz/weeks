'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'
import { getAllLocations, getEquivalentPath, type Location } from '@/lib/locations'
import { useLocation } from '@/contexts/LocationContext'

export function CitySwitcher({ compact = false }: { compact?: boolean }) {
  const location = useLocation()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const allLocations = getAllLocations()

  // Zavření přes Escape, když je menu otevřené.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  function handleSwitch(target: Location) {
    const newPath = getEquivalentPath(pathname, target)
    // Full page reload (ne Next.js router) — basic auth dialog se zobrazí pouze
    // při top-level navigation. Client-side router.push() by spustil RSC fetch,
    // který by se na 401 zasekl bez dialogu.
    window.location.href = newPath
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center font-medium text-slate-700 hover:text-primary-600 rounded-full border border-slate-200 hover:border-primary-300 transition-colors bg-white/90 backdrop-blur-sm shadow-sm ${
          compact ? 'gap-1 px-2.5 py-1 text-xs' : 'gap-1.5 px-3 py-1.5 text-sm'
        }`}
        aria-label={`Město: ${location.name}. Klikněte pro změnu.`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span className={compact ? 'truncate max-w-[110px]' : ''}>{location.name}</span>
        <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div role="menu" className="absolute top-full mt-1 right-0 z-50 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[160px]">
            {allLocations.map((loc) => (
              <button
                key={loc.id}
                role="menuitem"
                aria-current={loc.id === location.id ? 'true' : undefined}
                onClick={() => handleSwitch(loc)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                  loc.id === location.id ? 'text-primary-600 font-medium bg-primary-50' : 'text-slate-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                {loc.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
