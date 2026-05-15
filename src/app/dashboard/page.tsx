import { redirect } from 'next/navigation'
import { getCachedProfile } from '@/lib/profile'
import AdminDashboardLayout from '@/components/dashboard/AdminDashboardLayout'
import PetugasDashboardLayout from '@/components/dashboard/PetugasDashboardLayout'
import MasyarakatDashboardLayout from '@/components/dashboard/MasyarakatDashboardLayout'
import AdminStatsSection from '@/components/dashboard/sections/AdminStatsSection'
import AdminAnalyticsSection from '@/components/dashboard/sections/AdminAnalyticsSection'
import PetugasStatsSection from '@/components/dashboard/sections/PetugasStatsSection'
import StatsSection from '@/components/dashboard/sections/StatsSection'
import AnnouncementsSection from '@/components/dashboard/sections/AnnouncementsSection'
import ComplaintListSection from '@/components/dashboard/sections/ComplaintListSection'
import { Suspense } from 'react'
import SectionSkeleton from '@/components/dashboard/sections/SectionSkeleton'

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

  if (isAdmin) {
    return (
      <AdminDashboardLayout profile={profile} successMessage={successMessage}>
        {!rawStatus && (
          <>
            <Suspense fallback={<SectionSkeleton type="stats" />}>
              <AdminStatsSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton type="stats" />}>
              <AdminAnalyticsSection />
            </Suspense>
          </>
        )}
        <Suspense fallback={<SectionSkeleton type="list" />}>
          <ComplaintListSection profileId={profile.id} isWarga={false} searchParams={params} />
        </Suspense>
      </AdminDashboardLayout>
    )
  }

  if (isPetugas) {
    return (
      <PetugasDashboardLayout profile={profile} successMessage={successMessage}>
        {!rawStatus && (
          <Suspense fallback={<SectionSkeleton type="stats" />}>
            <PetugasStatsSection />
          </Suspense>
        )}
        <Suspense fallback={<SectionSkeleton type="list" />}>
          <ComplaintListSection profileId={profile.id} isWarga={false} searchParams={params} />
        </Suspense>
      </PetugasDashboardLayout>
    )
  }

  if (isWarga) {
    try {
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
    } catch (err) {
      console.error('Citizen Dashboard Render Error:', err)
      return redirect('/login?error=session_expired')
    }
  }

  return redirect('/login')
}
