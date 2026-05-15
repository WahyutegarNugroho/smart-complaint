import { redirect } from 'next/navigation'
import { getCachedProfile } from '@/lib/profile'
import prisma from '@/lib/prisma'
import AdminDashboard from '@/components/dashboard/AdminDashboard'
import PetugasDashboard from '@/components/dashboard/PetugasDashboard'
import MasyarakatDashboardLayout from '@/components/dashboard/MasyarakatDashboardLayout'
import StatsSection from '@/components/dashboard/sections/StatsSection'
import AnnouncementsSection from '@/components/dashboard/sections/AnnouncementsSection'
import ComplaintListSection from '@/components/dashboard/sections/ComplaintListSection'
import { Suspense } from 'react'
import SectionSkeleton from '@/components/dashboard/sections/SectionSkeleton'
import { Status } from '@prisma/client'

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
  const params = await searchParams
  const { status: rawStatus, message: successMessage } = params

  const data = await getCachedProfile()
  if (!data) redirect('/login')
  const { profile } = data

  const isAdmin = profile.role === 'ADMIN'
  const isPetugas = profile.role === 'PETUGAS'
  const isWarga = profile.role === 'MASYARAKAT'

  // 🛡️ Admin & Petugas views
  if (isAdmin || isPetugas) {
    const { q: searchQuery, rt, rw, page } = params
    const currentPage = Number(page) || 1
    const pageSize = 12

    // Security: Non-admin/petugas cannot filter by RT/RW (already handled by isAdmin/isPetugas check)
    const rtFilter = rt
    const rwFilter = rw

    // 📊 Optimized Stats
    const [stats, topRTData] = await Promise.all([
      (async () => {
        const [total, pending, processing, urgent, completed, totalUsers, verifiedUsers, unverifiedUsers] = await Promise.all([
          prisma.complaint.count(),
          prisma.complaint.count({ where: { status: 'PENDING' } }),
          prisma.complaint.count({ where: { status: 'PROCESSING' } }),
          prisma.complaint.count({ where: { isUrgent: true, status: { not: 'COMPLETED' } } }),
          prisma.complaint.count({ where: { status: 'COMPLETED' } }),
          isAdmin ? prisma.profile.count() : Promise.resolve(0),
          isAdmin ? prisma.profile.count({ where: { isVerified: true } }) : Promise.resolve(0),
          isAdmin ? prisma.profile.count({ where: { isVerified: false, role: 'MASYARAKAT' } }) : Promise.resolve(0)
        ])
        return { total, pending, processing, urgent, completed, totalUsers, verifiedUsers, unverifiedUsers }
      })(),
      prisma.complaint.groupBy({
        by: ['rt'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1
      })
    ])

    const topRT = topRTData.length > 0 && topRTData[0].rt ? `RT ${topRTData[0].rt}` : '-'
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

    // 🔍 Complaint Fetching with Pagination
    const whereClause: { status?: Status; title?: { contains: string; mode: 'insensitive' }; rt?: string; rw?: string } = {}
    if (rawStatus) whereClause.status = rawStatus as Status
    if (searchQuery) whereClause.title = { contains: searchQuery, mode: 'insensitive' }
    if (rtFilter) whereClause.rt = rtFilter
    if (rwFilter) whereClause.rw = rwFilter

    const [complaints, totalComplaints] = await Promise.all([
      prisma.complaint.findMany({
        where: whereClause,
        orderBy: [{ isUrgent: 'desc' }, { createdAt: 'desc' }],
        include: { author: true },
        take: pageSize,
        skip: (currentPage - 1) * pageSize
      }),
      prisma.complaint.count({ where: whereClause })
    ])

    const totalPages = Math.ceil(totalComplaints / pageSize)

    // 📉 Chart Data
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const rawChartData = await prisma.complaint.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    })

    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const dateStr = d.toLocaleDateString()
      const count = rawChartData.filter(c => new Date(c.createdAt).toLocaleDateString() === dateStr).length
      return { day: days[d.getDay()], count }
    })
    const maxChart = Math.max(...chartData.map(d => d.count), 1)

    // Recent Activities (Admin Only)
    let recentActivities: { type: string; title: string; user: string; time: Date }[] = []
    if (isAdmin && !rawStatus) {
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

    if (isAdmin) {
      return (
        <AdminDashboard 
          profile={profile}
          stats={stats}
          complaints={complaints}
          currentStatus={rawStatus}
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

    return (
      <PetugasDashboard 
        profile={profile}
        stats={stats}
        complaints={complaints}
        currentStatus={rawStatus}
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

  if (isWarga) {
    return (
      <MasyarakatDashboardLayout profile={profile} successMessage={successMessage}>
        {!rawStatus && (
          <Suspense fallback={<SectionSkeleton type="stats" />}>
            <StatsSection profileId={profile.id} isWarga={true} />
          </Suspense>
        )}

        {!rawStatus && (
          <Suspense fallback={<SectionSkeleton type="announcements" />}>
            <AnnouncementsSection />
          </Suspense>
        )}

        <Suspense fallback={<SectionSkeleton type="list" />}>
          <ComplaintListSection 
            profileId={profile.id} 
            isWarga={true} 
            searchParams={params} 
          />
        </Suspense>
      </MasyarakatDashboardLayout>
    )
  }

  return redirect('/login')
}
