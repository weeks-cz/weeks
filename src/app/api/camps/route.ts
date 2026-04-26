import { NextResponse } from 'next/server'
import { scrapeDDMCapacity, DDM_TERMS } from '@/lib/ddm-scraper'

// All camp data consolidated from individual camp pages
// This is the single source of truth for weeks-hub sync

interface CampTerm {
  id: string
  title: string
  campType: 'weekend' | 'oneday'
  program: string
  startDate: string  // ISO date YYYY-MM-DD
  endDate: string    // ISO date YYYY-MM-DD
  location: string
  locationDetail: string
  capacity: number
  spotsLeft: number | null  // null = unknown (no DDM link yet)
  enrolledCount: number | null
  status: 'collecting_interest' | 'open_no_link' | 'open_with_link' | 'full' | 'closed'
  registrationUrl: string | null
  price: number
  ddmId: string | null
}

// Weekend camps - Tábor chytrých technologií
const weekendCamps: CampTerm[] = []

// One-day camps - 3D tisk
const camps3dTisk: CampTerm[] = [
  {
    id: '3d-775',
    title: 'Jednodenní tábor 3D tisku',
    campType: 'oneday',
    program: '3d-tisk',
    startDate: '2026-04-19',
    endDate: '2026-04-19',
    location: 'HWLab Praha',
    locationDetail: 'Kongresové centrum Praha, 5. května 11, Praha 4',
    capacity: 15,
    spotsLeft: null,
    enrolledCount: null,
    status: 'open_with_link',
    registrationUrl: 'https://www.ddmp6.cz/tabory/?id=775',
    price: 1490,
    ddmId: '775',
  },
  {
    id: '3d-25-04',
    title: 'Jednodenní tábor 3D tisku',
    campType: 'oneday',
    program: '3d-tisk',
    startDate: '2026-04-25',
    endDate: '2026-04-25',
    location: 'HWLab Praha',
    locationDetail: 'Kongresové centrum Praha, 5. května 11, Praha 4',
    capacity: 15,
    spotsLeft: null,
    enrolledCount: null,
    status: 'collecting_interest',
    registrationUrl: null,
    price: 1490,
    ddmId: null,
  },
  {
    id: '3d-03-05',
    title: 'Jednodenní tábor 3D tisku',
    campType: 'oneday',
    program: '3d-tisk',
    startDate: '2026-05-03',
    endDate: '2026-05-03',
    location: 'HWLab Praha',
    locationDetail: 'Kongresové centrum Praha, 5. května 11, Praha 4',
    capacity: 15,
    spotsLeft: null,
    enrolledCount: null,
    status: 'collecting_interest',
    registrationUrl: null,
    price: 1490,
    ddmId: null,
  },
  {
    id: '3d-09-05',
    title: 'Jednodenní tábor 3D tisku',
    campType: 'oneday',
    program: '3d-tisk',
    startDate: '2026-05-09',
    endDate: '2026-05-09',
    location: 'HWLab Praha',
    locationDetail: 'Kongresové centrum Praha, 5. května 11, Praha 4',
    capacity: 15,
    spotsLeft: null,
    enrolledCount: null,
    status: 'collecting_interest',
    registrationUrl: null,
    price: 1490,
    ddmId: null,
  },
  {
    id: '3d-786',
    title: 'Jednodenní tábor 3D tisku',
    campType: 'oneday',
    program: '3d-tisk',
    startDate: '2026-05-16',
    endDate: '2026-05-16',
    location: 'HWLab Praha',
    locationDetail: 'Kongresové centrum Praha, 5. května 11, Praha 4',
    capacity: 15,
    spotsLeft: null,
    enrolledCount: null,
    status: 'open_with_link',
    registrationUrl: 'https://www.ddmp6.cz/tabory/?id=786',
    price: 1490,
    ddmId: '786',
  },
]

