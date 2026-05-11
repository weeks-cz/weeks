import Tabor3DTiskClient from './client'
import { getCampsForProgram } from '@/lib/camps'

export const revalidate = 300

export default async function Tabor3DTiskPage() {
  const { confirmed, upcoming } = await getCampsForProgram('3d-tisk')
  return <Tabor3DTiskClient confirmedTerms={confirmed} upcomingTerms={upcoming} />
}
