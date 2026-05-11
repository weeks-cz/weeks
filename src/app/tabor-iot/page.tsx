import TaborIoTClient from './client'
import { getCampsForProgram } from '@/lib/camps'

export const revalidate = 300

export default async function TaborIoTPage() {
  const { confirmed, upcoming } = await getCampsForProgram('iot')
  return <TaborIoTClient confirmedTerms={confirmed} upcomingTerms={upcoming} />
}
