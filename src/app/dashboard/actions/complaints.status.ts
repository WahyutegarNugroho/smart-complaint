'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { validateEnum } from '@/lib/validate'
import { resetEscalation } from '@/lib/escalation'
import { isNextControlFlowError, logServerError, mapPrismaError } from '@/lib/errors'
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
    if (isNextControlFlowError(err)) throw err
    logServerError('actions.toggleUrgentStatus', err, { complaintId })
    const msg = mapPrismaError(err).code === 'NOT_FOUND' ? 'not_found' : 'Gagal mengubah status urgensi'
    if (complaintId) redirect(`/dashboard/complaint/${complaintId}?error=${encodeURIComponent(msg)}`)
    redirect(`/dashboard?error=${encodeURIComponent(msg)}`)
  }
}

export async function updateComplaintStatus(formData: FormData) {
  let id = ''
  try {
    const { profile } = await requireStaff()

    id = formData.get('id') as string
    const rawStatus = formData.get('status') as string
    const status = validateEnum(rawStatus, ['PENDING', 'PROCESSING', 'COMPLETED'] as const)
    if (!status) {
      if (id) redirect(`/dashboard/complaint/${id}?error=invalid_input`)
      redirect('/dashboard?error=invalid_input')
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { status },
      select: { authorId: true, title: true }
    })

    if (status === 'COMPLETED' || status === 'PROCESSING') {
      await resetEscalation(id)
    }

    const statusText = (STATUS_LABELS[status] || 'Menunggu').toUpperCase()

    await createAuditLog('UPDATE_STATUS', `Mengubah status laporan "${updatedComplaint.title}" (${id}) menjadi ${statusText}`, profile.id)

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
    if (isNextControlFlowError(err)) throw err
    logServerError('actions.updateComplaintStatus', err, { complaintId: id })
    const mapped = mapPrismaError(err)
    if (mapped.code === 'NOT_FOUND') {
      redirect('/dashboard?error=not_found')
    }
    if (id) redirect(`/dashboard/complaint/${id}?error=${encodeURIComponent(mapped.userMessage)}`)
    redirect(`/dashboard?error=${encodeURIComponent(mapped.userMessage)}`)
  }
}
