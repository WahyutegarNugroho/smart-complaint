import 'server-only'
import { cache } from 'react'
import prisma from '@/lib/prisma'
import { Prisma, Role } from '@prisma/client'
import { logServerError, mapPrismaError } from '@/lib/errors'
import { getAuthorizedAdminProfile } from './guard'

export interface AdminUserListItem {
  id: string
  name: string
  username: string
  role: Role
  isVerified: boolean
  rt: string | null
  rw: string | null
  address: string | null
  createdAt: Date
  maskedNik: string | null
  maskedPhone: string | null
}

export interface AdminUsersFilterOptions {
  q?: string
  role?: string
  rt?: string
  rw?: string
  page?: number
  pageSize?: number
}

export interface AdminUsersResult {
  users: AdminUserListItem[]
  totalUsers: number
  error?: string | null
}

export interface AdminAuditLogsFilterOptions {
  action?: string
  page?: number
  pageSize?: number
}

export interface AuditLogWithAdmin {
  id: string
  action: string
  details: string
  createdAt: Date
  admin: {
    name: string | null
  }
}

export interface AdminAuditLogsResult {
  logs: AuditLogWithAdmin[]
  totalLogs: number
  error?: string | null
}

export type ComplaintWithAuthorForExport = Prisma.ComplaintGetPayload<{
  include: { author: { select: { name: true } } }
}>

export function maskSensitiveTail(value: string | null | undefined): string | null {
  if (!value) return null
  return `****${value.slice(-4)}`
}

/**
 * Mengambil daftar pengguna berpaginasi dengan filter pencarian, role, dan RT/RW.
 * Hanya dapat diakses oleh ADMIN dan hanya mengembalikan NIK/telepon yang telah dimasking.
 */
export const getAdminUsersList = cache(
  async (options: AdminUsersFilterOptions = {}): Promise<AdminUsersResult> => {
    try {
      const admin = await getAuthorizedAdminProfile()
      if (!admin) {
        return { users: [], totalUsers: 0 }
      }

      const page = Math.max(1, options.page || 1)
      const pageSize = options.pageSize || 10
      const skip = (page - 1) * pageSize

      const whereClause: Prisma.ProfileWhereInput = {}

      if (options.q) {
        whereClause.OR = [
          { name: { contains: options.q, mode: 'insensitive' } },
          { username: { contains: options.q, mode: 'insensitive' } },
        ]
      }

      if (options.role) {
        whereClause.role = options.role as Role
      }

      if (options.rt) {
        whereClause.rt = options.rt
      }

      if (options.rw) {
        whereClause.rw = options.rw
      }

      const [rawUsers, totalUsers] = await Promise.all([
        prisma.profile.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            isVerified: true,
            rt: true,
            rw: true,
            address: true,
            createdAt: true,
            nik: true,
            phone: true,
          },
        }),
        prisma.profile.count({ where: whereClause }),
      ])

      const users: AdminUserListItem[] = rawUsers.map(({ nik, phone, ...rest }) => ({
        ...rest,
        maskedNik: maskSensitiveTail(nik),
        maskedPhone: maskSensitiveTail(phone),
      }))

      return {
        users,
        totalUsers,
      }
    } catch (err) {
      logServerError('dal.getAdminUsersList', err)
      return {
        users: [],
        totalUsers: 0,
        error: mapPrismaError(err).userMessage,
      }
    }
  }
)

/**
 * Mengambil log aktivitas audit berpaginasi untuk panel Admin
 */
export const getAdminAuditLogs = cache(
  async (options: AdminAuditLogsFilterOptions = {}): Promise<AdminAuditLogsResult> => {
    try {
      const admin = await getAuthorizedAdminProfile()
      if (!admin) {
        return { logs: [], totalLogs: 0 }
      }

      const page = Math.max(1, options.page || 1)
      const pageSize = options.pageSize || 15
      const skip = (page - 1) * pageSize

      const whereClause: Prisma.AuditLogWhereInput = {}
      if (options.action) {
        whereClause.action = options.action
      }

      const [totalLogs, logs] = await Promise.all([
        prisma.auditLog.count({ where: whereClause }),
        prisma.auditLog.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
          include: {
            admin: {
              select: {
                name: true,
              },
            },
          },
        }),
      ])

      return {
        logs,
        totalLogs,
      }
    } catch (err) {
      logServerError('dal.getAdminAuditLogs', err)
      return {
        logs: [],
        totalLogs: 0,
        error: mapPrismaError(err).userMessage,
      }
    }
  }
)

export interface AdminExportResult {
  complaints: ComplaintWithAuthorForExport[]
  error?: string | null
}

/**
 * Mengambil dataset keluhan lengkap untuk print preview & ekspor admin
 */
export const getAdminExportData = cache(
  async (take: number = 500): Promise<ComplaintWithAuthorForExport[]> => {
    const res = await getAdminExportResult(take)
    return res.complaints
  }
)

/**
 * Mengambil dataset keluhan lengkap beserta status error eksplisit untuk halaman ekspor admin
 */
export const getAdminExportResult = cache(
  async (take: number = 500): Promise<AdminExportResult> => {
    try {
      const admin = await getAuthorizedAdminProfile()
      if (!admin) {
        return { complaints: [], error: null }
      }

      const complaints = await prisma.complaint.findMany({
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take,
      })

      return { complaints, error: null }
    } catch (err) {
      logServerError('dal.getAdminExportResult', err)
      return { complaints: [], error: mapPrismaError(err).userMessage }
    }
  }
)
