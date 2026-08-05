'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { validateEnum } from '@/lib/validate'
import { resetEscalation } from '@/lib/escalation'
import { isRedirectError } from '@/lib/redirect-guard'
import { STATUS_LABELS } from '@/lib/constants'
import { requireStaff } from '@/lib/role-guard'
import { createAuditLog } from '@/lib/audit'


export async function toggleUrgentStatus(formData: FormData) {
  let complaintId = ''
  try {
    const { profile } = await requireStaff()

    complaintId = formData.get('id') as string
    const isUrgent = formData.get('isUrgent') === 'true'

    await prisma.complaint.update({
      where: { id: complaintId },
      data: { isUrgent: !isUrgent }
    })

    await createAuditLog('TOGGLE_URGENT', `Mengubah urgensi laporan ${complaintId} menjadi ${!isUrgent ? 'URGENT' : 'NORMAL'}`, profile.id)

    revalidatePath(`/dashboard/complaint/${complaintId}`)
    revalidatePath('/dashboard')
  } catch (err) {
    console.error('ToggleUrgentStatus Error:', err)
    if (isRedirectError(err)) throw err
    if (complaintId) redirect(`/dashboard/complaint/${complaintId}?error=Gagal mengubah status urgensi`)
    redirect('/dashboard?error=Gagal mengubah status urgensi')
  }
}

export async function updateComplaintStatus(formData: FormData) {
  let id = ''
  try {
    const { profile } = await requireStaff()

    id = formData.get('id') as string
    const rawStatus = formData.get('status') as string
    const status = validateEnum(rawStatus, ['PENDING', 'PROCESSING', 'COMPLETED'] as const)
    if (!status) throw new Error('Status tidak valid')

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { status },
      select: { authorId: true, title: true }
    })

    if (status === 'COMPLETED' || status === 'PROCESSING') {
      await resetEscalation(id)
    }

    const statusText = (STATUS_LABELS[status] || 'Menunggu').toUpperCase()

    await createAuditLog('UPDATE_STATUS', `Mengubah status laporan "${updatedComplaint.title}" (${id}) dari lama menjadi ${statusText}`, profile.id)

    await prisma.notification.create({
      data: {
        userId: updatedComplaint.authorId,
        message: `Status laporan Anda "${updatedComplaint.title}" kini telah diubah menjadi ${statusText}.`,
        type: 'INFO'
      }
    })

    revalidatePath(`/dashboard/complaint/${id}`)
    revalidatePath('/dashboard')
  } catch (err) {
    console.error('UpdateComplaintStatus Error:', err)
    if (id) redirect(`/dashboard/complaint/${id}?error=Gagal mengubah status`)
    redirect('/dashboard?error=Gagal mengubah status')
  }
}
