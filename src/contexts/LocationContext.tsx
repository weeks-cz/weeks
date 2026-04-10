'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { type Location, DEFAULT_LOCATION } from '@/lib/locations'

const LocationContext = createContext<Location>(DEFAULT_LOCATION)

export function LocationProvider({ location, children }: { location: Location; children: ReactNode }) {
  return <LocationContext.Provider value={location}>{children}</LocationContext.Provider>
}

export function useLocation(): Location {
  return useContext(LocationContext)
}
