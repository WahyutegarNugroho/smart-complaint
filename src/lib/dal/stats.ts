import { cache } from 'react'
import prisma from '@/lib/prisma'
import { Status } from '@prisma/client'

export interface PublicLandingStats {
  totalReports: number
  processingReports: number
  completedReports: number
  averageResponseHours: number
  successRate: string
  formattedResponseTime: string
  recentComplaints: {
    id: string
    title: string
    category: string
    status: string
    imageUrl: string | null
    rt: string | null
    rw: string | null
    createdAt: Date
    author: { name: string } | null
  }[]
}

/**
 * Mengambil data statistik publik dan daftar aduan terkini untuk Landing Page
 */
export const getPublicLandingStats = cache(async (): Promise<PublicLandingStats> => {
  try {
    const [
      total,
      processing,
      completed,
      avgHoursResult,
      recent
    ] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'PROCESSING' } }),
      prisma.complaint.count({ where: { status: 'COMPLETED' } }),
      prisma.$queryRaw<{ avg_hours: number | null }[]>`
        SELECT AVG(EXTRACT(EPOCH FROM ("updatedAt" - "createdAt")) / 3600) AS avg_hours
        FROM "Complaint"
        WHERE "status" = 'COMPLETED'
      `,
      prisma.complaint.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
          imageUrl: true,
          rt: true,
          rw: true,
          createdAt: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      }),
    ])

    const totalReports = total
    const processingReports = processing
    const completedReports = completed
    const avgHours = avgHoursResult?.[0]?.avg_hours
    let averageResponseHours = 12
    if (avgHours && avgHours > 0) {
      averageResponseHours = Math.max(1, Math.round(avgHours))
    }

    const successRate = totalReports > 0 ? ((completedReports / totalReports) * 100).toFixed(1) : '100'
    const formattedResponseTime = averageResponseHours >= 48
      ? `${Math.round(averageResponseHours / 24)} Hari`
      : `${averageResponseHours} Jam`

    return {
      totalReports,
      processingReports,
      completedReports,
      averageResponseHours,
      successRate,
      formattedResponseTime,
      recentComplaints: recent,
    }
  } catch (error) {
    console.error('[DAL getPublicLandingStats] Error:', error)
    return {
      totalReports: 0,
      processingReports: 0,
      completedReports: 0,
      averageResponseHours: 12,
      successRate: '100',
      formattedResponseTime: '12 Jam',
      recentComplaints: [],
    }
  }
})

export interface DashboardStats {
  total: number
  pending: number
  processing: number
  completed: number
}

/**
 * Mengambil statistik dashboard untuk warga atau petugas/admin
 */
export const getDashboardStats = cache(async (profileId: string, isWarga: boolean): Promise<DashboardStats> => {
  if (!profileId && isWarga) {
    return { total: 0, pending: 0, processing: 0, completed: 0 }
  }

  const whereBase = isWarga ? { authorId: profileId } : {}

  try {
    const [total, pending, processing, completed] = await Promise.all([
      prisma.complaint.count({ where: whereBase }),
      prisma.complaint.count({ where: { ...whereBase, status: 'PENDING' } }),
      prisma.complaint.count({ where: { ...whereBase, status: 'PROCESSING' } }),
      prisma.complaint.count({ where: { ...whereBase, status: 'COMPLETED' } }),
    ])

    return { total, pending, processing, completed }
  } catch (err) {
    console.error('[DAL getDashboardStats] Error:', err)
    return { total: 0, pending: 0, processing: 0, completed: 0 }
  }
})

export interface RoleStatsData {
  total: number
  second: number
  secondMetric: number
  pending: number
  completed: number
}

/**
 * Mengambil ringkasan metrik berbasis peran (Admin atau Petugas)
 */
export const getRoleStatsData = cache(async (role: 'admin' | 'petugas'): Promise<RoleStatsData> => {
  try {
    const secondQuery = role === 'admin'
      ? prisma.complaint.count({ where: { isUrgent: true, status: { not: 'COMPLETED' } } })
      : prisma.complaint.count({ where: { status: 'PROCESSING' } })

    const [total, second, pending, completed] = await Promise.all([
      prisma.complaint.count(),
      secondQuery,
      prisma.complaint.count({ where: { status: 'PENDING' } }),
      prisma.complaint.count({ where: { status: 'COMPLETED' } }),
    ])

    return { total, second, secondMetric: second, pending, completed }
  } catch (err) {
    console.error(`[DAL getRoleStatsData] Error (${role}):`, err)
    return { total: 0, second: 0, secondMetric: 0, pending: 0, completed: 0 }
  }
})

export interface AdminAnalyticsData {
  total: number
  completed: number
  unverifiedUsers: number
  completionRate: number
  total7Days: number
  chartData: { day: string; count: number }[]
  maxChart: number
}

/**
 * Mengambil analitik mendalam tren 7 hari untuk dashboard Admin
 */
export const getAdminAnalyticsData = cache(async (): Promise<AdminAnalyticsData | null> => {
  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [total, completed, unverifiedUsersCount, rawChartData] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'COMPLETED' } }),
      prisma.profile.count({ where: { isVerified: false, role: 'MASYARAKAT' } }),
      prisma.complaint.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true },
      }),
    ])

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    const total7Days = rawChartData.length

    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const dateStr = d.toLocaleDateString()
      const count = rawChartData.filter(c => new Date(c.createdAt).toLocaleDateString() === dateStr).length
      return { day: days[d.getDay()], count }
    })
    const maxChart = Math.max(...chartData.map(d => d.count), 1)

    return {
      total,
      completed,
      unverifiedUsers: unverifiedUsersCount,
      completionRate,
      total7Days,
      chartData,
      maxChart,
    }
  } catch (err) {
    console.error('[DAL getAdminAnalyticsData] Error:', err)
    return null
  }
})

export interface AdminDeepStatsData {
  statusCounts: { status: Status; _count: { _all: number } }[]
  rtCounts: { rt: string | null; _count: { _all: number } }[]
  total: number
  mappedComplaints: {
    id: string
    title: string
    latitude: number
    longitude: number
    status: Status
    rt: string | null
    rw: string | null
    isUrgent: boolean
    createdAt: Date
  }[]
  maxRTCount: number
}

/**
 * Mengambil statistik spasial dan grouping aduan per RT untuk halaman /dashboard/admin/stats
 */
export const getAdminDeepStatsData = cache(async (): Promise<AdminDeepStatsData | null> => {
  try {
    const [statusCounts, rtCounts, total, mappedComplaintsRaw] = await Promise.all([
      prisma.complaint.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      prisma.complaint.groupBy({
        by: ['rt'],
        _count: { _all: true },
        orderBy: { rt: 'asc' },
      }),
      prisma.complaint.count(),
      prisma.complaint.findMany({
        where: {
          latitude: { not: null },
          longitude: { not: null },
        },
        select: {
          id: true,
          title: true,
          latitude: true,
          longitude: true,
          status: true,
          rt: true,
          rw: true,
          isUrgent: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 500,
      }),
    ])

    const maxRTCount = Math.max(...rtCounts.map(r => r._count._all), 1)
    const mappedComplaints = mappedComplaintsRaw.map(c => ({
      ...c,
      latitude: c.latitude!,
      longitude: c.longitude!,
    }))

    return {
      statusCounts: statusCounts as { status: Status; _count: { _all: number } }[],
      rtCounts,
      total,
      mappedComplaints,
      maxRTCount,
    }
  } catch (err) {
    console.error('[DAL getAdminDeepStatsData] Error:', err)
    return null
  }
})
