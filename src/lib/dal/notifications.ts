import { cache } from 'react'
import prisma from '@/lib/prisma'
import { Notification } from '@prisma/client'

/**
 * Mengambil daftar notifikasi pengguna untuk dropdown notifikasi di header/layout
 */
export const getUserNotifications = cache(
  async (profileId: string, limit: number = 10): Promise<Notification[]> => {
    if (!profileId) return []
    try {
      return await prisma.notification.findMany({
        where: { userId: profileId },
        orderBy: [
          { isRead: 'asc' },
          { createdAt: 'desc' },
        ],
        take: limit,
      })
    } catch (err) {
      console.error('getUserNotifications DAL Error:', err)
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
      return await prisma.notification.count({
        where: {
          userId: profileId,
          isRead: false,
        },
      })
    } catch (err) {
      console.error('getUnreadNotificationCount DAL Error:', err)
      return 0
    }
  }
)
