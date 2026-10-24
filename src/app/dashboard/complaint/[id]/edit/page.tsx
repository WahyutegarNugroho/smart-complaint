import { redirect } from 'next/navigation'
import { getComplaintForEdit } from '@/lib/dal'
import { getCachedProfile } from '@/lib/profile'
import EditComplaintForm from './EditComplaintForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditComplaintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getCachedProfile()
  
  if (data.status === 'UNAUTHENTICATED' || !data.profile) {
    return redirect('/login')
  }

  const result = await getComplaintForEdit(id, data.profile.id)

  if (result.status === 'NOT_FOUND') {
    return redirect('/dashboard')
  }

  if (result.status === 'FORBIDDEN') {
    return redirect(`/dashboard/complaint/${id}?error=forbidden`)
  }

  if (result.status === 'ALREADY_PROCESSED' || !result.complaint) {
    return redirect(`/dashboard/complaint/${id}?error=already_processed`)
  }

  return <EditComplaintForm complaint={result.complaint} id={id} />
}
