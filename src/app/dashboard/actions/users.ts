'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'
import { getAuthenticatedUser, getAuthenticatedUserOptional } from '@/lib/auth'
import { requireAdmin } from '@/lib/authorization'
import { isRedirectError } from '@/lib/redirect-guard'

export async function updateUserRole(formData: FormData) {
  try {
    const { user: adminUser } = await getAuthenticatedUser()
    const adminProfile = await prisma.profile.findUnique({
      where: { userId: adminUser.id },
      select: { id: true, role: true }
    })
    requireAdmin(adminProfile)

    const targetProfileId = formData.get('profileId') as string
    const newRole = formData.get('role') as 'MASYARAKAT' | 'PETUGAS' | 'ADMIN'

    const targetUser = await prisma.profile.findUnique({
      where: { id: targetProfileId },
      select: { username: true, role: true }
    })
    if (!targetUser) {
      redirect('/dashboard/admin/users?error=' + encodeURIComponent('Profil pengguna tidak ditemukan.'))
    }

    await prisma.profile.update({
      where: { id: targetProfileId },
      data: { role: newRole }
    })

    revalidatePath('/dashboard/admin/users')
    await createAuditLog('UPDATE_ROLE', `Mengubah role ${targetUser.username} dari ${targetUser.role} menjadi ${newRole}`, adminProfile.id)
    redirect('/dashboard/admin/users?message=' + encodeURIComponent(`Peran ${targetUser.username} berhasil diubah menjadi ${newRole}.`))
  } catch (err) {
    console.error('UpdateUserRole Error:', err)
    if (isRedirectError(err)) throw err
    redirect('/dashboard/admin/users?error=' + encodeURIComponent('Gagal memperbarui peran akun pengguna.'))
  }
}

export async function toggleUserVerification(formData: FormData) {
  try {
    const { user: adminUser } = await getAuthenticatedUser()
    const adminProfile = await prisma.profile.findUnique({
      where: { userId: adminUser.id },
      select: { id: true, role: true }
    })
    requireAdmin(adminProfile)

    const targetProfileId = formData.get('profileId') as string
    const currentStatus = formData.get('isVerified') === 'true'

    await prisma.profile.update({
      where: { id: targetProfileId },
      data: { isVerified: !currentStatus }
    })

    revalidatePath('/dashboard/admin/users')
    const targetUser = await prisma.profile.findUnique({ where: { id: targetProfileId }, select: { username: true } })
    if (targetUser) {
      await createAuditLog('VERIFY_USER', `${currentStatus ? 'Mencabut' : 'Memverifikasi'} akun ${targetUser.username}`, adminProfile.id)
    }
    redirect('/dashboard/admin/users?message=' + encodeURIComponent(`Status verifikasi akun berhasil diperbarui.`))
  } catch (err) {
    console.error('ToggleUserVerification Error:', err)
    if (isRedirectError(err)) throw err
    redirect('/dashboard/admin/users?error=' + encodeURIComponent('Gagal memperbarui status verifikasi akun.'))
  }
}

export async function deleteUserAccount(formData: FormData) {
  try {
    const auth = await getAuthenticatedUserOptional()
    if (!auth) {
      redirect('/dashboard/admin/users?error=' + encodeURIComponent('Sesi tidak valid.'))
    }
    const { user } = auth
    const adminProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true, role: true }
    })
    if (!adminProfile || adminProfile.role !== 'ADMIN') {
      redirect('/dashboard/admin/users?error=' + encodeURIComponent('Hak akses administrator diperlukan.'))
    }

    const targetProfileId = formData.get('profileId') as string
    const targetUser = await prisma.profile.findUnique({ where: { id: targetProfileId }, select: { username: true, name: true } })
    if (!targetUser) {
      redirect('/dashboard/admin/users?error=' + encodeURIComponent('Akun pengguna tidak ditemukan.'))
    }

    await prisma.profile.delete({ where: { id: targetProfileId } })
    revalidatePath('/dashboard/admin/users')
    await createAuditLog('DELETE_USER', `Menghapus akun ${targetUser.username} (${targetUser.name})`, adminProfile.id)
    redirect('/dashboard/admin/users?message=' + encodeURIComponent(`Akun ${targetUser.username} berhasil dihapus.`))
  } catch (err) {
    console.error('DeleteUserAccount Error:', err)
    if (isRedirectError(err)) throw err
    const isForeignKey = typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === 'P2003'
    const errorMsg = isForeignKey
      ? 'Akun tidak dapat dihapus karena masih memiliki riwayat laporan atau tanggapan aktif.'
      : 'Gagal menghapus akun pengguna dari sistem.'
    redirect('/dashboard/admin/users?error=' + encodeURIComponent(errorMsg))
  }
}
