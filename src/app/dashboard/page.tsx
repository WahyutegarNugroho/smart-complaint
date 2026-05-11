import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import AdminDashboard from '@/components/dashboard/AdminDashboard'
import PetugasDashboard from '@/components/dashboard/PetugasDashboard'
import MasyarakatDashboard from '@/components/dashboard/MasyarakatDashboard'

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ 
    status?: string, 
    message?: string,
    q?: string, 
    rt?: string, 
    rw?: string,
    page?: string 
  }>
}) {
  const { status: rawStatus, message: successMessage, q: searchQuery, rt, rw, page } = await searchParams
  const currentPage = Number(page) || 1
  const pageSize = 12

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: { 
      complaints: { orderBy: { createdAt: 'desc' } },
      notifications: {
        where: { isRead: false },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  // 🔍 Second check: If userId doesn't match, check by username (email)
  if (!profile && user.email) {
    profile = await prisma.profile.findFirst({
      where: { username: user.email },
      include: { 
        complaints: { orderBy: { createdAt: 'desc' } },
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    // If found by username but userId is different, update the userId
    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: { userId: user.id },
        include: { 
          complaints: { orderBy: { createdAt: 'desc' } },
          notifications: {
            where: { isRead: false },
            orderBy: { createdAt: 'desc' }
          }
        }
      })
    }
  }

  // 🔄 Auto-create profile if still missing
  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        userId: user.id,
        username: user.email || `user_${user.id.slice(0, 8)}`,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        role: 'MASYARAKAT'
      },
      include: { 
        complaints: { orderBy: { createdAt: 'desc' } },
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  }

  const isAdmin = profile.role === 'ADMIN'
  const isPetugas = profile.role === 'PETUGAS'
  const isWarga = profile.role === 'MASYARAKAT'
  const currentStatus = rawStatus

  // 🛡️ Security: Non-admin/petugas cannot filter by RT/RW
  const rtFilter = (isAdmin || isPetugas) ? rt : undefined
  const rwFilter = (isAdmin || isPetugas) ? rw : undefined

  // 📊 Optimized Stats
  const stats = {
    total: isWarga 
      ? await prisma.complaint.count({ where: { authorId: profile.id } })
      : await prisma.complaint.count(),
    pending: isWarga
      ? await prisma.complaint.count({ where: { authorId: profile.id, status: 'PENDING' } })
      : await prisma.complaint.count({ where: { status: 'PENDING' } }),
    processing: isWarga
      ? profile.complaints.filter(c => c.status === 'PROCESSING').length
      : await prisma.complaint.count({ where: { status: 'PROCESSING' } }),
    urgent: isWarga
      ? profile.complaints.filter(c => c.isUrgent).length
      : await prisma.complaint.count({ where: { isUrgent: true, status: { not: 'COMPLETED' } } }),
    completed: isWarga 
      ? profile.complaints.filter(c => c.status === 'COMPLETED').length 
      : await prisma.complaint.count({ where: { status: 'COMPLETED' } }),
    totalUsers: isAdmin ? await prisma.profile.count() : 0,
    verifiedUsers: isAdmin ? await (prisma.profile as any).count({ where: { isVerified: true } }) : 0,
    unverifiedUsers: isAdmin ? await (prisma.profile as any).count({ where: { isVerified: false, role: 'MASYARAKAT' } }) : 0
  }

  // Fetch Top RT (Hotspot)
  let topRT = '-'
  if (isAdmin || isPetugas) {
    const grouped = await prisma.complaint.groupBy({
      by: ['rt'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 1
    })
    if (grouped.length > 0 && grouped[0].rt) topRT = `RT ${grouped[0].rt}`
  }

  // Fetch Announcements
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3
  })

  // 🔍 Optimized Complaint Fetching with Pagination
  const whereClause: any = {}
  if (currentStatus) whereClause.status = currentStatus
  if (searchQuery) whereClause.title = { contains: searchQuery, mode: 'insensitive' }
  if (rtFilter) whereClause.rt = rtFilter
  if (rwFilter) whereClause.rw = rwFilter
  if (isWarga) whereClause.authorId = profile.id

  const [complaints, totalComplaints] = await Promise.all([
    prisma.complaint.findMany({
      where: whereClause,
      orderBy: [{ isUrgent: 'desc' }, { createdAt: 'desc' }],
      include: { author: !isWarga },
      take: pageSize,
      skip: (currentPage - 1) * pageSize
    }),
    prisma.complaint.count({ where: whereClause })
  ])

  const totalPages = Math.ceil(totalComplaints / pageSize)
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  // 📉 Optimized Chart Data
  let chartData: { day: string, count: number }[] = []
  if (!isWarga) {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const rawChartData = await prisma.complaint.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    })

    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const dateStr = d.toLocaleDateString()
      const count = rawChartData.filter(c => new Date(c.createdAt).toLocaleDateString() === dateStr).length
      return { day: days[d.getDay()], count }
    })
  }

  // Fetch Recent Activities (Admin Only)
  let recentActivities: any[] = []
  if (isAdmin && !currentStatus) {
    const [recentComplaints, recentUsers, recentAnnouncements] = await Promise.all([
      prisma.complaint.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { author: true } }),
      prisma.profile.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
      prisma.announcement.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
    ])

    recentActivities = [
      ...recentComplaints.map(c => ({ type: 'COMPLAINT', title: c.title, user: c.author.name, time: c.createdAt })),
      ...recentUsers.map(u => ({ type: 'USER', title: `User Baru: ${u.name}`, user: u.role, time: u.createdAt })),
      ...recentAnnouncements.map(a => ({ type: 'ANNOUNCEMENT', title: a.title, user: 'Admin', time: a.createdAt }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10)
  }

  const maxChart = Math.max(...chartData.map(d => d.count), 1)

  // 📦 Role-Based Component Selection
  if (isAdmin) {
    return (
      <AdminDashboard 
        profile={profile}
        stats={stats}
        complaints={complaints}
        currentStatus={currentStatus}
        searchQuery={searchQuery}
        rtFilter={rtFilter}
        rwFilter={rwFilter}
        currentPage={currentPage}
        totalPages={totalPages}
        chartData={chartData}
        maxChart={maxChart}
        completionRate={completionRate}
        topRT={topRT}
        recentActivities={recentActivities}
        successMessage={successMessage}
      />
    )
  }

  if (isPetugas) {
    return (
      <PetugasDashboard 
        profile={profile}
        stats={stats}
        complaints={complaints}
        currentStatus={currentStatus}
        searchQuery={searchQuery}
        rtFilter={rtFilter}
        rwFilter={rwFilter}
        currentPage={currentPage}
        totalPages={totalPages}
        chartData={chartData}
        maxChart={maxChart}
        completionRate={completionRate}
        topRT={topRT}
        successMessage={successMessage}
      />
    )
  }

  // Default: Masyarakat (Warga)
  return (
    <MasyarakatDashboard 
      profile={profile}
      announcements={announcements}
      stats={stats}
      complaints={complaints}
      currentStatus={currentStatus}
      searchQuery={searchQuery}
      currentPage={currentPage}
      totalPages={totalPages}
      successMessage={successMessage}
    />
  )
}
