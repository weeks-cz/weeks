import 'server-only'
import { unstable_cache } from 'next/cache'
import { getSupabase } from './supabase'

export interface CampRow {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  location: string | null
  location_detail: string | null
  capacity: number
  enrolled_count: number
  status: 'collecting_interest' | 'open_no_link' | 'open_with_link' | 'full' | 'closed'
  registration_url: string | null
  program: string | null
  camp_type: 'weekend' | 'oneday' | null
  price: number | null
  ddm_id: string | null
  single_day_option: boolean
  day_label: string | null
  display_order: number
  web_source_id: string | null
  created_at: string
  updated_at: string
}

// Display shape consumed by the public pages — normalised for rendering.
// `id` is the stable identifier (prefers web_source_id for compatibility with
// existing analytics events that key off the old slugs).
export interface TermDisplay {
  id: string
  uuid: string
  program: string
  campType: 'weekend' | 'oneday' | null
  startDate: string
  endDate: string
  dayLabel: string | null
  status: CampRow['status']
  registrationUrl: string | null
  ddmId: string | null
  singleDayOption: boolean
  price: number | null
  capacity: number
  enrolledCount: number
  location: string | null
  locationDetail: string | null
  displayOrder: number
  // Pre-formatted Czech labels for rendering
  dateLabel: string         // "19. dubna 2026"
  dateShortLabel: string    // "19. dubna"
  weekendDateLabel: string  // "4. – 5. července" (or single day if oneday)
  fullLabel: string         // "Neděle 19. dubna"
}

const MONTHS_CS = [
  'ledna', 'února', 'března', 'dubna', 'května', 'června',
  'července', 'srpna', 'září', 'října', 'listopadu', 'prosince',
]

function parseIsoDate(iso: string): Date | null {
  if (!iso) return null
  const d = new Date(iso + 'T12:00:00')
  return Number.isNaN(d.getTime()) ? null : d
}

function formatCzechDate(iso: string, withYear = true): string {
  const d = parseIsoDate(iso)
  if (!d) return iso
  const day = d.getDate()
  const month = MONTHS_CS[d.getMonth()]
  return withYear ? `${day}. ${month} ${d.getFullYear()}` : `${day}. ${month}`
}

