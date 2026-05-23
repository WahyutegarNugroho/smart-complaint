'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'
import { getAuthenticatedUser, getAuthenticatedUserOptional } from '@/lib/auth'

export async function updateUserRole(formData: FormData) {
  try {
    const { user: adminUser } = await getAuthenticatedUser()
    const adminProfile = await prisma.profile.findUnique({
      where: { userId: adminUser.id }
    })
    if (!adminProfile || adminProfile.role !== 'ADMIN') throw new Error('Hanya Admin yang dapat mengubah role')

    const targetProfileId = formData.get('profileId') as string
    const newRole = formData.get('role') as 'MASYARAKAT' | 'PETUGAS' | 'ADMIN'

    const targetUser = await prisma.profile.findUnique({
      where: { id: targetProfileId }
    })
    if (!targetUser) return

    await prisma.profile.update({
      where: { id: targetProfileId },
      data: { role: newRole }
    })

    revalidatePath('/dashboard/admin/users')
    await createAuditLog('UPDATE_ROLE', `Mengubah role ${targetUser.username} dari ${targetUser.role} menjadi ${newRole}`)
  } catch (err) {
    console.error('UpdateUserRole Error:', err)
  }
}

export async function toggleUserVerification(formData: FormData) {
  try {
    const { user: adminUser } = await getAuthenticatedUser()
    const adminProfile = await prisma.profile.findUnique({
      where: { userId: adminUser.id }
    })
    if (!adminProfile || adminProfile.role !== 'ADMIN') throw new Error('Izin ditolak')

    const targetProfileId = formData.get('profileId') as string
    const currentStatus = formData.get('isVerified') === 'true'

    await prisma.profile.update({
      where: { id: targetProfileId },
      data: { isVerified: !currentStatus }
    })

    revalidatePath('/dashboard/admin/users')
    const targetUser = await prisma.profile.findUnique({ where: { id: targetProfileId } })
    if (targetUser) {
      await createAuditLog('VERIFY_USER', `${currentStatus ? 'Mencabut' : 'Memverifikasi'} akun ${targetUser.username}`)
    }
  } catch (err) {
    console.error('ToggleUserVerification Error:', err)
  }
}

export async function deleteUserAccount(formData: FormData) {
  try {
    const auth = await getAuthenticatedUserOptional()
    if (!auth) return
    const { user } = auth
    const adminProfile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })
    if (!adminProfile || adminProfile.role !== 'ADMIN') return

    const targetProfileId = formData.get('profileId') as string
    const targetUser = await prisma.profile.findUnique({ where: { id: targetProfileId } })
    if (!targetUser) return

    await prisma.profile.delete({ where: { id: targetProfileId } })
    revalidatePath('/dashboard/admin/users')
    await createAuditLog('DELETE_USER', `Menghapus akun ${targetUser.username} (${targetUser.name})`)
  } catch (err) {
    console.error('DeleteUserAccount Error:', err)
  }
}
