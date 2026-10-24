import { cache } from 'react'
import prisma from '@/lib/prisma'
import { Prisma, Profile, Role } from '@prisma/client'

export interface AdminUsersFilterOptions {
  q?: string
  role?: string
  rt?: string
  rw?: string
  page?: number
  pageSize?: number
}

export interface AdminUsersResult {
  users: Profile[]
  totalUsers: number
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
}

export type ComplaintWithAuthorForExport = Prisma.ComplaintGetPayload<{
  include: { author: true }
}>

/**
 * Mengambil daftar pengguna berpaginasi dengan filter pencarian, role, dan RT/RW
 */
export const getAdminUsersList = cache(
  async (options: AdminUsersFilterOptions = {}): Promise<AdminUsersResult> => {
    try {
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

      const [users, totalUsers] = await Promise.all([
        prisma.profile.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
        }),
        prisma.profile.count({ where: whereClause }),
      ])

      return {
        users,
        totalUsers,
      }
    } catch (err) {
      console.error('getAdminUsersList DAL Error:', err)
      return {
        users: [],
        totalUsers: 0,
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
      console.error('getAdminAuditLogs DAL Error:', err)
      return {
        logs: [],
        totalLogs: 0,
      }
    }
  }
)

/**
 * Mengambil dataset keluhan lengkap untuk print preview & ekspor admin
 */
export const getAdminExportData = cache(
  async (take: number = 500): Promise<ComplaintWithAuthorForExport[]> => {
    try {
      return await prisma.complaint.findMany({
        include: { author: true },
        orderBy: { createdAt: 'desc' },
        take,
      })
    } catch (err) {
      console.error('getAdminExportData DAL Error:', err)
      return []
    }
  }
)
