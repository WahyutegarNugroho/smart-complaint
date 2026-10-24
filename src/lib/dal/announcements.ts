import { cache } from 'react'
import prisma from '@/lib/prisma'
import { Announcement } from '@prisma/client'

export interface AnnouncementWithAuthor extends Announcement {
  author?: {
    name: string | null
  } | null
}

export interface PaginatedAnnouncementsResult {
  announcements: AnnouncementWithAuthor[]
  totalAnnouncements: number
}

/**
 * Mengambil daftar pengumuman terbaru dengan batasan jumlah (default: 3)
 */
export const getAnnouncements = cache(
  async (options?: { take?: number; skip?: number }): Promise<Announcement[]> => {
    try {
      const take = options?.take ?? 3
      const skip = options?.skip ?? 0
      return await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      })
    } catch (err) {
      console.error('getAnnouncements DAL Error:', err)
      return []
    }
  }
)

/**
 * Mengambil daftar pengumuman berpaginasi beserta data author untuk panel Admin
 */
export const getAdminPaginatedAnnouncements = cache(
  async (page: number = 1, pageSize: number = 10): Promise<PaginatedAnnouncementsResult> => {
    try {
      const safePage = Math.max(1, page)
      const skip = (safePage - 1) * pageSize

      const [announcements, totalAnnouncements] = await Promise.all([
        prisma.announcement.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          skip,
          take: pageSize,
        }),
        prisma.announcement.count(),
      ])

      return {
        announcements,
        totalAnnouncements,
      }
    } catch (err) {
      console.error('getAdminPaginatedAnnouncements DAL Error:', err)
      return {
        announcements: [],
        totalAnnouncements: 0,
      }
    }
  }
)
