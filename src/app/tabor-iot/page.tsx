import TaborIoTClient from './client'
import { getCampsForProgram } from '@/lib/camps'

export const revalidate = 300

export default async function TaborIoTPage() {
  const { open, openNoLink, collectingInterest, full } = await getCampsForProgram('iot')
  return (
    <TaborIoTClient
      open={open}
      openNoLink={openNoLink}
      collectingInterest={collectingInterest}
      full={full}
    />
  )
}
