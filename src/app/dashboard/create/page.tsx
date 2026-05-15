import { redirect } from 'next/navigation'
import { getCachedProfile } from '@/lib/profile'
import CreateComplaintForm from './CreateComplaintForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CreateComplaintPage() {
  const data = await getCachedProfile()
  if (!data) redirect('/login')
  
  const { profile } = data

  return <CreateComplaintForm profile={profile} />
}
