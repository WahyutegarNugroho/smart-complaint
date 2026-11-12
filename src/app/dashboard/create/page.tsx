import { redirect } from 'next/navigation'
import { getCachedProfile } from '@/lib/profile'
import { getCategoriesWithChildren } from '@/lib/dal'
import CreateComplaintForm from './CreateComplaintForm'
import SessionErrorState from '@/components/dashboard/SessionErrorState'
import ErrorToast from '@/components/ErrorToast'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CreateComplaintPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const data = await getCachedProfile()
  
  if (data.status === 'UNAUTHENTICATED') return redirect('/login')
  if (data.status === 'ERROR' || !data.profile) return <SessionErrorState />
  
  const { profile } = data
  const categories = await getCategoriesWithChildren()

  return (
    <>
      {error && <ErrorToast message={error} />}
      <CreateComplaintForm profile={profile} categories={categories} />
    </>
  )
}
