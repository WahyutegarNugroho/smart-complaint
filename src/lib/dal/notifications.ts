import 'server-only'
import { cache } from 'react'
import prisma from '@/lib/prisma'
import { Notification } from '@prisma/client'
import { logServerError } from '@/lib/errors'
import { getAuthorizedProfile } from './guard'

/**
 * Mengambil daftar notifikasi pengguna untuk dropdown notifikasi di header/layout
 */
export const getUserNotifications = cache(
  async (profileId: string, limit: number = 10): Promise<Notification[]> => {
    if (!profileId) return []
    try {
      const authProfile = await getAuthorizedProfile()
      if (!authProfile || authProfile.id !== profileId) return []

      return await prisma.notification.findMany({
        where: { userId: profileId },
        orderBy: [
          { isRead: 'asc' },
          { createdAt: 'desc' },
        ],
        take: limit,
      })
    } catch (err) {
      logServerError('dal.getUserNotifications', err)
      return []
    }
  }
)

/**
 * Menghitung jumlah notifikasi yang belum dibaca
 */
export const getUnreadNotificationCount = cache(
  async (profileId: string): Promise<number> => {
    if (!profileId) return 0
    try {
      const authProfile = await getAuthorizedProfile()
      if (!authProfile || authProfile.id !== profileId) return 0

      return await prisma.notification.count({
        where: {
          userId: profileId,
          isRead: false,
        },
      })
    } catch (err) {
      logServerError('dal.getUnreadNotificationCount', err)
      return 0
    }
  }
)
