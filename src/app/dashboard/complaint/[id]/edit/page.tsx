import { redirect, notFound, forbidden } from 'next/navigation'
import { getComplaintForEdit } from '@/lib/dal'
import { getCachedProfile } from '@/lib/profile'
import EditComplaintForm from './EditComplaintForm'
import SectionErrorFallback from '@/components/SectionErrorFallback'
import ErrorToast from '@/components/ErrorToast'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditComplaintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error: errorMessage } = await searchParams
  const data = await getCachedProfile()
  
  if (data.status === 'UNAUTHENTICATED' || !data.profile) {
    return redirect('/login')
  }

  const result = await getComplaintForEdit(id, data.profile.id)

  if (result.status === 'NOT_FOUND') {
    notFound()
  }

  if (result.status === 'FORBIDDEN') {
    forbidden()
  }

  if (result.status === 'ERROR') {
    return (
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <SectionErrorFallback title="Gagal Memuat Data Edit" />
      </main>
    )
  }

  if (result.status === 'ALREADY_PROCESSED' || !result.complaint) {
    return redirect(`/dashboard/complaint/${id}?error=already_processed`)
  }

  return (
    <>
      {errorMessage && <ErrorToast key={errorMessage} message={errorMessage} />}
      <EditComplaintForm complaint={result.complaint} id={id} />
    </>
  )
}
