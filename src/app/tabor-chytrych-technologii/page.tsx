import TaborChytrychTechnologiiClient from './client'
import { getCampsForProgram } from '@/lib/camps'

export const revalidate = 300

export default async function TaborChytrychTechnologiiPage() {
  const { confirmed, upcoming } = await getCampsForProgram('tech')

  // confirmed = MIX weekends with DDM registration link (open_with_link)
  // upcoming = summer/future MIX weekends with no link yet (collecting_interest)
  return (
    <TaborChytrychTechnologiiClient
      confirmedMixTerms={confirmed}
      summerWeekends={upcoming}
    />
  )
}
