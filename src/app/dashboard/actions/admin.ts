'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'
import { getAuthenticatedUserOptional } from '@/lib/auth'

export async function adminDeleteComplaint(formData: FormData) {
  let success = false
  try {
    const auth = await getAuthenticatedUserOptional()
    if (!auth) return
    const { user } = auth
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } })
    if (!profile || profile.role !== 'ADMIN') return

    const id = formData.get('id') as string
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: { author: true }
    })

    if (!complaint) return

    await prisma.notification.create({
      data: {
        userId: complaint.authorId,
        message: `Laporan Anda yang berjudul "${complaint.title}" telah dihapus oleh Admin karena melanggar ketentuan/spam.`,
        type: 'DELETE'
      }
    })

    await prisma.complaint.delete({ where: { id } })

    revalidatePath('/dashboard')
    success = true

    await createAuditLog('DELETE_REPORT', `Menghapus laporan "${complaint.title}" milik ${complaint.author?.name || 'Anonim'}`)
  } catch (err) {
    console.error('AdminDeleteComplaint Error:', err)
  }
  redirect(success
    ? '/dashboard?message=Laporan telah dihapus dan warga diberi tahu'
    : '/dashboard?error=Gagal menghapus laporan')
}
