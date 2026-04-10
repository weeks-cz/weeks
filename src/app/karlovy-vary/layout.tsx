import { LocationProvider } from '@/contexts/LocationContext'
import { LOCATIONS } from '@/lib/locations'

export default function KarlovyVaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider location={LOCATIONS['karlovy-vary']}>
      {children}
    </LocationProvider>
  )
}
