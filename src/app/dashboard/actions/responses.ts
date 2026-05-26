'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { validateString, validateEnum } from '@/lib/validate'
import { resetEscalation } from '@/lib/escalation'
import { uploadImage, UPLOAD_ERROR_MAP } from '@/lib/upload'
import { isRedirectError } from '@/lib/redirect-guard'
import { STATUS_LABELS } from '@/lib/constants'
import { getAuthenticatedProfile, getAuthenticatedUserOptional } from '@/lib/auth'

export async function respondToComplaint(formData: FormData) {
  const complaintId = formData.get('complaintId') as string

  try {
    if (!complaintId) redirect('/dashboard')

    const { user, profile } = await getAuthenticatedProfile()

    const existingComplaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { status: true, authorId: true, title: true }
    })

    if (!profile || (profile.role === 'MASYARAKAT' && existingComplaint?.authorId !== profile.id)) {
      redirect(`/dashboard/complaint/${complaintId}?error=forbidden`)
    }

    const content = formData.get('content') as string
    const errContent = validateString(content, 'Tanggapan', 2000)
    if (errContent) {
      redirect(`/dashboard/complaint/${complaintId}?error=${encodeURIComponent(errContent)}`)
    }

    const status = formData.get('status') as 'PENDING' | 'PROCESSING' | 'COMPLETED'
    const validStatus = validateEnum(status, ['PENDING', 'PROCESSING', 'COMPLETED'] as const)
    const imageFile = formData.get('responseImage') as File | null
    let responseImageUrl = null

    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      const result = await uploadImage(imageFile, user.id, 'res')
      if (result.success) {
        responseImageUrl = result.url
      } else {
        redirect(`/dashboard/complaint/${complaintId}?error=${encodeURIComponent(UPLOAD_ERROR_MAP[result.error])}`)
      }
    }

    let statusChanged = false
    if (validStatus && validStatus !== existingComplaint?.status && profile.role !== 'MASYARAKAT') {
      statusChanged = true
    }

    await prisma.response.create({
      data: {
        content,
        imageUrl: responseImageUrl,
        complaintId,
        officerId: profile.id
      }
    })

    if (validStatus && profile.role !== 'MASYARAKAT') {
      try {
        await prisma.complaint.update({
          where: { id: complaintId },
          data: { status: validStatus }
        })
        if (validStatus === 'COMPLETED' || validStatus === 'PROCESSING') {
          await resetEscalation(complaintId)
        }
      } catch (statusErr) {
        console.error('Non-critical Status Update Error:', statusErr)
      }
    }

    if (existingComplaint && existingComplaint.authorId !== profile.id) {
      const statusText = (STATUS_LABELS[validStatus as keyof typeof STATUS_LABELS] || 'Menunggu').toUpperCase()
      const message = statusChanged
        ? `Laporan Anda "${existingComplaint.title}" mendapat tanggapan baru dari ${profile.name} dan statusnya diubah menjadi ${statusText}.`
        : `Laporan Anda "${existingComplaint.title}" mendapat tanggapan baru dari ${profile.name}.`

      await prisma.notification.create({
        data: {
          userId: existingComplaint.authorId,
          message,
          type: 'INFO'
        }
      })
    }

    revalidatePath(`/dashboard/complaint/${complaintId}`)
    revalidatePath('/dashboard')
    redirect(`/dashboard/complaint/${complaintId}?message=Tanggapan berhasil dikirim`)
  } catch (err) {
    console.error('RespondToComplaint Error:', err)
    if (isRedirectError(err)) throw err
    redirect(`/dashboard/complaint/${complaintId}?error=system_error`)
  }
}

export async function deleteResponse(responseId: string) {
  try {
    const auth = await getAuthenticatedUserOptional()
    if (!auth) return { error: 'Unauthorized' }
    const { user } = auth
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true, role: true }
    })
    if (!profile) return { error: 'Profile not found' }

    const response = await prisma.response.findUnique({
      where: { id: responseId }
    })
    if (!response) return { error: 'Response not found' }

    if (response.officerId !== profile.id && profile.role !== 'ADMIN') {
      return { error: 'Forbidden' }
    }

    await prisma.response.delete({
      where: { id: responseId }
    })

    revalidatePath(`/dashboard/complaint/${response.complaintId}`)
    return { success: true }
  } catch (err) {
    console.error('DeleteResponse Error:', err)
    return { error: 'system_error' }
  }
}

export async function editResponse(responseId: string, content: string) {
  try {
    const auth = await getAuthenticatedUserOptional()
    if (!auth) return { error: 'Unauthorized' }
    const { user } = auth
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true }
    })
    if (!profile) return { error: 'Profile not found' }

    const response = await prisma.response.findUnique({
      where: { id: responseId }
    })
    if (!response) return { error: 'Response not found' }

    if (response.officerId !== profile.id) {
      return { error: 'Forbidden' }
    }

    await prisma.response.update({
      where: { id: responseId },
      data: { content }
    })

    revalidatePath(`/dashboard/complaint/${response.complaintId}`)
    return { success: true }
  } catch (err) {
    console.error('EditResponse Error:', err)
    return { error: 'system_error' }
  }
}