function formatWeekendDate(startIso: string, endIso: string): string {
  const start = parseIsoDate(startIso)
  const end = parseIsoDate(endIso)
  if (!start || !end) return formatCzechDate(startIso)
  if (start.getTime() === end.getTime()) return formatCzechDate(startIso, false)

  if (start.getMonth() === end.getMonth()) {
    // Same month: "4. – 5. července"
    return `${start.getDate()}. – ${end.getDate()}. ${MONTHS_CS[end.getMonth()]}`
  }
  // Different months: "30. května – 1. června"
  return `${start.getDate()}. ${MONTHS_CS[start.getMonth()]} – ${end.getDate()}. ${MONTHS_CS[end.getMonth()]}`
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function toDisplay(row: CampRow): TermDisplay {
  const dayLabel = row.day_label || ''
  const dateShortLabel = formatCzechDate(row.start_date, false)
  const dateLabel = formatCzechDate(row.start_date, true)
  const weekendDateLabel = row.camp_type === 'weekend'
    ? formatWeekendDate(row.start_date, row.end_date)
    : dateShortLabel
  const fullLabel = dayLabel
    ? `${capitalize(dayLabel)} ${dateShortLabel}`
    : weekendDateLabel

  return {
    id: row.web_source_id || row.id,
    uuid: row.id,
    program: row.program || '',
    campType: row.camp_type,
    startDate: row.start_date,
    endDate: row.end_date,
    dayLabel: row.day_label,
    status: row.status,
    registrationUrl: row.registration_url,
    ddmId: row.ddm_id,
    singleDayOption: row.single_day_option ?? false,
    price: row.price,
    capacity: row.capacity,
    enrolledCount: row.enrolled_count,
    location: row.location,
    locationDetail: row.location_detail,
    displayOrder: row.display_order,
    dateLabel,
    dateShortLabel,
    weekendDateLabel,
    fullLabel,
  }
}

async function fetchCampsRaw(): Promise<CampRow[]> {
  const supabase = getSupabase()
  if (!supabase) {
    console.warn('[camps] Supabase not configured — returning empty list')
    return []
  }
  const { data, error } = await supabase
    .from('camps')
    .select('*')
    .order('display_order', { ascending: true })
    .order('start_date', { ascending: true })

  if (error) {
    console.error('[camps] fetch failed', error)
    return []
  }
  return (data || []) as CampRow[]
}

// Cached version with `camps` tag so /api/revalidate can invalidate it on hub edits.
export const getCamps = unstable_cache(
  fetchCampsRaw,
  ['weeks-camps-v1'],
  { revalidate: 300, tags: ['camps'] },
)

export async function getCampsForProgram(program: string): Promise<{
  // Status buckets used by camp pages. Past terms are filtered out entirely.
  open: TermDisplay[]              // open_with_link — has a DDM URL, "Přihlásit se"
  openNoLink: TermDisplay[]        // open_no_link — confirmed but no URL yet
  collectingInterest: TermDisplay[] // collecting_interest — "Nezávazná registrace"
  full: TermDisplay[]              // full — "Plný"
  weekend: TermDisplay[]           // camp_type === 'weekend' — rendered separately (2-day special)
  // Legacy combined views for components that don't care about the distinction
  confirmed: TermDisplay[]         // open_with_link (with DDM link)
  upcoming: TermDisplay[]          // open_no_link + collecting_interest
}> {
  const rows = await getCamps()
  const today = new Date().toISOString().slice(0, 10)

  const filtered = rows
    .filter(r => r.program === program && r.end_date >= today && r.status !== 'closed')
    .map(toDisplay)

  const open: TermDisplay[] = []
  const openNoLink: TermDisplay[] = []
  const collectingInterest: TermDisplay[] = []
  const full: TermDisplay[] = []
  const weekend: TermDisplay[] = []

  for (const term of filtered) {
    if (term.campType === 'weekend') { weekend.push(term); continue }
    if (term.status === 'full') full.push(term)
    else if (term.status === 'open_with_link' && term.registrationUrl) open.push(term)
    else if (term.status === 'open_no_link') openNoLink.push(term)
    else collectingInterest.push(term)
  }

  return {
    open, openNoLink, collectingInterest, full, weekend,
    confirmed: open,
    upcoming: [...openNoLink, ...collectingInterest],
  }
}

// Fetch the nearest upcoming term for each program (for homepage cards).
// Returns the soonest open or collecting_interest camp per program.
export async function getNearestTermsByProgram(): Promise<Record<string, TermDisplay | null>> {
  const rows = await getCamps()
  const today = new Date().toISOString().slice(0, 10)
  const result: Record<string, TermDisplay | null> = {}

  for (const program of ['3d-tisk', 'iot', 'tech']) {
    const nearest = rows
      .filter(r => r.program === program && r.end_date >= today
        && r.status !== 'closed' && r.status !== 'full')
      .sort((a, b) => a.start_date.localeCompare(b.start_date))[0]
    result[program] = nearest ? toDisplay(nearest) : null
  }

  return result
}

// Returns all open + open_no_link terms across all programs, sorted by date.
// Used by the homepage "Nejbližší termíny" section.
export async function getAllUpcomingTerms(): Promise<TermDisplay[]> {
  const rows = await getCamps()
  const today = new Date().toISOString().slice(0, 10)

  return rows
    .filter(r => r.end_date >= today
      && (r.status === 'open_with_link' || r.status === 'open_no_link'))
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .map(toDisplay)
}

export { fetchCampsRaw }
