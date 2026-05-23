'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { validateString } from '@/lib/validate'
import { isRedirectError } from '@/lib/redirect-guard'
import { getAuthenticatedUser, getAuthenticatedUserOptional } from '@/lib/auth'

export async function createAnnouncement(formData: FormData) {
  try {
    const { user } = await getAuthenticatedUser()
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
    if (!profile || profile.role !== 'ADMIN') throw new Error('Izin ditolak')

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const errTitle = validateString(title, 'Judul', 200)
    const errContent = validateString(content, 'Isi pengumuman', 2000)
    if (errTitle || errContent) {
      redirect(`/dashboard/admin/announcements?error=${encodeURIComponent(errTitle || errContent || '')}`)
    }

    await prisma.announcement.create({
      data: { title, content, authorId: profile.id }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/admin/announcements')
    redirect('/dashboard/admin/announcements?message=Pengumuman berhasil diterbitkan')
  } catch (err) {
    console.error('CreateAnnouncement Error:', err)
    if (isRedirectError(err)) throw err
    redirect('/dashboard/admin/announcements?error=Gagal menerbitkan pengumuman')
  }
}

export async function updateAnnouncement(formData: FormData) {
  try {
    const { user } = await getAuthenticatedUser()
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
    if (!profile || profile.role !== 'ADMIN') throw new Error('Izin ditolak')

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const errTitle = validateString(title, 'Judul', 200)
    const errContent = validateString(content, 'Isi pengumuman', 2000)
    if (errTitle || errContent) {
      redirect(`/dashboard/admin/announcements?error=${encodeURIComponent(errTitle || errContent || '')}`)
    }

    await prisma.announcement.update({
      where: { id },
      data: { title, content }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/admin/announcements')
    redirect('/dashboard/admin/announcements?message=Pengumuman berhasil diubah')
  } catch (err) {
    console.error('UpdateAnnouncement Error:', err)
    if (isRedirectError(err)) throw err
    redirect('/dashboard/admin/announcements?error=Gagal mengubah pengumuman')
  }
}

export async function deleteAnnouncement(formData: FormData) {
  try {
    const auth = await getAuthenticatedUserOptional()
    if (!auth) return
    const { user } = auth
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
    if (!profile || profile.role !== 'ADMIN') return

    const id = formData.get('id') as string
    await prisma.announcement.delete({ where: { id } })
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/admin/announcements')
  } catch (err) {
    console.error('DeleteAnnouncement Error:', err)
  }
}
