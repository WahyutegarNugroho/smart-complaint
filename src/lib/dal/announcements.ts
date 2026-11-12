import 'server-only'
import { cache } from 'react'
import prisma from '@/lib/prisma'
import { Announcement } from '@prisma/client'
import { logServerError, mapPrismaError } from '@/lib/errors'
import { getAuthorizedAdminProfile } from './guard'

export interface AnnouncementWithAuthor extends Announcement {
  author?: {
    name: string | null
  } | null
}

export interface PaginatedAnnouncementsResult {
  announcements: AnnouncementWithAuthor[]
  totalAnnouncements: number
  error?: string | null
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
      logServerError('dal.getAnnouncements', err)
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
      const admin = await getAuthorizedAdminProfile()
      if (!admin) {
        return { announcements: [], totalAnnouncements: 0 }
      }

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
      logServerError('dal.getAdminPaginatedAnnouncements', err)
      return {
        announcements: [],
        totalAnnouncements: 0,
        error: mapPrismaError(err).userMessage,
      }
    }
  }
)
