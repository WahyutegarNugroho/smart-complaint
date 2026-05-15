import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
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

  const { profile } = data

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: { author: true }
  })

  if (!complaint) {
    return redirect('/dashboard')
  }

  // 🛡️ SECURITY: Only author can edit their own complaint
  // Staff should use the detail page for moderation
  if (complaint.authorId !== profile.id) {
    return redirect(`/dashboard/complaint/${id}?error=forbidden`)
  }

  // Only allow editing if status is PENDING
  if (complaint.status !== 'PENDING') {
    return redirect(`/dashboard/complaint/${id}?error=already_processed`)
  }

  return <EditComplaintForm complaint={complaint} id={id} />
}
