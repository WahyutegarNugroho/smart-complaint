import { cache } from 'react'
import prisma from '@/lib/prisma'
import { Prisma, Status } from '@prisma/client'
import { getEscalationInfo } from '@/lib/escalation'

export interface ComplaintListItem {
  id: string
  title: string
  content: string
  imageUrl?: string | null
  status: string
  category: string
  categoryRel?: { name: string } | null
  rt: string | null
  rw: string | null
  isUrgent: boolean
  createdAt: Date
  author?: {
    name: string | null
  } | null
}

export interface ComplaintListFilterParams {
  status?: string
  q?: string
  rt?: string
  rw?: string
  page?: string
  category?: string
  fromDate?: string
  toDate?: string
  pageSize?: string
}

export interface ComplaintListResult {
  complaints: ComplaintListItem[]
  totalComplaints: number
  totalPages: number
  currentPage: number
  pageSize: number
  categoryOptions: { id: string; name: string; slug: string }[]
}

export interface ComplaintForEditResult {
  status: 'SUCCESS' | 'NOT_FOUND' | 'FORBIDDEN' | 'ALREADY_PROCESSED'
  complaint?: {
    id: string
    title: string
    incidentDate: Date
    location: string
    content: string
    imageUrl: string | null
    authorId: string
    status: Status
  }
}

/**
 * Mengambil daftar keluhan berpaginasi beserta filter lengkap untuk dashboard
 */
export const getComplaintList = cache(
  async (options: {
    profileId?: string
    isWarga: boolean
    searchParams: ComplaintListFilterParams
  }): Promise<ComplaintListResult> => {
    const {
      status: currentStatus,
      q: searchQuery,
      rt,
      rw,
      page,
      category: categoryFilter,
      fromDate,
      toDate,
      pageSize: rawPageSize,
    } = options.searchParams

    const currentPage = Math.max(1, Number(page) || 1)
    const pageSize = [12, 24, 48].includes(Number(rawPageSize))
      ? Number(rawPageSize)
      : 12

    const whereClause: Prisma.ComplaintWhereInput = {}

    if (currentStatus) {
      const validStatuses = Object.values(Status)
      if (validStatuses.includes(currentStatus as Status)) {
        whereClause.status = currentStatus as Status
      }
    }

    if (searchQuery) {
      whereClause.title = { contains: searchQuery, mode: 'insensitive' }
    }
    if (rt) whereClause.rt = rt
    if (rw) whereClause.rw = rw
    if (options.isWarga && options.profileId) {
      whereClause.authorId = options.profileId
    }
    if (categoryFilter) whereClause.category = categoryFilter
    if (fromDate || toDate) {
      const createdAt: Record<string, Date> = {}
      if (fromDate) createdAt.gte = new Date(fromDate)
      if (toDate) createdAt.lte = new Date(toDate + 'T23:59:59.999Z')
      whereClause.createdAt = createdAt
    }

    try {
      const [categoryOptions, resComplaints, resTotal] = await Promise.all([
        prisma.category.findMany({
          where: { parentId: null },
          orderBy: { name: 'asc' },
        }),
        prisma.complaint.findMany({
          where: whereClause,
          orderBy: [{ isUrgent: 'desc' }, { createdAt: 'desc' }],
          include: {
            author: { select: { name: true } },
            categoryRel: { select: { name: true } },
          },
          take: pageSize,
          skip: (currentPage - 1) * pageSize,
        }),
        prisma.complaint.count({ where: whereClause }),
      ])

      const totalPages = Math.ceil(resTotal / pageSize)

      return {
        complaints: resComplaints as ComplaintListItem[],
        totalComplaints: resTotal,
        totalPages,
        currentPage,
        pageSize,
        categoryOptions,
      }
    } catch (err) {
      console.error('getComplaintList DAL Error:', err)
      return {
        complaints: [],
        totalComplaints: 0,
        totalPages: 0,
        currentPage,
        pageSize,
        categoryOptions: [],
      }
    }
  }
)

/**
 * Mengambil detail keluhan secara aman, termasuk escalation log dan respon petugas.
 * Field sensitif seperti NIK dan nomor HP penulis tidak di-select untuk mematuhi prinsip Least Privilege.
 */
export const getComplaintDetail = cache(async (id: string) => {
  try {
    const [complaint, escalationLogs] = await Promise.all([
      prisma.complaint.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              rt: true,
              isVerified: true,
            },
          },
          categoryRel: true,
          responses: {
            include: { officer: true },
            orderBy: { createdAt: 'asc' },
          },
        },
      }),
      getEscalationInfo(id),
    ])

    return {
      complaint,
      escalationLogs,
    }
  } catch (err) {
    console.error('getComplaintDetail DAL Error:', err)
    return {
      complaint: null,
      escalationLogs: [],
    }
  }
})

/**
 * Mengambil data keluhan untuk halaman edit dengan verifikasi hak milik pelapor
 */
export const getComplaintForEdit = cache(
  async (id: string, requesterProfileId: string): Promise<ComplaintForEditResult> => {
    try {
      const complaint = await prisma.complaint.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          incidentDate: true,
          location: true,
          content: true,
          imageUrl: true,
          authorId: true,
          status: true,
        },
      })

      if (!complaint) {
        return { status: 'NOT_FOUND' }
      }

      if (complaint.authorId !== requesterProfileId) {
        return { status: 'FORBIDDEN' }
      }

      if (complaint.status !== 'PENDING') {
        return { status: 'ALREADY_PROCESSED' }
      }

      return {
        status: 'SUCCESS',
        complaint,
      }
    } catch (err) {
      console.error('getComplaintForEdit DAL Error:', err)
      return { status: 'NOT_FOUND' }
    }
  }
)

/**
 * Mengambil keluhan dengan koordinat geolokasi untuk peta interaktif
 */
export const getMappedComplaints = cache(async (take: number = 500) => {
  try {
    return await prisma.complaint.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        title: true,
        content: true,
        latitude: true,
        longitude: true,
        status: true,
        rt: true,
        rw: true,
        isUrgent: true,
        createdAt: true,
        category: true,
        categoryId: true,
        imageUrl: true,
        location: true,
        incidentDate: true,
        escalationLevel: true,
        authorId: true,
        author: {
          select: {
            name: true,
            username: true,
          },
        },
        categoryRel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take,
    })
  } catch (err) {
    console.error('getMappedComplaints DAL Error:', err)
    return []
  }
})

/**
 * Mengambil daftar subkategori untuk filter di halaman peta
 */
export const getMapCategories = cache(async () => {
  try {
    return await prisma.category.findMany({
      where: { parentId: { not: null } },
      select: { id: true, name: true, parentId: true },
      orderBy: { name: 'asc' },
    })
  } catch (err) {
    console.error('getMapCategories DAL Error:', err)
    return []
  }
})

