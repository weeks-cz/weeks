import TaborChytrychTechnologiiClient from './client'
import { getCampsForProgram } from '@/lib/camps'

export const revalidate = 300

export default async function TaborChytrychTechnologiiPage() {
  const { open, openNoLink, collectingInterest } = await getCampsForProgram('tech')

  // open + open_no_link = "registered" weekend MIX terms (rendered as cards)
  // collecting_interest = summer weekends (multi-select interest form)
  return (
    <TaborChytrychTechnologiiClient
      confirmedMixTerms={[...open, ...openNoLink]}
      summerWeekends={collectingInterest}
    />
  )
}
