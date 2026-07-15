'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { validateString } from '@/lib/validate'
import { uploadImage, UPLOAD_ERROR_MAP } from '@/lib/upload'
import { isRedirectError } from '@/lib/redirect-guard'
import { getAuthenticatedProfile, getAuthenticatedUserOptional } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export async function respondToComplaint(formData: FormData) {
  const complaintId = formData.get('complaintId') as string

  try {
    if (!complaintId) redirect('/dashboard')

    const { user, profile } = await getAuthenticatedProfile()

    const existingComplaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { status: true, authorId: true, title: true }
    })

    if (!existingComplaint) {
      redirect(`/dashboard/complaint/${complaintId}?error=not_found`)
    }

    if (!profile || (profile.role === 'MASYARAKAT' && existingComplaint.authorId !== profile.id)) {
      redirect(`/dashboard/complaint/${complaintId}?error=forbidden`)
    }

    const content = formData.get('content') as string
    const errContent = validateString(content, 'Tanggapan', 2000)
    if (errContent) {
      redirect(`/dashboard/complaint/${complaintId}?error=${encodeURIComponent(errContent)}`)
    }

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

    await prisma.response.create({
      data: {
        content,
        imageUrl: responseImageUrl,
        complaintId,
        officerId: profile.id
      }
    })

    await createAuditLog('CREATE_RESPONSE', `Membuat tanggapan untuk laporan "${existingComplaint.title}" (${complaintId})`, profile.id)

    if (existingComplaint && existingComplaint.authorId !== profile.id) {
      await prisma.notification.create({
        data: {
          userId: existingComplaint.authorId,
          message: `Laporan Anda "${existingComplaint.title}" mendapat tanggapan baru dari ${profile.name}.`,
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
      where: { id: responseId },
      select: { id: true, complaintId: true, officerId: true }
    })
    if (!response) return { error: 'Response not found' }

    if (response.officerId !== profile.id && profile.role !== 'ADMIN') {
      await createAuditLog('DELETE_RESPONSE_FORBIDDEN', `Akses ditolak hapus tanggapan ${responseId} untuk laporan ${response.complaintId}`, profile.id)
      return { error: 'Forbidden' }
    }

    await prisma.response.delete({
      where: { id: responseId }
    })

    await createAuditLog('DELETE_RESPONSE', `Menghapus tanggapan untuk laporan ${response.complaintId}`, profile.id)

    revalidatePath(`/dashboard/complaint/${response.complaintId}`)
    return { success: true }
  } catch (err) {
    console.error('DeleteResponse Error:', err)
    return { error: 'system_error' }
  }
}

export async function editResponse(responseId: string, content: string) {
  try {
    if (!content || content.trim().length === 0) {
      return { error: 'Konten tidak boleh kosong' }
    }
    if (content.trim().length > 2000) {
      return { error: 'Konten melebihi 2000 karakter' }
    }

    const auth = await getAuthenticatedUserOptional()
    if (!auth) return { error: 'Unauthorized' }
    const { user } = auth
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true }
    })
    if (!profile) return { error: 'Profile not found' }

    const response = await prisma.response.findUnique({
      where: { id: responseId },
      select: { id: true, complaintId: true, officerId: true }
    })
    if (!response) return { error: 'Response not found' }

    if (response.officerId !== profile.id) {
      await createAuditLog('EDIT_RESPONSE_FORBIDDEN', `Akses ditolak edit tanggapan ${responseId} untuk laporan ${response.complaintId}`, profile.id)
      return { error: 'Forbidden' }
    }

    await prisma.response.update({
      where: { id: responseId },
      data: { content }
    })

    await createAuditLog('EDIT_RESPONSE', `Mengedit tanggapan untuk laporan ${response.complaintId}`, profile.id)

    revalidatePath(`/dashboard/complaint/${response.complaintId}`)
    return { success: true }
  } catch (err) {
    console.error('EditResponse Error:', err)
    return { error: 'system_error' }
  }
}
