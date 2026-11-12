'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'
import { getAuthenticatedUser, getAuthenticatedUserOptional } from '@/lib/auth'
import { requireAdmin } from '@/lib/authorization'
import { isNextControlFlowError, logServerError, mapPrismaError } from '@/lib/errors'
import { validateEnum } from '@/lib/validate'

export async function updateUserRole(formData: FormData) {
  try {
    const { user: adminUser } = await getAuthenticatedUser()
    const adminProfile = await prisma.profile.findUnique({
      where: { userId: adminUser.id },
      select: { id: true, role: true }
    })
    requireAdmin(adminProfile)

    const targetProfileId = formData.get('profileId') as string
    const rawRole = formData.get('role') as string
    const newRole = validateEnum(rawRole, ['MASYARAKAT', 'PETUGAS', 'ADMIN'] as const)
    if (!newRole) {
      redirect('/dashboard/admin/users?error=' + encodeURIComponent('Peran pengguna tidak valid.'))
    }

    if (targetProfileId === adminProfile.id && newRole !== 'ADMIN') {
      redirect('/dashboard/admin/users?error=' + encodeURIComponent('Tidak dapat menurunkan peran akun Anda sendiri.'))
    }

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
    if (isNextControlFlowError(err)) throw err
    logServerError('actions.updateUserRole', err)
    redirect('/dashboard/admin/users?error=' + encodeURIComponent(mapPrismaError(err).userMessage))
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
    if (isNextControlFlowError(err)) throw err
    logServerError('actions.toggleUserVerification', err)
    redirect('/dashboard/admin/users?error=' + encodeURIComponent(mapPrismaError(err).userMessage))
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
    if (targetProfileId === adminProfile.id) {
      redirect('/dashboard/admin/users?error=' + encodeURIComponent('Tidak dapat menghapus akun Anda sendiri.'))
    }

    const targetUser = await prisma.profile.findUnique({ where: { id: targetProfileId }, select: { username: true, name: true } })
    if (!targetUser) {
      redirect('/dashboard/admin/users?error=' + encodeURIComponent('Akun pengguna tidak ditemukan.'))
    }

    await prisma.profile.delete({ where: { id: targetProfileId } })
    revalidatePath('/dashboard/admin/users')
    await createAuditLog('DELETE_USER', `Menghapus akun ${targetUser.username} (${targetUser.name})`, adminProfile.id)
    redirect('/dashboard/admin/users?message=' + encodeURIComponent(`Akun ${targetUser.username} berhasil dihapus.`))
  } catch (err) {
    if (isNextControlFlowError(err)) throw err
    logServerError('actions.deleteUserAccount', err)
    const mapped = mapPrismaError(err)
    const errorMsg =
      mapped.code === 'DEPENDENCY_EXISTS'
        ? 'Akun tidak dapat dihapus karena masih memiliki riwayat laporan atau tanggapan aktif.'
        : mapped.userMessage
    redirect('/dashboard/admin/users?error=' + encodeURIComponent(errorMsg))
  }
}
