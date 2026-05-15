import { redirect } from 'next/navigation'
import { getCachedProfile } from '@/lib/profile'
import CreateComplaintForm from './CreateComplaintForm'
import SessionErrorState from '@/components/dashboard/SessionErrorState'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CreateComplaintPage() {
  const data = await getCachedProfile()
  
  if (data.status === 'UNAUTHENTICATED') return redirect('/login')
  if (data.status === 'ERROR' || !data.profile) return <SessionErrorState />
  
  const { profile } = data

  return <CreateComplaintForm profile={profile} />
}
