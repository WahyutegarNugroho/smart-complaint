'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getAuthenticatedUserOptional } from '@/lib/auth'
import { logServerError, mapPrismaError } from '@/lib/errors'

export interface NotificationActionResult {
  success: boolean
  error?: string
}

export async function markNotificationAsRead(notificationId: string): Promise<NotificationActionResult> {
  try {
    const auth = await getAuthenticatedUserOptional()
    if (!auth) return { success: false, error: 'Sesi akun tidak aktif.' }
    const { user } = auth
    const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { id: true } })
    if (!profile) return { success: false, error: 'Profil pengguna tidak ditemukan.' }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { id: true, userId: true }
    })
    if (!notification || notification.userId !== profile.id) {
      return { success: false, error: 'Notifikasi tidak ditemukan atau akses ditolak.' }
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    logServerError('actions.markNotificationAsRead', err, { notificationId })
    return { success: false, error: mapPrismaError(err).userMessage }
  }
}

export async function markAllNotificationsAsRead(): Promise<NotificationActionResult> {
  try {
    const auth = await getAuthenticatedUserOptional()
    if (!auth) return { success: false, error: 'Sesi akun tidak aktif.' }
    const { user } = auth
    const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { id: true } })
    if (!profile) return { success: false, error: 'Profil pengguna tidak ditemukan.' }

    await prisma.notification.updateMany({
      where: { userId: profile.id, isRead: false },
      data: { isRead: true }
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    logServerError('actions.markAllNotificationsAsRead', err)
    return { success: false, error: mapPrismaError(err).userMessage }
  }
}
