'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { validateString } from '@/lib/validate'
import { isNextControlFlowError, logServerError, mapPrismaError } from '@/lib/errors'
import { getAuthenticatedUser, getAuthenticatedUserOptional } from '@/lib/auth'
import { requireAdmin } from '@/lib/authorization'
import { createAuditLog } from '@/lib/audit'

export type AnnouncementFormState = {
  error?: string
} | null

export async function createAnnouncement(
  _prevState: AnnouncementFormState,
  formData: FormData
): Promise<AnnouncementFormState> {
  try {
    const { user } = await getAuthenticatedUser()
    const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { id: true, role: true } })
    requireAdmin(profile)

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const category = (formData.get('category') as string) || 'umum'
    const errTitle = validateString(title, 'Judul', 200)
    const errContent = validateString(content, 'Isi pengumuman', 2000)
    if (errTitle || errContent) {
      return { error: errTitle || errContent || 'Input tidak valid.' }
    }

    await prisma.announcement.create({
      data: { title, content, category, authorId: profile.id }
    })

    await createAuditLog('CREATE_ANNOUNCEMENT', `Membuat pengumuman "${title}"`, profile.id)

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/admin/announcements')
    redirect('/dashboard/admin/announcements?message=Pengumuman berhasil diterbitkan')
  } catch (err) {
    if (isNextControlFlowError(err)) throw err
    logServerError('actions.createAnnouncement', err)
    return { error: mapPrismaError(err).userMessage }
  }
}

export async function updateAnnouncement(
  _prevState: AnnouncementFormState,
  formData: FormData
): Promise<AnnouncementFormState> {
  try {
    const { user } = await getAuthenticatedUser()
    const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { id: true, role: true } })
    requireAdmin(profile)

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const category = (formData.get('category') as string) || 'umum'
    const errTitle = validateString(title, 'Judul', 200)
    const errContent = validateString(content, 'Isi pengumuman', 2000)
    if (errTitle || errContent) {
      return { error: errTitle || errContent || 'Input tidak valid.' }
    }

    await prisma.announcement.update({
      where: { id },
      data: { title, content, category }
    })

    await createAuditLog('UPDATE_ANNOUNCEMENT', `Mengubah pengumuman "${title}" (${id})`, profile.id)

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/admin/announcements')
    redirect('/dashboard/admin/announcements?message=Pengumuman berhasil diubah')
  } catch (err) {
    if (isNextControlFlowError(err)) throw err
    logServerError('actions.updateAnnouncement', err)
    return { error: mapPrismaError(err).userMessage }
  }
}

export async function deleteAnnouncement(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await getAuthenticatedUserOptional()
    if (!auth) return { success: false, error: 'Sesi Anda telah berakhir. Silakan masuk ulang.' }
    const { user } = auth
    const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { id: true, role: true } })
    if (!profile || profile.role !== 'ADMIN') return redirect('/dashboard?error=forbidden')

    const id = formData.get('id') as string
    if (!id) return { success: false, error: 'ID pengumuman tidak valid.' }

    await prisma.announcement.delete({ where: { id } })

    await createAuditLog('DELETE_ANNOUNCEMENT', `Menghapus pengumuman (${id})`, profile.id)

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/admin/announcements')
    return { success: true }
  } catch (err) {
    if (isNextControlFlowError(err)) throw err
    logServerError('actions.deleteAnnouncement', err)
    return { success: false, error: mapPrismaError(err).userMessage }
  }
}