// One-day camps - IoT & elektronika
const campsIot: CampTerm[] = [
  {
    id: 'iot-773',
    title: 'Jednodenní tábor IoT & elektroniky',
    campType: 'oneday',
    program: 'iot',
    startDate: '2026-04-18',
    endDate: '2026-04-18',
    location: 'HWLab Praha',
    locationDetail: 'Kongresové centrum Praha, 5. května 11, Praha 4',
    capacity: 15,
    spotsLeft: null,
    enrolledCount: null,
    status: 'open_with_link',
    registrationUrl: 'https://www.ddmp6.cz/tabory/?id=773',
    price: 1490,
    ddmId: '773',
  },
  {
    id: 'iot-26-04',
    title: 'Jednodenní tábor IoT & elektroniky',
    campType: 'oneday',
    program: 'iot',
    startDate: '2026-04-26',
    endDate: '2026-04-26',
    location: 'HWLab Praha',
    locationDetail: 'Kongresové centrum Praha, 5. května 11, Praha 4',
    capacity: 15,
    spotsLeft: null,
    enrolledCount: null,
    status: 'collecting_interest',
    registrationUrl: null,
    price: 1490,
    ddmId: null,
  },
  {
    id: 'iot-02-05',
    title: 'Jednodenní tábor IoT & elektroniky',
    campType: 'oneday',
    program: 'iot',
    startDate: '2026-05-02',
    endDate: '2026-05-02',
    location: 'HWLab Praha',
    locationDetail: 'Kongresové centrum Praha, 5. května 11, Praha 4',
    capacity: 15,
    spotsLeft: null,
    enrolledCount: null,
    status: 'collecting_interest',
    registrationUrl: null,
    price: 1490,
    ddmId: null,
  },
  {
    id: 'iot-10-05',
    title: 'Jednodenní tábor IoT & elektroniky',
    campType: 'oneday',
    program: 'iot',
    startDate: '2026-05-10',
    endDate: '2026-05-10',
    location: 'HWLab Praha',
    locationDetail: 'Kongresové centrum Praha, 5. května 11, Praha 4',
    capacity: 15,
    spotsLeft: null,
    enrolledCount: null,
    status: 'collecting_interest',
    registrationUrl: null,
    price: 1490,
    ddmId: null,
  },
  {
    id: 'iot-787',
    title: 'Jednodenní tábor IoT & elektroniky',
    campType: 'oneday',
    program: 'iot',
    startDate: '2026-05-17',
    endDate: '2026-05-17',
    location: 'HWLab Praha',
    locationDetail: 'Kongresové centrum Praha, 5. května 11, Praha 4',
    capacity: 15,
    spotsLeft: null,
    enrolledCount: null,
    status: 'open_with_link',
    registrationUrl: 'https://www.ddmp6.cz/tabory/?id=787',
    price: 1490,
    ddmId: '787',
  },
]

// Summer weekends - collecting interest
const summerCamps: CampTerm[] = [
  { id: 'leto-04-07', title: 'Letní víkendový tábor', campType: 'weekend', program: 'tech', startDate: '2026-07-04', endDate: '2026-07-05', location: 'TBD', locationDetail: '', capacity: 15, spotsLeft: null, enrolledCount: null, status: 'collecting_interest', registrationUrl: null, price: 2990, ddmId: null },
  { id: 'leto-11-07', title: 'Letní víkendový tábor', campType: 'weekend', program: 'tech', startDate: '2026-07-11', endDate: '2026-07-12', location: 'TBD', locationDetail: '', capacity: 15, spotsLeft: null, enrolledCount: null, status: 'collecting_interest', registrationUrl: null, price: 2990, ddmId: null },
  { id: 'leto-18-07', title: 'Letní víkendový tábor', campType: 'weekend', program: 'tech', startDate: '2026-07-18', endDate: '2026-07-19', location: 'TBD', locationDetail: '', capacity: 15, spotsLeft: null, enrolledCount: null, status: 'collecting_interest', registrationUrl: null, price: 2990, ddmId: null },
  { id: 'leto-25-07', title: 'Letní víkendový tábor', campType: 'weekend', program: 'tech', startDate: '2026-07-25', endDate: '2026-07-26', location: 'TBD', locationDetail: '', capacity: 15, spotsLeft: null, enrolledCount: null, status: 'collecting_interest', registrationUrl: null, price: 2990, ddmId: null },
  { id: 'leto-01-08', title: 'Letní víkendový tábor', campType: 'weekend', program: 'tech', startDate: '2026-08-01', endDate: '2026-08-02', location: 'TBD', locationDetail: '', capacity: 15, spotsLeft: null, enrolledCount: null, status: 'collecting_interest', registrationUrl: null, price: 2990, ddmId: null },
  { id: 'leto-08-08', title: 'Letní víkendový tábor', campType: 'weekend', program: 'tech', startDate: '2026-08-08', endDate: '2026-08-09', location: 'TBD', locationDetail: '', capacity: 15, spotsLeft: null, enrolledCount: null, status: 'collecting_interest', registrationUrl: null, price: 2990, ddmId: null },
  { id: 'leto-29-08', title: 'Letní víkendový tábor', campType: 'weekend', program: 'tech', startDate: '2026-08-29', endDate: '2026-08-30', location: 'TBD', locationDetail: '', capacity: 15, spotsLeft: null, enrolledCount: null, status: 'collecting_interest', registrationUrl: null, price: 2990, ddmId: null },
]

const ALL_CAMPS: CampTerm[] = [...weekendCamps, ...camps3dTisk, ...campsIot, ...summerCamps]

export async function GET() {
  // Enrich with live DDM capacity data where available
  const ddmIds = ALL_CAMPS.filter(c => c.ddmId).map(c => c.ddmId!)
  const capacityData: Record<string, { spotsLeft: number; maxCapacity: number }> = {}

  await Promise.all(
    [...new Set(ddmIds)].map(async (ddmId) => {
      const data = await scrapeDDMCapacity(ddmId)
      if (data) capacityData[ddmId] = data
    })
  )

  const enriched = ALL_CAMPS.map(camp => {
    if (camp.ddmId && capacityData[camp.ddmId]) {
      const live = capacityData[camp.ddmId]
      const enrolled = live.maxCapacity - live.spotsLeft
      return {
        ...camp,
        capacity: live.maxCapacity,
        spotsLeft: live.spotsLeft,
        enrolledCount: enrolled,
        status: live.spotsLeft <= 0 ? 'full' as const : camp.status,
      }
    }
    return camp
  })

  return NextResponse.json(
    { camps: enriched, timestamp: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
