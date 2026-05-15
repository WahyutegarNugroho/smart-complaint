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
import SessionErrorState from '@/components/dashboard/SessionErrorState'
import SectionSkeleton from '@/components/dashboard/sections/SectionSkeleton'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
  
  // Only redirect if explicitly unauthenticated
  if (data.status === 'UNAUTHENTICATED') return redirect('/login')
  
  // Handle database error status gracefully
  if (data.status === 'ERROR' || !data.profile) {
    return <SessionErrorState />
  }

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
