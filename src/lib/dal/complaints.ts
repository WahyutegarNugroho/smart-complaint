import 'server-only'
import { cache } from 'react'
import prisma from '@/lib/prisma'
import { Prisma, Role, Status } from '@prisma/client'
import { getEscalationInfo } from '@/lib/escalation'
import { isStaff } from '@/lib/authorization'
import { logServerError, mapPrismaError } from '@/lib/errors'
import { getAuthorizedProfile } from './guard'

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
  error?: string | null
}

export interface ComplaintForEditResult {
  status: 'SUCCESS' | 'NOT_FOUND' | 'FORBIDDEN' | 'ALREADY_PROCESSED' | 'ERROR'
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

    const emptyResult: ComplaintListResult = {
      complaints: [],
      totalComplaints: 0,
      totalPages: 0,
      currentPage,
      pageSize,
      categoryOptions: [],
    }

    try {
      const authProfile = await getAuthorizedProfile()
      if (!authProfile) {
        return emptyResult
      }

      const effectiveIsWarga = options.isWarga || !isStaff(authProfile)
      if (effectiveIsWarga && (!options.profileId || options.profileId !== authProfile.id)) {
        return emptyResult
      }

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
      if (effectiveIsWarga) {
        whereClause.authorId = authProfile.id
      }
      if (categoryFilter) whereClause.category = categoryFilter
      if (fromDate || toDate) {
        const createdAt: Record<string, Date> = {}
        if (fromDate) createdAt.gte = new Date(fromDate)
        if (toDate) createdAt.lte = new Date(toDate + 'T23:59:59.999Z')
        whereClause.createdAt = createdAt
      }

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
      logServerError('dal.getComplaintList', err)
      return {
        ...emptyResult,
        error: mapPrismaError(err).userMessage,
      }
    }
  }
)

/**
 * Mengambil detail keluhan secara aman, termasuk escalation log dan respon petugas.
 * Memverifikasi kepemilikan atau peran staf sebelum mengembalikan data.
 * Field sensitif seperti NIK dan nomor HP tidak di-select untuk mematuhi prinsip Least Privilege.
 */
export const getComplaintDetail = cache(async (id: string) => {
  try {
    const authProfile = await getAuthorizedProfile()
    if (!authProfile) {
      return {
        complaint: null,
        escalationLogs: [],
        forbidden: true,
        error: null,
      }
    }

    const complaint = await prisma.complaint.findUnique({
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
          include: {
            officer: {
              select: {
                name: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!complaint) {
      return {
        complaint: null,
        escalationLogs: [],
        forbidden: false,
        error: null,
      }
    }

    if (!isStaff(authProfile) && complaint.authorId !== authProfile.id) {
      return {
        complaint: null,
        escalationLogs: [],
        forbidden: true,
        error: null,
      }
    }

    const escalationLogs = await getEscalationInfo(id)

    return {
      complaint,
      escalationLogs,
      forbidden: false,
      error: null,
    }
  } catch (err) {
    logServerError('dal.getComplaintDetail', err, { complaintId: id })
    return {
      complaint: null,
      escalationLogs: [],
      forbidden: false,
      error: mapPrismaError(err).userMessage,
    }
  }
})

/**
 * Mengambil data keluhan untuk halaman edit dengan verifikasi hak milik pelapor
 */
export const getComplaintForEdit = cache(
  async (id: string, requesterProfileId: string): Promise<ComplaintForEditResult> => {
    try {
      const authProfile = await getAuthorizedProfile()
      if (!authProfile || authProfile.id !== requesterProfileId) {
        return { status: 'FORBIDDEN' }
      }

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
      logServerError('dal.getComplaintForEdit', err, { complaintId: id })
      return { status: 'ERROR' }
    }
  }
)

export interface RawMappedComplaint {
  id: string
  title: string
  content: string
  latitude: number | null
  longitude: number | null
  status: string
  rt: string | null
  rw: string | null
  isUrgent: boolean
  createdAt: Date
  category: string
  categoryId: string | null
  imageUrl: string | null
  location: string
  incidentDate: Date
  escalationLevel: string
  authorId: string
  author: {
    name: string
    username: string
  } | null
  categoryRel: {
    id: string
    name: string
  } | null
}

export interface SanitizedMappedComplaint {
  id: string
  title: string
  content: string
  latitude: number | null
  longitude: number | null
  status: string
  rt: string | null
  rw: string | null
  isUrgent: boolean
  createdAt: Date
  category: string
  categoryId: string | null
  imageUrl: string | null
  location: string
  incidentDate: Date
  escalationLevel: string
  author: {
    name: string
    username: string
  } | null
  categoryRel: {
    id: string
    name: string
  } | null
  isOwn: boolean
}

/**
 * Menyaring data keluhan peta berdasarkan hak akses pemanggil.
 * Untuk warga (MASYARAKAT), detail laporan milik warga lain disanitasi di server
 * agar tidak ikut terkirim dalam RSC payload ke browser.
 */
export function sanitizeMappedComplaintsForViewer(
  complaints: RawMappedComplaint[],
  viewer: { profileId: string; role: Role }
): SanitizedMappedComplaint[] {
  const viewerIsStaff = viewer.role === 'ADMIN' || viewer.role === 'PETUGAS'

  return complaints.map((c) => {
    const isOwn = c.authorId === viewer.profileId
    if (viewerIsStaff || isOwn) {
      const { authorId: _authorId, ...rest } = c
      void _authorId
      return {
        ...rest,
        isOwn,
      }
    }

    return {
      id: c.id,
      title: 'Laporan Warga',
      content: '',
      latitude: c.latitude,
      longitude: c.longitude,
      status: c.status,
      rt: c.rt,
      rw: c.rw,
      isUrgent: c.isUrgent,
      createdAt: c.createdAt,
      category: c.category,
      categoryId: c.categoryId,
      imageUrl: null,
      location: '',
      incidentDate: c.createdAt,
      escalationLevel: 'NONE',
      author: null,
      categoryRel: c.categoryRel,
      isOwn: false,
    }
  })
}

/**
 * Mengambil keluhan dengan koordinat geolokasi untuk peta interaktif
 */
export const getMappedComplaints = cache(async (take: number = 500): Promise<SanitizedMappedComplaint[]> => {
  try {
    const authProfile = await getAuthorizedProfile()
    if (!authProfile) return []

    const complaints = await prisma.complaint.findMany({
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

    return sanitizeMappedComplaintsForViewer(complaints, {
      profileId: authProfile.id,
      role: authProfile.role,
    })
  } catch (err) {
    logServerError('dal.getMappedComplaints', err)
    return []
  }
})

/**
 * Mengambil daftar kategori beserta subkategori untuk formulir buat laporan
 */
export const getCategoriesWithChildren = cache(async () => {
  try {
    const authProfile = await getAuthorizedProfile()
    if (!authProfile) return []

    return await prisma.category.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })
  } catch (err) {
    logServerError('dal.getCategoriesWithChildren', err)
    return []
  }
})

/**
 * Mengambil daftar subkategori untuk filter di halaman peta
 */
export const getMapCategories = cache(async () => {
  try {
    const authProfile = await getAuthorizedProfile()
    if (!authProfile) return []

    return await prisma.category.findMany({
      where: { parentId: { not: null } },
      select: { id: true, name: true, parentId: true },
      orderBy: { name: 'asc' },
    })
  } catch (err) {
    logServerError('dal.getMapCategories', err)
    return []
  }
})

