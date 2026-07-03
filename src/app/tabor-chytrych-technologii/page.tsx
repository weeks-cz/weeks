import TaborChytrychTechnologiiClient from './client'
import { getCampsForProgram } from '@/lib/camps'

export const revalidate = 300

export default async function TaborChytrychTechnologiiPage() {
  const { open, openNoLink } = await getCampsForProgram('tech')

  // open + open_no_link = "registered" weekend MIX terms (rendered as cards)
  return (
    <TaborChytrychTechnologiiClient
      confirmedMixTerms={[...open, ...openNoLink]}
    />
  )
}
