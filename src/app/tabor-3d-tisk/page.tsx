import Tabor3DTiskClient from './client'
import { getCampsForProgram } from '@/lib/camps'

export const revalidate = 300

export default async function Tabor3DTiskPage() {
  const { open, openNoLink, collectingInterest, full, weekend } = await getCampsForProgram('3d-tisk')
  return (
    <Tabor3DTiskClient
      open={open}
      openNoLink={openNoLink}
      collectingInterest={collectingInterest}
      full={full}
      weekend={weekend}
    />
  )
}
