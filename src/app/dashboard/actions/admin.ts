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
    if (!auth) return redirect('/login')
    const { user } = auth
    const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { id: true, role: true } })
    if (!profile || profile.role !== 'ADMIN') return redirect('/dashboard?error=forbidden')

    const id = formData.get('id') as string
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      select: { title: true, authorId: true, author: { select: { name: true } } }
    })

    if (!complaint) return redirect('/dashboard?error=not_found')

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

    await createAuditLog('DELETE_REPORT', `Menghapus laporan "${complaint.title}" milik ${complaint.author?.name || 'Anonim'}`, profile.id)
  } catch (err) {
    console.error('AdminDeleteComplaint Error:', err)
  }
  redirect(success
    ? '/dashboard?message=Laporan telah dihapus dan warga diberi tahu'
    : '/dashboard?error=Gagal menghapus laporan')
}
